
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import ReplyForm from "../ReplayForm/ReplyForm.tsx";

type CommentsRepliesProps = {
  postId: string;
  commentId: string;
  commentContent?: string;
};

type Reply = {
  _id: string;
  content?: string;
  image?: string;
  likes?: string[];
  createdAt?: string;
  commentCreator?: {
    _id?: string;
    name?: string;
    username?: string;
    photo?: string;
  };
  replyCreator?: {
    _id?: string;
    name?: string;
    username?: string;
    photo?: string;
  };
};

const CommentsReplies = ({
  postId,
  commentId,
  commentContent = "",
}: CommentsRepliesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["commentReply", postId, commentId],
    queryFn: async () => {
      const response = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );

      return response.data;
    },
    enabled: isOpen,
  });

  
  const replies: Reply[] =
    data?.data?.replies ??
    data?.data?.data?.replies ??
    data?.replies ??
    [];

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className="text-xs font-bold text-slate-500 transition hover:text-[#1877f2] hover:underline"
      >
        {isOpen ? "Hide replies" : "Reply"}
        {isOpen && replies.length > 0 && ` (${replies.length})`}
      </button>

      {isOpen && (
        <div className="relative mt-2 ml-1 border-l border-slate-300 pl-3 sm:ml-5 sm:pl-4">
          {isLoading ? (
            <div className="flex items-center gap-2 py-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#1877f2]" />
              <p className="text-xs text-slate-500">Loading replies...</p>
            </div>
          ) : isError ? (
            <p className="py-2 text-xs text-red-500">
              Failed to load replies. Please try again.
            </p>
          ) : (
            <div className="space-y-3">
              {replies.length === 0 ? (
                <p className="py-2 text-xs text-slate-500">
                  No replies yet. Be the first to reply!
                </p>
              ) : (
                replies.map((reply) => {
                  const creator =
                    reply.replyCreator ?? reply.commentCreator;

                  return (
                    <div
                      key={reply._id}
                      className="relative flex items-start gap-2"
                    >
                      <img
                        alt={creator?.name || "User"}
                        src={
                          creator?.photo ||
                          "https://ui-avatars.com/api/?name=User"
                        }
                        className="h-6 w-6 shrink-0 rounded-full object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="inline-block max-w-full rounded-2xl bg-[#f0f2f5] px-2.5 py-2">
                          <p className="text-[11px] font-bold text-slate-900">
                            {creator?.name || "Unknown User"}
                          </p>

                          {reply.createdAt && (
                            <p className="text-[11px] text-slate-500">
                              {new Date(reply.createdAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          )}

                          {reply.content && (
                            <p className="mt-0.5 whitespace-pre-wrap break-words text-xs text-slate-700">
                              {reply.content}
                            </p>
                          )}

                          {reply.image && (
                            <img
                              src={reply.image}
                              alt="Reply attachment"
                              className="mt-2 max-h-48 rounded-xl object-cover"
                            />
                          )}

                          <div className="mt-1.5 flex items-center justify-between px-1">
                            <button
                              type="button"
                              className="text-[11px] font-semibold text-slate-500 hover:underline"
                            >
                              Like ({reply.likes?.length ?? 0})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <div className="mt-3">
            <p className="mb-1 text-[11px] font-semibold text-slate-500">
              Replying to {commentContent || "this comment"}
            </p>

            <ReplyForm
              postId={postId}
              commentId={commentId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsReplies;
