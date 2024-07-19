



import React, { useEffect, useMemo, useState } from 'react';
import io, { protocol } from 'socket.io-client';
import Validate from './Validate';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Sender() {
  const history = useNavigate()
  const user = {
    "_id": {
      "$oid": "668142222393ffbb34898c5b"
    },
    "name": "Abc",
    "email": "abc@gmail",
    "contact": "9999999",
    "password": "123",
    "__v": 0
  }

  const socket = useMemo(() => io(process.env.REACT_APP_API_BASE_URL), []);

  const [rooms, setRooms] = useState([]);
  const [currentRoomCode, setCurrentRoomCode] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/rooms`)
      .then(response => {
        setRooms(response.data);
        // Assuming you want to find the roomCode where the sender is the owner
        const room = response.data.find(room => room.owner === user.email);
        if (room) {
          setCurrentRoomCode(room.roomCode);
        }
      })
      .catch(err => console.error(err));
  }, [user]);

  useEffect(() => {
    if (currentRoomCode) {
      // console.log(`Driver joining room with roomCode: ${currentRoomCode}`);
      socket.emit('joinDriverRoom', currentRoomCode);
    }
  }, [currentRoomCode, socket]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Your browser doesn't support geolocation feature!");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: long, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
        const date = new Date(position.timestamp);
        const year = date.getFullYear();
        const month = String(date.toLocaleString('default', { month: 'long' })); // Months are zero-based in JavaScript
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const LastUpdated = `${hours}:${minutes}:${seconds} ${day}-${month}`;


        console.log(`Emitting location: ${lat}, ${long}, Accuracy: ${accuracy} last; ${LastUpdated}`);
        if (user && user._id && currentRoomCode) {
          socket.emit('locationUpdate', { userId: user._id, roomCode: currentRoomCode, lat, long, accuracy, altitude, altitudeAccuracy, heading, speed, LastUpdated });
        }
      },
      (error) => {
        console.error('Error getting geolocation:', error.message);
      },
      { enableHighAccuracy: false, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user, socket, currentRoomCode]);


  const stopSharing = () => {

    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/deleteRoom/${currentRoomCode}`)
      .then(response => {
        history("/")
      })
      .catch(error => {
        console.log(error)
      });
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${process.env.REACT_APP_API_OWN_URL}/reciever/${currentRoomCode}`);

  }


  return (
    <>
      <div className='text-5xl'>Driver</div>
      {user ? (<>
        <div>Username: {user.name}</div>
        Location Sharing Link :
        <Link className=' text-blue-500 cursor-pointer hover:text-blue-600' to={`${process.env.REACT_APP_API_OWN_URL}/reciever/${currentRoomCode}`}>{`${process.env.REACT_APP_API_OWN_URL}/reciever/${currentRoomCode}`}</Link><br />
        <button onClick={copyToClipboard} className='mx-2 mt-3 p-2 bg-blue-500 text-white font-semibold rounded-md '> Copy Link</button>
        <button onClick={stopSharing} className=' p-2 bg-red-500 text-white font-semibold rounded-md '> Stop Sharing</button>
      </>

      ) : (
        <div>Loading user data...</div>
      )}
    </>
  );
}
