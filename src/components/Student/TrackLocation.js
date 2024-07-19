import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { useNavigate, Link } from "react-router-dom";
import loader from "./Book.gif"
import StudentValidate from "./StudentValidate";

const ENDPOINT = process.env.REACT_APP_API_BASE_URL; // Replace with your socket server URL

export default function TrackLocation() {
  const user = StudentValidate()
  const [data, setData] = useState([]);
  const [trips, setTrips] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true when fetching data starts

        const driverResponse = await axios.get(`${ENDPOINT}/driver`);
        const tripResponse = await axios.get(`${ENDPOINT}/trips`);

        const combinedData = driverResponse.data.map((driver) => ({
          driverName: driver.name,
          vehicleName: driver.vehicleName || "N/A",
          vehicleId: driver.vehicleNo,
          routeId: driver.routeId,
          org:driver.org
        }));

        setData(combinedData);
        setTrips(tripResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data fetch completes (whether success or error)
      }
    };

    fetchData();
  }, []);





  const navigate = useNavigate();
  const handleViewLocation = (tripCode, routeId) => {
    const url = `/student/ViewLocation/${tripCode}/${routeId}`;
    navigate(url);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-b border-gray-200">
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
                  d="M12 2c2.97 0 5.4 2.448 5.4 5.468 0 3.157-2.073 7.72-5.4 13.532-3.327-5.812-5.4-10.375-5.4-13.532C6.6 4.448 9.03 2 12 2zm0 7.49a2.38 2.38 0 100-4.76 2.38 2.38 0 000 4.76z"
                />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold">Track Location</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Additional buttons/icons here */}
            <button
              className="text-black py-2 px-4 bg-gray-200 rounded-full font-semibold"
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

      {isLoading ? ( // Conditional rendering based on isLoading state
        <div className="flex items-center justify-center h-screen">
       <img src = {loader} alt="Loading..." width={"50px"}/>
        </div>
      ) : (
        <div className="bg-gray-100 py-6 flex flex-col sm:py-12" style={{ height: "88vh" }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-4">
              {data.filter((e=>e.org===user.org)).map((item, index) => {
                const driverTrips = trips.filter((f) => f.vehicleId === item.vehicleId);
                const latestTrip = driverTrips.length > 0 ? driverTrips[driverTrips.length - 1] : null;

                return (
                  <div key={index} className="bg-white rounded-lg p-4 w-full border">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h2 className="text-base text-nowrap font-bold text-gray-900 capitalize">{item.driverName}</h2>
                        <p className="text-gray-600 uppercase">{item.vehicleName}</p>
                      </div>
                      <div>
                        {latestTrip && latestTrip.currentStatus ? (
                          <button
                            className="w-full bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 text-center"
                            onClick={() => handleViewLocation(latestTrip.tripCode, item.routeId)}
                          >
                            View Location
                          </button>
                        ) : (
                          <button
                            className="w-full bg-red-100  text-red-800 text-sm font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            disabled
                          >
                            Not Sharing
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
