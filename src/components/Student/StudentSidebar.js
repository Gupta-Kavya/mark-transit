import React from "react";
import { Link, useRoutes, useLocation, Navigate, useNavigate } from "react-router-dom";
import TrackLocation from "./TrackLocation";
import ViewLocation from "./ViewLocation";

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let element = useRoutes([
    {
      path: "/student/TrackLocation",
      element: <TrackLocation />,
    },
    {
      path: "/student/ViewLocation/:senderId",
      element: <ViewLocation />,
    },
  ]);

  return (
    <>
      {/* <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-700 rounded-lg hidden sm:block hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-gray-100 text-gray-900"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/student/TrackLocation"
                className={`flex items-center p-2 rounded-lg hover:bg-gray-200 group ${
                  location.pathname === "/student/TrackLocation"
                    ? "bg-gray-200"
                    : "hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0 1.657 1.343 3 3 3s3-1.343 3-3-1.343-3-3-3-3 1.343-3 3zM8.5 21C7.9 21 7.4 20.6 7.2 20c0 0-2.7-6.1-3.6-8.3C2.9 10.5 3.3 9 4.3 9H8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8.5zM19 15.5C19 14.1 20.1 13 21.5 13S24 14.1 24 15.5 22.9 18 21.5 18 19 16.9 19 15.5zM13 13c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z"
                  />
                </svg>
                <span className="ms-3">Track Location</span>
              </Link>
            </li>
            <li>
              <button
                // onClick={Logout}
                className={`flex items-center p-2 rounded-lg hover:bg-gray-200 group ${
                  location.pathname === "/org/Logout"
                    ? "bg-gray-200"
                    : "hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0 1.657 1.343 3 3 3s3-1.343 3-3-1.343-3-3-3-3 1.343-3 3zM8.5 21C7.9 21 7.4 20.6 7.2 20c0 0-2.7-6.1-3.6-8.3C2.9 10.5 3.3 9 4.3 9H8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8.5zM19 15.5C19 14.1 20.1 13 21.5 13S24 14.1 24 15.5 22.9 18 21.5 18 19 16.9 19 15.5zM13 13c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z"
                  />
                </svg>
                <span className="ms-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div className="sm:ml-64">{element}</div> */}

      <div
        className={`fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 sm:w-1/4 ${
          location.pathname === "/student/home"
            ? "bg-gray-100 text-red-500"
            : "text-gray-600"
        }`}
      >
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
          <Link
            to="/student/Home"
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group ${
              location.pathname === "/student/home"
                ? "bg-gray-100 text-red-500"
                : "text-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm0 9c-4.418 0-8 3.582-8 8h2c0-3.309 2.691-6 6-6s6 2.691 6 6h2c0-4.418-3.582-8-8-8z" />
            </svg>

            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Home
            </span>
          </Link>

          <Link
            to="/student/TrackLocation"
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group ${
              location.pathname === "/student/ViewLocation/:senderId"
                ? "-z-50"
                : ""
            }`}
          >
            <svg
              className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2c5.522 0 10 4.478 10 10s-4.478 10-10 10S2 17.522 2 12 6.478 2 12 2zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 1c3.859 0 7 3.141 7 7s-3.141 7-7 7-7-3.141-7-7 3.141-7 7-7zm0 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
            </svg>

            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Track
            </span>
          </Link>
          <button
            onClick={() => {localStorage.clear(); navigate("../../login")}}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group ${
              location.pathname === "/org/Logout"
                ? "bg-gray-100 text-gray-800"
                : "text-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;