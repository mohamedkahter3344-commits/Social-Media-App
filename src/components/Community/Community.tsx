import AllPosts from "./AllPosts";
import Sidebar from "../sidebar/Sidebar";
import SuggestedFriends from "../SuggestedFriends/SuggestedFriends";

const Community = () => {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <Sidebar />
      <AllPosts />
       <SuggestedFriends/>
    </div>
  );
};

export default Community;

