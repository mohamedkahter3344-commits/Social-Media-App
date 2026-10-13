import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Comment } from "../../interfaces/comments";
import CreateComment from "./CreateComment";
import DeleteComment from "../DeleteComment/DeleteComment";
import CommentsReplies from "../CommentsReplies/CommentsReplies";

const PostComments = ({ id }: { id: string }) => {
  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["postComments", id],
    queryFn: getPostComments,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#1877f2]" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="border-t border-slate-200 px-4 py-5 text-center text-sm text-red-500">
        Failed to load comments. Please try again.
      </p>
    );
  }

  const comments: Comment[] = data?.data?.data?.comments ?? [];

  return (
    <>
      {/* Comments List */}
      <div className="border-t border-slate-200 px-4 pt-4">
        {comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="group mb-4 flex items-start gap-2"
            >
              {/* Avatar */}
              <img
                alt={comment.commentCreator.name || "User"}
                src={
                  comment.commentCreator.photo ||
                  "https://ui-avatars.com/api/?name=User"
                }
                className="mt-0.5 h-9 w-9 shrink-0 rounded-full object-cover"
              />

              {/* Comment Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  {/* Comment Bubble */}
                  <div className="min-w-0 flex-1 rounded-2xl bg-[#f0f2f5] px-3 py-2">
                    <p className="text-[13px] font-bold text-slate-900">
                      {comment.commentCreator.name || "Unknown User"}
                    </p>

                    {comment.commentCreator.username && (
                      <p className="text-[11px] text-slate-500">
                        @{comment.commentCreator.username}
                      </p>
                    )}

                    {comment.content && (
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">
                        {comment.content}
                      </p>
                    )}

                    {comment.image && (
                      <img
                        alt="Comment attachment"
                        src={comment.image}
                        className="mt-2 max-h-60 max-w-full rounded-xl object-cover"
                      />
                    )}
                  </div>

                  {/* Delete Comment */}
                  <div className="shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <DeleteComment
                      idPost={id}
                      idComment={comment._id}
                      idUser={comment.commentCreator._id}
                      commentContent={comment.content ?? ""}
                    />
                  </div>
                </div>

                {/* Comment Actions */}
                <div className="mt-1 flex items-center gap-4 px-2">
                  <button
                    type="button"
                    className="text-xs font-bold text-slate-500 transition hover:text-[#1877f2] hover:underline"
                  >
                    Like ({comment.likes?.length ?? 0})
                  </button>

                  <CommentsReplies
                    postId={id}
                    commentId={comment._id}
                    commentContent={comment.content}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Comment */}
      <div className="border-t border-slate-200 px-4 py-3">
        <CreateComment id={id} />
      </div>
    </>
  );
};

export default PostComments;
