// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import customMarkerIcon from "../../pin.png";
// import L from "leaflet";
// import socketIOClient from "socket.io-client";
// import loader from "./Book.gif";

// const ENDPOINT = process.env.REACT_APP_API_BASE_URL; // Replace with your socket server URL

// const customIcon = L.icon({
//   iconUrl: customMarkerIcon,
//   iconSize: [40, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// const ViewLocation = () => {
//   const { senderId, routeId } = useParams();
//   const [coords, setCoords] = useState(null); // Initialize coords as null initially
//   const [locationEnded, setLocationEnded] = useState(false); // State to track if location has ended
//   const [stops, setStops] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [currentStatus, setCurrentStatus] = useState(false);
//   const [drawer, setDrawer] = useState(false);  
//   const [nextStop, setNextStop] = useState("");
//   const [toReach, setToReach] = useState("");
//   const [firstStop, setFirstStop] = useState("");
//   const [lastStop, setLastStop] = useState("");

//   const fetchStops = async () => {
//     try {
//       const response = await fetch(`${ENDPOINT}/trips`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch stops");
//       }
//       const tripsData = await response.json();
//       const trip = tripsData.find((trip) => trip.tripCode === senderId);
//       if (trip) {
//         setStops(trip.stop || []);

//         // Set first and last stops
//         setFirstStop(trip.stop.length ? trip.stop[0].name : "N/A");
//         setLastStop(
//           trip.stop.length ? trip.stop[trip.stop.length - 1].name : "N/A"
//         );

//         // Filter stops into reached and unreached
//         const reachedStops = trip.stop.filter((stop) => stop.reached);
//         const unreachedStops = trip.stop.filter((stop) => !stop.reached);

//         // Set next stop and to reach values
//         setNextStop(
//           reachedStops.length
//             ? reachedStops[reachedStops.length - 1].name
//             : "N/A"
//         );
//         setToReach(unreachedStops.length ? unreachedStops[0].name : "N/A");
//       } else {
//         throw new Error("Trip not found");
//       }
//     } catch (error) {
//       console.error("Error fetching stops:", error);
//     }
//   };

//   const checkCurrentStatus = async () => {
//     try {
//       const response = await fetch(`${ENDPOINT}/trips`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch current status");
//       }
//       const tripData = await response.json();
//       const trip = tripData.find((trip) => trip.tripCode === senderId);
//       setCurrentStatus(trip ? trip.currentStatus : false); // Update currentStatus state
//     } catch (error) {
//       console.error("Error fetching current status:", error);
//     }
//   };

//   useEffect(() => {
//     const newSocket = socketIOClient(ENDPOINT);

//     newSocket.on("connect", () => {
//       console.log("Connected to server");
//     });

//     newSocket.on("org-locationEnded", (data) => {
//       setLocationEnded(true); // Set locationEnded to true when location ends
//       // Show toast notification
//       toast.info("Location sharing has ended.", {
//         theme: "dark",
//         position: "bottom-center",
//         autoClose: 3000, // Close after 3 seconds
//         onClose: () => {
//           window.location.href = "/student/TrackLocation"; // Redirect after toast closes
//         },
//       });
//     });

//     newSocket.on("org-locationUpdate", (data) => {
//       setCoords({
//         lat: data.lat,
//         long: data.long,
//         speed: data.speed,
//         accuracy: data.accuracy,
//         altitude: data.altitude,
//       });
//       fetchStops();
//       checkCurrentStatus();
//     });

//     setSocket(newSocket);

//     return () => newSocket.disconnect();
//   }, []);

//   useEffect(() => {
//     if (senderId && socket) {
//       socket.emit("joinStudentRoom", senderId);

//       return () => {
//         socket.emit("leaveStudentRoom", senderId);
//       };
//     }
//   }, [senderId, socket]);

//   useEffect(() => {
//     // Function to check current status from database

//     checkCurrentStatus();
//   }, [senderId]);

//   useEffect(() => {
//     // Show last known location if coords are null or undefined
//     const showLastKnownLocation = () => {
//       if (!coords || !coords.lat || !coords.long) {
//         setCoords(null);
//       }
//     };

//     showLastKnownLocation();
//   }, [coords]);

//   function convertToIST(dateTimeString) {
//     // Parse the input date-time string
//     const date = new Date(dateTimeString);

//     // Convert the UTC time to IST (UTC+5:30)
//     const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
//     const istTime = new Date(date.getTime() + istOffset);

//     // Get hours and minutes
//     let hours = istTime.getUTCHours();
//     const minutes = istTime.getUTCMinutes();

//     // Determine AM or PM suffix
//     const ampm = hours >= 12 ? "PM" : "AM";

//     // Convert hours from 24-hour to 12-hour format
//     hours = hours % 12;
//     hours = hours ? hours : 12; // The hour '0' should be '12'

//     // Format minutes with leading zero if needed
//     const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

//     // Return the formatted time string
//     return `${hours}:${formattedMinutes} ${ampm}`;
//   }

//   const routeStops = stops.map((stop) => ({
//     name: stop.name,
//     reached: stop.reached, // Assuming stop.reached is the boolean value
//     arrivalTime: stop.arrivalTime
//       ? convertToIST(stop.arrivalTime)
//       : "Yet To Arrive",
//   }));

//   const AnimatedMarker = ({ position }) => {
//     const map = useMap();

//     useEffect(() => {
//       if (position) {
//         map.setView(position, map.getZoom());
//       }
//     }, [position, map]);

//     return (
//       <Marker position={position} icon={customIcon}>
//         <Popup>
//           <strong>{firstStop.toUpperCase()}</strong> -{" "}
//           <strong>{lastStop.toUpperCase()}</strong>
//         </Popup>
//       </Marker>
//     );
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white border-b border-gray-200">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center space-x-2">
//             <Link to="/student/TrackLocation" className="text-lg font-semibold">
//               <svg
//                 className="w-6 h-6 mr-2 inline-block"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </Link>
//             <h1 className="text-lg font-semibold">Track Location</h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             {/* Additional buttons/icons here */}
//             <button
//               className="text-black py-2 px-4 bg-gray-200 rounded-full font-semibold text-sm"
//               type="button"
//               data-drawer-target="drawer-bottom-example"
//               data-drawer-show="drawer-bottom-example"
//               data-drawer-placement="bottom"
//               aria-controls="drawer-bottom-example"
//               onClick={() => {
//                 setDrawer(true);
//               }}
//             >
//               View Live Route
//             </button>
//           </div>
//         </div>
//       </div>

//       {coords &&
//       coords.lat != null &&
//       coords.long != null &&
//       currentStatus !== false ? (
//         <div className="flex-1 overflow-y-auto max-h-screen">
//           <ToastContainer /> {/* Toast container for react-toastify */}
//           <>
//             <div className="bg-white border border-gray-200 relative z-0 overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent"></div>

//               <MapContainer
//                 center={[coords.lat, coords.long]}
//                 zoom={17}
//                 style={{ height: "59vh", width: "100%" }}
//                 className="rounded-lg"
//               >
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <AnimatedMarker position={[coords.lat, coords.long]} />
//               </MapContainer>
//             </div>
//           </>
//           <div className="speed relative -top-16 bg-gradient-to-r from-blue-800 to-blue-900 p-1 md:p-7 rounded-md shadow-lg text-center w-fit m-auto text-white flex justify-center items-center align-middle">
//             <span className="mx-2">
//               <strong>
//                 {((coords && coords.speed ? (coords.speed) : 0) * 3.6).toFixed(2)} km / hr
//               </strong>
//             </span>
//           </div>
//           <div className="bg-gray-100  p-6 rounded-lg relative -top-14 stop-track-detail h-auto">
//             <div className="flex justify-between mb-4 text-sm">
//               <span>{firstStop}</span>
//               <span>{lastStop}</span>
//             </div>
//             <div className="relative w-full bg-gray-200 rounded-full h-2.5 ">
//               <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-green-500 rounded-full"></div>
//               <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-green-500 rounded-full"></div>
//             </div>
//             <div className="flex justify-between mt-4">
//               <div>
//                 <span className="block text-sm font-semibold">
//                   Previous Stop
//                 </span>
//                 <span className="block text-sm">{nextStop}</span>
//               </div>
//               <div>
//                 <span className="block text-sm font-semibold">Next Stop</span>
//                 <span className="block text-sm">{toReach}</span>
//               </div>
//             </div>
//           </div>
//           {/* Overlay for drawer */}
//           <div
//             className={`fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-40 ${
//               drawer ? "block" : "hidden"
//             }`}
//             onClick={() => setDrawer(false)} // Close drawer on overlay click
//           ></div>
//           {/* Drawer component */}
//           <div
//             id="drawer-bottom-example"
//             className={`fixed bottom-0 left-0 right-0 z-50 w-full p-4 overflow-y-auto transition-transform bg-white transform ${
//               drawer ? "translate-y-0" : "translate-y-full"
//             } ease-in-out duration-300`}
//             tabIndex={-1}
//             aria-labelledby="drawer-bottom-label"
//           >
//             <div className="flex justify-between items-center">
//               <h5
//                 id="drawer-bottom-label"
//                 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 "
//               >
//                 <svg
//                   className="w-4 h-4 mr-2"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
//                 </svg>
//                 Bus Status
//               </h5>
//               <button
//                 type="button"
//                 data-drawer-hide="drawer-bottom-example"
//                 aria-controls="drawer-bottom-example"
//                 className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center "
//                 onClick={() => {
//                   setDrawer(false);
//                 }}
//               >
//                 <svg
//                   className="w-3 h-3"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 14 14"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
//                   />
//                 </svg>
//                 <span className="sr-only">Close menu</span>
//               </button>
//             </div>
//             <span className="text-sm text-gray-400">
//               Updated Few Seconds Ago...
//             </span>
//             <div className="rounded-lg relative overflow-auto h-64 hide-scrollbar mt-3">
//               {routeStops.map((stop, index) => (
//                 <div className="max-w-sm bg-gradient-to-r bg-gray-700  text-white p-4 relative rounded-lg mt-1">
//                   {/* Vertical bar with ball */}
//                   {/* <div className="absolute left-0 top-0 bottom-0 flex items-center">
//                 <img src={stop.reached ? reachedIcon : unreachedIcon} alt="Vertical Bar" className="h-full rounded-l-lg" />
//               </div> */}
//                   {/* Content */}
//                   <div className="ml-1">
//                     {" "}
//                     {/* Adjusted margin */}
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm ">Arrival Time :</span>
//                       <span className="text-sm">{stop.arrivalTime}</span>
//                     </div>
//                     <div className="flex justify-between items-center mt-4">
//                       <span className="text-sm ">Stop Name : </span>
//                       <span className="text-sm font-bold flex items-center">
//                         {stop.name}
//                         <span
//                           className={`ml-2 w-3 h-3 ${
//                             stop.reached ? "bg-green-500" : "bg-red-500"
//                           } rounded-full`}
//                         ></span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-screen">
//           <img src={loader} alt="Loading..." width={"50px"} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewLocation;



import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customMarkerIcon from "../../pin.png";
import busstopIcon from "../../busStop.png";
// import busstopIcon from "./bus-stop.png";
import L from "leaflet";
import socketIOClient from "socket.io-client";
import loader from "./Book.gif";

const ENDPOINT = process.env.REACT_APP_API_BASE_URL; // Replace with your socket server URL

const customIcon = L.icon({
  iconUrl: customMarkerIcon,
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


const stopIcon = L.icon({
  iconUrl: busstopIcon, // Path to your custom icon image
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
});

const ViewLocation = () => {
  const { senderId, routeId } = useParams();
  const [coords, setCoords] = useState(null); // Initialize coords as null initially
  const [locationEnded, setLocationEnded] = useState(false); // State to track if location has ended
  const [stops, setStops] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(false);
  const [drawer, setDrawer] = useState(false);  
  const [nextStop, setNextStop] = useState("");
  const [toReach, setToReach] = useState("");
  const [firstStop, setFirstStop] = useState("");
  const [lastStop, setLastStop] = useState("");

  const fetchStops = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/trips`);
      if (!response.ok) {
        throw new Error("Failed to fetch stops");
      }
      const tripsData = await response.json();
      const trip = tripsData.find((trip) => trip.tripCode === senderId);
      if (trip) {
        setStops(trip.stop || []);

        // Set first and last stops
        setFirstStop(trip.stop.length ? trip.stop[0].name : "N/A");
        setLastStop(
          trip.stop.length ? trip.stop[trip.stop.length - 1].name : "N/A"
        );

        // Filter stops into reached and unreached
        const reachedStops = trip.stop.filter((stop) => stop.reached);
        const unreachedStops = trip.stop.filter((stop) => !stop.reached);

        // Set next stop and to reach values
        setNextStop(
          reachedStops.length
            ? reachedStops[reachedStops.length - 1].name
            : "N/A"
        );
        setToReach(unreachedStops.length ? unreachedStops[0].name : "Trip Ended");
      } else {
        throw new Error("Trip not found");
      }
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

  const checkCurrentStatus = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/trips`);
      if (!response.ok) {
        throw new Error("Failed to fetch current status");
      }
      const tripData = await response.json();
      const trip = tripData.find((trip) => trip.tripCode === senderId);
      setCurrentStatus(trip ? trip.currentStatus : false); // Update currentStatus state
    } catch (error) {
      console.error("Error fetching current status:", error);
    }
  };

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
  
    newSocket.on("connect", () => {
      console.log("Connected to server");
  
      // Emit refresh event on connection
      newSocket.emit("org-joinStudentRoom", "refresh");

    });
  
    newSocket.on("org-locationEnded", (data) => {
      setLocationEnded(true);
      toast.info("Location sharing has ended.", {
        theme: "dark",
        position: "bottom-center",
        autoClose: 3000,
        onClose: () => {
          window.location.href = "/student/TrackLocation";
        },
      });
    });
  
    newSocket.on("org-locationUpdate", (data) => {
      setCoords({
        lat: data.lat,
        long: data.long,
        speed: data.speed,
        accuracy: data.accuracy,
        altitude: data.altitude,
      });
      fetchStops();
      checkCurrentStatus();
    });
  
    setSocket(newSocket);
  
    // Cleanup socket connection
    return () => {
      console.log("Disconnecting socket");
      newSocket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (senderId && socket) {
      socket.emit("joinStudentRoom", senderId);

      return () => {
        socket.emit("leaveStudentRoom", senderId);
      };
    }
  }, [senderId, socket]);

  useEffect(() => {
    // Function to check current status from database

    checkCurrentStatus();
  }, [senderId]);

  useEffect(() => {
    // Show last known location if coords are null or undefined
    const showLastKnownLocation = () => {
      if (!coords || !coords.lat || !coords.long) {
        setCoords(null);
      }
    };

    showLastKnownLocation();
  }, [coords]);

  function convertToIST(dateTimeString) {
    // Parse the input date-time string
    const date = new Date(dateTimeString);

    // Convert the UTC time to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istTime = new Date(date.getTime() + istOffset);

    // Get hours and minutes
    let hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Format minutes with leading zero if needed
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Return the formatted time string
    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  const routeStops = stops.map((stop) => ({
    name: stop.name,
    reached: stop.reached, // Assuming stop.reached is the boolean value
    arrivalTime: stop.arrivalTime
      ? convertToIST(stop.arrivalTime)
      : "Yet To Arrive",
  }));

  const AnimatedMarker = ({ position }) => {
    const map = useMap();

    useEffect(() => {
      if (position) {

        map.setView(position, map.getZoom());
      }
    }, [position, map]);

    return (
      <Marker position={position} icon={customIcon}>
        <Popup>
          <strong>{firstStop.toUpperCase()}</strong> -{" "}
          <strong>{lastStop.toUpperCase()}</strong>
        </Popup>
      </Marker>
    );
  };


  const StopMarkers = ({ stops }) => {
    return stops.map((stop, index) => (
      <Marker key={index} position={[stop.lat, stop.long]} icon={stopIcon}>
        <Popup>{stop.name}</Popup>
      </Marker>
    ));
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Link to="/student/TrackLocation" className="text-lg font-semibold">
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
            <h1 className="text-lg font-semibold">Track Location</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Additional buttons/icons here */}
            <button
              className="text-black py-2 px-4 bg-gray-200 rounded-full font-semibold text-sm"
              type="button"
              data-drawer-target="drawer-bottom-example"
              data-drawer-show="drawer-bottom-example"
              data-drawer-placement="bottom"
              aria-controls="drawer-bottom-example"
              onClick={() => {
                setDrawer(true);
              }}
            >
              View Live Route
            </button>
          </div>
        </div>
      </div>

      {coords &&
      coords.lat != null &&
      coords.long != null &&
      currentStatus !== false ? (
        <div className="flex-1 overflow-y-auto max-h-screen">
          <ToastContainer /> {/* Toast container for react-toastify */}
          <>
            <div className="bg-white border border-gray-200 relative z-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent"></div>

              <MapContainer
                center={[coords.lat, coords.long]}
                zoom={17}
                style={{ height: "59vh", width: "100%" }}
                className="rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <AnimatedMarker position={[coords.lat, coords.long]} />
                <StopMarkers stops = {stops} />
              </MapContainer>
            </div>
          </>
          <div className="speed relative -top-16 bg-gradient-to-r from-blue-800 to-blue-900 p-1 md:p-7 rounded-md shadow-lg text-center w-fit m-auto text-white flex justify-center items-center align-middle">
            <span className="mx-2">
              <strong>
                {(coords && coords.speed ? Math.round(coords.speed) : 0) * 3.6} km / hr
              </strong>
            </span>
          </div>
          <div className="bg-gray-100  p-6 rounded-lg relative -top-14 stop-track-detail h-auto">
            <div className="flex justify-between mb-4 text-sm">
              <span>{firstStop}</span>
              <span>{lastStop}</span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-2.5 ">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <span className="block text-sm font-semibold">
                  Previous Stop
                </span>
                <span className="block text-sm">{nextStop}</span>
              </div>
              <div>
                <span className="block text-sm font-semibold">Next Stop</span>
                <span className="block text-sm">{toReach}</span>
              </div>
            </div>
          </div>
          {/* Overlay for drawer */}
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
                Bus Status
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
            <span className="text-sm text-gray-400">
              Updated Few Seconds Ago...
            </span>
            <div className="rounded-lg relative overflow-auto h-64 hide-scrollbar mt-3">
              {routeStops.map((stop, index) => (
                <div className="max-w-sm bg-gradient-to-r bg-gray-700  text-white p-4 relative rounded-lg mt-1">
                  {/* Vertical bar with ball */}
                  {/* <div className="absolute left-0 top-0 bottom-0 flex items-center">
                <img src={stop.reached ? reachedIcon : unreachedIcon} alt="Vertical Bar" className="h-full rounded-l-lg" />
              </div> */}
                  {/* Content */}
                  <div className="ml-1">
                    {" "}
                    {/* Adjusted margin */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm ">Arrival Time :</span>
                      <span className="text-sm">{stop.arrivalTime}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm ">Stop Name : </span>
                      <span className="text-sm font-bold flex items-center">
                        {stop.name}
                        <span
                          className={`ml-2 w-3 h-3 ${
                            stop.reached ? "bg-green-500" : "bg-red-500"
                          } rounded-full`}
                        ></span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <img src={loader} alt="Loading..." width={"50px"} />
        </div>
      )}
    </div>
  );
};

export default ViewLocation;