import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BookingManagement from './components/BookingManagement';
import UserManagement from './components/UserManagement';
import Sidebar from './components/Sidebar';

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined && token !== '';
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.clear(); // Clear all localStorage
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated() && (
          <div className="d-flex">
            <Sidebar logout={logout} />
            <div className="flex-grow-1">
              <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <div className="container-fluid">
                  <span className="navbar-brand mb-0 h1">WheelShare Admin</span>
                  <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                    Logout
                  </button>
                </div>
              </nav>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/bookings" element={<BookingManagement />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        )}
        {!isAuthenticated() && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;