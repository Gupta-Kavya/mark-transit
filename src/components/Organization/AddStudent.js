import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'flowbite';
import Sidebar from './Sidebar';
import OrgValidate from './OrgValidate';

export const AddStudent = () => {
  const user = OrgValidate();
  const sendEmail = async (to, subject, message, fromEmail) => {
    try {
      const response = await axios.post(
        "https://smartlinksoft.in/api/email.php",
        {
          to: to,
          subject: subject,
          message: message,
          from_email: fromEmail
        }
      );
      // console.log(response.data);
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const pwdGen = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [stops, setStops] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: user._id,
    contact: '',
    emergencyContact: '',
    stop: '',
    password: pwdGen(8), // Generate initial random password
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/stops`);
        setStops(response.data);
      } catch (error) {
        toast.error('Error fetching stops.');
      }
    };

    fetchStops();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedStop = stops.find((stop) => stop._id === formData.stop);

      if (selectedStop) {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-student`, {
          ...formData,
          stop: selectedStop._id,
          org: user._id, // Ensure org is user._id when submitting
        });
        toast.success('Student added successfully!');
        await sendEmail(formData.email, 'Welcome to Mark Transit', `Your password is: ${formData.password} \n\nThank you\nTeam @Mark Transit`,`markdigital@gmail.com`);

        setFormData({
          name: '',
          email: '',
          org: user._id, // Reset org to user._id
          contact: '',
          emergencyContact: '',
          stop: '',
          password: pwdGen(8),
        });
      } else {
        toast.error('Selected stop not found.');
      }
    } catch (error) {
      toast.error('Error adding student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <ToastContainer />
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-900">
                Contact
              </label>
              <input
                type="text"
                id="contact"
                value={formData.contact}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                placeholder="Contact Number"
                required
              />
            </div>
            <div>
              <label htmlFor="emergencyContact" className="block mb-2 text-sm font-medium text-gray-900">
                Emergency Contact
              </label>
              <input
                type="text"
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                placeholder="Emergency Contact"
                required
              />
            </div>

            <div>
              <label htmlFor="stop" className="block mb-2 text-sm font-medium text-gray-900">
                Stop
              </label>
              <select
                id="stop"
                value={formData.stop}
                onChange={handleChange}
                required
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
              >
                <option value="">Select Stop</option>
                {stops.filter((e => e.org === user._id)).map((stop) => (
                  <option key={stop._id} value={stop._id}>
                    {stop.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 text-center text-white bg-gray-900 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddStudent;
