import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import Post from "../../components/Community/Posts";

const PostDetails = () => {
  const { id } = useParams();

  const {pathname} = useLocation();

  console.log(pathname);
  

  console.log(id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: getSinglePost,
  });

  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    });
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-screen">
          <p>Error fetching post details</p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-2xl px-4 py-6">
          <Post post={data?.data?.data?.post} path={pathname} />
        </div>
      )}
    </>
  );
};

export default PostDetails;
