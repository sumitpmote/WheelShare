import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, MapPin, History, ArrowRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { getCustomerRides } from "../services/rideService";
import { useAuth } from "../contexts/AuthContext";

function CustomerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = user?.name || "Customer";

  const quickActions = [
    {
      title: "Book a Ride",
      desc: "Get a ride to your destination",
      icon: <Car size={32} color="var(--primary)" />,
      action: () => navigate("/book-ride"),
      primary: true
    },
    {
      title: "Ride History",
      desc: "View your past rides",
      icon: <History size={32} color="var(--secondary)" />,
      action: () => navigate("/history")
    },
    {
      title: "Saved Places",
      desc: "Quick access to frequent locations",
      icon: <MapPin size={32} color="var(--accent)" />,
      action: () => navigate("/saved-places")
    }
  ];

  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        const response = await getCustomerRides();
        // Get only the 3 most recent completed rides
        const recentRides = response.data
          .filter(ride => ride.rideStatus === "COMPLETED")
          .slice(0, 3);
        setRides(recentRides);
      } catch (err) {
        console.error("Failed to fetch rides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRides();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, {userName}!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Where would you like to go today?
          </p>
        </div>

        {/* Quick Book Ride */}
        <motion.div
          className="card"
          style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            color: 'white',
            marginBottom: '2rem',
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/book-ride")}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Book a Ride Now</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>
                Quick and easy booking in just a few taps
              </p>
            </div>
            <ArrowRight size={32} style={{ opacity: 0.8 }} />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem' 
          }}>
            {quickActions.slice(1).map((action, actionIndex) => (
              <motion.div
                key={`action-${action.title}`}
                className="card"
                style={{ cursor: 'pointer' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
              >
                <div className="flex items-center gap-md">
                  <div style={{
                    background: 'var(--surface-alt)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{action.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 0 }}>
                      {action.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Rides */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
            <h3>Recent Rides</h3>
            <button 
              className="btn btn-ghost" 
              onClick={() => navigate("/history")}
              style={{ fontSize: '0.9rem' }}
            >
              View All
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading recent rides...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-sm">
              {rides.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                  <Car size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                  <p style={{ color: 'var(--text-muted)' }}>No completed rides yet</p>
                </div>
              ) : (
                rides.map((ride) => (
                  <motion.div
                    key={ride.rideId}
                    className="card"
                    style={{ padding: '1rem' }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-md">
                        <div style={{
                          background: 'var(--surface-alt)',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)'
                        }}>
                          <Car size={20} color="var(--primary)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                            {ride.sourceAddress || 'Source'} → {ride.destinationAddress || 'Destination'}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {new Date(ride.requestedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                          ₹{ride.finalFare || ride.fare}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {ride.distanceKm} km
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default CustomerHome;
