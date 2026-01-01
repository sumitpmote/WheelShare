import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MyRides from './components/MyRides';
import Vehicles from './components/Vehicles';
import Notifications from './components/Notifications';
import Navbar from './components/Navbar';

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined && token !== '' && token !== 'null';
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated() && <Navbar logout={logout} />}
        {!isAuthenticated() && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
        {isAuthenticated() && (
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rides" element={<MyRides />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;