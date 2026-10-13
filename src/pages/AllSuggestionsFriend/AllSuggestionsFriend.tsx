import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Search,  Users } from "lucide-react";
import { Link } from "react-router-dom";

import type { Friend } from "../../interfaces/suggestionFriend";
import FollowUnFollowUser from "../../components/Follow&UnFollowUser/Follow&UnFollowUser";

const LIMIT = 10;

export default function AllSuggestionsFriend() {
  const [search, setSearch] = useState("");

  // =========================
  // API
  // =========================

  const getSuggestions = async ({ pageParam }: { pageParam: number }) => {
    const response = await axios.get(
      `https://route-posts.routemisr.com/users/suggestions?page=${pageParam}&limit=${LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      },
    );

    return response.data;
  };

  // =========================
  // React Query
  // =========================

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allSuggestionsFriend"],

    queryFn: getSuggestions,

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.pagination?.nextPage ?? undefined;
    },
  });

  // =========================
  // Combine all pages
  // =========================

  const suggestions: Friend[] =
    data?.pages.flatMap((page) => page?.data?.suggestions ?? []) ?? [];

  // =========================
  // Total number
  // =========================

  const total = data?.pages[0]?.meta?.pagination?.total ?? 0;

  // =========================
  // Search
  // =========================

  const filteredSuggestions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return suggestions;
    }

    return suggestions.filter((friend) => {
      return (
        friend.name.toLowerCase().includes(searchValue) ||
        friend.username.toLowerCase().includes(searchValue)
      );
    });
  }, [suggestions, search]);

  // =========================
  // Loading
  // =========================

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-bold text-slate-500">
                Loading suggestions...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-bold text-red-500">
                Failed to load suggestions.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Back to Feed */}
          <Link
            to="/feed"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to feed
          </Link>

          {/* Main Card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users
                  className="h-[18px] w-[18px] text-[#1877f2]"
                  aria-hidden="true"
                />

                <h1 className="text-xl font-extrabold text-slate-900">
                  All Suggested Friends
                </h1>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                
                {total}
              </span>
            </div>

            {/* Search */}
            <label className="relative mb-4 block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <input
                type="text"
                placeholder="Search by name or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#1877f2] focus:bg-white"
              />
            </label>

            {/* Friends Grid */}
            {filteredSuggestions.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredSuggestions.map((friend) => (
                  <article
                    key={friend._id}
                    className="rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* User Info */}
                      <Link to={`/profile/${friend._id}`}
                        type="button"
                        className="flex min-w-0 items-center gap-3 rounded-lg px-1 py-1 text-left transition hover:bg-slate-50"
                      >
                        <img
                          src={friend.photo}
                          alt={friend.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 hover:underline">
                            {friend.name}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            @{friend.username}
                          </p>
                        </div>
                      </Link>

                      {/* Follow Button */}
                     <FollowUnFollowUser userId = {friend._id}/>
                    </div>

                    {/* Followers */}
                    <div className="mt-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                        {friend.followersCount} followers
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
                <p className="text-sm font-bold text-slate-600">
                  No suggested friends found
                </p>
              </div>
            )}

            {/* View More */}
            {hasNextPage && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetchingNextPage ? "Loading..." : "View more"}
              </button>
            )}

            {/* End */}
            {!hasNextPage && suggestions.length > 0 && (
              <p className="mt-4 text-center text-xs font-semibold text-slate-400">
                No more suggestions
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
