import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function OrgSignup() {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useNavigate();

    async function submit(e) {
        e.preventDefault();

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/org-signup`, {
                name, email, password, contact
            });
            if (res.data === "exist") {
                alert("Already Exist");
            } else if (res.data === "notexist") {
                alert("User Registered");
                history("/org/login", { state: { id: email } });
            }
        } catch (error) {
            alert("Invalid Details");
            console.log(error);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mt-8"></div>
            <div className="m-auto bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit} className="m-auto">
                    <h3 className="text-xl font-medium text-gray-900 text-center mb-3">
                        Sign up to our platform (Org)
                    </h3>
                    <div>
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-900 block mb-2"
                        >
                            Organization Name
                        </label>
                        <input
                            onChange={(e) => { setName(e.target.value); }}
                            placeholder="Enter Your Name"
                            name="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-900 block mb-2"
                        >
                            Organization Email
                        </label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="contact"
                            className="text-sm font-medium text-gray-900 block mb-2"
                        >
                            Organization Contact
                        </label>
                        <input
                            // pattern="[0-9]{10}"
                            type="text"
                            onChange={(e) => { setContact(e.target.value); }}
                            placeholder="Enter Your Contact"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-900 block mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Your Password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full my-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Create Account
                    </button>
                    <div className="text-sm font-medium text-gray-500">
                        Already registered?{" "}
                        <Link
                            to="/org/login"
                            className="text-blue-700 hover:underline"
                        >
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
            <div className="mt-8"></div>
        </div>
    );
}
