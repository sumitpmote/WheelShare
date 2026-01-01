import React, { useState, useEffect } from 'react';
import { ridesAPI, vehiclesAPI, bookingsAPI } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    totalBookings: 0,
    totalEarnings: 0
  });
  const [recentRides, setRecentRides] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showCreateVehicle, setShowCreateVehicle] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Temporarily use mock data until all API endpoints are working
      setStats({
        totalRides: 0,
        activeRides: 0,
        totalBookings: 0,
        totalEarnings: 0
      });
      setRecentRides([]);
      setVehicles([]);
      
      /* Re-enable when API endpoints are fixed
      const [ridesRes, vehiclesRes] = await Promise.all([
        ridesAPI.getMyRides(),
        vehiclesAPI.getMyVehicles()
      ]);

      const rides = ridesRes.data || [];
      const vehiclesList = vehiclesRes.data || [];

      setRecentRides(rides.slice(0, 5));
      setVehicles(vehiclesList);

      const totalBookings = rides.reduce((sum, ride) => sum + (ride.bookingsCount || 0), 0);
      const totalEarnings = rides.reduce((sum, ride) => 
        sum + ((ride.bookingsCount || 0) * ride.farePerSeat), 0
      );

      setStats({
        totalRides: rides.length,
        activeRides: rides.filter(r => r.rideStatus === 'Open').length,
        totalBookings,
        totalEarnings
      });
      */
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="col-md-3 mb-3">
      <div className="card">
        <div className="card-body text-center">
          <div className={`text-${color} mb-2`} style={{ fontSize: '2rem' }}>
            {icon}
          </div>
          <h5 className="card-title">{title}</h5>
          <h3 className={`text-${color}`}>{value}</h3>
        </div>
      </div>
    </div>
  );

  const CreateRideModal = () => {
    const [rideData, setRideData] = useState({
      source: '',
      destination: '',
      availableSeats: 1,
      farePerSeat: '',
      rideDateTime: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await ridesAPI.create(rideData);
        alert('Ride created successfully!');
        setShowCreateRide(false);
        fetchDashboardData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to create ride');
      }
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Ride</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCreateRide(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">From</label>
                  <input
                    type="text"
                    className="form-control"
                    value={rideData.source}
                    onChange={(e) => setRideData({...rideData, source: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">To</label>
                  <input
                    type="text"
                    className="form-control"
                    value={rideData.destination}
                    onChange={(e) => setRideData({...rideData, destination: e.target.value})}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Available Seats</label>
                    <select
                      className="form-select"
                      value={rideData.availableSeats}
                      onChange={(e) => setRideData({...rideData, availableSeats: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fare per Seat (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={rideData.farePerSeat}
                      onChange={(e) => setRideData({...rideData, farePerSeat: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={rideData.rideDateTime}
                    onChange={(e) => setRideData({...rideData, rideDateTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateRide(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Create Ride
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const CreateVehicleModal = () => {
    const [vehicleData, setVehicleData] = useState({
      vehicleNumber: '',
      vehicleType: 'Cab',
      make: '',
      model: '',
      color: '',
      seatCapacity: 4
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await vehiclesAPI.create(vehicleData);
        alert('Vehicle registered successfully! Awaiting admin verification.');
        setShowCreateVehicle(false);
        fetchDashboardData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to register vehicle');
      }
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register Vehicle</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCreateVehicle(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Vehicle Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={vehicleData.vehicleNumber}
                    onChange={(e) => setVehicleData({...vehicleData, vehicleNumber: e.target.value})}
                    placeholder="e.g., MH12AB1234"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Vehicle Type</label>
                  <select
                    className="form-select"
                    value={vehicleData.vehicleType}
                    onChange={(e) => setVehicleData({...vehicleData, vehicleType: e.target.value})}
                  >
                    <option value="Cab">Cab</option>
                    <option value="Carpool">Carpool</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Make</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleData.make}
                      onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
                      placeholder="e.g., Maruti"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Model</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleData.model}
                      onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                      placeholder="e.g., Swift"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleData.color}
                      onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Seat Capacity</label>
                    <select
                      className="form-select"
                      value={vehicleData.seatCapacity}
                      onChange={(e) => setVehicleData({...vehicleData, seatCapacity: parseInt(e.target.value)})}
                    >
                      {[2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateVehicle(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      {/* Stats Cards */}
      <div className="row">
        <StatCard title="Total Rides" value={stats.totalRides} icon="🚗" color="primary" />
        <StatCard title="Active Rides" value={stats.activeRides} icon="🟢" color="success" />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon="🎫" color="info" />
        <StatCard title="Earnings" value={`₹${stats.totalEarnings}`} icon="💰" color="warning" />
      </div>

      <div className="row">
        {/* Recent Rides */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Rides</h5>
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowCreateRide(true)}
              >
                + Create Ride
              </button>
            </div>
            <div className="card-body">
              {recentRides.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Route</th>
                        <th>Date</th>
                        <th>Fare</th>
                        <th>Bookings</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRides.map(ride => (
                        <tr key={ride.rideId}>
                          <td>
                            <small>{ride.source} → {ride.destination}</small>
                          </td>
                          <td>
                            <small>{new Date(ride.rideDateTime).toLocaleDateString()}</small>
                          </td>
                          <td>₹{ride.farePerSeat}</td>
                          <td>{ride.bookingsCount || 0}</td>
                          <td>
                            <span className={`badge ${
                              ride.rideStatus === 'Open' ? 'bg-success' : 
                              ride.rideStatus === 'Completed' ? 'bg-primary' : 'bg-secondary'
                            }`}>
                              {ride.rideStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No rides created yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Vehicles */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Vehicles</h5>
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => setShowCreateVehicle(true)}
              >
                + Add Vehicle
              </button>
            </div>
            <div className="card-body">
              {vehicles.length > 0 ? (
                vehicles.map(vehicle => (
                  <div key={vehicle.vehicleId} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <strong>{vehicle.vehicleNumber}</strong>
                      <span className={`badge ${
                        vehicle.isVerified ? 'bg-success' : 'bg-warning'
                      }`}>
                        {vehicle.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <small className="text-muted">
                      {vehicle.make} {vehicle.model} | {vehicle.vehicleType}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted">No vehicles registered</p>
              )}
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  View All Rides
                </button>
                <button className="btn btn-outline-info btn-sm">
                  Manage Vehicles
                </button>
                <button className="btn btn-outline-success btn-sm">
                  Earnings Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateRide && <CreateRideModal />}
      {showCreateVehicle && <CreateVehicleModal />}
    </div>
  );
};

export default Dashboard;