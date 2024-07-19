import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function OrganizationLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/org-login`, {
        email,
        password
      });
      if (response.data.auth) {
        localStorage.setItem('user', JSON.stringify(response.data.user._id));
        localStorage.setItem('token', JSON.stringify(response.data.auth));
        const currentUser = JSON.parse(localStorage.getItem('user'));
        setUser(currentUser);
        navigate("/org/home");
      } else if (response.data === "incorrect") {
        alert("Password does not match");
      } else if (response.data === "notexist") {
        alert("User does not exist");
      }
    } catch (error) {
      alert("Server Error. Please try again later.");
      console.error('Axios Error:', error);
    }
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="mt-8"></div>
        <div className="m-auto bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8">
          <form onSubmit={submit} className="m-auto">
            <h3 className="text-xl font-medium text-gray-900 text-center mb-3">
              Log in to our platform (Org)
            </h3>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Your email
              </label>
              <input 
                type="email" 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder='Enter Email Address' 
                required 
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Your password
              </label>
              <input 
                type="password" 
                name='password' 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder='Enter Password' 
                required 
              /> 
              <br />
            </div>
            <div className="flex items-start">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded"
                    required=""
                  />
                </div>
                <div className="text-sm ml-3">
                  <label
                    htmlFor="remember"
                    className="font-medium text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Link
                to=""
                className="text-sm text-blue-700 hover:underline ml-auto"
              >
                Lost Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full my-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login to your account
            </button>
            <div className="text-sm font-medium text-gray-500">
              Not registered?{" "}
              <Link
                to="/org/signup"
                className="text-blue-700 hover:underline"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
        <div className="mt-8"></div>
      </div>
    </>
  )
}
