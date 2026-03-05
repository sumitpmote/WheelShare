import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, MapPin, Navigation, Clock, Filter, Calendar, Loader } from "lucide-react";
import { getCustomerRides } from "../services/rideService";
import { formatDateTimeIST } from "../utils/dateUtils";

function RideHistory() {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await getCustomerRides();
        setRides(response.data);
        setFilteredRides(response.data);
        setError("");
      } catch (err) {
        setError("Failed to load ride history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredRides(rides);
    } else {
      setFilteredRides(rides.filter(ride => ride.rideStatus.toLowerCase() === filter));
    }
  }, [filter, rides]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "var(--success)";
      case "cancelled": return "var(--danger)";
      default: return "var(--text-muted)";
    }
  };

  const totalSpent = rides
    .filter(ride => ride.rideStatus === "COMPLETED")
    .reduce((sum, ride) => sum + (ride.finalFare || ride.fare), 0);

  const totalRides = rides.filter(ride => ride.rideStatus === "COMPLETED").length;

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite', margin: '2rem auto' }} />
        <p>Loading your ride history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <Car size={48} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: 'var(--danger)' }}>Error</h3>
          <p>{error}</p>
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
        <h2 style={{ marginBottom: '2rem' }}>Ride History</h2>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <Car size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{totalRides}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Rides</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <Calendar size={32} color="var(--success)" style={{ margin: '0 auto 0.5rem auto' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>₹{totalSpent.toFixed(2)}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Spent</div>
          </div>
        </div>

        {/* Filter */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="flex items-center gap-md">
            <Filter size={20} color="var(--text-muted)" />
            <span style={{ fontWeight: 600 }}>Filter:</span>
            <div className="flex gap-sm">
              {["all", "completed", "cancelled"].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className="btn"
                  style={{
                    background: filter === filterOption ? 'var(--primary)' : 'var(--surface-alt)',
                    color: filter === filterOption ? 'white' : 'var(--text-main)',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rides List */}
        <div className="flex flex-col gap-md">
          {filteredRides.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Car size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: 'var(--text-muted)' }}>No rides found</h3>
              <p style={{ color: 'var(--text-light)' }}>
                {filter === "all" ? "You haven't taken any rides yet." : `No ${filter} rides found.`}
              </p>
            </div>
          ) : (
            filteredRides.map((ride, index) => (
              <motion.div
                key={ride.rideId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                  <div className="flex items-center gap-sm">
                    <div style={{
                      background: getStatusColor(ride.rideStatus),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {ride.rideStatus}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>
                      ₹{ride.finalFare || ride.fare}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-sm" style={{ marginBottom: '1rem' }}>
                  <div className="flex items-center gap-sm">
                    <MapPin size={16} color="var(--success)" />
                    <span>📍 Pickup: {ride.sourceAddress || 'Not available'}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <Navigation size={16} color="var(--danger)" />
                    <span>🎯 Drop: {ride.destinationAddress || 'Not available'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center" style={{
                  background: 'var(--surface-alt)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem'
                }}>
                  <div className="flex items-center gap-sm">
                    <Clock size={16} color="var(--text-muted)" />
                    <span>{ride.distanceKm} km</span>
                  </div>
                  {ride.driver && (
                    <span style={{ fontWeight: 600 }}>Driver: {ride.driver.name || 'Unknown'}</span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default RideHistory;