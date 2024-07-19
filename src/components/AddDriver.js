import axios from 'axios';
import React, { useState } from 'react';

export default function AddDriver() {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        org: '',
    });

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`https://location-qxki.onrender.com/add-driver`, formData)
            .then(response => {
                console.log('Data sent successfully:', response.data);
                // Optionally, reset the form state after successful submission
                setFormData({
                    name: '',
                    password: '',
                    org: '',
                });
            })
            .catch(err => {
                console.error('Error sending data:', err);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                Name: <input type="text" name='name' value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
                Password: <input type="text" name='password' value={formData.password} onChange={handleInputChange} />
            </div>
            <div>
                Org: <input type="text" name='org' value={formData.org} onChange={handleInputChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}
