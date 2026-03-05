import api from "./api";

export const getPublicStats = () => {
  return api.get("/stats/public");
};