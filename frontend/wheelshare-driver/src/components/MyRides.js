import React, { useState, useEffect } from 'react';
import { ridesAPI, bookingsAPI } from '../api';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideBookings, setRideBookings] = useState([]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      // Mock data for rides
      const mockRides = [
        {
          rideId: 1,
          source: 'Mumbai Central',
          destination: 'Pune Station',
          rideDateTime: '2024-01-25T10:00:00',
          availableSeats: 3,
          farePerSeat: 250,
          bookingsCount: 2,
          rideStatus: 'Open'
        },
        {
          rideId: 2,
          source: 'Delhi Airport',
          destination: 'Gurgaon Mall',
          rideDateTime: '2024-01-26T14:30:00',
          availableSeats: 4,
          farePerSeat: 150,
          bookingsCount: 1,
          rideStatus: 'In Progress'
        },
        {
          rideId: 3,
          source: 'Bangalore IT Park',
          destination: 'Mysore Palace',
          rideDateTime: '2024-01-20T09:00:00',
          availableSeats: 2,
          farePerSeat: 200,
          bookingsCount: 4,
          rideStatus: 'Completed'
        }
      ];
      
      setRides(mockRides);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRideBookings = async (rideId) => {
    try {
      const response = await bookingsAPI.getRideBookings(rideId);
      setRideBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const updateRideStatus = async (rideId, status) => {
    try {
      await ridesAPI.updateStatus(rideId, status);
      alert('Ride status updated successfully');
      fetchRides();
      if (selectedRide?.rideId === rideId) {
        setSelectedRide({ ...selectedRide, rideStatus: status });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update ride status');
    }
  };

  const handleViewBookings = (ride) => {
    setSelectedRide(ride);
    fetchRideBookings(ride.rideId);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Open': 'bg-success',
      'In Progress': 'bg-warning',
      'Completed': 'bg-primary',
      'Cancelled': 'bg-danger'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const BookingsModal = () => (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Bookings for {selectedRide?.source} → {selectedRide?.destination}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setSelectedRide(null)}
            ></button>
          </div>
          <div className="modal-body">
            {rideBookings.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Seats</th>
                      <th>Fare</th>
                      <th>Status</th>
                      <th>Booked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rideBookings.map(booking => (
                      <tr key={booking.bookingId}>
                        <td>{booking.customer.fullName}</td>
                        <td>
                          <div>{booking.customer.phoneNumber}</div>
                          <small className="text-muted">{booking.customer.email}</small>
                        </td>
                        <td>{booking.seatsBooked}</td>
                        <td>₹{booking.totalFare}</td>
                        <td>
                          <span className={getStatusBadge(booking.bookingStatus)}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td>
                          <small>{new Date(booking.bookedAt).toLocaleString()}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-center">No bookings for this ride</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedRide(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
        <h2>My Rides</h2>
        <span className="badge bg-primary">
          {rides.length} total rides
        </span>
      </div>

      {rides.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No rides created yet</h4>
          <p className="text-muted">Create your first ride to start earning!</p>
        </div>
      ) : (
        <div className="row">
          {rides.map(ride => (
            <div key={ride.rideId} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <small className="text-muted">Ride #{ride.rideId}</small>
                  <span className={getStatusBadge(ride.rideStatus)}>
                    {ride.rideStatus}
                  </span>
                </div>
                <div className="card-body">
                  <h6 className="card-title">
                    {ride.source} → {ride.destination}
                  </h6>
                  
                  <div className="mb-2">
                    <small className="text-muted">Departure:</small>
                    <div>{new Date(ride.rideDateTime).toLocaleString()}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-6">
                      <small className="text-muted">Available Seats:</small>
                      <div className="fw-bold">{ride.availableSeats}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Fare per Seat:</small>
                      <div className="fw-bold text-success">₹{ride.farePerSeat}</div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Bookings:</small>
                    <div className="fw-bold text-info">{ride.bookingsCount || 0}</div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Potential Earnings:</small>
                    <div className="fw-bold text-warning">
                      ₹{(ride.bookingsCount || 0) * ride.farePerSeat}
                    </div>
                  </div>
                </div>
                
                <div className="card-footer">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleViewBookings(ride)}
                    >
                      View Bookings ({ride.bookingsCount || 0})
                    </button>
                    
                    {ride.rideStatus === 'Open' && (
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => updateRideStatus(ride.rideId, 'In Progress')}
                        >
                          Start Ride
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateRideStatus(ride.rideId, 'Cancelled')}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    
                    {ride.rideStatus === 'In Progress' && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateRideStatus(ride.rideId, 'Completed')}
                      >
                        Complete Ride
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRide && <BookingsModal />}
    </div>
  );
};

export default MyRides;