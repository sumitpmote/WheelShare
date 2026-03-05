import api from "./api";

export const getSavedPlaces = () => api.get("/saved-places");

export const addSavedPlace = (placeData) => api.post("/saved-places", placeData);

export const deleteSavedPlace = (placeId) => api.delete(`/saved-places/${placeId}`);