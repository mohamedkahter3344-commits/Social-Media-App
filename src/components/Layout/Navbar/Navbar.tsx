
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import RouteLogo from "../../../assets/images/route.png";

import { MdOutlineHome } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Bars } from "@gravity-ui/icons";
import { Button, Dropdown, Header, Label, Separator } from "@heroui/react";
import { CiSettings } from "react-icons/ci";

import { useAuth } from "../../../Context/TokenContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const { isAuthenticated, userToken, logOutContext, dataUser } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  if (location.pathname.startsWith("/auth")) {
    return null;
  }

  function handleLogout() {
    logOutContext();
    navigate("/auth/login");
  }

  const { data } = useQuery({
    queryKey: ["unreadnotifications"],
    queryFn: getUnReadNotifications,
  });

  function getUnReadNotifications() {
    return axios.get(
      "https://route-posts.routemisr.com/notifications/unread-count",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      },
    );
  }

  return (
    <>
      {isAuthenticated && userToken && location.pathname !== "/auth/login" && (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex h-full w-full items-center justify-between px-3 sm:px-5 lg:px-8">
            {/* Logo */}
            <div className="flex min-w-0 items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-slate-100"
              >
                <img
                  src={RouteLogo}
                  alt="Route Logo"
                  className="h-10 w-10 rounded-lg object-cover"
                />

                <h3 className="hidden text-xl font-extrabold tracking-tight text-slate-900 lg:block">
                  Social App
                </h3>
              </Link>
            </div>

            {/* Navigation */}
            <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
              <ul className="flex h-12 items-center gap-1 rounded-xl bg-slate-50 p-1">
                {/* Feed */}
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `group flex min-w-24 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-white text-[#1877f2] shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`
                    }
                  >
                    <MdOutlineHome className="text-[23px]" />
                    <span>Feed</span>
                  </NavLink>
                </li>

                {/* Profile */}
                <li>
                  <NavLink
                    to={`/profile/${dataUser?._id}`}
                    className={({ isActive }) =>
                      `group flex min-w-24 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-white text-[#1877f2] shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`
                    }
                  >
                    <IoPersonOutline className="text-[21px]" />
                    <span>Profile</span>
                  </NavLink>
                </li>

                {/* Notifications */}
                <li>
                  <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                      `group relative flex min-w-32 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-white text-[#1877f2] shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`
                    }
                  >
                    <div className="relative">
                      <IoMdNotificationsOutline className="text-[23px]" />

                      {data?.data?.data?.unreadCount > 0 && (
                        <span className="absolute -right-2.5 -top-2 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-extrabold leading-none text-white shadow-sm">
                          {data?.data?.data.unreadCount > 99
                            ? "99+"
                            : data?.data?.data.unreadCount}
                        </span>
                      )}
                    </div>

                    <span>Notifications</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Mobile navigation */}
            <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
              <ul className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex h-10 w-10 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white text-[#1877f2] shadow-sm"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <MdOutlineHome className="text-2xl" />
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={`/profile/${dataUser?._id}`}
                    className={({ isActive }) =>
                      `flex h-10 w-10 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white text-[#1877f2] shadow-sm"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <IoPersonOutline className="text-xl" />
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                      `relative flex h-10 w-10 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white text-[#1877f2] shadow-sm"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <IoMdNotificationsOutline className="text-2xl" />

                    {data?.data?.data?.unreadCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-extrabold leading-none text-white shadow-sm">
                        {data?.data?.data.unreadCount > 99
                          ? "99+"
                          : data?.data?.data.unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center">
              <Dropdown>
                <div className="flex cursor-pointer items-center gap-2 rounded-full p-1.5 transition hover:bg-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                    <img
                      src={dataUser?.photo}
                      alt={dataUser?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="hidden max-w-32 md:block">
                    <h3 className="truncate text-sm font-bold text-slate-800">
                      {dataUser?.name}
                    </h3>
                  </div>

                  <Button
                    isIconOnly
                    aria-label="Menu"
                    variant="secondary"
                    className="!h-9 !w-9 rounded-full border-0 bg-slate-100"
                  >
                    <Bars className="outline-none" />
                  </Button>
                </div>

                <Dropdown.Popover className="min-w-60">
                  <Dropdown.Menu
                    disabledKeys={["delete-file"]}
                    onAction={(key) => console.log(`Selected: ${key}`)}
                  >
                    <Dropdown.Section>
                      <Header>Actions</Header>

                      <Dropdown.Item>
                        <Link
                          to={`/profile/${dataUser?._id}`}
                          className="flex h-8 items-center gap-3"
                        >
                          <IoPersonOutline className="text-xl" />
                          <Label>Profile</Label>
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item>
                        <Link
                          to="settings"
                          className="flex h-8 items-center gap-3"
                        >
                          <CiSettings className="text-xl" />
                          <Label>Settings</Label>
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Section>

                    <Separator />

                    <Dropdown.Item>
                      <Link
                        onClick={handleLogout}
                        to="/auth"
                        className="flex h-8 items-center gap-3"
                      >
                        <Label className="text-red-600">Logout</Label>
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
