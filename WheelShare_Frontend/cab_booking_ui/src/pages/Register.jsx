import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ChevronRight, Briefcase } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import securityBg from "../assets/vecteezy_premium-security-cyber-digital-concept-abstract-technology_59587627.jpg";
import wheelShareLogo from "../assets/wheelshare logo.png";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER"
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { error: showError } = useToast();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (error) {
      showError("Registration failed: " + (error.response?.data || error.message));
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
        style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join WheelShare to start your journey</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="flex flex-col gap-md">
            {/* Name */}
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
              <input
                name="name"
                placeholder="Full Name"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div style={{ position: 'relative' }}>
              <Phone size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
              <input
                name="phone"
                placeholder="Phone Number"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div style={{ position: 'relative' }}>
              <Briefcase size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
              <select
                name="role"
                className="input-field"
                style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                onChange={handleChange}
                defaultValue="CUSTOMER"
              >
                <option value="CUSTOMER">I want to Ride (Customer)</option>
                <option value="DRIVER">I want to Drive (Driver)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-1"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              {!loading && <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />}
            </button>
          </div>
        </form>

        <p className="text-center mt-1" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
        </p>
      </motion.div>
      </div>
    </div>
  );
}

export default Register;
