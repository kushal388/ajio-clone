// backend/scripts/migrate-fix-wishlist-cart.js
// Usage:
//  - Dry run (no DB writes): DRY_RUN=1 node backend/scripts/migrate-fix-wishlist-cart.js
//  - Real run (apply changes): node backend/scripts/migrate-fix-wishlist-cart.js
//
// Place this file at: backend/scripts/migrate-fix-wishlist-cart.js
// Run from project root or backend folder (recommended): cd backend && node scripts/migrate-fix-wishlist-cart.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/user.js";
import Product from "../models/Product.js";

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/AjioSignup";
const DRY = String(process.env.DRY_RUN || "") === "1";

function isObjectIdString(s) {
  return typeof s === "string" && /^[a-fA-F0-9]{24}$/.test(s);
}

/**
 * Try to convert a value to an ObjectId:
 *  - if value is already a 24-hex string, return new ObjectId(value)
 *  - otherwise try to find Product with productId === value (SKU) and return its _id
 *  - otherwise return null
 */
async function toObjectIdIfPossible(val) {
  if (!val && val !== 0) return null;
  const s = String(val).trim();
  if (isObjectIdString(s)) {
    try {
      return new mongoose.Types.ObjectId(s);
    } catch (e) {
      return null;
    }
  }
  // find by SKU (productId)
  const prod = await Product.findOne({ productId: s }).select("_id").lean();
  if (prod && prod._id) return prod._id;
  return null;
}

async function run() {
  console.log("Connecting to Mongo at", MONGO);
  // modern mongoose options: don't pass deprecated useNewUrlParser/useUnifiedTopology
  await mongoose.connect(MONGO);
  console.log("Connected. DRY_RUN =", DRY);

  const users = await User.find({}).select("cart wishlist").lean();
  console.log("Users to inspect:", users.length);

  // We'll fetch & update using model instances only when needed (to avoid issues with lean())
  for (const u of users) {
    let changed = false;
    const updates = { cart: null, wishlist: null };

    // process wishlist
    if (Array.isArray(u.wishlist) && u.wishlist.length) {
      updates.wishlist = u.wishlist.map((entry, idx) => ({ ...entry }));
      for (let i = 0; i < updates.wishlist.length; i++) {
        const pid = updates.wishlist[i].productId;
        const resolved = await toObjectIdIfPossible(pid);
        if (resolved && String(pid) !== String(resolved)) {
          console.log(`User ${u._id}: wishlist[${i}] ${String(pid)} -> ${String(resolved)}`);
          updates.wishlist[i].productId = resolved;
          changed = true;
        }
      }
    }

    // process cart
    if (Array.isArray(u.cart) && u.cart.length) {
      updates.cart = u.cart.map((entry) => ({ ...entry }));
      for (let i = 0; i < updates.cart.length; i++) {
        const pid = updates.cart[i].productId;
        const resolved = await toObjectIdIfPossible(pid);
        if (resolved && String(pid) !== String(resolved)) {
          console.log(`User ${u._id}: cart[${i}] ${String(pid)} -> ${String(resolved)}`);
          updates.cart[i].productId = resolved;
          changed = true;
        }
      }
    }

    if (changed) {
      if (DRY) {
        console.log(`(dry) Would save user ${u._id}`);
      } else {
        // perform actual save using the full model (not lean doc)
        const fullUser = await User.findById(u._id);
        if (!fullUser) {
          console.warn(`Could not load full user model for ${u._id} — skipping save`);
          continue;
        }
        if (updates.cart) fullUser.cart = updates.cart;
        if (updates.wishlist) fullUser.wishlist = updates.wishlist;
        await fullUser.save();
        console.log(`Saved user ${u._id}`);
      }
    }
  }

  console.log("Done. Disconnecting.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration script error:", err);
  process.exit(1);
});

