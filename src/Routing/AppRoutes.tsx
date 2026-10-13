import { createBrowserRouter } from "react-router-dom";
import LoggedInLayout from "../Layouts/LoggedInLayout/LoggedInLayout";
import Feed from "../pages/Feed/Feed";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ProtectedRoutes from "../components/ProtectedRoutes/ProtectedRoutes";
import Community from "../components/Community/Community";
import PostDetails from "../pages/PostDetails/PostDetails";
import Notifications from "../pages/Notifications/Notifications";
import AllSuggestionsFriend from "../pages/AllSuggestionsFriend/AllSuggestionsFriend";
import Settings from "../pages/Settings/Settings";
import MyPosts from './../pages/MyPosts/MyPosts';
import Saved from "../pages/Saved/Saved";

const mainRouter = createBrowserRouter([
  {
    path: "",
    element: <ProtectedRoutes><LoggedInLayout /></ProtectedRoutes>,
    children: [
      {
        index: true,
        element: <Feed />,
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "my-posts",
        element: <MyPosts/>,
      },
      {
        path: "profile/:id",
        element: <Profile />,
      },
      {
        path: "/post/:id",
        element: <PostDetails />,
      },
      {
        path: "community",
        element: <Community />,
      },
      {
        path: "saved",
        element: <Saved />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "suggestions",
        element: <AllSuggestionsFriend />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default mainRouter;
