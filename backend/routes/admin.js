// backend/routes/admin.js
import express from "express";
import mongoose from "mongoose";
import authAdmin  from "../middleware/authAdmin.js";
import Order from "../models/Order.js";

const router = express.Router();

const ALL_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

/**
 * GET /api/admin/orders
 */
router.get("/orders", authAdmin, async (req, res) => {
  try {
    const { search = "", sort = "date", dir = "desc" } = req.query;

    let orders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: dir === "asc" ? 1 : -1 })
      .lean();

    const s = (search || "").trim().toLowerCase();
    if (s) {
      orders = orders.filter((o) => {
        const orderIdMatch = String(o._id || "").toLowerCase().includes(s);
        const customerName = (o.customer && o.customer.name) || "";
        const customerMatch = customerName.toLowerCase().includes(s);
        return orderIdMatch || customerMatch;
      });
    }

    if (sort === "customer") {
      orders.sort((a, b) => {
        const an = (a.customer && a.customer.name) || "";
        const bn = (b.customer && b.customer.name) || "";
        return dir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
      });
    } else if (sort === "status") {
      orders.sort((a, b) => {
        const as = (a.items[0] && a.items[0].status) || "";
        const bs = (b.items[0] && b.items[0].status) || "";
        return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
      });
    }

    return res.json({ orders });
  } catch (err) {
    console.error("GET /admin/orders error:", err);
    return res.status(500).json({ message: "Error fetching admin orders", error: err.message });
  }
});

/**
 * PATCH /api/admin/orders/:orderId/items/:itemId/status
 */
router.patch("/orders/:orderId/items/:itemId/status", authAdmin, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;
    const adminId = req.admin._id;

    if (!status) return res.status(400).json({ message: "status required" });
    if (!ALL_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findOne({ _id: orderId, "items._id": itemId });
    if (!order) return res.status(404).json({ message: "Order or item not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // ✅ Admin can override status directly
    item.status = status;
    item.history = item.history || [];
    item.history.push({
      status,
      changedAt: new Date(),
      changedBy: { id: adminId, role: "admin" },
    });

    await order.save();
    await order.populate("customer", "name email");

    return res.json({ message: "Item status updated", order });
  } catch (err) {
    console.error("PATCH admin item status error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
