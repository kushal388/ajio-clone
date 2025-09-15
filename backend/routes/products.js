

// // backend/routes/products.js
// import { Router } from "express";
// import Product from "../models/Product.js";
// import { slugify } from "../utils/slugify.js";

// const router = Router();

// /**
//  * GET /api/products
//  * Query params supported:
//  *  - category, subcategory (raw names)
//  *  - categorySlug, subcategorySlug (slug form)
//  *  - gender
//  *  - brand (comma separated)
//  *  - minPrice, maxPrice
//  *  - sort = relevance | lowtohigh | hightolow | newest
//  *  - page, limit
//  *
//  * Response:
//  *  { total, page, limit, items: [...] }
//  */
// router.get("/", async (req, res) => {
//   try {
//     const {
//       category,
//       subcategory,
//       categorySlug,
//       subcategorySlug,
//       gender,
//       brand,
//       minPrice,
//       maxPrice,
//       sort = "relevance",
//       page = 1,
//       limit = 24,
//     } = req.query;

//     const q = {};

//     if (category) q.category = category;
//     if (subcategory) q.subcategory = subcategory;
//     if (categorySlug) q.categorySlug = categorySlug;
//     if (subcategorySlug) q.subcategorySlug = subcategorySlug;
//     if (gender) q.gender = gender;
//     if (brand) q.brand = { $in: brand.split(",").map((b) => b.trim()) };
//     if (minPrice || maxPrice) {
//       q.price = {};
//       if (minPrice) q.price.$gte = Number(minPrice);
//       if (maxPrice) q.price.$lte = Number(maxPrice);
//     }

//     const sortMap = {
//       lowtohigh: { price: 1 },
//       hightolow: { price: -1 },
//       newest: { createdAt: -1 },
//       relevance: { createdAt: -1 },
//     };

//     const skip = (Number(page) - 1) * Number(limit);
//     const [items, total] = await Promise.all([
//       Product.find(q).sort(sortMap[sort] || {}).skip(skip).limit(Number(limit)),
//       Product.countDocuments(q),
//     ]);

//     res.json({ total, page: Number(page), limit: Number(limit), items });
//   } catch (err) {
//     console.error("GET /api/products error:", err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// /**
//  * GET /api/products/:id  (by productId)
//  */
// router.get("/:id", async (req, res) => {
//   try {
//     const item = await Product.findOne({ productId: req.params.id });
//     if (!item) return res.status(404).json({ error: "Not found" });
//     res.json(item);
//   } catch (err) {
//     console.error("GET /api/products/:id error:", err);
//     res.status(500).json({ error: "Failed to fetch product" });
//   }
// });

// /**
//  * POST /api/products  - create one product
//  * Automatically adds categorySlug and subcategorySlug
//  */
// router.post("/", async (req, res) => {
//   try {
//     const product = { ...req.body };

//     // Create slug fields to enable slug-based querying
//     if (product.category) product.categorySlug = slugify(product.category);
//     if (product.subcategory) product.subcategorySlug = slugify(product.subcategory);

//     const saved = await Product.create(product);
//     res.status(201).json(saved);
//   } catch (err) {
//     console.error("POST /api/products error:", err);
//     // Mongoose validation / duplicate key errors often produce helpful messages
//     res.status(400).json({ error: err.message });
//   }
// });

// /**
//  * POST /api/products/bulk - insert many products at once
//  * Each item will receive categorySlug/subcategorySlug if present
//  * Body must be an array of product objects
//  */
// router.post("/bulk", async (req, res) => {
//   try {
//     const docs = Array.isArray(req.body) ? req.body : null;
//     if (!docs) return res.status(400).json({ error: "Request body must be an array" });

//     const toInsert = docs.map((d) => {
//       const copy = { ...d };
//       if (copy.category) copy.categorySlug = slugify(copy.category);
//       if (copy.subcategory) copy.subcategorySlug = slugify(copy.subcategory);
//       return copy;
//     });

//     const inserted = await Product.insertMany(toInsert, { ordered: false });
//     res.status(201).json({ inserted: inserted.length });
//   } catch (err) {
//     console.error("POST /api/products/bulk error:", err);
//     // insertMany with ordered:false may throw on duplicates but still insert others
//     res.status(400).json({ error: err.message });
//   }
// },

// );

// export default router;



// *************************** DIsPLY PAGE ******************

// backend/routes/products.js
import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { slugify } from "../utils/slugify.js";


const router = Router();

/**
 * GET /api/products
 * Query params:
 *  - category, subcategory (raw names)
 *  - categorySlug, subcategorySlug (slug form)
 *  - gender
 *  - brand (comma separated)
 *  - minPrice, maxPrice
 *  - sort = relevance | lowtohigh | hightolow | newest
 *  - page, limit
 *
 * Response:
 *  { total, page, limit, items: [...] }
 */
router.get("/", async (req, res) => {
  try {
    const {
      category,
      subcategory,
      categorySlug,
      subcategorySlug,
      gender,
      brand,
      minPrice,
      maxPrice,
      sort = "relevance",
      page = 1,
      limit = 24,
    } = req.query;

    const q = {};
    

    q.isVendorApproved = true;

    if (category) q.category = category;
    if (subcategory) q.subcategory = subcategory;
    if (categorySlug) q.categorySlug = categorySlug;
    if (subcategorySlug) q.subcategorySlug = subcategorySlug;
    if (gender) q.gender = gender;

    if (brand) {
      // brand may be comma separated: "Nike,Puma"
      const brands = brand
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);
      if (brands.length) q.brand = { $in: brands };
    }

    if (minPrice != null || maxPrice != null) {
      q.price = {};
      if (minPrice != null && minPrice !== "") q.price.$gte = Number(minPrice);
      if (maxPrice != null && maxPrice !== "") q.price.$lte = Number(maxPrice);
      // if price object is empty, delete it
      if (Object.keys(q.price).length === 0) delete q.price;
    }

    const sortMap = {
      lowtohigh: { price: 1 },
      hightolow: { price: -1 },
      newest: { createdAt: -1 },
      relevance: { createdAt: -1 }, // simple fallback
    };

    const pageNum = Math.max(1, Number(page) || 1);
    const limNum = Math.max(1, Number(limit) || 24);
    const skip = (pageNum - 1) * limNum;

    const [items, total] = await Promise.all([
      Product.find(q).sort(sortMap[sort] || {}).skip(skip).limit(limNum),
      Product.countDocuments(q),
    ]);

    res.json({ total, page: pageNum, limit: limNum, items });
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * GET /api/products/:id
 * Accepts Mongo _id or productId
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let item = null;

    // try as ObjectId first
    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await Product.findById(id);
    }

    // fallback: find by productId
    if (!item) {
      item = await Product.findOne({ productId: id });
    }

    if (!item) return res.status(404).json({ error: "Product not found" });

    res.json(item);
  } catch (err) {
    console.error("GET /api/products/:id error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/**
 * POST /api/products  - create one product
 * Automatically adds categorySlug and subcategorySlug
 */
router.post("/", async (req, res) => {
  try {
    const product = { ...req.body };

    // Create slug fields to enable slug-based querying
    if (product.category) product.categorySlug = slugify(product.category);
    if (product.subcategory) product.subcategorySlug = slugify(product.subcategory);

    const saved = await Product.create(product);
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/products error:", err);
    res.status(400).json({ error: "Failed to create product" });
  }
});

/**
 * POST /api/products/bulk - insert many products at once
 * Body: array of product objects
 */
router.post("/bulk", async (req, res) => {
  try {
    const docs = Array.isArray(req.body) ? req.body : null;
    if (!docs) return res.status(400).json({ error: "Request body must be an array" });

    const toInsert = docs.map((d) => {
      const copy = { ...d };
      if (copy.category) copy.categorySlug = slugify(copy.category);
      if (copy.subcategory) copy.subcategorySlug = slugify(copy.subcategory);
      return copy;
    });

    // ordered:false allows inserting other docs even if one fails (e.g. duplicate)
    const inserted = await Product.insertMany(toInsert, { ordered: false });
    res.status(201).json({ inserted: inserted.length });
  } catch (err) {
    console.error("POST /api/products/bulk error:", err);
    // send a simple helpful message to client
    res.status(400).json({ error: "Bulk insert failed (check server logs)" });
  }
});

export default router;
