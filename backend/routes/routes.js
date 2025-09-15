// import { Router } from "express";
// import { User } from "../models/user.js";

// const router = Router();

// const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 60000);
// const BLOCK_MINUTES = Number(process.env.BLOCK_MINUTES || 30);

// const normalizePhone = (p) => (p?.startsWith("+91") ? p : `+91${p}`);
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Step 1: Check phone
// router.post("/check-phone", async (req, res) => {
//   try {
//     let { phone } = req.body;
//     phone = normalizePhone(phone);

//     const user = await User.findOne({ phone });

//     if (user) {
//       const otp = generateOtp();
//       user.otp = otp;
//       user.otpExpiry = Date.now() + OTP_TTL_MS;
//       await user.save();

//       console.log(`📲 Existing user login attempt: ${phone}`);
//       console.log(`✅ OTP for login: ${otp}`);

//       return res.json({ status: "existing", message: "OTP generated for login", otp });
//     } else {
//       console.log(`🆕 New user signup attempt: ${phone}`);
//       return res.json({ status: "new", message: "Phone not found, proceed signup" });
//     }
//   } catch (err) {
//     console.error("❌ check-phone error:", err.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Step 2: Signup
// router.post("/signup", async (req, res) => {
//   try {
//     let { phone, name, email, gender, role, inviteCode } = req.body;
//     phone = normalizePhone(phone);

//     const existing = await User.findOne({ phone });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const otp = generateOtp();

//     const user = new User({
//       phone, name, email, gender, role, inviteCode,
//       otp,
//       otpExpiry: Date.now() + OTP_TTL_MS,
//     });

//     await user.save();

//     console.log(`🆕 New user registered: ${name} (${phone}) as ${role}`);
//     console.log(`📧 Email: ${email} | Gender: ${gender} | InviteCode: ${inviteCode || "N/A"}`);
//     console.log(`✅ OTP for signup: ${otp}`);

//     res.json({ status: "otp_sent", message: "OTP generated for signup", otp });
//   } catch (err) {
//     if (err?.code === 11000) {
//       const keys = Object.keys(err.keyPattern || {});
//       return res.status(409).json({ message: `Duplicate value for: ${keys.join(", ")}` });
//     }
//     if (err?.name === "ValidationError") {
//       const details = Object.values(err.errors).map(e => e.message);
//       return res.status(400).json({ message: "Validation failed", details });
//     }
//     console.error("❌ signup error:", err.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Step 3: Verify OTP
// router.post("/verify-otp", async (req, res) => {
//   try {
//     let { phone, otp } = req.body;
//     phone = normalizePhone(phone);

//     console.log("📩 Verify request => Phone:", phone, "| OTP entered:", otp);

//     const user = await User.findOne({ phone });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     if (user.blockedUntil && user.blockedUntil > Date.now()) {
//       const remaining = Math.ceil((user.blockedUntil - Date.now()) / 60000);
//       console.log(`⛔ User blocked for ${remaining} minutes`);
//       return res.status(403).json({
//         message: `Too many wrong attempts. Try again in ${remaining} minutes.`,
//         blocked: true,
//       });
//     }

//     const valid = String(user.otp) === String(otp) && user.otpExpiry > Date.now();

//     if (valid) {
//       user.otp = null;
//       user.otpExpiry = null;
//       user.otpAttempts = 0;
//       user.blockedUntil = null;
//       await user.save();

//       console.log("🎉 OTP Verified successfully for", phone);
//       return res.json({
//         message: "Successfully verified & logged in",
//         user: {
//           name: user.name,
//           phone: user.phone,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     }

//     user.otpAttempts += 1;
//     if (user.otpAttempts >= 3) {
//       user.blockedUntil = Date.now() + BLOCK_MINUTES * 60 * 1000;
//       user.otpAttempts = 0;
//       console.log(`⛔ User ${phone} blocked for ${BLOCK_MINUTES} minutes`);
//     }
//     await user.save();

//     return res.status(400).json({ message: "Invalid or expired OTP", blocked: false });
//   } catch (err) {
//     console.error("❌ verify-otp error:", err.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;



// *************************************** USER DATA **************************************************

// import express from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js"; // default export expected
// import { authMiddleware } from "../middleware/auth.js"; // ensure this file exists and reads req.cookies.token

// const router = express.Router();

// const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 60000);
// const BLOCK_MINUTES = Number(process.env.BLOCK_MINUTES || 30);

// const normalizePhone = (p) => (p?.startsWith("+91") ? p : `+91${p}`);
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// /**
//  * POST /check-phone
//  * - If user exists, generate OTP and send status: "existing"
//  * - If not, return status: "new"
//  */
// router.post("/check-phone", async (req, res) => {
//   try {
//     let { phone } = req.body;
//     phone = normalizePhone(phone);

//     const user = await User.findOne({ phone });

//     if (user) {
//       const otp = generateOtp();
//       user.otp = otp;
//       user.otpExpiry = Date.now() + OTP_TTL_MS;
//       await user.save();

//       console.log(`📲 Existing user login attempt: ${phone}`);
//       console.log(`✅ OTP for login: ${otp}`);

//       return res.json({ status: "existing", message: "OTP generated for login", otp });
//     } else {
//       console.log(`🆕 New user signup attempt: ${phone}`);
//       return res.json({ status: "new", message: "Phone not found, proceed signup" });
//     }
//   } catch (err) {
//     console.error("❌ check-phone error:", err.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * POST /signup
//  * - Create user record and generate OTP (otp & otpExpiry saved)
//  */
// router.post("/signup", async (req, res) => {
//   try {
//     let { phone, name, email, gender, role, inviteCode } = req.body;
//     phone = normalizePhone(phone);

//     const existing = await User.findOne({ phone });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const otp = generateOtp();

//     const user = new User({
//       phone,
//       name,
//       email,
//       gender,
//       role,
//       inviteCode,
//       otp,
//       otpExpiry: Date.now() + OTP_TTL_MS,
//     });

//     await user.save();

//     console.log(`🆕 New user registered: ${name} (${phone}) as ${role}`);
//     console.log(`📧 Email: ${email} | Gender: ${gender} | InviteCode: ${inviteCode || "N/A"}`);
//     console.log(`✅ OTP for signup: ${otp}`);

//     res.json({ status: "otp_sent", message: "OTP generated for signup", otp });
//   } catch (err) {
//     if (err?.code === 11000) {
//       const keys = Object.keys(err.keyPattern || {});
//       return res.status(409).json({ message: `Duplicate value for: ${keys.join(", ")}` });
//     }
//     if (err?.name === "ValidationError") {
//       const details = Object.values(err.errors).map((e) => e.message);
//       return res.status(400).json({ message: "Validation failed", details });
//     }
//     console.error("❌ signup error:", err.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * POST /verify-otp
//  * - Validates OTP
//  * - If valid -> clear OTP fields, sign JWT, set httpOnly cookie, return user info
//  * - If invalid -> increment attempt counter; block on too many tries
//  */

// router.post("/verify-otp", async (req, res) => {
//   try {
//     let { phone, otp } = req.body;
//     phone = normalizePhone(phone);

//     console.log("📩 Verify request => Phone:", phone, "| OTP entered:", otp);

//     const user = await User.findOne({ phone });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     if (user.blockedUntil && user.blockedUntil > Date.now()) {
//       const remaining = Math.ceil((user.blockedUntil - Date.now()) / 60000);
//       console.log(`⛔ User blocked for ${remaining} minutes`);
//       return res.status(403).json({
//         message: `Too many wrong attempts. Try again in ${remaining} minutes.`,
//         blocked: true,
//       });
//     }

//     const valid = String(user.otp) === String(otp) && user.otpExpiry > Date.now();

//     if (!valid) {
//       user.otpAttempts = (user.otpAttempts || 0) + 1;
//       if (user.otpAttempts >= 3) {
//         user.blockedUntil = Date.now() + BLOCK_MINUTES * 60 * 1000;
//         user.otpAttempts = 0;
//         console.log(`⛔ User ${phone} blocked for ${BLOCK_MINUTES} minutes`);
//       }
//       await user.save();
//       return res.status(400).json({ message: "Invalid or expired OTP", blocked: false });
//     }

//     // Valid OTP: clear otp fields
//     user.otp = null;
//     user.otpExpiry = null;
//     user.otpAttempts = 0;
//     user.blockedUntil = null;
//     await user.save();

//     // Sign JWT
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Set cookie (httpOnly). In development secure should be false.
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     console.log("🎉 OTP Verified successfully for", phone);

//     return res.json({
//       message: "Successfully verified & logged in",
//       user: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("❌ verify-otp error:", err.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });



// /**
//  * GET /me
//  * - returns basic user info if logged in (uses authMiddleware)
//  */
// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("name email phone role");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("❌ /me error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;


// ******************** user data last *****************************************************


// backend/routes/auth.js
// import express from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();

// const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 60000);
// const BLOCK_MINUTES = Number(process.env.BLOCK_MINUTES || 30);

// const normalizePhone = (p) => (p?.startsWith("+91") ? p : `+91${p || ""}`);
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// /**
//  * POST /auth/check-phone
//  */
// router.post("/check-phone", async (req, res) => {
//   try {
//     let { phone } = req.body;
//     phone = normalizePhone(phone);

//     const user = await User.findOne({ phone });

//     if (user) {
//       const otp = generateOtp();
//       user.otp = otp;
//       user.otpExpiry = Date.now() + OTP_TTL_MS;
//       await user.save();

//       console.log(`📲 Existing user login attempt: ${phone} OTP:${otp}`);
//       return res.json({ status: "existing", message: "OTP generated for login", otp });
//     } else {
//       console.log(`🆕 New user signup attempt: ${phone}`);
//       return res.json({ status: "new", message: "Phone not found, proceed signup" });
//     }
//   } catch (err) {
//     console.error("❌ check-phone error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * POST /auth/signup
//  */
// router.post("/signup", async (req, res) => {
//   try {
//     let { phone, name, email, gender, role, inviteCode } = req.body;
//     phone = normalizePhone(phone);

//     const existing = await User.findOne({ phone });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const otp = generateOtp();

//     const user = new User({
//       phone,
//       name,
//       email,
//       gender,
//       role,
//       inviteCode,
//       otp,
//       otpExpiry: Date.now() + OTP_TTL_MS,
//     });

//     await user.save();

//     console.log(`🆕 New user registered: ${name} (${phone}) as ${role} OTP:${otp}`);
//     res.json({ status: "otp_sent", message: "OTP generated for signup", otp });
//   } catch (err) {
//     console.error("❌ signup error:", err);
//     if (err?.code === 11000) {
//       const keys = Object.keys(err.keyPattern || {});
//       return res.status(409).json({ message: `Duplicate value for: ${keys.join(", ")}` });
//     }
//     if (err?.name === "ValidationError") {
//       const details = Object.values(err.errors).map((e) => e.message);
//       return res.status(400).json({ message: "Validation failed", details });
//     }
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * POST /auth/verify-otp
//  * Validates OTP, signs JWT, sets cookie with env-aware options
//  */
// router.post("/verify-otp", async (req, res) => {
//   try {
//     let { phone, otp } = req.body;
//     phone = normalizePhone(phone);

//     console.log("📩 Verify request => Phone:", phone, "OTP:", otp);

//     const user = await User.findOne({ phone });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     if (user.blockedUntil && user.blockedUntil > Date.now()) {
//       const remaining = Math.ceil((user.blockedUntil - Date.now()) / 60000);
//       return res.status(403).json({
//         message: `Too many wrong attempts. Try again in ${remaining} minutes.`,
//         blocked: true,
//       });
//     }

//     const valid = String(user.otp) === String(otp) && user.otpExpiry > Date.now();

//     if (!valid) {
//       user.otpAttempts = (user.otpAttempts || 0) + 1;
//       if (user.otpAttempts >= 3) {
//         user.blockedUntil = Date.now() + BLOCK_MINUTES * 60 * 1000;
//         user.otpAttempts = 0;
//       }
//       await user.save();
//       return res.status(400).json({ message: "Invalid or expired OTP", blocked: false });
//     }

//     // Valid OTP — clear fields and save
//     user.otp = null;
//     user.otpExpiry = null;
//     user.otpAttempts = 0;
//     user.blockedUntil = null;
//     await user.save();

//     // Create JWT
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Environment-aware cookie options
//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // true in prod (HTTPS)
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       path: "/",
//     };

//     res.cookie("token", token, cookieOptions);

//     console.log(">>> verify-otp will send Set-Cookie:", res.getHeader("Set-Cookie"));

//     console.log("🎉 OTP Verified successfully for", phone);

//     return res.json({
//       message: "Successfully verified & logged in",
//       user: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } 

//      catch (err) {
//     // print full stack to server console so we can diagnose
//     console.error("❌ verify-otp error:", err && err.stack ? err.stack : err);
//     res.status(500).json({ message: "Internal server error" });
//   }

//   // catch (err) {
//   //   console.error("❌ verify-otp error:", err);
//   //   res.status(500).json({ message: "Internal server error" });
//   // }
// });

// /**
//  * POST /auth/logout
//  * clears cookie
//  */
// router.post("/logout", (_req, res) => {
//   res.clearCookie("token", { path: "/" });
//   res.json({ ok: true });
// });

// /**
//  * GET /auth/me
//  * returns user if logged in (authMiddleware attaches req.user)
//  */
// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("name email phone role");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("❌ /me error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;



// **************************** USER DATA LAST  signout ***********************************************


// backend/routes/auth.js
// import express from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();

// const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 60000);
// const BLOCK_MINUTES = Number(process.env.BLOCK_MINUTES || 30);

// const normalizePhone = (p) => (p?.startsWith("+91") ? p : `+91${p || ""}`);
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Helper that returns the cookie options used for both set & clear.
// // Keep this function in one place so set & clear use identical attributes.
// function getCookieOptions() {
//   return {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // only secure on HTTPS in prod
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     path: "/", // important to match when clearing
//   };
// }

// /**
//  * POST /auth/check-phone
//  */
// router.post("/check-phone", async (req, res) => {
//   try {
//     let { phone } = req.body;
//     phone = normalizePhone(phone);

//     const user = await User.findOne({ phone });

//     if (user) {
//       const otp = generateOtp();
//       user.otp = otp;
//       user.otpExpiry = Date.now() + OTP_TTL_MS;
//       await user.save();

//       console.log(`📲 Existing user login attempt: ${phone} OTP:${otp}`);
//       return res.json({ status: "existing", message: "OTP generated for login", otp });
//     } else {
//       console.log(`🆕 New user signup attempt: ${phone}`);
//       return res.json({ status: "new", message: "Phone not found, proceed signup" });
//     }
//   } catch (err) {
//     console.error("❌ check-phone error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * POST /auth/signup
//  */
// router.post("/signup", async (req, res) => {
//   try {
//     let { phone, name, email, gender, role, inviteCode } = req.body;
//     phone = normalizePhone(phone);

//     const existing = await User.findOne({ phone });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const otp = generateOtp();

//     const user = new User({
//       phone,
//       name,
//       email,
//       gender,
//       role,
//       inviteCode,
//       otp,
//       otpExpiry: Date.now() + OTP_TTL_MS,
//     });

//     await user.save();

//     console.log(`🆕 New user registered: ${name} (${phone}) as ${role} OTP:${otp}`);
//     res.json({ status: "otp_sent", message: "OTP generated for signup", otp });
//   } catch (err) {
//     console.error("❌ signup error:", err);
//     if (err?.code === 11000) {
//       const keys = Object.keys(err.keyPattern || {});
//       return res.status(409).json({ message: `Duplicate value for: ${keys.join(", ")}` });
//     }
//     if (err?.name === "ValidationError") {
//       const details = Object.values(err.errors).map((e) => e.message);
//       return res.status(400).json({ message: "Validation failed", details });
//     }
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * POST /auth/verify-otp
//  * Validates OTP, signs JWT, sets cookie with env-aware options
//  */
// router.post("/verify-otp", async (req, res) => {
//   try {
//     let { phone, otp } = req.body;
//     phone = normalizePhone(phone);

//     console.log("📩 Verify request => Phone:", phone, "OTP:", otp);

//     const user = await User.findOne({ phone });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     if (user.blockedUntil && user.blockedUntil > Date.now()) {
//       const remaining = Math.ceil((user.blockedUntil - Date.now()) / 60000);
//       return res.status(403).json({
//         message: `Too many wrong attempts. Try again in ${remaining} minutes.`,
//         blocked: true,
//       });
//     }

//     const valid = String(user.otp) === String(otp) && user.otpExpiry > Date.now();

//     if (!valid) {
//       user.otpAttempts = (user.otpAttempts || 0) + 1;
//       if (user.otpAttempts >= 3) {
//         user.blockedUntil = Date.now() + BLOCK_MINUTES * 60 * 1000;
//         user.otpAttempts = 0;
//       }
//       await user.save();
//       return res.status(400).json({ message: "Invalid or expired OTP", blocked: false });
//     }

//     // Valid OTP — clear fields and save
//     user.otp = null;
//     user.otpExpiry = null;
//     user.otpAttempts = 0;
//     user.blockedUntil = null;
//     await user.save();

//     // Create JWT
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Set cookie using centralized options
//     const cookieOptions = getCookieOptions();
//     res.cookie("token", token, cookieOptions);

//     // debug log for server-side verification (optional)
//     console.log(">>> verify-otp Set-Cookie header:", res.getHeader("Set-Cookie"));

//     console.log("🎉 OTP Verified successfully for", phone);

//     return res.json({
//       message: "Successfully verified & logged in",
//       user: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     // print full stack to server console so we can diagnose
//     console.error("❌ verify-otp error:", err && err.stack ? err.stack : err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * POST /auth/logout
//  * clears cookie using the same options used when setting it
//  */
// router.post("/logout", (_req, res) => {
//   const cookieOptions = getCookieOptions();

//   // clear cookie using same options
//   res.clearCookie("token", cookieOptions);

//   // extra safety: set empty cookie with maxAge 0 (immediate expiry)
//   res.cookie("token", "", { ...cookieOptions, maxAge: 0 });

//   res.json({ ok: true });
// });

// /**
//  * GET /auth/me
//  * returns user if logged in (authMiddleware attaches req.user)
//  */
// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("name email phone role");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("❌ /me error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;



// *****************************  *******************************************************

// backend/routes/routes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 60000);
const BLOCK_MINUTES = Number(process.env.BLOCK_MINUTES || 30);

const normalizePhone = (p) => (p?.startsWith("+91") ? p : `+91${p || ""}`);
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// function getCookieOptions() {
//   return {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     path: "/",
//   };
// }

/* check-phone */
router.post("/check-phone", async (req, res) => {
  try {
    let { phone } = req.body;
    phone = normalizePhone(phone);
    const user = await User.findOne({ phone });

    if (user) {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpiry = Date.now() + OTP_TTL_MS;
      await user.save();
      console.log(`📲 Existing user login attempt: ${phone} OTP:${otp}`);
      return res.json({ status: "existing", message: "OTP generated for login", otp });
    } else {
      console.log(`🆕 New user signup attempt: ${phone}`);
      return res.json({ status: "new", message: "Phone not found, proceed signup" });
    }
  } catch (err) {
    console.error("❌ check-phone error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* signup */
router.post("/signup", async (req, res) => {
  try {
    let { phone, name, email, gender, role, inviteCode } = req.body;
    phone = normalizePhone(phone);
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const otp = generateOtp();
    const user = new User({
      phone,
      name,
      email,
      gender,
      role,
      inviteCode,
      otp,
      otpExpiry: Date.now() + OTP_TTL_MS,
    });
    await user.save();
    console.log(`🆕 New user registered: ${name} (${phone}) as ${role} OTP:${otp}`);
    res.json({ status: "otp_sent", message: "OTP generated for signup", otp });
  } catch (err) {
    console.error("❌ signup error:", err);
    if (err?.code === 11000) {
      const keys = Object.keys(err.keyPattern || {});
      return res.status(409).json({ message: `Duplicate value for: ${keys.join(", ")}` });
    }
    if (err?.name === "ValidationError") {
      const details = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", details });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

/* verify-otp */
router.post("/verify-otp", async (req, res) => {
  try {
    let { phone, otp } = req.body;
    phone = normalizePhone(phone);
    console.log("📩 Verify request => Phone:", phone, "OTP:", otp);

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.blockedUntil && user.blockedUntil > Date.now()) {
      const remaining = Math.ceil((user.blockedUntil - Date.now()) / 60000);
      return res.status(403).json({
        message: `Too many wrong attempts. Try again in ${remaining} minutes.`,
        blocked: true,
      });
    }

    const valid = String(user.otp) === String(otp) && user.otpExpiry > Date.now();
    if (!valid) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      if (user.otpAttempts >= 3) {
        user.blockedUntil = Date.now() + BLOCK_MINUTES * 60 * 1000;
        user.otpAttempts = 0;
      }
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP", blocked: false });
    }

    // Valid OTP — clear fields
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    user.blockedUntil = null;
    await user.save();

    // Create JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    // const cookieOptions = getCookieOptions();
    
    // res.cookie("token", token, cookieOptions);

    // for development (local)
    const cookieOptions = {
      httpOnly: true,
      secure: false,           // must be false on http://localhost
      sameSite: "lax",         // lax works in dev + proxy
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    };
    res.cookie("token", token, cookieOptions);




    console.log(">>> verify-otp Set-Cookie header:", res.getHeader("Set-Cookie"));
    console.log("🎉 OTP Verified successfully for", phone);

    return res.json({
      message: "Successfully verified & logged in",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ verify-otp error:", err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* logout */
router.post("/logout", (_req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };
  res.clearCookie("token", cookieOptions);
  // also set empty cookie for safety
  res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
  res.json({ ok: true });
});

/* me */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email phone role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ /me error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
