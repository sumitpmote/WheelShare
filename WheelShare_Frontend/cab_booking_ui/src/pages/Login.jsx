import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ChevronRight, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import securityBg from "../assets/vecteezy_premium-security-cyber-digital-concept-abstract-technology_59587627.jpg";
import wheelShareLogo from "../assets/wheelshare logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, password });
      login(res.data.token, res.data.userId, res.data.role, res.data.name);
      
      success("Login successful!");
      
      if (res.data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (res.data.role === "DRIVER") {
        navigate("/driver/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      showError(error.response?.data || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${securityBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        zIndex: 1
      }}></div>
      <div style={{ position: 'relative', zIndex: 2 }}>
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
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to continue to WheelShare</p>
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

        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-md">
            {/* Email */}
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-1"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? <Loader size={20} className="animate-spin" /> : 'Login'}
              {!loading && <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />}
            </button>
          </div>
        </form>

        <p className="text-center mt-1" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </motion.div>
      </div>
    </div>
  );
}

export default Login;
