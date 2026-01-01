import React, { useState, useEffect } from 'react';
import { ridesAPI, bookingsAPI } from '../api';

const Dashboard = () => {
  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    preferredDateTime: '',
    requiredSeats: 1
  });
  const [searchResults, setSearchResults] = useState({ cabs: [], carpools: [] });
  const [loading, setLoading] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setRecentBookings(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ridesAPI.search(searchData);
      setSearchResults(response.data);
      
      if (response.data.cabs.length === 0 && response.data.carpools.length === 0) {
        alert('No rides found for your search criteria. Try different locations or create some test rides first.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert(`Search failed: ${error.response?.data?.message || error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (rideId, seatsRequired) => {
    try {
      await bookingsAPI.create({
        rideId: rideId,
        seatsBooked: seatsRequired
      });
      alert('Booking confirmed successfully!');
      fetchRecentBookings();
      setSearchResults({ cabs: [], carpools: [] });
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  const RideCard = ({ ride, type }) => (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title">
              <span className={`badge ${type === 'cab' ? 'bg-warning' : 'bg-info'} me-2`}>
                {type.toUpperCase()}
              </span>
              {ride.source} → {ride.destination}
            </h6>
            <p className="card-text mb-1">
              <small className="text-muted">
                Driver: {ride.driverName} | Distance: {ride.distanceInKm} km
              </small>
            </p>
            <p className="card-text mb-1">
              <strong>₹{ride.fare}</strong> per seat | 
              <span className="text-success ms-2">{ride.availableSeats} seats available</span>
            </p>
            <p className="card-text">
              <small className="text-muted">
                Departure: {new Date(ride.rideDateTime).toLocaleString()}
              </small>
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleBookRide(ride.rideId, searchData.requiredSeats)}
            disabled={ride.availableSeats < searchData.requiredSeats}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Search Rides</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">From</label>
                    <input
                      type="text"
                      className="form-control"
                      name="source"
                      value={searchData.source}
                      onChange={handleInputChange}
                      placeholder="Enter pickup location"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">To</label>
                    <input
                      type="text"
                      className="form-control"
                      name="destination"
                      value={searchData.destination}
                      onChange={handleInputChange}
                      placeholder="Enter destination"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preferred Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="preferredDateTime"
                      value={searchData.preferredDateTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Seats Required</label>
                    <select
                      className="form-select"
                      name="requiredSeats"
                      value={searchData.requiredSeats}
                      onChange={handleInputChange}
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search Rides'}
                </button>
              </form>
            </div>
          </div>

          {(searchResults.cabs.length > 0 || searchResults.carpools.length > 0) && (
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">Search Results</h5>
              </div>
              <div className="card-body">
                {searchResults.cabs.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-warning">🚕 Cabs ({searchResults.cabs.length})</h6>
                    {searchResults.cabs.map(ride => (
                      <RideCard key={ride.rideId} ride={ride} type="cab" />
                    ))}
                  </div>
                )}
                
                {searchResults.carpools.length > 0 && (
                  <div>
                    <h6 className="text-info">🚗 Carpools ({searchResults.carpools.length})</h6>
                    {searchResults.carpools.map(ride => (
                      <RideCard key={ride.rideId} ride={ride} type="carpool" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Bookings</h5>
            </div>
            <div className="card-body">
              {recentBookings.length > 0 ? (
                recentBookings.map(booking => (
                  <div key={booking.bookingId} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <small className="fw-bold">
                        {booking.ride.source} → {booking.ride.destination}
                      </small>
                      <span className={`badge ${
                        booking.bookingStatus === 'Confirmed' ? 'bg-success' : 
                        booking.bookingStatus === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <small className="text-muted">
                      {new Date(booking.ride.rideDateTime).toLocaleDateString()} | 
                      ₹{booking.totalFare}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted">No recent bookings</p>
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
                  View All Bookings
                </button>
                <button className="btn btn-outline-info btn-sm">
                  Booking History
                </button>
                <button className="btn btn-outline-success btn-sm">
                  Rate Recent Rides
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;