import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId, 'Customer cancellation');
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Confirmed': 'bg-success',
      'Cancelled': 'bg-danger',
      'Completed': 'bg-primary',
      'In Progress': 'bg-warning'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.bookingStatus.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Bookings</h2>
        <div className="btn-group" role="group">
          <input
            type="radio"
            className="btn-check"
            name="filter"
            id="all"
            checked={filter === 'all'}
            onChange={() => setFilter('all')}
          />
          <label className="btn btn-outline-primary" htmlFor="all">All</label>

          <input
            type="radio"
            className="btn-check"
            name="filter"
            id="confirmed"
            checked={filter === 'confirmed'}
            onChange={() => setFilter('confirmed')}
          />
          <label className="btn btn-outline-success" htmlFor="confirmed">Confirmed</label>

          <input
            type="radio"
            className="btn-check"
            name="filter"
            id="cancelled"
            checked={filter === 'cancelled'}
            onChange={() => setFilter('cancelled')}
          />
          <label className="btn btn-outline-danger" htmlFor="cancelled">Cancelled</label>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No bookings found</h4>
          <p className="text-muted">Start by searching and booking a ride!</p>
        </div>
      ) : (
        <div className="row">
          {filteredBookings.map(booking => (
            <div key={booking.bookingId} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Booking #{booking.bookingId}
                  </small>
                  <span className={getStatusBadge(booking.bookingStatus)}>
                    {booking.bookingStatus}
                  </span>
                </div>
                <div className="card-body">
                  <h6 className="card-title">
                    {booking.ride.source} → {booking.ride.destination}
                  </h6>
                  
                  <div className="mb-2">
                    <small className="text-muted">Ride Date:</small>
                    <div>{new Date(booking.ride.rideDateTime).toLocaleString()}</div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Vehicle:</small>
                    <div>
                      {booking.ride.vehicle.make} {booking.ride.vehicle.model} 
                      <span className="badge bg-secondary ms-2">
                        {booking.ride.vehicle.vehicleType}
                      </span>
                    </div>
                    <small className="text-muted">
                      {booking.ride.vehicle.vehicleNumber}
                    </small>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Driver:</small>
                    <div>{booking.ride.driver.fullName}</div>
                    <small className="text-muted">
                      {booking.ride.driver.phoneNumber}
                    </small>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted">Seats:</small>
                      <div className="fw-bold">{booking.seatsBooked}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Total Fare:</small>
                      <div className="fw-bold text-success">₹{booking.totalFare}</div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <small className="text-muted">
                      Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                
                {booking.bookingStatus === 'Confirmed' && 
                 new Date(booking.ride.rideDateTime) > new Date() && (
                  <div className="card-footer">
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => handleCancelBooking(booking.bookingId)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;