import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DriverLogin() {

  const navigate = useNavigate();
  const [user, setUser] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver-login`, {
        email,
        password
      });
      if (response.data.auth) {
        // console.log(response.data.user)
        // localStorage.setItem('user', JSON.stringify(response.data.user.email));
        localStorage.setItem('user', JSON.stringify(response.data.user._id));
        localStorage.setItem('token', JSON.stringify(response.data.auth));
        const currentUser = JSON.parse(localStorage.getItem('user'));
        setUser(currentUser);
        navigate("/driver/home");
        
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
  <div className="m-auto bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
    <form onSubmit={submit} className=" m-auto ">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-3">
        Log in to our platform(Driver)
      </h3>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
        >
          Your email
        </label>
        <input type="email" onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder='Enter Email Address' required />
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
        >
          Your password
        </label>

        <input type="password" name='password' onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder='Enter Password' required /> <br />
      </div>
      <div className="flex items-start">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required=""
            />
          </div>
          <div className="text-sm ml-3">
            <label
              htmlFor="remember"
              className="font-medium text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
        </div>
        <Link
          to=""
          className="text-sm text-blue-700 hover:underline ml-auto dark:text-blue-500"
        >
          Lost Password?
        </Link>
      </div>

      <button
        type="submit"
        className="w-full my-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login to your account
      </button>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        Not registered?{" "}Contact Organization
        
      </div>
    </form>
  </div>
  <div className="mt-8"></div>

</div>

</>  )
}
