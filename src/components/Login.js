import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateToken, messaging } from "../notifications/firebase";
import { onMessage } from "firebase/messaging";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("Org");
  const [user, setUser] = useState("");

  async function submit(e) {
    e.preventDefault();

    const endpoints = {
      Org: `${process.env.REACT_APP_API_BASE_URL}/org-login`,
      Student: `${process.env.REACT_APP_API_BASE_URL}/student-login`,
      Driver: `${process.env.REACT_APP_API_BASE_URL}/driver-login`,
    };

    try {
      const response = await axios.post(endpoints[loginType], {
        email,
        password,
      });

      if (response.data.auth) {
        localStorage.setItem("user", JSON.stringify(response.data.user._id));
        if (loginType === "Student") {
          localStorage.setItem(
            "stopId",
            JSON.stringify(response.data.user.stop)
          );
          if (
            JSON.parse(localStorage.getItem("user")) &&
            JSON.parse(localStorage.getItem("stopId"))
          ) {
            const token = generateToken(
              JSON.parse(localStorage.getItem("stopId")),
              JSON.parse(localStorage.getItem("user"))
            );
            if (token) {
              navigate("/student/home");
            }
          }
        }
        localStorage.setItem("token", JSON.stringify(response.data.auth));
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setUser(currentUser);

        toast.success("Login successful!");

        if (loginType === "Org" || loginType === "Driver") {
          navigate(`/${loginType.toLowerCase()}/home`);
        }
      } else if (response.data === "incorrect") {
        toast.error("Password does not match");
      } else if (response.data === "notexist") {
        toast.error("User does not exist");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
      console.error("Axios Error:", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg w-full max-w-md p-6 space-y-6">
        <form onSubmit={submit} className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900 text-center">
            Mark Logistics
          </h3>
          <div>
            <label
              htmlFor="loginType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Login as
            </label>
            <select
              id="loginType"
              onChange={(e) => setLoginType(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="Org">Organisation</option>
              <option value="Student">Student</option>
              <option value="Driver">Driver</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Log in
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
