import { Link } from "react-router-dom";
import wheelShareLogo from "../assets/wheelshare logo.png";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#222",
        color: "#fff",
        padding: "40px 15px 15px 15px",
        textAlign: "center",
        marginTop: "auto"
      }}
    >
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
        <img 
          src={wheelShareLogo} 
          alt="WheelShare Logo" 
          style={{
            width: 48,
            height: 48,
            objectFit: 'contain'
          }}
        />
        <span style={{ fontSize: "18px", fontWeight: 700 }}>WheelShare</span>
      </div>

      {/* Footer Links */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
        <Link to="/about" style={{ color: "#fff", textDecoration: "none", fontSize: "14px" }} onMouseEnter={(e) => e.target.style.color = "#4f46e5"} onMouseLeave={(e) => e.target.style.color = "#fff"}>
          About Us
        </Link>
        <Link to="/services" style={{ color: "#fff", textDecoration: "none", fontSize: "14px" }} onMouseEnter={(e) => e.target.style.color = "#4f46e5"} onMouseLeave={(e) => e.target.style.color = "#fff"}>
          Services
        </Link>
        <Link to="/contact" style={{ color: "#fff", textDecoration: "none", fontSize: "14px" }} onMouseEnter={(e) => e.target.style.color = "#4f46e5"} onMouseLeave={(e) => e.target.style.color = "#fff"}>
          Contact Us
        </Link>
        <a href="#privacy" style={{ color: "#fff", textDecoration: "none", fontSize: "14px" }} onMouseEnter={(e) => e.target.style.color = "#4f46e5"} onMouseLeave={(e) => e.target.style.color = "#fff"}>
          Privacy Policy
        </a>
        <a href="#terms" style={{ color: "#fff", textDecoration: "none", fontSize: "14px" }} onMouseEnter={(e) => e.target.style.color = "#4f46e5"} onMouseLeave={(e) => e.target.style.color = "#fff"}>
          Terms of Service
        </a>
      </div>

      © {new Date().getFullYear()} WheelShare. All rights reserved.
    </footer>
  );
}

export default Footer;
