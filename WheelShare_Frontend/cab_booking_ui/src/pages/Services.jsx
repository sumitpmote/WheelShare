import { motion } from "framer-motion";
import { Smartphone, MapPin, Clock, DollarSign, Shield, Zap, Users, Headphones } from "lucide-react";

function Services() {
  const services = [
    {
      icon: <Smartphone size={40} color="var(--primary)" />,
      title: "Easy Booking",
      desc: "Book a ride in just 30 seconds with our intuitive mobile app and web platform"
    },
    {
      icon: <MapPin size={40} color="var(--primary)" />,
      title: "Real-Time Tracking",
      desc: "Track your driver in real-time and know exactly when they'll arrive"
    },
    {
      icon: <Clock size={40} color="var(--primary)" />,
      title: "Quick Pickups",
      desc: "Average pickup time of just 5-10 minutes in most areas"
    },
    {
      icon: <DollarSign size={40} color="var(--primary)" />,
      title: "Transparent Pricing",
      desc: "No hidden charges - see the fare before confirming your ride"
    },
    {
      icon: <Shield size={40} color="var(--primary)" />,
      title: "Safety First",
      desc: "All drivers verified with background checks and real-time safety features"
    },
    {
      icon: <Users size={40} color="var(--primary)" />,
      title: "Community Driven",
      desc: "Join thousands of users in a trusted and reliable ride-sharing community"
    }
  ];

  const features = [
    {
      title: "For Riders",
      points: [
        "Quick and easy ride booking",
        "Multiple payment options",
        "Ride history and receipts",
        "Emergency SOS button",
        "Share ride details with contacts",
        "Saved favorite locations",
        "Affordable pricing options",
        "24/7 customer support"
      ]
    },
    {
      title: "For Drivers",
      points: [
        "Flexible earning opportunities",
        "Real-time ride requests",
        "Safe and verified passengers",
        "Weekly earnings dashboard",
        "Navigation assistance",
        "Insurance coverage",
        "Training and support",
        "Community of professional drivers"
      ]
    }
  ];

  const serviceTypes = [
    {
      name: "Regular Ride",
      description: "Standard 4-seater vehicle for daily commute",
      icon: "🚗",
      features: ["Budget-friendly", "Fast pickup", "Perfect for solo or pair travel"]
    },
    {
      name: "Shared Ride",
      description: "Share your ride with other passengers on the same route",
      icon: "👥",
      features: ["Most affordable", "Eco-friendly", "Great for regular commutes"]
    },
    {
      name: "Premium Ride",
      description: "Premium vehicles for a more comfortable experience",
      icon: "⭐",
      features: ["Luxury vehicles", "Professional drivers", "Extra comfort features"]
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ 
              fontSize: '3rem', 
              marginBottom: '1.5rem', 
              fontWeight: 700,
              color: 'var(--text-main)'
            }}>
              Our Services
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-muted)', 
              lineHeight: 1.6
            }}>
              Comprehensive ride-sharing solutions tailored to your needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem'
          }}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              >
                <div style={{ marginBottom: '1.5rem' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {service.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ride Types */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: '2rem', marginBottom: '3rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}
          >
            Ride Types
          </motion.h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem'
          }}>
            {serviceTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid var(--border)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {type.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {type.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {type.description}
                </p>
                <ul style={{ textAlign: 'left', color: 'var(--text-muted)', lineHeight: 2 }}>
                  {type.features.map((feature, idx) => (
                    <li key={idx} style={{ fontSize: '0.95rem' }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for Users */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: '2rem', marginBottom: '3rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}
          >
            Features & Benefits
          </motion.h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '3rem'
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {feature.title}
                </h3>
                <ul style={{ color: 'var(--text-muted)', lineHeight: 2 }}>
                  {feature.points.map((point, idx) => (
                    <li key={idx} style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span> {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section style={{ padding: '4rem 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 700 }}>
              24/7 Customer Support
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
              Our dedicated support team is always available to help you with any questions or issues
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              marginTop: '2rem'
            }}>
              <div>
                <Headphones size={32} style={{ marginBottom: '0.5rem' }} />
                <p>Email: support@wheelshare.com</p>
              </div>
              <div>
                <Smartphone size={32} style={{ marginBottom: '0.5rem' }} />
                <p>Phone: +1 (800) 123-4567</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Services;
