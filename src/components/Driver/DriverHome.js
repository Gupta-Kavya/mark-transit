import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import DriverValidate from "./DriverValidate"



function Profile() {
  const driverId = JSON.parse(localStorage.getItem("user"));
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState(null);
  const [stops, setStops] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drawer, setDrawer] = useState(false);
  DriverValidate();
  useEffect(() => {
    // Fetch all drivers
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/driver`
        );
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    // Fetch stops data
    const fetchStops = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/stops`
        );
        setStops(response.data);
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };

    // Fetch organizations data
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/org`
        );
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    // Fetch vehicles data
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/vehicle`
        );
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    // Fetch routes data
    const fetchRoutes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/route`
        );
        setRoutes(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchDrivers();
    fetchStops();
    fetchOrganizations();
    fetchVehicles();
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (drivers.length > 0) {
      const selectedDriver = drivers.find((d) => d._id === driverId);
      setDriver(selectedDriver);
    }
  }, [drivers, driverId]);

  if (!driver) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const initials = driver.name ? driver.name.split(" ") : ["N", "A"];
  let avatar = "";
  if (initials.length > 1) {
    avatar = initials[0][0] + initials[initials.length - 1][0];
  } else {
    avatar = initials[0][0];
  }

  // Filter stops and organizations based on driver data
  const filteredStop = stops && stops.find((stop) => stop._id === driver.stop);
  const filteredOrg = organizations && organizations.find((org) => org._id === driver.org);
  const filteredVehicle = vehicles && vehicles.find(
    (vehicle) => vehicle._id === driver.vehicleNo
  );
  const filteredRoute = routes && routes.find((route) => route._id === driver.routeId);

  return (
    <>
      

      <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Link to="/student/TrackLocation" className="text-lg font-semibold">
              <svg
                className="w-6 h-6 mr-2 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M12 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm0 7c-4.418 0-8 3.582-8 8h2c0-3.309 2.691-6 6-6s6 2.691 6 6h2c0-4.418-3.582-8-8-8z" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold">My Profile</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="text-black py-2 px-4 bg-gray-200 rounded-full font-semibold text-sm"
              type="button"
              data-drawer-target="drawer-bottom-example"
              data-drawer-show="drawer-bottom-example"
              data-drawer-placement="bottom"
              aria-controls="drawer-bottom-example"
            >
              MarkDigital
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-gray-100 p-6 h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-hidden mt-5">
          <div className="flex items-center justify-center mb-6 overflow-y-hidden">
            <div className="relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300 text-3xl">
                {avatar}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {driver.name}
          </h2>
          <p className="text-gray-500 text-center mb-6">Driver</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-800 font-medium">{driver.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Organization:</span>
              <span className="text-gray-800 font-medium">
                {filteredOrg ? filteredOrg.name : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Contact:</span>
              <span className="text-gray-800 font-medium">
                {driver.contact}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Your Stop:</span>
              <span className="text-gray-800 font-medium">
                {filteredStop ? filteredStop.name : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Vehicle Alloted:</span>
              <span className="text-gray-800 font-medium">
                {filteredVehicle ? filteredVehicle.name : "N/A"}
              </span>
            </div>
            {/* <div className="flex items-center justify-between">
              <span className="text-gray-600">Route Alloted:</span>
              <span className="text-gray-800 font-medium">
                {filteredRoute ? filteredRoute.name : "N/A"}
              </span>
            </div> */}
          </div>
        </div>

        <button
        className="text-white py-2 px-4 bg-blue-800 font-semibold text-sm mt-4 rounded-lg shadow-lg"
        type="button"
        data-drawer-target="drawer-bottom-example"
        data-drawer-show="drawer-bottom-example"
        data-drawer-placement="bottom"
        aria-controls="drawer-bottom-example"
        onClick={() => {
          setDrawer(true);
        }}
      >
        View Bus Route
      </button>


      </div>

      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-40 ${
          drawer ? "block" : "hidden"
        }`}
        onClick={() => setDrawer(false)} // Close drawer on overlay click
      ></div>
      {/* Drawer component */}
      <div
        id="drawer-bottom-example"
        className={`fixed bottom-0 left-0 right-0 z-50 w-full p-4 overflow-y-auto transition-transform bg-white transform ${
          drawer ? "translate-y-0" : "translate-y-full"
        } ease-in-out duration-300`}
        tabIndex={-1}
        aria-labelledby="drawer-bottom-label"
      >
        <div className="flex justify-between items-center">
          <h5
            id="drawer-bottom-label"
            className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 "
          >
            <svg
              className="w-4 h-4 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            Bus Route
          </h5>
          <button
            type="button"
            data-drawer-hide="drawer-bottom-example"
            aria-controls="drawer-bottom-example"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center "
            onClick={() => {
              setDrawer(false);
            }}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <div className="rounded-lg relative overflow-auto h-64 hide-scrollbar mt-3">
          {filteredRoute && filteredRoute.stop.map((stop, index) => (
            <div className="max-w-sm bg-gradient-to-r from-gray-700 to-gray-950  text-white p-4 relative rounded-lg mt-1" key={index}>
              {/* Vertical bar with ball */}
              {/* <div className="absolute left-0 top-0 bottom-0 flex items-center">
                <img src={stop.reached ? reachedIcon : unreachedIcon} alt="Vertical Bar" className="h-full rounded-l-lg" />
              </div> */}
              {/* Content */}
              <div className="ml-1">
                {" "}
                {/* Adjusted margin */}
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Sequence :</span>
                  <span className="text-sm">
                    {stop.sequence ? stop.sequence : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm">Stop Name : </span>
                  <span className="text-sm font-bold flex items-center capitalize">
                    {stop.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;