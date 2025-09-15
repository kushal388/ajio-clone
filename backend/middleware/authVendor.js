
//backend/middleware/authvendor.js
// import jwt from "jsonwebtoken";
// import Vendor from "../models/Vendor.js";

// export async function authVendor(req, res, next) {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const vendor = await Vendor.findById(decoded.id);
//     if (!vendor) return res.status(401).json({ message: "Invalid vendor" });

//     req.vendor = vendor;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// }




// **********************************************************


// backend/middleware/authVendor.js
import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

export async function authVendor(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ support both { id: ... } and { vendorId: ... }
    const vendorId = decoded.id || decoded.vendorId || decoded._id;
    if (!vendorId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(401).json({ message: "Vendor not found" });
    }

    req.vendor = vendor;
    next();
  } catch (err) {
    console.error("AuthVendor error:", err.message);
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
}
