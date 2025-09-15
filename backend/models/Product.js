// import mongoose from "mongoose";

// const ProductSchema = new mongoose.Schema(
//   {
//     productId: { type: String, required: true, unique: true, index: true },
//     title: { type: String, required: true },
//     brand: { type: String, required: true },
//     price: { type: Number, required: true },
//     mrp: Number,
//     discountPercent: Number,
//     rating: { type: Number, default: 0 },
//     ratingCount: { type: Number, default: 0 },

//     gender: { type: String, enum: ["Men","Women","Boys","Girls","Unisex"], default: "Unisex" },
//     category: { type: String, required: true },      // men|women|kids|beauty|home-kitchen
//       categorySlug: String,
//     section: String,                                  // e.g. Western Wear
//     subcategory: { type: String, required: true },    // e.g. Jackets & Coats
//     subcategorySlug: String,
//     image: { type: String, required: true },
//     images: [String],

//     colors: [String],
//     sizes: [String],
//     stock: { type: Number, default: 100 },
//     tags: [String],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Product", ProductSchema);




// ************************************* USER DATA *************************************************************

//backend/models/Product.js
// 


// ************************************************************************************


// backend/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: Number,
    discountPercent: Number,
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    gender: {
      type: String,
      enum: ["Men", "Women", "Boys", "Girls", "Unisex"],
      default: "Unisex",
    },
    category: { type: String, required: true }, // men | women | kids | beauty | home-kitchen
    categorySlug: String,
    section: String,
    subcategory: { type: String, required: true },
    subcategorySlug: String,

    // main image (store full URL or consistent relative path like /uploads/..)
    image: {
      type: String,
      required: true,
      default: "/assets/placeholder.png",
    },

    // keep simple array of urls for now (backwards compatible)
    images: [String],

    colors: [String],
    sizes: [String],
    stock: { type: Number, default: 100 },
    tags: [String],

    // vendor relation
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },

    // product visibility / moderation flags
    isVendorApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// index to speed vendor queries
ProductSchema.index({ vendor: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;




