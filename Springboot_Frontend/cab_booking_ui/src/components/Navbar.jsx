import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import wheelShareLogo from "../assets/wheelshare logo.png";

// Logo Component using actual image
function WheelShareLogo({ size = 40 }) {
  return (
    <img 
      src={wheelShareLogo} 
      alt="WheelShare Logo" 
      style={{
        width: size,
        height: size,
        objectFit: 'contain'
      }}
    />
  );
}

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isDriver, isCustomer } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavLinks = () => {
    if (!isAuthenticated()) {
      return [
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Contact", path: "/contact" }
      ];
    }

    if (isDriver()) {
      return [
        { name: "Dashboard", path: "/driver/dashboard" },
        { name: "My Rides", path: "/driver/my-rides" },
        { name: "History", path: "/driver/history" },
        { name: "Documents", path: "/documents" },
        { name: "Profile", path: "/driver/profile" }
      ];
    }

    if (isCustomer()) {
      return [
        { name: "Book Ride", path: "/book-ride" },
        { name: "History", path: "/history" },
        { name: "Saved Places", path: "/saved-places" },
        { name: "Documents", path: "/documents" }
      ];
    }

    if (user?.role === 'ADMIN') {
      return [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Manage Users", path: "/admin/users" }
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-sm" 
          style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
        >
          <WheelShareLogo size={28} />
          <span>WheelShare</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden-mobile flex items-center gap-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: isActive(link.path) ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 500
              }}
              className="hover-text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden-mobile flex items-center gap-md">
          {!isAuthenticated() ? (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            <div className="flex items-center gap-md">
              <div className="flex items-center gap-sm text-muted">
                <User size={18} />
                <span style={{ fontSize: '0.9rem' }}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-only btn-ghost"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'none' }}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
}

export default AppNavbar;
