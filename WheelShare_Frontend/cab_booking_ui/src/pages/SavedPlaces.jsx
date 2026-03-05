import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Trash2, Loader, Navigation, Car } from "lucide-react";
import { getSavedPlaces, addSavedPlace, deleteSavedPlace } from "../services/savedPlacesService";
import { requestRide } from "../services/rideService";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

function SavedPlaces() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [newRide, setNewRide] = useState({
    rideName: "",
    pickupAddress: "",
    dropAddress: ""
  });
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedRides = async () => {
      try {
        const response = await getSavedPlaces();
        setRides(response.data || []);
      } catch (err) {
        console.error('Fetch rides error:', err);
        showError(err.response?.data?.message || "Failed to load saved rides");
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRides();
  }, [showError]);

  const handleAddRide = async (e) => {
    e.preventDefault();
    if (!newRide.rideName.trim() || !newRide.pickupAddress.trim() || !newRide.dropAddress.trim()) {
      showError("Please fill in all required fields");
      return;
    }
    
    try {
      // Geocode pickup address
      const pickupRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newRide.pickupAddress)}&limit=1`
      );
      const pickupData = await pickupRes.json();
      
      if (!pickupData || pickupData.length === 0) {
        showError("Pickup address not found. Please enter a valid address.");
        return;
      }

      // Geocode drop address
      const dropRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newRide.dropAddress)}&limit=1`
      );
      const dropData = await dropRes.json();
      
      if (!dropData || dropData.length === 0) {
        showError("Drop address not found. Please enter a valid address.");
        return;
      }

      await addSavedPlace({
        rideName: newRide.rideName,
        pickupAddress: newRide.pickupAddress,
        pickupLatitude: parseFloat(pickupData[0].lat),
        pickupLongitude: parseFloat(pickupData[0].lon),
        dropAddress: newRide.dropAddress,
        dropLatitude: parseFloat(dropData[0].lat),
        dropLongitude: parseFloat(dropData[0].lon)
      });
      success("Ride saved successfully!");
      setNewRide({ rideName: "", pickupAddress: "", dropAddress: "" });
      setShowAddForm(false);
      // Refresh the rides list
      const response = await getSavedPlaces();
      setRides(response.data || []);
    } catch (err) {
      console.error('Add ride error:', err);
      showError(err.response?.data?.message || "Failed to save ride");
    }
  };

  const handleDeleteRide = async (rideId, rideName) => {
    try {
      await deleteSavedPlace(rideId);
      success(`${rideName} removed from saved rides`);
      // Refresh the rides list
      const response = await getSavedPlaces();
      setRides(response.data || []);
    } catch (err) {
      console.error('Delete ride error:', err);
      showError(err.response?.data?.message || "Failed to remove ride");
    }
  };

  const handleBookRide = async (ride) => {
    setBookingLoading(true);
    try {
      const payload = {
        sourceLat: ride.pickupLatitude,
        sourceLng: ride.pickupLongitude,
        destinationLat: ride.dropLatitude,
        destinationLng: ride.dropLongitude,
        sourceAddress: ride.pickupAddress,
        destinationAddress: ride.dropAddress,
      };

      const res = await requestRide(payload);
      success("Ride booked successfully!");
      
      navigate("/ride-status", { 
        state: { 
          rideId: res.data.rideId,
          pickup: ride.pickupAddress,
          drop: ride.dropAddress,
          fare: res.data.estimatedFare
        } 
      });
    } catch (err) {
      console.error('Book ride error:', err);
      showError(err.response?.data?.message || "Failed to book ride");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <p>Loading saved rides...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Saved Rides</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} />
            Add Ride
          </button>
        </div>

        {/* Add Ride Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="card"
            style={{ marginBottom: '2rem' }}
          >
            <h3>Add New Ride</h3>
            <form onSubmit={handleAddRide}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Ride Name (e.g., Home to Office)"
                  className="input-field"
                  value={newRide.rideName}
                  onChange={(e) => setNewRide({ ...newRide, rideName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Pickup Location"
                  className="input-field"
                  value={newRide.pickupAddress}
                  onChange={(e) => setNewRide({ ...newRide, pickupAddress: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Drop Location"
                  className="input-field"
                  value={newRide.dropAddress}
                  onChange={(e) => setNewRide({ ...newRide, dropAddress: e.target.value })}
                  required
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Ride
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Saved Rides List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rides.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Car size={48} color="#ccc" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#666' }}>No saved rides</h3>
              <p style={{ color: '#999' }}>Add your favorite routes for quick booking</p>
            </div>
          ) : (
            rides.map((ride, index) => (
              <motion.div
                key={ride.savedPlaceId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#007bff' }}>{ride.rideName}</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <MapPin size={16} color="#28a745" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Pickup</p>
                        <p style={{ margin: 0, fontWeight: '500' }}>{ride.pickupAddress}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                      <Navigation size={16} color="#dc3545" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Drop</p>
                        <p style={{ margin: 0, fontWeight: '500' }}>{ride.dropAddress}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRide(ride.savedPlaceId, ride.rideName)}
                    className="btn"
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      marginLeft: '1rem'
                    }}
                    title="Delete ride"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleBookRide(ride)}
                  disabled={bookingLoading}
                  className="btn btn-primary"
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem'
                  }}
                >
                  {bookingLoading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Car size={20} />}
                  {bookingLoading ? 'Booking Ride...' : 'Book This Ride'}
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default SavedPlaces;
