// backend/routes/adminAuth.js
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/admin/login
// Uses ADMIN_EMAIL and ADMIN_PASSWORD in process.env
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return res.status(500).json({ message: "Admin credentials not configured (check env)" });
    }

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, admin: { email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
