import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SuggestionFriend from "./SuggestionFriend";
import type { Friend } from "../../interfaces/suggestionFriend";
import { Link } from "react-router-dom";

const getFollowSuggestion = () => {
  return axios.get(
    "https://route-posts.routemisr.com/users/suggestions?limit=10",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    },
  );
};

const SuggestedFriends = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["suggestionfriends"],
    queryFn: getFollowSuggestion,
  });
  

  if (isLoading) {
    return (
      <aside className="hidden h-fit xl:sticky xl:top-21 xl:block">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Header Skeleton */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-200" />
              <div className="h-5 w-32 animate-pulse rounded-md bg-slate-200" />
            </div>

            <div className="h-5 w-6 animate-pulse rounded-full bg-slate-200" />
          </div>

          {/* Search Skeleton */}
          <div className="mb-4 h-9 w-full animate-pulse rounded-xl bg-slate-100" />

          {/* Friends Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 p-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200" />

                    <div className="space-y-1.5">
                      <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>

                  <div className="h-7 w-16 shrink-0 animate-pulse rounded-full bg-slate-100" />
                </div>

                <div className="mt-2">
                  <div className="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>

          {/* View More Skeleton */}
          <div className="mt-3 h-9 w-full animate-pulse rounded-xl bg-slate-100" />
        </div>
      </aside>
    );
  }

  if (isError) {
    return (
      <aside className="hidden h-fit xl:sticky xl:top-21 xl:block">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
            {/* Error Icon */}
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            </div>

            <h3 className="text-sm font-extrabold text-slate-900">
              Couldn't load suggestions
            </h3>

            <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-500">
              Something went wrong while loading suggested friends.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-[#1877f2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#166fe5] active:scale-95"
            >
              Try again
            </button>
          </div>
        </div>
      </aside>
    );
  }

  const suggestions: Friend[] = data?.data?.data?.suggestions ?? [];

  return (
    <aside className="hidden h-fit xl:sticky xl:top-21 xl:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#1877f2]"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <path d="M16 3.128a4 4 0 0 1 0 7.744" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <circle cx="9" cy="7" r="4" />
            </svg>

            <h3 className="text-base font-extrabold text-slate-900">
              Suggested Friends
            </h3>
          </div>

          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
            {suggestions.slice(0,5).length}
          </span>
        </div>

        {/* Search */}
        <div className="mb-3">
          <label className="relative block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>

            <input
              type="text"
              placeholder="Search friends..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white"
            />
          </label>
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          {suggestions.slice(0,5).map((friend) => (
            <SuggestionFriend key={friend._id} friend={friend} />
          ))}
        </div>

        {/* View More */}
        <Link
        to="/suggestions"
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          View more
        </Link>
      </div>
    </aside>
  );
};

export default SuggestedFriends;
// AllSuggestionsFriend