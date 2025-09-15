// src/utils/api.js
// import axios from "axios";

// const BACKEND = import.meta.env.VITE_API_BASE || "http://localhost:5000"; // fallback

// const api = axios.create({
//   baseURL: BACKEND,
//   // timeout: 10000,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("vendor_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;




//*************************************************************** */


// src/utils/api.js
import axios from "axios";

const BACKEND = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: BACKEND,
  // timeout: 10000,
});

// Attach vendor token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vendor_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
