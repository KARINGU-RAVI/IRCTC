import React from 'react';
import './index.css';

function Header() {
    return (
        <header className="header">
            <h1>Railway Management System</h1>
            <nav>
                <a href="/">Home</a>
                <a href="/availability">Check Availability</a>
                <a href="/book">Book a Seat</a>
            </nav>
        </header>
    );
}

export default Header;
