import api from "./api";

// Create driver profile
export const createDriver = (data) =>
  api.post("/driver/create-profile", data);

// Driver online/offline
export const goOnline = () => api.post("/driver/go-online", {});
export const goOffline = () => api.post("/driver/go-offline", {});

// Update live location
export const updateLocation = (latitude, longitude) =>
  api.post("/driver/update-location", {
    latitude,
    longitude,
  });

// Get nearby rides
export const getNearbyRides = () =>
  api.get("/driver/nearby-rides");

// Ride actions
export const acceptRide = (rideId) =>
  api.post(`/driver/accept-ride/${rideId}`, {});

export const startRide = (rideId) =>
  api.post(`/driver/start-ride/${rideId}`, {});

export const completeRide = (rideId) =>
  api.post(`/driver/complete-ride/${rideId}`, {});

// Get driver's active rides
export const getMyRides = () =>
  api.get("/driver/my-rides");

// Get driver's ride history
export const getRideHistory = () =>
  api.get("/driver/ride-history");
