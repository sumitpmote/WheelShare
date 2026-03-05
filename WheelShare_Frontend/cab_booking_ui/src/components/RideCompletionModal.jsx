import { motion } from "framer-motion";
import { CheckCircle, MapPin } from "lucide-react";

function RideCompletionModal({ onComplete, pickup, drop }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
        style={{
          maxWidth: '400px',
          width: '90%',
          margin: '1rem',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Complete Ride</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Have you reached your destination?
          </p>
        </div>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem', 
          textAlign: 'left' 
        }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--success)" />
            <strong>From:</strong> {pickup}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--danger)" />
            <strong>To:</strong> {drop}
          </div>
        </div>
        
        <button
          onClick={onComplete}
          className="btn"
          style={{
            width: '100%',
            background: 'var(--success)',
            color: 'white',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle size={18} />
          Yes, Complete Ride
        </button>
      </motion.div>
    </div>
  );
}

export default RideCompletionModal;