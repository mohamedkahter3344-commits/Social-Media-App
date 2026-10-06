import { Link, Outlet, useLocation } from "react-router-dom";
import BrandSection from "../../pages/Auth/BrandSection/BrandSection";
import { useEffect, useState } from "react";
import Navbar from './../../components/Layout/Navbar/Navbar';
const AuthLayout = () => {
  const { pathname } = useLocation();
  const [mode, setMode] = useState("/auth/login");

  useEffect(() => {
    if (pathname === "/auth/login" || pathname === "/auth/register") {
      setMode(pathname);
    }
  }, [pathname]);

  return (
    <>
    <Navbar/>
      <div className="min-h-screen bg-[#f0f2f5] px-4 py-8 sm:py-12 lg:flex lg:items-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
          <BrandSection />
          {/* <Outlet /> */}
          <section className="order-1 w-full max-w-107.5 lg:order-2">
            <div className="rounded-2xl bg-white p-4 sm:p-6">
              <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <Link
                  to="/auth/login"
                  className={`rounded-lg text-center block  py-2 text-sm font-extrabold   transition ${mode === "/auth/login" ? "bg-white shadow-sm text-[#00298d]" : "hover: text-slate-800"}`}
                >
                  Login
                </Link>

                <Link
                  to="/auth/register"
                  className={`rounded-lg text-center block py-2 text-sm font-extrabold  transition  ${mode === "/auth/register" ? "bg-white shadow-sm text-[#00298d]" : "hover: text-slate-800"}`}
                >
                  Register
                </Link>
              </div>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
