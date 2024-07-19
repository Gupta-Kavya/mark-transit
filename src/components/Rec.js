import React, { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import Validate from './Validate';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Coords from './Coords';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import customMarkerIcon from "../pin1.png";

export default function Rec() {
  // const user = Validate();
  const { senderId } = useParams();

  const [location, setLocation] = useState(null);
  const [timer, setTimer] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [senderEmail, setSenderEmail] = useState('');
  const [roomStatus, setRoomStatus] = useState(false)

  const customIcon = new L.Icon({
    iconUrl: customMarkerIcon,
    iconSize: [40, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/rooms`)
      .then(response => {
        setRooms(response.data);
        const room = response.data.find(room => room.roomCode === senderId);
        if (room) {
          setSenderEmail(room.owner);
          setRoomStatus(room.currentStatus)
        }
      })
      .catch(err => console.error(err));
  }, [ senderId]);

  const socket = useMemo(() => io(process.env.REACT_APP_API_BASE_URL), []);

  useEffect(() => {
    if (senderId) {
      socket.emit('joinStudentRoom', senderId);

      socket.on('locationUpdate', (data) => {
        console.log("Recieved Update From Driver Lat : " + data.LastUpdated)
        // console.log(data)
        setLocation(data);
        setTimer((prevTimer) => prevTimer + 1);
      });

      return () => {
        socket.off('locationUpdate');
      };
    }
  }, [senderId, socket]);

  return (
    <>
      <div className='text-5xl'>Tracking </div>
      {/* <div>You are User: {user.name}</div> */}
      <div>{senderEmail} is Sharing their location</div>
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
          {
            roomStatus==true?<>
            <div className="coords flex align-middle flex-wrap justify-center  mt-5">
            <div className="m-3 p-2"><Coords  label="Speed" value={location.speed ? <>k</>:<>0m/s</>} /></div>
            <div className="m-3 p-2"><Coords  label="Longitude" value={location.long} /></div>
            <div className="m-3 p-2"><Coords  label="Latitude" value={location.lat} /></div>
            <div className="m-3 p-2"><Coords  label="Accuracy" value={location.accuracy ? <>{location.accuracy}</> : <></>} /></div>
            <div className="m-3 p-2"><Coords  label="Updated" value={location.LastUpdated.slice(0,9 )} /></div>
          </div>
            </>:<>
            {senderEmail} stopped sharing 
            </>
          }
          
        </>
      ) : (
        <div>No one is sharing location</div>
      )}
    </>
  );
}
