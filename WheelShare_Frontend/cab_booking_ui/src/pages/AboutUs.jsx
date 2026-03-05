import { motion } from "framer-motion";
import { Heart, Shield, Zap, Globe } from "lucide-react";
import vaishnaviImg from '../assets/vaishnavi.jpeg';
import annuImg from '../assets/annu.jpeg';
import sumitImg from '../assets/Sumit.png';
import nehaImg from '../assets/neha.jpeg';
import sakshiImg from '../assets/sakshi.jpeg';

function AboutUs() {
  const values = [
    {
      icon: <Heart size={32} color="var(--primary)" />,
      title: "Customer First",
      desc: "We prioritize the safety, comfort, and satisfaction of every user"
    },
    {
      icon: <Shield size={32} color="var(--primary)" />,
      title: "Trust & Safety",
      desc: "Verified drivers, background checks, and real-time tracking for peace of mind"
    },
    {
      icon: <Zap size={32} color="var(--primary)" />,
      title: "Innovation",
      desc: "Latest technology to provide seamless and efficient transportation"
    },
    {
      icon: <Globe size={32} color="var(--primary)" />,
      title: "Sustainability",
      desc: "Promoting eco-friendly transportation and shared mobility"
    }
  ];

  const team = [
    {
      name: "Vaishnavi",
      role: "Team Member",
      desc: "Dedicated to delivering exceptional user experiences",
      image: vaishnaviImg
    },
    {
      name: "Annu",
      role: "Team Member",
      desc: "Expert in technology solutions and innovation",
      image: annuImg
    },
    {
      name: "Sumit",
      role: "Team Member",
      desc: "Ensuring smooth operations and system reliability",
      image: sumitImg
    },
    {
      name: "Neha",
      role: "Team Member",
      desc: "Focused on user satisfaction and quality assurance",
      image: nehaImg
    },
    {
      name: "Sakshi",
      role: "Team Member",
      desc: "Committed to maintaining high development standards",
      image: sakshiImg
    }
  ];

  return (
    <div className="about-page">
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
              About WheelShare
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-muted)', 
              lineHeight: 1.6
            }}>
              Transforming urban mobility with safe, reliable, and affordable ride-sharing
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Our Story
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-muted)', 
              lineHeight: 1.8,
              marginBottom: '1.5rem'
            }}>
              WheelShare was founded with a simple mission: to revolutionize urban transportation by making it safer, 
              more affordable, and more accessible to everyone. In a world where commuting is a daily challenge, 
              we believe in creating a platform that connects people while prioritizing their safety and comfort.
            </p>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-muted)', 
              lineHeight: 1.8,
              marginBottom: '1.5rem'
            }}>
              Since our inception, we've grown from a small startup to a trusted ride-sharing platform serving 
              thousands of users daily. Our commitment to excellence, innovation, and customer satisfaction drives 
              everything we do.
            </p>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-muted)', 
              lineHeight: 1.8
            }}>
              We're not just a transportation service – we're building a community of trust, where drivers and 
              passengers interact with confidence, and where every journey is safe and reliable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: '2rem', marginBottom: '3rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}
          >
            Our Core Values
          </motion.h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem'
          }}>
            {values.map((value, index) => (
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
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>{value.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: '2rem', marginBottom: '3rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}
          >
            Our Leadership Team
          </motion.h2>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexWrap: 'nowrap',
            gap: '1.5rem',
            overflowX: 'auto'
          }}>
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  minWidth: '200px',
                  maxWidth: '250px'
                }}
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  margin: '0 auto 1.5rem auto',
                  overflow: 'hidden',
                  border: '3px solid var(--primary)'
                }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {member.name}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {member.role}
                </p>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {member.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem',
            textAlign: 'center'
          }}>
            {[
              { number: "50K+", label: "Active Users" },
              { number: "5K+", label: "Verified Drivers" },
              { number: "500K+", label: "Rides Completed" },
              { number: "4.8★", label: "Average Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {stat.number}
                </h3>
                <p style={{ fontSize: '1rem', opacity: 0.9 }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
