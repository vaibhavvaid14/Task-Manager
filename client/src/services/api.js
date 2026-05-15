import axios from 'axios';

const api = axios.create({
  // Use environment variable for the API URL, or fallback to local dev URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    error.extractedMessage = message;
    return Promise.reject(error);
  }
);

export default api;
