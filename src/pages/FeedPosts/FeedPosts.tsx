import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, RefreshCw, Rss, Users } from "lucide-react";
import Post from "../../components/Community/Posts";

const getFeedPosts = async () => {
  const token = localStorage.getItem("user_token");

  if (!token) {
    throw new Error("Please log in to see your feed.");
  }

  return axios.get(
    "https://route-posts.routemisr.com/posts/feed?page=1&limit=10",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

const FeedPosts = () => {
  const token = localStorage.getItem("user_token");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["feedPosts"],
    queryFn: getFeedPosts,
    enabled: Boolean(token),
  });

  const posts = data?.data?.data?.posts ?? [];

  // Login state
  if (!token) {
    return (
      <div className="mx-auto flex min-h-[320px] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#1877f2]">
            <Users size={30} />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900">
            Welcome to your feed
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Log in to discover posts, connect with friends, and join the
            conversation.
          </p>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4" aria-label="Loading feed" aria-busy="true">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />

              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-36 animate-pulse rounded-md bg-slate-200" />
                <div className="h-3 w-24 animate-pulse rounded-md bg-slate-100" />
              </div>

              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
            </div>

            <div className="space-y-2 px-4 pb-4">
              <div className="h-3 w-full animate-pulse rounded-md bg-slate-100" />
              <div className="h-3 w-4/5 animate-pulse rounded-md bg-slate-100" />
            </div>

            <div className="h-48 animate-pulse bg-slate-100 sm:h-64" />

            <div className="space-y-3 p-4">
              <div className="h-3 w-28 animate-pulse rounded-md bg-slate-200" />
              <div className="h-px bg-slate-100" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle size={27} />
        </div>

        <h2 className="text-lg font-extrabold text-slate-900">
          Couldn't load your feed
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Something went wrong while loading posts. Check your connection and
          try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Retrying..." : "Try again"}
        </button>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:px-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#1877f2]">
          <Rss size={30} />
        </div>

        <h2 className="text-xl font-extrabold text-slate-900">
          Your feed is waiting
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          There are no posts to show right now. Follow people and check back
          later to see what's new.
        </p>

        <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
          <Users size={16} className="text-[#1877f2]" />
          Your community updates will appear here.
        </div>
      </div>
    );
  }

  // Feed posts
  return (
    <section className="mx-auto w-full min-w-0 space-y-4 sm:space-y-5">
      {/* Feed heading */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1877f2]">
            <Rss size={22} />
          </div>

          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              News Feed
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Discover what's happening in your community
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Refresh feed"
          title="Refresh feed"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1877f2] disabled:opacity-60"
        >
          <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-4 sm:space-y-5">
        {posts.map((post: any) => (
          <div
            key={post._id ?? post.id}
            className="min-w-0 overflow-hidden rounded-2xl transition-shadow duration-200 hover:shadow-md"
          >
            <Post post={post} path="" />
          </div>
        ))}
      </div>

      {/* End of feed */}
      <p className="py-3 text-center text-xs font-medium text-slate-400">
        You're all caught up!
      </p>
    </section>
  );
};

export default FeedPosts;
