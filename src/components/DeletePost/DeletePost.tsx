
import { useState } from "react";
import { EllipsisVertical, Pencil, TrashBin } from "@gravity-ui/icons";
import {
  Button,
  Dropdown,
  Label,
  toast,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import UpdatePost from "../UpdatePost/UpdatePost";

interface DeletePostProps {
  idUser: string;
  idPost: string;
  postBody: string;
}

const DeletePost = ({
  idPost,
  idUser,
  postBody,
}: DeletePostProps) => {
  const [showEdit, setShowEdit] = useState(false);

  const token = localStorage.getItem("user_token");

  let user = "";

  try {
    if (token) {
      const decoded = jwtDecode<{ user?: string; id?: string }>(token);
      user = decoded.user || decoded.id || "";
    }
  } catch {
    user = "";
  }

  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: deletePost,

    onSuccess: (data: any) => {
      toast.success(data?.data?.message || "Post deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post", idPost] });
      queryClient.invalidateQueries({ queryKey: ["profile", idUser] });
      queryClient.invalidateQueries({ queryKey: ["feedPosts"], });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"], });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.danger(
          error.response?.data?.message || "Failed to delete post"
        );
      } else {
        toast.danger("Something went wrong");
      }
    },
  });

  function deletePost() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${idPost}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  function handleDelete() {
    mutate();
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
                <Dropdown.Item
                  id="edit-post"
                  textValue="Edit Post"
                  onAction={() => setShowEdit(true)}
                >
                  <div className="flex h-8 items-center justify-center pt-px">
                    <Pencil className="size-4 shrink-0 text-muted" />
                  </div>

                  <div className="flex flex-col">
                    <Label>Edit Post</Label>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  id="delete-post"
                  textValue="Delete Post"
                  variant="danger"
                  isDisabled={isPending}
                  onAction={handleDelete}
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
                      {isPending ? "Deleting..." : "Delete Post"}
                    </Label>
                  </div>
                </Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      )}

      {showEdit && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowEdit(false)}
        >
          <div
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <UpdatePost
              postId={idPost}
              initialBody={postBody}
              onClose={() => setShowEdit(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePost;
