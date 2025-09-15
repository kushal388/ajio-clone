


// src/pages/VendorRegistration.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// /**
//  * VendorRegistration.jsx
//  * - Simplified: this file only contains the auth modal (login + register).
//  * - The Navbar should dispatch: window.dispatchEvent(new CustomEvent('open-vendor-auth', { detail: { tab: 'login' } }))
//  * - On successful login we store vendor_token & vendor_info and dispatch 'vendor-login'.
//  */

// export default function VendorRegistration() {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

//   // keep an optional vendor state (in case other parts want to read it)
//   const [vendor, setVendor] = useState(() => {
//     try {
//       const raw = localStorage.getItem("vendor_info");
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   });

//   // Modal & tab state
//   const [showAuth, setShowAuth] = useState(false);
//   const [tab, setTab] = useState("login"); // 'login' or 'register'

//   // Register form
//   const [form, setForm] = useState({ name: "", age: "", mobile: "", email: "", password: "", gstin: "" });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState(null);

//   // Login form
//   const [loginForm, setLoginForm] = useState({ email: "", password: "" });
//   const [loginLoading, setLoginLoading] = useState(false);
//   const [loginMessage, setLoginMessage] = useState(null);

//   useEffect(() => {
//     // Open modal when Navbar (or any code) dispatches open-vendor-auth
//     function onOpenAuth(e) {
//       const desired = e?.detail?.tab;
//       setTab(desired === "register" ? "register" : "login");
//       setShowAuth(true);
//       // scroll top so modal appears centered on small screens
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }

//     // sync vendor_info from other tabs
//     function onStorage(e) {
//       if (e.key === "vendor_info") setVendor(e.newValue ? JSON.parse(e.newValue) : null);
//       if (e.key === "vendor_token" && !e.newValue) setVendor(null);
//     }

//     function onVendorLogin(e) { setVendor(e.detail || null); }
//     function onVendorLogout() { setVendor(null); }

//     window.addEventListener("open-vendor-auth", onOpenAuth);
//     window.addEventListener("storage", onStorage);
//     window.addEventListener("vendor-login", onVendorLogin);
//     window.addEventListener("vendor-logout", onVendorLogout);

//     return () => {
//       window.removeEventListener("open-vendor-auth", onOpenAuth);
//       window.removeEventListener("storage", onStorage);
//       window.removeEventListener("vendor-login", onVendorLogin);
//       window.removeEventListener("vendor-logout", onVendorLogout);
//     };
//   }, []);

//   function updateField(k, v) { setForm(f => ({ ...f, [k]: v })); }
//   function updateLoginField(k, v) { setLoginForm(f => ({ ...f, [k]: v })); }

//   function validateRegister() {
//     const err = {};
//     if (!form.name.trim()) err.name = "Name is required";
//     if (!form.age.trim() || !Number.isInteger(Number(form.age)) || Number(form.age) < 18) err.age = "Age must be 18+";
//     if (!/^[6-9]\d{9}$/.test(form.mobile)) err.mobile = "Enter a valid 10-digit mobile";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email";
//     if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(form.password)) err.password = "Min 6 chars with letters & numbers";
//     if (form.gstin && !/^[0-9A-Za-z]{15}$/.test(form.gstin)) err.gstin = "GSTIN must be 15 chars";
//     return err;
//   }

//   async function handleRegister(e) {
//     e?.preventDefault?.();
//     setErrors({});
//     setSubmitMessage(null);

//     const err = validateRegister();
//     if (Object.keys(err).length) return setErrors(err);

//     const payload = {
//       name: form.name.trim(),
//       age: Number(form.age),
//       mobile: form.mobile.trim(),
//       email: form.email.trim(),
//       password: form.password,
//       gstin: form.gstin ? form.gstin.trim() : undefined,
//     };

//     try {
//       setSubmitting(true);
//       const res = await fetch(`${API_BASE}/api/vendor-requests`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (res.ok) {
//         setSubmitMessage({ type: "success", text: data.message || "Request submitted. Admin will review." });
//         setForm({ name: "", age: "", mobile: "", email: "", password: "", gstin: "" });
//         setTab("login");
//       } else {
//         if (data.errors && typeof data.errors === "object") setErrors(data.errors);
//         setSubmitMessage({ type: "error", text: data.message || "Submission failed." });
//       }
//     } catch {
//       setSubmitMessage({ type: "error", text: "Network error — try again later." });
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   async function handleLogin(e) {
//     e?.preventDefault?.();
//     setLoginMessage(null);
//     setLoginLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/vendor/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: loginForm.email.trim(), password: loginForm.password }),
//       });
//       const data = await res.json().catch(() => ({}));

//       if (res.ok) {
//         const token = data.token;
//         const vendorObj = data.vendor || null;

//         if (token && vendorObj && (vendorObj.status === "approved" || vendorObj.status === "active")) {
//           localStorage.setItem("vendor_token", token);
//           localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
//           window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
//           setVendor(vendorObj);
//           setLoginMessage({ type: "success", text: `Welcome, ${vendorObj.name}.` });
//           setShowAuth(false);
//           navigate("/vendor/dashboard");
//         } else if (vendorObj && vendorObj.status === "pending") {
//           localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
//           window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
//           setVendor(vendorObj);
//           setLoginMessage({ type: "info", text: "Your account is pending admin approval." });
//           setShowAuth(false);
//         } else if (vendorObj && vendorObj.status === "rejected") {
//           setLoginMessage({ type: "error", text: "Your vendor request was rejected." });
//         } else {
//           setLoginMessage({ type: "error", text: data.message || "Login succeeded but vendor status unknown." });
//         }
//       } else {
//         const msg = data.message || "Login failed — check credentials.";
//         setLoginMessage({ type: "error", text: msg });
//       }
//     } catch {
//       setLoginMessage({ type: "error", text: "Network error — try again later." });
//     } finally {
//       setLoginLoading(false);
//       setLoginForm({ email: "", password: "" });
//     }
//   }

//   // Close modal helper (keeps messages/forms intact if you want)
//   function closeModal() {
//     setShowAuth(false);
//   }

//   return (
//     <>
//       {/* Auth modal only — no static vendor page content */}
//       {showAuth && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
//           <div className="fixed inset-0 bg-black/40" onClick={closeModal} />

//           <div className="relative w-full max-w-2xl mx-4">
//             <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 overflow-hidden">
//               <div className="px-6 py-4 border-b flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Vendor Access</h3>
//                   <p className="text-sm text-gray-500">Login or register to access your dashboard</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button onClick={closeModal} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:bg-gray-100">✕</button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="flex gap-3 mb-4">
//                   <button onClick={() => setTab("login")} className={`px-4 py-2 rounded-md text-sm ${tab === "login" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>Login</button>
//                   <button onClick={() => setTab("register")} className={`px-4 py-2 rounded-md text-sm ${tab === "register" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>Register</button>
//                 </div>

//                 {tab === "register" ? (
//                   <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Name</label>
//                       <input value={form.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="Full name" />
//                       {errors.name && <div className="mt-1 text-xs text-rose-600">{errors.name}</div>}
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Age</label>
//                       <input value={form.age} onChange={(e) => updateField("age", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="18" />
//                       {errors.age && <div className="mt-1 text-xs text-rose-600">{errors.age}</div>}
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Mobile</label>
//                       <input value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="9876543210" />
//                       {errors.mobile && <div className="mt-1 text-xs text-rose-600">{errors.mobile}</div>}
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Email</label>
//                       <input value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="you@example.com" />
//                       {errors.email && <div className="mt-1 text-xs text-rose-600">{errors.email}</div>}
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Password</label>
//                       <input type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="Min 6 chars" />
//                       {errors.password && <div className="mt-1 text-xs text-rose-600">{errors.password}</div>}
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">GSTIN (optional)</label>
//                       <input value={form.gstin} onChange={(e) => updateField("gstin", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="15 characters" />
//                       {errors.gstin && <div className="mt-1 text-xs text-rose-600">{errors.gstin}</div>}
//                     </div>

//                     <div className="md:col-span-2 flex items-center justify-between mt-2">
//                       <button type="submit" disabled={submitting} className="px-6 py-3 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
//                         {submitting ? "Submitting..." : "Submit Registration"}
//                       </button>
//                       <div className="text-sm text-gray-500">Admin will review and approve your account.</div>
//                     </div>

//                     {submitMessage && (
//                       <div className={`md:col-span-2 mt-3 p-3 rounded ${submitMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-rose-50 text-rose-800"}`}>
//                         {submitMessage.text}
//                       </div>
//                     )}
//                   </form>
//                 ) : (
//                   <div className="space-y-3">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Email</label>
//                       <input value={loginForm.email} onChange={(e) => updateLoginField("email", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="you@example.com" />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Password</label>
//                       <input type="password" value={loginForm.password} onChange={(e) => updateLoginField("password", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="Your password" />
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <button onClick={handleLogin} className="px-4 py-2 rounded-md bg-indigo-600 text-white" disabled={loginLoading}>
//                         {loginLoading ? "Logging in..." : "Login"}
//                       </button>
//                       <button onClick={() => setTab("register")} className="px-4 py-2 rounded-md bg-gray-100">Create account</button>
//                     </div>

//                     {loginMessage && (
//                       <div className={`mt-2 p-2 rounded text-sm ${loginMessage.type === "error" ? "bg-rose-50 text-rose-700" : loginMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"}`}>
//                         {loginMessage.text}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



// ********************************************************************


// src/pages/VendorRegistration.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// /**
//  * Full auth page: login + register.
//  * - Stores vendor_token & vendor_info on approved login
//  * - Dispatches 'vendor-login' event so Navbar updates immediately
//  */

// export default function VendorRegistration() {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

//   // If user already logged in, keep vendor info locally
//   const [vendor, setVendor] = useState(() => {
//     try {
//       const raw = localStorage.getItem("vendor_info");
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   });

//   const [tab, setTab] = useState(vendor ? "logged" : "login"); // 'login' | 'register' | 'logged'
//   const [form, setForm] = useState({ name: "", age: "", mobile: "", email: "", password: "", gstin: "" });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState(null);

//   const [loginForm, setLoginForm] = useState({ email: "", password: "" });
//   const [loginLoading, setLoginLoading] = useState(false);
//   const [loginMessage, setLoginMessage] = useState(null);

//   useEffect(() => {
//     function onStorage(e) {
//       if (e.key === "vendor_info") {
//         const v = e.newValue ? JSON.parse(e.newValue) : null;
//         setVendor(v);
//         setTab(v ? "logged" : "login");
//       }
//       if (e.key === "vendor_token" && !e.newValue) {
//         setVendor(null);
//         setTab("login");
//       }
//     }
//     window.addEventListener("storage", onStorage);
//     function onVendorLogout() { setVendor(null); setTab("login"); }
//     window.addEventListener("vendor-logout", onVendorLogout);
//     return () => {
//       window.removeEventListener("storage", onStorage);
//       window.removeEventListener("vendor-logout", onVendorLogout);
//     };
//   }, []);

//   function updateField(k, v) { setForm(f => ({ ...f, [k]: v })); }
//   function updateLoginField(k, v) { setLoginForm(f => ({ ...f, [k]: v })); }

//   function validateRegister() {
//     const err = {};
//     if (!form.name.trim()) err.name = "Name is required";
//     if (!form.age.trim() || !Number.isInteger(Number(form.age)) || Number(form.age) < 18) err.age = "Age must be 18+";
//     if (!/^[6-9]\d{9}$/.test(form.mobile)) err.mobile = "Enter a valid 10-digit mobile";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email";
//     if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(form.password)) err.password = "Min 6 chars with letters & numbers";
//     if (form.gstin && !/^[0-9A-Za-z]{15}$/.test(form.gstin)) err.gstin = "GSTIN must be 15 chars";
//     return err;
//   }

//   // async function handleRegister(e) {
//   //   e.preventDefault();
//   //   setErrors({});
//   //   setSubmitMessage(null);
//   //   const err = validateRegister();
//   //   if (Object.keys(err).length) return setErrors(err);

//   //   const payload = {
//   //     name: form.name.trim(),
//   //     age: Number(form.age),
//   //     mobile: form.mobile.trim(),
//   //     email: form.email.trim(),
//   //     password: form.password,
//   //     gstin: form.gstin ? form.gstin.trim() : undefined,
//   //   };

//   //   try {
//   //     setSubmitting(true);
//   //     const res = await fetch(`${API_BASE}/api/vendor-requests`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(payload),
//   //     });
//   //     const data = await res.json().catch(()=>({}));
//   //     if (res.ok) {
//   //       setSubmitMessage({ type: "success", text: data.message || "Request submitted. Admin will review." });
//   //       setForm({ name: "", age: "", mobile: "", email: "", password: "", gstin: "" });
//   //       setTab("login");
//   //     } else {
//   //       if (data.errors && typeof data.errors === "object") setErrors(data.errors);
//   //       setSubmitMessage({ type: "error", text: data.message || "Submission failed." });
//   //     }
//   //   } catch {
//   //     setSubmitMessage({ type: "error", text: "Network error — try again later." });
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // }

//   // async function handleLogin(e) {
//   //   e.preventDefault();
//   //   setLoginMessage(null);
//   //   setLoginLoading(true);

//   //   try {
//   //     const res = await fetch(`${API_BASE}/api/vendor/login`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ email: loginForm.email.trim(), password: loginForm.password }),
//   //     });
//   //     const data = await res.json().catch(()=>({}));

//   //     if (res.ok) {
//   //       const token = data.token;
//   //       const vendorObj = data.vendor || null;

//   //       if (token && vendorObj && (vendorObj.status === "approved" || vendorObj.status === "active")) {
//   //         localStorage.setItem("vendor_token", token);
//   //         localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
//   //         window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
//   //         setVendor(vendorObj);
//   //         setLoginMessage({ type: "success", text: `Welcome, ${vendorObj.name}.` });
//   //         setTab("logged");
//   //         // redirect to dashboard
//   //         navigate("/vendor/dashboard");
//   //       } else if (vendorObj && vendorObj.status === "pending") {
//   //         localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
//   //         window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
//   //         setVendor(vendorObj);
//   //         setLoginMessage({ type: "info", text: "Your account is pending admin approval." });
//   //         setTab("logged");
//   //       } else if (vendorObj && vendorObj.status === "rejected") {
//   //         setLoginMessage({ type: "error", text: "Your vendor request was rejected." });
//   //       } else {
//   //         setLoginMessage({ type: "error", text: data.message || "Login succeeded but vendor status unknown." });
//   //       }
//   //     } else {
//   //       const msg = data.message || "Login failed — check credentials.";
//   //       setLoginMessage({ type: "error", text: msg });
//   //     }
//   //   } catch {
//   //     setLoginMessage({ type: "error", text: "Network error — try again later." });
//   //   } finally {
//   //     setLoginLoading(false);
//   //     setLoginForm({ email: "", password: "" });
//   //   }
//   // }

// //   async function handleLogin(e) {
// //   e.preventDefault();
// //   setLoginMessage(null);
// //   setLoginLoading(true);

// //   try {
// //     const res = await fetch(`${API_BASE}/api/vendor/login`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ email: loginForm.email.trim(), password: loginForm.password }),
// //     });
// //     const data = await res.json().catch(() => ({}));

// //     if (res.ok) {
// //       const token = data.token;
// //       const vendorObj = data.vendor || null;

// //       if (token && vendorObj && (vendorObj.status === "approved" || vendorObj.status === "active")) {
// //         // ✅ Approved login
// //         localStorage.setItem("vendor_token", token);
// //         localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
// //         window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
// //         setVendor(vendorObj);
// //         setLoginMessage({ type: "success", text: `Welcome, ${vendorObj.name}.` });
// //         setTab("logged");
// //         navigate("/vendor/dashboard");
// //       } else if (vendorObj && vendorObj.status === "pending") {
// //         // ✅ Pending (no token, but still valid login)
// //         localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
// //         window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
// //         setVendor(vendorObj);
// //         setLoginMessage({ type: "info", text: "Your account is pending admin approval." });
// //         setTab("logged");
// //       } else if (vendorObj && vendorObj.status === "rejected") {
// //         // ✅ Rejected (no token)
// //         localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
// //         window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
// //         setVendor(vendorObj);
// //         setLoginMessage({ type: "error", text: "Your vendor request was rejected." });
// //         setTab("logged");
// //       } else {
// //         setLoginMessage({ type: "error", text: data.message || "Login succeeded but vendor status unknown." });
// //       }
// //     } else {
// //       // ❌ Invalid credentials (wrong password or no vendor)
// //       const msg = data.message || "Login failed — check credentials.";
// //       setLoginMessage({ type: "error", text: msg });
// //     }
// //   } catch {
// //     setLoginMessage({ type: "error", text: "Network error — try again later." });
// //   } finally {
// //     setLoginLoading(false);
// //     setLoginForm({ email: "", password: "" });
// //   }
// // }


// async function handleLogin(e) {
//   if (e && e.preventDefault) e.preventDefault();
//   setLoginMessage(null);
//   setLoginLoading(true);

//   try {
//     const res = await fetch(`${API_BASE}/api/vendor/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: loginForm.email.trim(), password: loginForm.password }),
//     });

//     // DEBUG: log status
//     console.log("[login] response status:", res.status);

//     const data = await res.json().catch(() => ({}));
//     // DEBUG: log body
//     console.log("[login] response body:", data);

//     // If server returned 200, handle vendor object even if no token
//     if (res.status === 200) {
//       const token = data.token;
//       const vendorObj = data.vendor || null;

//       if (token && vendorObj && (vendorObj.status === "approved" || vendorObj.status === "active")) {
//         // Approved: save token & vendor
//         localStorage.setItem("vendor_token", token);
//         localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
//         window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
//         setVendor(vendorObj);
//         setLoginMessage({ type: "success", text: `Welcome, ${vendorObj.name}.` });
//         setTab("logged");
//         navigate("/vendor/dashboard");
//         return;
//       }

//       // No token but vendor exists: pending or rejected
//       if (vendorObj && vendorObj.status === "pending") {
//         localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
//         window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
//         setVendor(vendorObj);
//         setLoginMessage({ type: "info", text: data.message || "Your account is pending admin approval." });
//         setTab("logged");
//         return;
//       }

//       if (vendorObj && vendorObj.status === "rejected") {
//         localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
//         window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
//         setVendor(vendorObj);
//         setLoginMessage({ type: "error", text: data.message || "Your vendor request was rejected." });
//         setTab("logged");
//         return;
//       }

//       // If server responded 200 but we don't have vendor info:
//       setLoginMessage({ type: "error", text: data.message || "Login response missing vendor info." });
//       return;
//     }

//     // Non-200 responses
//     if (!res.ok) {
//       // server returned 4xx or 5xx
//       const errMsg = data?.message || "Login failed — check credentials.";
//       setLoginMessage({ type: "error", text: errMsg });
//       return;
//     }

//     // Fallback
//     setLoginMessage({ type: "error", text: "Unexpected login response." });
//   } catch (err) {
//     console.error("[login] network or parse error:", err);
//     setLoginMessage({ type: "error", text: "Network error — try again later." });
//   } finally {
//     setLoginLoading(false);
//     setLoginForm({ email: "", password: "" }); // optional: clear
//   }
// }



//   function logoutVendor() {
//     localStorage.removeItem("vendor_token");
//     localStorage.removeItem("vendor_info");
//     window.dispatchEvent(new Event("vendor-logout"));
//     setVendor(null);
//     setTab("login");
//     navigate("/vendor");
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800">
//       <main className="max-w-6xl mx-auto px-6 py-10">
//         <div className="grid md:grid-cols-12 gap-8 items-start">
//           {/* Left informational content */}
//           <div className="md:col-span-7">
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h1 className="text-3xl font-bold mb-2">Vendor Portal</h1>
//               <p className="text-gray-600 mb-6">Create a vendor account to list products, manage orders, and receive payouts. Admin approval is required for new accounts.</p>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="p-4 border rounded-lg">
//                   <div className="font-medium">Product Management</div>
//                   <div className="text-sm text-gray-500 mt-1">Add, edit, and organize your catalog.</div>
//                 </div>
//                 <div className="p-4 border rounded-lg">
//                   <div className="font-medium">Order Dashboard</div>
//                   <div className="text-sm text-gray-500 mt-1">View orders, update statuses and track shipments.</div>
//                 </div>
//                 <div className="p-4 border rounded-lg">
//                   <div className="font-medium">Payouts</div>
//                   <div className="text-sm text-gray-500 mt-1">Manage bank details and view payouts history.</div>
//                 </div>
//                 <div className="p-4 border rounded-lg">
//                   <div className="font-medium">Support</div>
//                   <div className="text-sm text-gray-500 mt-1">Contact admin for verification or help.</div>
//                 </div>
//               </div>

//               <div className="mt-6 text-sm text-gray-500"><strong>Tip:</strong> Use a corporate email and your GSTIN (if registered) to speed approval.</div>
//             </div>
//           </div>

//           {/* Right: AUTH area (now full functionality) */}
//           <aside className="md:col-span-5">
//             <div className="sticky top-20">
//               <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="px-6 py-4 border-b flex items-center justify-between">
//                   <div>
//                     <h2 className="text-lg font-semibold">Vendor Access</h2>
//                     <p className="text-sm text-gray-500">Login or register to access your dashboard</p>
//                   </div>
//                   <div className="text-sm text-gray-500">Secure</div>
//                 </div>

//                 <div className="p-6">
//                   {/* Tab buttons */}
//                   <div className="flex gap-2 mb-4">
//                     <button onClick={() => setTab("login")} className={`flex-1 px-3 py-2 text-sm rounded-md ${tab === "login" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>Login</button>
//                     <button onClick={() => setTab("register")} className={`flex-1 px-3 py-2 text-sm rounded-md ${tab === "register" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>Register</button>
//                     {vendor && <button onClick={() => setTab("logged")} className={`px-3 py-2 text-sm rounded-md ${tab === "logged" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}>Account</button>}
//                   </div>

//                   {tab === "register" ? (
//                     // Register form
//                     <form onSubmit={handleRegister} className="space-y-3">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">Full name</label>
//                         <input value={form.name} onChange={(e)=>updateField("name", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="Name" />
//                         {errors.name && <div className="text-xs text-rose-600 mt-1">{errors.name}</div>}
//                       </div>

//                       <div className="grid grid-cols-2 gap-2">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700">Age</label>
//                           <input value={form.age} onChange={(e)=>updateField("age", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="18" />
//                           {errors.age && <div className="text-xs text-rose-600 mt-1">{errors.age}</div>}
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700">Mobile</label>
//                           <input value={form.mobile} onChange={(e)=>updateField("mobile", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="9876543210" />
//                           {errors.mobile && <div className="text-xs text-rose-600 mt-1">{errors.mobile}</div>}
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">Email</label>
//                         <input value={form.email} onChange={(e)=>updateField("email", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="you@example.com" />
//                         {errors.email && <div className="text-xs text-rose-600 mt-1">{errors.email}</div>}
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">Password</label>
//                         <input type="password" value={form.password} onChange={(e)=>updateField("password", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="Min 6 chars" />
//                         {errors.password && <div className="text-xs text-rose-600 mt-1">{errors.password}</div>}
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">GSTIN (optional)</label>
//                         <input value={form.gstin} onChange={(e)=>updateField("gstin", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="15 characters" />
//                         {errors.gstin && <div className="text-xs text-rose-600 mt-1">{errors.gstin}</div>}
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
//                           {submitting ? "Submitting..." : "Submit Registration"}
//                         </button>
//                         <button type="button" onClick={() => setTab("login")} className="px-3 py-2 rounded-md bg-gray-100">Already have an account</button>
//                       </div>

//                       {submitMessage && <div className={`p-2 rounded mt-2 text-sm ${submitMessage.type==="success" ? "bg-green-50 text-green-700":"bg-rose-50 text-rose-700"}`}>{submitMessage.text}</div>}
//                     </form>
//                   ) : tab === "logged" && vendor ? (
//                     // Logged-in summary & actions
//                     <div className="p-3 bg-gray-50 rounded">
//                       <div className="font-semibold">{vendor.name}</div>
//                       <div className="text-sm text-gray-500">Status: <span className="font-medium">{vendor.status}</span></div>
//                       <div className="mt-3 flex gap-2">
//                         <button onClick={() => navigate("/vendor/dashboard")} className="px-3 py-2 rounded-md bg-emerald-600 text-white">Dashboard</button>
//                         <button onClick={logoutVendor} className="px-3 py-2 rounded-md bg-rose-500 text-white">Logout</button>
//                       </div>
//                       <div className="mt-2 text-sm text-gray-500">If pending, admin will review your request.</div>
//                     </div>
//                   ) : (
//                     // Login form
//                     <div className="space-y-3">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">Email</label>
//                         <input value={loginForm.email} onChange={(e)=>updateLoginField("email", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="you@example.com" />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-700">Password</label>
//                         <input type="password" value={loginForm.password} onChange={(e)=>updateLoginField("password", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="Your password" />
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <button onClick={handleLogin} className="px-4 py-2 rounded-md bg-indigo-600 text-white" disabled={loginLoading}>
//                           {loginLoading ? "Logging in..." : "Login"}
//                         </button>
//                         <button onClick={() => setTab("register")} className="px-3 py-2 rounded-md bg-gray-100">Create account</button>
//                       </div>

//                       {loginMessage && <div className={`mt-2 p-2 rounded text-sm ${loginMessage.type==="error"?"bg-rose-50 text-rose-700": loginMessage.type==="success"?"bg-green-50 text-green-700":"bg-gray-100 text-gray-700"}`}>{loginMessage.text}</div>}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-4 text-xs text-gray-500">By continuing you agree to our <a className="underline">Terms</a> &amp; <a className="underline">Privacy</a>.</div>
//             </div>
//           </aside>
//         </div>
//       </main>

//       <footer className="text-center text-sm text-gray-500 pb-8">© AjioClone — Vendor Portal</footer>
//     </div>
//   );
// }



// ******************************************************************************************************

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * VendorRegistration.jsx
 * - Simplified: this file only contains the auth modal (login + register).
 * - The Navbar should dispatch: window.dispatchEvent(new CustomEvent('open-vendor-auth', { detail: { tab: 'login' } }))
 * - On successful login we store vendor_token & vendor_info and dispatch 'vendor-login'.
 */

export default function VendorRegistration() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // keep an optional vendor state (in case other parts want to read it)
  const [vendor, setVendor] = useState(() => {
    try {
      const raw = localStorage.getItem("vendor_info");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Modal & tab state
  const [showAuth, setShowAuth] = useState(false);
  const [tab, setTab] = useState("login"); // 'login' or 'register'

  // Register form
  const [form, setForm] = useState({ name: "", age: "", mobile: "", email: "", password: "", gstin: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);

  useEffect(() => {
    // Open modal when Navbar (or any code) dispatches open-vendor-auth
    function onOpenAuth(e) {
      const desired = e?.detail?.tab;
      setTab(desired === "register" ? "register" : "login");
      setShowAuth(true);
      // scroll top so modal appears centered on small screens
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // sync vendor_info from other tabs
    function onStorage(e) {
      if (e.key === "vendor_info") setVendor(e.newValue ? JSON.parse(e.newValue) : null);
      if (e.key === "vendor_token" && !e.newValue) setVendor(null);
    }

    function onVendorLogin(e) { setVendor(e.detail || null); }
    function onVendorLogout() { setVendor(null); }

    window.addEventListener("open-vendor-auth", onOpenAuth);
    window.addEventListener("storage", onStorage);
    window.addEventListener("vendor-login", onVendorLogin);
    window.addEventListener("vendor-logout", onVendorLogout);

    return () => {
      window.removeEventListener("open-vendor-auth", onOpenAuth);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vendor-login", onVendorLogin);
      window.removeEventListener("vendor-logout", onVendorLogout);
    };
  }, []);

  function updateField(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function updateLoginField(k, v) { setLoginForm(f => ({ ...f, [k]: v })); }

  function validateRegister() {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.age.trim() || !Number.isInteger(Number(form.age)) || Number(form.age) < 18) err.age = "Age must be 18+";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) err.mobile = "Enter a valid 10-digit mobile";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email";
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(form.password)) err.password = "Min 6 chars with letters & numbers";
    if (form.gstin && !/^[0-9A-Za-z]{15}$/.test(form.gstin)) err.gstin = "GSTIN must be 15 chars";
    return err;
  }

  async function handleRegister(e) {
    e?.preventDefault?.();
    setErrors({});
    setSubmitMessage(null);

    const err = validateRegister();
    if (Object.keys(err).length) return setErrors(err);

    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      password: form.password,
      gstin: form.gstin ? form.gstin.trim() : undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/vendor-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitMessage({ type: "success", text: data.message || "Request submitted. Admin will review." });
        setForm({ name: "", age: "", mobile: "", email: "", password: "", gstin: "" });
        // setTab("login");
        setTimeout(() => setTab("login"), 2500);
      } else {
        if (data.errors && typeof data.errors === "object") setErrors(data.errors);
        setSubmitMessage({ type: "error", text: data.message || "Submission failed." });
      }
    } catch {
      setSubmitMessage({ type: "error", text: "Network error — try again later." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(e) {
    e?.preventDefault?.();
    setLoginMessage(null);
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginForm.email.trim(), password: loginForm.password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const token = data.token;
        const vendorObj = data.vendor || null;

        // ONLY treat as authenticated when backend returns a token.
        if (token && vendorObj && (vendorObj.status === "approved" || vendorObj.status === "active")) {
          localStorage.setItem("vendor_token", token);
          localStorage.setItem("vendor_info", JSON.stringify(vendorObj));
          window.dispatchEvent(new CustomEvent("vendor-login", { detail: vendorObj }));
          setVendor(vendorObj);
          setLoginMessage({ type: "success", text: `Welcome, ${vendorObj.name}.` });
          setShowAuth(false);
          navigate("/vendor/dashboard");
        } else if (vendorObj && vendorObj.status === "pending") {
          // Pending — show message but DO NOT persist token/info or dispatch login
          setLoginMessage({ type: "info", text: data.message || "Your account is pending admin approval." });
        } else if (vendorObj && vendorObj.status === "rejected") {
          // Rejected — show message, do not persist
          setLoginMessage({ type: "error", text: data.message || "Your vendor request was rejected." });
        } else {
          setLoginMessage({ type: "error", text: data.message || "Login succeeded but vendor status unknown." });
        }
      } else {
        const msg = data.message || "Login failed — check credentials.";
        setLoginMessage({ type: "error", text: msg });
      }
    } catch {
      setLoginMessage({ type: "error", text: "Network error — try again later." });
    } finally {
      setLoginLoading(false);
      setLoginForm({ email: "", password: "" });
    }
  }

  // Close modal helper (keeps messages/forms intact if you want)
  function closeModal() {
    setShowAuth(false);
  }

  return (
    <>
      {/* Auth modal only — no static vendor page content */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
          <div className="fixed inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative w-full max-w-2xl mx-4">
            <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Vendor Access</h3>
                  <p className="text-sm text-gray-500">Login or register to access your dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={closeModal} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:bg-gray-100">✕</button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-3 mb-4">
                  <button onClick={() => setTab("login")} className={`px-4 py-2 rounded-md text-sm ${tab === "login" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>Login</button>
                  <button onClick={() => setTab("register")} className={`px-4 py-2 rounded-md text-sm ${tab === "register" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>Register</button>
                </div>

                {tab === "register" ? (
                  <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Name</label>
                      <input value={form.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="Full name" />
                      {errors.name && <div className="mt-1 text-xs text-rose-600">{errors.name}</div>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Age</label>
                      <input value={form.age} onChange={(e) => updateField("age", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="18" />
                      {errors.age && <div className="mt-1 text-xs text-rose-600">{errors.age}</div>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Mobile</label>
                      <input value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="9876543210" />
                      {errors.mobile && <div className="mt-1 text-xs text-rose-600">{errors.mobile}</div>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Email</label>
                      <input value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="you@example.com" />
                      {errors.email && <div className="mt-1 text-xs text-rose-600">{errors.email}</div>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Password</label>
                      <input type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="Min 6 chars" />
                      {errors.password && <div className="mt-1 text-xs text-rose-600">{errors.password}</div>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">GSTIN (optional)</label>
                      <input value={form.gstin} onChange={(e) => updateField("gstin", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="15 characters" />
                      {errors.gstin && <div className="mt-1 text-xs text-rose-600">{errors.gstin}</div>}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between mt-2">
                      <button type="submit" disabled={submitting} className="px-6 py-3 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        {submitting ? "Submitting..." : "Submit Registration"}
                      </button>
                      <div className="text-sm text-gray-500">Admin will review and approve your account.</div>
                    </div>

                    {submitMessage && (
                      <div className={`md:col-span-2 mt-3 p-3 rounded ${submitMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-rose-50 text-rose-800"}`}>
                        {submitMessage.text}
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Email</label>
                      <input value={loginForm.email} onChange={(e) => updateLoginField("email", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="you@example.com" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Password</label>
                      <input type="password" value={loginForm.password} onChange={(e) => updateLoginField("password", e.target.value)} className="w-full px-4 py-2 rounded-md border" placeholder="Your password" />
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={handleLogin} className="px-4 py-2 rounded-md bg-indigo-600 text-white" disabled={loginLoading}>
                        {loginLoading ? "Logging in..." : "Login"}
                      </button>
                      <button onClick={() => setTab("register")} className="px-4 py-2 rounded-md bg-gray-100">Create account</button>
                    </div>

                    {loginMessage && (
                      <div className={`mt-2 p-2 rounded text-sm ${loginMessage.type === "error" ? "bg-rose-50 text-rose-700" : loginMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {loginMessage.text}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
