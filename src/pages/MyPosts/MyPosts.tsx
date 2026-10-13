
import Sidebar from "../../components/sidebar/Sidebar";
import CreatePost from "../CreatePost/CreatePost";
import GetUserPosts from "../../components/GetUserPosts/GetUserPosts";
import SuggestedFriends from "../../components/SuggestedFriends/SuggestedFriends";
import { useAuth } from "../../Context/TokenContext";

const MyPosts = () => {
  const {dataUser} = useAuth()
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <Sidebar />
      <div className="w-full md:w-1/2">
        <CreatePost />
        {dataUser?._id && <GetUserPosts userId={dataUser._id} />}
      </div>
      <SuggestedFriends />
    </div>
  );
};

export default MyPosts;
