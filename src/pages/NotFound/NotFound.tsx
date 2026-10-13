import { Link } from "react-router-dom";
import { MdOutlineHome } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div className="relative w-full max-w-lg text-center">
        {/* Background Decoration */}
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl" />

        {/* Content */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-12">
          {/* 404 */}
          <div className="relative mb-4">
            <h1 className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
              404
            </h1>
            <span className="absolute -right-1 top-2 rotate-12 text-3xl">
              🤔
            </span>
          </div>

          {/* Text */}
          <h2 className="mb-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Oops! Lost in Space?
          </h2>

          <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
            Looks like this page took a little vacation. The link may be broken,
            or the page might have been moved.
          </p>

          {/* Buttons */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <MdOutlineHome className="text-xl" />
              Back to Feed
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
            >
              <IoArrowBackOutline className="text-xl" />
              Go Back
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-slate-100 pt-5">
            <p className="text-xs font-medium text-slate-400">
              Don't worry, it happens to the best of us 💙
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
