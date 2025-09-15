// // backend/routes/orders.js
// import express from "express";
// import Order from "../models/Order.js";

// const router = express.Router();

// // GET /api/orders/:id
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id).lean();
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     return res.json(order);
//   } catch (err) {
//     console.error("GET /api/orders/:id error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;






// ***********************************************************


// backend/routes/orders.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET /api/orders/:id
// Returns order with items populated (product fields) and snapshot fields available
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // populate items.product to include some product fields if you still want live data
    const order = await Order.findById(id)
      .populate("items.product", "title image brand") // populate product ref if present
      .lean();

    if (!order) return res.status(404).json({ message: "Order not found" });

    // The order will contain snapshot fields on each item (title/image/brand) from creation.
    // If you prefer to show populated product fields when snapshot is missing, you can merge here,
    // but typically the snapshot fields are authoritative.

    return res.json(order);
  } catch (err) {
    console.error("GET /api/orders/:id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
