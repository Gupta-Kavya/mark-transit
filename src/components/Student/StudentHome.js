import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentValidate from './StudentValidate';

export default function StudentHome(props) {
    const { org, stop, vehicle } = props;
    const navigate = useNavigate();
    const [studentOrg, setStudentOrg] = useState("N/A");
    const [studentStop, setStudentStop] = useState("N/A");
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/trips`)
            .then(response => setTrips(response.data))
            .catch(err => console.error(err));
    }, []);

    // const user = studentValidate()
    const user = StudentValidate()

    useEffect(() => {
        if (org && stop && user) {
            const orgDetails = org.find(e => e._id === user.org);
            const stopDetails = stop.find(e => e._id === user.stop);
            if (orgDetails) {
                setStudentOrg(orgDetails.name);
            } else {
                // console.error('Organization not found');
            }
            if (stopDetails) {
                setStudentStop(stopDetails.name);
            } else {
                // console.error('Stop not found');
            }
        }
    }, [org, stop, user]);

    return (
        <>
            <h2 className='text-2xl'>Student Info</h2>
            <h2 className='text-xl'>Student Name: {user.name}</h2>
            <h2 className='text-xl'>Organization: {studentOrg}</h2>
            <h2 className='text-xl'>Student Stop: {studentStop}</h2>
            <h2 className='text-xl'>Student Contact: {user.contact}</h2>
            <h2 className='text-xl'>Student Emergency Contact: {user.emergencyContact}</h2>
            <h2 className='text-xl mb-8'>Student Alloted Route: {"2"}</h2>

            <Link to={"/student/tracklocation"} className='text-xl mb-8 mx-4'>Track Vehicle</Link>
            
            {/* <div className='m-4'>List Of Available Vehicles</div>
            {vehicle.filter(e => e.org === user.org).map(e => {
                const trip = trips.find(f => f.vehicleId === e._id && f.currentStatus);
                return (
                    <div className='flex space-x-5 m-4' key={e._id}>
                        <div className="p-3 bg-green-500 text-white font-bold rounded-lg text-center">{e.name} </div>
                        <div className="p-3 bg-blue-500 text-white font-bold rounded-lg text-center">
                            {trip ? (
                                <Link to={`${process.env.REACT_APP_API_OWN_URL}/student/${trip.tripCode}`}>
                                    Track 
                                </Link>
                            ) : (
                                <span>Currently not sharing</span>
                            )}
                        </div>
                    </div>
                );
            })} */}
        </>
    );
}
