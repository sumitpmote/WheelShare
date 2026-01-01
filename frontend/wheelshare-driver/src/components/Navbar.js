import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { notificationsAPI } from '../api';

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      // Temporarily disable to prevent 401 errors
      setUnreadCount(0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          🚗 WheelShare Driver
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/rides') ? 'active' : ''}`}
                to="/rides"
              >
                My Rides
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/vehicles') ? 'active' : ''}`}
                to="/vehicles"
              >
                Vehicles
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/notifications') ? 'active' : ''}`}
                to="/notifications"
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="badge bg-danger ms-1">{unreadCount}</span>
                )}
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Account
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/earnings">
                    Earnings
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;