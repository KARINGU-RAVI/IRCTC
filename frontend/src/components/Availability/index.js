import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function Availability() {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [trains, setTrains] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3000/availability', { params: { source, destination } });
            setTrains(response.data);
        } catch (error) {
            alert('Error fetching availability');
        }
    };

    return (
        <div className="availability-container">
            <div className="availability-card">
                <h2>Train Availability</h2>
                <input
                    type="text"
                    placeholder="Source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="availability-input"
                />
                <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="availability-input"
                />
                <button onClick={handleSearch} className="availability-button">Search</button>
                <ul className="train-list">
                    {trains.map(train => (
                        <li key={train.train_id} className="train-item">
                            {train.train_name} - Available Seats: {train.available_seats}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Availability;
