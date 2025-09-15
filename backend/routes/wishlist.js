// import express from "express";
// import User from "../models/user.js";
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();

// // Get wishlist
// router.get("/", authMiddleware, async (req, res) => {
//   const user = await User.findById(req.user.id).populate("wishlist.productId");
//   res.json(user.wishlist);
// });

// // Add to wishlist
// router.post("/", authMiddleware, async (req, res) => {
//   const { productId } = req.body;
//   const user = await User.findById(req.user.id);

//   if (!user.wishlist.some((i) => i.productId.toString() === productId)) {
//     user.wishlist.push({ productId });
//   }
//   await user.save();
//   res.json(user.wishlist);
// });

// // Remove from wishlist
// router.delete("/:productId", authMiddleware, async (req, res) => {
//   const { productId } = req.params;
//   const user = await User.findById(req.user.id);
//   user.wishlist = user.wishlist.filter((i) => i.productId.toString() !== productId);
//   await user.save();
//   res.json(user.wishlist);
// });

// export default router;


// *********************************************************************************

// backend/routes/wishlist.js
// import express from "express";
// import User from "../models/user.js";
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();

// router.get("/", authMiddleware, async (req, res) => {
//   const user = await User.findById(req.user.id).populate("wishlist.productId");
//   res.json(user.wishlist);
// });

// router.post("/", authMiddleware, async (req, res) => {
//   const { productId } = req.body;
//   const user = await User.findById(req.user.id);

//   if (!user.wishlist.some((i) => i.productId.toString() === productId)) {
//     user.wishlist.push({ productId });
//   }
//   await user.save();
//   res.json(user.wishlist);
// });

// router.delete("/:productId", authMiddleware, async (req, res) => {
//   const { productId } = req.params;
//   const user = await User.findById(req.user.id);
//   user.wishlist = user.wishlist.filter((i) => i.productId.toString() !== productId);
//   await user.save();
//   res.json(user.wishlist);
// });

// export default router;

// ****************************************************************************************************

// backend/routes/wishlist.js
// import express from "express";
// import mongoose from "mongoose";
// import User from "../models/user.js";
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();
// const toObjectId = (id) => { try { return mongoose.Types.ObjectId(id); } catch (e) { return null; } };

// // GET /api/wishlist  -> populated wishlist
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("wishlist.productId");
//     return res.json(user.wishlist || []);
//   } catch (err) {
//     console.error("GET /api/wishlist error:", err);
//     return res.status(500).json({ message: "Failed to fetch wishlist" });
//   }
// });

// // POST /api/wishlist  -> add product to wishlist (no dupes)
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { productId } = req.body;
//     if (!productId) return res.status(400).json({ message: "productId required" });

//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const exists = user.wishlist.some((i) => i.productId.toString() === productId);
//     if (!exists) {
//       user.wishlist.push({ productId: toObjectId(productId) || productId });
//       await user.save();
//     }

//     const updated = await User.findById(req.user.id).populate("wishlist.productId");
//     return res.json(updated.wishlist || []);
//   } catch (err) {
//     console.error("POST /api/wishlist error:", err);
//     return res.status(500).json({ message: "Failed to add to wishlist" });
//   }
// });

// // DELETE /api/wishlist/:idOrPid  -> support removing by productId or wishlist-entry _id
// router.delete("/:idOrPid", authMiddleware, async (req, res) => {
//   try {
//     const { idOrPid } = req.params;
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // try remove by productId match first
//     let before = user.wishlist.length;
//     user.wishlist = user.wishlist.filter((w) => w.productId.toString() !== idOrPid);

//     // if nothing removed, try match by wishlist entry _id
//     if (user.wishlist.length === before) {
//       user.wishlist = user.wishlist.filter((w) => w._id.toString() !== idOrPid);
//     }

//     await user.save();
//     const updated = await User.findById(req.user.id).populate("wishlist.productId");
//     return res.json(updated.wishlist || []);
//   } catch (err) {
//     console.error("DELETE /api/wishlist/:idOrPid error:", err);
//     return res.status(500).json({ message: "Failed to remove from wishlist" });
//   }
// });

// export default router;



// ************************************************************************************************* // backend/routes/wishlist.js
// import express from "express";
// import mongoose from "mongoose";
// import User from "../models/user.js";
// import Product from "../models/Product.js";
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();
// const toObjectId = (id) => {
//   try { return mongoose.Types.ObjectId(id); } catch (e) { return null; }
// };

// // helper: accept either a real ObjectId string or a SKU (productId field) and return real ObjectId
// async function resolveProductObjectId(maybeIdOrSku) {
//   if (!maybeIdOrSku) return null;
//   // if it's a 24-char hex, treat as ObjectId
//   const asOid = toObjectId(maybeIdOrSku);
//   if (asOid) return asOid;

//   // otherwise try to find by product.productId (your SKU)
//   const prod = await Product.findOne({ productId: maybeIdOrSku });
//   if (prod) return prod._id;
//   return null;
// }

// // GET /api/wishlist
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("wishlist.productId");
//     return res.json(user.wishlist || []);
//   } catch (err) {
//     console.error("GET /api/wishlist error:", err);
//     return res.status(500).json({ message: "Failed to fetch wishlist" });
//   }
// });

// // POST /api/wishlist  -> accepts either ObjectId or SKU string
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { productId: maybeId } = req.body;
//     if (!maybeId) return res.status(400).json({ message: "productId required" });

//     const resolved = await resolveProductObjectId(maybeId);
//     if (!resolved) return res.status(404).json({ message: "Product not found" });

//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const exists = user.wishlist.some((i) => String(i.productId) === String(resolved));
//     if (!exists) {
//       user.wishlist.push({ productId: resolved });
//       await user.save();
//     }

//     const updated = await User.findById(req.user.id).populate("wishlist.productId");
//     return res.json(updated.wishlist || []);
//   } catch (err) {
//     console.error("POST /api/wishlist error:", err);
//     return res.status(500).json({ message: "Failed to add to wishlist" });
//   }
// });

// // DELETE /api/wishlist/:idOrPid  -> supports productId(_id) or SKU or wishlist-entry _id
// router.delete("/:idOrPid", authMiddleware, async (req, res) => {
//   try {
//     const { idOrPid } = req.params;
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // try resolve to product _id (if idOrPid is SKU or product _id)
//     const resolvedPid = await resolveProductObjectId(idOrPid);

//     // First remove by productId match (resolved)
//     if (resolvedPid) {
//       user.wishlist = user.wishlist.filter((w) => String(w.productId) !== String(resolvedPid));
//     } else {
//       // fallback: remove by wishlist entry id
//       user.wishlist = user.wishlist.filter((w) => String(w._id) !== String(idOrPid));
//     }

//     await user.save();
//     const updated = await User.findById(req.user.id).populate("wishlist.productId");
//     return res.json(updated.wishlist || []);
//   } catch (err) {
//     console.error("DELETE /api/wishlist/:idOrPid error:", err);
//     return res.status(500).json({ message: "Failed to remove from wishlist" });
//   }
// });

// export default router;


// **************************************************************************************************************************


// backend/routes/wishlist.js
import express from "express";
import mongoose from "mongoose";
import User from "../models/user.js";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const toObjectId = (id) => {
  try { return new mongoose.Types.ObjectId(String(id)); } catch (e) { return null; }
};

// Resolve either ObjectId string or SKU -> ObjectId
async function resolveProductObjectId(maybeIdOrSku) {
  if (!maybeIdOrSku) return null;
  const asOid = toObjectId(maybeIdOrSku);
  if (asOid) return asOid;
  const prod = await Product.findOne({ productId: String(maybeIdOrSku) }).select("_id");
  if (prod) return prod._id;
  return null;
}

// GET /api/wishlist -> populated wishlist
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist.productId");
    return res.json(user.wishlist || []);
  } catch (err) {
    console.error("GET /api/wishlist error:", err);
    return res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

// POST /api/wishlist -> add product (accepts SKU or _id)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId: maybe } = req.body;
    if (!maybe) return res.status(400).json({ message: "productId required" });

    const resolved = await resolveProductObjectId(maybe);
    if (!resolved) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.wishlist.some((i) => String(i.productId) === String(resolved));
    if (!exists) {
      user.wishlist.push({ productId: resolved });
      await user.save();
    }

    const updated = await User.findById(req.user.id).populate("wishlist.productId");
    return res.json(updated.wishlist || []);
  } catch (err) {
    console.error("POST /api/wishlist error:", err);
    return res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist/:idOrPid -> supports wishlist entry _id OR SKU OR product _id
router.delete("/:idOrPid", authMiddleware, async (req, res) => {
  try {
    const { idOrPid } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let removed = false;

    // Try: treat as product SKU or product _id
    const resolvedPid = await resolveProductObjectId(idOrPid);
    if (resolvedPid) {
      const before = user.wishlist.length;
      user.wishlist = user.wishlist.filter((w) => String(w.productId) !== String(resolvedPid));
      removed = user.wishlist.length !== before;
    }

    // Fallback: treat idOrPid as wishlist entry _id
    if (!removed && mongoose.Types.ObjectId.isValid(idOrPid)) {
      const before = user.wishlist.length;
      user.wishlist = user.wishlist.filter((w) => String(w._id) !== String(idOrPid));
      removed = user.wishlist.length !== before;
    }

    if (!removed) return res.status(404).json({ message: "Wishlist item not found" });

    await user.save();
    const updated = await User.findById(req.user.id).populate("wishlist.productId");
    return res.json(updated.wishlist || []);
  } catch (err) {
    console.error("DELETE /api/wishlist/:idOrPid error:", err);
    return res.status(500).json({ message: "Failed to remove from wishlist" });
  }
});

export default router;
