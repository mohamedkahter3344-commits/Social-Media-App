import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-full px-3 md:w-1/4 md:px-0 md:mx-5 h-fit space-y-3 xl:sticky xl:top-21 xl:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {/* Feed */}
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition ${
              isActive
                ? "text-[#1877f2] bg-[#e7f3ff]"
                : "text-slate-700 hover:bg-slate-100"
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18h-5" />
            <path d="M18 14h-8" />
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
            <rect width="8" height="4" x="10" y="6" rx="1" />
          </svg>
          My Feed
        </NavLink>

        {/* My Posts */}
        <NavLink
          to="/my-posts"
          className={({ isActive }) =>
            `mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold ${isActive ? "text-[#1877f2] bg-[#e7f3ff]" : "text-slate-700 hover:bg-slate-100"} transition ${isActive ? "text-[#1877f2] bg-[#e7f3ff]" : "text-slate-700 hover:bg-slate-100"}  `
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
            <path d="M20 2v4" />
            <path d="M22 4h-4" />
            <circle cx="4" cy="20" r="2" />
          </svg>
          My Posts
        </NavLink>

        {/* Community */}
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold ${isActive ? "text-[#1877f2] bg-[#e7f3ff]" : "text-slate-700 hover:bg-slate-100"} transition ${isActive ? "text-[#1877f2] bg-[#e7f3ff]" : "text-slate-700 hover:bg-slate-100"}  `
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
            <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
            <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          Community
        </NavLink>

        {/* Saved */}
        <NavLink
          to="/saved"
          className={({ isActive }) =>
            `mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold ${isActive ? "text-[#1877f2] bg-[#e7f3ff]" : "text-slate-700 hover:bg-slate-100"} transition ${isActive ? "text-[#1877f2] bg-[#e7f3ff]" : "text-slate-700 hover:bg-slate-100"}  `
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
          </svg>
          Saved
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
