


// import React, { useState } from "react";
// import axios from "axios";

// const AuthModal = ({ onClose, onLoginSuccess }) => {
//   const [step, setStep] = useState("phone"); // phone | signup | otp
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userDetails, setUserDetails] = useState({
//     name: "",
//     email: "",
//     gender: "",
//     role: "",
//     inviteCode: "",
//     terms: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [isBlocked, setIsBlocked] = useState(false);

//   const normalizePhone = (phone) =>
//     phone.startsWith("+91") ? phone : `+91${phone}`;

//   // Mask phone for OTP view
//   const maskPhone = (phone) => {
//     if (!phone) return "";
//     const digits = phone.replace("+91", "");
//     return digits.replace(/(\d{2})\d{5}(\d{3})/, "$1XXXXX$2");
//   };

//   // Step 1: Check phone
//   const handlePhoneSubmit = async () => {
//     setErrors({});
//    if (!/^[6-9]\d{9}$/.test(phone)) {
//       setErrors({ phone: "Mobile number must start with 6-9 and be 10 digits" });
//           return;
//     }


//     try {
//       setLoading(true);
//       const normalizedPhone = normalizePhone(phone);
//       const res = await axios.post("http://localhost:5000/check-phone", {
//         phone: normalizedPhone,
//       });

//       if (res.data.status === "existing") {
//         setStep("otp");
//       } else {
//         setStep("signup");
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error checking phone");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2: Signup
//   const handleSignup = async () => {
//     const { name, email, gender, role } = userDetails;
//     let newErrors = {};

//     if (!/^[A-Za-z\s]+$/.test(name)) {
//       newErrors.name = "Name must only contain alphabets";
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /\d{3,}/.test(email)) {
//       newErrors.email =
//         "Invalid email (no more than 2 consecutive digits allowed)";
//     }
//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       newErrors.phone = "Phone must start with 6-9 and be 10 digits";
//     }
//     if (!gender) {
//       newErrors.gender = "Gender is required";
//     }
//     if (!role) {
//       newErrors.role = "Role is required";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       setLoading(true);
//       const normalizedPhone = normalizePhone(phone);
//       const res = await axios.post("http://localhost:5000/signup", {
//         ...userDetails,
//         phone: normalizedPhone,
//       });

//       if (res.data.status === "otp_sent") {
//         setStep("otp");
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error signing up");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 3: Verify OTP
//  const handleVerifyOtp = async () => {
//   try {
//     setLoading(true);
//     const normalizedPhone = normalizePhone(phone);
//     const res = await axios.post("http://localhost:5000/verify-otp", {
//       phone: normalizedPhone,
//       otp: otp.toString(),
//     });

//     if (res.data.user) {
//       onLoginSuccess(res.data.user);
//       onClose();
//     }
//   } catch (err) {
//     if (err.response) {
//       if (err.response.status === 403) {
//         setIsBlocked(true);
//         setMessage(err.response.data.message); // blocked message
//       } else if (err.response.status === 400) {
//         setMessage(err.response.data.message || "Invalid OTP");
//       } else {
//         setMessage("Something went wrong. Try again.");
//       }
//     } else {
//       setMessage("Network error. Please try again.");
//     }
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//       <div className="bg-white w-[400px] h-[650px] rounded shadow-lg relative p-8">
    

//         {/* Close */}
       
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
//         >
//           &times;
//         </button>
       

//         {/* Step 1: Phone */}
//         {step === "phone" && (
//           <>
//             <h2 className="text-2xl font-semibold mb-6 text-gray-900 ">
//               Welcome to AJIO
//             </h2>
//             <label className="block text-gray-700 text-sm mb-2">
//               Enter Mobile Number *
//             </label>

//             <input
//               type="text"
//               value={phone}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, "");
//                 setPhone(value);
//               }}
//               className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2"
//               maxLength={10}
//               placeholder="Enter 10 digit number"
//             />
//             {errors.phone && (
//               <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
//             )}

//             <button
//               onClick={handlePhoneSubmit}
//               disabled={loading}
//               className="w-1/2 mt-6 bg-[#866528] text-white py-3 font-medium rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Please wait..." : "CONTINUE"}
//             </button>


//             <p className="mt-4 text-xs text-gray-500 text-center">
//               By Signing In, I agree to{" "}
//               <span className="text-blue-600 cursor-pointer">
//                 Terms & Conditions
//               </span>{" "}
//               and{" "}
//               <span className="text-blue-600 cursor-pointer">
//                 Privacy Policy
//               </span>
//             </p>

//             <div className="mt-60 p-3 text-xs bg-yellow-50 border border-yellow-200 rounded text-gray-700 ">
//               📩 Email based login is no longer available. Please{" "}
//               <span className="text-blue-600 cursor-pointer">click here</span> to
//               restore your mobile number.
//             </div>



//           </>
//         )}

//         {/* Step 2: Signup */}
//         {step === "signup" && (
//           <>
//             <div className="flex items-center justify-between mb-4">
          
//               <button
//                 type="button"
//                 onClick={() => setStep("phone")}
//                 className="text-grey-500 text-sm flex items-center cursor-pointer"
//               >
//                 <span className="mr-1">&lt;</span> Back
//               </button>
//             </div>

//             <h2 className="text-2xl font-semibold mb-6 text-gray-900">
//               Welcome to AJIO
//             </h2>
//             <small>Please set up your account</small>

//             <div className="flex items-center justify-between mb-2 mt-6">
//               <p>Phone: {normalizePhone(phone)}</p>
//               <button
//                 type="button"
//                 onClick={() => setStep("phone")}
//                 className="text-blue-400 text-sm font-medium hover:underline"
//               >
//                 Edit
//               </button>
//             </div>
//             <small className="text-gray-500">
//               OTP will be sent to your number for verification.
//             </small>

//             {/* Gender */}
//             <div className="flex items-center gap-4 mb-3 mt-6">
//               <label>
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="Male"
//                   onChange={(e) =>
//                     setUserDetails({ ...userDetails, gender: e.target.value })
//                   }
//                 />{" "}
//                 Male
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="Female"
//                   onChange={(e) =>
//                     setUserDetails({ ...userDetails, gender: e.target.value })
//                   }
//                 />{" "}
//                 Female
//               </label>
//             </div>
//             {errors.gender && (
//               <p className="text-red-500 text-sm">{errors.gender}</p>
//             )}

//             {/* Name */}
//             <input
//               type="text"
//               placeholder="Name"
//               value={userDetails.name}
//               onChange={(e) =>
//                 setUserDetails({ ...userDetails, name: e.target.value })
//               }
//               className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2"
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm mb-2">{errors.name}</p>
//             )}

//             {/* Email */}
//             <input
//               type="email"
//               placeholder="Email"
//               value={userDetails.email}
//               onChange={(e) =>
//                 setUserDetails({ ...userDetails, email: e.target.value })
//               }
//               className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mb-2">{errors.email}</p>
//             )}

//             {/* Role */}
//             <div className="flex items-center gap-4 mb-3">
//               <label>
//                 <input
//                   type="radio"
//                   name="role"
//                   value="Customer"
//                   onChange={(e) =>
//                     setUserDetails({ ...userDetails, role: e.target.value })
//                   }
//                 />{" "}
//                 Customer
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="role"
//                   value="Vendor"
//                   onChange={(e) =>
//                     setUserDetails({ ...userDetails, role: e.target.value })
//                   }
//                 />{" "}
//                 Vendor
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="role"
//                   value="Admin"
//                   onChange={(e) =>
//                     setUserDetails({ ...userDetails, role: e.target.value })
//                   }
//                 />{" "}
//                 Admin
//               </label>
//             </div>
//             {errors.role && (
//               <p className="text-red-500 text-sm mb-2">{errors.role}</p>
//             )}

//             {/* Invite Code */}
//             <input
//               type="text"
//               placeholder="Invite code (optional)"
//               value={userDetails.inviteCode}
//               onChange={(e) =>
//                 setUserDetails({
//                   ...userDetails,
//                   inviteCode: e.target.value,
//                 })
//               }
//               className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-4"
//             />

//             {/* Terms */}
//             <div className="flex items-center mb-4">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={userDetails.terms || false}
//                 onChange={(e) =>
//                   setUserDetails({ ...userDetails, terms: e.target.checked })
//                 }
//                 className="mr-2"
//               />
//               <label htmlFor="terms" className="text-sm text-gray-600">
//                 By Signing Up, I agree to{" "}
//                 <span className="text-blue-600 cursor-pointer">
//                   Terms & Conditions
//                 </span>
//                 .
//               </label>
//             </div>

          
//             <button
//               onClick={handleSignup}
//               disabled={loading || !userDetails.terms}
//               className={`w-1/2 py-3 font-medium rounded ${
//                 userDetails.terms
//                   ? "bg-[#866528] text-white hover:bg-[#523813]"
//                   : "bg-gray-400 text-gray-200 cursor-not-allowed"
//               }`}
//             >
//               {loading ? "Please wait..." : "SEND OTP"}
//             </button>
            
//           </>
//         )} 
       

        



//         {/* Step 3: OTP */}
//         {step === "otp" && (
//           <>
//             <h2 className="text-2xl font-semibold mb-2 text-gray-900">
//               Glad you're back!
//             </h2>
//             <p className="text-sm text-gray-600 mb-6">
//               A Password has not been set for this account. Please enter OTP
//               sent to <span className="font-semibold">{maskPhone(phone)}</span>
//             </p>

//             <input 
//             type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-6"
//               maxLength={6}
//               placeholder="Enter OTP"
//               disabled={isBlocked}
//             />

//             <button
//               onClick={handleVerifyOtp}
//               disabled={loading || isBlocked} 
//               className="w-1/2 bg-[#866528] text-white py-3 font-medium rounded hover:bg-[#523813] disabled:opacity-50"
//             >
//               {loading ? "Verifying..." : "START SHOPPING"}
//             </button>

//             <p
//               onClick={handlePhoneSubmit}
//               className="mt-4 text-sm text-blue-600 cursor-pointer text-center"
//             >
//               Resend OTP
//             </p>
//           </>
//         )}

//         {/* Generic Message */}
//         {message && (
//           <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthModal;



// ************************************************* USER DATA ************************************


// src/components/AuthModal.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// // Configure axios so cookies are sent & received
// axios.defaults.withCredentials = true;
// // axios.defaults.baseURL = process.env.VITE_API_BASE || "http://localhost:5000";
// axios.defaults.baseURL = import.meta.env.VITE_API_BASE || "http://localhost:5000";


// const AuthModal = ({ onClose, onLoginSuccess }) => {
//   const [step, setStep] = useState("phone"); // phone | signup | otp
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userDetails, setUserDetails] = useState({
//     name: "",
//     email: "",
//     gender: "",
//     role: "",
//     inviteCode: "",
//     terms: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isBlocked, setIsBlocked] = useState(false);

//   // from contexts
//   const { mergeLocalToServer: mergeCart } = useCart();
//   const { mergeLocalToServer: mergeWishlist } = useWishlist();

//   const normalizePhone = (p) => (p?.startsWith("+91") ? p : `+91${p}`);

//   const maskPhone = (p) => {
//     if (!p) return "";
//     const digits = p.replace("+91", "");
//     return digits.replace(/(\d{2})\d{5}(\d{3})/, "$1XXXXX$2");
//   };

//   // Step 1: Check phone
//   const handlePhoneSubmit = async () => {
//     setErrors({});
//     setMessage("");
//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       setErrors({ phone: "Mobile number must start with 6-9 and be 10 digits" });
//       return;
//     }

//     try {
//       setLoading(true);
//       const normalizedPhone = normalizePhone(phone);
//       // using baseURL + relative path (axios.defaults.baseURL set above)
//       const res = axios.post("/auth/check-phone",  { phone: normalizedPhone });
//       if (res.data.status === "existing") {
//         setStep("otp");
//       } else {
//         setStep("signup");
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error checking phone");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2: Signup
//   const handleSignup = async () => {
//     const { name, email, gender, role } = userDetails;
//     let newErrors = {};

//     if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = "Name must only contain alphabets";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /\d{3,}/.test(email))
//       newErrors.email = "Invalid email (no more than 2 consecutive digits allowed)";
//     if (!/^[6-9]\d{9}$/.test(phone)) newErrors.phone = "Phone must start with 6-9 and be 10 digits";
//     if (!gender) newErrors.gender = "Gender is required";
//     if (!role) newErrors.role = "Role is required";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       setLoading(true);
//       const normalizedPhone = normalizePhone(phone);
//       const res = axios.post("/auth/signup", {
//         ...userDetails,
//         phone: normalizedPhone,
//       });

//       if (res.data.status === "otp_sent") {
//         setStep("otp");
//         setMessage("OTP sent to your phone");
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error signing up");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 3: Verify OTP (this must make the server set a JWT cookie)
//   const handleVerifyOtp = async () => {
//     setMessage("");
//     try {
//       setLoading(true);
//       const normalizedPhone = normalizePhone(phone);
//       const res = axios.post("/auth/verify-otp", {
//         phone: normalizedPhone,
//         otp: otp.toString(),
//       });

//       // Server should return a user object and set cookie (see server snippet below)
//       if (res.data?.user) {
//         // 1) merge guest (localStorage) cart -> server cart, and wishlist -> server
//         // keep UI loading while merging
//         try {
//           setMessage("Login successful — syncing your cart & wishlist...");
//           if (mergeCart) await mergeCart();
//           if (mergeWishlist) await mergeWishlist();
//         } catch (mergeErr) {
//           console.error("Merge error:", mergeErr);
//           // still proceed even if merge fails; user logged in
//         }

//         // 2) inform parent and close modal
//         onLoginSuccess(res.data.user);
//         onClose();
//       } else {
//         setMessage(res.data?.message || "Unexpected server response");
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response) {
//         if (err.response.status === 403) {
//           setIsBlocked(true);
//           setMessage(err.response.data.message || "Blocked. Try later.");
//         } else if (err.response.status === 400) {
//           setMessage(err.response.data.message || "Invalid OTP");
//         } else {
//           setMessage(err.response?.data?.message || "Something went wrong. Try again.");
//         }
//       } else {
//         setMessage("Network error. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//       <div className="bg-white w-[400px] h-[650px] rounded shadow-lg relative p-8">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold">
//           &times;
//         </button>

//         {step === "phone" && (
//           <>
//             <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome to AJIO</h2>
//             <label className="block text-gray-700 text-sm mb-2">Enter Mobile Number *</label>
//             <input
//               type="text"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
//               className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2"
//               maxLength={10}
//               placeholder="Enter 10 digit number"
//             />
//             {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}
//             <button onClick={handlePhoneSubmit} disabled={loading} className="w-1/2 mt-6 bg-[#866528] text-white py-3 font-medium rounded disabled:opacity-50">
//               {loading ? "Please wait..." : "CONTINUE"}
//             </button>
//             <p className="mt-4 text-xs text-gray-500 text-center">
//               By Signing In, I agree to <span className="text-blue-600">Terms & Conditions</span> and <span className="text-blue-600">Privacy Policy</span>
//             </p>
//           </>
//         )}

//         {step === "signup" && (
//           <>
//             <div className="flex items-center justify-between mb-4">
//               <button type="button" onClick={() => setStep("phone")} className="text-grey-500 text-sm flex items-center cursor-pointer">
//                 <span className="mr-1">&lt;</span> Back
//               </button>
//             </div>
//             <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome to AJIO</h2>
//             <small>Please set up your account</small>
//             <div className="flex items-center justify-between mb-2 mt-6">
//               <p>Phone: {normalizePhone(phone)}</p>
//               <button type="button" onClick={() => setStep("phone")} className="text-blue-400 text-sm font-medium hover:underline">Edit</button>
//             </div>
//             <small className="text-gray-500">OTP will be sent to your number for verification.</small>

//             <div className="flex items-center gap-4 mb-3 mt-6">
//               <label><input type="radio" name="gender" value="Male" onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })} /> Male</label>
//               <label><input type="radio" name="gender" value="Female" onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })} /> Female</label>
//             </div>
//             {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

//             <input type="text" placeholder="Name" value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2" />
//             {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

//             <input type="email" placeholder="Email" value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2" />
//             {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

//             <div className="flex items-center gap-4 mb-3">
//               <label><input type="radio" name="role" value="Customer" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Customer</label>
//               <label><input type="radio" name="role" value="Vendor" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Vendor</label>
//               <label><input type="radio" name="role" value="Admin" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Admin</label>
//             </div>
//             {errors.role && <p className="text-red-500 text-sm mb-2">{errors.role}</p>}

//             <input type="text" placeholder="Invite code (optional)" value={userDetails.inviteCode} onChange={(e) => setUserDetails({ ...userDetails, inviteCode: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-4" />

//             <div className="flex items-center mb-4">
//               <input type="checkbox" id="terms" checked={userDetails.terms || false} onChange={(e) => setUserDetails({ ...userDetails, terms: e.target.checked })} className="mr-2" />
//               <label htmlFor="terms" className="text-sm text-gray-600">By Signing Up, I agree to <span className="text-blue-600 cursor-pointer">Terms & Conditions</span>.</label>
//             </div>

//             <button onClick={handleSignup} disabled={loading || !userDetails.terms} className={`w-1/2 py-3 font-medium rounded ${userDetails.terms ? "bg-[#866528] text-white hover:bg-[#523813]" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}>
//               {loading ? "Please wait..." : "SEND OTP"}
//             </button>
//           </>
//         )}

//         {step === "otp" && (
//           <>
//             <h2 className="text-2xl font-semibold mb-2 text-gray-900">Glad you're back!</h2>
//             <p className="text-sm text-gray-600 mb-6">Enter OTP sent to <span className="font-semibold">{maskPhone(phone)}</span></p>
//             <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-6" maxLength={6} placeholder="Enter OTP" disabled={isBlocked} />
//             <button onClick={handleVerifyOtp} disabled={loading || isBlocked} className="w-1/2 bg-[#866528] text-white py-3 font-medium rounded hover:bg-[#523813] disabled:opacity-50">
//               {loading ? "Verifying..." : "START SHOPPING"}
//             </button>
//             <p onClick={handlePhoneSubmit} className="mt-4 text-sm text-blue-600 cursor-pointer text-center">Resend OTP</p>
//           </>
//         )}

//         {message && <p className="mt-4 text-center text-red-500 text-sm">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default AuthModal;


// ********************************************************* USER DTA 2 **********************************


// src/components/AuthModal.jsx
// import React, { useState } from "react";
// // import axios from "axios";
// import { api } from "../lib/api";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// /**
//  * IMPORTANT:
//  * - If you use Vite proxy (recommended for dev), set VITE_API_BASE to empty or omit it.
//  * - If you do not use proxy, set VITE_API_BASE in your frontend .env to "http://localhost:5000"
//  */

// // Make axios send cookies by default
// // axios.defaults.withCredentials = true;
// // Use VITE_API_BASE when set; otherwise '' so relative calls go through Vite proxy in dev.
// // axios.defaults.baseURL = import.meta.env.VITE_API_BASE || "";

// const AuthModal = ({ onClose, onLoginSuccess }) => {
//   const [step, setStep] = useState("phone"); // phone | signup | otp
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userDetails, setUserDetails] = useState({
//     name: "",
//     email: "",
//     gender: "",
//     role: "",
//     inviteCode: "",
//     terms: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isBlocked, setIsBlocked] = useState(false);

//   // contexts for merging after login
//   const { mergeLocalToServer: mergeCart } = useCart();
//   const { mergeLocalToServer: mergeWishlist } = useWishlist();

//   const normalizePhone = (p) => (p?.startsWith("+91") ? p : `+91${p || ""}`);

//   const maskPhone = (p) => {
//     if (!p) return "";
//     const digits = p.replace("+91", "");
//     return digits.replace(/(\d{2})\d{5}(\d{3})/, "$1XXXXX$2");
//   };

//   // // Step 1: check phone
//   // const handlePhoneSubmit = async () => {
//   //   setErrors({});
//   //   setMessage("");
//   //   if (!/^[6-9]\d{9}$/.test(phone)) {
//   //     setErrors({ phone: "Mobile number must start with 6-9 and be 10 digits" });
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     const normalizedPhone = normalizePhone(phone);
//   //     const res = await api.post("/auth/check-phone", { phone: normalizedPhone });

//   //     if (res?.data?.status === "existing") {
//   //       setStep("otp");
//   //     } else {
//   //       setStep("signup");
//   //     }
//   //   } catch (err) {
//   //     console.error("check-phone error:", err);
//   //     setMessage(err?.response?.data?.message || "Error checking phone");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // // Step 2: signup
//   // const handleSignup = async () => {
//   //   const { name, email, gender, role } = userDetails;
//   //   const newErrors = {};

//   //   if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = "Name must only contain alphabets";
//   //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /\d{3,}/.test(email))
//   //     newErrors.email = "Invalid email (no more than 2 consecutive digits allowed)";
//   //   if (!/^[6-9]\d{9}$/.test(phone)) newErrors.phone = "Phone must start with 6-9 and be 10 digits";
//   //   if (!gender) newErrors.gender = "Gender is required";
//   //   if (!role) newErrors.role = "Role is required";

//   //   if (Object.keys(newErrors).length > 0) {
//   //     setErrors(newErrors);
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     const normalizedPhone = normalizePhone(phone);
//   //     const res = await api.post("/auth/signup", { ...userDetails, phone: normalizedPhone });

//   //     if (res?.data?.status === "otp_sent") {
//   //       setStep("otp");
//   //       setMessage("OTP sent to your phone");
//   //     } else {
//   //       setMessage(res?.data?.message || "Signup: unexpected response");
//   //     }
//   //   } catch (err) {
//   //     console.error("signup error:", err);
//   //     setMessage(err?.response?.data?.message || "Error signing up");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // // Step 3: verify OTP -> server sets cookie; then fetch /auth/me and merge local data
//   // const handleVerifyOtp = async () => {
//   //   setMessage("");
//   //   try {
//   //     setLoading(true);
//   //     const normalizedPhone = normalizePhone(phone);
//   //    const res = await api.post("/auth/verify-otp", { phone: normalizedPhone, otp: otp.toString() });

//   //     // server often returns user in res.data.user; also call /auth/me to confirm cookie is active
//   //     let user = res?.data?.user || null;
//   //     try {
//   //       const meRes = await axios.get("/auth/me"); // uses axios.defaults.withCredentials
//   //       user = meRes?.data || user;
//   //     } catch (meErr) {
//   //       // If /auth/me fails, we still may have res.data.user; log and continue
//   //       console.warn("/auth/me failed after verify:", meErr);
//   //     }

//   //     if (!user) {
//   //       setMessage(res?.data?.message || "Login succeeded but user info not returned");
//   //       return;
//   //     }

//   //     // Merge localStorage cart/wishlist to server (if any)
//   //     try {
//   //       setMessage("Login successful — syncing your cart & wishlist...");
//   //       if (mergeCart) await mergeCart();
//   //       if (mergeWishlist) await mergeWishlist();
//   //     } catch (mergeErr) {
//   //       console.error("merge error:", mergeErr);
//   //       // proceed anyway
//   //     }

//   //     // Notify parent and close modal
//   //     onLoginSuccess(user);
//   //     onClose();
//   //   } catch (err) {
//   //     console.error("verify-otp error:", err);
//   //     if (err.response) {
//   //       if (err.response.status === 403) {
//   //         setIsBlocked(true);
//   //         setMessage(err.response.data?.message || "Too many attempts — blocked temporarily");
//   //       } else if (err.response.status === 400) {
//   //         setMessage(err.response.data?.message || "Invalid or expired OTP");
//   //       } else {
//   //         setMessage(err.response.data?.message || "Something went wrong. Try again.");
//   //       }
//   //     } else {
//   //       setMessage("Network error. Please try again.");
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // Step 1: Check phone
// const handlePhoneSubmit = async () => {
//   setErrors({});
//   setMessage("");
//   if (!/^[6-9]\d{9}$/.test(phone)) {
//     setErrors({ phone: "Mobile number must start with 6-9 and be 10 digits" });
//     return;
//   }

//   try {
//     setLoading(true);
//     const normalizedPhone = normalizePhone(phone);
//     // IMPORTANT: await the API call (we use your fetch wrapper)
//     const res = await api.post("/auth/check-phone", { phone: normalizedPhone });

//     // server returns { status: "existing" } or { status: "new" }
//     if (res.status === "existing") {
//       setStep("otp"); // go to OTP input
//       setMessage("OTP sent to your phone (dev: check server console).");
//     } else {
//       setStep("signup");
//     }
//   } catch (err) {
//     setMessage(err?.message || "Error checking phone");
//   } finally {
//     setLoading(false);
//   }
// };

// // Step 2: Signup
// const handleSignup = async () => {
//   const { name, email, gender, role } = userDetails;
//   let newErrors = {};

//   if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = "Name must only contain alphabets";
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /\d{3,}/.test(email))
//     newErrors.email = "Invalid email (no more than 2 consecutive digits allowed)";
//   if (!/^[6-9]\d{9}$/.test(phone)) newErrors.phone = "Phone must start with 6-9 and be 10 digits";
//   if (!gender) newErrors.gender = "Gender is required";
//   if (!role) newErrors.role = "Role is required";

//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     return;
//   }

//   try {
//     setLoading(true);
//     const normalizedPhone = normalizePhone(phone);
//     const res = await api.post("/auth/signup", {
//       ...userDetails,
//       phone: normalizedPhone,
//     });

//     if (res.status === "otp_sent") {
//       setStep("otp");
//       setMessage("OTP sent — check server console in dev.");
//     } else {
//       setMessage("Unexpected signup response");
//     }
//   } catch (err) {
//     setMessage(err?.message || "Error signing up");
//   } finally {
//     setLoading(false);
//   }
// };

// // Step 3: Verify OTP
// const handleVerifyOtp = async () => {
//   setMessage("");
//   if (!/^\d{6}$/.test(otp)) {
//     setMessage("Enter a 6-digit OTP");
//     return;
//   }

//   try {
//     setLoading(true);
//     const normalizedPhone = normalizePhone(phone);
//     const res = await api.post("/auth/verify-otp", {
//       phone: normalizedPhone,
//       otp: otp.toString(),
//     });

//     // server returns { message, user }
//     if (res?.user) {
//       // optionally merge local data (cart/wishlist) here if you use those contexts
//       if (mergeCart) await mergeCart().catch(() => {});
//       if (mergeWishlist) await mergeWishlist().catch(() => {});

//       onLoginSuccess(res.user);
//       onClose();
//     } else {
//       setMessage(res?.message || "Unexpected response");
//     }
//   } catch (err) {
//     // api throws an Error with .message from server or fetch
//     setMessage(err?.message || "Verification failed");
//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//       <div className="bg-white w-[400px] h-[650px] rounded shadow-lg relative p-8 overflow-auto">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold">
//           &times;
//         </button>

//         {step === "phone" && (
//           <>
//             <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome to AJIO</h2>
//             <label className="block text-gray-700 text-sm mb-2">Enter Mobile Number *</label>
//             <input
//               type="text"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
//               className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2"
//               maxLength={10}
//               placeholder="Enter 10 digit number"
//             />
//             {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}
//             <button
//               onClick={handlePhoneSubmit}
//               disabled={loading}
//               className="w-1/2 mt-6 bg-[#866528] text-white py-3 font-medium rounded disabled:opacity-50"
//             >
//               {loading ? "Please wait..." : "CONTINUE"}
//             </button>

//             <p className="mt-4 text-xs text-gray-500 text-center">
//               By Signing In, I agree to <span className="text-blue-600">Terms & Conditions</span> and <span className="text-blue-600">Privacy Policy</span>
//             </p>
//           </>
//         )}

//         {step === "signup" && (
//           <>
//             <div className="flex items-center justify-between mb-4">
//               <button type="button" onClick={() => setStep("phone")} className="text-grey-500 text-sm flex items-center cursor-pointer">
//                 <span className="mr-1">&lt;</span> Back
//               </button>
//             </div>

//             <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome to AJIO</h2>
//             <small>Please set up your account</small>

//             <div className="flex items-center justify-between mb-2 mt-6">
//               <p>Phone: {normalizePhone(phone)}</p>
//               <button type="button" onClick={() => setStep("phone")} className="text-blue-400 text-sm font-medium hover:underline">Edit</button>
//             </div>

//             <small className="text-gray-500">OTP will be sent to your number for verification.</small>

//             <div className="flex items-center gap-4 mb-3 mt-6">
//               <label>
//                 <input type="radio" name="gender" value="Male" onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })} /> Male
//               </label>
//               <label>
//                 <input type="radio" name="gender" value="Female" onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })} /> Female
//               </label>
//             </div>
//             {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

//             <input type="text" placeholder="Name" value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2" />
//             {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

//             <input type="email" placeholder="Email" value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2" />
//             {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

//             <div className="flex items-center gap-4 mb-3">
//               <label><input type="radio" name="role" value="Customer" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Customer</label>
//               <label><input type="radio" name="role" value="Vendor" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Vendor</label>
//               <label><input type="radio" name="role" value="Admin" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Admin</label>
//             </div>
//             {errors.role && <p className="text-red-500 text-sm mb-2">{errors.role}</p>}

//             <input type="text" placeholder="Invite code (optional)" value={userDetails.inviteCode} onChange={(e) => setUserDetails({ ...userDetails, inviteCode: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-4" />

//             <div className="flex items-center mb-4">
//               <input type="checkbox" id="terms" checked={userDetails.terms || false} onChange={(e) => setUserDetails({ ...userDetails, terms: e.target.checked })} className="mr-2" />
//               <label htmlFor="terms" className="text-sm text-gray-600">By Signing Up, I agree to <span className="text-blue-600 cursor-pointer">Terms & Conditions</span>.</label>
//             </div>

//             <button onClick={handleSignup} disabled={loading || !userDetails.terms} className={`w-1/2 py-3 font-medium rounded ${userDetails.terms ? "bg-[#866528] text-white hover:bg-[#523813]" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}>
//               {loading ? "Please wait..." : "SEND OTP"}
//             </button>
//           </>
//         )}

//         {step === "otp" && (
//           <>
//             <h2 className="text-2xl font-semibold mb-2 text-gray-900">Glad you're back!</h2>
//             <p className="text-sm text-gray-600 mb-6">Enter OTP sent to <span className="font-semibold">{maskPhone(phone)}</span></p>

//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//               className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-6"
//               maxLength={6}
//               placeholder="Enter OTP"
//               disabled={isBlocked}
//             />

//             <button onClick={handleVerifyOtp} disabled={loading || isBlocked} className="w-1/2 bg-[#866528] text-white py-3 font-medium rounded hover:bg-[#523813] disabled:opacity-50">
//               {loading ? "Verifying..." : "START SHOPPING"}
//             </button>

//             <p onClick={handlePhoneSubmit} className="mt-4 text-sm text-blue-600 cursor-pointer text-center">Resend OTP</p>
//           </>
//         )}

//         {message && <p className="mt-4 text-center text-red-500 text-sm">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default AuthModal;



// ***************************************************************************************************

// src/components/AuthModal.jsx
import React, { useState } from "react";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState({ name: "", email: "", gender: "", role: "", inviteCode: "", terms: false });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const { mergeLocalToServer: mergeCart } = useCart();
  const { mergeLocalToServer: mergeWishlist } = useWishlist();

  const normalizePhone = (p) => (p?.startsWith("+91") ? p : `+91${p || ""}`);
  const maskPhone = (p) => {
    if (!p) return "";
    const digits = p.replace("+91", "");
    return digits.replace(/(\d{2})\d{5}(\d{3})/, "$1XXXXX$2");
  };

  const handlePhoneSubmit = async () => {
    setErrors({}); setMessage("");
    if (!/^[6-9]\d{9}$/.test(phone)) { setErrors({ phone: "Mobile number must start with 6-9 and be 10 digits" }); return; }
    try {
      setLoading(true);
      const normalizedPhone = normalizePhone(phone);
      const res = await api.post("/auth/check-phone", { phone: normalizedPhone });
      if (res.status === "existing") {
        setStep("otp");
    setMessage("OTP sent to your phone ");//(dev: check server console).
      } else {
        setStep("signup");
      }
    } catch (err) {
      setMessage(err?.message || "Error checking phone");
    } finally { setLoading(false); }
  };

  const handleSignup = async () => {
    const { name, email, gender, role } = userDetails;
    let newErrors = {};
    if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = "Name must only contain alphabets";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /\d{3,}/.test(email)) newErrors.email = "Invalid email (no more than 2 consecutive digits allowed)";
    if (!/^[6-9]\d{9}$/.test(phone)) newErrors.phone = "Phone must start with 6-9 and be 10 digits";
    if (!gender) newErrors.gender = "Gender is required";
    if (!role) newErrors.role = "Role is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      setLoading(true);
      const normalizedPhone = normalizePhone(phone);
      const res = await api.post("/auth/signup", { ...userDetails, phone: normalizedPhone });
      if (res.status === "otp_sent") { setStep("otp"); setMessage("OTP sent"); }
      else setMessage("Unexpected signup response");
    } catch (err) { setMessage(err?.message || "Error signing up"); } finally { setLoading(false); }
  };

  // const handleVerifyOtp = async () => {
  //   setMessage("");
  //   if (!/^\d{6}$/.test(otp)) { setMessage("Enter a 6-digit OTP"); return; }
  //   try {
  //     setLoading(true);
  //     const normalizedPhone = normalizePhone(phone);
  //     const res = await api.post("/auth/verify-otp", { phone: normalizedPhone, otp: otp.toString() });

  //     // if (res?.user) {
  //     //   // merge guest data into server cart/wishlist (server cookie must be set by verify-otp response)
  //     //   try {
  //     //     if (mergeCart) await mergeCart();
  //     //   } catch (e) { console.warn("Cart merge failed", e); }
  //     //   try {
  //     //     if (mergeWishlist) await mergeWishlist();
  //     //   } catch (e) { console.warn("Wishlist merge failed", e); }

  //     //   onLoginSuccess(res.user);
  //     //   onClose();
  //     // } 
  //     // after verify-otp success inside AuthModal


  //     if (res?.user) {
  //       try {
  //         setMessage("Login successful — syncing your cart & wishlist...");
  //         if (mergeCart) await mergeCart();
  //         if (mergeWishlist) await mergeWishlist();
  //       } catch (mergeErr) {
  //         console.error("Merge error:", mergeErr);
  //       }

  //       onLoginSuccess(res.data.user); // this sets currentUser in App
  //       onClose();
  //     }

      
  //     else {
  //       setMessage(res?.message || "Unexpected response");
  //     }
  //   } catch (err) {
  //     console.error("verify-otp error:", err);
  //     setMessage(err?.message || "Verification failed");
  //     if (err.status === 403) setIsBlocked(true);
  //   } finally { setLoading(false); }
  // };

//   const handleVerifyOtp = async () => {
//   setMessage("");
//   setIsBlocked(false);
//   if (!/^\d{6}$/.test(otp)) {
//     setMessage("Enter a 6-digit OTP");
//     return;
//   }

//   try {
//     setLoading(true);
//     const normalizedPhone = normalizePhone(phone);

//     // If you use your fetch wrapper (api.post), it returns parsed JSON directly.
//     // If you use axios, uncomment the axios block below and comment api block.
//     //
//     // ----- USING your api wrapper (recommended) -----
//     const res = await api.post("/auth/verify-otp", {
//       phone: normalizedPhone,
//       otp: otp.toString(),
//     });
//     // `res` is the parsed JSON body: { message, user } on success

//     // ----- USING axios (only if you actually use axios here) -----
//     // const resp = await axios.post("/auth/verify-otp", { phone: normalizedPhone, otp: otp.toString() });
//     // const res = resp.data; // axios has data

//     // Defensive checks:
//     if (!res) {
//       setMessage("No response from server");
//       return;
//     }

//     // Server should return { message: "...", user: {...} } on success
//     if (!res.user) {
//       // If server returned an error-body, surface it
//       setMessage(res.message || "Login failed: no user returned");
//       return;
//     }

//     // Merge guest data into user's server-side data (cart & wishlist)
//     try {
//       setMessage("Login successful — syncing your cart & wishlist...");
//       if (mergeCart) await mergeCart();
//       if (mergeWishlist) await mergeWishlist();
//     } catch (mergeErr) {
//       console.error("Merge error:", mergeErr);
//       // proceed anyway — user is authenticated even if merge fails
//     }

//     // Tell parent that login succeeded
//     onLoginSuccess && onLoginSuccess(res.user);

//     // close modal
//     onClose && onClose();
//   } catch (err) {
//     console.error("verify-otp error:", err);
//     // err may be Error thrown by fetch wrapper: err.message contains server message
//     setMessage(err?.message || "Something went wrong. Try again.");
//   } finally {
//     setLoading(false);
//   }
// };

  // inside AuthModal.jsx
const handleVerifyOtp = async () => {
  setMessage("");
  if (!/^\d{6}$/.test(otp)) {
    setMessage("Enter a valid 6-digit OTP");
    return;
  }

  try {
    setLoading(true);
    const normalizedPhone = normalizePhone(phone);

    // call your api wrapper which returns parsed JSON body
    const res = await api.post("/auth/verify-otp", {
      phone: normalizedPhone,
      otp: otp.toString(),
    });

    // Debugging - always log what you received (remove in prod)
    console.log("verify-otp response:", res);

    // support both axios-like (res.data.user) and fetch-like (res.user) shapes
    const user =
      (res && res.user) ||
      (res && res.data && res.data.user) ||
      (res && res.user === undefined && res.data && res.data.length ? res.data : null);

    if (user) {
      // merge local guest cart/wishlist to server if available
      try {
        setMessage("Login successful — syncing your cart & wishlist...");
        if (mergeCart) await mergeCart();
        if (mergeWishlist) await mergeWishlist();
      } catch (mergeErr) {
        console.error("Merge error:", mergeErr);
        // proceed anyway — user is logged in
      }

      // inform parent and close modal
      onLoginSuccess(user);
      onClose();
      return;
    }

    // If we reached here, the server returned something unexpected
    // It might be a plain message or the body shape is different. Show safe message.
    setMessage((res && (res.message || (res.data && res.data.message))) || "Unexpected server response");
  } catch (err) {
    console.error("verify-otp error:", err);

    // If your api wrapper throws errors with 'status' or 'body', check them first
    if (err?.status === 403 || (err?.response && err.response.status === 403)) {
      setMessage(err?.body?.message || err?.response?.data?.message || "Blocked. Try later.");
      setIsBlocked(true);
    } else if (err?.status === 400 || (err?.response && err.response.status === 400)) {
      setMessage(err?.body?.message || err?.response?.data?.message || "Invalid OTP");
    } else {
      setMessage(err?.message || "Something went wrong. Try again.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[400px] h-[650px] rounded shadow-lg relative p-8 overflow-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold">&times;</button>

        {step === "phone" && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome to AJIO</h2>
            <label className="block text-gray-700 text-sm mb-2">Enter Mobile Number *</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2" maxLength={10} placeholder="Enter 10 digit number" />
            {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}
            <button onClick={handlePhoneSubmit} disabled={loading} className="w-1/2 mt-6 bg-[#866528] text-white py-3 font-medium rounded disabled:opacity-50">{loading ? "Please wait..." : "CONTINUE"}</button>
            <p className="mt-4 text-xs text-gray-500 text-center">By Signing In, I agree to <span className="text-blue-600">Terms & Conditions</span> and <span className="text-blue-600">Privacy Policy</span></p>

          <div className="mt-60 p-3 text-xs bg-yellow-50 border border-yellow-200 rounded text-gray-700 ">
              📩 Email based login is no longer available. Please{" "}
              <span className="text-blue-600 cursor-pointer">click here</span> to
              restore your mobile number.
            </div>


          </>
        )}

        {step === "signup" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <button type="button" onClick={() => setStep("phone")} className="text-grey-500 text-sm flex items-center cursor-pointer"><span className="mr-1">&lt;</span> Back</button>
            </div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome to AJIO</h2>
            <small>Please set up your account</small>
            <div className="flex items-center justify-between mb-2 mt-6"><p>Phone: {normalizePhone(phone)}</p><button type="button" onClick={() => setStep("phone")} className="text-blue-400 text-sm font-medium hover:underline">Edit</button></div>
            <small className="text-gray-500">OTP will be sent to your number for verification.</small>

            <div className="flex items-center gap-4 mb-3 mt-6">
              <label><input type="radio" name="gender" value="Male" onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })} /> Male</label>
              <label><input type="radio" name="gender" value="Female" onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })} /> Female</label>
            </div>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

            <input type="text" placeholder="Name" value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2" />
            {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

            <input type="email" placeholder="Email" value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-2" />
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

            <div className="flex items-center gap-4 mb-3">
              <label><input type="radio" name="role" value="Customer" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Customer</label>
              <label><input type="radio" name="role" value="Vendor" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Vendor</label>
              <label><input type="radio" name="role" value="Admin" onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })} /> Admin</label>
            </div>
            {errors.role && <p className="text-red-500 text-sm mb-2">{errors.role}</p>}

            <input type="text" placeholder="Invite code (optional)" value={userDetails.inviteCode} onChange={(e) => setUserDetails({ ...userDetails, inviteCode: e.target.value })} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-4" />

            <div className="flex items-center mb-4">
              <input type="checkbox" id="terms" checked={userDetails.terms || false} onChange={(e) => setUserDetails({ ...userDetails, terms: e.target.checked })} className="mr-2" />
              <label htmlFor="terms" className="text-sm text-gray-600">By Signing Up, I agree to <span className="text-blue-600 cursor-pointer">Terms & Conditions</span>.</label>
            </div>

            <button onClick={handleSignup} disabled={loading || !userDetails.terms} className={`w-1/2 py-3 font-medium rounded ${userDetails.terms ? "bg-[#866528] text-white hover:bg-[#523813]" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}>{loading ? "Please wait..." : "SEND OTP"}</button>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Glad you're back!</h2>
            <p className="text-sm text-gray-600 mb-6">Enter OTP sent to <span className="font-semibold">{maskPhone(phone)}</span></p>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className="w-full border-b-2 border-gray-400 focus:border-black outline-none py-2 mb-6" maxLength={6} placeholder="Enter OTP" disabled={isBlocked} />
            <button onClick={handleVerifyOtp} disabled={loading || isBlocked} className="w-1/2 bg-[#866528] text-white py-3 font-medium rounded hover:bg-[#523813] disabled:opacity-50">{loading ? "Verifying..." : "START SHOPPING"}</button>
            <p onClick={handlePhoneSubmit} className="mt-4 text-sm text-blue-600 cursor-pointer text-center">Resend OTP</p>
          </>
        )}

        {message && <p className="mt-4 text-center text-red-500 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default AuthModal;












