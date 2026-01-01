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

// Vehicles API
export const vehiclesAPI = {
  create: (data) => api.post('/vehicles', data),
  getMyVehicles: () => api.get('/vehicles/my-vehicles'),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
  getById: (id) => api.get(`/vehicles/${id}`),
};

// Rides API
export const ridesAPI = {
  create: (data) => api.post('/rides', data),
  getMyRides: () => api.get('/rides/my-rides'),
  getById: (id) => api.get(`/rides/${id}`),
  update: (id, data) => api.put(`/rides/${id}`, data),
  updateStatus: (id, status) => api.put(`/rides/${id}/status`, { status }),
};

// Bookings API
export const bookingsAPI = {
  getRideBookings: (rideId) => api.get(`/bookings/ride/${rideId}`),
  confirmBooking: (id) => api.put(`/bookings/${id}/confirm`),
  getById: (id) => api.get(`/bookings/${id}`),
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
  getMyRatings: () => api.get('/ratings/my-ratings'),
};

export default api;