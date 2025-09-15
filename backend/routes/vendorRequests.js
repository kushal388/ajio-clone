import express from "express";
import bcrypt from "bcryptjs";
import VendorRequest from "../models/VendorRequest.js";

const router = express.Router();

// POST /api/vendor-requests (public)
router.post("/", async (req, res) => {
  try {
    const { name, age, mobile, email, password, gstin } = req.body;

    const existing = await VendorRequest.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);

    const request = await VendorRequest.create({
      name,
      age,
      mobile,
      email,
      passwordHash,
      gstin,
    });

    // res.status(201).json({ ok: true, message: "Request submitted", requestId: request._id });
    res.status(201).json({ ok: true, message: "Request submitted. Admin will review.", requestId: request._id });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
