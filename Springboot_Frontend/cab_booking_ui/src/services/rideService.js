import api from "./api";

// Estimate Fare (EstimateFareDto)
export const estimateFare = (data) => {
  return api.post("/rides/estimate-fare", data);
};

// Request Ride (RideRequestDto)
export const requestRide = (data) => {
  return api.post("/rides/request", data);
};

// Get Ride Status
export const getRideStatus = (rideId) => {
  return api.get(`/rides/${rideId}`);
};

// Get Customer Rides History
export const getCustomerRides = () => {
  return api.get("/rides/history");
};

// Cancel Ride
export const cancelRide = (rideId) => {
  return api.post(`/rides/cancel/${rideId}`);
};
