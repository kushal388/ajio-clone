//backend.
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Vendor from "../models/Vendor.js";

// const router = express.Router();

// // POST /api/vendor/login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const vendor = await Vendor.findOne({ email });
//   if (!vendor) return res.status(400).json({ message: "Invalid credentials" });

//   const match = await bcrypt.compare(password, vendor.passwordHash);
//   if (!match) return res.status(400).json({ message: "Invalid credentials" });

//   const token = jwt.sign({ id: vendor._id, role: "vendor" }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   res.json({
//     token,
//     vendor: { id: vendor._id, name: vendor.name, status: vendor.status },
//   });
// });

// export default router;


// ********************************************************


// // routes/vendorAuth.js (or wherever)
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Vendor from "../models/Vendor.js";

// const router = express.Router();

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: "Invalid credentials" });

//     const vendor = await Vendor.findOne({ email });
//     if (!vendor) return res.status(400).json({ message: "Invalid credentials" });

//     const match = await bcrypt.compare(password, vendor.passwordHash);
//     if (!match) return res.status(400).json({ message: "Invalid credentials" });

//     // Password matches — now decide based on vendor status
//     const vendorPayload = { id: vendor._id, name: vendor.name, status: vendor.status };

//     // If approved/active -> issue token
//     if (vendor.status === "approved" || vendor.status === "active") {
//       const token = jwt.sign({ id: vendor._id, role: "vendor" }, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//       });

//       return res.json({
//         token,
//         vendor: vendorPayload,
//       });
//     }

//     // If pending or rejected -> return 200 with vendor info but no token
//     // Frontend can show appropriate message ("pending" / "rejected")
//     return res.status(200).json({
//       vendor: vendorPayload,
//       message: vendor.status === "pending" ? "Account pending approval" : "Account rejected",
//     });
//   } catch (err) {
//     console.error("Vendor login error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;


// *********************************************************************************************

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";
import VendorRequest from "../models/VendorRequest.js";

const router = express.Router();

// Helper: strip passwordHash
function sanitize(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete obj.passwordHash;
  return obj;
}

// POST /api/vendor/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const normEmail = email.toLowerCase().trim();

    // 1) First try to login from approved Vendor collection
    const vendor = await Vendor.findOne({ email: normEmail });
    if (vendor) {
      const match = await bcrypt.compare(password, vendor.passwordHash);
      if (!match) return res.status(401).json({ message: "Invalid credentials" });

      // vendor schema uses status = active/suspended
      if (vendor.status === "active") {
        const token = jwt.sign(
          { id: vendor._id, role: "vendor" },
          process.env.JWT_SECRET || "changeme",
          { expiresIn: "7d" }
        );
        return res.json({ token, vendor: sanitize(vendor) });
      }
      if (vendor.status === "suspended") {
        return res.status(403).json({ message: "Account suspended by admin" });
      }
    }

    // 2) If not found in Vendor, check VendorRequest (pending or rejected)
    const reqRec = await VendorRequest.findOne({ email: normEmail });
    if (reqRec) {
      const match = await bcrypt.compare(password, reqRec.passwordHash);
      if (!match) return res.status(401).json({ message: "Invalid credentials" });

      const safeReq = sanitize(reqRec);

      if (reqRec.status === "pending") {
        return res.json({ vendor: { ...safeReq, status: "pending" }, message: "Account pending approval" });
      }
      if (reqRec.status === "rejected") {
        return res.json({
          vendor: { ...safeReq, status: "rejected" },
          message: reqRec.rejectionReason || "Account rejected by admin",
        });
      }
    }

    // 3) Not found anywhere
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Vendor login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
