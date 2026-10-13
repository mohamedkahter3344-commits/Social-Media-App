import { Link } from "react-router-dom";
import type { SinglePost } from "../../interfaces/posts";
import { ArrowLeft } from "@gravity-ui/icons";
import PostComments from "./PostComments";
import { useEffect, useState } from "react";
import DeletePost from "../DeletePost/DeletePost";
import DeleteComment from "../DeleteComment/DeleteComment";
import LikesPost from "../LikesPost/LikesPost";
import AddSavePost from "../AddSavePost/AddSavePost";
import LikeUnLikePosts from "../Like.UnLikePosts/Like.UnLikePosts";

function formatTimeAgo(date: string | Date, now = Date.now()) {
  const createdAt = new Date(date).getTime();

  if (Number.isNaN(createdAt)) return "";

  const diff = Math.max(0, now - createdAt);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: days >= 365 ? "numeric" : undefined,
  });
}

const Post = ({ post, path }: { post: SinglePost; path: string }) => {
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [isSaved, setIsSaved] = useState(
    () => localStorage.getItem(`saved_post_${post._id}`) === "true",
  );

  const isPostDetailsPage = path?.startsWith("/post");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsSaved(localStorage.getItem(`saved_post_${post._id}`) === "true");
  }, [post._id]);

  return (
    <>
      {isPostDetailsPage && (
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          <ArrowLeft fontSize={16} />
          Back to feed
        </Link>
      )}

      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="px-4 pt-4">
          <div className="flex items-start gap-3">
            <Link to={`/profile/${post.user._id}`} className="shrink-0">
              <img
                alt={post.user.name}
                src={post.user.photo}
                className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                to={`/profile/${post.user._id}`}
                className="block truncate text-[15px] font-semibold text-slate-900 hover:underline"
              >
                {post.user.name}
              </Link>

              <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                <span>{post.user.username}</span>
                <span>·</span>

                <span
                  title={
                    post.createdAt
                      ? new Date(post.createdAt).toLocaleString()
                      : undefined
                  }
                >
                  {post.createdAt
                    ? formatTimeAgo(post.createdAt, currentTime)
                    : ""}
                </span>

                <span>·</span>

                <span className="inline-flex items-center gap-1">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
                  </svg>

                  {post.privacy
                    ? post.privacy.charAt(0).toUpperCase() +
                      post.privacy.slice(1)
                    : ""}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <DeletePost
                idPost={post._id}
                idUser={post.user._id}
                postBody={post.body ?? ""}
              />
            </div>
          </div>

          {/* Saved badge */}
          {isSaved && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
              </svg>
              Saved
            </div>
          )}

          {/* Post text */}
          {post.body && (
            <p className="whitespace-pre-wrap break-words py-3 text-[15px] leading-6 text-slate-800">
              {post.body}
            </p>
          )}
        </div>

        {/* Shared post */}
        {post.isShare && post.sharedPost && (
          <div className="mx-4 mb-3 overflow-hidden rounded-xl border border-slate-200">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <img
                  alt={post.sharedPost.user.name}
                  src={post.sharedPost.user.photo}
                  className="h-9 w-9 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {post.sharedPost.user.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    @{post.sharedPost.user.username}
                  </p>
                </div>

                <Link
                  to={`/post/${post.sharedPost._id}`}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Original post
                </Link>
              </div>

              {post.sharedPost.body && (
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                  {post.sharedPost.body}
                </p>
              )}
            </div>

            {post.sharedPost.image && (
              <img
                alt="Shared post"
                src={post.sharedPost.image}
                className="max-h-[500px] w-full border-t border-slate-200 object-cover"
              />
            )}
          </div>
        )}

        {/* Post image */}
        {post.image && (
          <div className="border-y border-slate-100">
            <img
              alt="Post"
              src={post.image}
              className="max-h-[600px] w-full object-contain"
            />
          </div>
        )}

        {/* Counts */}
        <div className="mx-4 flex items-center justify-between gap-3 border-b border-slate-200 py-3 text-xs text-slate-500 sm:text-sm">
          <button
            type="button"
            onClick={() => setShowLikes(true)}
            disabled={(post.likesCount ?? 0) === 0}
            className="flex items-center gap-1.5 hover:underline disabled:cursor-default"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3 6 6 0 0 1 12 5.09 6 6 0 0 1 16.5 3 5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.51Z" />
              </svg>
            </span>

            <span>{post.likesCount ?? 0}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowComments(true)}
              className="hover:underline"
            >
              {post.commentsCount ?? 0} comments
            </button>

            <span>{post.sharesCount ?? 0} shares</span>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`grid gap-1 p-1.5 ${
            isPostDetailsPage ? "grid-cols-4" : "grid-cols-5"
          }`}
        >
          <LikeUnLikePosts postId={post._id} />

          <button
            type="button"
            onClick={() => setShowComments(true)}
            className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 sm:gap-2 sm:text-sm"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
            </svg>

            <span className="truncate">Comment</span>
          </button>

          <button
            type="button"
            className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 sm:gap-2 sm:text-sm"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
            </svg>

            <span className="truncate">Share</span>
          </button>

          {/* View details: only in the feed */}
          {!isPostDetailsPage && (
            <Link
              to={`/post/${post._id}`}
              className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#1877f2] sm:gap-2 sm:text-sm"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>

              <span className="truncate">View details</span>
            </Link>
          )}

          <AddSavePost postId={post._id} />
        </div>

        {/* Comments */}
        {showComments ? (
          <PostComments id={post._id} />
        ) : (
          post.topComment && (
            <div className="border-t border-slate-100 px-4 py-3">
              <p className="mb-2 text-xs font-semibold text-slate-500">
                Top comment
              </p>

              <div className="flex items-start gap-2">
                <Link
                  to={`/profile/${post.topComment.commentCreator._id}`}
                  className="shrink-0"
                >
                  <img
                    alt={post.topComment.commentCreator.name}
                    src={post.topComment.commentCreator.photo}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-900">
                    {post.topComment.commentCreator.name}
                  </p>

                  {post.topComment.content && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">
                      {post.topComment.content}
                    </p>
                  )}

                  {post.topComment.image && (
                    <img
                      alt="Comment attachment"
                      src={post.topComment.image}
                      className="mt-2 max-h-44 rounded-lg object-cover"
                    />
                  )}
                </div>

                <DeleteComment
                  idPost={post._id}
                  idComment={post.topComment._id}
                  idUser={post.topComment.commentCreator._id}
                  commentContent={post.topComment.content ?? ""}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowComments(true)}
                className="ml-10 mt-2 text-xs font-semibold text-blue-600 hover:underline"
              >
                View all comments
              </button>
            </div>
          )
        )}

        {/* Likes modal */}
        {showLikes && (
          <LikesPost
            postId={post._id}
            likesCount={post.likesCount}
            onClose={() => setShowLikes(false)}
          />
        )}
      </article>
    </>
  );
};

export default Post;
