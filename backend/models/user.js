// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     phone: {
//       type: String,
//       unique: true,
//       required: [true, "Phone is required"],
//       validate: {
//         validator: (v) => /^[6-9]\d{9}$/.test(v.replace("+91", "")),
//         message: (props) => `${props.value} is not a valid phone number!`,
//       },
//     },
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       validate: {
//         validator: (v) => /^[A-Za-z\s]+$/.test(v),
//         message: "Name must only contain alphabets",
//       },
//     },
//     email: {
//       type: String,
//       unique: true,
//       required: [true, "Email is required"],
//       validate: {
//         validator: (v) =>
//           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && !/\d{3,}/.test(v),
//         message:
//           "Invalid email (cannot contain more than 2 consecutive digits)",
//       },
//     },
//     gender: { type: String, required: true, enum: ["Male", "Female"] },
//     role: { type: String, required: true, enum: ["Customer", "Vendor", "Admin"] },
//     inviteCode: String,
//     otp: String,
//     otpExpiry: Date,
//     otpAttempts: { type: Number, default: 0 },
//     blockedUntil: { type: Date, default: null }
//   },
//   { timestamps: true }
// );

// export const User = mongoose.model("User", userSchema);


// ************************************* USER DATA *************************************************************

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     phone: {
//       type: String,
//       unique: true,
//       required: [true, "Phone is required"],
//       validate: {
//         validator: (v) => /^[6-9]\d{9}$/.test(v.replace("+91", "")),
//         message: (props) => `${props.value} is not a valid phone number!`,
//       },
//     },
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       validate: {
//         validator: (v) => /^[A-Za-z\s]+$/.test(v),
//         message: "Name must only contain alphabets",
//       },
//     },
//     email: {
//       type: String,
//       unique: true,
//       required: [true, "Email is required"],
//       validate: {
//         validator: (v) =>
//           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && !/\d{3,}/.test(v),
//         message: "Invalid email (cannot contain more than 2 consecutive digits)",
//       },
//     },
//     gender: { type: String, required: true, enum: ["Male", "Female"] },
//     role: { type: String, required: true, enum: ["Customer", "Vendor", "Admin"] },
//     inviteCode: String,
//     otp: String,
//     otpExpiry: Date,
//     otpAttempts: { type: Number, default: 0 },
//     blockedUntil: { type: Date, default: null },

//     // 🛒 Cart
//     cart: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//         quantity: { type: Number, default: 1 },
//         size: String,
//       },
//     ],

//     // ❤️ Wishlist
//     wishlist: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//         addedAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // ✅ Prevent overwrite errors
// const User = mongoose.models.User || mongoose.model("User", userSchema);
// export default User;



// *****************************************************************************************


// backend/models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone is required"],
      validate: {
        validator: (v) => /^[6-9]\d{9}$/.test(v.replace("+91", "")),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      validate: {
        validator: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "Name must only contain alphabets",
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      validate: {
        validator: (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && !/\d{3,}/.test(v),
        message: "Invalid email (cannot contain more than 2 consecutive digits)",
      },
    },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    role: { type: String, required: true, enum: ["Customer", "Vendor", "Admin"] },
    inviteCode: String,
    otp: String,
    otpExpiry: Date,
    otpAttempts: { type: Number, default: 0 },
    blockedUntil: { type: Date, default: null },

    // Cart
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
        size: String,
      },
    ],

    // Wishlist
    wishlist: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
