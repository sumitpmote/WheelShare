import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalVehicles: 0,
    totalRides: 0,
    totalBookings: 0,
    activeRides: 0,
    pendingDrivers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data
      setStats({
        totalUsers: 150,
        totalDrivers: 45,
        totalVehicles: 38,
        totalRides: 75,
        totalBookings: 120,
        activeRides: 12,
        pendingDrivers: 8
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Drivers</h5>
              <h2>{stats.totalDrivers}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Total Vehicles</h5>
              <h2>{stats.totalVehicles}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Total Rides</h5>
              <h2>{stats.totalRides}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <div className="card text-white bg-secondary">
            <div className="card-body">
              <h5 className="card-title">Total Bookings</h5>
              <h2>{stats.totalBookings}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-white bg-dark">
            <div className="card-body">
              <h5 className="card-title">Active Rides</h5>
              <h2>{stats.activeRides}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5 className="card-title">Pending Drivers</h5>
              <h2>{stats.pendingDrivers}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-primary w-100 mb-2"
                    onClick={() => navigate('/users')}
                  >
                    Manage Users
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-success w-100 mb-2"
                    onClick={() => navigate('/users')}
                  >
                    Approve Drivers
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-info w-100 mb-2"
                    onClick={() => navigate('/vehicles')}
                  >
                    Verify Vehicles
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-warning w-100 mb-2"
                    onClick={() => navigate('/bookings')}
                  >
                    View Bookings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;