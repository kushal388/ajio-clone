// import express from "express";
// import VendorRequest from "../models/VendorRequest.js";
// import Vendor from "../models/Vendor.js";

// const router = express.Router();

// // GET all vendor requests
// router.get("/vendor-requests", async (req, res) => {
//   const requests = await VendorRequest.find().sort({ createdAt: -1 });
//   res.json(requests);
// });

// // Approve request -> create Vendor
// router.post("/vendor-requests/:id/approve", async (req, res) => {
//   const request = await VendorRequest.findById(req.params.id);
//   if (!request) return res.status(404).json({ message: "Not found" });

//   if (request.status !== "pending")
//     return res.status(400).json({ message: "Already processed" });

//   const vendor = await Vendor.create({
//     name: request.name,
//     age: request.age,
//     mobile: request.mobile,
//     email: request.email,
//     passwordHash: request.passwordHash,
//     gstin: request.gstin,
//   });

//   request.status = "approved";
//   await request.save();

//   res.json({ ok: true, vendorId: vendor._id });
// });

// // Reject request
// router.post("/vendor-requests/:id/reject", async (req, res) => {
//   const request = await VendorRequest.findById(req.params.id);
//   if (!request) return res.status(404).json({ message: "Not found" });

//   request.status = "rejected";
//   request.rejectionReason = req.body.reason || "Not specified";
//   await request.save();

//   res.json({ ok: true, message: "Rejected" });
// });

// export default router;



// *****************************

// backend/routes/adminVendor.js (protect with authAdmin)


// backend/routes/adminVendor.js  
import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import VendorRequest from "../models/VendorRequest.js";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// All routes below require admin auth
router.use(authAdmin);

// GET /api/admin/vendor-requests
router.get("/vendor-requests", async (req, res) => {
  try {
    const list = await VendorRequest.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/vendor-requests/:id
router.get("/vendor-requests/:id", async (req, res) => {
  try {
    const r = await VendorRequest.findById(req.params.id);
    if (!r) return res.status(404).json({ message: "Not found" });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/vendor-requests/:id/approve
router.post("/vendor-requests/:id/approve", async (req, res) => {
  try {
    const r = await VendorRequest.findById(req.params.id);
    if (!r) return res.status(404).json({ message: "Not found" });
    if (r.status !== "pending") return res.status(400).json({ message: "Already processed" });

    // Create Vendor account from request
    const vendor = await Vendor.create({
      name: r.name,
      age: r.age,
      mobile: r.mobile,
      email: r.email,
      passwordHash: r.passwordHash, // as saved by VendorRequest
      gstin: r.gstin,
      status: "active",
    });

    r.status = "approved";
    await r.save();

    // TODO: send email/notification to vendor (out of scope)
    res.json({ ok: true, vendorId: vendor._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/vendor-requests/:id/reject
router.post("/vendor-requests/:id/reject", async (req, res) => {
  try {
    const r = await VendorRequest.findById(req.params.id);
    if (!r) return res.status(404).json({ message: "Not found" });
    if (r.status !== "pending") return res.status(400).json({ message: "Already processed" });

    r.status = "rejected";
    r.rejectionReason = req.body.reason || "Rejected by admin";
    await r.save();

    // TODO: notify vendor
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
