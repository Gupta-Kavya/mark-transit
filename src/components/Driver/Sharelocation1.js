import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DriverValidate from "./DriverValidate";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import * as turf from "@turf/turf";
import customMarkerIcon from "../../pin.png";
import navigatorIcon from "./navigator.png";

export default function DriverLocation1() {
  const navigate = useNavigate();
  const user = DriverValidate();
  const socket = useMemo(() => io(process.env.REACT_APP_API_BASE_URL), []);

  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [currentTripCode, setCurrentTripCode] = useState(null);
  const [location, setLocation] = useState({ lat: null, long: null });
  const [nextStop, setNextStop] = useState("");

  const checkPointInCircle = (center, radius, point) => {
    const centerPoint = turf.point([center.long, center.lat]);
    const checkPoint = turf.point([point.long, point.lat]);
    const circle = turf.circle(centerPoint, radius, { units: "meters" });
    return turf.booleanPointInPolygon(checkPoint, circle);
  };

  useEffect(() => {
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
          // Initialize nextStop based on the first stop with reached status false
          const nextUnreachedStop = room.stop.find((stop) => !stop.reached);
          if (nextUnreachedStop) {
            setNextStop(nextUnreachedStop.name);
          }
        }
      })
      .catch((err) => console.error("Error fetching trips:", err));
  }, [user]);

  useEffect(() => {
    if (currentTripCode) {
      socket.emit("org-joinDriverRoom", currentTripCode);
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
          setLocation({ lat, long });

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
              LastUpdated,
            });

            // Update the next stop based on location
            updateNextStop({ lat, long });
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error.message);
        },
        { enableHighAccuracy: false, maximumAge: 0, timeout: 10000 }
      );
    };

    getCurrentLocation(); // Get the initial position

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: long, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
        setLocation({ lat, long });

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

          // Update the next stop based on location
          updateNextStop({ lat, long });
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
      },
      { enableHighAccuracy: false, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user, socket, currentTripCode, currentTrip]);

  const updateNextStop = ({ lat, long }) => {
    if (currentTrip && currentTrip.stop) {
      for (let i = 0; i < currentTrip.stop.length; i++) {
        const stop = currentTrip.stop[i];
        const radius = 200; // Assuming radius is 200 meters

        if (!stop.reached) {
          const hasReachedStop = checkPointInCircle(stop, radius, {
            long,
            lat,
          });

          if (hasReachedStop) {
            // Mark the stop as reached in the backend
            axios
              .put(
                `${process.env.REACT_APP_API_BASE_URL}/update-stop/${currentTrip._id}/${stop.id}`,
                { reached: true, arrivalTime: Date.now() }
              )
              .then((response) => {
                // Update state to reflect the stop has been reached
                setCurrentTrip((prevTrip) => ({
                  ...prevTrip,
                  stop: prevTrip.stop.map((s, index) =>
                    index === i ? { ...s, reached: true } : s
                  ),
                }));

                // Find the next stop that hasn't been reached
                const nextUnreachedStop = currentTrip.stop.find(
                  (stop) => !stop.reached
                );
                if (nextUnreachedStop) {
                  setNextStop(nextUnreachedStop.name);
                } else {
                  setNextStop("Trip completed"); // No more stops to reach
                }
              })
              .catch((err) => console.error("Error updating stop:", err));
            break; // Exit loop after first unreached stop found
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

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-b border-gray-200">
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

      <div className="block bg-white">
        <button onClick={stopSharing}
          className="bg-black text-white p-1 rounded-full fixed"
          style={{ top: '12vh', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
        >
          <span className="mx-5 font-semibold">End Trip</span>
        </button>

        <MapContainer
          center={[location.lat || 0, location.long || 0]}
          zoom={17}
          style={{ height: "52vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater location={location} />
          {location.lat !== null && location.long !== null && (
            <Marker position={[location.lat, location.long]} icon={customIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div
        className="bg-gray-200 absolute w-full p-8"
        style={{ height: "25vh" }}
      >
        <div className="p-8 shadow-lg rounded-lg flex justify-between bg-white m-auto">
          <div className="flex items-center space-x-4">
            <img
              src={navigatorIcon}
              alt="Navigation Icon"
              className="w-10 h-10 animated-image"
            />
          </div>
          <div className="flex flex-col justify-start align-baseline ie">
            <p className="text-sm text-gray-400">Heading Towards</p>
            <p className="text-lg font-semibold">
              {nextStop !== "" ? nextStop : "Trip Ended"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}