// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/AjioSignup", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
    
//     console.log("✅ MongoDB Connected");
//   } catch (err) {
//     console.error("❌ MongoDB Error:", err.message);
//     process.exit(1);
//   }
// };


// ****************** DB UPDTAED ***********************



// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const url = "mongodb://127.0.0.1:27017/AjioSignup"
//     await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
    
//     console.log("✅ MongoDB Connected 🔌" , url);
//   } catch (err) {
//     console.error("❌ MongoDB Error:", err.message);
//     process.exit(1);
//   }
// };


// ****************** DB UPDTAED ***********************


// backend/config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/AjioSignup";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};
