import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validate from './Validate';

export default function Choice() {
    const navigate = useNavigate();
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

    const [email, setEmail] = useState(user ? user.email : '');

    function handleView() {
        const verify = prompt("Enter Key");
        if (verify === "0011") {
            navigate('/student'); // Navigate to the '/student' route
        } else {
            alert("Not Authorized");
        }
    }

    async function shareLocation(e) {
        e.preventDefault();

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/AddRoom`, { owner: user.email });

            if (res.data.message === "added") {
                // Navigate to the driver page with the room code
                navigate(`/sender/${res.data.roomCode}`);
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

    return (
        <>
            <p>You are User: {user.name}</p>
            <button onClick={shareLocation} className='bg-indigo-300 p-5 m-2 rounded-xl'>Share Location</button>
            {/* <button onClick={handleView} className='bg-green-300 p-5 m-2 rounded-xl'>View Location</button> */}
        </>
    );
}
