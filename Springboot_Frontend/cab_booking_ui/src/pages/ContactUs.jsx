import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: <Mail size={32} color="var(--primary)" />,
      title: "Email",
      content: "support@wheelshare.com",
      link: "mailto:support@wheelshare.com"
    },
    {
      icon: <Phone size={32} color="var(--primary)" />,
      title: "Phone",
      content: "+1 (800) 123-4567",
      link: "tel:+18001234567"
    },
    {
      icon: <MapPin size={32} color="var(--primary)" />,
      title: "Address",
      content: "123 Tech Street, Silicon Valley, CA 94025",
      link: null
    },
    {
      icon: <Clock size={32} color="var(--primary)" />,
      title: "Business Hours",
      content: "Mon - Sun, 24/7",
      link: null
    }
  ];

  const faqs = [
    {
      question: "How do I book a ride?",
      answer: "Download the WheelShare app or visit our website. Enter your pickup and destination, confirm the fare, and we'll match you with a nearby driver."
    },
    {
      question: "Is WheelShare safe?",
      answer: "Yes! All drivers undergo background checks, vehicle verification, and we provide real-time tracking. You can share your trip details with emergency contacts."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, mobile wallets, and cash. You can also set up automatic payments for your account."
    },
    {
      question: "Can I schedule a ride in advance?",
      answer: "Yes, you can schedule rides up to 7 days in advance through the app. Scheduled rides get priority in our matching system."
    },
    {
      question: "What if I have an issue with my ride?",
      answer: "You can report issues within 48 hours of your ride. Our support team will investigate and resolve the matter promptly."
    },
    {
      question: "How can I become a WheelShare driver?",
      answer: "Visit the driver signup page, submit your documents (license, insurance, vehicle registration), and complete the verification process."
    }
  ];

  return (
    <div className="contact-page">
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
              Contact Us
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-muted)', 
              lineHeight: 1.6
            }}>
              Have questions? We're here to help! Get in touch with our support team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '2rem'
          }}>
            {contactInfo.map((info, index) => (
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
                <div style={{ marginBottom: '1rem' }}>{info.icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {info.title}
                </h3>
                {info.link ? (
                  <a 
                    href={info.link}
                    style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {info.content}
                  </a>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>
                    {info.content}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '2rem', 
              fontWeight: 700, 
              color: 'var(--text-main)',
              textAlign: 'center'
            }}>
              Send us a Message
            </h2>
            
            {submitted && (
              <div style={{
                background: '#d4edda',
                color: '#155724',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                textAlign: 'center',
                border: '1px solid #c3e6cb'
              }}>
                ✓ Thank you! We've received your message. We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support Request</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..."
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%'
                }}
              >
                <Send size={20} /> Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: '2rem', marginBottom: '3rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Q: {faq.question}
                </h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  A: {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 0', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>
              Can't find what you're looking for?
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <a href="mailto:support@wheelshare.com" className="btn btn-light" style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block',
              color: 'var(--primary)',
              background: 'white'
            }}>
              Email Us Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
