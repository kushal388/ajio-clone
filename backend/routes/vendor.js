// backend/routes/vendor.js
// import express from "express";
// import {authVendor} from "../middleware/authVendor.js"; // vendor authentication
// import Order from "../models/Order.js";

// const router = express.Router();

// // GET vendor orders
// router.get("/orders", authVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor._id; // from token/session

//     // const orders = await Order.find({ "items.vendor": vendorId })  // vendor specefic

//     // temporary: return all orders
//     const orders = await Order.find()
    
//       .populate("customer", "name email")
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching vendor orders", error: err });
//   }
// });

// // GET vendor products
// import Product from "../models/Product.js";
// router.get("/products", authVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor._id;
//     // const products = await Product.find({ vendor: vendorId });  // vendor specefic

//     // all orders
//     const products = await Product.find()

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching vendor products", error: err });
//   }
// });

// export default router;



// ************************************************************** to update orderstatus ****************************
// it is vendor specefic ***************************************


// backend/routes/vendor.js
// import express from "express";
// import { authVendor } from "../middleware/authVendor.js";
// import Order from "../models/Order.js";
// import Product from "../models/Product.js";
// import mongoose from "mongoose";

// const router = express.Router();

// /**
//  * GET /vendor/orders
//  * Return orders but include only items that belong to the authenticated vendor.
//  * This makes it easy for vendor dashboard to render only vendor-specific items.
//  * Supports optional query params:
//  *  - search: string (search orderId or customer name)
//  *  - sort: 'date'|'customer'|'status'
//  *  - dir: 'asc'|'desc'
//  */
// router.get("/orders", authVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor._id;
//     const { search = "", sort = "date", dir = "desc" } = req.query;

//     // Build base filter: find orders that have at least one item belonging to vendor
//     const baseFilter = { "items.vendor": vendorId };

//     // If there is a search term, try to match order _id or populated customer name
//     // We'll do a simple approach: if search looks like ObjectId, match order id,
//     // also do case-insensitive name match via $lookup/populate after fetch.
//     // Fetch orders that contain vendor's items
//     let orders = await Order.find(baseFilter)
//       .populate("customer", "name email")
//       .sort({ createdAt: dir === "asc" ? 1 : -1 })
//       .lean();

//     // Filter order items to only those belonging to vendor
//     orders = orders.map((o) => {
//       const filteredItems = (o.items || []).filter((it) =>
//         String(it.vendor) === String(vendorId)
//       );
//       return { ...o, items: filteredItems };
//     });

//     // If search provided: filter by order id or customer name (client-friendly)
//     const s = search.trim().toLowerCase();
//     if (s) {
//       orders = orders.filter((o) => {
//         const orderIdMatch = o._id && String(o._id).toLowerCase().includes(s);
//         const customerName = (o.customer && o.customer.name) || "";
//         const customerMatch = customerName.toLowerCase().includes(s);
//         return orderIdMatch || customerMatch;
//       });
//     }

//     // Sorting: already sorted by date. If different sort requested, apply locally.
//     if (sort === "customer") {
//       orders.sort((a, b) => {
//         const an = (a.customer && a.customer.name) || "";
//         const bn = (b.customer && b.customer.name) || "";
//         return dir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
//       });
//     } else if (sort === "status") {
//       // For status sorting: choose the first item status (if multiple items, you may want a different rule)
//       orders.sort((a, b) => {
//         const as = (a.items[0] && a.items[0].status) || "";
//         const bs = (b.items[0] && b.items[0].status) || "";
//         return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
//       });
//     }
//     // return
//     res.json({ orders });
//   } catch (err) {
//     console.error("GET /vendor/orders error:", err);
//     res.status(500).json({ message: "Error fetching vendor orders", error: err.message });
//   }
// });

// /**
//  * PATCH /vendor/orders/:orderId/items/:itemId/status
//  * Change status of a single order item (owned by vendor).
//  * Body: { status: "processing" }
//  */
// router.patch(
//   "/orders/:orderId/items/:itemId/status",
//   authVendor,
//   async (req, res) => {
//     try {
//       const { orderId, itemId } = req.params;
//       const { status } = req.body;
//       const vendorId = req.vendor._id;

//       if (!status) return res.status(400).json({ message: "status required" });

//       const allowed = ["placed", "processing", "shipped", "delivered", "cancelled"];
//       if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

//       // Find order with the specific item that belongs to this vendor
//       const order = await Order.findOne({
//         _id: orderId,
//         "items._id": itemId,
//         "items.vendor": vendorId,
//       });
//       if (!order) return res.status(404).json({ message: "Order or item not found for this vendor" });

//       // Update item
//       const item = order.items.id(itemId);
//       // optional: you can add validation on transitions here
//       item.status = status;
//       item.history = item.history || [];
//       item.history.push({
//         status,
//         changedAt: new Date(),
//         changedBy: { id: vendorId, role: "vendor" },
//       });

//       await order.save();

//       // populate customer for updated response
//       await order.populate("customer", "name email");

//       res.json({ message: "Item status updated", order });
//     } catch (err) {
//       console.error("PATCH item status error:", err);
//       res.status(500).json({ message: "Server error", error: err.message });
//     }
//   }
// );

// /**
//  * (Optional) GET /vendor/products
//  * unchanged — kept for completeness
//  */
// router.get("/products", authVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor._id;
//     // return only vendor's products
//     const products = await Product.find({ vendor: vendorId });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching vendor products", error: err.message });
//   }
// });

// export default router;




// ******************************************************************


// backend/routes/vendor.js
// import express from "express";
// import { authVendor } from "../middleware/authVendor.js";
// import Order from "../models/Order.js";
// import Product from "../models/Product.js";

// const router = express.Router();

// /**
//  * GET /vendor/orders
//  * NOTE: returns ALL orders (no filter by items.vendor) because product records
//  * do not currently include vendor ownership. This mirrors the "temporary" behaviour
//  * you requested so vendors can view all orders for now.
//  *
//  * Supports optional query params:
//  *  - search: string (search orderId or customer name)
//  *  - sort: 'date'|'customer'|'status'
//  *  - dir: 'asc'|'desc'
//  */
// router.get("/orders", authVendor, async (req, res) => {
//   try {
//     const { search = "", sort = "date", dir = "desc" } = req.query;

//     // Return ALL orders (no vendor filtering)
//     let orders = await Order.find()
//       .populate("customer", "name email")
//       .sort({ createdAt: dir === "asc" ? 1 : -1 })
//       .lean();

//     // If search provided: filter by order id or customer name (client-friendly)
//     const s = (search || "").trim().toLowerCase();
//     if (s) {
//       orders = orders.filter((o) => {
//         const orderIdMatch = String(o._id || "").toLowerCase().includes(s);
//         const customerName = (o.customer && o.customer.name) || "";
//         const customerMatch = customerName.toLowerCase().includes(s);
//         return orderIdMatch || customerMatch;
//       });
//     }

//     // Sorting: date already applied; apply other sorts locally
//     if (sort === "customer") {
//       orders.sort((a, b) => {
//         const an = (a.customer && a.customer.name) || "";
//         const bn = (b.customer && b.customer.name) || "";
//         return dir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
//       });
//     } else if (sort === "status") {
//       // use first item's status as the order status key (adjust if different rule desired)
//       orders.sort((a, b) => {
//         const as = (a.items[0] && a.items[0].status) || "";
//         const bs = (b.items[0] && b.items[0].status) || "";
//         return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
//       });
//     }

//     return res.json({ orders });
//   } catch (err) {
//     console.error("GET /vendor/orders error:", err);
//     return res.status(500).json({ message: "Error fetching vendor orders", error: err.message });
//   }
// });

// /**
//  * PATCH /vendor/orders/:orderId/items/:itemId/status
//  * Vendor updates status for a single item. This route still enforces that the
//  * specific order item exists — but since vendor ownership is not in DB, we do
//  * NOT check items.vendor here. If you want to enforce ownership later, restore
//  * the vendor check.
//  *
//  * Body: { status: "processing" }
//  */
// router.patch("/orders/:orderId/items/:itemId/status", authVendor, async (req, res) => {
//   try {
//     const { orderId, itemId } = req.params;
//     const { status } = req.body;
//     const vendorId = req.vendor._id;

//     if (!status) return res.status(400).json({ message: "status required" });

//     const allowed = ["placed", "processing", "shipped", "delivered", "cancelled"];
//     if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

//     // Find the order and item (no vendor ownership check)
//     const order = await Order.findOne({
//       _id: orderId,
//       "items._id": itemId,
//     });

//     if (!order) return res.status(404).json({ message: "Order or item not found" });

//     const item = order.items.id(itemId);
//     item.status = status;
//     item.history = item.history || [];
//     item.history.push({
//       status,
//       changedAt: new Date(),
//       changedBy: { id: vendorId, role: "vendor" },
//     });

//     await order.save();
//     await order.populate("customer", "name email");

//     return res.json({ message: "Item status updated", order });
//   } catch (err) {
//     console.error("PATCH item status error:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * GET /vendor/products
//  * Return ALL products (since Product.vendor not present yet).
//  */
// router.get("/products", authVendor, async (req, res) => {
//   try {
//     const products = await Product.find();
//     return res.json(products);
//   } catch (err) {
//     console.error("GET /vendor/products error:", err);
//     return res.status(500).json({ message: "Error fetching vendor products", error: err.message });
//   }
// });

// export default router;

// ********************************* Vendor  status restrictions ********************************


// backend/routes/vendor.js


// 


// ********************************************************************************

// backend/routes/vendor.js
// backend/routes/vendor.js
// import express from "express";
// import mongoose from "mongoose";
// import { authVendor } from "../middleware/authVendor.js";
// import Order from "../models/Order.js";
// import Product from "../models/Product.js";

// const router = express.Router();

// // =======================
// // Order Status Handling
// // =======================
// const ALL_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

// const vendorAllowedTransitions = {
//   placed: ["processing", "cancelled"],
//   processing: ["shipped", "cancelled"],
//   shipped: ["cancelled"],
//   delivered: [],
//   cancelled: [],
// };

// // =======================
// // Orders Routes
// // =======================

// /**
//  * GET /api/vendor/orders
//  * Supports search by orderId or customer name
//  */
// router.get("/orders", authVendor, async (req, res) => {
//   try {
//     const { search = "", sort = "date", dir = "desc" } = req.query;

//     let orders = await Order.find()
//       .populate("customer", "name email")
//       .sort({ createdAt: dir === "asc" ? 1 : -1 })
//       .lean();

//     const s = (search || "").trim().toLowerCase();
//     if (s) {
//       orders = orders.filter((o) => {
//         const orderIdMatch = String(o._id || "").toLowerCase().includes(s);
//         const customerName = (o.customer && o.customer.name) || "";
//         const customerMatch = customerName.toLowerCase().includes(s);
//         return orderIdMatch || customerMatch;
//       });
//     }

//     if (sort === "customer") {
//       orders.sort((a, b) => {
//         const an = (a.customer && a.customer.name) || "";
//         const bn = (b.customer && b.customer.name) || "";
//         return dir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
//       });
//     } else if (sort === "status") {
//       orders.sort((a, b) => {
//         const as = (a.items[0] && a.items[0].status) || "";
//         const bs = (b.items[0] && b.items[0].status) || "";
//         return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
//       });
//     }

//     return res.json({ orders });
//   } catch (err) {
//     console.error("GET /vendor/orders error:", err);
//     return res.status(500).json({ message: "Error fetching vendor orders", error: err.message });
//   }
// });

// /**
//  * PATCH /api/vendor/orders/:orderId/items/:itemId/status
//  * Vendor updates status for a single item.
//  */
// router.patch("/orders/:orderId/items/:itemId/status", authVendor, async (req, res) => {
//   try {
//     const { orderId, itemId } = req.params;
//     const { status } = req.body;
//     const vendorId = req.vendor._id;

//     if (!status) return res.status(400).json({ message: "status required" });
//     if (!ALL_STATUSES.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const order = await Order.findOne({ _id: orderId, "items._id": itemId });
//     if (!order) return res.status(404).json({ message: "Order or item not found" });

//     const item = order.items.id(itemId);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     // For now, allow all vendors to update (no strict vendor ownership)
//     const current = item.status;
//     if (status !== current) {
//       const allowedNext = vendorAllowedTransitions[current] || [];
//       if (!allowedNext.includes(status)) {
//         return res.status(403).json({ message: "Status change not allowed from current state" });
//       }
//     }

//     item.status = status;
//     item.history = item.history || [];
//     item.history.push({
//       status,
//       changedAt: new Date(),
//       changedBy: { id: vendorId, role: "vendor" },
//     });

//     await order.save();
//     await order.populate("customer", "name email");

//     return res.json({ message: "Item status updated", order });
//   } catch (err) {
//     console.error("PATCH item status error:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // =======================
// // Products Routes (Global, No Vendor Filter)
// // =======================

// /**
//  * GET /api/vendor/products
//  */
// router.get("/products", authVendor, async (req, res) => {
//   try {
//     const { q = "", page = 1, perPage = 20 } = req.query;
//     const p = Math.max(1, parseInt(page, 10));
//     const limit = Math.max(1, Math.min(200, parseInt(perPage, 10)));

//     const filter = {};
//     if (q && q.trim()) {
//       const re = new RegExp(q.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
//       filter.$or = [{ title: re }, { brand: re }, { productId: re }];
//     }

//     const total = await Product.countDocuments(filter);
//     const products = await Product.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((p - 1) * limit)
//       .limit(limit)
//       .lean();

//     return res.json({ products, total, page: p, perPage: limit });
//   } catch (err) {
//     console.error("GET /vendor/products error:", err);
//     return res.status(500).json({ message: "Error fetching products", error: err.message });
//   }
// });

// /**
//  * POST /api/vendor/products
//  */
// router.post("/products", authVendor, async (req, res) => {
//   try {
//     const data = req.body || {};

//     if (!data.title || !data.productId || !data.brand || !data.price) {
//       return res.status(400).json({ message: "Missing required: title, productId, brand, price" });
//     }

//     const exists = await Product.findOne({ productId: data.productId });
//     if (exists) {
//       return res.status(409).json({ message: "productId already exists" });
//     }

//     if (data.price) data.price = Number(data.price);
//     if (data.mrp) data.mrp = Number(data.mrp);
//     if (data.discountPercent) data.discountPercent = Number(data.discountPercent);
//     if (data.stock) data.stock = Number(data.stock);

//     const product = new Product(data);
//     await product.save();
//     return res.status(201).json({ message: "Product created", product });
//   } catch (err) {
//     console.error("POST /vendor/products error:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * PUT /api/vendor/products/:id
//  */
// router.put("/products/:id", authVendor, async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

//     const data = req.body || {};
//     if (data.price !== undefined) data.price = Number(data.price);
//     if (data.mrp !== undefined) data.mrp = Number(data.mrp);
//     if (data.discountPercent !== undefined) data.discountPercent = Number(data.discountPercent);
//     if (data.stock !== undefined) data.stock = Number(data.stock);

//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     Object.keys(data).forEach((k) => {
//       product[k] = data[k];
//     });

//     await product.save();
//     return res.json({ message: "Product updated", product });
//   } catch (err) {
//     console.error("PUT /vendor/products/:id error:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * DELETE /api/vendor/products/:id
//  */
// router.delete("/products/:id", authVendor, async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     await product.remove();
//     return res.json({ message: "Product deleted", id });
//   } catch (err) {
//     console.error("DELETE /vendor/products/:id error:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// export default router;



// *********************************************************

//backend/routes/vendor.js
import express from "express";
import mongoose from "mongoose";
import { authVendor } from "../middleware/authVendor.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// =======================
// Order Status Handling
// =======================
const ALL_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

const vendorAllowedTransitions = {
  placed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["cancelled"],
  delivered: [],
  cancelled: [],
};

// =======================
// Orders Routes
// =======================

/**
 * GET /api/vendor/orders
 */
router.get("/orders", authVendor, async (req, res) => {
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
    console.error("GET /vendor/orders error:", err);
    return res.status(500).json({ message: "Error fetching vendor orders", error: err.message });
  }
});

/**
 * PATCH /api/vendor/orders/:orderId/items/:itemId/status
 */
router.patch("/orders/:orderId/items/:itemId/status", authVendor, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;
    const vendorId = req.vendor._id;

    if (!status) return res.status(400).json({ message: "status required" });
    if (!ALL_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findOne({ _id: orderId, "items._id": itemId });
    if (!order) return res.status(404).json({ message: "Order or item not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Allowed transitions
    const current = item.status;
    if (status !== current) {
      const allowedNext = vendorAllowedTransitions[current] || [];
      if (!allowedNext.includes(status)) {
        return res.status(403).json({ message: "Status change not allowed from current state" });
      }
    }

    item.status = status;
    item.history = item.history || [];
    item.history.push({
      status,
      changedAt: new Date(),
      changedBy: { id: vendorId, role: "vendor" },
    });

    await order.save();
    await order.populate("customer", "name email");

    return res.json({ message: "Item status updated", order });
  } catch (err) {
    console.error("PATCH item status error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =======================
// Products Routes (Global)
// =======================

/**
 * GET /api/vendor/products
 */
router.get("/products", authVendor, async (req, res) => {
  try {
    const { q = "", page = 1, perPage = 20 } = req.query;
    const p = Math.max(1, parseInt(page, 10));
    const limit = Math.max(1, Math.min(200, parseInt(perPage, 10)));

    const filter = {};
    if (q && q.trim()) {
      const re = new RegExp(q.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
      filter.$or = [{ title: re }, { brand: re }, { productId: re }];
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({ products, total, page: p, perPage: limit });
  } catch (err) {
    console.error("GET /vendor/products error:", err);
    return res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

/**
 * POST /api/vendor/products
 */
router.post("/products", authVendor, async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.title || !data.productId || !data.brand || !data.price) {
      return res.status(400).json({ message: "Missing required: title, productId, brand, price" });
    }

    const exists = await Product.findOne({ productId: data.productId });
    if (exists) {
      return res.status(409).json({ message: "productId already exists" });
    }

    // sanitize numeric fields
    if (data.price) data.price = Number(data.price);
    if (data.mrp) data.mrp = Number(data.mrp);
    if (data.discountPercent) data.discountPercent = Number(data.discountPercent);
    if (data.stock) data.stock = Number(data.stock);

    // sanitize category/subcategory to string
    if (Array.isArray(data.category)) data.category = data.category[0];
    if (Array.isArray(data.subcategory)) data.subcategory = data.subcategory[0];

    const product = new Product(data);
    await product.save();
    return res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("POST /vendor/products error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * PUT /api/vendor/products/:id
 */
router.put("/products/:id", authVendor, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const data = req.body || {};

    if (data.price !== undefined) data.price = Number(data.price);
    if (data.mrp !== undefined) data.mrp = Number(data.mrp);
    if (data.discountPercent !== undefined) data.discountPercent = Number(data.discountPercent);
    if (data.stock !== undefined) data.stock = Number(data.stock);

    if (Array.isArray(data.category)) data.category = data.category[0];
    if (Array.isArray(data.subcategory)) data.subcategory = data.subcategory[0];

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.keys(data).forEach((k) => {
      product[k] = data[k];
    });

    await product.save();
    return res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("PUT /vendor/products/:id error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * DELETE /api/vendor/products/:id
 */
router.delete("/products/:id", authVendor, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne(); // ✅ fixed for Mongoose 7+
    return res.json({ message: "Product deleted", id });
  } catch (err) {
    console.error("DELETE /vendor/products/:id error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

