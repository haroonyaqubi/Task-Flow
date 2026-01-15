/**
 * Axios HTTP Client Configuration
 * Handles API communication with backend including JWT token management
 */

import axios from "axios";

// Base URL for all API requests
const BASE_URL = "https://task-flow-backend-gd2m.onrender.com/api/";

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});


// REQUEST INTERCEPTOR

// Automatically attach JWT token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration and auto-refresh
axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refresh");

          // Attempt to refresh access token
          const response = await axios.post(
              `${BASE_URL}token/refresh/`,
              { refresh: refreshToken }
          );

          // Update access token in localStorage
          localStorage.setItem("access", response.data.access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          // Token refresh failed - clear all auth data
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("is_staff");

          // Redirect to login page if not already there
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
);

// Export the configured axios instance
export default axiosInstance;




