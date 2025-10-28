// Create axios instance with interceptor
import axios from 'axios';

const url = process.env.REACT_APP_SERVER_URL || 'https://mlsserver-10ed9240e649.herokuapp.com';

const api = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;