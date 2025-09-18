// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://task-flow-b9oy.onrender.com/api/",  // ✅ use your deployed backend
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

export default axiosInstance;
