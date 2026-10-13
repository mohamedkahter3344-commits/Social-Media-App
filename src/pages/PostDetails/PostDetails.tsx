import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Navigate, useLocation,  useParams } from "react-router-dom";
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

  if (isError) {
    return <Navigate to="/community"/>
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )  : (
        <div className="mx-auto w-full max-w-2xl px-4 py-6">
          <Post post={data?.data?.data?.post} path={pathname} />
        </div>
      )}
    </>
  );
};

export default PostDetails;
