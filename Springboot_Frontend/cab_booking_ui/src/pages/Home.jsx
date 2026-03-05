import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Users, MapPin, Clock, Star } from "lucide-react";
import { getPublicStats } from "../services/statsService";
import cabBookingHome from "../assets/Cab-booking-home.png";

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    avgRating: 4.8
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getPublicStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap size={24} color="var(--primary)" />,
      title: "Instant Booking",
      desc: "Book rides in seconds with our smart matching algorithm"
    },
    {
      icon: <Shield size={24} color="var(--primary)" />,
      title: "Safe & Secure",
      desc: "Verified drivers, real-time tracking, and 24/7 support"
    },
    {
      icon: <Users size={24} color="var(--primary)" />,
      title: "Affordable Rides",
      desc: "Competitive pricing with transparent fare calculation"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{
        backgroundImage: `url(${cabBookingHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '5rem 0 4rem 0',
        textAlign: 'center',
        position: 'relative',
        minHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
        <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
              marginBottom: '1.5rem', 
              lineHeight: 1.1,
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em'
            }}>
              Safe, Reliable & Real-Time<br />Ride Sharing
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-muted)', 
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto 2.5rem auto'
            }}>
              Experience seamless transportation with verified drivers and real-time tracking.
            </p>
            
            <button 
              onClick={() => navigate("/register")} 
              className="btn btn-primary" 
              style={{ 
                padding: '1rem 2rem', 
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.25)'
              }}
            >
              Get Started <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '3rem 0', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem',
          textAlign: 'center'
        }}>
          {[
            { number: `${stats.totalUsers}+`, label: "Happy Riders", icon: <Users size={20} /> },
            { number: `${stats.totalDrivers}+`, label: "Verified Drivers", icon: <Shield size={20} /> },
            { number: `${stats.totalRides}+`, label: "Rides Completed", icon: <MapPin size={20} /> },
            { number: `${stats.avgRating}`, label: "Average Rating", icon: <Star size={20} fill="var(--warning)" color="var(--warning)" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ 
                color: 'var(--primary)', 
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 700, 
                color: 'var(--text-main)', 
                marginBottom: '0.25rem' 
              }}>
                {stat.number}
              </div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%)', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.25rem', 
              marginBottom: '1rem', 
              fontWeight: 700,
              color: 'var(--text-main)'
            }}>
              Why Choose WheelShare?
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-muted)', 
              maxWidth: '600px', 
              margin: '0 auto' 
            }}>
              Built for reliability, safety, and convenience
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                style={{ 
                  padding: '2rem', 
                  textAlign: 'center',
                  background: 'var(--surface-alt)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{
                  background: 'white',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  boxShadow: '0 2px 8px 0 rgba(79, 70, 229, 0.15)'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  marginBottom: '1rem', 
                  fontWeight: 600,
                  color: 'var(--text-main)'
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            marginBottom: '1rem', 
            fontWeight: 700,
            color: 'var(--text-main)'
          }}>
            How It Works
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Get started in just 3 simple steps
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {[
            { step: "1", title: "Sign Up", desc: "Create your account as rider or driver" },
            { step: "2", title: "Book/Accept", desc: "Request a ride or accept ride requests" },
            { step: "3", title: "Enjoy", desc: "Safe journey with real-time tracking" }
          ].map((item, index) => (
            <motion.div
              key={index}
              style={{ textAlign: 'center' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={{
                background: 'var(--primary)',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: '0 auto 1rem auto',
                boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.3)'
              }}>
                {item.step}
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '0.5rem', 
                fontWeight: 600,
                color: 'var(--text-main)'
              }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            marginBottom: '1rem', 
            fontWeight: 700,
            color: 'var(--text-main)'
          }}>
            Learn More About Us
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Explore our services, mission, and get in touch
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            onClick={() => navigate("/about")}
            style={{
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem', 
              fontWeight: 700,
              color: 'var(--primary)'
            }}>
              📖 About Us
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Discover our mission, values, and the team behind WheelShare
            </p>
            <a style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Learn More →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate("/services")}
            style={{
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem', 
              fontWeight: 700,
              color: 'var(--primary)'
            }}>
              🚗 Services
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Explore our ride types, features, and benefits for both riders and drivers
            </p>
            <a style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Explore Services →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate("/contact")}
            style={{
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem', 
              fontWeight: 700,
              color: 'var(--primary)'
            }}>
              💬 Contact Us
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Have questions? Get in touch with our support team
            </p>
            <a style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Get in Touch →
            </a>
          </motion.div>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', 
        padding: '3rem 0',
        marginTop: '2rem'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ 
              color: 'white', 
              fontSize: '2rem', 
              marginBottom: '1rem',
              fontWeight: 700
            }}>
              Join WheelShare Today
            </h2>
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '1.1rem', 
              marginBottom: '2rem',
              maxWidth: '500px',
              margin: '0 auto 2rem auto'
            }}>
              Start your journey with thousands of satisfied riders and drivers
            </p>
            <button 
              onClick={() => navigate("/register")} 
              className="btn"
              style={{ 
                background: 'white', 
                color: 'var(--primary)', 
                padding: '1rem 2rem',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '12px',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              Create Account
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
