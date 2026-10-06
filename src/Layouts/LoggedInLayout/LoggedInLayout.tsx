import { Outlet } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar";





const LoggedInLayout = () => {
  return (
    <main className="pt-20">
      <Navbar/>
      
      <Outlet/>
    </main>
  );
};

export default LoggedInLayout;
