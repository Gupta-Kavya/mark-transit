import React from "react";
import { Link, useRoutes, useLocation, Navigate, useNavigate } from "react-router-dom";
import Home from "./DriverHome";
import Location from "./DriverLocation";
import Sharelocation from "./Sharelocation.js";


const DriverSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let element = useRoutes([
    {
      path: "/driver/Home",
      element: <Home />,
    },
    {
      path: "/driver/Location",
      element: <Location />,
    },
    {
      path: "/driver/Sharelocation/:roomId",
      element: <Sharelocation />,
    },
  ]);


  
  return (
    <>
      <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 sm:hidden " style={{zIndex: 1000}}>
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
          <Link
            to="/driver/Home"
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group ${
              location.pathname === "/driver/home"
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
            to="/driver/Location"
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group ${
              location.pathname === "/driver/Location"
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
              <path d="M12 2c5.522 0 10 4.478 10 10s-4.478 10-10 10S2 17.522 2 12 6.478 2 12 2zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 1c3.859 0 7 3.141 7 7s-3.141 7-7 7-7-3.141-7-7 3.141-7 7-7zm0 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
            </svg>

            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              Location
            </span>
          </Link>
          <button
            onClick={() => {localStorage.clear(); navigate("../../login")}}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 group`}
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

export default DriverSidebar;