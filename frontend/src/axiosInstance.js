import axios from "axios";

// Use relative path when Django serves React
const baseURL = "/api/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// Automatically attach token if exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token when 401 error occurs
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 (Unauthorized) and we haven't tried to refresh yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refresh");

          // Attempt to refresh the token
          const response = await axios.post(
              `${baseURL}token/refresh/`,
              { refresh: refreshToken }
          );

          // Update the access token
          localStorage.setItem("access", response.data.access);

          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

          // Retry the original request
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("is_staff");

          // Redirect to login page
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      }

      // For other errors, just reject
      return Promise.reject(error);
    }
);

export default axiosInstance;