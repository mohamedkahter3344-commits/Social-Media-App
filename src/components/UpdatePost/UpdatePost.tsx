
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdatePostProps {
  postId: string;
  initialBody?: string;
  onClose: () => void;
}

const UpdatePost = ({
  postId,
  initialBody,
  onClose,
}: UpdatePostProps) => {
  const [body, setBody] = useState(initialBody ?? "");
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();

  // Update text if the selected post changes
  useEffect(() => {
    setBody(initialBody ?? "");
  }, [initialBody]);

  async function updatePost() {
    const token = localStorage.getItem("user_token");

    if (!token) {
      throw new Error("You must be logged in to update a post.");
    }

    const formData = new FormData();

    formData.append("body", body.trim());

    if (image) {
      formData.append("image", image);
    }

    const response = await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: updatePost,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
        queryClient.invalidateQueries({ queryKey: ["post", postId] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["feedPosts"], }),
      ]);

      onClose();
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedBody = (body ?? "").trim();

    if (!trimmedBody && !image) {
      return;
    }

    mutate();
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setImage(selectedFile);
    }
  }

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Edit post
        </h3>

        <textarea
          value={body ?? ""}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-blue-500"
        />

        <div>
          <label
            htmlFor="update-post-image"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Change image (optional)
          </label>

          <input
            id="update-post-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-600"
          />

          {image && (
            <p className="mt-2 text-xs text-slate-500">
              Selected: {image.name}
            </p>
          )}
        </div>

        {isError && (
          <p className="text-sm text-red-600">
            {axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to update post."
              : error instanceof Error
                ? error.message
                : "Something went wrong."}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending || (!(body ?? "").trim() && !image)}
            className="rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
