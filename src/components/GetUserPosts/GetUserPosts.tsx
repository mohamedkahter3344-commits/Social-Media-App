import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Post from "../Community/Posts";
import { useEffect } from "react";


interface GetUserPostsProps {
  userId: string;
  onPostsCountChange?: (count: number) => void;
}

const GetUserPosts = ({ userId, onPostsCountChange }: GetUserPostsProps) => {
  

  const token = localStorage.getItem("user_token");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userPosts", userId],

    queryFn: async () => {
      const response = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response;
    },

    enabled: !!userId && !!token,
  });

  const posts = data?.data?.data?.posts ?? [];

  useEffect(() => {
    onPostsCountChange?.(posts.length);
  }, [posts.length, onPostsCountChange]);

  if (isLoading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl bg-white p-5 shadow-sm"
          >
            <div className="h-11 w-11 rounded-full bg-slate-200" />
            <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
            <div className="mt-3 h-20 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-bold text-red-700">Failed to load user posts</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="font-bold text-slate-600">This user has no posts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post: any) => (
        <Post key={post.id} post={post} path="" />
      ))}
    </div>
  );
};

export default GetUserPosts;
