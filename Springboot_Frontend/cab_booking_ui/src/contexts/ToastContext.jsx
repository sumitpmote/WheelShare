import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [paymentDialog, setPaymentDialog] = useState({ isOpen: false });

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const confirm = (title, message, confirmText = "Yes", cancelText = "No") => {
    return new Promise((resolve) => {
      setConfirmDialog({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfirmDialog({ isOpen: false });
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog({ isOpen: false });
          resolve(false);
        }
      });
    });
  };

  const showPayment = (rideData) => {
    return new Promise((resolve) => {
      setPaymentDialog({
        isOpen: true,
        rideData,
        onPayment: (method) => {
          setPaymentDialog({ isOpen: false });
          resolve(method);
        },
        onCancel: () => {
          setPaymentDialog({ isOpen: false });
          resolve(null);
        }
      });
    });
  };

  const success = (message, duration) => showToast(message, 'success', duration);
  const error = (message, duration) => showToast(message, 'error', duration);
  const warning = (message, duration) => showToast(message, 'warning', duration);
  const info = (message, duration) => showToast(message, 'info', duration);

  return (
    <ToastContext.Provider value={{ toasts, confirmDialog, paymentDialog, showToast, removeToast, success, error, warning, info, confirm, showPayment }}>
      {children}
    </ToastContext.Provider>
  );
};