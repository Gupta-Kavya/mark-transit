import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook
import OrgValidate from './OrgValidate';

function EditRoutes() {
  const user = OrgValidate()

  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate(); // Initialize useHistory hook

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/route`)
      .then(response => {
        setRoutes(response.data);
      })
      .catch(error => {
        console.error('Error fetching routes:', error);
      });
  }, []);

  // Function to handle click on Edit button
  const handleEditRoute = (routeId) => {
    navigate(`${routeId}`); // Navigate to /edit/routeId
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Routes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">Route Name</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {routes.filter((e=>e.org===user._id)).map(route => (
              <tr key={route._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{route.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleEditRoute(route._id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditRoutes;
