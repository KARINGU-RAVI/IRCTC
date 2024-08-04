import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function Booking() {
    const [trainId, setTrainId] = useState('');
    const [noOfSeats, setNoOfSeats] = useState('');

    const handleBook = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        try {
            await axios.post('http://localhost:3000/book', { train_id: trainId, no_of_seats: noOfSeats }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Booking successful');
        } catch (error) {
            alert('Error during booking');
        }
    };

    return (
        <div className="booking-container">
            <div className="booking-card">
                <h2>Book a Seat</h2>
                <input
                    type="text"
                    placeholder="Train ID"
                    value={trainId}
                    onChange={(e) => setTrainId(e.target.value)}
                    className="booking-input"
                />
                <input
                    type="number"
                    placeholder="Number of Seats"
                    value={noOfSeats}
                    onChange={(e) => setNoOfSeats(e.target.value)}
                    className="booking-input"
                />
                <button onClick={handleBook} className="booking-button">Book</button>
            </div>
        </div>
    );
}

export default Booking;
