import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import GetUserPosts from "../../components/GetUserPosts/GetUserPosts";
import type { UserProfile } from "../../interfaces/profile";
import { useRef, useState } from "react";
import { toast } from "@heroui/react";
import { useParams } from "react-router-dom";
import FollowUnFollowUser from "../../components/Follow&UnFollowUser/Follow&UnFollowUser";
import { jwtDecode } from "jwt-decode";
import SavedPost, { getSavedPost } from "../../components/SavedPost/SavedPost";

const Profile = () => {
  // =========================================================
  // Get User ID From URL
  // =========================================================

  const { id } = useParams();
  const { user }: { user: string } = jwtDecode(
    localStorage.getItem("user_token") || "",
  );

  const isMyProfile = id === user;

  // =========================================================
  // States
  // =========================================================

  const [postsCount, setPostsCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  // الصورة المؤقتة للـ preview
  const [image, setImage] = useState<string | null>(null);

  // ref للـ input
  const profileImage = useRef<HTMLInputElement>(null);

  // React Query Client
  const queryClient = useQueryClient();

  // =========================================================
  // Upload Profile Photo
  // =========================================================

  const { isPending, mutate } = useMutation({
    mutationFn: handleProfileImage,

    onSuccess: (data) => {
      toast.success(data.data.message);

      // تحديث بيانات الـ profile الحالي
      queryClient.invalidateQueries({
        queryKey: ["profile", id],
      });

      setImage(null);

      if (profileImage.current) {
        profileImage.current.value = "";
      }
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        toast.danger(
          error.response?.data?.message || "Failed to upload profile photo",
        );
      } else {
        toast.danger("Something went wrong");
      }
    },
  });

  // =========================================================
  // Upload Image To API
  // =========================================================

  function handleProfileImage(file: File) {
    const formData = new FormData();

    formData.append("photo", file);

    return axios.put(
      "https://route-posts.routemisr.com/users/upload-photo",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      },
    );
  }

  // =========================================================
  // When User Selects Image
  // =========================================================

  function handleImageChange() {
    const file = profileImage.current?.files?.[0];

    if (!file) return;

    // Preview
    const url = URL.createObjectURL(file);

    setImage(url);

    // Upload
    mutate(file);
  }

  // =========================================================
  // Get User Profile
  // =========================================================

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", id],

    queryFn: () => getUserProfile(id!),

    enabled: !!id,
  });

  // =========================================================
  // Get Profile From API
  // =========================================================

  function getUserProfile(userId: string) {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      },
    );
  }

  // =========================================================
  // Saved Posts (نفس الـ queryKey بتاع SavedPost فبيشاركوا الكاش)
  // لازم يكون قبل أي return مشروط
  // =========================================================

  const { data: savedData } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPost,
    enabled: isMyProfile,
  });

  // =========================================================
  // User Profile
  // =========================================================

  const dataUser: UserProfile | undefined = data?.data?.data?.user;

  // =========================================================
  // Loading
  // =========================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1877f2]" />
      </div>
    );
  }

  // =========================================================
  // Error
  // =========================================================

  if (isError || !dataUser) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="font-bold text-red-500">Failed to load profile</p>
      </div>
    );
  }

  // =========================================================
  // Derived Values (بعد الـ Loading والـ Error عشان dataUser يكون موجود)
  // =========================================================

  // عدد البوستات المحفوظة: من الـ array الفعلي لو ده بروفايلي، وإلا من الـ API
  const savedCount: number = isMyProfile
    ? (savedData?.data?.bookmarks?.length ?? dataUser.bookmarksCount ?? 0)
    : (dataUser.bookmarksCount ?? 0);

  // لو فتحت بروفايل حد تاني، تاب Saved مش بيظهر فنرجع لتاب Posts
  const currentTab = isMyProfile ? activeTab : "posts";

  const rawData = data?.data?.data;
  const rawUser = dataUser as any;

  const isFollowingUser: boolean = Boolean(
    rawData?.isFollowing ??
    rawUser.isFollowing ??
    rawUser.followers?.some((f: any) => (f?._id ?? f) === user),
  );

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-w-0">
      <div className="space-y-5 sm:space-y-6">
        {/* =====================================================
            Profile Header
        ===================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
          {/* Cover */}
          <div className="group/cover relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]" />

            <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/8 blur-3xl" />

            <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl" />

            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

            {/* Add Cover */}
            <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[90%] flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100">
              <label className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                Add cover
                <input accept="image/*" className="hidden" type="file" />
              </label>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
            <div className="rounded-3xl border border-white/60 bg-white/92 p-5 backdrop-blur-xl sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                {/* User Info */}
                <div className="min-w-0">
                  <div className="flex items-end gap-4">
                    {/* Profile Image */}
                    <div className="group/avatar relative shrink-0">
                      <button
                        type="button"
                        className="cursor-zoom-in rounded-full"
                      >
                        <img
                          alt={dataUser.name}
                          src={image || dataUser.photo}
                          className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                        />
                      </button>

                      {/* Upload Button */}

                      <label
                        className={`absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100 ${
                          isPending
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>

                        <input
                          ref={profileImage}
                          accept="image/*"
                          className="hidden"
                          type="file"
                          onChange={handleImageChange}
                          disabled={isPending}
                        />
                      </label>
                    </div>

                    {/* Name */}

                    <div className="min-w-0 pb-1">
                      <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        {dataUser.name}
                      </h2>

                      <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                        @{dataUser.username}
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                        Route Posts member
                      </div>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}

                {!isMyProfile && id && (
                  <FollowUnFollowUser
                    key={id}
                    userId={id}
                    initialFollowing={isFollowingUser}
                  />
                )}

                {/* Stats */}

                <div className="grid w-full grid-cols-3 gap-2 lg:w-[520px]">
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                      Followers
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                      {dataUser.followersCount}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                      Following
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                      {dataUser.followingCount}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                      Bookmarks
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                      {savedCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* About */}

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-extrabold text-slate-800">
                    About
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>{dataUser.email}</p>

                    <p>Active on Route Posts</p>
                  </div>
                </div>

                {/* Posts Stats */}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                      My posts
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {postsCount}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                      Saved posts
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {savedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            Posts Section
        ===================================================== */}

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
              {/* My Posts */}

              <button
                onClick={() => setActiveTab("posts")}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                  currentTab === "posts"
                    ? "bg-white text-[#1877f2] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                My Posts
              </button>

              {/* Saved */}

              {isMyProfile && (
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                    currentTab === "saved"
                      ? "bg-white text-[#1877f2] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Saved
                </button>
              )}
            </div>

            <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">
              {currentTab === "posts" ? postsCount : savedCount}
            </span>
          </div>

          {/* Tab Content */}

          <div className="space-y-3">
            {currentTab === "posts" && id && (
              <GetUserPosts userId={id} onPostsCountChange={setPostsCount} />
            )}

            {currentTab === "saved" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 ">
                <SavedPost />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;