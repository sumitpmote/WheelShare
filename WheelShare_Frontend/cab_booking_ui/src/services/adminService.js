import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getRevenue: async () => {
    const response = await api.get('/admin/revenue');
    return response.data;
  },

  getUsers: async (filter = 'all') => {
    const response = await api.get(`/admin/users?filter=${filter}`);
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/admin/users/${userId}/profile`);
    return response.data;
  },

  rejectUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/reject`);
    return response.data;
  },

  verifyUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/verify`);
    return response.data;
  }
};