import { motion } from "framer-motion";
import { Users, X, Check } from "lucide-react";

const CarpoolApprovalModal = ({ request, onApprove, onReject, onClose }) => {
  if (!request) return null;

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
          <h3 style={{ margin: 0 }}>Ride Share Request</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Users size={48} color="#2e7d32" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            <strong>{request.customerName}</strong> wants to share your ride
          </p>
          
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
              <strong>From:</strong> {request.sourceAddress}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              <strong>To:</strong> {request.destinationAddress}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onReject(request.requestId)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              background: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={() => onApprove(request.requestId)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: '#2e7d32',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Check size={16} />
            Accept
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CarpoolApprovalModal;
