import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Car,
  Clock,
  AlertCircle,
  Loader,
  Power,
  MapIcon,
} from "lucide-react";

import {
  goOnline,
  goOffline,
  updateLocation,
  getNearbyRides,
  acceptRide,
} from "../../services/driverService";

import { getCurrentLocation } from "../../utils/geolocation";
import MapplsMap from "../../components/MapplsMap";

const DriverDashboard = () => {
  const navigate = useNavigate();

  const [online, setOnline] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState("");
  const [driverLocation, setDriverLocation] = useState(null);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const mapRef = useRef(null);

  // =========================
  // GO ONLINE (FIXED ORDER)
  // =========================
  const handleGoOnline = async () => {
    try {
      setError("");
      setLoading(true);

      // 1️⃣ Go online FIRST
      await goOnline();
      setOnline(true);

      // 2️⃣ Then get location
      const location = await getCurrentLocation();
      setDriverLocation(location);

      // 3️⃣ Then update location (now allowed)
      await updateLocation(location.latitude, location.longitude);
    } catch (err) {
      setError(err.message || "Failed to go online");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GO OFFLINE
  // =========================
  const handleGoOffline = async () => {
    try {
      setError("");
      await goOffline();
      setOnline(false);
      setRides([]);
    } catch {
      setError("Failed to go offline");
    }
  };

  // =========================
  // LOCATION TRACKING
  // =========================
  const startLocationTracking = () => {
    const interval = setInterval(async () => {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        setDriverLocation({ latitude, longitude });
        await updateLocation(latitude, longitude);
      } catch (err) {
        console.error("Location update failed:", err);
      }
    }, 5000);

    return interval;
  };

  // =========================
  // POLL NEARBY RIDES
  // =========================
  const pollNearbyRides = () => {
    const interval = setInterval(async () => {
      try {
        const res = await getNearbyRides();
        setRides(res.data || []);
      } catch (err) {
        console.error("Failed to fetch rides:", err);
      }
    }, 3000);

    return interval;
  };

  // =========================
  // START / STOP INTERVALS
  // =========================
  useEffect(() => {
    let locationInterval;
    let ridesInterval;

    if (online) {
      locationInterval = startLocationTracking();
      ridesInterval = pollNearbyRides();
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval);
      if (ridesInterval) clearInterval(ridesInterval);
    };
  }, [online]);

  // =========================
  // ACCEPT RIDE
  // =========================
  const handleAccept = async (rideId) => {
    try {
      setAcceptingId(rideId);
      setError("");

      await acceptRide(rideId);
      sessionStorage.setItem("lastAcceptedRideId", rideId);

      setTimeout(() => {
        navigate("/driver/my-rides");
      }, 800);
    } catch {
      setError("Failed to accept ride. It may have been taken by another driver.");
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Driver Dashboard</h2>

        {error && (
          <div className="card" style={{ background: "#fee", marginBottom: "1rem" }}>
            <AlertCircle color="red" /> {error}
          </div>
        )}

        {/* STATUS */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div className="flex justify-between items-center">
            <div>
              <strong>Status:</strong>{" "}
              {online ? "🟢 Online" : "🔴 Offline"}
            </div>
            <button
              onClick={online ? handleGoOffline : handleGoOnline}
              className={`btn ${online ? "btn-danger" : "btn-primary"}`}
              disabled={loading}
            >
              {loading ? <Loader size={16} /> : <Power size={16} />}
              {online ? "Go Offline" : "Go Online"}
            </button>
          </div>

          {online && driverLocation && (
            <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              <div><MapIcon size={14} /> Latitude: {driverLocation.latitude.toFixed(4)}</div>
              <div><MapIcon size={14} /> Longitude: {driverLocation.longitude.toFixed(4)}</div>
            </div>
          )}
        </div>

        {/* MAP - LIVE DRIVER LOCATION */}
        {online && driverLocation && (
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Your Location</h3>
            <MapplsMap
              ref={mapRef}
              center={[driverLocation.latitude, driverLocation.longitude]}
              zoom={14}
              height={350}
              markers={[
                {
                  lat: driverLocation.latitude,
                  lng: driverLocation.longitude,
                  label: 'Your Location (Live)',
                  color: '#3b82f6',
                },
                selectedRideId &&
                  rides.find(r => r.rideId === selectedRideId) && {
                    lat: rides.find(r => r.rideId === selectedRideId).pickupLat,
                    lng: rides.find(r => r.rideId === selectedRideId).pickupLng,
                    label: 'Pickup',
                    color: '#22c55e',
                  },
              ].filter(Boolean)}
              showRoute={true}
            />
          </div>
        )}

        {/* RIDES */}
        {online ? (
          <>
            <h3>Available Rides ({rides.length})</h3>

            {rides.length === 0 ? (
              <div className="card" style={{ textAlign: "center" }}>
                <Clock size={40} />
                <p>No rides available right now</p>
              </div>
            ) : (
              rides.map((ride) => (
                <motion.div
                  key={ride.rideId}
                  className="card"
                  style={{
                    marginBottom: "1rem",
                    cursor: "pointer",
                    border: selectedRideId === ride.rideId ? "2px solid var(--primary)" : "1px solid #ddd",
                    background: selectedRideId === ride.rideId ? "rgba(33, 150, 243, 0.05)" : "white",
                  }}
                  onClick={() => setSelectedRideId(ride.rideId)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p><MapPin size={14} /> Pickup: {ride.pickupAddress}</p>
                  <p><Navigation size={14} /> Drop: {ride.dropAddress}</p>
                  <p>Distance: {ride.distanceKm} km</p>
                  <p>Fare: ₹{ride.fare}</p>
                  <p>Earning: ₹{ride.driverEarning}</p>

                  <button
                    onClick={() => handleAccept(ride.rideId)}
                    disabled={acceptingId === ride.rideId}
                    className="btn btn-primary"
                  >
                    {acceptingId === ride.rideId ? "Accepting..." : "Accept Ride"}
                  </button>
                </motion.div>
              ))
            )}
          </>
        ) : (
          <div className="card" style={{ textAlign: "center" }}>
            <Car size={50} />
            <p>You are offline. Go online to accept rides.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DriverDashboard;
