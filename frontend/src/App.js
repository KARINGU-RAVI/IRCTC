import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Availability from './components/Availability';
import Booking from './components/Booking';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" exact element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/availability" element={<Availability/>} />
                <Route path="/book" element={<Booking/>} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
