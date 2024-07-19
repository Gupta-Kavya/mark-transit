import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import loader from "./Book.gif";
import StudentValidate from "./StudentValidate";
import { generateToken, messaging } from "../../notifications/firebase";
import { onMessage } from "firebase/messaging";

function Profile() {
  const user = StudentValidate();
  const [stops, setStops] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const filteredStop = stops.find((stop) => stop._id === user.stop);
  const filteredOrg = organizations.find((org) => org._id === user.org);

  useEffect(() => {
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

    // fetchStudentProfile();
    fetchStops();
    fetchOrganizations();
  }, []);

  useEffect(() => {
  
    if (JSON.parse(localStorage.getItem("user")) && JSON.parse(localStorage.getItem("stopId"))) {
      generateToken(
        JSON.parse(localStorage.getItem("stopId")),
        JSON.parse(localStorage.getItem("user"))
      );
    }

    onMessage((messaging, payload) => {
      console.log(payload);
    });
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={loader} alt="Loading..." width={"50px"} />
      </div>
    );
  }

  const initials = user.name ? user.name.split(" ") : "N/A";
  const avatar = initials[0][0] + initials[initials.length - 1][0];

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-b border-gray-200">
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
            {user.name}
          </h2>
          <p className="text-gray-500 text-center mb-6">Student</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-800 font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Organization:</span>
              <span className="text-gray-800 font-medium">
                {filteredOrg ? filteredOrg.name : "N/A"}
              </span>
            </div>
            {/* <div className="flex items-center justify-between">
              <span className="text-gray-600">Vehicle No Allotted:</span>
              <span className="text-gray-800 font-medium">
                {user.vehicleNoAllotted}
              </span>
            </div> */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Contact:</span>
              <span className="text-gray-800 font-medium">{user.contact}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Stop:</span>
              <span className="text-gray-800 font-medium">
                {filteredStop ? filteredStop.name : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Emergency Contact:</span>
              <span className="text-gray-800 font-medium">
                {user.emergencyContact}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
