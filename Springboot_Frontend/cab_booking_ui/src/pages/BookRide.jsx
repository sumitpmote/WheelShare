import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, Car, Clock, AlertCircle, Loader, Heart, Star, Target } from "lucide-react";
import { estimateFare, requestRide } from "../services/rideService";
import { addSavedPlace, getSavedPlaces } from "../services/savedPlacesService";
import { geocodeAddress, getRoute, reverseGeocode } from "../services/mapplsService";
import { useToast } from "../contexts/ToastContext";
import MapplsMap from "../components/MapplsMap";

const getRoutes = (route, pickup, drop) => {
  if (route?.geometry) {
    return [route.geometry];
  }
  if (pickup && drop) {
    return [[[pickup.lat, pickup.lng], [drop.lat, drop.lng]]];
  }
  return [];
};

function BookRide() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pickupText, setPickupText] = useState("");
  const [dropText, setDropText] = useState("");
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [fare, setFare] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [showSavedPlaces, setShowSavedPlaces] = useState(false);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [pinMode, setPinMode] = useState(null); // 'pickup' or 'drop'
  const mapRef = useRef(null);
  const { success, error: showError } = useToast();

  const geocode = async (query) => {
    if (!query.trim()) {
      throw new Error("Location cannot be empty");
    }
    
    return await geocodeAddress(query);
  };

  // Fetch route when both pickup and drop are set
  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickup || !drop) {
        setRoute(null);
        return;
      }

      setRouteLoading(true);
      try {
        const routeData = await getRoute(
          pickup.lat,
          pickup.lng,
          drop.lat,
          drop.lng,
          { traffic: true, routeType: 'fastest' }
        );
        setRoute(routeData);
      } catch (err) {
        console.error("Failed to fetch route:", err);
        // Still allow booking even if route fails
        setRoute(null);
      } finally {
        setRouteLoading(false);
      }
    };

    fetchRoute();
  }, [pickup, drop]);

  // Load saved places and handle navigation state
  useEffect(() => {
    const loadSavedPlaces = async () => {
      try {
        const response = await getSavedPlaces();
        setSavedPlaces(response.data);
      } catch (err) {
        console.error("Failed to load saved places:", err);
        // Continue without saved places if loading fails
      }
    };
    
    loadSavedPlaces();
    
    // Handle saved place selection from navigation
    if (location.state?.pickup) {
      const { pickup: savedPickup } = location.state;
      setPickupText(savedPickup.text);
      setPickup({ lat: savedPickup.lat, lng: savedPickup.lng });
    }
    
    if (location.state?.drop) {
      const { drop: savedDrop } = location.state;
      setDropText(savedDrop.text);
      setDrop({ lat: savedDrop.lat, lng: savedDrop.lng });
    }
  }, [location.state]);

  const handleEstimateFare = async () => {
    if (!pickupText.trim() || !dropText.trim()) {
      setError("Please enter both pickup and drop locations");
      return;
    }

    setLoading(true);
    try {
      setError("");
      setFare(null);

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
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to estimate fare");
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async () => {
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

      const res = await requestRide(payload);
      navigate("/ride-status", { 
        state: { 
          rideId: res.data.rideId,
          pickup: pickupText,
          drop: dropText,
          fare: res.data.estimatedFare
        } 
      });
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to book ride");
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
  const handleSavePlace = async () => {
    if (!pickup || !drop) {
      showError('Please set both pickup and drop locations first');
      return;
    }
    
    try {
      await addSavedPlace({
        RideName: `${pickupText.split(',')[0]} to ${dropText.split(',')[0]}`,
        PickupAddress: pickupText,
        PickupLatitude: pickup.lat,
        PickupLongitude: pickup.lng,
        DropAddress: dropText,
        DropLatitude: drop.lat,
        DropLongitude: drop.lng
      });
      success('Ride saved to favorites!');
      
      // Refresh saved places
      const response = await getSavedPlaces();
      setSavedPlaces(response.data);
    } catch (err) {
      console.error('Failed to save ride:', err);
      showError('Failed to save ride');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Book Your Ride</h2>

        {/* Location Input */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Select Locations</h3>
          </div>
          
          {showSavedPlaces && (
            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Choose from saved places:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {savedPlaces.map(place => (
                  <div key={place.savedPlaceId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.9rem' }}>{place.rideName}</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        onClick={() => {
                          setPickupText(place.pickupAddress);
                          setPickup({ lat: place.pickupLatitude, lng: place.pickupLongitude });
                        }}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        Pickup
                      </button>
                      <button
                        onClick={() => {
                          setDropText(place.dropAddress);
                          setDrop({ lat: place.dropLatitude, lng: place.dropLongitude });
                        }}
                        className="btn"
                        style={{ background: '#28a745', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        Drop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-md">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
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
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
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
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={handleEstimateFare}
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? <Loader size={20} className="animate-spin" /> : 'Estimate Fare'}
              </button>
              {pickup && drop && (
                <button
                  onClick={handleSavePlace}
                  className="btn"
                  style={{ background: '#28a745', color: 'white', padding: '0.75rem 1rem' }}
                  title="Save this ride"
                >
                  <Heart size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-sm mb-1"
            style={{
              background: '#fef2f2',
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fee2e2',
              fontSize: '0.9rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Map */}
        <div style={{ marginBottom: '2rem' }}>
          {pinMode && (
            <div style={{ 
              padding: '0.75rem', 
              background: '#e3f2fd', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              textAlign: 'center',
              color: '#1976d2'
            }}>
              📍 Click on the map to set {pinMode} location
            </div>
          )}
          <MapplsMap
            center={pickup ? [pickup.lat, pickup.lng] : [19.0330, 73.0297]}
            zoom={13}
            height={400}
            markers={[
              pickup && {
                lat: pickup.lat,
                lng: pickup.lng,
                label: pickupText || 'Pickup',
                color: '#22c55e',
              },
              drop && {
                lat: drop.lat,
                lng: drop.lng,
                label: dropText || 'Drop',
                color: '#ef4444',
              },
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

        {/* Fare Display */}
        {fare && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ marginBottom: '2rem' }}
          >
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Fare Estimate</h3>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <div className="flex items-center gap-sm">
                <Clock size={20} color="var(--text-muted)" />
                <span>Distance: {fare.distanceKm} km</span>
              </div>
              <div className="flex items-center gap-sm">
                <Car size={20} color="var(--text-muted)" />
                <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>₹{fare.estimatedFare}</span>
              </div>
            </div>
            
            <button
              onClick={handleBookRide}
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={bookingLoading}
            >
              {bookingLoading ? <Loader size={20} className="animate-spin" /> : 'Book Ride'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default BookRide;
