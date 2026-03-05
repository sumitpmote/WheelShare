import { motion } from "framer-motion";
import { Banknote, X } from "lucide-react";

const CashConfirmationModal = ({ payment, onConfirm, onClose }) => {
  if (!payment) return null;

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
      zIndex: 1000,
      padding: '1rem'
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '400px',
          width: '100%',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Cash Payment Confirmation</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Banknote size={48} color="#28a745" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            Did you receive the exact cash amount from the customer?
          </p>
          
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Customer: {payment.customerName}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#28a745' }}>₹{payment.amount}</div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1rem' }}>
            <div>From: {payment.sourceAddress}</div>
            <div>To: {payment.destinationAddress}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              background: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Not Yet
          </button>
          <button
            onClick={() => onConfirm(payment.rideId)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: '#28a745',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Yes, Received
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CashConfirmationModal;
