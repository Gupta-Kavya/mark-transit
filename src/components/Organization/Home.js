import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import OrgValidate from './OrgValidate';
import { Link } from 'react-router-dom';

export default function Home(props) {
  const { driver,student,stops,route,vehicle,trips } = props
  const user = OrgValidate()



  const orgDrivers = driver.filter((e=>e.org===user._id))
  const orgDriversNumber = orgDrivers.length
  const orgStudents = student.filter((e=>e.org===user._id))
  const orgStudentsNumber = orgStudents.length
  const orgRoute = route.filter((e=>e.org===user._id))
  const orgRouteNumber = orgRoute.length
  const orgStop = stops.filter((e=>e.org===user._id))
  const orgStopNumber = orgStop.length
  const orgVehicle = vehicle.filter((e=>e.org===user._id))
  const orgVehicleNumber = orgVehicle.length
  const orgTrips = trips.filter((e=>e.org===user._id))
  const orgTripsNumber = orgTrips.length


  return (
    <div className="   ">

      {/* Start SideBar */}
      <div className="main">
        <div className="flex flex-col flex-1 w-full overflow-y-auto">
          {/* Start Topbar */}
          {/* End Topbar */}
          <main className="relative z-0 flex-1 pb-8 px-6 bg-white">
            <div className="grid pb-10 mt-4 ">
              {/* Start Content */}
              <div className="mb-2">
                <p className="text-lg font-semibold text-gray-400">Analytics</p>
              </div>
              <div className="grid grid-cols-12 gap-6 border-b-2 pb-5">
                <div className="flex justify-between col-span-12 sm:col-span-12 md:col-span-8 lg:col-span-8 xxl:col-span-8">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 mt-3">
                    <div className="p-4">
                      <p className="text-xl font-bold">{orgDriversNumber}</p>
                      <p className="text-xs font-semibold text-gray-400">Total Drivers</p>
                    </div>
                    <div className="p-4">
                      <p className="text-xl pl-8 font-bold">{orgStudentsNumber}</p>
                      <p className="text-xs font-semibold text-gray-400">Total Students</p>
                    </div>
                    <div className="p-4">
                      <p className="text-xl font-bold pl-5">{orgStopNumber}</p>
                      <p className="text-xs font-semibold text-gray-400">Total Stops</p>
                    </div>
                    <div className=" p-4">
                      <p className="text-xl font-bold">{orgRouteNumber}</p>
                      <p className="text-xs font-semibold text-gray-400">Total Routes</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-12 md:col-span-4 lg:col-span-4 xxl:col-span-4">
                  <div className="p-4">
                    <p className="text-sm text-gray-400">Monthly Trips  : 100</p>
                    <div className="shadow w-full bg-gray-100 mt-2">
                      <div className="bg-indigo-600 text-xs leading-none py-1 text-center text-white" style={{ width: `${orgTripsNumber}%` }}></div>

                    </div>
                    <p className="text-xs font-semibold text-gray-400 mt-2">Progress : {orgTripsNumber} %</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 mt-3">
                <div className="relative w-full h-52 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out" style={{ backgroundImage: "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f868ecef-4b4a-4ddf-8239-83b2568b3a6b/de7hhu3-3eae646a-9b2e-4e42-84a4-532bff43f397.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4NjhlY2VmLTRiNGEtNGRkZi04MjM5LTgzYjI1NjhiM2E2YlwvZGU3aGh1My0zZWFlNjQ2YS05YjJlLTRlNDItODRhNC01MzJiZmY0M2YzOTcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R0h-BS0osJSrsb1iws4-KE43bUXHMFvu5PvNfoaoi8o')" }}>
                  <div className="absolute inset-0 bg-pink-900 bg-opacity-75 transition duration-300 ease-in-out"></div>
                  <div className="relative w-full h-full px-4 sm:px-6 lg:px-4 flex items-center justify-center">
                    <div>
                      <h3 className="text-center text-white text-lg">
                        Total Kilometers Driven
                      </h3>
                      <h3 className="text-center text-white text-3xl mt-2 font-bold">
                        {33 * 9} Km
                      </h3>
                      <div className="flex space-x-4 mt-4">
                        <button className="block uppercase mx-auto shadow bg-white text-indigo-600 focus:shadow-outline focus:outline-none hover:opacity-80   text-xs py-3 px-4 rounded font-bold">
                          Fuel
                        </button>
                        <Link to={"/org/FuelBreakdown"} className="block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-4 rounded font-bold">
                          Breakdown
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-52 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out" style={{ backgroundImage: "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f868ecef-4b4a-4ddf-8239-83b2568b3a6b/de7hhu3-3eae646a-9b2e-4e42-84a4-532bff43f397.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4NjhlY2VmLTRiNGEtNGRkZi04MjM5LTgzYjI1NjhiM2E2YlwvZGU3aGh1My0zZWFlNjQ2YS05YjJlLTRlNDItODRhNC01MzJiZmY0M2YzOTcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R0h-BS0osJSrsb1iws4-KE43bUXHMFvu5PvNfoaoi8o')" }}>
                  <div className="absolute inset-0 bg-green-700 bg-opacity-75 transition duration-300 ease-in-out"></div>
                  <div className="relative w-full h-full px-4 sm:px-6 lg:px-4 flex items-center justify-center">
                    <div>
                      <h3 className="text-center text-white text-lg">
                        Total Trips Taken
                      </h3>
                      <h3 className="text-center text-white text-3xl mt-2 font-bold">
                        {orgTripsNumber}
                      </h3>
                      <div className="flex space-x-4 mt-4">
                        {/* <button className="block uppercase mx-auto shadow bg-white text-indigo-600 focus:shadow-outline focus:outline-none  text-xs py-3 px-4 rounded font-bold">
                          Transfer
                        </button> */}
                     <Link to={"/org/TripsBreakdown"} className="block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-4 rounded font-bold">
                          Breakdown
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-52 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out" style={{ backgroundImage: "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f868ecef-4b4a-4ddf-8239-83b2568b3a6b/de7hhu3-3eae646a-9b2e-4e42-84a4-532bff43f397.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4NjhlY2VmLTRiNGEtNGRkZi04MjM5LTgzYjI1NjhiM2E2YlwvZGU3aGh1My0zZWFlNjQ2YS05YjJlLTRlNDItODRhNC01MzJiZmY0M2YzOTcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R0h-BS0osJSrsb1iws4-KE43bUXHMFvu5PvNfoaoi8o')" }}>
                  <div className="absolute inset-0 bg-yellow-600 bg-opacity-75 transition duration-300 ease-in-out"></div>
                  <div className="relative w-full h-full px-4 sm:px-6 lg:px-4 flex items-center">
                    <div>
                      <div className="text-white text-lg flex space-x-2 items-center">
                        <div className="bg-white rounded-md p-2 flex items-center">
                          <i className="fas fa-toggle-off fa-sm text-yellow-300"></i>
                        </div>
                        <p>Total Students </p>
                      </div>
                      <h3 className="text-white text-3xl mt-2 font-bold">
                        {orgStudentsNumber}
                      </h3>
                      <h3 className=" text-lg mt-2 text-yellow-100 ">
                        From {orgStopNumber} Stops
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-52 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out" style={{ backgroundImage: "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f868ecef-4b4a-4ddf-8239-83b2568b3a6b/de7hhu3-3eae646a-9b2e-4e42-84a4-532bff43f397.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4NjhlY2VmLTRiNGEtNGRkZi04MjM5LTgzYjI1NjhiM2E2YlwvZGU3aGh1My0zZWFlNjQ2YS05YjJlLTRlNDItODRhNC01MzJiZmY0M2YzOTcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R0h-BS0osJSrsb1iws4-KE43bUXHMFvu5PvNfoaoi8o')" }}>
                  <div className="absolute inset-0 bg-blue-900 bg-opacity-75 transition duration-300 ease-in-out"></div>
                  <div className="relative w-full h-full px-4 sm:px-6 lg:px-4 flex items-center">
                    <div>
                      <div className="text-white text-lg flex space-x-2 items-center">
                        <div className="bg-white rounded-md p-2 flex items-center">
                          <i className="fas fa-clipboard-check fa-sm text-blue-800"></i>
                        </div>
                        <p>Total Routes</p>
                      </div>
                      <h3 className="text-white text-3xl mt-2 font-bold">
                        {orgRouteNumber}
                      </h3>
                      <h3 className="text-white text-lg mt-2 ">
                        3.4% <span className='font-semibold text-blue-200'>vs last year</span>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Content */}
          </main>
        </div>
      </div>
    </div >
  );
}
