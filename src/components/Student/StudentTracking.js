import React, { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Coords from './Coords';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import customMarkerIcon from "../../pin1.png";
import StudentValidate from './StudentValidate';

export default function StudentTracking() {
    const user = StudentValidate();
    const { senderId } = useParams();
    const navigate = useNavigate()

    const [location, setLocation] = useState(null);
    const [timer, setTimer] = useState(0);
    const [rooms, setRooms] = useState([]);
    const [senderEmail, setSenderEmail] = useState('');
    const [roomStatus, setRoomStatus] = useState(true);
    const [reachedStops, setReachedStops] = useState([]);
    const [unReachedStops, setUnReachedStops] = useState([]);

    const customIcon = new L.Icon({
        iconUrl: customMarkerIcon,
        iconSize: [40, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
    
    const socket = useMemo(() => io(process.env.REACT_APP_API_BASE_URL), []);

    useEffect(() => {
        // axios.get(`${process.env.REACT_APP_API_BASE_URL}/trips`)
        //     .then(response => {
        //         const room = response.data.find(room => room.tripCode === senderId);
        //         if (room) {
        //             setSenderEmail(room.owner);
        //             const reachedStops = room.stop.filter(stop => stop.reached);
        //             const unreachedStops = room.stop.filter(stop => !stop.reached);
        //             setReachedStops(reachedStops);
        //             setUnReachedStops(unreachedStops);
        //             console.log('Reached Stops:', reachedStops);
        //             console.log('Unreached Stops:', unreachedStops);
        //         }
        //     })
        //     .catch(err => console.error('Error fetching trips:', err));
    }, [senderId,socket]);


    useEffect(() => {
        if (senderId) {



            socket.emit('org-joinStudentRoom', senderId);

            socket.on('org-studentJoined', (data) => {
                console.log('A student has joined the room:', data);
            });


            socket.on('org-locationUpdate', (data) => {
                console.log('Received Update From Driver:', data.LastUpdated);
                setLocation(data);
                setTimer((prevTimer) => prevTimer + 1);

                axios.get(`${process.env.REACT_APP_API_BASE_URL}/trips`)
                .then(response => {
                    const room = response.data.find(room => room.tripCode === senderId);
                    if (room) {
                        setSenderEmail(room.owner);
                        const reachedStops = room.stop.filter(stop => stop.reached);
                        const unreachedStops = room.stop.filter(stop => !stop.reached);
                        setReachedStops(reachedStops);
                        setUnReachedStops(unreachedStops);
                        // console.log('Reached Stops:', reachedStops);
                        // console.log('Unreached Stops:', unreachedStops);
                    }
                })
                .catch(err => console.error('Error fetching trips:', err));

            });

            socket.on('org-locationEnded', (data) => {
                console.log('Location Ended by Driver:', data.userId);
                setRoomStatus(false);
                navigate("/student/home")
            });

            return () => {
                socket.off('org-studentJoined');
                socket.off('org-locationUpdate');
                socket.off('org-locationEnded');
            };
        }
    }, [senderId, socket]);

    return (
        <>
            <div className='text-5xl'>Tracking</div>
            {roomStatus ? (
                <>
                    <div>Viewing {senderEmail}'s location</div>
                    {location && location.lat && location.long ? (
                        <>
                            <div className="block p-6 bg-white border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <MapContainer
                                    center={[location.lat, location.long]}
                                    zoom={18}
                                    style={{ height: "400px", width: "100%" }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[location.lat, location.long]} icon={customIcon}>
                                        <Popup>
                                            A pretty CSS3 popup. <br /> Easily customizable.
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                            <div className="coords flex align-middle flex-wrap justify-center mt-5">
                                <div className="m-3 p-2"><Coords label="Speed" value={location.speed ? `${location.speed} m/s` : '0 m/s'} /></div>
                                <div className="m-3 p-2"><Coords label="Longitude" value={location.long} /></div>
                                <div className="m-3 p-2"><Coords label="Latitude" value={location.lat} /></div>
                                <div className="m-3 p-2"><Coords label="Accuracy" value={location.accuracy ? location.accuracy : ''} /></div>
                                <div className="m-3 p-2"><Coords label="Updated" value={location.LastUpdated.slice(0, 9)} /></div>
                            </div>
                            <div>Reached Stops:</div>
                            <ul>
                                {reachedStops && reachedStops.map((stop, index) => (
                                    <li key={index}>{stop.name}</li>
                                ))}
                            </ul>
                            <div>Unreached Stops:</div>
                            <ul>
                                {unReachedStops.map((stop, index) => (
                                    <li key={index}>{stop.name}</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div>No one is sharing location</div>
                    )}
                </>
            ) : (
                <div>{senderEmail} stopped sharing</div>
            )}
        </>
    );
}
