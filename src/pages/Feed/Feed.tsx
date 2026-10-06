import Sidebar from "../../components/sidebar/Sidebar";
import MyFeed from "../myFeed/MyFeed";

const Feed = () => {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <Sidebar />
      <MyFeed />
    </div>
  );
};

export default Feed;
