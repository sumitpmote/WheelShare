import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Play,
  Flag,
  Banknote,
  CreditCard,
} from "lucide-react";

import { startRide, completeRide, getMyRides } from "../../services/driverService";
import { getRideStatus } from "../../services/rideService";
import { makePayment } from "../../services/paymentService";
import { useToast } from "../../contexts/ToastContext";

const getRideStatusColor = (rideStatus) => {
  if (rideStatus === 'ACCEPTED') return 'var(--warning)';
  if (rideStatus === 'STARTED') return 'var(--primary)';
  return 'var(--success)';
};

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cashPaymentConfirming, setCashPaymentConfirming] = useState(null);
  const [cashPayments, setCashPayments] = useState([]);
  const { success, error: showError, confirm } = useToast();

  // Load cash payments from localStorage
  useEffect(() => {
    const loadCashPayments = () => {
      const payments = JSON.parse(localStorage.getItem('cashPayments') || '[]');
      setCashPayments(payments);
    };
    
    loadCashPayments();
    const interval = setInterval(loadCashPayments, 2000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchRides = async () => {
      try {
        console.log("Fetching my rides...");
        const response = await getMyRides();
        console.log("My rides response:", response.data);
        
        if (response.data && response.data.length > 0) {
          setRides(response.data);
          sessionStorage.setItem("lastAcceptedRideId", response.data[0].rideId);
        } else {
          const rideIdStr = sessionStorage.getItem("lastAcceptedRideId");
          
          if (rideIdStr) {
            try {
              const rideId = Number.parseInt(rideIdStr, 10);
              const rideResponse = await getRideStatus(rideId);
              
              if (rideResponse.data.rideStatus === "COMPLETED") {
                setRides([]);
                sessionStorage.removeItem("lastAcceptedRideId");
              } else {
                setRides([rideResponse.data]);
              }
            } catch (error_) {
              console.error("Failed to get ride status:", error_);
              setRides([]);
              sessionStorage.removeItem("lastAcceptedRideId");
            }
          } else {
            setRides([]);
          }
        }
        
        setError("");
      } catch (err) {
        console.error("Error fetching rides:", err);
        setError(err.response?.data?.message || "Failed to load rides");
        setRides([]);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    if (isInitialLoad) {
      fetchRides();
    }
    
    const interval = setInterval(fetchRides, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // START RIDE
  // =========================
  const handleStartRide = async (rideId) => {
    try {
      setError("");
      setActionLoading({ rideId, action: "start" });

      await startRide(rideId);
      
      // Refresh rides list to get updated status
      const response = await getMyRides();
      if (response.data && response.data.length > 0) {
        setRides(response.data);
      } else {
        // Fallback to individual ride status
        const rideResponse = await getRideStatus(rideId);
        setRides([rideResponse.data]);
      }

      success("Ride started successfully!");
    } catch (err) {
      console.error("Start ride error:", err);
      showError(err.response?.data?.message || "Failed to start ride");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // COMPLETE RIDE
  // =========================
  const handleCompleteRide = async (rideId) => {
    try {
      const confirmed = await confirm(
        "Complete Ride",
        "Have you completed the ride?",
        "Yes, Complete",
        "Cancel"
      );
      if (!confirmed) return;

      setError("");
      setActionLoading({ rideId, action: "complete" });

      await completeRide(rideId);
      
      // Clean up sessionStorage when ride is completed
      sessionStorage.removeItem("lastAcceptedRideId");
      
      // Refresh rides list
      const response = await getMyRides();
      setRides(response.data || []);

      success("Ride completed successfully!");
    } catch (err) {
      console.error("Complete ride error:", err);
      showError(err.response?.data?.message || "Failed to complete ride");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmCashPayment = async (rideId, received) => {
    try {
      setCashPaymentConfirming(rideId);
      
      if (received) {
        success("Cash payment confirmed!");
      } else {
        success("Payment marked as pending. Customer will be asked to pay again.");
      }
      
      // Remove from localStorage
      const payments = JSON.parse(localStorage.getItem('cashPayments') || '[]');
      const updatedPayments = payments.filter(p => p.rideId !== rideId);
      localStorage.setItem('cashPayments', JSON.stringify(updatedPayments));
      setCashPayments(updatedPayments);
      
    } catch (err) {
      console.error("Cash payment confirmation error:", err);
      showError("Failed to confirm payment status");
    } finally {
      setCashPaymentConfirming(null);
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "2rem", minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: "center" }}>
          <Loader size={40} style={{ animation: "spin 1s linear infinite", display: 'inline-block' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your rides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: "2rem", minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: "center", padding: '2rem', maxWidth: '500px' }}>
          <AlertCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: 'var(--danger)' }}>Error</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={() => globalThis.location.reload()} 
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 0", minHeight: 'calc(100vh - 200px)' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 style={{ marginBottom: '2rem' }}>My Rides</h2>

        {rides.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: '3rem 2rem' }}>
            <Clock size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--text-muted)' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Active Rides</h3>
            <p style={{ color: 'var(--text-muted)' }}>You don't have any active rides right now</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {rides.map((ride) => (
              <motion.div 
                key={ride.rideId} 
                className="card" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  borderLeft: `4px solid ${getRideStatusColor(ride.rideStatus)}`,
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.25rem' }}>Ride #{ride.rideId}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Status: <strong>{ride.rideStatus}</strong>
                    </p>
                  </div>
                  {ride.rideStatus === 'COMPLETED' && (
                    <CheckCircle size={24} color="var(--success)" />
                  )}
                </div>

                <div className="flex flex-col gap-md" style={{ marginBottom: '1rem' }}>
                  <div className="flex items-center gap-sm">
                    <MapPin size={16} color="var(--success)" />
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pickup</div>
                      <div>{ride.sourceAddress || 'Not available'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <Navigation size={16} color="var(--danger)" />
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Drop</div>
                      <div>{ride.destinationAddress || 'Not available'}</div>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {ride.rideStatus === "ACCEPTED" && (
                    <button
                      onClick={() => handleStartRide(ride.rideId)}
                      className="btn btn-primary"
                      disabled={actionLoading?.rideId === ride.rideId}
                      style={{ flex: 1 }}
                    >
                      {actionLoading?.rideId === ride.rideId ? (
                        <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          <Play size={16} /> Start Ride
                        </>
                      )}
                    </button>
                  )}

                  {ride.rideStatus === "STARTED" && (
                    <button
                      onClick={() => handleCompleteRide(ride.rideId)}
                      className="btn"
                      style={{ background: "var(--success)", color: "white", flex: 1 }}
                      disabled={actionLoading?.rideId === ride.rideId}
                    >
                      {actionLoading?.rideId === ride.rideId ? (
                        <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          <Flag size={16} /> Complete Ride
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* CASH PAYMENT CONFIRMATION */}
                {ride.rideStatus === "COMPLETED" && cashPayments.find(p => p.rideId === ride.rideId) && (
                  <div style={{
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid var(--warning)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginTop: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Banknote size={20} color="var(--warning)" />
                      <strong>Cash Payment Confirmation</strong>
                    </div>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Did you receive the cash payment from the customer?</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleConfirmCashPayment(ride.rideId, true)}
                        className="btn"
                        style={{ background: 'var(--success)', color: 'white', flex: 1 }}
                        disabled={cashPaymentConfirming === ride.rideId}
                      >
                        {cashPaymentConfirming === ride.rideId ? (
                          <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <>Yes, Received</>  
                        )}
                      </button>
                      <button
                        onClick={() => handleConfirmCashPayment(ride.rideId, false)}
                        className="btn"
                        style={{ background: 'var(--danger)', color: 'white', flex: 1 }}
                        disabled={cashPaymentConfirming === ride.rideId}
                      >
                        No, Not Received
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyRides;
