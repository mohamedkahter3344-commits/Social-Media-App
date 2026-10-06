import AllPosts from "./AllPosts";
import Sidebar from "../sidebar/Sidebar";

const Community = () => {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <Sidebar />
      <AllPosts />
    </div>
  );
};

export default Community;