import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DriverValidate from './DriverValidate';


export default function DriverHome(props) {
    const { org, stop ,route} = props
    const navigate = useNavigate();
    const [driverOrg, setDriverOrg] = useState("N/A");
    const [driverStop, setDriverStop] = useState("N/A");
    const [driverRouteStops, setDriverRouteStops] = useState([]);
    const [isCurrentlySharing, setIsCurrentlySharing] = useState(false);
    const [currentlySharingTripCode, setCurrentlySharingTripCode] = useState();
    const [trips, setTrips] = useState([]);

    const user = DriverValidate(); // Assuming DriverValidate is a function that returns the user object

    const [email, setEmail] = useState(user ? user.email : '');



    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/trips`)
            .then(response => {
                setTrips(response.data);
                // Assuming you want to find the roomCode where the sender is the owner
                const room = response.data.find(room => room.owner === user.email && room.currentStatus === true);
                if (room) {
                    setIsCurrentlySharing(true);
                    setCurrentlySharingTripCode(room.tripCode)
                }
            })
            .catch(err => console.error(err));
    }, [user]);

    useEffect(() => {


        if (org && stop && user&&route) {
            const orgDetails = org.find(e => e._id === user.org);
            const stopDetails = stop.find(e => e._id === user.stop);
            const routeDetails = route.find(e => e._id === user.routeId);
            // const matchingTrips = trips.find(trip => trip.owner === user.email && trip.currentStatus);

            if (orgDetails) {
                setDriverOrg(orgDetails.name);
            } else {
                // console.error('Organization not found');
            }
            if (stopDetails) {
                setDriverStop(stopDetails.name);
            } else {
                // console.error('Stop not found');
            }
            if (routeDetails) {
                setDriverRouteStops(routeDetails.stop);
                // console.log(driverRouteStops)
            } else {
                // console.error('Stop not found');
            }

        }
    }, [org, stop, user]);




    console.log(driverRouteStops)
    async function shareLocation(e) {
        e.preventDefault();
        if (isCurrentlySharing) {
            navigate(`/driver/${currentlySharingTripCode}`);

        } else {

            try {
                const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-trip`,
                    { owner: user.email, org: user.org, vehicleId: user.vehicleNo, stop:driverRouteStops });

                if (res.data.message === "added") {
                    // Navigate to the driver page with the room code
                    navigate(`/driver/${res.data.tripCode}`);
                } else {
                    alert("Already Exist");
                }
            } catch (error) {
                alert("Invalid Details");
                console.log(error);
            }
        }

        if (!user) {
            return <div>Loading...</div>; // or redirect to login
        }
    }

    return (
        <>
            <div className="m-5">
                <p>Driver Name: {user.name}</p>
                <p>Organization Name: {driverOrg}</p>
                <p>Route Alloted: {user.routeName}</p>
                <p>Vehicle Allotted: {user.vehicleName}</p>
                <p>Your Stop: {driverStop}</p>


                <button onClick={shareLocation} className='bg-blue-300 p-3 m-2 rounded-xl'>
                    {!isCurrentlySharing ? <>Start Trip</> : <>Continue Trip</>}

                </button>
                {/* <button onClick={handleView} className='bg-green-300 p-5 m-2 rounded-xl'>View Location</button> */}
            </div>
        </>
    );
}
