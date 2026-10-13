import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface AddSavePostProps {
  postId: string;
}

const AddSavePost = ({ postId }: AddSavePostProps) => {
  const queryClient = useQueryClient();
  const storageKey = `saved_post_${postId}`;

  const [isSaved, setIsSaved] = useState(
    () => localStorage.getItem(storageKey) === "true"
  );

  async function toggleBookmark() {
    const token = localStorage.getItem("user_token");

    if (!token) {
      throw new Error("Please log in first.");
    }

    const response = await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: toggleBookmark,

    onSuccess: async (data) => {
      // Toggle the current state after the API request succeeds
      setIsSaved((previous) => {
        const nextState = !previous;
        localStorage.setItem(storageKey, String(nextState));
        return nextState;
      });

      toast.success(data?.message || "Bookmark updated successfully");

      await queryClient.invalidateQueries();
    },

    onError: (error) => {
      toast.danger(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to update bookmark"
          : error instanceof Error
            ? error.message
            : "Something went wrong"
      );
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutate()}
      disabled={isPending}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove saved post" : "Save post"}
      className={`flex min-w-0 w-full cursor-pointer items-center justify-center gap-1 rounded-md px-1 py-2.5 text-xs font-semibold transition-colors sm:gap-2 sm:px-2 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
        isSaved
          ? "text-[#1877f2] hover:bg-blue-50"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
      </svg>

      <span className="truncate">
        {isPending ? "Saving..." : isSaved ? "Saved" : "Save"}
      </span>
    </button>
  );
};

export default AddSavePost;