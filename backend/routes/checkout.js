





// ***************************************************************************


// backend/routes/checkout.js
// import express from "express";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Order from "../models/Order.js";
// import User from "../models/user.js";
// import Product from "../models/Product.js"

// const router = express.Router();

// /**
//  * Helper: create Razorpay client lazily (so server doesn't crash at import if env missing)
//  */
// function createRazorpayClient() {
//   const keyId = process.env.RAZORPAY_KEY_ID;
//   const keySecret = process.env.RAZORPAY_KEY_SECRET;

//   if (!keyId || !keySecret) {
//     // caller should handle thrown error
//     throw new Error("❌ Razorpay keys missing in .env (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
//   }

//   return new Razorpay({
//     key_id: keyId,
//     key_secret: keySecret,
//   });
// }

// /**
//  * POST /api/checkout/create-order
//  * Body: { customerId, items: [{ product: "<id>" | productId: "<id>", quantity }], currency? }
//  *
//  * Creates application Order record with snapshot fields (title, image, brand, vendor),
//  * computes the final total server-side, creates a Razorpay order and returns razorpay details.
//  */
// router.post("/create-order", async (req, res) => {
//   console.log("CREATE-ORDER called");
//   try {
//     const { customerId, items, currency = "INR", shippingAddress, paymentMethod } = req.body ?? {};

//     console.log("Payload:", {
//       customerId,
//       itemsLength: Array.isArray(items) ? items.length : 0,
//       currency,
//     });

//     // Basic validation
//     if (!customerId) return res.status(400).json({ error: "customerId is required" });
//     if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "items must be a non-empty array" });

//     // Optional: check customer exists
//     const customer = await User.findById(customerId).lean().exec();
//     if (!customer) {
//       console.warn("Create order: customer not found", customerId);
//       return res.status(400).json({ error: "Customer not found" });
//     }

//     // Build itemsToSave by fetching the canonical product data and snapshotting
//     const itemsToSave = [];
//     let calculatedTotal = 0;

//     for (const it of items) {
//       // accept either { product } or { productId } or { product: <id> }
//       const productId = it.product || it.productId || it.product_id;
//       const qty = Number(it.quantity || it.qty || 1);

//       if (!productId) {
//         return res.status(400).json({ error: "Each item must include product (id) and quantity" });
//       }

//       const product = await Product.findById(productId).select("title image brand vendor price").lean();
//       if (!product) {
//         return res.status(400).json({ error: `Product not found: ${productId}` });
//       }

//       const price = Number(product.price || 0);
//       const itemTotal = price * qty;

//       itemsToSave.push({
//         product: product._id,
//         vendor: product.vendor || null,
//         quantity: qty,
//         price,
//         // snapshot fields
//         title: product.title,
//         image: product.image,
//         brand: product.brand,
//       });

//       calculatedTotal += itemTotal;
//     }

//     // Add fees/discounts if you have business rules (use same rules as frontend).
//     // For now we keep it simple - computed from product prices; you can extend here.
//     const deliveryFee = Number(req.body.deliveryFee || 0);
//     const platformFee = Number(req.body.platformFee || 0);
//     const discounts = Number(req.body.discounts || 0);
//     const finalTotal = Number(calculatedTotal + deliveryFee + platformFee - discounts);

//     if (finalTotal <= 0 || Number.isNaN(finalTotal)) {
//       return res.status(400).json({ error: "Invalid calculated total" });
//     }

//     // Create Order in DB first with snapshot items
//     const order = new Order({
//       customer: customerId,
//       items: itemsToSave,
//       totalAmount: finalTotal,
//       paymentStatus: "pending",
//       shippingAddress: shippingAddress || undefined,
//       paymentMethod: paymentMethod || undefined,
//       paymentInfo: {},
//     });

//     try {
//       await order.save();
//       console.log("Order saved to DB:", order._id.toString());
//     } catch (errSave) {
//       console.error("Failed to save order to DB:", errSave);
//       return res.status(500).json({ error: "Failed to save order" });
//     }

//     // Create Razorpay order (lazily create client)
//     let razorpay;
//     try {
//       razorpay = createRazorpayClient();
//     } catch (err) {
//       console.error("Razorpay client error:", err.message);
//       return res.status(500).json({ error: "Razorpay configuration missing on server" });
//     }

//     const amountInPaise = Math.round(Number(finalTotal) * 100);
//     if (Number.isNaN(amountInPaise) || amountInPaise <= 0) {
//       console.warn("Invalid amount:", finalTotal, amountInPaise);
//       return res.status(400).json({ error: "Invalid totalAmount" });
//     }

//     let razorpayOrder;
//     try {
//       razorpayOrder = await razorpay.orders.create({
//         amount: amountInPaise,
//         currency,
//         receipt: String(order._id),
//         notes: {
//           appOrderId: order._id.toString(),
//         },
//       });
//       console.log("Razorpay order created:", razorpayOrder && razorpayOrder.id);
//     } catch (errRp) {
//       console.error("Razorpay orders.create failed:", errRp && (errRp.message || errRp));
//       // keep order in DB, but update paymentInfo.status = "razorpay_failed"
//       try {
//         order.paymentInfo = order.paymentInfo || {};
//         order.paymentInfo.razorpay = { status: "failed", error: String(errRp && errRp.message) };
//         await order.save();
//       } catch (err2) {
//         console.error("Failed to update order paymentInfo after razorpay failure:", err2);
//       }
//       return res.status(502).json({ error: "Razorpay order creation failed", details: String(errRp && errRp.message) });
//     }

//     // persist razorpay order id reference
//     try {
//       order.paymentInfo = order.paymentInfo || {};
//       order.paymentInfo.razorpay = {
//         orderId: razorpayOrder.id,
//         status: "created",
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//       };
//       await order.save();
//       console.log("Order updated with razorpay id:", razorpayOrder.id);
//     } catch (errUpdate) {
//       console.error("Failed to persist razorpay id to order:", errUpdate);
//       // non-fatal for client; still return details
//     }

//     // Return data client needs to proceed with Razorpay checkout
//     return res.json({
//       success: true,
//       key: process.env.RAZORPAY_KEY_ID,
//       orderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       appOrderId: order._id,
//     });
//   } catch (err) {
//     console.error("CREATE-ORDER unexpected error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * POST /api/checkout/verify-payment
//  * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, appOrderId }
//  * Verifies signature (HMAC-SHA256 using RAZORPAY_KEY_SECRET) and marks order paid.
//  */
// router.post("/verify-payment", async (req, res) => {
//   console.log("VERIFY-PAYMENT called");
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appOrderId } = req.body ?? {};
//     console.log("Verify payload:", { razorpay_order_id, razorpay_payment_id, appOrderId });

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ error: "Missing payment details" });
//     }

//     const keySecret = process.env.RAZORPAY_KEY_SECRET;
//     if (!keySecret) {
//       console.error("RAZORPAY_KEY_SECRET missing in env");
//       return res.status(500).json({ error: "Server configuration error" });
//     }

//     const hmac = crypto.createHmac("sha256", keySecret);
//     hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//     const generatedSignature = hmac.digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       console.warn("Signature mismatch:", { expected: generatedSignature, received: razorpay_signature });
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     // Find order by appOrderId (fallback: by razorpay order id inside paymentInfo)
//     let order = null;
//     if (appOrderId) {
//       order = await Order.findById(appOrderId);
//     }
//     if (!order) {
//       order = await Order.findOne({ "paymentInfo.razorpay.orderId": razorpay_order_id });
//     }

//     if (!order) {
//       console.warn("Order not found for verification:", { appOrderId, razorpay_order_id });
//       return res.status(404).json({ error: "Order not found" });
//     }

//     order.paymentStatus = "paid";
//     order.paymentInfo = order.paymentInfo || {};
//     order.paymentInfo.razorpay = {
//       ...order.paymentInfo.razorpay,
//       orderId: razorpay_order_id,
//       paymentId: razorpay_payment_id,
//       signature: razorpay_signature,
//       verifiedAt: new Date(),
//     };

//     await order.save();
//     console.log("Order marked paid:", order._id.toString());

//     return res.json({ success: true, orderId: order._id });
//   } catch (err) {
//     console.error("VERIFY-PAYMENT error:", err);
//     return res.status(500).json({ error: "Server error during verification" });
//   }
// });

// export default router;




// ************************************************************************



// backend/routes/checkout.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import User from "../models/user.js";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * Helper: create Razorpay client lazily (so server doesn't crash at import if env missing)
 */
function createRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("❌ Razorpay keys missing in .env (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * POST /api/checkout/create-order
 * Body: { customerId, items: [{ product: "<id>" | productId: "<id>", quantity }], currency? }
 */
router.post("/create-order", async (req, res) => {
  console.log("CREATE-ORDER called");
  try {
    const { customerId, items, currency = "INR", shippingAddress, paymentMethod } = req.body ?? {};

    console.log("Payload:", {
      customerId,
      itemsLength: Array.isArray(items) ? items.length : 0,
      currency,
    });

    if (!customerId) return res.status(400).json({ error: "customerId is required" });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "items must be a non-empty array" });

    const customer = await User.findById(customerId).lean().exec();
    if (!customer) {
      console.warn("Create order: customer not found", customerId);
      return res.status(400).json({ error: "Customer not found" });
    }

    const itemsToSave = [];
    let calculatedTotal = 0;

    for (const it of items) {
      const productId = it.product || it.productId || it.product_id;
      const qty = Number(it.quantity || it.qty || 1);

      if (!productId) {
        return res.status(400).json({ error: "Each item must include product (id) and quantity" });
      }

      const product = await Product.findById(productId).select("title image brand vendor price").lean();
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${productId}` });
      }

      const price = Number(product.price || 0);
      const itemTotal = price * qty;

      itemsToSave.push({
        product: product._id,
        vendor: product.vendor || null,
        quantity: qty,
        price,
        title: product.title,
        image: product.image,
        brand: product.brand,
      });

      calculatedTotal += itemTotal;
    }

    const deliveryFee = Number(req.body.deliveryFee || 0);
    const platformFee = Number(req.body.platformFee || 0);
    const discounts = Number(req.body.discounts || 0);
    const finalTotal = Number(calculatedTotal + deliveryFee + platformFee - discounts);

    if (finalTotal <= 0 || Number.isNaN(finalTotal)) {
      return res.status(400).json({ error: "Invalid calculated total" });
    }

    const order = new Order({
      customer: customerId,
      items: itemsToSave,
      totalAmount: finalTotal,
      paymentStatus: "pending",
      shippingAddress: shippingAddress || undefined,
      paymentMethod: paymentMethod || undefined,
      paymentInfo: {},
    });

    try {
      await order.save();
      console.log("Order saved to DB:", order._id.toString());
    } catch (errSave) {
      console.error("Failed to save order to DB:", errSave);
      return res.status(500).json({ error: "Failed to save order" });
    }

    let razorpay;
    try {
      razorpay = createRazorpayClient();
    } catch (err) {
      console.error("Razorpay client error:", err.message);
      return res.status(500).json({ error: "Razorpay configuration missing on server" });
    }

    const amountInPaise = Math.round(Number(finalTotal) * 100);
    if (Number.isNaN(amountInPaise) || amountInPaise <= 0) {
      console.warn("Invalid amount:", finalTotal, amountInPaise);
      return res.status(400).json({ error: "Invalid totalAmount" });
    }

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: String(order._id),
        notes: {
          appOrderId: order._id.toString(),
        },
      });
      console.log("Razorpay order created:", razorpayOrder && razorpayOrder.id);
    } catch (errRp) {
      console.error("Razorpay orders.create failed:", errRp && (errRp.message || errRp));
      try {
        order.paymentInfo = order.paymentInfo || {};
        order.paymentInfo.razorpay = { status: "failed", error: String(errRp && errRp.message) };
        await order.save();
      } catch (err2) {
        console.error("Failed to update order paymentInfo after razorpay failure:", err2);
      }
      return res.status(502).json({ error: "Razorpay order creation failed", details: String(errRp && errRp.message) });
    }

    try {
      order.paymentInfo = order.paymentInfo || {};
      order.paymentInfo.razorpay = {
        orderId: razorpayOrder.id,
        status: "created",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      };
      await order.save();
      console.log("Order updated with razorpay id:", razorpayOrder.id);
    } catch (errUpdate) {
      console.error("Failed to persist razorpay id to order:", errUpdate);
    }

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      appOrderId: order._id,
    });
  } catch (err) {
    console.error("CREATE-ORDER unexpected error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/checkout/verify-payment
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, appOrderId }
 * Idempotent: if order already paid, returns success again.
 */
router.post("/verify-payment", async (req, res) => {
  console.log("VERIFY-PAYMENT called");
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appOrderId } = req.body ?? {};
    console.log("Verify payload:", { razorpay_order_id, razorpay_payment_id, appOrderId });

    // Lookup order first
    let order = null;
    if (appOrderId) {
      order = await Order.findById(appOrderId);
    }
    if (!order && razorpay_order_id) {
      order = await Order.findOne({ "paymentInfo.razorpay.orderId": razorpay_order_id });
    }

    if (!order) {
      console.warn("Order not found for verification:", { appOrderId, razorpay_order_id });
      return res.status(404).json({ error: "Order not found" });
    }

    // If already paid → return success (idempotent)
    if (order.paymentStatus === "paid") {
      console.info("Order already paid, returning success:", order._id.toString());
      return res.json({ success: true, orderId: order._id, alreadyPaid: true });
    }

    // Validate Razorpay details
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("Missing payment details for order:", order._id.toString());
      return res.status(400).json({ error: "Missing payment details" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("RAZORPAY_KEY_SECRET missing in env");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.warn("Signature mismatch:", {
        expected: generatedSignature,
        received: razorpay_signature,
      });
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Mark order as paid
    order.paymentStatus = "paid";
    order.paymentInfo = order.paymentInfo || {};
    order.paymentInfo.razorpay = {
      ...order.paymentInfo.razorpay,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      verifiedAt: new Date(),
    };

    await order.save();
    console.log("Order marked paid:", order._id.toString());

    return res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error("VERIFY-PAYMENT error:", err);
    return res.status(500).json({ error: "Server error during verification" });
  }
});

export default router;
