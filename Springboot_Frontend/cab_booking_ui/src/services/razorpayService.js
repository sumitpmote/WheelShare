const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processRazorpayPayment = async (rideData) => {
  const res = await initializeRazorpay();
  if (!res) {
    throw new Error('Razorpay SDK failed to load');
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round((rideData.finalFare || rideData.fare) * 100), // Convert to paise
      currency: 'INR',
      name: 'WheelShare',
      description: `Ride Payment - Ride #${rideData.rideId}`,
      handler: (response) => {
        // Payment successful
        resolve({
          paymentId: response.razorpay_payment_id,
          method: 'RAZORPAY'
        });
      },
      prefill: {
        name: 'Customer',
        email: 'customer@wheelshare.com',
        contact: '7248978405'
      },
      theme: {
        color: '#007bff'
      },
      modal: {
        ondismiss: () => {
          // Payment cancelled by user
          reject(new Error('Payment cancelled'));
        },
        onhidden: () => {
          // Modal closed - could be success or failure
          console.log('Razorpay modal closed');
        }
      },
      // Handle payment failure
      retry: {
        enabled: false
      }
    };

    const rzp = new window.Razorpay(options);
    
    // Handle payment failure
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      reject(new Error(`Payment failed: ${response.error.description || 'Unknown error'}`));
    });
    
    rzp.open();
  });
};