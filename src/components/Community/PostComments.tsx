import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Comment } from "../../interfaces/comments";
import CreateComment from "./CreateComment";

const PostComments = ({ id }: { id: string }) => {
  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["postComments", id],
    queryFn: getPostComments,
  });

  console.log(data);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-slate-200 border-t-[#1877f2]" />
      </div>
    );
  }

  return (
    <>
      {data?.data?.data?.comments.map((comment: Comment) => (
        <div key={comment._id} className="relative flex items-start gap-2">
          <img
            alt={comment.commentCreator.name || "User"}
            className="mt-0.5 h-8 w-8 rounded-full object-cover"
            src={
              comment.commentCreator.photo ||
              "https://ui-avatars.com/api/?name=User"
            }
          />

          <div className="min-w-0 flex-1">
            <div className="relative inline-block max-w-full rounded-2xl bg-[#f0f2f5] px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {comment.commentCreator.name || "Unknown User"}
                  </p>

                  <p className="text-xs text-slate-500">
                    @{comment.commentCreator.username}.{comment.createdAt}
                  </p>
                </div>
              </div>

              {comment.content && (
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                  {comment.content}
                </p>
              )}

              {comment.image && (
                <img
                  alt="Comment"
                  className="mt-2 max-h-52 w-full rounded-lg object-cover"
                  src={comment.image || "https://ui-avatars.com/api/?name=User"}
                />
              )}
            </div>

            <div className="mt-1.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-400">
                  -40379s
                </span>

                <button className="text-xs font-semibold hover:underline disabled:opacity-60 text-slate-500">
                  Like ({comment.likes.length})
                </button>

                <button className="text-xs font-semibold transition hover:underline disabled:opacity-60 text-slate-500 hover:text-[#1877f2]">
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <CreateComment id = {id}/>
    </>
  );
};

export default PostComments;
