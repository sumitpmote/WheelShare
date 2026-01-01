import axios from 'axios';

const API_BASE_URL = 'http://localhost:5052/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  register: (data) => api.post('/auth/register', data),
};

// Rides API
export const ridesAPI = {
  search: (data) => api.post('/rides/search', data),
  getById: (id) => api.get(`/rides/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Ratings API
export const ratingsAPI = {
  create: (data) => api.post('/ratings', data),
  getByBooking: (bookingId) => api.get(`/ratings/booking/${bookingId}`),
};

export default api;