import api from "./api";

export const makePayment = (rideId, paymentMethod, paymentId = null) =>
  api.post(`/rides/pay/${rideId}`, { 
    PaymentMethod: paymentMethod, 
    PaymentId: paymentId 
  });