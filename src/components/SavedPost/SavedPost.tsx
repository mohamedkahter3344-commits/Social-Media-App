import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import Post from "../Community/Posts";

export type SavedPostItem = {
  _id?: string;
  id?: string;
  content?: string;
  body?: string;
  image?: string;
  createdAt?: string;
  user?: {
    name?: string;
    username?: string;
    photo?: string;
  };
};

type SavedPostsResponse = {
  success: boolean;
  message: string;
  data: {
    bookmarks: SavedPostItem[];
  };
};

// بقت برا الكومبوننت و export عشان الـ Profile يستخدمها
export async function getSavedPost(): Promise<SavedPostsResponse> {
  const response = await axios.get<SavedPostsResponse>(
    "https://route-posts.routemisr.com/users/bookmarks",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    },
  );

  return response.data;
}

const SavedPost = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPost,
  });

  const bookmarks = data?.data?.bookmarks ?? [];

  // Loading
  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-4xl space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded bg-slate-100" />
        </div>

        {[1, 2].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-24 rounded bg-slate-100" />
              </div>
            </div>

            <div className="mt-5 h-4 w-full rounded bg-slate-100" />
            <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-4 h-52 rounded-xl bg-slate-200" />
          </div>
        ))}
      </section>
    );
  }

  // Error
  if (isError) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : "Something went wrong while loading your saved posts.";

    return (
      <section className="mx-auto flex min-h-[350px] w-full max-w-4xl items-center justify-center">
        <div className="w-full rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
            !
          </div>

          <h2 className="mt-4 text-xl font-black text-slate-900">
            Couldn't load saved posts
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {message}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-6 rounded-xl bg-[#1877f2] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1668d8] disabled:opacity-60"
          >
            {isFetching ? "Retrying..." : "Try again"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className=" w-full  space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1877f2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 4.75A2.75 2.75 0 0 1 8.75 2h6.5A2.75 2.75 0 0 1 18 4.75V22l-6-4-6 4z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Saved Posts
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Your favorite posts, all in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[#1877f2]">
          <span>{bookmarks.length}</span>
          <span>{bookmarks.length === 1 ? "Post" : "Posts"}</span>
        </div>
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 && (
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#1877f2]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4.75A2.75 2.75 0 0 1 8.75 2h6.5A2.75 2.75 0 0 1 18 4.75V22l-6-4-6 4z" />
            </svg>
          </div>

          <h2 className="mt-6 text-xl font-black text-slate-900">
            No saved posts yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Posts you save will appear here. Explore your feed and save the
            posts you want to come back to later.
          </p>

          <Link
            to="/feed"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1877f2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1668d8]"
          >
            Explore feed
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {/* Saved Posts */}
      {bookmarks.map((item: any) => {
        const post = item.post ?? item;
        return <Post key={post._id ?? post.id} post={post} path="" />;
      })}
    </section>
  );
};

export default SavedPost;
