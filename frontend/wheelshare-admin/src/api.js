import axios from 'axios';

const API_BASE_URL = 'http://localhost:5052/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  sendRegistrationOtp: (email) => api.post('/auth/send-registration-otp', { email }),
  verifyRegistrationOtp: (data) => api.post('/auth/verify-registration-otp', data),
  register: (userData) => api.post('/auth/register', userData),
};

// Admin APIs
export const adminAPI = {
  getAllBookings: () => api.get('/bookings'),
  getAllRides: () => api.get('/rides'),
  getAllUsers: () => api.get('/admin/users'),
  getAllDrivers: () => api.get('/admin/drivers'),
  getAllVehicles: () => api.get('/admin/vehicles'),
  verifyDriver: (driverId) => api.put(`/admin/drivers/${driverId}/approve`),
  verifyVehicle: (vehicleId) => api.put(`/admin/vehicles/${vehicleId}/verify`),
  blockUser: (userId) => api.put(`/admin/users/${userId}/block`),
  getStats: () => api.get('/admin/dashboard'),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export default api;