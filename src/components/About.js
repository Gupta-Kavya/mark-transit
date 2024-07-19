import React, { useEffect } from 'react'
import { useMemo } from 'react';
import { useState } from 'react';
import io from 'socket.io-client';

export default function About() {

  const socket = useMemo(() => io("http://localhost:8000"), [])
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message)
    setMessage("")
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('recieve-msg', (data) => {
      console.log(data)
    })
    socket.on('welcome', (s) => {
      console.log(s)
    });
  }, []);



  return (
    <>
      <form onSubmit={handleSubmit} >
        <input value={message} onChange={e => setMessage(e.target.value)} type="text" name="message" id="" />
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}
