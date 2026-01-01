import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ logout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active bg-primary' : '';
  };

  return (
    <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
      <div className="p-3 border-bottom">
        <h5 className="mb-0">WheelShare</h5>
        <small className="text-muted">Admin Panel</small>
      </div>
      <nav className="nav flex-column p-2">
        <Link 
          className={`nav-link text-white rounded mb-1 ${isActive('/dashboard')}`} 
          to="/dashboard"
        >
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </Link>
        <Link 
          className={`nav-link text-white rounded mb-1 ${isActive('/users')}`} 
          to="/users"
        >
          <i className="bi bi-people me-2"></i>
          User Management
        </Link>
        <Link 
          className={`nav-link text-white rounded mb-1 ${isActive('/vehicles')}`} 
          to="/vehicles"
        >
          <i className="bi bi-car-front me-2"></i>
          Vehicle Management
        </Link>
        <Link 
          className={`nav-link text-white rounded mb-1 ${isActive('/bookings')}`} 
          to="/bookings"
        >
          <i className="bi bi-calendar-check me-2"></i>
          Bookings
        </Link>
        <hr className="text-white" />
        <div className="mt-auto p-2">
          <small className="text-muted d-block mb-2">Admin Panel v1.0</small>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;