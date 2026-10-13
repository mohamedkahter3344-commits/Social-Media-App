
import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../../Context/TokenContext";
import { Link } from "react-router-dom";

const CreatePost = () => {
  const {dataUser} = useAuth()
  const [image, setImage] = useState<string | null>(null);
  const [img, setImg] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const postBody = useRef<HTMLTextAreaElement>(null);
  const postImage = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  function handleEmojiClick(emojiData: { emoji: string }) {
    const textarea = postBody.current;

    if (!textarea) {
      setContent((prev) => prev + emojiData.emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newContent =
      content.slice(0, start) +
      emojiData.emoji +
      content.slice(end);

    setContent(newContent);

    setShowEmoji(false);

    
    setTimeout(() => {
      textarea.focus();

      const newCursorPosition =
        start + emojiData.emoji.length;

      textarea.setSelectionRange(
        newCursorPosition,
        newCursorPosition,
      );
    }, 0);
  }

  const { isPending, mutate } = useMutation({
    mutationFn: handleCreatePost,

    onSuccess: (data) => {
      toast.success(data.data.message);

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["feedPosts"],
      });

      

      queryClient.invalidateQueries({
        queryKey: ["userPosts"],
      });
      queryClient.invalidateQueries({
         queryKey: ["profile"],
      });

      // Reset
      setContent("");
      setImage(null);
      setImg(null);
      setShowEmoji(false);

      if (postBody.current) {
        postBody.current.value = "";
      }

      if (postImage.current) {
        postImage.current.value = "";
      }
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        toast.danger(error.response?.data?.message);
      } else {
        toast.danger("Something went wrong");
      }
    },
  });

  function handleCreatePost() {
    const formData = new FormData();

    const body = postBody.current?.value.trim();

    if (body) {
      formData.append("body", body);
    }

    if (img) {
      formData.append("image", img);
    }

    return axios.post(
      "https://route-posts.routemisr.com/posts",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "user_token",
          )}`,
        },
      },
    );
  }

  function handleImageChange() {
    const file = postImage.current?.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImage(url);
    setImg(file);
  }

  function removeImage() {
    setImage(null);
    setImg(null);

    if (postImage.current) {
      postImage.current.value = "";
    }
  }

  function handleSubmit() {
    const body = postBody.current?.value.trim();

    if (!body && !img) return;

    mutate();
  }

  const isDisabled =
    (!content.trim() && !img) || isPending;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-2">
      {/* User Info */}
      <div className="mb-3 flex items-start gap-3">
        <Link to={`/profile/${dataUser?._id}`}>
        
        
        <img
          alt={dataUser?.name}
          className="h-11 w-11 rounded-full object-cover"
          src={dataUser?.photo}
        />
        </Link>

        <div className="flex-1">
          <p className="text-base font-extrabold text-slate-900">
            {dataUser?.name}
          </p>

          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
              <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
              <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
              <circle cx="12" cy="12" r="10" />
            </svg>

            <select
              className="bg-transparent outline-none"
              defaultValue="public"
            >
              <option value="public">Public</option>
              <option value="following">Followers</option>
              <option value="only_me">Only me</option>
            </select>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="relative">
        <textarea
          ref={postBody}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="What's on your mind, Mohamed?"
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
        />
      </div>

      {/* Image Preview */}
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

      {/* Bottom Actions */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
        <div className="flex items-center gap-2">
          {/* Image */}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-600"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>

            <span className="hidden sm:inline">
              Photo/video
            </span>

            <input
              ref={postImage}
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
              onClick={() =>
                setShowEmoji((prev) => !prev)
              }
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              <span className="text-lg">🙂</span>

              <span className="hidden sm:inline">
                Feeling/activity
              </span>
            </button>

            {showEmoji && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  height={350}
                  width={300}
                />
              </div>
            )}
          </div>
        </div>

        {/* Send */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#1877f2] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff]"
        >
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Posting...
            </>
          ) : (
            <>
              Post

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
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

