// // backend/routes/webhookRazorpay.js
// import express from "express";
// import crypto from "crypto";
// import Order from "../models/Order.js";


// /**
//  * Webhook handler for Razorpay.
//  * Expects raw body (Buffer) at req.body — server must mount this route with bodyParser.raw({ type: "application/json" })
//  *
//  * It verifies X-Razorpay-Signature using RAZORPAY_WEBHOOK_SECRET (from .env).
//  * If signature matches and event is payment.captured, it finds the matching Order
//  * (by stored razorpay.orderId) and marks it paid.
//  */
// router.post("/", async (req, res) => {
//   try {
//     const rawBody = req.body; // Buffer (because of bodyParser.raw)
//     const signature = req.headers["x-razorpay-signature"];

//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
//     if (!webhookSecret) {
//       console.warn("Webhook: missing RAZORPAY_WEBHOOK_SECRET and RAZORPAY_KEY_SECRET in env");
//       return res.status(400).send("Webhook secret missing");
//     }

//     // compute expected signature (hex)
//     const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

//     if (!signature || expected !== signature) {
//       console.warn("Webhook: invalid signature", { expected, signature });
//       return res.status(400).send("Invalid signature");
//     }

//     // parse payload
//     let event;
//     try {
//       event = JSON.parse(rawBody.toString("utf8"));
//     } catch (err) {
//       console.error("Webhook: failed to parse JSON body", err);
//       return res.status(400).send("Invalid JSON");
//     }

//     const eventName = event?.event;
//     // handle payment captured or authorized (you can add more cases)
//     if (eventName === "payment.captured" || eventName === "payment.authorized") {
//       // payload shape: event.payload.payment.entity
//       const payloadPayment = event.payload?.payment?.entity;
//       const razorpayPaymentId = payloadPayment?.id;
//       const razorpayOrderId = payloadPayment?.order_id;
//       const amount = payloadPayment?.amount;

//       // Try to find your Order using stored Razorpay orderId mapping
//       // Adjust the query if you store the razorpay id under different field.
//       const order = await Order.findOne({
//         "paymentInfo.razorpay.orderId": razorpayOrderId
//       });

//       if (order) {
//         order.paymentStatus = "paid";
//         order.paymentInfo = order.paymentInfo || {};
//         order.paymentInfo.razorpay = {
//           paymentId: razorpayPaymentId,
//           orderId: razorpayOrderId,
//           amount,
//         };
//         await order.save();
//         console.log("Webhook: order marked paid", order._id.toString());
//       } else {
//         console.warn("Webhook: no order found for razorpayOrderId:", razorpayOrderId);
//       }
//     } else {
//       // for all other events just log for now
//       console.log("Webhook received event:", eventName);
//     }

//     return res.status(200).json({ ok: true });
//   } catch (err) {
//     console.error("Webhook handler error:", err);
//     return res.status(500).send("Server error");
//   }
// });

// export default router;

// *************************************************************

// import express from "express";
// import crypto from "crypto";
// import Order from "../models/Order.js";

// const router = express.Router();   // <-- Missing line

// /**
//  * Webhook handler for Razorpay.
//  * Expects raw body (Buffer) at req.body — server must mount this route with bodyParser.raw({ type: "application/json" })
//  */
// router.post("/", async (req, res) => {
//   try {
//     const rawBody = req.body; // Buffer (because of bodyParser.raw)
//     const signature = req.headers["x-razorpay-signature"];

//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
//     if (!webhookSecret) {
//       console.warn("Webhook: missing RAZORPAY_WEBHOOK_SECRET and RAZORPAY_KEY_SECRET in env");
//       return res.status(400).send("Webhook secret missing");
//     }

//     // compute expected signature (hex)
//     const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

//     if (!signature || expected !== signature) {
//       console.warn("Webhook: invalid signature", { expected, signature });
//       return res.status(400).send("Invalid signature");
//     }

//     // parse payload
//     let event;
//     try {
//       event = JSON.parse(rawBody.toString("utf8"));
//     } catch (err) {
//       console.error("Webhook: failed to parse JSON body", err);
//       return res.status(400).send("Invalid JSON");
//     }

//     const eventName = event?.event;
//     if (eventName === "payment.captured" || eventName === "payment.authorized") {
//       const payloadPayment = event.payload?.payment?.entity;
//       const razorpayPaymentId = payloadPayment?.id;
//       const razorpayOrderId = payloadPayment?.order_id;
//       const amount = payloadPayment?.amount;

//       const order = await Order.findOne({
//         "paymentInfo.razorpay.orderId": razorpayOrderId,
//       });

//       if (order) {
//         order.paymentStatus = "paid";
//         order.paymentInfo = order.paymentInfo || {};
//         order.paymentInfo.razorpay = {
//           paymentId: razorpayPaymentId,
//           orderId: razorpayOrderId,
//           amount,
//         };
//         await order.save();
//         console.log("Webhook: order marked paid", order._id.toString());
//       } else {
//         console.warn("Webhook: no order found for razorpayOrderId:", razorpayOrderId);
//       }
//     } else {
//       console.log("Webhook received event:", eventName);
//     }

//     return res.status(200).json({ ok: true });
//   } catch (err) {
//     console.error("Webhook handler error:", err);
//     return res.status(500).send("Server error");
//   }
// });

// export default router;







// *******************************************************************


// backend/routes/webhookRazorpay.js
import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * Razorpay webhook handler
 * Must be mounted with bodyParser.raw({ type: "application/json" }) in server.js
 * Example: app.use("/webhook/razorpay", bodyParser.raw({ type: "application/json" }), webhookRazorpayRouter);
 */
router.post("/", async (req, res) => {
  try {
    const rawBody = req.body; // raw buffer from bodyParser.raw
    const signature = req.headers["x-razorpay-signature"];

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!webhookSecret) {
      console.warn("⚠️ Webhook: no secret found in env");
      return res.status(400).send("Webhook secret missing");
    }

    // Verify signature
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (!signature || expected !== signature) {
      console.warn("❌ Webhook: invalid signature", { expected, signature });
      return res.status(400).send("Invalid signature");
    }

    // Parse JSON body
    let event;
    try {
      event = JSON.parse(rawBody.toString("utf8"));
    } catch (err) {
      console.error("❌ Webhook: failed to parse JSON", err);
      return res.status(400).send("Invalid JSON");
    }

    const eventName = event?.event;
    console.log("📩 Webhook event:", eventName);

    if (eventName === "payment.captured" || eventName === "payment.authorized") {
      const payloadPayment = event.payload?.payment?.entity;
      const razorpayPaymentId = payloadPayment?.id;
      const razorpayOrderId = payloadPayment?.order_id;
      const amount = payloadPayment?.amount;

      // Find your order by razorpay order id
      const order = await Order.findOne({
        "paymentInfo.razorpay.orderId": razorpayOrderId,
      });

      if (order) {
        order.paymentStatus = "paid";
        order.paymentInfo.razorpay = {
          ...(order.paymentInfo.razorpay || {}),
          paymentId: razorpayPaymentId,
          orderId: razorpayOrderId,
          amount,
        };
        await order.save();
        console.log("✅ Webhook: Order marked paid", order._id.toString());
      } else {
        console.warn("⚠️ Webhook: No order found for Razorpay order id:", razorpayOrderId);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return res.status(500).send("Server error");
  }
});

export default router;
