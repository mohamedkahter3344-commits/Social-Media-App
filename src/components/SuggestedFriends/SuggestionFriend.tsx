
import { Link } from "react-router-dom";
import type { Friend } from "../../interfaces/suggestionFriend";
import FollowUnFollowUser from "../Follow&UnFollowUser/Follow&UnFollowUser";

const SuggestionFriend = ({friend}:{friend:Friend}) => {
  return (
    <div className="rounded-xl border border-slate-200 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <Link
        to={`/profile/${friend._id}`}
          type="button"
          className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-slate-50"
        >
          <img
            alt={friend.name}
            className="h-10 w-10 rounded-full object-cover"
            src={friend.photo}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 hover:underline">
              {friend.name}
            </p>
            <p className="truncate text-xs text-slate-500">@{friend.username}</p>
          </div>
        </Link>
        <FollowUnFollowUser userId = {friend._id}/>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-0.5">
          {friend.followersCount} followers
        </span>
      </div>
    </div>
  );
};

export default SuggestionFriend;
