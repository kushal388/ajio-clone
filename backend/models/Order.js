// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
//   quantity: { type: Number, default: 1 },
//   price: { type: Number, required: true },
//   status: {
//     type: String,
//     enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
//     default: "placed",
//   },
//   history: [
//     {
//       status: String,
//       changedAt: { type: Date, default: Date.now },
//       changedBy: { type: String }, // "vendor" or "admin"
//     },
//   ],
// });



// const orderItemSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
//   quantity: { type: Number, default: 1 },
//   price: { type: Number, required: true },
//   status: {
//     type: String,
//     enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
//     default: "placed",
//   },
//   // snapshot fields:
//   title: { type: String },
//   image: { type: String },
//   brand: { type: String },

//   history: [
//     {
//       status: String,
//       changedAt: { type: Date, default: Date.now },
//       changedBy: { type: String }, // "vendor" or "admin"
//     },
//   ],
// });


// const orderSchema = new mongoose.Schema(
//   {
//     customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     items: [orderItemSchema],
//     totalAmount: Number,
//     paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
// export default Order;


// ***********************************************************************


// backend/models/Order.js
// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },

//   // snapshot fields (saved at time of purchase)
//   title: { type: String },
//   image: { type: String },
//   brand: { type: String },

//   quantity: { type: Number, default: 1 },
//   price: { type: Number, required: true },

//   // fulfillment fields
//   trackingNumber: { type: String },
//   carrier: { type: String },
//   expectedDelivery: { type: Date },

//   status: {
//     type: String,
//     enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
//     default: "placed",
//   },

//   history: [
//     {
//       status: String,
//       changedAt: { type: Date, default: Date.now },
//       // who changed it: store id if available and role for clarity
//       changedBy: {
//         id: { type: mongoose.Schema.Types.ObjectId, refPath: "history.changedBy.role", required: false },
//         role: { type: String }, // e.g. "vendor" | "admin"
//       },
//     },
//   ],
// });

// const orderSchema = new mongoose.Schema(
//   {
//     customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     items: [orderItemSchema],
//     totalAmount: Number,
//     paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },

//     // shipping + payment meta
//     shippingAddress: {
//       name: String,
//       phone: String,
//       line1: String,
//       line2: String,
//       city: String,
//       state: String,
//       pincode: String,
//       country: { type: String, default: "India" },
//     },

//     paymentMethod: String,
//     paymentId: String,
//     paymentMeta: Object,
//     currency: { type: String, default: "INR" },

//     // optional admin notes
//     adminNotes: [{ note: String, createdAt: { type: Date, default: Date.now }, adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],
//   },
//   { timestamps: true }
// );

// // helpful index for vendor queries (orders containing vendor items)
// orderSchema.index({ "items.vendor": 1, createdAt: -1 });

// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
// export default Order;



// *********************************************************


// backend/models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },

  // snapshot fields (so orders are self-contained, even if product changes/deletes)
  title: { type: String },
  image: { type: String },
  brand: { type: String },

  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },

  // fulfillment / shipping info
  trackingNumber: { type: String },
  carrier: { type: String },
  expectedDelivery: { type: Date },

  status: {
    type: String,
    enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
    default: "placed",
  },

  history: [
    {
      status: String,
      changedAt: { type: Date, default: Date.now },
      changedBy: {
        id: { type: mongoose.Schema.Types.ObjectId, refPath: "history.changedBy.role" },
        role: { type: String }, // e.g. "vendor" | "admin"
      },
    },
  ],
});

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: Number,
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },

    // shipping address snapshot
    shippingAddress: {
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },

    // payment metadata
    paymentMethod: String, // e.g. "razorpay", "card", "upi"
    paymentId: String,     // gateway payment ID
    paymentMeta: Object,   // raw gateway response if you want to store it
    currency: { type: String, default: "INR" },

    // optional notes for admin
    adminNotes: [
      {
        note: String,
        createdAt: { type: Date, default: Date.now },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

// helpful index for vendor queries
orderSchema.index({ "items.vendor": 1, createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
