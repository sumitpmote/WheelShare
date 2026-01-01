import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Mock data since API might not exist
      const mockBookings = [
        {
          bookingId: 1,
          customerId: 'John Doe',
          rideId: 101,
          seatsBooked: 2,
          totalFare: 500,
          bookingStatus: 'Confirmed',
          bookedAt: '2024-01-15T08:30:00'
        },
        {
          bookingId: 2,
          customerId: 'Jane Smith',
          rideId: 102,
          seatsBooked: 1,
          totalFare: 300,
          bookingStatus: 'Pending',
          bookedAt: '2024-01-16T12:15:00'
        },
        {
          bookingId: 3,
          customerId: 'Mike Johnson',
          rideId: 103,
          seatsBooked: 3,
          totalFare: 750,
          bookingStatus: 'Completed',
          bookedAt: '2024-01-17T16:45:00'
        }
      ];
      
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.bookingStatus.toLowerCase() === filter;
  });

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Booking Management</h2>
        <div>
          <select 
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Ride</th>
              <th>Seats</th>
              <th>Fare</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{booking.customerId}</td>
                <td>#{booking.rideId}</td>
                <td>{booking.seatsBooked}</td>
                <td>₹{booking.totalFare}</td>
                <td>
                  <span className={`badge ${
                    booking.bookingStatus === 'Confirmed' ? 'bg-success' :
                    booking.bookingStatus === 'Cancelled' ? 'bg-danger' :
                    booking.bookingStatus === 'Completed' ? 'bg-primary' : 'bg-warning'
                  }`}>
                    {booking.bookingStatus}
                  </span>
                </td>
                <td>{new Date(booking.bookedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="alert alert-info">No bookings found for the selected filter.</div>
      )}
    </div>
  );
};

export default BookingManagement;