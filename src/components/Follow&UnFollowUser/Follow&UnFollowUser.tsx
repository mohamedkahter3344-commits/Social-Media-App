import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type FollowUnFollowUserProps = {
  userId: string;
  initialFollowing?: boolean;
};

const FollowUnFollowUser = ({
  userId,
  initialFollowing = false,
}: FollowUnFollowUserProps) => {
  const queryClient = useQueryClient();

  // الحالة الأولية جاية من الـ Profile
  const [follow, setFollow] = useState(initialFollowing);

  function followPeople() {
    return axios.put(
      `https://route-posts.routemisr.com/users/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: followPeople,

    onSuccess: (response) => {
      const isNowFollowing: boolean = response.data.data.following;

      // الـ API بيرجع الحالة الجديدة (toggle)
      setFollow(isNowFollowing);

      queryClient.invalidateQueries({ queryKey: ["feedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["suggestionfriends"] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["allSuggestionsFriend"], });

      toast.success(
        response.data.message ||
          (isNowFollowing ? "Followed successfully" : "Unfollowed successfully"),
      );
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.danger(error.response?.data?.message || "Something went wrong");
      } else {
        toast.danger("Something went wrong");
      }
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutate()}
      disabled={isPending}
      className="inline-flex items-center gap-1 rounded-full bg-[#e7f3ff] px-3 py-1.5 text-xs font-bold text-[#1877f2] transition hover:bg-[#d8ebff] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span>{isPending ? "..." : follow ? "−" : "+"}</span>
      {isPending ? "Loading..." : follow ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowUnFollowUser;