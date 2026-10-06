import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import Posts from './Posts';
import type {  SinglePost } from '../../interfaces/posts';

const AllPosts = () => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['posts'],
        queryFn: getAllPosts,
    })

    console.log(data);
    

    function getAllPosts() {
        return axios.get("https://route-posts.routemisr.com/posts",{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("user_token")}`
            }
        })
    }
  return (
    <>
    <div className="w-full px-3 py-2 md:w-[50%] md:px-0">

     {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-xl bg-white shadow-sm"
              ></div>
            ))}
          </div>
        ) : data?.data?.data.posts.length === 0 && isError ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            No posts available
          </div>
        ) : (
          <div className="space-y-5">
            {data?.data?.data.posts.map((post: SinglePost ) => (
              <Posts key={post._id} post={post} path="/community" />
            ))}
          </div>
        )}
    </div>
    </>
  )
}

export default AllPosts
