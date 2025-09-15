


// ****************************************************************************************************************

// backend/routes/cart.js
// import express from "express";
// import mongoose from "mongoose";
// import User from "../models/user.js";
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();

// // GET cart (populate product)
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("cart.productId");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user.cart);
//   } catch (err) {
//     console.error("GET /api/cart error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Add to cart
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { productId, quantity = 1, size } = req.body;
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // if productId is an ObjectId string or Mongo _id, treat appropriately
//     // try to find existing same productId & size
//     const existing = user.cart.find((c) => String(c.productId) === String(productId) && (c.size ?? "") === (size ?? ""));
//     if (existing) {
//       existing.quantity = Number(existing.quantity || 0) + Number(quantity || 1);
//     } else {
//       user.cart.push({ productId, quantity: Number(quantity), size });
//     }
//     await user.save();
//     const populated = await User.findById(req.user.id).populate("cart.productId");
//     res.json(populated.cart);
//   } catch (err) {
//     console.error("POST /api/cart error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // DELETE: remove by cart-entry _id OR by productId (optionally size)
// // DELETE /api/cart/:productIdOrEntryId
// router.delete("/:productIdOrEntryId", authMiddleware, async (req, res) => {
//   try {
//     const { productIdOrEntryId } = req.params;
//     const { size } = req.query;
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // If this looks like an ObjectId and matches a subdoc _id -> remove that entry
//     if (mongoose.Types.ObjectId.isValid(productIdOrEntryId)) {
//       const idx = user.cart.findIndex((c) => String(c._id) === String(productIdOrEntryId));
//       if (idx > -1) {
//         user.cart.splice(idx, 1);
//         await user.save();
//         const populated = await User.findById(req.user.id).populate("cart.productId");
//         return res.json(populated.cart);
//       }
//       // Not found as entry id — fall through to productId matching
//     }

//     // Fallback: remove by productId (SKU or ObjectId) and optional size
//     user.cart = user.cart.filter((c) => {
//       const pidMatch = String(c.productId) !== String(productIdOrEntryId);
//       const sizeMatch = typeof size === "undefined" ? true : (c.size ?? "") !== (size ?? "");
//       return pidMatch || !sizeMatch; // keep item only if not matching both
//     });

//     await user.save();
//     const populated = await User.findById(req.user.id).populate("cart.productId");
//     res.json(populated.cart);
//   } catch (err) {
//     console.error("DELETE /api/cart error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // PUT: update quantity and/or size
// // Accepts { cartEntryId, quantity, size } (preferred) OR { productId, quantity, size } fallback
// router.put("/", authMiddleware, async (req, res) => {
//   try {
//     const { cartEntryId, productId, quantity, size } = req.body;
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Preferred: update by cart subdocument id
//     if (cartEntryId && mongoose.Types.ObjectId.isValid(cartEntryId)) {
//       const idx = user.cart.findIndex((c) => String(c._id) === String(cartEntryId));
//       if (idx === -1) return res.status(404).json({ message: "Cart entry not found" });
//       if (typeof quantity !== "undefined") user.cart[idx].quantity = Number(quantity);
//       if (typeof size !== "undefined") user.cart[idx].size = size;
//       await user.save();
//       const populated = await User.findById(req.user.id).populate("cart.productId");
//       return res.json(populated.cart);
//     }

//     // Fallback: update by productId (and optional size match)
//     if (productId) {
//       const found = user.cart.find((c) => String(c.productId) === String(productId) && (typeof size === "undefined" || (c.size ?? "") === (size ?? "")));
//       if (!found) return res.status(404).json({ message: "Cart entry not found (productId)" });
//       if (typeof quantity !== "undefined") found.quantity = Number(quantity);
//       if (typeof size !== "undefined") found.size = size;
//       await user.save();
//       const populated = await User.findById(req.user.id).populate("cart.productId");
//       return res.json(populated.cart);
//     }

//     return res.status(400).json({ message: "Missing cartEntryId or productId" });
//   } catch (err) {
//     console.error("PUT /api/cart error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;



// ******************************************************************
// backend/routes/cart.js
import express from "express";
import mongoose from "mongoose";
import User from "../models/user.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET cart (populate product)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart);
  } catch (err) {
    console.error("GET /api/cart error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// NEW: DELETE /api/cart  -> clear all items for current user
// Make sure this route is declared BEFORE the paramized delete route below
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Clear the cart array and save
    user.cart = [];
    await user.save();

    // Return the (now empty) populated cart for consistency with other endpoints
    const populated = await User.findById(req.user.id).populate("cart.productId");
    res.json(populated.cart);
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add to cart
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // try to find existing same productId & size
    const existing = user.cart.find((c) => String(c.productId) === String(productId) && (c.size ?? "") === (size ?? ""));
    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + Number(quantity || 1);
    } else {
      user.cart.push({ productId, quantity: Number(quantity), size });
    }
    await user.save();
    const populated = await User.findById(req.user.id).populate("cart.productId");
    res.json(populated.cart);
  } catch (err) {
    console.error("POST /api/cart error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: remove by cart-entry _id OR by productId (optionally size)
// DELETE /api/cart/:productIdOrEntryId
router.delete("/:productIdOrEntryId", authMiddleware, async (req, res) => {
  try {
    const { productIdOrEntryId } = req.params;
    const { size } = req.query;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If this looks like an ObjectId and matches a subdoc _id -> remove that entry
    if (mongoose.Types.ObjectId.isValid(productIdOrEntryId)) {
      const idx = user.cart.findIndex((c) => String(c._id) === String(productIdOrEntryId));
      if (idx > -1) {
        user.cart.splice(idx, 1);
        await user.save();
        const populated = await User.findById(req.user.id).populate("cart.productId");
        return res.json(populated.cart);
      }
      // Not found as entry id — fall through to productId matching
    }

    // Fallback: remove by productId (SKU or ObjectId) and optional size
    user.cart = user.cart.filter((c) => {
      const pidMatch = String(c.productId) !== String(productIdOrEntryId);
      const sizeMatch = typeof size === "undefined" ? true : (c.size ?? "") !== (size ?? "");
      return pidMatch || !sizeMatch; // keep item only if not matching both
    });

    await user.save();
    const populated = await User.findById(req.user.id).populate("cart.productId");
    res.json(populated.cart);
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT: update quantity and/or size
// Accepts { cartEntryId, quantity, size } (preferred) OR { productId, quantity, size } fallback
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { cartEntryId, productId, quantity, size } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Preferred: update by cart subdocument id
    if (cartEntryId && mongoose.Types.ObjectId.isValid(cartEntryId)) {
      const idx = user.cart.findIndex((c) => String(c._id) === String(cartEntryId));
      if (idx === -1) return res.status(404).json({ message: "Cart entry not found" });
      if (typeof quantity !== "undefined") user.cart[idx].quantity = Number(quantity);
      if (typeof size !== "undefined") user.cart[idx].size = size;
      await user.save();
      const populated = await User.findById(req.user.id).populate("cart.productId");
      return res.json(populated.cart);
    }

    // Fallback: update by productId (and optional size match)
    if (productId) {
      const found = user.cart.find((c) => String(c.productId) === String(productId) && (typeof size === "undefined" || (c.size ?? "") === (size ?? "")));
      if (!found) return res.status(404).json({ message: "Cart entry not found (productId)" });
      if (typeof quantity !== "undefined") found.quantity = Number(quantity);
      if (typeof size !== "undefined") found.size = size;
      await user.save();
      const populated = await User.findById(req.user.id).populate("cart.productId");
      return res.json(populated.cart);
    }

    return res.status(400).json({ message: "Missing cartEntryId or productId" });
  } catch (err) {
    console.error("PUT /api/cart error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
