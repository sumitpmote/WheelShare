import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import carBooking from "../assets/carBooking.png";
import carPooling from "../assets/carPooling.png";

function ServiceSelection() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Choose Your Service</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Car Booking */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/book-ride')}
            style={{
              cursor: 'pointer',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.3s'
            }}
          >
            <img 
              src={carBooking} 
              alt="Car Booking" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </motion.div>

          {/* Car Pooling */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/carpool')}
            style={{
              cursor: 'pointer',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.3s'
            }}
          >
            <img 
              src={carPooling} 
              alt="Car Pooling" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ServiceSelection;
