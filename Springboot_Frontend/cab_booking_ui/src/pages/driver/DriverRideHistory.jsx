import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, MapPin, Navigation, Clock, User, Loader } from "lucide-react";
import { getRideHistory } from "../../services/driverService";
import { formatDateTimeIST } from "../../utils/dateUtils";

function DriverRideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const response = await getRideHistory();
        setRides(response.data);
        setError("");
      } catch (err) {
        setError("Failed to load ride history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  const totalEarnings = rides.reduce((sum, ride) => sum + ride.driverEarning, 0);
  const totalRides = rides.length;

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <p>Loading ride history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <Car size={48} color="red" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: 'red' }}>Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 style={{ marginBottom: '2rem' }}>Ride History</h2>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <Car size={32} color="#007bff" style={{ margin: '0 auto 0.5rem auto' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#007bff' }}>{totalRides}</div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Rides</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#28a745', margin: '0 auto 0.5rem auto' }}>₹</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#28a745' }}>{totalEarnings.toFixed(2)}</div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Earnings</div>
          </div>
        </div>

        {/* Rides List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rides.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Car size={48} color="#ccc" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#666' }}>No completed rides</h3>
              <p style={{ color: '#999' }}>Your completed rides will appear here.</p>
            </div>
          ) : (
            rides.map((ride, index) => (
              <motion.div
                key={ride.rideId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h4>Ride #{ride.rideId}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                      <User size={16} />
                      <span>{ride.customerName}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#28a745' }}>
                      ₹{ride.driverEarning.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Fare: ₹{(ride.finalFare || ride.fare).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="#28a745" />
                    <span>Pickup: {ride.sourceAddress || 'Not available'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Navigation size={16} color="#dc3545" />
                    <span>Drop: {ride.destinationAddress || 'Not available'}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8f9fa',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="#666" />
                    <span>{ride.distanceKm.toFixed(2)} km</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default DriverRideHistory;