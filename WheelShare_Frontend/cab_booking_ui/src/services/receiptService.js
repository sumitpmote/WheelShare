import api from "./api";

export const getReceipt = (rideId) => api.get(`/receipt/${rideId}`);
