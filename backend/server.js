

// **************** TO CHECK Paymnet ***************************************


// backend/server.js
// import dotenv from "dotenv";
// dotenv.config();

// console.log("ENV debug:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);

// // console.log("ENV check:", {
// //   RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
// //   RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
// //   RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
// // });


// // dotenv.config({ path: path.resolve("./.env") });

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
// import { connectDB } from "./config/db.js";

// // routers
// import authRouter from "./routes/routes.js";       // auth
// import productsRoute from "./routes/products.js";  // your existing product route
// import searchRouter from "./routes/search.js";
// import cartRoutes from "./routes/cart.js";
// import wishlistRoutes from "./routes/wishlist.js";

// // admin
// import adminAuthRoutes from "./routes/adminAuth.js";
// import adminVendorRoutes from "./routes/adminVendor.js";

// // admin and vendor
// import vendorRequestRoutes from "./routes/vendorRequests.js";
// import vendorAuthRoutes from "./routes/vendorAuth.js";

// // Razorpay webhook route
// import webhookRazorpayRouter from "./routes/webhookRazorpay.js";
// import checkoutRouter from "./routes/checkout.js";

// const app = express();

// app.use(cookieParser());

// app.use(
//   cors({
//     origin: true, // allow all origins in dev (adjust for prod)
//     credentials: true,
//   })
// );

// // Important: use JSON for all routes *except* webhook
// app.use((req, res, next) => {
//   if (req.originalUrl === "/webhook/razorpay") {
//     return next();
//   }
//   return express.json()(req, res, next);
// });

// // --------------------- ROUTES ---------------------

// // User-facing routes
// app.use("/auth", authRouter);
// app.use("/api/products", productsRoute);
// app.use("/api/search", searchRouter);
// app.use("/api/cart", cartRoutes);
// app.use("/api/wishlist", wishlistRoutes);

// // Admin routes
// app.use("/api/admin", adminAuthRoutes);    // /api/admin/login
// app.use("/api/admin", adminVendorRoutes);  // protect endpoints under /api/admin/*

// // Vendor routes
// app.use("/api/vendor-requests", vendorRequestRoutes);
// app.use("/api/vendor", vendorAuthRoutes);

// // Razorpay webhook (raw body required)
// app.use(
//   "/webhook/razorpay",
//   bodyParser.raw({ type: "application/json" }),
//   webhookRazorpayRouter
// );


// app.use("/api/checkout", checkoutRouter);

// // Health check
// app.get("/health", (_req, res) => res.json({ ok: true }));

// // --------------------- START SERVER ---------------------
// const PORT = process.env.PORT || 5000;
// await connectDB();
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));




// {Payment problem} ******************************************



// backend/server.js
// import dotenv from "dotenv";
// dotenv.config(); // load .env once, at entry point

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
// import { connectDB } from "./config/db.js";

// // routers
// import authRouter from "./routes/routes.js";       
// import productsRoute from "./routes/products.js";  
// import searchRouter from "./routes/search.js";
// import cartRoutes from "./routes/cart.js";
// import wishlistRoutes from "./routes/wishlist.js";

// // admin
// import adminAuthRoutes from "./routes/adminAuth.js";
// import adminVendorRoutes from "./routes/adminVendor.js";

// // vendor
// import vendorRequestRoutes from "./routes/vendorRequests.js";
// import vendorAuthRoutes from "./routes/vendorAuth.js";

// // Razorpay
// import webhookRazorpayRouter from "./routes/webhookRazorpay.js";
// import checkoutRouter from "./routes/checkout.js";


// // order
// import ordersRouter from "./routes/orders.js";


// //vendor
// import vendorRoutes from "./routes/vendor.js"; 


// //admin
// import adminRoutes from "./routes/admin.js";



// import path from "path";
// import { fileURLToPath } from "url";

// const app = express();

// // If you’re using ES modules, __dirname is not available by defaul
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



// // Debug environment variables
// console.log("server.js: RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
// console.log("server.js: RAZORPAY_KEY_SECRET =", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing");

// app.use(cookieParser());

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

// // JSON except for webhook
// app.use((req, res, next) => {
//   if (req.originalUrl === "/webhook/razorpay") {
//     return next();
//   }
//   return express.json()(req, res, next);
// });

// // -------- Routes --------
// app.use("/auth", authRouter);
// app.use("/api/products", productsRoute);
// app.use("/api/search", searchRouter);
// app.use("/api/cart", cartRoutes);
// app.use("/api/wishlist", wishlistRoutes);

// app.use("/api/admin", adminAuthRoutes);
// app.use("/api/admin", adminVendorRoutes);

// app.use("/api/vendor-requests", vendorRequestRoutes);
// app.use("/api/vendor", vendorAuthRoutes);

// app.use("/webhook/razorpay", bodyParser.raw({ type: "application/json" }), webhookRazorpayRouter);
// app.use("/api/checkout", checkoutRouter);

// app.get("/health", (_req, res) => res.json({ ok: true }));


// app.use("/api/orders", ordersRouter);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// app.use("/api/vendor", vendorRoutes);

// // -------- Start --------
// const PORT = process.env.PORT || 5000;
// await connectDB();
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



// ******************************************************************************


// backend/server.js
import dotenv from "dotenv";
dotenv.config(); // load .env once, at entry point

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";

import path from "path";
import { fileURLToPath } from "url";

// -------- Routers --------

// core user
import authRouter from "./routes/routes.js";       
import productsRoute from "./routes/products.js";  
import searchRouter from "./routes/search.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";

// admin
import adminAuthRoutes from "./routes/adminAuth.js";
import adminVendorRoutes from "./routes/adminVendor.js";
import adminRoutes from "./routes/admin.js";   // ✅ orders + status mgmt

import adminProductsRoutes from "./routes/adminProducts.js";

// vendor
import vendorRequestRoutes from "./routes/vendorRequests.js";
import vendorAuthRoutes from "./routes/vendorAuth.js";
import vendorRoutes from "./routes/vendor.js";  // ✅ vendor orders + products

// Razorpay
import webhookRazorpayRouter from "./routes/webhookRazorpay.js";
import checkoutRouter from "./routes/checkout.js";

// orders (global customer orders)
import ordersRouter from "./routes/orders.js";

const app = express();

// If you’re using ES modules, __dirname is not available by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug environment variables
console.log("server.js: RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log("server.js: RAZORPAY_KEY_SECRET =", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing");

app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// JSON except for webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook/razorpay") {
    return next();
  }
  return express.json()(req, res, next);
});

// -------- Routes --------

// customer-facing
app.use("/auth", authRouter);
app.use("/api/products", productsRoute);
app.use("/api/search", searchRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// admin-facing
app.use("/api/admin", adminAuthRoutes);     // login
app.use("/api/admin", adminVendorRoutes);  // vendor management
app.use("/api/admin", adminRoutes);        // ✅ orders & item status

// vendor-facing
app.use("/api/vendor-requests", vendorRequestRoutes);
app.use("/api/vendor", vendorAuthRoutes);
app.use("/api/vendor", vendorRoutes);

// Razorpay
app.use("/webhook/razorpay", bodyParser.raw({ type: "application/json" }), webhookRazorpayRouter);
app.use("/api/checkout", checkoutRouter);

// orders (for customers)
app.use("/api/orders", ordersRouter);

// uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/admin/products", adminProductsRoutes);

// health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// -------- Start --------
const PORT = process.env.PORT || 5000;
await connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
