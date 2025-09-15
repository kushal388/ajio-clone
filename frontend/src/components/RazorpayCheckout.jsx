// // frontend/src/components/RazorpayCheckout.jsx
// import React, { useState } from "react";

// /**
//  * RazorpayCheckout
//  *
//  * Props:
//  * - createOrderPayload: { customerId, items, totalAmount }  <-- required
//  * - onSuccess(order) optional callback when order verified on server
//  * - onError(err) optional callback
//  *
//  * Usage:
//  * <RazorpayCheckout createOrderPayload={payload} onSuccess={()=>{}} />
//  */
// export default function RazorpayCheckout({ createOrderPayload, onSuccess, onError }) {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState(null);

//   // load script helper
//   const loadRazorpayScript = () =>
//     new Promise((resolve, reject) => {
//       if (typeof window === "undefined") return reject(new Error("window missing"));
//       if (document.getElementById("razorpay-sdk")) return resolve();
//       const script = document.createElement("script");
//       script.id = "razorpay-sdk";
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       script.onload = () => resolve();
//       script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
//       document.body.appendChild(script);
//     });

//   const createAppOrderAndOpen = async () => {
//     setMsg(null);
//     setLoading(true);

//     try {
//       // 1) call backend to create order (your backend returns key, orderId, amount, appOrderId)
//       const res = await fetch("/api/checkout/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(createOrderPayload),
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || `Create order failed (${res.status})`);
//       }

//       const data = await res.json();

//       // expected data: { success, key, orderId, amount, currency, appOrderId }
//       const { key, orderId, amount, currency = "INR", appOrderId } = data;
//       if (!key || !orderId || !appOrderId) {
//         throw new Error("Invalid create-order response from server");
//       }

//       // 2) load Razorpay SDK
//       await loadRazorpayScript();

//       // 3) open checkout
//       const options = {
//         key,
//         amount, // in paise returned by server (eg 99800)
//         currency,
//         order_id: orderId,
//         name: "AJIO Clone",
//         description: "Order payment",
//         handler: async function (rsp) {
//           // rsp: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
//           try {
//             // send to backend for verification & to mark order paid
//             const verifyRes = await fetch("/api/checkout/verify-payment", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpay_order_id: rsp.razorpay_order_id,
//                 razorpay_payment_id: rsp.razorpay_payment_id,
//                 razorpay_signature: rsp.razorpay_signature,
//                 appOrderId,
//               }),
//             });

//             if (!verifyRes.ok) {
//               const errBody = await verifyRes.json().catch(() => ({}));
//               throw new Error(errBody.error || `Verification failed (${verifyRes.status})`);
//             }

//             const verifyData = await verifyRes.json();
//             setMsg("Payment verified ✅");
//             setLoading(false);
//             if (onSuccess) onSuccess(verifyData);
//           } catch (err) {
//             console.error("verify payment error:", err);
//             setMsg("Payment succeeded but verification failed. Check server logs.");
//             setLoading(false);
//             if (onError) onError(err);
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             setMsg("Payment cancelled");
//             setLoading(false);
//           },
//         },
//         prefill: {
//           name: createOrderPayload?.customerName || "",
//           email: createOrderPayload?.customerEmail || "",
//           contact: createOrderPayload?.customerPhone || "",
//         },
//       };

//       // optional: open checkout
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       setMsg(err.message || "Payment start failed");
//       setLoading(false);
//       if (onError) onError(err);
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={createAppOrderAndOpen}
//         disabled={loading}
//         className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 disabled:opacity-60"
//       >
//         {loading ? "Processing..." : "Pay Now"}
//       </button>

//       {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
//     </div>
//   );
// }








// *******************************************************

// frontend/src/components/RazorpayCheckout.jsx
import React, { useState, useRef } from "react";

/**
 * RazorpayCheckout
 *
 * Props:
 * - createOrderPayload: { customerId, items, totalAmount, customerName, customerEmail, customerPhone }  <-- required
 * - onSuccess(verifyDataOrRaw) optional callback when payment flow completes (may be server verify response or raw razorpay result)
 * - onError(err) optional callback
 *
 * Behavior:
 * - Creates app order via POST /api/checkout/create-order
 * - Opens Razorpay checkout
 * - On success, posts to /api/checkout/verify-payment
 * - Calls onSuccess(verifyData) after server verification (single call)
 */
export default function RazorpayCheckout({ createOrderPayload, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  // guard to avoid calling handler twice
  const handlerCalledRef = useRef(false);

  // load script helper
  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (typeof window === "undefined") return reject(new Error("window missing"));
      if (document.getElementById("razorpay-sdk")) return resolve();
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });

  const createAppOrderAndOpen = async () => {
    setMsg(null);
    setLoading(true);
    handlerCalledRef.current = false;

    try {
      // 1) call backend to create order
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createOrderPayload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Create order failed (${res.status})`);
      }

      const data = await res.json();

      // expected data: { success, key, orderId, amount, currency, appOrderId }
      const { key, orderId, amount, currency = "INR", appOrderId } = data;
      if (!key || !orderId) {
        throw new Error("Invalid create-order response from server");
      }

      // 2) load Razorpay SDK
      await loadRazorpayScript();

      // 3) open checkout
      const options = {
        key,
        amount, // in paise returned by server (eg 99800)
        currency,
        order_id: orderId,
        name: "AJIO Clone",
        description: "Order payment",
        handler: async function (rsp) {
          try {
            // ensure handler runs only once
            if (handlerCalledRef.current) {
              console.warn("Razorpay handler already called — ignoring duplicate");
              return;
            }
            handlerCalledRef.current = true;

            // rsp: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
            // 4) send to backend for verification & to mark order paid
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: rsp.razorpay_order_id,
                razorpay_payment_id: rsp.razorpay_payment_id,
                razorpay_signature: rsp.razorpay_signature,
                appOrderId,
              }),
            });

            if (!verifyRes.ok) {
              const errBody = await verifyRes.json().catch(() => ({}));
              throw new Error(errBody.error || `Verification failed (${verifyRes.status})`);
            }

            const verifyData = await verifyRes.json();

            // prefer to return server verification result to consumer
            setMsg("Payment verified ✅");
            setLoading(false);
            try {
              if (onSuccess) onSuccess(verifyData);
            } catch (err) {
              console.error("onSuccess threw:", err);
            }
          } catch (err) {
            console.error("verify payment error:", err);
            setMsg("Payment succeeded but verification failed. Check server logs.");
            setLoading(false);
            try {
              if (onError) onError(err);
            } catch (e) {
              console.error("onError threw:", e);
            }
          }
        },
        modal: {
          ondismiss: function () {
            // if checkout aborted, reset loading + msg
            if (!handlerCalledRef.current) {
              setMsg("Payment cancelled");
              setLoading(false);
            }
          },
        },
        prefill: {
          name: createOrderPayload?.customerName || "",
          email: createOrderPayload?.customerEmail || "",
          contact: createOrderPayload?.customerPhone || "",
        },
      };

      // Open Razorpay
      const rzp = new window.Razorpay(options);

      // Safety: ensure we don't accidentally call handler twice via events
      // Keep a local reference for 'payment.failed' as it may be emitted by Razorpay
      rzp.on("payment.failed", function (response) {
        if (handlerCalledRef.current) {
          console.warn("payment.failed after handler called — ignoring");
          return;
        }
        setMsg("Payment failed");
        setLoading(false);
        try {
          if (onError) onError(response);
        } catch (e) {
          console.error("onError threw:", e);
        }
      });

      rzp.open();
    } catch (err) {
      console.error("RazorpayCheckout failed:", err);
      setMsg(err.message || "Payment start failed");
      setLoading(false);
      try {
        if (onError) onError(err);
      } catch (e) {
        console.error("onError threw:", e);
      }
    }
  };

  return (
    <div>
      <button
        onClick={createAppOrderAndOpen}
        disabled={loading}
        className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 disabled:opacity-60"
      >
        {loading ? "Processing..." : `Pay ₹${(createOrderPayload?.totalAmount || 0).toFixed(2)}`}
      </button>

      {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
    </div>
  );
}
