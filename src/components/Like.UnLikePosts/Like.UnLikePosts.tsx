
import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

interface LikeUnLikePostsProps {
  postId: string;
}

const LikeUnLikePosts = ({ postId }: LikeUnLikePostsProps) => {
  const queryClient = useQueryClient();
  const storageKey = `liked_post_${postId}`;

  const [isLiked, setIsLiked] = useState(
    () => localStorage.getItem(storageKey) === "true"
  );

  useEffect(() => {
    setIsLiked(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("user_token");

      if (!token) {
        throw new Error("Please log in first.");
      }

      const response = await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },

    onSuccess: async (data) => {
      const nextState = !isLiked;

      setIsLiked(nextState);
      localStorage.setItem(storageKey, String(nextState));

      // Refresh post data, including the likes count.
      await queryClient.invalidateQueries();

      toast.success(data?.message || "Like updated successfully");
    },

    onError: (error) => {
      toast.danger(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to update like"
          : error instanceof Error
            ? error.message
            : "Something went wrong"
      );
    },
  });

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => mutate()}
      aria-pressed={isLiked}
      className={`flex min-w-0 w-full items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-xs font-semibold transition-colors sm:gap-2 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
        isLiked
          ? "text-[#1877f2]"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
        <path d="M7 10v12" />
      </svg>

      <span className="truncate">
        {isPending ? "Loading..." : isLiked ? "Liked" : "Like"}
      </span>
    </button>
  );
};

export default LikeUnLikePosts;
