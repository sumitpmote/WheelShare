import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, X, Check } from 'lucide-react';
import { useState } from 'react';

const PaymentDialog = ({ isOpen, rideData, onPayment, onCancel }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !rideData) return null;

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setProcessing(true);
    try {
      await onPayment(selectedMethod);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Check size={48} color="#28a745" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
              Ride Completed!
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
              Please choose your payment method
            </p>
          </div>

          <div style={{ 
            background: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#28a745' }}>
              ₹{rideData.finalFare || rideData.fare}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              Total Fare
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div 
              onClick={() => setSelectedMethod('CASH')}
              style={{
                border: selectedMethod === 'CASH' ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: selectedMethod === 'CASH' ? '#f0f8ff' : 'white'
              }}
            >
              <Banknote size={24} color={selectedMethod === 'CASH' ? '#007bff' : '#666'} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Cash Payment</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Pay directly to driver</div>
              </div>
            </div>

            <div 
              onClick={() => setSelectedMethod('UPI')}
              style={{
                border: selectedMethod === 'UPI' ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: selectedMethod === 'UPI' ? '#f0f8ff' : 'white'
              }}
            >
              <CreditCard size={24} color={selectedMethod === 'UPI' ? '#007bff' : '#666'} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>UPI Payment</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Pay via UPI/Digital wallet</div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
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
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || processing}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: 'none',
                background: selectedMethod && !processing ? '#28a745' : '#ccc',
                color: 'white',
                borderRadius: '8px',
                cursor: selectedMethod && !processing ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentDialog;