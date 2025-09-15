// backend/routes/adminProducts.js
// import express from "express";
// import mongoose from "mongoose";
// import authAdmin from "../middleware/authAdmin.js";
// import Product from "../models/Product.js";

// const router = express.Router();

// /**
//  * GET /api/admin/products
//  * Query params: q, page, perPage, approved (true/false)
//  */
// router.get("/", authAdmin, async (req, res) => {
//   try {
//     const { q = "", page = 1, perPage = 20, approved } = req.query;
//     const p = Math.max(1, parseInt(page, 10));
//     const limit = Math.max(1, Math.min(200, parseInt(perPage, 10)));

//     const filter = {};
//     if (q && q.trim()) {
//       const re = new RegExp(q.trim(), "i");
//       filter.$or = [{ title: re }, { brand: re }, { productId: re }];
//     }
//     if (approved === "true") filter.isVendorApproved = true;
//     if (approved === "false") filter.isVendorApproved = false;

//     const total = await Product.countDocuments(filter);
//     const products = await Product.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((p - 1) * limit)
//       .limit(limit)
//       .lean();

//     res.json({ products, total, page: p, perPage: limit });
//   } catch (err) {
//     console.error("GET /admin/products error:", err);
//     res.status(500).json({ message: "Error fetching products", error: err.message });
//   }
// });

// /**
//  * PATCH /api/admin/products/:id/approve
//  * Body: { approved: true/false }
//  */
// router.patch("/:id/approve", authAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { approved } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid id" });
//     }

//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     product.isVendorApproved = Boolean(approved);
//     await product.save();

//     res.json({ message: "Product approval updated", product });
//   } catch (err) {
//     console.error("PATCH /admin/products/:id/approve error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * DELETE /api/admin/products/:id
//  */
// router.delete("/:id", authAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid id" });
//     }

//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     await product.deleteOne();
//     res.json({ message: "Product deleted", id });
//   } catch (err) {
//     console.error("DELETE /admin/products/:id error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// export default router;


// ********************************************************************************************


import express from "express";
import mongoose from "mongoose";
import authAdmin from "../middleware/authAdmin.js";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * GET /api/admin/products
 * Query params: q, page, perPage, approved (true/false)
 * 
 * 
 */

// GET /api/admin/products/counts
router.get("/counts", authAdmin, async (req, res) => {
  try {
    // count total products
    const all = await Product.countDocuments({});
    const approved = await Product.countDocuments({ isVendorApproved: true });
    const pending = await Product.countDocuments({ isVendorApproved: false });

    return res.json({ all, approved, pending });
  } catch (err) {
    console.error("GET /admin/products/counts error:", err);
    return res.status(500).json({ message: "Error fetching counts", error: err.message });
  }
});


router.get("/", authAdmin, async (req, res) => {
  try {
    const { q = "", page = 1, perPage = 20, approved } = req.query;
    const p = Math.max(1, parseInt(page, 10));
    const limit = Math.max(1, Math.min(200, parseInt(perPage, 10)));

    const filter = {};
    if (q && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      filter.$or = [{ title: re }, { brand: re }, { productId: re }];
    }
    if (approved === "true") filter.isVendorApproved = true;
    if (approved === "false") filter.isVendorApproved = false;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ products, total, page: p, perPage: limit });
  } catch (err) {
    console.error("GET /admin/products error:", err);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

/**
 * PUT /api/admin/products/:id
 * Full admin edit (similar to vendor form)
 */
router.put("/:id", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const data = req.body || {};

    // sanitize numeric fields
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.mrp !== undefined) data.mrp = Number(data.mrp);
    if (data.discountPercent !== undefined) data.discountPercent = Number(data.discountPercent);
    if (data.stock !== undefined) data.stock = Number(data.stock);

    // normalize arrays if frontend sends comma-separated text
    if (typeof data.imagesText === "string") data.images = data.imagesText.split(",").map(s => s.trim()).filter(Boolean);
    if (typeof data.colorsText === "string") data.colors = data.colorsText.split(",").map(s => s.trim()).filter(Boolean);
    if (typeof data.sizesText === "string") data.sizes = data.sizesText.split(",").map(s => s.trim()).filter(Boolean);
    if (typeof data.tagsText === "string") data.tags = data.tagsText.split(",").map(s => s.trim()).filter(Boolean);

    // disallow changing vendor ownership
    delete data.vendor;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // whitelist allowed fields
    const allowed = [
      "productId", "title", "brand", "price", "mrp", "discountPercent",
      "gender", "category", "categorySlug", "section", "subcategory", "subcategorySlug",
      "image", "images", "colors", "sizes", "stock", "tags",
      "isVendorApproved", "isActive", "published"
    ];

    allowed.forEach((k) => {
      if (data[k] !== undefined) product[k] = data[k];
    });

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("PUT /admin/products/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * PATCH /api/admin/products/:id/approve
 * Body: { approved: true/false }
 */
router.patch("/:id/approve", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isVendorApproved = Boolean(approved);
    await product.save();

    res.json({ message: "Product approval updated", product });
  } catch (err) {
    console.error("PATCH /admin/products/:id/approve error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * DELETE /api/admin/products/:id
 */
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted", id });
  } catch (err) {
    console.error("DELETE /admin/products/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
