import Sidebar from "../../components/sidebar/Sidebar";
import SavedPost from "../../components/SavedPost/SavedPost";
import SuggestedFriends from "../../components/SuggestedFriends/SuggestedFriends";
import CreatePost from "../CreatePost/CreatePost";

const Saved = () => {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_290px]">
        {/* Left: Sidebar */}
        <aside className="  block">
          <Sidebar />
        </aside>

        {/* Center: Create Post + Saved Posts */}
        <main className="min-w-0 w-full space-y-4">
          <div className="mx-auto w-full max-w-3xl">
            <CreatePost />
          </div>

          <div className="min-w-0 w-full">
            <SavedPost />
          </div>
        </main>

        {/* Right: Suggested Friends */}
        <aside className="hidden xl:block">
          <SuggestedFriends />
        </aside>
      </div>
    </div>
  );
};

export default Saved;
