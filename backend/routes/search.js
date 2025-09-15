// import express from "express";
// import Product from "../Models/Product.js";

// const searchRouter = express.Router();  // 👈 use a unique variable name

// searchRouter.get("/", async (req, res) => {
//   try {
//     const query = req.query.q;
//     if (!query) return res.json([]);

//     const results = await Product.find(
//       {
//         $or: [
//         //   { title: { $regex: query, $options: "i" } },
//            { category: { $regex: query, $options: "i" } },
//           { brand: { $regex: query, $options: "i" } },
//           { subcategory: { $regex: query, $options: "i" } },
//         ],
//       },
//     //   { title: 1, brand: 1, subcategory: 1 }
//             {category:1, brand: 1, subcategory: 1 }
//     ).limit(10);

//     res.json(results);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default searchRouter;  // 👈 export with unique name


// *************** *********************************


import express from "express";
import Product from "../models/Product.js";

const searchRouter = express.Router();  // 👈 use a unique variable name

searchRouter.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    // find minimal fields to reduce bandwidth
    const items = await Product.find(
      {
        $or: [
          { title: regex },
          { category: regex },
          { subcategory: regex },
        ],
      },
      { category: 1, subcategory: 1, categorySlug: 1, subcategorySlug: 1 }
    ).limit(200).lean();

    // dedupe by category+subcategory
    const map = new Map();
    for (const it of items) {
      const key = `${it.category || ""}|||${it.subcategory || ""}`.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          category: it.category || "",
          subcategory: it.subcategory || "",
          categorySlug: it.categorySlug || "",
          subcategorySlug: it.subcategorySlug || "",
        });
      }
    }

    // convert to array and optionally limit to e.g. 10 suggestions
    const results = Array.from(map.values()).slice(0, 10);
    res.json(results);
  } catch (err) {
    console.error("GET /api/search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default searchRouter;  // 👈 export with unique name
