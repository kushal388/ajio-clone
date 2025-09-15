// small axios client
// import axios from "axios";

// export const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: false,
// });



// ************************************** USER DATA *************************************************************

// src/lib/api.js
// const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// async function request(path, options = {}) {
//   const url = `${BASE}${path}`;
//   const opts = {
//     credentials: "include", // important: send cookies with requests
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   };

//   if (opts.body && typeof opts.body !== "string") {
//     opts.body = JSON.stringify(opts.body);
//   }

//   const res = await fetch(url, opts);
//   const text = await res.text();
//   let data;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch (e) {
//     data = text;
//   }

//   if (!res.ok) {
//     const err = new Error(data?.message || res.statusText || "Request failed");
//     err.status = res.status;
//     err.body = data;
//     throw err;
//   }
//   return data;
// }

// export const api = {
//   get: (path) => request(path, { method: "GET" }),
//   post: (path, body) => request(path, { method: "POST", body }),
//   put: (path, body) => request(path, { method: "PUT", body }),
//   del: (path) => request(path, { method: "DELETE" }),
// };



// **************************************************************************************************

// src/lib/api.js
// const BASE = import.meta.env.VITE_API_BASE || "";

// async function request(path, options = {}) {
//   const url = `${BASE}${path}`;
//   const opts = {
//     credentials: "include", // <--- send cookies
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {})
//     },
//     ...options,
//   };
//   if (opts.body && typeof opts.body !== "string") opts.body = JSON.stringify(opts.body);
//   const res = await fetch(url, opts);
//   const data = await res.json().catch(() => null);
//   if (!res.ok) throw new Error(data?.message || res.statusText);
//   return data;
// }

// export const api = {
//   get: (p) => request(p, { method: "GET" }),
//   post: (p, b) => request(p, { method: "POST", body: b }),
//   put: (p, b) => request(p, { method: "PUT", body: b }),
//   del: (p) => request(p, { method: "DELETE" }),
// };


// ****************************************************************


// src/lib/api.js
// const BASE = import.meta.env.VITE_API_BASE || ""; // empty in dev -> Vite proxy

// async function request(path, options = {}) {
//   const normalizedPath = path.startsWith("/") ? path : `/${path}`;
//   const url = `${BASE}${normalizedPath}`;
//   const opts = {
//     credentials: "include", // send cookies
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   };

//   if (opts.body && typeof opts.body !== "string") opts.body = JSON.stringify(opts.body);

//   // Debug helper (remove if noisy)
//   // console.log("[api] fetch", url, opts);

//   const res = await fetch(url, opts);
//   const data = await res.json().catch(() => null);

//   if (!res.ok) {
//     const err = new Error(data?.message || res.statusText);
//     err.status = res.status;
//     err.body = data;
//     throw err;
//   }
//   return data;
// }

// export const api = {
//   get: (p) => request(p, { method: "GET" }),
//   post: (p, b) => request(p, { method: "POST", body: b }),
//   put: (p, b) => request(p, { method: "PUT", body: b }),
//   del: (p) => request(p, { method: "DELETE" }),
// };


// *************************************************************************************************

// src/lib/api.js
const BASE = import.meta.env.VITE_API_BASE || ""; // empty in dev -> Vite proxy

async function request(path, options = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE}${normalizedPath}`;
  const opts = {
    credentials: "include", // send cookies (very important)
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  if (opts.body && typeof opts.body !== "string") opts.body = JSON.stringify(opts.body);

  const res = await fetch(url, opts);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => request(p, { method: "GET" }),
  post: (p, b) => request(p, { method: "POST", body: b }),
  put: (p, b) => request(p, { method: "PUT", body: b }),
  del: (p) => request(p, { method: "DELETE" }),
};
