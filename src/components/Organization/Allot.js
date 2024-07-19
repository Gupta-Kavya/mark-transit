import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrgValidate from './OrgValidate';

const Allot = () => {
  const user = OrgValidate()
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch drivers, available vehicles, and routes from the API
    const fetchData = async () => {
      try {
        const [driversResponse, vehiclesResponse, routesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/driver`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/vehicle`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/route`)
        ]);

        setDrivers(driversResponse.data);
        setVehicles(vehiclesResponse.data);
        setRoutes(routesResponse.data);
      } catch (error) {
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (driverId, vehicleNo, routeId , vehicleName , routeName) => {
    setIsLoading(true);

    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-driver/${driverId}`, {
        vehicleNo,
        routeId,
        vehicleName,
        routeName
      });
      setDrivers(prevDrivers =>
        prevDrivers.map(driver =>
          driver._id === driverId
            ? { ...driver, vehicleNo, vehicleName, routeId, routeName }
            : driver
        )
      );

      toast.success('Driver updated successfully');
    } catch (error) {
      toast.error('Error updating driver');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
    <ToastContainer />
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Allot Vehicles and Routes</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">Driver Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Phone Number</th>
            <th scope="col" className="px-6 py-3">Vehicle</th>
            <th scope="col" className="px-6 py-3">Route</th>
            {/* <th scope="col" className="px-6 py-3">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {drivers.filter((e => e.org === user._id)).map(driver => (
            <tr key={driver._id} className="bg-white border-b">
              <td className="px-6 py-4">{driver.name}</td>
              <td className="px-6 py-4">{driver.email}</td>
              <td className="px-6 py-4">{driver.contact}</td>
              <td className="px-6 py-4">
                <select
                  onChange={(e) => {
                    const vehicleId = e.target.value;
                    const vehicleName = vehicles.find(v => v._id === vehicleId)?.name || '';
                    handleUpdate(driver._id, vehicleId, driver.routeId, vehicleName, routes.find(r => r._id === driver.routeId)?.name || '');
                  }}
                  value={driver.vehicleNo || ""}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                >
                  <option value="">Select vehicle</option>
                  {vehicles.filter((e => e.org === user._id)).map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>{vehicle.name}</option>
                  ))}
                </select>
                {driver.vehicleNo && (
                  <small className="text-red-500 block mt-1 font-semibold">Current: {vehicles.find(v => v._id === driver.vehicleNo)?.name}</small>
                )}
              </td>
              <td className="px-6 py-4">
                <select
                  onChange={(e) => {
                    const routeId = e.target.value;
                    const routeName = routes.filter((e => e.org === user._id)).find(r => r._id === routeId)?.name || '';
                    handleUpdate(driver._id, driver.vehicleNo, routeId, vehicles.find(v => v._id === driver.vehicleNo)?.name || '', routeName);
                  }}
                  value={driver.routeId || ""}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                >
                  <option value="">Select route</option>
                  {routes.filter((e => e.org === user._id)).map(route => (
                    <option key={route._id} value={route._id}>{route.name}</option>
                  ))}
                </select>
                {driver.routeId && (
                  <small className="text-red-500 block mt-1 font-semibold">Current: {routes.find(r => r._id === driver.routeId)?.name}</small>
                )}
              </td>
              {/* <td className="px-6 py-4">
              <button
                  onClick={() => handleUpdate(driver._id, driver.vehicleId, driver.routeId, vehicles.find(v => v._id === driver.vehicleId)?.name || '', routes.find(r => r._id === driver.routeId)?.name || '')}
                  className="text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default Allot;
