import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import RouteLogo from "../../../assets/images/route.png";
import profileImg from "../../../assets/images/default-profile.png";

import { MdOutlineHome } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Bars } from "@gravity-ui/icons";
import { Button, Dropdown, Header, Label, Separator } from "@heroui/react";
import { CiSettings } from "react-icons/ci";

import { useAuth } from "../../../Context/TokenContext";

const Navbar = () => {
  const { isAuthenticated, userToken, logOutContext } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  if (location.pathname.startsWith("/auth")) {
    return null;
  }

  function handleLogout() {
    logOutContext();
    navigate("/auth/login");
  }

  return (
    <>
      {isAuthenticated && userToken && location.pathname !== "/auth/login" && (
        <nav className="py-2 bg-white shadow-xl fixed top-0 left-0 right-0 z-50">
          <div className="container flex justify-between items-center w-[95%] mx-auto">
            {/* Logo */}
            <div className="logo flex items-center gap-2">
              <div className="image">
                <img
                  src={RouteLogo}
                  alt="Route Logo"
                  className="w-10 rounded-md object-cover"
                />
              </div>

              <div className="logo-title">
                <h3 className="text-xl font-bold hidden md:block">
                  Route Posts
                </h3>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="links">
              <ul className="flex gap-5 bg-[#F9FAFC] border-2 border-[#cdd3df] px-2 py-1 rounded-xl">
                <li className="flex items-center">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center gap-3 font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-white text-blue-700 p-2 rounded-xl"
                          : "text-slate-700 hover:bg-white rounded-xl hover:text-slate-800 p-2"
                      }`
                    }
                  >
                    <MdOutlineHome className="text-xl" />
                    <span className="hidden md:block">Feed</span>
                  </NavLink>
                </li>

                <li className="flex items-center">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-3 font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-white text-blue-700 p-2 rounded-xl"
                          : "text-slate-700 hover:bg-white rounded-xl hover:text-slate-800 p-2"
                      }`
                    }
                  >
                    <IoPersonOutline className="text-xl" />
                    <span className="hidden md:block">Profile</span>
                  </NavLink>
                </li>

                <li className="flex items-center">
                  <NavLink
                    to="/noitification"
                    className={({ isActive }) =>
                      `flex items-center gap-3 font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-white text-blue-700 p-2 rounded-xl"
                          : "text-slate-700 hover:bg-white rounded-xl hover:text-slate-800 p-2"
                      }`
                    }
                  >
                    <IoMdNotificationsOutline className="text-xl" />
                    <span className="hidden md:block">Notifications</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Profile Dropdown */}
            <div className="logo-person md:ms-4 flex gap-3 items-center rounded-3xl border-2 bg-[#F9FAFC] border-[#cdd3df] py-1 px-3">
              <Dropdown>
                <div className="person-img">
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-8 object-cover"
                  />
                </div>

                <div className="person-name font-bold hidden md:block">
                  <h3>Mohamed Khater</h3>
                </div>

                <Button isIconOnly aria-label="Menu" variant="secondary">
                  <Bars className="outline-none" />
                </Button>

                <Dropdown.Popover className="min-w-55">
                  <Dropdown.Menu
                    disabledKeys={["delete-file"]}
                    onAction={(key) => console.log(`Selected: ${key}`)}
                  >
                    <Dropdown.Section>
                      <Header>Actions</Header>

                      <Dropdown.Item>
                        <Link
                          to="/profile"
                          className="flex h-8 items-start gap-3 justify-center pt-px"
                        >
                          <IoPersonOutline className="text-xl" />
                          <Label>Profile</Label>
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item>
                        <Link
                          to=""
                          className="flex h-8 items-start gap-3 justify-center pt-px"
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
                        className="flex h-8 items-start gap-3 justify-center pt-px"
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
