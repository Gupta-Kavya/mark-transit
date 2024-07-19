import React, { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DriverValidate from './DriverValidate';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import * as turf from '@turf/turf';
import customMarkerIcon from "../../pin.png";

export default function DriverLocation() {
    const navigate = useNavigate();
    const user = DriverValidate();

    const socket = useMemo(() => io(process.env.REACT_APP_API_BASE_URL), []);


    const [trips, setTrips] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [currentTripCode, setCurrentTripCode] = useState(null);
    const [location, setLocation] = useState({ lat: null, long: null }); // Initialize with null or { lat: null, long: null }
    const [nextStopIndex, setNextStopIndex] = useState(0);

    const checkPointInCircle = (center, radius, point) => {
        const centerPoint = turf.point([center.long, center.lat]);
        const checkPoint = turf.point([point.long, point.lat]);
        const circle = turf.circle(centerPoint, radius, { units: 'meters' });
        return turf.booleanPointInPolygon(checkPoint, circle);
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/trips`)
            .then(response => {
                setTrips(response.data);
                const room = response.data.find(room => room.owner === user.email && room.currentStatus === true);
                if (room) {
                    setCurrentTrip(room);
                    setCurrentTripCode(room.tripCode);
                }
            })
            .catch(err => console.error("Error fetching trips:", err));
    }, [user]);

    useEffect(() => {
        if (currentTripCode) {
            socket.emit('org-joinDriverRoom', currentTripCode);

            // socket.on(`org-studentJoined`, (data) => {
            //     console.log('New Student Joined:', data);
            //     console.log(`Emitting location: ${location.lat}, ${location.long}, Accuracy: ${location.accuracy} LastUpdated: ${location.LastUpdated}`);

            //     socket.emit('org-locationUpdate', {
            //         userId: user._id,
            //         lat: location.lat,
            //         long: location.long,
            //         accuracy: location.accuracy,

            //     });
            //     // Handle student joined event
            // });

            return () => {
                // socket.off('org-studentJoined');
                // socket.off('org-locationUpdate');
                // socket.off('org-locationEnded');
            };
        }
    }, [socket, currentTripCode, navigate]);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.log("Your browser doesn't support geolocation feature!");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude: lat, longitude: long, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
                setLocation({ lat, long });

                const date = new Date(position.timestamp);
                const LastUpdated = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}-${date.toLocaleString('default', { month: 'long' })}`;

                console.log(`Emitting location: ${lat}, ${long}, Accuracy: ${accuracy} LastUpdated: ${LastUpdated}`);
                if (user && user._id && currentTripCode) {
                    socket.emit('org-locationUpdate', {
                        userId: user._id,
                        tripCode: currentTripCode,
                        lat,
                        long,
                        accuracy,
                        altitude,
                        altitudeAccuracy,
                        heading,
                        speed,
                        LastUpdated
                    });

                }
                console.log(Date.now())


                if (currentTrip && nextStopIndex < currentTrip.stop.length) {
                    const nextStop = currentTrip.stop[nextStopIndex];
                    const radius = 100; // Assuming radius is 100 meters
                    const hasReachedNextStop = checkPointInCircle(nextStop, radius, { long, lat });

                    if (hasReachedNextStop) {
                        console.log("Reached stop:", nextStop.name);


                        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-stop/${currentTrip._id}/${nextStop.id}`, { reached: true, arrivalTime: Date.now() })
                            .then(response => {
                                console.log("Stop updated:", nextStop.name);
                                setNextStopIndex(nextStopIndex + 1);
                                setCurrentTrip(prevTrip => ({
                                    ...prevTrip,
                                    stop: prevTrip.stop.map(stop =>
                                        stop.id === nextStop.id ? { ...stop, reached: true } : stop
                                    )
                                }));
                            })
                            .catch(err => console.error("Error updating stop:", err));
                    } else {
                        console.log("Not reached:", nextStop.name);
                    }
                }
            },
            (error) => {
                console.error('Error getting geolocation:', error.message);
            },
            { enableHighAccuracy: false, maximumAge: 0, timeout: 10000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [user, socket, currentTripCode, currentTrip, nextStopIndex]);

    const stopSharing = () => {
        console.log('Stopping sharing for trip:', currentTripCode);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-trip/${currentTripCode}`, {
            currentStatus: false,
            endedAt: Date.now()
        })
            .then(response => {
                console.log('Trip ended:', currentTripCode);
                if (user && user._id && currentTripCode) {
                    socket.emit('org-locationEnded', { userId: user._id, tripCode: currentTripCode });
                }
                navigate("/driver/home");
            })
            .catch(error => {
                console.error('Error ending trip:', error);
            });
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_API_OWN_URL}/student/${currentTripCode}`)
            .then(() => {
                console.log('Link copied to clipboard');
            })
            .catch(err => console.error('Error copying link:', err));
    }

    const customIcon = new L.Icon({
        iconUrl: customMarkerIcon,
        iconSize: [40, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    return (
        <>
            <div className='text-5xl'>Driver</div>
            {user ? (
                <>
                    <div>Username: {user.name}</div>
                    Location Sharing Link:
                    <Link className='text-blue-500 cursor-pointer hover:text-blue-600' to={`${process.env.REACT_APP_API_OWN_URL}/student/${currentTripCode}`}>
                        {`${process.env.REACT_APP_API_OWN_URL}/student/${currentTripCode}`}
                    </Link><br />
                    <button onClick={copyToClipboard} className='mx-2 mt-3 p-2 bg-blue-500 text-white font-semibold rounded-md'>Copy Link</button>
                    <button onClick={stopSharing} className='p-2 bg-red-500 text-white font-semibold rounded-md'>Stop Sharing</button>
                    <div className="block p-6 bg-white border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <MapContainer
                            center={[location.lat || 0, location.long || 0]}
                            zoom={18}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {location.lat !== null && location.long !== null && (
                                <Marker position={[location.lat, location.long]} icon={customIcon}>
                                    <Popup>
                                        A pretty CSS3 popup. <br /> Easily customizable.
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>

                    </div>
                    <div>Prev Stop: {currentTrip && nextStopIndex > 0 ? currentTrip.stop[nextStopIndex - 1].name : 'None'}</div>
                    <div>Next Stop: {currentTrip && nextStopIndex < currentTrip.stop.length ? currentTrip.stop[nextStopIndex].name : 'None'}</div>
                </>
            ) : (
                <div>Loading user data...</div>
            )}
        </>
    );
}
