import dotenv from "dotenv";
dotenv.config();

console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET =", process.env.RAZORPAY_KEY_SECRET);
console.log("RAZORPAY_WEBHOOK_SECRET =", process.env.RAZORPAY_WEBHOOK_SECRET);
