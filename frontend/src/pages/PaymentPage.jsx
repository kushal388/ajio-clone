// // src/pages/PaymentPage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import axios from "axios";

// export default function PaymentPage() {
//   const { cart, clearCart } = useCart();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

//   // Totals (same as Cart/Shipping page)
//   const bagTotal = cart.reduce(
//     (s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)),
//     0
//   );
//   const bagDiscount = cart.reduce(
//     (s, i) =>
//       s +
//       Math.max(0, (Number(i.mrp || i.price || 0) - Number(i.price || 0))) *
//         Number(i.quantity || 1),
//     0
//   );
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   // Open Razorpay checkout
//   const handlePayment = async () => {
//     if (!cart.length) {
//       alert("Your cart is empty.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Step 1: Create order in backend
//       const { data } = await axios.post("http://localhost:5000/api/checkout/create-order", {
//         customerId: "dummy-user-id", // replace with logged-in user id
//         items: cart.map((item) => ({
//           product: item._id || item.productId,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//         totalAmount: orderTotal,
//       });

//       const { key, orderId, amount, currency, appOrderId } = data;

//       // Step 2: Open Razorpay popup
//       const options = {
//         key,
//         amount,
//         currency,
//         name: "Ajio Clone",
//         description: "Order Payment",
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             // Step 3: Verify payment
//             await axios.post("http://localhost:5000/api/checkout/verify-payment", {
//               ...response,
//               appOrderId,
//             });
//             alert("✅ Payment successful!");
//             clearCart();
//             navigate("/");
//           } catch (err) {
//             console.error(err);
//             alert("❌ Payment verification failed.");
//           }
//         },
//         prefill: {
//           name: "Customer Name",
//           email: "customer@example.com",
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#ffcc00",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Payment error", err);
//       alert("❌ Failed to initiate payment.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-4">
//       <h2 className="text-xl font-semibold mb-6">Payment</h2>

//       <div className="bg-white border rounded p-6 shadow">
//         <h3 className="text-lg font-medium mb-4">Order Summary</h3>
//         <div className="text-sm space-y-2">
//           <div className="flex justify-between">
//             <span>Bag Total</span>
//             <span>₹{bagTotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600">
//             <span>Bag Discount</span>
//             <span>-₹{bagDiscount.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery Fee</span>
//             <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Platform Fee</span>
//             <span>₹{platformFee}</span>
//           </div>
//           <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//             <span>Order Total</span>
//             <span>₹{orderTotal.toFixed(2)}</span>
//           </div>
//         </div>

//         <button
//           onClick={handlePayment}
//           disabled={loading}
//           className="mt-6 w-full bg-yellow-700 text-white py-3 rounded hover:bg-yellow-800 disabled:opacity-50"
//         >
//           {loading ? "Processing..." : "Proceed to Pay ₹" + orderTotal}
//         </button>
//       </div>
//     </div>
//   );
// }



// ******************************************************


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import RazorpayCheckout from "../components/RazorpayCheckout";
// import { useCart } from "../context/CartContext";
// import { useUser } from "../context/UserContext"; 
// // or from "../context/UserContext.jsx"
//  // if you have a hook; otherwise pass user props

// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();
//   const user = { id: "68bec17f4152f807985cc333", name: "John", email: "john@gmail.com", phone: "9606730783" }; // replace with real current user

//   // build items array for backend (backend expects items array with product, quantity, price, vendor optional)
//   const items = cart.map((c) => ({
//     product: c.productId ?? c._id ?? c.product?._id,
//     quantity: Number(c.quantity || 1),
//     price: Number(c.price || 0),
//     size: c.size || null,
//     vendor: c.vendorId || null,
//   }));

//   const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);

//   const payload = {
//     customerId: user.id,
//     customerName: user.name,
//     customerEmail: user.email,
//     customerPhone: user.phone,
//     items,
//     totalAmount,
//     currency: "INR",
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Payment</h2>

//       <div className="mb-6 p-4 border rounded">
//         <div className="mb-2">Amount to pay: ₹{totalAmount.toFixed(2)}</div>
//         <div className="text-sm text-gray-500">You will be redirected to Razorpay to complete payment.</div>
//       </div>

//       <RazorpayCheckout
//         createOrderPayload={payload}
//         onSuccess={(result) => {
//           // navigate to order success / order details
//           console.log("Payment verified result:", result);
//           navigate("/order-success"); // create this page or redirect to orders
//         }}
//         onError={(err) => {
//           console.error("Payment flow error:", err);
//           alert("Payment failed: " + (err.message || "unknown"));
//         }}
//       />
//     </div>
//   );
// }






// ******************************************************************
// src/pages/PaymentPage.jsx
// import React, { useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import RazorpayCheckout from "../components/RazorpayCheckout";
// import { useCart } from "../context/CartContext";
// import { useUser } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();


// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();
//   const { user } = useUser();

//   // If not signed in, prompt user to sign in (you could also open AuthModal)
//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Sign in to continue</h2>
//         <p className="mb-4 text-sm text-gray-600">
//           You must be signed in to complete the payment. Please sign in or create an account.
//         </p>
//         <div className="flex gap-3">
//           <button
//             onClick={() => window.dispatchEvent(new Event("open-auth-modal"))} // optional: your app can listen
//             className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
//           >
//             Sign In / Join
//           </button>
//           <button
//             onClick={() => navigate("/cart")}
//             className="px-4 py-2 border rounded text-gray-700"
//           >
//             Back to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Build items payload from cart
//   const items = useMemo(() => {
//     return cart.map((c) => ({
//       product: c.productId ?? c._id ?? (c.product && (c.product._id ?? c.product.productId)) ?? null,
//       quantity: Number(c.quantity || 1),
//       price: Number(c.price || 0),
//       size: c.size || null,
//       vendor: c.vendorId || null,
//       title: c.title || c.product?.title || "",
//       image: c.image || c.product?.image || "",
//     }));
//   }, [cart]);

//   const totalAmount = useMemo(() => {
//     return items.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
//   }, [items]);

//   // If cart is empty show friendly message
//   if (!items.length) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Your bag is empty</h2>
//         <p className="text-sm text-gray-600 mb-4">Add items to your bag before proceeding to payment.</p>
//         <button onClick={() => navigate("/")} className="px-4 py-2 bg-yellow-700 text-white rounded">
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   // Prepare payload for backend create-order
//   const payload = {
//     customerId: user._id ?? user.id ?? user.userId ?? null,
//     customerName: user.name ?? user.fullName ?? "",
//     customerEmail: user.email ?? "",
//     customerPhone: user.phone ?? "",
//     items,
//     totalAmount,
//     currency: "INR",
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Payments</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         <div className="space-y-6">
//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

//             <div className="space-y-4">
//               {items.map((it, idx) => (
//                 <div key={it.product ?? idx} className="flex items-center gap-4">
//                   <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                     {it.image ? (
//                       <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No image</div>
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <div className="text-sm font-semibold text-gray-900">{it.title || "Product"}</div>
//                     <div className="text-xs text-gray-500 mt-1">Qty: {it.quantity} • Size: {it.size || "—"}</div>
//                     <div className="text-sm text-gray-700 mt-2">₹{(it.price * it.quantity).toFixed(2)}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Payment</h3>
//             <p className="text-sm text-gray-600 mb-4">We use Razorpay (test mode) for payments during development.</p>

//             <div className="mb-4">
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Bag total</span>
//                 <span>₹{totalAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm text-green-600">
//                 <span>Bag discount</span>
//                 <span>-₹0.00</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Delivery fee</span>
//                 <span>₹99</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Platform fee</span>
//                 <span>₹29</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{(totalAmount + 99 + 29).toFixed(2)}</span>
//               </div>
//             </div>

//             <div>
//               <RazorpayCheckout
//                 createOrderPayload={payload}
//                 onSuccess={(result) => {
//                   // navigate to order-success or orders page (create /order-success page)
//                   navigate("/order-success");
//                 }}
//                 onError={(err) => {
//                   console.error("Payment error:", err);
//                   alert("Payment failed. Check console for details.");
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Summary</h4>
//             <div className="text-sm space-y-2">
//               <div className="flex justify-between">
//                 <span>Bag Total</span>
//                 <span>₹{totalAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-green-600">
//                 <span>Bag Discount</span>
//                 <span>-₹0.00</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Delivery Fee</span>
//                 <span>₹99</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Platform Fee</span>
//                 <span>₹29</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{(totalAmount + 99 + 29).toFixed(2)}</span>
//               </div>
//             </div>
//             <button onClick={() => navigate("/cart")} className="mt-4 w-full border py-2 rounded text-sm text-gray-700">Back to Cart</button>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }







// *********************************************   LAST WORKING          *********************************************************

// frontend/src/pages/PaymentPage.jsx
// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import RazorpayCheckout from "../components/RazorpayCheckout";
// import { useCart } from "../context/CartContext";
// import { useUser } from "../context/UserContext";
// import { api } from "../lib/api";

// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();
//   const { user } = useUser();
//   const [payLoading, setPayLoading] = useState(false);

//   // If not signed in, prompt user to sign in
//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Sign in to continue</h2>
//         <p className="mb-4 text-sm text-gray-600">
//           You must be signed in to complete the payment. Please sign in or create an account.
//         </p>
//         <div className="flex gap-3">
//           <button
//             onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
//             className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
//           >
//             Sign In / Join
//           </button>
//           <button
//             onClick={() => navigate("/cart")}
//             className="px-4 py-2 border rounded text-gray-700"
//           >
//             Back to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Build items payload from cart
//   const items = useMemo(() => {
//     return cart.map((c) => ({
//       product: c.productId ?? c._id ?? (c.product && (c.product._id ?? c.product.productId)) ?? null,
//       quantity: Number(c.quantity || 1),
//       price: Number(c.price || 0),
//       size: c.size || null,
//       vendor: c.vendorId || null,
//       title: c.title || c.product?.title || "",
//       image: c.image || c.product?.image || "",
//     }));
//   }, [cart]);

//   const totalAmount = useMemo(() => {
//     return items.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)) , 0);
//   }, [items]);

//   if (!items.length) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Your bag is empty</h2>
//         <p className="text-sm text-gray-600 mb-4">Add items to your bag before proceeding to payment.</p>
//         <button onClick={() => navigate("/")} className="px-4 py-2 bg-yellow-700 text-white rounded">
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   const payload = {
//     customerId: user._id ?? user.id ?? user.userId ?? null,
//     customerName: user.name ?? user.fullName ?? "",
//     customerEmail: user.email ?? "",
//     customerPhone: user.phone ?? "",
//     items,
//     totalAmount ,
//     currency: "INR",
//   };

//   async function handleRazorpaySuccess(result) {
//     try {
//       setPayLoading(true);
//       const payloadVerify = {
//         razorpay_order_id: result?.razorpay_order_id || result?.order_id || result?.razorpayOrderId,
//         razorpay_payment_id: result?.razorpay_payment_id || result?.payment_id || result?.razorpayPaymentId,
//         razorpay_signature: result?.razorpay_signature || result?.signature || result?.razorpay_signature,
//         appOrderId: result?.appOrderId || result?.receipt || null,
//       };

//       const resp = await api.post("/api/checkout/verify-payment", payloadVerify);

//       if (resp?.success) {
//         const appOrderId = resp.orderId || resp.appOrderId || payloadVerify.appOrderId;
//         if (appOrderId) {
//           navigate(`/order-success/${appOrderId}`);
//           return;
//         }
//         // fallback
//         navigate("/order-success");
//       } else {
//         console.error("verify-payment failed", resp);
//         alert("Payment verification failed on server. Check console.");
//       }
//     } catch (err) {
//       console.error("Error verifying payment", err);
//       alert("Payment verification failed. See console for details.");
//     } finally {
//       setPayLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Payments</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         <div className="space-y-6">
//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
//             <div className="space-y-4">
//               {items.map((it, idx) => (
//                 <div key={it.product ?? idx} className="flex items-center gap-4">
//                   <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                     {it.image ? (
//                       <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No image</div>
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <div className="text-sm font-semibold text-gray-900">{it.title || "Product"}</div>
//                     <div className="text-xs text-gray-500 mt-1">Qty: {it.quantity} • Size: {it.size || "—"}</div>
//                     <div className="text-sm text-gray-700 mt-2">₹{(it.price * it.quantity).toFixed(2)}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Payment</h3>
//             <p className="text-sm text-gray-600 mb-4">We use Razorpay (test mode) for payments during development.</p>
//             <div className="mb-4">
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Bag total</span>
//                 <span>₹{totalAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm text-green-600">
//                 <span>Bag discount</span>
//                 <span>-₹0.00</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Delivery fee</span>
//                 <span>₹99</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Platform fee</span>
//                 <span>₹29</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{(totalAmount + 99 + 29).toFixed(2)}</span>
//               </div>
//             </div>

//             <div>
//               {/* <RazorpayCheckout
//                 createOrderPayload={payload}
//                 onSuccess={handleRazorpaySuccess}
//                 onError={(err) => {
//                   console.error("Payment error:", err);
//                   alert("Payment failed. Check console for details.");
//                 }}
//               /> */}

//               <RazorpayCheckout
//                             createOrderPayload={payload}
//                             onSuccess={(result) => {
//                               // result should contain the appOrderId that your backend returned when creating order
//                               const appId = result?.appOrderId || result?.orderId || result?._id || result?.order?._id;
//                               if (appId) {
//                                 navigate(`/order-success/${appId}`);
//                               } else {
//                                 // fallback to general page but better to log
//                                 console.warn("Payment success but app order id missing:", result);
//                                 navigate("/order-success");
//                               }
//                             }}
//                             onError={(err) => {
//                               console.error("Payment error:", err);
//                               alert("Payment failed. Check console for details.");
//                             }}
//                           />




//               {payLoading && <div className="mt-2 text-sm text-gray-600">Verifying payment…</div>}
//             </div>
//           </div>
//         </div>

//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Summary</h4>
//             <div className="text-sm space-y-2">
//               <div className="flex justify-between">
//                 <span>Bag Total</span>
//                 <span>₹{totalAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-green-600">
//                 <span>Bag Discount</span>
//                 <span>-₹0.00</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Delivery Fee</span>
//                 <span>₹99</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Platform Fee</span>
//                 <span>₹29</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{(totalAmount + 99 + 29).toFixed(2)}</span>
//               </div>
//             </div>
//             <button onClick={() => navigate("/cart")} className="mt-4 w-full border py-2 rounded text-sm text-gray-700">Back to Cart</button>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }



// ************************************************** {temp } ****************************************************


// frontend/src/pages/PaymentPage.jsx
// import React, { useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import RazorpayCheckout from "../components/RazorpayCheckout";
// import { useCart } from "../context/CartContext";
// import { useUser } from "../context/UserContext";
// import { api } from "../lib/api";

// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cart } = useCart();
//   const { user } = useUser();
//   const [payLoading, setPayLoading] = useState(false);

//   const { bagTotal = 0, bagDiscount = 0, deliveryFee = 0, platformFee = 0, orderTotal = 0, shippingAddress = null } =
//     location.state || {};

//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Sign in to continue</h2>
//         <p className="mb-4 text-sm text-gray-600">You must be signed in to complete the payment.</p>
//         <button onClick={() => window.dispatchEvent(new Event("open-auth-modal"))} className="px-4 py-2 bg-yellow-700 text-white rounded">
//           Sign In / Join
//         </button>
//       </div>
//     );
//   }

//   const items = useMemo(() => {
//     return cart.map((c) => ({
//       product: c.productId ?? c._id ?? (c.product && (c.product._id ?? c.product.productId)) ?? null,
//       quantity: Number(c.quantity || 1),
//       price: Number(c.price || 0),
//       size: c.size || null,
//       vendor: c.vendorId || null,
//       title: c.title || c.product?.title || "",
//       image: c.image || c.product?.image || "",
//     }));
//   }, [cart]);

//   const payload = {
//     customerId: user._id ?? user.id ?? user.userId ?? null,
//     customerName: user.name ?? user.fullName ?? "",
//     customerEmail: user.email ?? "",
//     customerPhone: user.phone ?? "",
//     items,
//     currency: "INR",
//     deliveryFee,
//     platformFee,
//     discounts: bagDiscount,
//     shippingAddress,
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Payments</h2>
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         {/* Order Summary left side unchanged */}
//         <div className="space-y-6">
//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Payment</h3>
//             <div className="mb-4">
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Bag total</span>
//                 <span>₹{bagTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm text-green-600">
//                 <span>Bag discount</span>
//                 <span>-₹{bagDiscount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Delivery fee</span>
//                 <span>₹{deliveryFee}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Platform fee</span>
//                 <span>₹{platformFee}</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{orderTotal.toFixed(2)}</span>
//               </div>
//             </div>

//             <RazorpayCheckout
//               createOrderPayload={payload}
//               onSuccess={(result) => {
//                 const appId = result?.appOrderId || result?.orderId || result?._id;
//                 if (appId) {
//                   navigate(`/order-success/${appId}`);
//                 } else {
//                   navigate("/order-success");
//                 }
//               }}
//               onError={(err) => {
//                 console.error("Payment error:", err);
//                 alert("Payment failed. Check console for details.");
//               }}
//             />
//             {payLoading && <div className="mt-2 text-sm text-gray-600">Verifying payment…</div>}
//           </div>
//         </div>

//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Summary</h4>
//             <div className="text-sm space-y-2">
//               <div className="flex justify-between"><span>Bag Total</span><span>₹{bagTotal.toFixed(2)}</span></div>
//               <div className="flex justify-between text-green-600"><span>Bag Discount</span><span>-₹{bagDiscount.toFixed(2)}</span></div>
//               <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
//               <div className="flex justify-between"><span>Platform Fee</span><span>₹{platformFee}</span></div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3"><span>Order Total</span><span>₹{orderTotal.toFixed(2)}</span></div>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }



// ******************************************************************************************


// frontend/src/pages/PaymentPage.jsx
// import React, { useMemo, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import RazorpayCheckout from "../components/RazorpayCheckout";
// import { useCart } from "../context/CartContext";
// import { useUser } from "../context/UserContext";
// import { api } from "../lib/api";

// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cart } = useCart();
//   const { user } = useUser();
//   const [payLoading, setPayLoading] = useState(false);

//   // Prefer values passed from Shipping page via navigate("/payment", { state })
//   // If not present, fall back to computing from cart (keeps compatibility).
//   const {
//     bagTotal: passedBagTotal,
//     bagDiscount: passedBagDiscount,
//     deliveryFee: passedDeliveryFee,
//     platformFee: passedPlatformFee,
//     orderTotal: passedOrderTotal,
//     shippingAddress: passedShippingAddress,
//   } = location.state || {};

//   // Build items payload from cart (we still send items so backend can snapshot)
//   const items = useMemo(() => {
//     return cart.map((c) => ({
//       product: c.productId ?? c._id ?? (c.product && (c.product._id ?? c.product.productId)) ?? null,
//       quantity: Number(c.quantity || 1),
//       price: Number(c.price || 0),
//       size: c.size || null,
//       vendor: c.vendorId || null,
//       title: c.title || c.product?.title || "",
//       image: c.image || c.product?.image || "",
//     }));
//   }, [cart]);

//   // Compute bag totals from cart only if no passed values exist
//   const computedBagTotal = useMemo(() => {
//     return items.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
//   }, [items]);

//   const computedBagDiscount = 0; // keep behavior simple; adjust if you have discount logic

//   const bagTotal = typeof passedBagTotal === "number" ? passedBagTotal : computedBagTotal;
//   const bagDiscount = typeof passedBagDiscount === "number" ? passedBagDiscount : computedBagDiscount;
//   const deliveryFee = typeof passedDeliveryFee === "number" ? passedDeliveryFee : (bagTotal > 1000 ? 0 : 99);
//   const platformFee = typeof passedPlatformFee === "number" ? passedPlatformFee : (items.length > 0 ? 29 : 0);
//   const orderTotal =
//     typeof passedOrderTotal === "number" ? passedOrderTotal : (bagTotal + deliveryFee + platformFee - bagDiscount);

//   const shippingAddress = passedShippingAddress || null;

//   // If not signed in, prompt user to sign in
//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Sign in to continue</h2>
//         <p className="mb-4 text-sm text-gray-600">
//           You must be signed in to complete the payment. Please sign in or create an account.
//         </p>
//         <div className="flex gap-3">
//           <button
//             onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
//             className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
//           >
//             Sign In / Join
//           </button>
//           <button
//             onClick={() => navigate("/cart")}
//             className="px-4 py-2 border rounded text-gray-700"
//           >
//             Back to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Build payload to send to backend create-order.
//   // Important: include deliveryFee/platformFee/discounts/shippingAddress so backend computes final total
//   // server-side (this keeps server authoritative). We also include items so backend snapshots product info.
//   const payload = {
//     customerId: user._id ?? user.id ?? user.userId ?? null,
//     customerName: user.name ?? user.fullName ?? "",
//     customerEmail: user.email ?? "",
//     customerPhone: user.phone ?? "",
//     items,
//     currency: "INR",
//     // Send the fees/discounts the shipping page decided on:
//     deliveryFee,
//     platformFee,
//     discounts: bagDiscount,
//     shippingAddress,
//     // optionally include a client-side computed total for debugging/traceability (server still authoritative)
//     clientCalculatedTotal: orderTotal,
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Payments</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         <div className="space-y-6">
//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
//             <div className="space-y-4">
//               {items.map((it, idx) => (
//                 <div key={it.product ?? idx} className="flex items-center gap-4">
//                   <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                     {it.image ? (
//                       <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No image</div>
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <div className="text-sm font-semibold text-gray-900">{it.title || "Product"}</div>
//                     <div className="text-xs text-gray-500 mt-1">Qty: {it.quantity} • Size: {it.size || "—"}</div>
//                     <div className="text-sm text-gray-700 mt-2">₹{(it.price * it.quantity).toFixed(2)}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Payment</h3>
//             <p className="text-sm text-gray-600 mb-4">We use Razorpay (test mode) for payments during development.</p>
//             <div className="mb-4">
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Bag total</span>
//                 <span>₹{bagTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm text-green-600">
//                 <span>Bag discount</span>
//                 <span>-₹{bagDiscount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Delivery fee</span>
//                 <span>₹{deliveryFee}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Platform fee</span>
//                 <span>₹{platformFee}</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{orderTotal.toFixed(2)}</span>
//               </div>
//             </div>

//             <div>
//               <RazorpayCheckout
//                 createOrderPayload={payload}
//                 onSuccess={(result) => {
//                   // prefer appOrderId returned by backend create-order/verify flows
//                   const appId = result?.appOrderId || result?.orderId || result?._id;
//                   if (appId) {
//                     navigate(`/order-success/${appId}`);
//                   } else {
//                     navigate("/order-success");
//                   }
//                 }}
//                 onError={(err) => {
//                   console.error("Payment error:", err);
//                   alert("Payment failed. Check console for details.");
//                 }}
//               />

//               {payLoading && <div className="mt-2 text-sm text-gray-600">Verifying payment…</div>}
//             </div>
//           </div>
//         </div>

//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Summary</h4>
//             <div className="text-sm space-y-2">
//               <div className="flex justify-between">
//                 <span>Bag Total</span>
//                 <span>₹{bagTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-green-600">
//                 <span>Bag Discount</span>
//                 <span>-₹{bagDiscount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Delivery Fee</span>
//                 <span>₹{deliveryFee}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Platform Fee</span>
//                 <span>₹{platformFee}</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{orderTotal.toFixed(2)}</span>
//               </div>
//             </div>

//             <button onClick={() => navigate("/cart")} className="mt-4 w-full border py-2 rounded text-sm text-gray-700">
//               Back to Cart
//             </button>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }



// **********************************************************************************


// frontend/src/pages/PaymentPage.jsx
// import React, { useMemo, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import RazorpayCheckout from "../components/RazorpayCheckout";
// import { useCart } from "../context/CartContext";
// import { useUser } from "../context/UserContext";
// import { api } from "../lib/api";

// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cart } = useCart();
//   const { user } = useUser();
//   const [payLoading, setPayLoading] = useState(false);

//   // Keep shipping address passed from Shipping page, but ignore any totals passed there.
//   const { shippingAddress: passedShippingAddress } = location.state || {};

//   // Build items payload from cart (we still send items so backend can snapshot)
//   const items = useMemo(() => {
//     return cart.map((c) => ({
//       product: c.productId ?? c._id ?? (c.product && (c.product._id ?? c.product.productId)) ?? null,
//       quantity: Number(c.quantity || 1),
//       price: Number(c.price || 0),
//       size: c.size || null,
//       vendor: c.vendorId || null,
//       title: c.title || c.product?.title || "",
//       image: c.image || c.product?.image || "",
//     }));
//   }, [cart]);

//   // ALWAYS compute totals from the cart (this enforces cart as the single source of truth)
//   const bagTotal = useMemo(() => {
//     return items.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
//   }, [items]);

//   // You said earlier bagDiscount logic is simple/unused — keep same approach.
//   const bagDiscount = 0; // adjust if you have discount logic elsewhere

//   // Business rules for fees (same as your earlier code)
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = items.length > 0 ? 29 : 0;

//   // Final order total computed from cart-based values
//   const orderTotal = bagTotal + deliveryFee + platformFee - bagDiscount;

//   // If not signed in, prompt user to sign in
//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Sign in to continue</h2>
//         <p className="mb-4 text-sm text-gray-600">
//           You must be signed in to complete the payment. Please sign in or create an account.
//         </p>
//         <div className="flex gap-3">
//           <button
//             onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
//             className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
//           >
//             Sign In / Join
//           </button>
//           <button
//             onClick={() => navigate("/cart")}
//             className="px-4 py-2 border rounded text-gray-700"
//           >
//             Back to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Build payload to send to backend create-order.
//   const payload = {
//     customerId: user._id ?? user.id ?? user.userId ?? null,
//     customerName: user.name ?? user.fullName ?? "",
//     customerEmail: user.email ?? "",
//     customerPhone: user.phone ?? "",
//     items,
//     currency: "INR",
//     // fees/discounts computed from cart
//     deliveryFee,
//     platformFee,
//     discounts: bagDiscount,
//     shippingAddress: passedShippingAddress || null,
//     clientCalculatedTotal: orderTotal, // for debugging/traceability; server still authoritative
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Payments</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         <div className="space-y-6">
//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
//             <div className="space-y-4">
//               {items.map((it, idx) => (
//                 <div key={it.product ?? idx} className="flex items-center gap-4">
//                   <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                     {it.image ? (
//                       <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No image</div>
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <div className="text-sm font-semibold text-gray-900">{it.title || "Product"}</div>
//                     <div className="text-xs text-gray-500 mt-1">Qty: {it.quantity} • Size: {it.size || "—"}</div>
//                     <div className="text-sm text-gray-700 mt-2">₹{(it.price * it.quantity).toFixed(2)}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Payment</h3>
//             <p className="text-sm text-gray-600 mb-4">We use Razorpay (test mode) for payments during development.</p>
//             <div className="mb-4">
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Bag total</span>
//                 <span>₹{bagTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm text-green-600">
//                 <span>Bag discount</span>
//                 <span>-₹{bagDiscount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Delivery fee</span>
//                 <span>₹{deliveryFee}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Platform fee</span>
//                 <span>₹{platformFee}</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{orderTotal.toFixed(2)}</span>
//               </div>
//             </div>

//             <div>
//               <RazorpayCheckout
//                 createOrderPayload={payload}
//                 onSuccess={(result) => {
//                   // prefer appOrderId returned by backend create-order/verify flows
//                   const appId = result?.appOrderId || result?.orderId || result?._id;
//                   if (appId) {
//                     navigate(`/order-success/${appId}`);
//                   } else {
//                     navigate("/order-success");
//                   }
//                 }}
//                 onError={(err) => {
//                   console.error("Payment error:", err);
//                   alert("Payment failed. Check console for details.");
//                 }}
//               />

//               {payLoading && <div className="mt-2 text-sm text-gray-600">Verifying payment…</div>}
//             </div>
//           </div>
//         </div>

//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Summary</h4>
//             <div className="text-sm space-y-2">
//               <div className="flex justify-between">
//                 <span>Bag Total</span>
//                 <span>₹{bagTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-green-600">
//                 <span>Bag Discount</span>
//                 <span>-₹{bagDiscount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Delivery Fee</span>
//                 <span>₹{deliveryFee}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Platform Fee</span>
//                 <span>₹{platformFee}</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{orderTotal.toFixed(2)}</span>
//               </div>
//             </div>

//             <button onClick={() => navigate("/cart")} className="mt-4 w-full border py-2 rounded text-sm text-gray-700">
//               Back to Cart
//             </button>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }



// *************************************************************************


// frontend/src/pages/PaymentPage.jsx
// import React, { useMemo, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import RazorpayCheckout from "../components/RazorpayCheckout";
// import { useCart } from "../context/CartContext";
// import { useUser } from "../context/UserContext";
// import { api } from "../lib/api";

// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cart } = useCart();
//   const { user } = useUser();
//   const [payLoading, setPayLoading] = useState(false);

//   const shippingAddress = location.state?.shippingAddress || null;

//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Sign in to continue</h2>
//         <p className="mb-4 text-sm text-gray-600">
//           You must be signed in to complete the payment.
//         </p>
//         <div className="flex gap-3">
//           <button
//             onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
//             className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
//           >
//             Sign In / Join
//           </button>
//           <button
//             onClick={() => navigate("/cart")}
//             className="px-4 py-2 border rounded text-gray-700"
//           >
//             Back to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Items payload
//   const items = useMemo(() => {
//     return cart.map((c) => ({
//       product:
//         c.productId ??
//         c._id ??
//         (c.product && (c.product._id ?? c.product.productId)) ??
//         null,
//       quantity: Number(c.quantity || 1),
//       price: Number(c.price || 0),
//       size: c.size || null,
//       vendor: c.vendorId || null,
//       title: c.title || c.product?.title || "",
//       image: c.image || c.product?.image || "",
//     }));
//   }, [cart]);

//   // Totals (no discount)
//   const bagTotal = items.reduce(
//     (s, i) => s + Number(i.price || 0) * Number(i.quantity || 1),
//     0
//   );
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = items.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   if (!items.length) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-4">Your bag is empty</h2>
//         <p className="text-sm text-gray-600 mb-4">
//           Add items to your bag before proceeding to payment.
//         </p>
//         <button
//           onClick={() => navigate("/")}
//           className="px-4 py-2 bg-yellow-700 text-white rounded"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   const payload = {
//     customerId: user._id ?? user.id ?? user.userId ?? null,
//     customerName: user.name ?? user.fullName ?? "",
//     customerEmail: user.email ?? "",
//     customerPhone: user.phone ?? "",
//     items,
//     totalAmount: orderTotal,
//     currency: "INR",
//     deliveryFee,
//     platformFee,
//     shippingAddress,
//   };

//   async function handleRazorpaySuccess(result) {
//     try {
//       setPayLoading(true);
//       const payloadVerify = {
//         razorpay_order_id:
//           result?.razorpay_order_id || result?.order_id || result?.razorpayOrderId,
//         razorpay_payment_id:
//           result?.razorpay_payment_id ||
//           result?.payment_id ||
//           result?.razorpayPaymentId,
//         razorpay_signature:
//           result?.razorpay_signature ||
//           result?.signature ||
//           result?.razorpay_signature,
//         appOrderId: result?.appOrderId || result?.receipt || null,
//       };

//       const resp = await api.post("/api/checkout/verify-payment", payloadVerify);

//       if (resp?.success) {
//         const appOrderId = resp.orderId || resp.appOrderId || payloadVerify.appOrderId;
//         if (appOrderId) {
//           navigate(`/order-success/${appOrderId}`);
//           return;
//         }
//         navigate("/order-success");
//       } else {
//         alert("Payment verification failed on server.");
//       }
//     } catch (err) {
//       console.error("Error verifying payment", err);
//       alert("Payment verification failed. See console for details.");
//     } finally {
//       setPayLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Payments</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         <div className="space-y-6">
//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
//             <div className="space-y-4">
//               {items.map((it, idx) => (
//                 <div key={it.product ?? idx} className="flex items-center gap-4">
//                   <div className="w-20 h-24 rounded overflow-hidden border bg-gray-50">
//                     {it.image ? (
//                       <img
//                         src={it.image}
//                         alt={it.title}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center text-sm text-gray-500 w-full h-full">
//                         No image
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-sm font-semibold text-gray-900">
//                       {it.title || "Product"}
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       Qty: {it.quantity} • Size: {it.size || "—"}
//                     </div>
//                     <div className="text-sm text-gray-700 mt-2">
//                       ₹{(it.price * it.quantity).toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold mb-3">Payment</h3>
//             <div className="mb-4">
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Bag total</span>
//                 <span>₹{bagTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Delivery fee</span>
//                 <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Platform fee</span>
//                 <span>₹{platformFee}</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{orderTotal.toFixed(2)}</span>
//               </div>
//             </div>

//            <RazorpayCheckout
//                     createOrderPayload={payload}
//                     onSuccess={(result) => {
//                       // result already comes after verification ✅
//                       const appId = result?.orderId || result?.appOrderId || result?._id;
//                       if (appId) {
//                         navigate(`/order-success/${appId}`);
//                       } else {
//                         navigate("/order-success");
//                       }
//                     }}
//                     onError={(err) => {
//                       console.error("Payment error:", err);
//                       alert("Payment failed. Check console for details.");
//                     }}
//                   />


//             {payLoading && (
//               <div className="mt-2 text-sm text-gray-600">Verifying payment…</div>
//             )}
//           </div>
//         </div>

//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Summary</h4>
//             <div className="text-sm space-y-2">
//               <div className="flex justify-between">
//                 <span>Bag Total</span>
//                 <span>₹{bagTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Delivery Fee</span>
//                 <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Platform Fee</span>
//                 <span>₹{platformFee}</span>
//               </div>
//               <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//                 <span>Order Total</span>
//                 <span>₹{orderTotal.toFixed(2)}</span>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate("/cart")}
//               className="mt-4 w-full border py-2 rounded text-sm text-gray-700"
//             >
//               Back to Cart
//             </button>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }




// *****************************************************************************

// frontend/src/pages/PaymentPage.jsx
// frontend/src/pages/PaymentPage.jsx
// frontend/src/pages/PaymentPage.jsx
import React, { useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RazorpayCheckout from "../components/RazorpayCheckout";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { api } from "../lib/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const [payLoading, setPayLoading] = useState(false);

  // Prevent duplicate handling of success
  const processingRef = useRef(false);

  const shippingAddress = location.state?.shippingAddress || null;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Sign in to continue</h2>
        <p className="mb-4 text-sm text-gray-600">
          You must be signed in to complete the payment.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
            className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
          >
            Sign In / Join
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 border rounded text-gray-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // Items payload
  const items = useMemo(() => {
    return cart.map((c) => ({
      product:
        c.productId ?? c._id ?? (c.product && (c.product._id ?? c.product.productId)) ?? null,
      quantity: Number(c.quantity || 1),
      price: Number(c.price || 0),
      size: c.size || null,
      vendor: c.vendorId || null,
      title: c.title || c.product?.title || "",
      image: c.image || c.product?.image || "",
    }));
  }, [cart]);

  // Totals (no discount)
  const bagTotal = items.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.quantity || 1),
    0
  );
  // const deliveryFee = bagTotal > 1000 ? 0 : 99;
  const deliveryFee =  bagTotal > 1000 ? 99 : 99;
  const platformFee = items.length > 0 ? 29 : 0;
  const orderTotal = bagTotal + deliveryFee + platformFee;

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Your bag is empty</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add items to your bag before proceeding to payment.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-yellow-700 text-white rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const payload = {
    customerId: user._id ?? user.id ?? user.userId ?? null,
    customerName: user.name ?? user.fullName ?? "",
    customerEmail: user.email ?? "",
    customerPhone: user.phone ?? "",
    items,
    totalAmount: orderTotal,
    currency: "INR",
    deliveryFee,
    platformFee,
    shippingAddress,
  };

  /**
   * handleRazorpaySuccess accepts either:
   * - server verify response (e.g. { success: true, orderId: ... })
   * OR
   * - raw razorpay result (e.g. { razorpay_order_id, razorpay_payment_id, razorpay_signature, appOrderId })
   *
   * It will:
   * - if not verified, call /api/checkout/verify-payment
   * - on success: call clearCart(), then navigate to /order-success/:id (or fallback /order-success)
   */
  async function handleRazorpaySuccess(result) {
    try {
      console.info("[PaymentPage] onSuccess called with:", result);

      if (processingRef.current) {
        console.warn("[PaymentPage] Duplicate success call ignored");
        return;
      }
      processingRef.current = true;
      setPayLoading(true);

      // If result looks like server-verified response (has success:true) treat as already verified
      const isServerVerified =
        result && (result.success === true || result?.alreadyPaid === true || result?.orderId || result?.order_id);

      if (isServerVerified) {
        console.info("[PaymentPage] Received server verify response:", result);
        // attempt to clear cart and navigate
        try {
          await clearCart();
        } catch (err) {
          console.warn("[PaymentPage] clearCart failed (non-fatal):", err);
        }

        const finalOrderId = result.orderId || result.order_id || result.appOrderId || null;
        if (finalOrderId) {
          navigate(`/order-success/${finalOrderId}`);
        } else {
          navigate("/order-success");
        }
        return;
      }

      // Otherwise assume result is raw razorpay result (handler from Razorpay) and verify it
      const razorpay_order_id =
        result?.razorpay_order_id || result?.order_id || result?.razorpayOrderId || undefined;
      const razorpay_payment_id =
        result?.razorpay_payment_id || result?.payment_id || result?.razorpayPaymentId || undefined;
      const razorpay_signature =
        result?.razorpay_signature || result?.signature || undefined;
      const appOrderId = result?.appOrderId || result?.receipt || result?.orderId || null;

      // Basic validation
      if (!razorpay_order_id && !razorpay_payment_id && !razorpay_signature && !appOrderId) {
        console.warn("[PaymentPage] Received empty/invalid raw result; ignoring", result);
        return;
      }

      const payloadVerify = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        appOrderId,
      };

      console.info("[PaymentPage] sending verify-payment:", payloadVerify);
      const resp = await api.post("/api/checkout/verify-payment", payloadVerify);
      console.info("[PaymentPage] verify response raw:", resp);

      const serverResp = resp?.data ?? resp;
      if (serverResp?.success) {
        console.info("[PaymentPage] verify-payment success:", serverResp);
        try {
          await clearCart();
        } catch (err) {
          console.warn("[PaymentPage] clearCart failed (non-fatal):", err);
        }

        const finalOrderId = serverResp.orderId || serverResp.order_id || payloadVerify.appOrderId || null;
        if (finalOrderId) {
          navigate(`/order-success/${finalOrderId}`);
        } else {
          navigate("/order-success");
        }
        return;
      }

      console.warn("[PaymentPage] verify-payment returned failure or unexpected shape:", serverResp);
      alert("Payment verification failed on server.");
    } catch (err) {
      console.error("[PaymentPage] Error handling payment success:", err);
      alert("Payment verification failed. See console for details.");
    } finally {
      processingRef.current = false;
      setPayLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Payments</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="bg-white border rounded p-6">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="space-y-4">
              {items.map((it, idx) => (
                <div key={it.product ?? idx} className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded overflow-hidden border bg-gray-50">
                    {it.image ? (
                      <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center text-sm text-gray-500 w-full h-full">No image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{it.title || "Product"}</div>
                    <div className="text-xs text-gray-500 mt-1">Qty: {it.quantity} • Size: {it.size || "—"}</div>
                    <div className="text-sm text-gray-700 mt-2">₹{(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded p-6">
            <h3 className="text-lg font-semibold mb-3">Payment</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Bag total</span>
                <span>₹{bagTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery fee</span>
                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                 {/* <span>{deliveryFee === `₹${deliveryFee}`}</span> */}
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-3 mt-3">
                <span>Order Total</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <RazorpayCheckout
              createOrderPayload={payload}
              onSuccess={handleRazorpaySuccess}
              onError={(err) => {
                console.error("[PaymentPage] Payment error:", err);
                alert("Payment failed. Check console for details.");
              }}
            />

            {payLoading && (
              <div className="mt-2 text-sm text-gray-600">Verifying payment…</div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-[320px]">
          <div className="bg-white border rounded p-5 sticky top-20">
            <h4 className="text-sm font-semibold mb-3">Summary</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Bag Total</span>
                <span>₹{bagTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-3 mt-3">
                <span>Order Total</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="mt-4 w-full border py-2 rounded text-sm text-gray-700"
            >
              Back to Cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
