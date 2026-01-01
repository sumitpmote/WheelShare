import React, { useState, useEffect } from 'react';
import { ridesAPI } from '../api';

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0
  });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      // Mock data for earnings
      const mockRides = [
        {
          rideId: 1,
          source: 'Mumbai Central',
          destination: 'Pune Station',
          rideDateTime: '2024-01-20T10:00:00',
          farePerSeat: 250,
          bookingsCount: 3,
          totalEarning: 750,
          rideStatus: 'Completed'
        },
        {
          rideId: 2,
          source: 'Delhi Airport',
          destination: 'Gurgaon Mall',
          rideDateTime: '2024-01-19T14:30:00',
          farePerSeat: 150,
          bookingsCount: 2,
          totalEarning: 300,
          rideStatus: 'Completed'
        },
        {
          rideId: 3,
          source: 'Bangalore IT Park',
          destination: 'Mysore Palace',
          rideDateTime: '2024-01-18T09:00:00',
          farePerSeat: 200,
          bookingsCount: 4,
          totalEarning: 800,
          rideStatus: 'Completed'
        }
      ];

      setRides(mockRides);
      
      const totalEarnings = mockRides.reduce((sum, ride) => sum + ride.totalEarning, 0);
      setEarnings({
        totalEarnings: totalEarnings,
        thisMonth: totalEarnings,
        thisWeek: 1050,
        today: 300
      });
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <h2>Earnings Report</h2>
      
      {/* Earnings Summary */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body text-center">
              <h5>Total Earnings</h5>
              <h3>₹{earnings.totalEarnings}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body text-center">
              <h5>This Month</h5>
              <h3>₹{earnings.thisMonth}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info">
            <div className="card-body text-center">
              <h5>This Week</h5>
              <h3>₹{earnings.thisWeek}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body text-center">
              <h5>Today</h5>
              <h3>₹{earnings.today}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Details */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Ride Earnings History</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ride ID</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Fare/Seat</th>
                  <th>Bookings</th>
                  <th>Total Earning</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rides.map(ride => (
                  <tr key={ride.rideId}>
                    <td>#{ride.rideId}</td>
                    <td>
                      <div>
                        <strong>From:</strong> {ride.source}<br/>
                        <strong>To:</strong> {ride.destination}
                      </div>
                    </td>
                    <td>{new Date(ride.rideDateTime).toLocaleDateString()}</td>
                    <td>₹{ride.farePerSeat}</td>
                    <td>{ride.bookingsCount}</td>
                    <td><strong>₹{ride.totalEarning}</strong></td>
                    <td>
                      <span className="badge bg-success">{ride.rideStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;