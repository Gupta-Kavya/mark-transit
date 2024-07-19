import React, { useEffect, useMemo, useReducer, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DriverValidate from "./DriverValidate";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import * as turf from "@turf/turf";
import customMarkerIcon from "../../pin1.png";
import navigatorIcon from "./navigator.png";
import { useState } from "react";

// Define action types
const SET_TRIPS = "SET_TRIPS";
const SET_CURRENT_TRIP = "SET_CURRENT_TRIP";
const SET_CURRENT_TRIP_CODE = "SET_CURRENT_TRIP_CODE";
const SET_LOCATION = "SET_LOCATION";
const SET_NEXT_STOP = "SET_NEXT_STOP";
const SET_ORG_STUDENT_JOINED = "SET_ORG_STUDENT_JOINED";

let wakeLock = null;
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    console.log("Screen wake lock acquired.");
  } catch (err) {
    console.error("Failed to request screen wake lock:", err);
  }
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case SET_TRIPS:
      return { ...state, trips: action.payload };
    case SET_CURRENT_TRIP:
      return { ...state, currentTrip: action.payload };
    case SET_CURRENT_TRIP_CODE:
      return { ...state, currentTripCode: action.payload };
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case SET_NEXT_STOP:
      return { ...state, nextStop: action.payload };
    case SET_ORG_STUDENT_JOINED:
      return { ...state, orgStudentJoined: action.payload };
    default:
      return state;
  }
};

export default function DriverLocation() {
  const navigate = useNavigate();
  const user = DriverValidate();
  const socket = useMemo(() => io(process.env.REACT_APP_API_BASE_URL), []);
  const emittedStopRef = useRef(null);
  const debounceRef = useRef(null);

  const debounce = (func, delay) => {
    return function (...args) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Initialize state with useReducer
  const [state, dispatch] = useReducer(reducer, {
    trips: [],
    currentTrip: null,
    currentTripCode: null,
    location: {
      lat: null,
      long: null,
      head: null,
      speed: null,
    },
    nextStop: "",
    orgStudentJoined: false,
  });

  const {
    trips,
    currentTrip,
    currentTripCode,
    location,
    nextStop,
    orgStudentJoined,
  } = state;

  // Action creators
  const setTrips = (data) => dispatch({ type: SET_TRIPS, payload: data });
  const setCurrentTrip = (data) =>
    dispatch({ type: SET_CURRENT_TRIP, payload: data });
  const setCurrentTripCode = (data) =>
    dispatch({ type: SET_CURRENT_TRIP_CODE, payload: data });
  const setLocationData = (data) =>
    dispatch({ type: SET_LOCATION, payload: data });
  const setNextStopData = (data) =>
    dispatch({ type: SET_NEXT_STOP, payload: data });
  const setOrgStudentJoinedData = (data) =>
    dispatch({ type: SET_ORG_STUDENT_JOINED, payload: data });

  const checkPointInCircle = (center, radius, point) => {
    const centerPoint = turf.point([center.long, center.lat]);
    const checkPoint = turf.point([point.long, point.lat]);
    const circle = turf.circle(centerPoint, radius, { units: "meters" });
    return turf.booleanPointInPolygon(checkPoint, circle);
  };

  const refreshNextStop = (room) => {
    // Find the last reached stop
    const lastReachedStop = room.stop
      .slice()
      .reverse()
      .find((stop) => stop.reached);

    // Find if there are any unreached stops
    const unreachedStops = room.stop.filter((stop) => !stop.reached);

    if (lastReachedStop && unreachedStops.length > 0) {
      // If there are unreached stops, set nextStop to the first unreached stop
      const nextUnreachedStop = room.stop.find((stop, index) => {
        if (index > room.stop.indexOf(lastReachedStop) && !stop.reached) {
          return true;
        }
        return false;
      });
      setNextStopData(nextUnreachedStop.name);
    } else if (unreachedStops.length === room.stop.length) {
      // If all stops are unreached (all stops have reached: false), set nextStop to the first stop
      setNextStopData(room.stop[0].name);
    } else {
      // Otherwise, all stops are reached
      setNextStopData("Trip completed");
    }
  };

  useEffect(() => {
    requestWakeLock();

    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/trips`)
      .then((response) => {
        setTrips(response.data);
        const room = response.data.find(
          (room) => room.owner === user.email && room.currentStatus === true
        );
        if (room) {
          setCurrentTrip(room);
          setCurrentTripCode(room.tripCode);
          refreshNextStop(room);
        }
      })
      .catch((err) => console.error("Error fetching trips:", err));
  }, [user]);

  useEffect(() => {
    if (currentTripCode) {
      socket.emit("org-joinDriverRoom", currentTripCode);

      socket.on("org-studentJoined", (data) => {
        setOrgStudentJoinedData(true);
        console.log("Student joined");
      });

      return () => {
        socket.off("org-studentJoined");
        socket.emit("org-leaveDriverRoom", currentTripCode);
      };
    }
  }, [socket, currentTripCode, navigate]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Your browser doesn't support geolocation feature!");
      return;
    }

    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: long } = position.coords;

          if (orgStudentJoined && user && user._id && currentTripCode) {
            socket.emit("org-locationUpdate", {
              userId: user._id,
              tripCode: currentTripCode,
              lat,
              long,
            });
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error.message);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    };

    getCurrentLocation();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const {
          latitude: lat,
          longitude: long,
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          speed,
        } = position.coords;
        setLocationData({ lat, long, head: heading, speed });

        const date = new Date(position.timestamp);
        const LastUpdated = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}-${date.toLocaleString(
          "default",
          { month: "long" }
        )}`;

        if (user && user._id && currentTripCode) {
          socket.emit("org-locationUpdate", {
            userId: user._id,
            tripCode: currentTripCode,
            lat,
            long,
            accuracy,
            altitude,
            altitudeAccuracy,
            heading,
            speed,
            LastUpdated,
          });
          updateNextStop({ lat, long, accuracy });
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [orgStudentJoined, user, socket, currentTripCode]);

  async function sendPushNotification(notificationData) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/sendNotification`,
        notificationData
      );
      console.log("Push notification sent successfully:", response.data);
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error("Error sending push notification:", error.message);
      throw error; // Throw the error for handling in the caller function
    }
  }

  const updateNextStop = ({ lat, long, accuracy }) => {
    if (currentTrip && currentTrip.stop) {
      for (let i = 0; i < currentTrip.stop.length; i++) {
        const stop = currentTrip.stop[i];
        const radius = 200;

        if (!stop.reached && emittedStopRef.current !== stop.id) {
          const hasReachedStop = checkPointInCircle(stop, radius, {
            long,
            lat,
          });

          if (hasReachedStop) {
            axios
              .put(
                `${process.env.REACT_APP_API_BASE_URL}/update-stop/${currentTrip._id}/${stop.id}`,
                { reached: true, arrivalTime: Date.now() }
              )
              .then((response) => {
                setCurrentTrip((prevTrip) => ({
                  ...prevTrip,
                  stop: prevTrip.stop.map((s, index) =>
                    index === i ? { ...s, reached: true } : s
                  ),
                }));

                refreshNextStop({
                  ...currentTrip,
                  stop: currentTrip.stop.map((s, index) =>
                    index === i ? { ...s, reached: true } : s
                  ),
                });

                // Emit socket event with the next stop name
                const nextUnreachedStop = currentTrip.stop.find(
                  (stop, index) => index === i + 1 && !stop.reached
                );
                if (nextUnreachedStop) {
                  // Debounce emitting the socket event
                  debounce(() => {
                    socket.emit("stopupdate", {
                      stopId: nextUnreachedStop.id,
                      status: "reached",
                      stopName: nextUnreachedStop.name,
                    });
                    sendPushNotification({
                      topicName: nextUnreachedStop.id,
                      title: "Stop Alert !",
                      body: "The Bus Is Arriving to Your Stop in 1 min.",
                      image: "https://i.postimg.cc/sxXPwpTn/maskable-icon.png"
                    });
                  }, 10000)(); // Adjust the debounce delay as needed

                  // Update emitted stop ref to mark this stop as emitted
                  emittedStopRef.current = stop.id;
                }
              })
              .catch((err) => console.error("Error updating stop:", err));

            break; // Exit loop after finding and handling one stop
          }
        }
      }
    }
  };

  const stopSharing = () => {
    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/update-trip/${currentTripCode}`,
        {
          currentStatus: false,
          endedAt: Date.now(),
        }
      )
      .then((response) => {
        if (user && user._id && currentTripCode) {
          socket.emit("org-locationEnded", {
            userId: user._id,
            tripCode: currentTripCode,
          });
        }
        navigate("/driver/home");
      })
      .catch((error) => {
        console.error("Error ending trip:", error);
      });
  };

  const customIcon = new L.Icon({
    iconUrl: customMarkerIcon,
    iconSize: [40, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  function MapUpdater({ location }) {
    const map = useMap();
    useEffect(() => {
      if (location.lat && location.long) {
        map.setView([location.lat, location.long], 18);
      }
    }, [location, map]);
    return null;
  }

  function formatHeading(heading) {
    if (heading === null || isNaN(heading)) {
      return "Unknown";
    }

    // Convert heading to a value between 0 and 360
    let normalizedHeading = ((heading % 360) + 360) % 360;

    // Define directional sectors
    const sectors = [
      { direction: "N", range: [0, 22.5] },
      { direction: "NE", range: [22.5, 67.5] },
      { direction: "E", range: [67.5, 112.5] },
      { direction: "SE", range: [112.5, 157.5] },
      { direction: "S", range: [157.5, 202.5] },
      { direction: "SW", range: [202.5, 247.5] },
      { direction: "W", range: [247.5, 292.5] },
      { direction: "NW", range: [292.5, 337.5] },
      { direction: "N", range: [337.5, 360] },
    ];

    // Find the sector that contains the normalized heading
    let direction = sectors.find(
      (sector) =>
        normalizedHeading >= sector.range[0] &&
        normalizedHeading < sector.range[1]
    );
    return `${Math.round(normalizedHeading).toFixed(2)}<sup>°</sup> ${
      direction ? direction.direction : ""
    }`;
  }

  return (
    <>
      <div className="sm:w-1/4 sm:m-auto">
        <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white  border-b-yellow-600">
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
              <h1 className="text-lg font-semibold">Sharing Location</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="text-black py-2 px-4 bg-gray-200 rounded-full font-semibold text-sm"
                type="button"
                data-drawer-placement="bottom"
              >
                MarkDigital
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center">
                <div className="absolute h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-base font-semibold text-gray-200 pl-4">
                  {location.head ? (
                    <p
                      className="text-base font-semibold text-gray-200 transition-opacity ease-in-out"
                      dangerouslySetInnerHTML={{
                        __html: formatHeading(location.head),
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center">
                <div className="absolute h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-base font-semibold text-gray-200 pl-4 transition-opacity ease-in-out">
                  {location.speed
                    ? (location.speed * 3.6).toFixed(2) + " km/h"
                    : "0 km / h"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="block bg-white">
          <MapContainer
            center={[location.lat || 0, location.long || 0]}
            zoom={16}
            style={{ height: "68vh", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater location={location} />
            {location.lat !== null && location.long !== null && (
              <Marker
                position={[location.lat, location.long]}
                icon={customIcon}
              >
                {/* <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup> */}
              </Marker>
            )}
          </MapContainer>
        </div>

        <div
          className="w-full p-8 fixed "
          style={{
            bottom: "0vh",

            zIndex: 1000,
          }}
        >
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-gray-950 to-gray-800 p-5 rounded-t-2xl shadow-xl sm:w-1/4">
            <div className="flex flex-col items-center h-2 w-16 bg-gray-300 rounded-full relative overflow-hidden m-auto mb-10">
              <div className="absolute inset-y-0 left-0 bg-gray-400 w-2 rounded-full"></div>
              <div className="absolute inset-y-0 right-0 bg-gray-400 w-2 rounded-full"></div>
            </div>

            <div className="flex flex-col items-center justify-between">
              {/* End Trip Button */}
              <button
                onClick={stopSharing}
                className="relative bg-yellow-600 py-2 px-4 rounded-md flex items-center justify-center shadow-md mb-4 w-full overflow-hidden text-white"
              >
                <span className="font-semibold mr-2">End Trip</span>
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
                {/* Pseudo-element for hover effect */}
                <span className="absolute left-0 top-0 h-full bg-gradient-to-r from-transparent to-yellow-600 w-1/2 transform translate-x-full hover:translate-x-0 transition-all duration-300"></span>
              </button>

              {/* Heading Towards Container */}
              <div className="w-full bg-black rounded-lg border border-gray-700 shadow-md relative">
                <div className="flex items-center p-4">
                  <img
                    src={navigatorIcon}
                    alt="Navigation Icon"
                    className="w-10 h-10 mr-4"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm text-yellow-500">Heading Towards</p>
                    <p
                      className={`text-lg font-semibold text-white capitalize transition-opacity duration-500 ease-in-out ${
                        nextStop !== "" ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {nextStop !== "" ? nextStop : "Trip Ended"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
