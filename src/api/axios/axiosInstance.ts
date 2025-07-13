// src/api/axios.ts (example content - YOU SHOULD HAVE THIS OR SIMILAR)
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../apiConfig'; // Import API_BASE_URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the authorization token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry (optional but recommended)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Example: if 401 Unauthorized, maybe redirect to login
    if (error.response && error.response.status === 401) {
      // You'd typically want to dispatch a logout action here
      // For a simple app, you could clear storage and prompt re-login
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // A more robust app would have a navigation ref to navigate to login screen
      // Or you can let the component's error handling for fetchProfile log out.
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;