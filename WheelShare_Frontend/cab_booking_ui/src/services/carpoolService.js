import api from "./api";

export const requestCarpoolRide = (data) => api.post("/carpool/request", data);

export const getAvailableCarpoolRides = (sourceLat, sourceLng, destLat, destLng) =>
  api.get("/carpool/available-rides", {
    params: { sourceLat, sourceLng, destLat, destLng }
  });

export const sendJoinRequest = (rideId, data) => api.post(`/carpool/join/${rideId}`, data);

export const getPendingRequests = (rideId) => api.get(`/carpool/pending-requests/${rideId}`);

export const approveRequest = (requestId) => api.post(`/carpool/approve-request/${requestId}`);

export const rejectRequest = (requestId) => api.post(`/carpool/reject-request/${requestId}`);

export const confirmSeat = (rideId) => api.post(`/carpool/confirm-seat/${rideId}`);

export const completeRide = (rideId) => api.post(`/carpool/complete-ride/${rideId}`);

export const getCarpoolRideStatus = (rideId) => api.get(`/carpool/ride-status/${rideId}`);
