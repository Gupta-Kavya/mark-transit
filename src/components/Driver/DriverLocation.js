import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DriverValidate from "./DriverValidate";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import customMarkerIcon from "../../pin1.png";
import L from "leaflet";

// Define action types
const SET_DRIVER_ORG = "SET_DRIVER_ORG";
const SET_DRIVER_STOP = "SET_DRIVER_STOP";
const SET_DRIVER_ROUTE_STOPS = "SET_DRIVER_ROUTE_STOPS";
const SET_IS_CURRENTLY_SHARING = "SET_IS_CURRENTLY_SHARING";
const SET_CURRENTLY_SHARING_TRIP_CODE = "SET_CURRENTLY_SHARING_TRIP_CODE";
const SET_TRIPS = "SET_TRIPS";
const SET_POSITION = "SET_POSITION";

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case SET_DRIVER_ORG:
      return { ...state, driverOrg: action.payload };
    case SET_DRIVER_STOP:
      return { ...state, driverStop: action.payload };
    case SET_DRIVER_ROUTE_STOPS:
      return { ...state, driverRouteStops: action.payload };
    case SET_IS_CURRENTLY_SHARING:
      return { ...state, isCurrentlySharing: action.payload };
    case SET_CURRENTLY_SHARING_TRIP_CODE:
      return { ...state, currentlySharingTripCode: action.payload };
    case SET_TRIPS:
      return { ...state, trips: action.payload };
    case SET_POSITION:
      return { ...state, position: action.payload };
    default:
      return state;
  }
};

export default function DriverLocation(props) {
  const { org, stop, route } = props;
  const navigate = useNavigate();
  const user = DriverValidate(); // Assuming DriverValidate is a function that returns the user object

  // Initialize state with useReducer
  const [state, dispatch] = useReducer(reducer, {
    driverOrg: "N/A",
    driverStop: "N/A",
    driverRouteStops: [],
    isCurrentlySharing: null,
    currentlySharingTripCode: null,
    trips: [],
    position: [0, 0], // Default initial position
  });
  const [locatiopopup, setlocatioPopup] = useState(false);
  const {
    driverOrg,
    driverStop,
    driverRouteStops,
    isCurrentlySharing,
    currentlySharingTripCode,
    trips,
    position,
  } = state;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch({
          type: SET_POSITION,
          payload: [position.coords.latitude, position.coords.longitude],
        });
        setlocatioPopup(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        setlocatioPopup(true);
      },
      { enableHighAccuracy: true }
    );
  }, []); // Empty dependency array means this effect runs once after the initial render

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/trips`)
      .then((response) => {
        dispatch({ type: SET_TRIPS, payload: response.data });
        // Assuming you want to find the roomCode where the sender is the owner
        const room = response.data.find(
          (room) => room.owner === user.email && room.currentStatus === true
        );
        if (room) {
          dispatch({ type: SET_IS_CURRENTLY_SHARING, payload: true });
          dispatch({
            type: SET_CURRENTLY_SHARING_TRIP_CODE,
            payload: room.tripCode,
          });
        } else {
          dispatch({ type: SET_IS_CURRENTLY_SHARING, payload: false });
          dispatch({
            type: SET_CURRENTLY_SHARING_TRIP_CODE,
            payload: room.tripCode,
          });
        }
      })
      .catch((err) => console.error(err));
  }, [user]);

  useEffect(() => {
    if (org && stop && user && route) {
      const orgDetails = org.find((e) => e._id === user.org);
      const stopDetails = stop.find((e) => e._id === user.stop);
      const routeDetails = route.find((e) => e._id === user.routeId);

      if (orgDetails) {
        dispatch({ type: SET_DRIVER_ORG, payload: orgDetails.name });
      }
      if (stopDetails) {
        dispatch({ type: SET_DRIVER_STOP, payload: stopDetails.name });
      }
      if (routeDetails) {
        dispatch({ type: SET_DRIVER_ROUTE_STOPS, payload: routeDetails.stop });
      }
    }
  }, [org, stop, user, route]);

  const customIcon = L.icon({
    iconUrl: customMarkerIcon,
    iconSize: [40, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  async function shareLocation(e) {
    e.preventDefault();
    if (isCurrentlySharing) {
      navigate(`/driver/Sharelocation/${currentlySharingTripCode}`);
    } else {
      // Check if driverRouteStops is valid
      if (!driverRouteStops || driverRouteStops.length === 0) {
        alert("Driver route stops are empty or invalid.");
        return;
      }

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/add-trip`,
          {
            owner: user.email,
            org: user.org,
            vehicleId: user.vehicleNo,
            stop: driverRouteStops,
          }
        );

        if (res.data.message === "added") {
          // Navigate to the driver page with the room code
          navigate(`/driver/Sharelocation/${res.data.tripCode}`);
        } else {
          alert("Already Exist");
        }
      } catch (error) {
        alert("Invalid Details");
        console.log(error);
      }
    }
  }

  function MapComponent() {
    const map = useMap();
    map.setView(position, map.getZoom());
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Link to="/driver/Home" className="text-lg font-semibold">
              <svg
                className="w-6 h-6 mr-2 inline-block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold">Share Location</h1>
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

      <MapContainer
        center={position} // Centering map based on position state
        zoom={17}
        style={{ height: "75vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={customIcon}>
          <Popup>Your Current Location !</Popup>
        </Marker>
        <MapComponent />
      </MapContainer>

      <div
        className="w-full p-8 fixed "
        style={{
          bottom: "0vh",

          zIndex: 1000,
        }}
      >
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-gray-950 to-gray-800 p-5 rounded-t-2xl shadow-xl">
          <div className="flex flex-col items-center h-2 w-16 bg-gray-300 rounded-full relative overflow-hidden m-auto mb-10">
            <div className="absolute inset-y-0 left-0 bg-gray-400 w-2 rounded-full"></div>
            <div className="absolute inset-y-0 right-0 bg-gray-400 w-2 rounded-full"></div>
          </div>

          <div className="flex flex-col items-center justify-between">
            {/* End Trip Button */}
            <button
              onClick={shareLocation}
              className="relative bg-green-400 py-2 px-4 rounded-md flex items-center justify-center shadow-md mb-4 w-full overflow-hidden text-white"
              disabled={isCurrentlySharing === null ? true : false}
            >
              {isCurrentlySharing === null ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  className="h-5 w-5 mr-3 text-white"
                >
                  <circle
                    fill="#FFFFFF"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    r="15"
                    cx="40"
                    cy="65"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2"
                      values="65;135;65;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="-.4"
                    ></animate>
                  </circle>
                  <circle
                    fill="#FFFFFF"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    r="15"
                    cx="100"
                    cy="65"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2"
                      values="65;135;65;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="-.2"
                    ></animate>
                  </circle>
                  <circle
                    fill="#FFFFFF"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    r="15"
                    cx="160"
                    cy="65"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2"
                      values="65;135;65;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="0"
                    ></animate>
                  </circle>
                </svg>
              ) : (
                <>
                  <span className="font-semibold mr-2">
                    {isCurrentlySharing
                      ? "Continue Your Trip"
                      : "Start Your Trip"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="feather feather-arrow-right h-4 w-4"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
              {/* Pseudo-element for hover effect */}
              <span className="absolute left-0 top-0 h-full bg-gradient-to-r from-transparent to-green-400 w-1/2 transform translate-x-full hover:translate-x-0 transition-all duration-300"></span>
            </button>
          </div>
        </div>

        {locatiopopup && (
          <>
            <div
              id="overlay"
              class="fixed inset-0 bg-black bg-opacity-50"
            ></div>
            <div
              id="toast-simple"
              class="fixed inset-0 flex items-center justify-center"
            >
              <div
                class="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800"
                role="alert"
              >
                <svg
                  class="animate-spin h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>

                <div class="ps-4 text-sm font-normal">
                  Please turn on your Location.
                </div>
              </div>
            </div>
          </>
        )}



{!position && locatiopopup &&  (
          <>
            <div
              id="overlay"
              class="fixed inset-0 bg-black bg-opacity-50"
            ></div>
            <div
              id="toast-simple"
              class="fixed inset-0 flex items-center justify-center"
            >
              <div
                class="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800"
                role="alert"
              >
                <svg
                  class="animate-spin h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>

                <div class="ps-4 text-sm font-normal">
                  Fetching Your Current Location......
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}