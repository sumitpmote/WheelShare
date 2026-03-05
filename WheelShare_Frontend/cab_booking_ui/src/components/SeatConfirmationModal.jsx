import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

function SeatConfirmationModal({ onConfirm, onDecline }) {
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
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Seat Confirmation</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Have you seated in the ride?
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onConfirm}
            className="btn"
            style={{
              flex: 1,
              background: 'var(--success)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle size={18} />
            Yes
          </button>
          
          <button
            onClick={onDecline}
            className="btn"
            style={{
              flex: 1,
              background: 'var(--danger)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <XCircle size={18} />
            No
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default SeatConfirmationModal;
