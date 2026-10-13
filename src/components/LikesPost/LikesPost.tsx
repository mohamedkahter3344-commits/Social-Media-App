
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

interface Like {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

interface LikesPostProps {
  postId: string;
  onClose: () => void;
  likesCount?: number;
}

const LikesPost = ({
  postId,
  onClose,
  likesCount,
}: LikesPostProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["LikePosts", postId],
    queryFn: async () => {
      const response = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/likes?page=1&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        },
      );

      return response.data?.data?.likes ?? [];
    },
    enabled: likesCount !== 0,
  });

  if (likesCount === 0) return null;

  const likes: Like[] = Array.isArray(data) ? data : [];

  if (!isLoading && !isError && likes.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[71] flex items-center justify-center
      bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="People who reacted"
        className="w-full max-w-[500px] overflow-hidden rounded-2xl
        bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b
        border-slate-200 px-4 py-3">
          <h4 className="text-base font-bold text-slate-900">
            People who reacted
          </h4>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center
            rounded-full bg-slate-100 text-lg text-slate-600
            transition hover:bg-slate-200"
          >
            ×
          </button>
        </div>

        {/* Facebook-style Skeleton */}
        {isLoading && (
          <div className="space-y-4 px-4 py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3"
              >
                <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/5 rounded-full bg-slate-200" />
                  <div className="h-3 w-1/4 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              Couldn't load reactions.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-semibold text-blue-600
              hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Users */}
        {!isLoading && !isError && likes.length > 0 && (
          <div className="max-h-[420px] overflow-y-auto p-2">
            {likes.map((like) => (
              <Link
                to={`/profile/${like._id}`}
                key={like._id}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2
                transition hover:bg-slate-100"
              >
                <img
                  alt={like.name}
                  src={like.photo}
                  className="h-11 w-11 shrink-0 rounded-full
                  bg-slate-100 object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {like.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    @{like.username}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikesPost;
