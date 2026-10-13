import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Check,
  CheckCheck,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
} from "lucide-react";

import type { Notification } from "../../interfaces/notification";

type FilterType = "all" | "unread";

const Notifications = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotification,
  });

  async function getNotification() {
    const token = localStorage.getItem("user_token");

    if (!token) {
      throw new Error("Please log in to view notifications.");
    }

    return axios.get(
      "https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const notifications: Notification[] = data?.data?.data?.notifications ?? [];

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }

    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  function getNotificationMessage(type: string) {
    const normalizedType = type.toLowerCase();

    if (normalizedType.includes("like")) {
      return "liked your post";
    }

    if (normalizedType.includes("comment")) {
      return "commented on your post";
    }

    if (normalizedType.includes("share")) {
      return "shared your post";
    }

    if (normalizedType.includes("follow")) {
      return "started following you";
    }

    return "interacted with you";
  }

  function getNotificationIcon(type: string) {
    const normalizedType = type.toLowerCase();

    if (normalizedType.includes("like")) {
      return <Heart size={15} />;
    }

    if (normalizedType.includes("share")) {
      return <Repeat2 size={15} />;
    }

    if (normalizedType.includes("follow")) {
      return <UserPlus size={15} />;
    }

    return <MessageCircle size={15} />;
  }

  function getRelativeTime(createdAt: string) {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
          {/* Header */}
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Realtime updates for likes, comments, shares, and follows.
                </p>
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <CheckCheck size={15} />
                {isFetching ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  filter === "all"
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All
                <span className="ml-1.5">{notifications.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  filter === "unread"
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Unread
                {unreadCount > 0 && <span>{unreadCount}</span>}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-2 p-3 sm:p-4">
            {/* Loading */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse gap-3 rounded-xl border border-slate-200 p-4"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />

                    <div className="flex-1 space-y-3 pt-1">
                      <div className="h-3 w-2/3 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="py-8 text-center">
                <p className="font-bold text-red-500">
                  Failed to load notifications
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {axios.isAxiosError(error)
                    ? error.response?.data?.message ||
                      "Please check your connection and try again."
                    : error instanceof Error
                      ? error.message
                      : "Something went wrong."}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-4 rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && filteredNotifications.length === 0 && (
              <div className="py-10 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <BellIcon />
                </div>

                <h3 className="font-bold text-slate-800">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "Your notifications will appear here."}
                </p>
              </div>
            )}

            {/* Notification cards */}
            {!isLoading &&
              !isError &&
              filteredNotifications.map((notification: Notification) => (
                <article
                  key={notification._id}
                  className={`group relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 ${
                    notification.isRead
                      ? "border-slate-200 bg-white hover:bg-slate-50"
                      : "border-blue-100 bg-blue-50/40 hover:bg-blue-50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <button type="button" className="block cursor-pointer">
                      <img
                        alt={notification.actor?.name ?? "User"}
                        className="h-11 w-11 rounded-full object-cover"
                        src={notification.actor?.photo || "/default-avatar.png"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </button>

                    <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#1877f2] ring-2 ring-white">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
                      <p className="text-sm leading-6 text-slate-800">
                        <button
                          type="button"
                          className="font-extrabold hover:text-[#1877f2] hover:underline"
                        >
                          {notification.actor?.name ?? "Someone"}
                        </button>{" "}
                        {getNotificationMessage(notification.type)}
                      </p>

                      <span className="shrink-0 text-xs font-semibold text-slate-500">
                        {getRelativeTime(notification.createdAt)}
                      </span>
                    </div>

                    {(notification.entity?.content ||
                      notification.entity?.body) && (
                      <p className="mt-0.5 break-words text-sm text-slate-600">
                        {notification.entity.content ||
                          notification.entity.body}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          notification.isRead
                            ? "text-emerald-600"
                            : "text-[#1877f2]"
                        }`}
                      >
                        {notification.isRead ? (
                          <>
                            <Check size={13} />
                            Read
                          </>
                        ) : (
                          <>
                            <CheckCheck size={13} />
                            Unread
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};

function BellIcon() {
  return <MessageCircle size={25} />;
}

export default Notifications;
