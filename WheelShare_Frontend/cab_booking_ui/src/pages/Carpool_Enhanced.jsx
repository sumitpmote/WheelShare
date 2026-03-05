import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Users, Clock, AlertCircle, Loader, Target, Car, TrendingDown } from "lucide-react";
import { estimateFare } from "../services/rideService";
import { requestCarpoolRide, getAvailableCarpoolRides, sendJoinRequest } from "../services/carpoolService";
import { geocodeAddress, getRoute, reverseGeocode } from "../services/mapplsService";
import { useToast } from "../contexts/ToastContext";
import MapplsMap from "../components/MapplsMap";

const getRoutes = (route, pickup, drop) => {
  if (route?.geometry) return [route.geometry];
  if (pickup && drop) return [[[pickup.lat, pickup.lng], [drop.lat, drop.lng]]];
  return [];
};

function Carpool() {
  const navigate = useNavigate();
  const [pickupText, setPickupText] = useState("");
  const [dropText, setDropText] = useState("");
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [fare, setFare] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [pinMode, setPinMode] = useState(null);
  const mapRef = useRef(null);
  const { success, error: showError } = useToast();

  const geocode = async (query) => {
    if (!query.trim()) throw new Error("Location cannot be empty");
    return await geocodeAddress(query);
  };

  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickup || !drop) {
        setRoute(null);
        return;
      }
      setRouteLoading(true);
      try {
        const routeData = await getRoute(pickup.lat, pickup.lng, drop.lat, drop.lng, { traffic: true, routeType: 'fastest' });
        setRoute(routeData);
      } catch (err) {
        console.error("Failed to fetch route:", err);
        setRoute(null);
      } finally {
        setRouteLoading(false);
      }
    };
    fetchRoute();
  }, [pickup, drop]);

  const handleEstimateFare = async () => {
    if (!pickupText.trim() || !dropText.trim()) {
      setError("Please enter both pickup and drop locations");
      return;
    }
    setLoading(true);
    try {
      setError("");
      setFare(null);
      setAvailableRides([]);
      
      const pickupCoords = await geocode(pickupText);
      const dropCoords = await geocode(dropText);
      setPickup(pickupCoords);
      setDrop(dropCoords);
      
      const payload = {
        sourceLat: pickupCoords.lat,
        sourceLng: pickupCoords.lng,
        sourceAddress: pickupText,
        destinationLat: dropCoords.lat,
        destinationLng: dropCoords.lng,
        destinationAddress: dropText,
      };
      
      const res = await estimateFare(payload);
      setFare(res.data);
      
      const availableRes = await getAvailableCarpoolRides(
        pickupCoords.lat, pickupCoords.lng, dropCoords.lat, dropCoords.lng
      );
      setAvailableRides(availableRes.data);
      
      if (availableRes.data.length > 0) {
        success(`Found ${availableRes.data.length} available ride(s) to share!`);
      }
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to estimate fare");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (rideId) => {
    setBookingLoading(true);
    try {
      const payload = {
        sourceLat: pickup.lat,
        sourceLng: pickup.lng,
        destinationLat: drop.lat,
        destinationLng: drop.lng,
        sourceAddress: pickupText,
        destinationAddress: dropText,
      };
      await sendJoinRequest(rideId, payload);
      success("Join request sent! Waiting for approval.");
      setAvailableRides([]);
    } catch (err) {
      showError(err.response?.data || err.message || "Failed to send request");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShareRide = async () => {
    if (!pickup || !drop) {
      setError("Please estimate fare first");
      return;
    }
    setBookingLoading(true);
    try {
      const payload = {
        sourceLat: pickup.lat,
        sourceLng: pickup.lng,
        destinationLat: drop.lat,
        destinationLng: drop.lng,
        sourceAddress: pickupText,
        destinationAddress: dropText,
      };
      const res = await requestCarpoolRide(payload);
      navigate("/ride-status", { 
        state: { 
          rideId: res.data.rideId,
          pickup: pickupText,
          drop: dropText,
          fare: res.data.estimatedFare
        } 
      });
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to share ride");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleMapClick = async (lat, lng) => {
    if (!pinMode) return;
    try {
      const address = await reverseGeocode(lat, lng);
      const coords = { lat, lng };
      if (pinMode === 'pickup') {
        setPickupText(address);
        setPickup(coords);
      } else {
        setDropText(address);
        setDrop(coords);
      }
      setPinMode(null);
      success(`${pinMode === 'pickup' ? 'Pickup' : 'Drop'} location set from map`);
    } catch (err) {
      showError('Failed to get address for selected location');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>🚗 Share Your Ride</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Save money and reduce carbon footprint by sharing rides
        </p>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Select Locations</h3>
          
          <div className="flex flex-col gap-md">
            <div style={{ position: 'relative' }}>
              <MapPin size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--success)' }} />
              <input
                type="text"
                placeholder="Pickup location"
                className="input-field"
                style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }}
                value={pickupText}
                onChange={(e) => setPickupText(e.target.value)}
              />
              <button
                onClick={() => setPinMode('pickup')}
                className="btn"
                style={{ 
                  position: 'absolute', 
                  right: '8px', 
                  top: '8px', 
                  padding: '0.5rem',
                  background: pinMode === 'pickup' ? '#007bff' : '#f8f9fa',
                  color: pinMode === 'pickup' ? 'white' : '#666'
                }}
                title="Pin on map"
              >
                <Target size={16} />
              </button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <Navigation size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--danger)' }} />
              <input
                type="text"
                placeholder="Drop location"
                className="input-field"
                style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }}
                value={dropText}
                onChange={(e) => setDropText(e.target.value)}
              />
              <button
                onClick={() => setPinMode('drop')}
                className="btn"
                style={{ 
                  position: 'absolute', 
                  right: '8px', 
                  top: '8px', 
                  padding: '0.5rem',
                  background: pinMode === 'drop' ? '#007bff' : '#f8f9fa',
                  color: pinMode === 'drop' ? 'white' : '#666'
                }}
                title="Pin on map"
              >
                <Target size={16} />
              </button>
            </div>

            <button
              onClick={handleEstimateFare}
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Car size={20} />
                  Find Rides
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-sm"
              style={{
                background: '#fef2f2',
                color: '#ef4444',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #fee2e2',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginBottom: '2rem' }}>
          {pinMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                padding: '0.75rem', 
                background: '#e3f2fd', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                textAlign: 'center',
                color: '#1976d2',
                fontWeight: 500
              }}
            >
              📍 Click on the map to set {pinMode} location
            </motion.div>
          )}
          <MapplsMap
            center={pickup ? [pickup.lat, pickup.lng] : [19.0330, 73.0297]}
            zoom={13}
            height={400}
            markers={[
              pickup && { lat: pickup.lat, lng: pickup.lng, label: pickupText || 'Pickup', color: '#22c55e' },
              drop && { lat: drop.lat, lng: drop.lng, label: dropText || 'Drop', color: '#ef4444' },
            ].filter(Boolean)}
            routes={getRoutes(route, pickup, drop)}
            routeStyle={{ color: '#ef4444', weight: 4, opacity: 0.8 }}
            showRoute={true}
            onMapClick={pinMode ? handleMapClick : undefined}
          />
          {routeLoading && (
            <div style={{
              padding: '0.5rem',
              background: '#f0f0f0',
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <Loader size={16} className="animate-spin" />
              Loading route details...
            </div>
          )}
          {route && (
            <div style={{
              padding: '0.5rem 1rem',
              background: '#f0f0f0',
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
              fontSize: '0.85rem',
              color: '#666',
              display: 'flex',
              justifyContent: 'space-around'
            }}>
              <span>📍 Distance: {route.distanceText}</span>
              <span>⏱️ Time: {route.durationText}</span>
            </div>
          )}
        </div>

        <AnimatePresence>
          {fare && (
            <>
              {availableRides.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card"
                  style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', border: '2px solid #4caf50' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Users size={24} color="#2e7d32" />
                    <h3 style={{ margin: 0, color: '#2e7d32' }}>
                      {availableRides.length} Available Ride{availableRides.length > 1 ? 's' : ''}
                    </h3>
                  </div>
                  
                  {availableRides.map((ride, index) => (
                    <motion.div 
                      key={ride.rideId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ 
                        background: 'white', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        marginBottom: '0.75rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                            👤 {ride.customerName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {ride.passengerCount} passenger(s) • {ride.availableSeats} seat(s) left
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: '#999', textDecoration: 'line-through' }}>
                            ₹{ride.baseFare}
                          </div>
                          <div style={{ color: '#2e7d32', fontWeight: 700, fontSize: '1.25rem' }}>
                            ₹{Math.round(ride.estimatedFare)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <TrendingDown size={12} />
                            Save ₹{Math.round(ride.baseFare - ride.estimatedFare)}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#666', 
                        marginBottom: '0.75rem',
                        padding: '0.5rem',
                        background: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        <div style={{ marginBottom: '0.25rem' }}>
                          <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                          {ride.sourceAddress}
                        </div>
                        <div>
                          <Navigation size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                          {ride.destinationAddress}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleJoinRequest(ride.rideId)}
                        className="btn"
                        style={{ 
                          width: '100%', 
                          background: '#2e7d32', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                        disabled={bookingLoading}
                      >
                        {bookingLoading ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Users size={16} />
                            Request to Join
                          </>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card"
                style={{ marginBottom: '2rem' }}
              >
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                  {availableRides.length > 0 ? 'Or Create New Ride' : 'Fare Estimate'}
                </h3>
                
                <div style={{ 
                  background: 'var(--surface-alt)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem'
                }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Distance</span>
                    <span style={{ fontWeight: 600 }}>{fare.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-muted)' }}>Base Fare</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                      ₹{fare.estimatedFare}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleShareRide}
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Car size={20} />
                      Create Carpool Ride
                    </>
                  )}
                </button>
                
                {availableRides.length === 0 && (
                  <p style={{ 
                    textAlign: 'center', 
                    fontSize: '0.85rem', 
                    color: 'var(--text-muted)', 
                    marginTop: '0.75rem',
                    marginBottom: 0
                  }}>
                    💡 Others can join your ride and share the cost
                  </p>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Carpool;
