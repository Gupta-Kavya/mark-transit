import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <>
          <header className="bg-blue-700 text-white py-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-bold">Mark Transit</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="hover:text-blue-200">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-200">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-200">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  {/* Hero Section */}
  <section className="bg-blue-600 text-white py-20">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold mb-4">Welcome to Mark Transit</h2>
      <p className="text-xl mb-8">Your reliable partner in transportation</p>
      <a
        href="#"
        className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-200"
      >
                <Link to={"/Login"}>Get Started</Link>
                </a>
    </div>
  </section>
  {/* Footer */}
  <footer className="bg-blue-700 text-white py-4">
    <div className="container mx-auto text-center">
      <p>© 2024 Mark Transit. All rights reserved.</p>
    </div>
  </footer>
            {/* <div className="flex mx-3">
                <Link to={"/driver/login"}>Driver</Link>
                <Link to={"/student/login"}>Student</Link>
                <Link to={"/org/login"}>Organization</Link>
                <Link to={"/choice"}>Choice</Link>
                <Link to={"/Login"}>Login</Link>
            </div> */}

        </>)
}
