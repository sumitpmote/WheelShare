import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MyBookings from './components/MyBookings';
import Notifications from './components/Notifications';
import Navbar from './components/Navbar';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated() && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/bookings" 
            element={isAuthenticated() ? <MyBookings /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notifications" 
            element={isAuthenticated() ? <Notifications /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;