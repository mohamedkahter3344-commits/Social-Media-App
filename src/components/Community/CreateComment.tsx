import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../../Context/TokenContext";
import { Link } from "react-router-dom";

const CreateComment = ({ id }: { id: string }) => {
  const {dataUser} = useAuth()
  const [image, setImage] = useState<string | null>(null);
  const [img, setImg] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const commentContent = useRef<HTMLTextAreaElement>(null);
  const commentImage = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  function handleEmojiClick(emojiData: { emoji: string }) {
    setContent((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  }

  const { isPending, mutate } = useMutation({
    mutationFn: handleCommentPost,

    onSuccess: (data) => {
      toast.success(data.data.message);

      queryClient.invalidateQueries({
        queryKey: ["postComments", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["post", id],
      });

      // Reset
      setImage(null);
      setImg(null);
      setContent("");

      if (commentContent.current) {
        commentContent.current.value = "";
      }

      if (commentImage.current) {
        commentImage.current.value = "";
      }
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        toast.danger(error.response?.data.message);
      } else {
        toast.danger("Something went wrong");
      }
    },
  });

  function handleCommentPost() {
    const formData = new FormData();

    const content = commentContent.current?.value.trim();

    if (content) {
      formData.append("content", content);
    }

    if (img) {
      formData.append("image", img);
    }

    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      },
    );
  }

  function handleImageChange() {
    const file = commentImage.current?.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImage(url);
    setImg(file);
  }

  function removeImage() {
    setImage(null);
    setImg(null);

    if (commentImage.current) {
      commentImage.current.value = "";
    }
  }

  function handleSubmit() {
    const content = commentContent.current?.value.trim();

    if (!content && !img) return;

    mutate();
  }

  const isDisabled = (!content.trim() && !img) || isPending;

  return (
    <div className="m-3">
      <div className="flex items-start gap-2">
        <Link to={`/profile/${dataUser?._id}`}>
        
        
        <img
          alt={dataUser?.name}
          className="h-9 w-9 rounded-full object-cover"
          src={dataUser?.photo}
        />
        </Link>

        <div className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white">
          <textarea
            ref={commentContent}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Comment as ${dataUser?.name}...`}
            rows={1}
            className="max-h-[140px] min-h-[40px] w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-5 outline-none placeholder:text-slate-500"
          />

          {/* Preview Image */}
          {image && (
            <div className="relative mt-2 w-fit">
              <img
                src={image}
                alt="Preview"
                className="max-h-40 max-w-[220px] rounded-xl object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
              >
                ✕
              </button>
            </div>
          )}

          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Image */}
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
                  ref={commentImage}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  type="file"
                />
              </label>

              {/* Emoji */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmoji((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-amber-500"
                >
                  🙂
                </button>

                {showEmoji && (
                  <div className="absolute bottom-12 left-0 z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
            </div>

            {/* Send */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff]"
            >
              {isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                  <path d="M6 12h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
