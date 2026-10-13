import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../Context/TokenContext";

type ReplyFormProps = {
  postId: string;
  commentId: string;
};

const ReplyForm = ({ postId, commentId }: ReplyFormProps) => {
    const {dataUser} = useAuth()
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("user_token");

      if (!token) {
        throw new Error("Please log in first.");
      }

      const formData = new FormData();
      formData.append("content", content.trim());

      if (image) {
        formData.append("image", image);
      }

      return axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      setContent("");
      setImage(null);

      queryClient.invalidateQueries({
        queryKey: ["commentReply", postId, commentId],
      });

      queryClient.invalidateQueries({
        queryKey: ["postComments", postId],
      });
    },
  });

  const canSend = content.trim().length > 0 && !replyMutation.isPending;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (canSend) {
          replyMutation.mutate();
        }
      }}
      className="flex items-start gap-2"
    >
      <img
        alt="Your profile"
        src={dataUser?.photo}
        className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover"
      />

      <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 transition focus-within:border-[#c7dafc] focus-within:bg-white">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a reply..."
          rows={1}
          disabled={replyMutation.isPending}
          className="max-h-[120px] min-h-[38px] w-full resize-y bg-transparent px-2 py-1 text-xs leading-5 outline-none placeholder:text-slate-500"
        />

        {image && (
          <div className="mb-2 flex items-center gap-2 px-2">
            <span className="max-w-[180px] truncate text-xs text-slate-500">
              {image.name}
            </span>

            <button
              type="button"
              onClick={() => setImage(null)}
              className="text-xs font-semibold text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <label
              title="Attach image"
              className="inline-flex cursor-pointer items-center justify-center rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  setImage(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSend}
            title="Send reply"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff]"
          >
            {replyMutation.isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3.714 3.048-.683.627 2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                <path d="M6 12h16" />
              </svg>
            )}
          </button>
        </div>

        {replyMutation.isError && (
          <p className="mt-2 text-xs text-red-500">
            {axios.isAxiosError(replyMutation.error)
              ? replyMutation.error.response?.data?.message ||
                "Failed to send reply. Please try again."
              : "Failed to send reply. Please try again."}
          </p>
        )}
      </div>
    </form>
  );
};

export default ReplyForm;
