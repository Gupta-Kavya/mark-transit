import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import OrgValidate from "./OrgValidate";

const AddRoute = () => {
  const user = OrgValidate()
  const [routeName, setRouteName] = useState("");
  const [organization, setOrganization] = useState("");
  const [stops, setStops] = useState([{ stopId: "", sequence: 1 }]);
  const [allStops, setAllStops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch available stops from the API
    const fetchStops = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/stops`);
        setAllStops(response.data);
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };

    fetchStops();
  }, []);
  const handleAddStop = () => {
    setStops([...stops, { stopId: "", sequence: stops.length + 1 }]);
  };

  const handleRemoveStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops.map((stop, i) => ({ ...stop, sequence: i + 1 })));
  };

  const handleStopChange = (index, value) => {
    const newStops = stops.map((stop, i) =>
      i === index ? { ...stop, stopId: value } : stop
    );
    setStops(newStops);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stops.length < 2) {
      toast.error("A route must have at least 2 stops");
      return;
    }
    setIsLoading(true);

    const newRoute = {
      name: routeName,
      org: user._id,
      stop: stops.map((stop) => ({
        id: stop.stopId,
        name: allStops.find((s) => s._id === stop.stopId)?.name,
        sequence: stop.sequence,
        lat : allStops.find((s) => s._id === stop.stopId)?.lat,
        long : allStops.find((s) => s._id === stop.stopId)?.long,

      })),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-route`, newRoute);
      toast.success("Route added successfully");
      // Clear form
      setRouteName("");
      setOrganization("");
      setStops([{ stopId: "", sequence: 1 }]);
    } catch (error) {
      toast.error("Error adding route");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Route</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="routeName" className="block mb-2 text-sm font-medium text-gray-900">
              Route Name
            </label>
            <input
              type="text"
              id="routeName"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
              placeholder="Enter route name"
              required
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stops</h3>
          {stops.map((stop, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 items-center">
              <div>
                <label htmlFor={`stop-${index}`} className="block mb-2 text-sm font-medium text-gray-900">
                  Stop
                </label>
                <select
                  id={`stop-${index}`}
                  value={stop.stopId}
                  onChange={(e) => handleStopChange(index, e.target.value)}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                  required
                >
                  <option value="" disabled>Select stop</option>
                  {allStops.filter((e=>e.org===user._id)).map((stop) => (
                    <option key={stop._id} value={stop._id}>{stop.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`sequence-${index}`} className="block mb-2 text-sm font-medium text-gray-900">
                  Sequence
                </label>
                <input
                  type="text"
                  id={`sequence-${index}`}
                  value={stop.sequence}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                  placeholder="Sequence"
                  disabled
                />
              </div>
              <div className="flex items-center mt-6 space-x-2">
                {stop.sequence != 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(index)}
                    className="text-white bg-red-600 hover:bg-red-800 p-2 rounded-lg"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="text-white bg-green-600 hover:bg-green-800 p-2 rounded-lg"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 text-center text-white bg-gray-900 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoute;
