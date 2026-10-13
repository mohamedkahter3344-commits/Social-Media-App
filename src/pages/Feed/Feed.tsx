import Sidebar from "../../components/sidebar/Sidebar";
import SuggestedFriends from "../../components/SuggestedFriends/SuggestedFriends";
import CreatePost from "../CreatePost/CreatePost";
import FeedPosts from "../FeedPosts/FeedPosts";
const Feed = () => {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <Sidebar />
      <div className="w-full md:w-1/2">
        <CreatePost />
        <FeedPosts />
      </div>
      <SuggestedFriends />
    </div>
  );
};
export default Feed;
