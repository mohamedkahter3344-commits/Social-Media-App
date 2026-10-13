import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type FormCommentProps = {
  postId: string;
  commentId: string;
  initialContent?: string;
  onClose: () => void;
};

const FormComment = ({
  postId,
  commentId,
  initialContent = "",
  onClose,
}: FormCommentProps) => {
  const [content, setContent] = useState(initialContent ?? "");
  const queryClient = useQueryClient();

  useEffect(() => {
    setContent(initialContent ?? "");
  }, [initialContent]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("user_token");

      if (!token) {
        throw new Error("Please log in first.");
      }

      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        { content: content.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["postComments", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        }),
      ]);

      onClose();
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !content.trim() ||
      content.trim() === (initialContent ?? "").trim() ||
      updateMutation.isPending
    ) {
      return;
    }

    updateMutation.mutate();
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Edit comment</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="rounded-full px-3 py-1 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your comment..."
          rows={4}
          disabled={updateMutation.isPending}
          className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-blue-100"
        />

        {updateMutation.isError && (
          <p className="text-sm text-red-500">
            {axios.isAxiosError(updateMutation.error)
              ? updateMutation.error.response?.data?.message ||
                "Failed to update comment. Please try again."
              : updateMutation.error.message ||
                "Failed to update comment. Please try again."}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              !content.trim() ||
              content.trim() === (initialContent ?? "").trim() ||
              updateMutation.isPending
            }
            className="rounded-xl bg-[#1877f2] px-5 py-2 text-sm font-semibold text-white hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComment;
