import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import ConfirmDialog from './ConfirmDialog';
import PaymentDialog from './PaymentDialog';

const Toast = ({ toast }) => {
  const { removeToast } = useToast();

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success': return { bg: '#d4edda', border: '#c3e6cb', text: '#155724', icon: '#28a745' };
      case 'error': return { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24', icon: '#dc3545' };
      case 'warning': return { bg: '#fff3cd', border: '#ffeaa7', text: '#856404', icon: '#ffc107' };
      default: return { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460', icon: '#17a2b8' };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'relative'
      }}
    >
      <div style={{ color: colors.icon, flexShrink: 0 }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>
        {toast.message}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: colors.text,
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

const ToastContainer = () => {
  const { toasts, confirmDialog, paymentDialog } = useToast();

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id} style={{ pointerEvents: 'auto' }}>
              <Toast toast={toast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
      
      <ConfirmDialog {...confirmDialog} />
      <PaymentDialog {...paymentDialog} />
    </>
  );
};

export default ToastContainer;