// admin/src/utils/api.js
import axios from "axios";

const BACKEND = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: BACKEND,
  // timeout: 10000,
});

// Attach admin token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token"); // 👈 admin token key
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
