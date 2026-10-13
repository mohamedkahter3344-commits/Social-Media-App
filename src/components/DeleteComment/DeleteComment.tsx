
import { useState } from "react";
import { EllipsisVertical, TrashBin } from "@gravity-ui/icons";
import { Button, Dropdown, Label, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import UpdateComment from "../UpdateComment/UpdateComment";
import FormComment from "../UpdateComment/FormComment";

type DeleteCommentProps = {
  idPost: string;
  idComment: string;
  idUser: string;
  commentContent: string;
};

const DeleteComment = ({
  idPost,
  idComment,
  idUser,
  commentContent,
}: DeleteCommentProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("user_token");

  let user = "";

  try {
    if (token) {
      const decoded = jwtDecode<{ user: string }>(token);
      user = decoded.user;
    }
  } catch {
    user = "";
  }

  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: deleteComment,

    onSuccess: (data) => {
      toast.success(
        data?.data?.message || "Comment deleted successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["postComments", idPost],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.danger(
          error.response?.data?.message || "Failed to delete comment",
        );
      } else {
        toast.danger("Something went wrong");
      }
    },
  });

  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${idPost}/comments/${idComment}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  return (
    <>
      {user === idUser && (
        <Dropdown>
          <Button
            isIconOnly
            aria-label="Menu"
            variant="secondary"
            isDisabled={isPending}
          >
            <EllipsisVertical className="outline-none" />
          </Button>

          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Section>
                <UpdateComment
                  onEdit={() => setIsEditing(true)}
                />

                <Dropdown.Item
                  id="delete-comment"
                  textValue="Delete Comment"
                  variant="danger"
                  isDisabled={isPending}
                  onAction={() => mutate()}
                >
                  <div className="flex h-8 items-center justify-center pt-px">
                    {isPending ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                    ) : (
                      <TrashBin className="size-4 shrink-0 text-danger" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <Label>
                      {isPending
                        ? "Deleting..."
                        : "Delete Comment"}
                    </Label>
                  </div>
                </Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      )}

      {isEditing && (
        <FormComment
          key={idComment}
          postId={idPost}
          commentId={idComment}
          initialContent={commentContent ?? ""}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default DeleteComment;
