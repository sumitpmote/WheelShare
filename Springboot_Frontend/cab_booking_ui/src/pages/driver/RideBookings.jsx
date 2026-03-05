import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, User, AlertCircle, Loader, CheckCircle } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";

function RideBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // API call to fetch ride bookings
        const mockBookings = [];
        setBookings(mockBookings);
        setError("");
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load ride bookings");
        showError("Failed to load ride bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [showError]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <Loader size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <p>Loading ride bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Error</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ marginBottom: '2rem' }}>Ride Bookings</h2>

        {bookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <CheckCircle size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
            <h3>No Pending Bookings</h3>
            <p style={{ color: 'var(--text-muted)' }}>You don't have any pending ride bookings at the moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h4>Booking #{booking.id}</h4>
                  <span style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem'
                  }}>
                    {booking.status}
                  </span>
                </div>

                <div className="flex items-center gap-sm" style={{ marginBottom: '1rem' }}>
                  <User size={18} color="var(--text-muted)" />
                  <span>{booking.passengerName}</span>
                </div>

                <div className="flex flex-col gap-sm" style={{ marginBottom: '1rem' }}>
                  <div className="flex items-center gap-sm">
                    <MapPin size={18} color="var(--success)" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{booking.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <Navigation size={18} color="var(--danger)" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{booking.dropLocation}</span>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Time</span>
                    <div style={{ fontWeight: 600 }}>
                      <Clock size={16} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                      {booking.time}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fare</span>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary)' }}>
                      ₹{booking.fare}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    Accept
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1 }}>
                    Decline
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default RideBookings;

