import { motion } from "framer-motion";
import { Download, X, CheckCircle } from "lucide-react";
import { formatDateTimeIST } from "../utils/dateUtils";

const Receipt = ({ receipt, onClose }) => {
  const handleDownload = () => {
    const printContent = document.getElementById('receipt-content');
    const printWindow = window.open('', '', 'height=600,width=800');
    
    printWindow.document.write('<html><head><title>Receipt</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
    printWindow.document.write('.receipt { max-width: 600px; margin: 0 auto; }');
    printWindow.document.write('.header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }');
    printWindow.document.write('.row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }');
    printWindow.document.write('.label { font-weight: 600; }');
    printWindow.document.write('.total { font-size: 1.5rem; font-weight: 700; color: #28a745; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.print();
  };

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
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Payment Receipt</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div id="receipt-content">
            <div className="receipt">
              <div className="header" style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #333' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>WheelShare</h2>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Payment Receipt</div>
                <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>Receipt ID: {receipt.receiptId}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle size={48} color="#28a745" />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Date:</span>
                  <span>{formatDateTimeIST(receipt.date)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Ride ID:</span>
                  <span>#{receipt.rideId}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Trip Details</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>From:</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>{receipt.sourceAddress}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>To:</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>{receipt.destinationAddress}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Distance:</span>
                  <span>{receipt.distanceKm} km</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Passenger Details</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Name:</span>
                  <span>{receipt.customerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Phone:</span>
                  <span>{receipt.customerPhone}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Driver Details</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Name:</span>
                  <span>{receipt.driverName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Phone:</span>
                  <span>{receipt.driverPhone}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Payment Details</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Method:</span>
                  <span>{receipt.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600 }}>Status:</span>
                  <span style={{ 
                    color: receipt.paymentStatus === 'COMPLETED' ? '#28a745' : '#ffc107', 
                    fontWeight: 600 
                  }}>
                    {receipt.paymentStatus === 'AWAITING_CONFIRMATION' ? 'Pending Driver Confirmation' : receipt.paymentStatus}
                  </span>
                </div>
                {receipt.transactionRef && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 600 }}>Transaction ID:</span>
                    <span style={{ fontSize: '0.85rem' }}>{receipt.transactionRef}</span>
                  </div>
                )}
              </div>

              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total Amount:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#28a745' }}>₹{receipt.finalFare}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#999', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                Thank you for choosing WheelShare!
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={20} />
            Download Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Receipt;
