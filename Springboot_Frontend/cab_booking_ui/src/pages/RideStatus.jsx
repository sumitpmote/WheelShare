import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Car, Phone, CheckCircle, AlertCircle, Loader, XCircle, CreditCard, Banknote } from "lucide-react";
import { getRideStatus, cancelRide } from "../services/rideService";
import { makePayment } from "../services/paymentService";
import { getRoute } from "../services/mapplsService";
import { useToast } from "../contexts/ToastContext";
import { processRazorpayPayment } from "../services/razorpayService";
import MapplsMap from "../components/MapplsMap";

const getStatusInfo = (rideData) => {
  if (!rideData) return { 
    title: "Loading...", 
    desc: "Fetching your ride details",
    color: "var(--text-muted)", 
    icon: <Clock size={24} />,
    bgColor: "#f0f0f0"
  };
  
  switch (rideData.status) {
    case "REQUESTED":
      return { 
        title: "Finding Driver", 
        desc: "We're searching for the best driver near you",
        color: "var(--warning)",
        icon: <Clock size={24} />,
        bgColor: "rgba(255, 193, 7, 0.1)"
      };
    case "ACCEPTED":
      return { 
        title: "Driver Assigned", 
        desc: "Your driver is on the way to pick you up",
        color: "var(--primary)",
        icon: <Car size={24} />,
        bgColor: "rgba(33, 150, 243, 0.1)"
      };
    case "STARTED":
      return { 
        title: "Ride in Progress", 
        desc: "You're on your way to your destination",
        color: "var(--success)",
        icon: <Navigation size={24} />,
        bgColor: "rgba(76, 175, 80, 0.1)"
      };
    case "COMPLETED":
      return { 
        title: "Ride Completed", 
        desc: "Thank you for choosing WheelShare!",
        color: "var(--success)",
        icon: <CheckCircle size={24} />,
        bgColor: "rgba(76, 175, 80, 0.1)"
      };
    case "CANCELLED":
      return { 
        title: "Ride Cancelled", 
        desc: "Your ride has been cancelled",
        color: "var(--danger)",
        icon: <XCircle size={24} />,
        bgColor: "rgba(244, 67, 54, 0.1)"
      };
    default:
      return { 
        title: "Unknown Status", 
        desc: "",
        color: "var(--text-muted)",
        icon: <AlertCircle size={24} />,
        bgColor: "#f0f0f0"
      };
  }
};

const getEstimatedTime = (rideData) => {
  if (!rideData) return "Loading...";
  
  switch (rideData.status) {
    case "REQUESTED": return "Finding driver...";
    case "ACCEPTED": return "2-5 minutes";
    case "STARTED": return "Arriving soon";
    case "COMPLETED": return "Completed";
    case "CANCELLED": return "Cancelled";
    default: return "Unknown";
  }
};

const getPollingStatusText = (loading, pollingStatus) => {
  if (loading) return 'Connecting...';
  return pollingStatus === 'connected' ? 'Live updates enabled' : 'Reconnecting...';
};

function RideStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rideId, pickup, drop, fare } = location.state || {};
  
  const [rideData, setRideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pollingStatus, setPollingStatus] = useState("polling");
  const [cancelling, setCancelling] = useState(false);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
  const mapRef = useRef(null);
  const { success, error: showError, confirm } = useToast();

  // Debug: log initial state
  useEffect(() => {
    console.log("RideStatus page loaded with:", { rideId, pickup, drop, fare });
  }, []);

  // If no rideId in location state, show error immediately
  useEffect(() => {
    if (!rideId) {
      console.warn("No rideId provided to RideStatus");
      setError("No ride found. Please book a ride first.");
      setLoading(false);
    }
  }, [rideId]);

  // Fetch and poll ride status
  useEffect(() => {
    if (!rideId) {
      return;
    }

    const fetchRideStatus = async () => {
      try {
        console.log("Fetching ride status for rideId:", rideId);
        const response = await getRideStatus(rideId);
        console.log("Ride status response:", response.data);
        const newRideData = response.data;
        
        // Check if ride just completed
        if (rideData?.status !== "COMPLETED" && newRideData.status === "COMPLETED") {
          success("Ride completed successfully!");
          
          // Show payment method selection modal only if payment not already processed
          if (!newRideData.paymentStatus || newRideData.paymentStatus === 'PENDING') {
            if (!paymentCompleted && !paymentMethodSelected) {
              setTimeout(() => {
                setShowPaymentModal(true);
              }, 1000);
            }
          }
        }
        
        setRideData(newRideData);
        setError("");
        setPollingStatus("connected");
      } catch (err) {
        console.error("Error fetching ride status:", err);
        setError(err.response?.data?.message || "Failed to fetch ride status");
        setPollingStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchRideStatus();
    
    // Poll for status updates every 2 seconds for more real-time updates
    const interval = setInterval(fetchRideStatus, 2000);
    
    return () => clearInterval(interval);
  }, [rideId, rideData?.status, success, showError]);

  // Fetch route when ride data is available
  useEffect(() => {
    const fetchRoute = async () => {
      if (!rideData?.pickupLat || !rideData?.pickupLng || !rideData?.destinationLat || !rideData?.destinationLng) {
        return;
      }

      setRouteLoading(true);
      try {
        const routeData = await getRoute(
          rideData.pickupLat,
          rideData.pickupLng,
          rideData.destinationLat,
          rideData.destinationLng,
          { traffic: true, routeType: 'fastest' }
        );
        setRoute(routeData);
      } catch (err) {
        console.error("Failed to fetch route:", err);
        // Continue without route
      } finally {
        setRouteLoading(false);
      }
    };

    fetchRoute();
  }, [rideData?.pickupLat, rideData?.pickupLng, rideData?.destinationLat, rideData?.destinationLng]);

  const handleCancelRide = async () => {
    try {
      const confirmed = await confirm(
        "Cancel Ride",
        "Are you sure you want to cancel this ride?",
        "Yes, Cancel",
        "No, Keep Ride"
      );
      if (!confirmed) return;

      setCancelling(true);
      await cancelRide(rideId);
      
      // Clear the polling interval before navigating
      setPollingStatus("cancelled");
      
      success("Ride cancelled successfully");
      
      // Use setTimeout to ensure toast is shown before navigation
      setTimeout(() => {
        navigate("/home");
      }, 1000);
      
    } catch (err) {
      setError("Failed to cancel ride");
      console.error(err);
      setCancelling(false);
    }
  };

  const handlePaymentMethodSelect = async (method) => {
    setSelectedPaymentMethod(method);
    setPaymentMethodSelected(true);
    setShowPaymentModal(false);
    setPaymentCompleted(true);
    
    if (method === 'cash') {
      // Store cash payment info in localStorage for driver to see
      const cashPaymentInfo = {
        rideId: rideId,
        paymentMethod: 'CASH',
        paymentStatus: 'PENDING',
        timestamp: Date.now()
      };
      
      // Get existing cash payments or create new array
      const existingPayments = JSON.parse(localStorage.getItem('cashPayments') || '[]');
      existingPayments.push(cashPaymentInfo);
      localStorage.setItem('cashPayments', JSON.stringify(existingPayments));
      
      success("Cash payment option selected. Driver will confirm receipt.");
    } else if (method === 'online') {
      try {
        const paymentResult = await processRazorpayPayment(rideData);
        await makePayment(rideId, 'UPI', paymentResult.paymentId);
        success("Payment processed successfully!");
      } catch (err) {
        console.error("Payment error:", err);
      }
    }
  };

  if (loading && !pickup) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            margin: '2rem auto', 
            width: '60px', 
            height: '60px',
            animation: 'spin 1s linear infinite'
          }}>
            <Loader size={60} color="var(--primary)" />
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Fetching your ride details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Error</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
          <button onClick={() => navigate("/book-ride")} className="btn btn-primary" style={{ width: '100%' }}>
            Book a Ride
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(rideData);
  const estimatedTime = getEstimatedTime(rideData);

  // If we have initial data from navigation, show it while loading
  if (!error && (pickup || drop)) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Ride Status</h2>

          {/* Status Card */}
          <motion.div 
            className="card" 
            style={{ 
              marginBottom: '2rem', 
              textAlign: 'center',
              background: statusInfo.bgColor,
              borderLeft: `4px solid ${statusInfo.color}`
            }}
            animate={{ scale: 1 }}
            initial={{ scale: 0.95 }}
          >
            <div style={{ 
              background: statusInfo.color, 
              color: 'white', 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: `0 4px 12px ${statusInfo.color}40`
            }}>
              {statusInfo.icon}
            </div>
            <h3 style={{ color: statusInfo.color, marginBottom: '0.5rem', fontSize: '1.5rem' }}>{statusInfo.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>{statusInfo.desc}</p>
            {loading && (
              <p style={{ fontSize: '0.85rem', color: 'var(--warning)' }}>Loading ride details...</p>
            )}

            {/* Polling Status Indicator */}
            <div style={{ 
              marginTop: '1rem', 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <div style={{ 
                width: '6px', 
                height: '6px', 
                background: pollingStatus === 'connected' ? 'var(--success)' : 'var(--warning)',
                borderRadius: '50%',
                animation: pollingStatus === 'connected' ? 'pulse 2s infinite' : 'none'
              }} />
              {getPollingStatusText(loading, pollingStatus)}
            </div>
          </motion.div>

          {/* Trip Details */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Trip Details</h3>
            <div className="flex flex-col gap-md">
              {pickup && (
                <div className="flex items-center gap-sm">
                  <MapPin size={20} color="var(--success)" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Pickup</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{pickup}</div>
                  </div>
                </div>
              )}
              {drop && (
                <div className="flex items-center gap-sm">
                  <Navigation size={20} color="var(--danger)" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Drop</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{drop}</div>
                  </div>
                </div>
              )}
              {(fare || rideData?.fare) && (
                <div className="flex justify-between items-center" style={{ 
                  background: 'var(--surface-alt)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)',
                  marginTop: '0.5rem'
                }}>
                  <span style={{ fontWeight: 600 }}>Total Fare</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>₹{rideData?.fare || fare}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cancel button for active rides */}
          {rideData?.status && !['COMPLETED', 'CANCELLED'].includes(rideData.status) && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <button 
                onClick={handleCancelRide}
                disabled={cancelling}
                className="btn btn-ghost"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Ride'}
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <Loader size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
              <p style={{ marginTop: '0.5rem' }}>Fetching latest updates...</p>
            </div>
          )}
        </motion.div>

        {/* Payment Method Selection Modal */}
        {showPaymentModal && !paymentCompleted && !paymentMethodSelected && rideData?.status === "COMPLETED" && (!rideData?.paymentStatus || rideData?.paymentStatus === 'PENDING') && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
              style={{
                maxWidth: '400px',
                width: '90%',
                margin: '1rem',
                textAlign: 'center'
              }}
            >
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Choose Payment Method</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>How would you like to pay for this ride?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handlePaymentMethodSelect('cash')}
                  className="btn"
                  style={{
                    background: 'var(--success)',
                    color: 'white',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  <Banknote size={20} />
                  Pay with Cash
                </button>
                
                <button
                  onClick={() => handlePaymentMethodSelect('online')}
                  className="btn"
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  <CreditCard size={20} />
                  Pay Online
                </button>
              </div>
            </motion.div>
          </div>
        )}
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
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Ride Status</h2>

        {/* Status Card */}
        <motion.div 
          className="card" 
          style={{ 
            marginBottom: '2rem', 
            textAlign: 'center',
            background: statusInfo.bgColor,
            borderLeft: `4px solid ${statusInfo.color}`
          }}
          animate={{ scale: 1 }}
          initial={{ scale: 0.95 }}
        >
          <div style={{ 
            background: statusInfo.color, 
            color: 'white', 
            width: '70px', 
            height: '70px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: `0 4px 12px ${statusInfo.color}40`
          }}>
            {statusInfo.icon}
          </div>
          <h3 style={{ color: statusInfo.color, marginBottom: '0.5rem', fontSize: '1.5rem' }}>{statusInfo.title}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>{statusInfo.desc}</p>
          <div style={{ 
            background: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: 'var(--radius-full)', 
            display: 'inline-block',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: statusInfo.color,
            border: `2px solid ${statusInfo.color}`
          }}>
            ⏱️ ETA: {estimatedTime}
          </div>

          {/* Polling Status Indicator */}
          <div style={{ 
            marginTop: '1rem', 
            fontSize: '0.75rem', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ 
              width: '6px', 
              height: '6px', 
              background: pollingStatus === 'connected' ? 'var(--success)' : 'var(--warning)',
              borderRadius: '50%',
              animation: pollingStatus === 'connected' ? 'pulse 2s infinite' : 'none'
            }} />
            {pollingStatus === 'connected' ? 'Live updates enabled' : 'Reconnecting...'}
          </div>
        </motion.div>

        {/* Trip Details */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Trip Details</h3>
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <MapPin size={20} color="var(--success)" />
              <div>
                <div style={{ fontWeight: 600 }}>Pickup</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{pickup}</div>
              </div>
            </div>
            <div className="flex items-center gap-sm">
              <Navigation size={20} color="var(--danger)" />
              <div>
                <div style={{ fontWeight: 600 }}>Drop</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{drop}</div>
              </div>
            </div>
            <div className="flex justify-between items-center" style={{ 
              background: 'var(--surface-alt)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontWeight: 600 }}>Total Fare</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>₹{rideData?.fare || fare}</span>
            </div>
          </div>
        </div>

        {/* Map with Route */}
        {rideData && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Route Map</h3>
            <MapplsMap
              ref={mapRef}
              center={
                rideData?.driverLat && rideData?.driverLng
                  ? [rideData.driverLat, rideData.driverLng]
                  : [rideData?.pickupLat || 28.6, rideData?.pickupLng || 77.2]
              }
              zoom={13}
              height={350}
              markers={[
                {
                  lat: rideData.pickupLat,
                  lng: rideData.pickupLng,
                  label: pickup || 'Pickup',
                  color: '#22c55e',
                },
                {
                  lat: rideData.destinationLat,
                  lng: rideData.destinationLng,
                  label: drop || 'Drop',
                  color: '#ef4444',
                },
                rideData?.driverLat &&
                  rideData?.driverLng && {
                    lat: rideData.driverLat,
                    lng: rideData.driverLng,
                    label: `${rideData?.driver?.name || 'Driver'} (Current)`,
                    color: '#3b82f6',
                  },
              ].filter(Boolean)}
              routes={
                route?.geometry
                  ? [route.geometry]
                  : [[
                      [rideData.pickupLat, rideData.pickupLng],
                      [rideData.destinationLat, rideData.destinationLng],
                    ]]
              }
              routeStyle={{ color: '#ef4444', weight: 4, opacity: 0.8 }}
              showRoute={true}
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
        )}

        {/* Driver Details - Enhanced */}
        {rideData?.driver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ 
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, var(--primary)10, var(--primary)05)',
              borderLeft: '4px solid var(--primary)'
            }}
          >
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>🚕 Your Driver</h3>
            <div className="flex items-center gap-md" style={{ marginBottom: '1rem' }}>
              <div style={{
                background: 'var(--primary)',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {rideData.driver.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{rideData.driver.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>🪪 {rideData.driver.licenseNumber}</div>
              </div>
              <a 
                href={`tel:${rideData.driver.phone}`}
                className="btn btn-primary"
                style={{ 
                  padding: '0.75rem 1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  flexShrink: 0
                }}
              >
                <Phone size={18} />
                Call
              </a>
            </div>
            <div style={{
              background: 'white',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              Driver is on the way to pick you up
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-md">
          {rideData?.status === "COMPLETED" || rideData?.status === "CANCELLED" ? (
            <button 
              onClick={() => navigate("/home")} 
              className="btn btn-primary" 
              style={{ flex: 1 }}
            >
              {rideData?.status === "COMPLETED" ? "Book Another Ride" : "Go Home"}
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate("/home")} 
                className="btn btn-outline" 
                style={{ flex: 1 }}
              >
                Go Home
              </button>
              {rideData?.status === "REQUESTED" && (
                <button 
                  onClick={handleCancelRide}
                  disabled={cancelling}
                  className="btn" 
                  style={{ 
                    flex: 1, 
                    background: 'var(--danger)', 
                    color: 'white' 
                  }}
                >
                  {cancelling ? (
                    <>
                      <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Cancel Ride
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Payment Method Selection Modal */}
      {showPaymentModal && !paymentCompleted && !paymentMethodSelected && rideData?.status === "COMPLETED" && (!rideData?.paymentStatus || rideData?.paymentStatus === 'PENDING') && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{
              maxWidth: '400px',
              width: '90%',
              margin: '1rem',
              textAlign: 'center'
            }}
          >
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Choose Payment Method</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>How would you like to pay for this ride?</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => handlePaymentMethodSelect('cash')}
                className="btn"
                style={{
                  background: 'var(--success)',
                  color: 'white',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                <Banknote size={20} />
                Pay with Cash
              </button>
              
              <button
                onClick={() => handlePaymentMethodSelect('online')}
                className="btn"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                <CreditCard size={20} />
                Pay Online
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default RideStatus;