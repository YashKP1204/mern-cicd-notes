import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

console.log("API_URL:", process.env.REACT_APP_API_URL);

// Create axios instance
const api = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    //   window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;