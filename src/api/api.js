import axios from 'axios';

const url = process.env.REACT_APP_SERVER_URL || 'https://nassir-server-new.vercel.app';

const api = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true, // CRITICAL: Must be true
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests from localStorage as backup
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 409) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;