import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, RefreshCw, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { verifyOtp, resendOtp } from "../services/authService";
import wheelShareLogo from "../assets/wheelshare logo.png";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!email) {
    navigate("/register");
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await verifyOtp({ email, otp });
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    try {
      await resendOtp({ email });
      setSuccess("OTP resent successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <motion.div
        className="card"
        style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-1">
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <img 
              src={wheelShareLogo} 
              alt="WheelShare Logo" 
              style={{
                width: 72,
                height: 72,
                objectFit: 'contain'
              }}
            />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Verify Your Email</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            We've sent a verification code to<br />
            <strong>{email}</strong>
          </p>
        </div>

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

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-sm mb-1"
            style={{
              background: '#f0fdf4',
              color: '#16a34a',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #bbf7d0',
              fontSize: '0.9rem'
            }}
          >
            <CheckCircle size={18} />
            <span>{success}</span>
          </motion.div>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex flex-col gap-md">
            <div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="input-field"
                style={{ 
                  textAlign: 'center', 
                  fontSize: '1.25rem', 
                  letterSpacing: '0.5rem',
                  fontWeight: 600
                }}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replaceAll(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-1"
              style={{ width: '100%' }}
              disabled={loading || otp.length !== 6}
            >
              {loading ? <Loader size={20} className="animate-spin" /> : 'Verify Email'}
            </button>
          </div>
        </form>

        <div className="text-center mt-1">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            className="btn btn-ghost"
            disabled={resendLoading}
            style={{ fontSize: '0.9rem' }}
          >
            {resendLoading ? (
              <>
                <Loader size={16} className="animate-spin" style={{ marginRight: '0.5rem' }} />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                Resend OTP
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyOtp;
