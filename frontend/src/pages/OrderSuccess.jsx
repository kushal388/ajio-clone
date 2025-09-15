// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";

// /**
//  * OrderSuccess.jsx
//  *
//  * Fetches order details and renders a friendly order-success page.
//  * Assumes backend returns an order object similar to:
//  * {
//  *   _id,
//  *   items: [{ product, title, image, price, quantity }],
//  *   totalAmount,
//  *   paymentStatus,
//  *   paymentInfo: { razorpay: { paymentId, orderId } } OR { method, id },
//  *   customer: { name, phone },
//  *   shippingAddress: { name, address, phone, label },
//  *   createdAt
//  * }
//  *
//  * If your API shape differs, adapt the fields mapping below.
//  */

// function formatCurrency(n = 0) {
//   return Number(n).toLocaleString("en-IN", { style: "currency", currency: "INR" });
// }
// function formatDate(iso) {
//   try {
//     return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
//   } catch (e) {
//     return iso;
//   }
// }
// function estimateDelivery(createdAt, days = 4) {
//   const d = new Date(createdAt || Date.now());
//   d.setDate(d.getDate() + days);
//   const to = new Date(createdAt || Date.now());
//   to.setDate(to.getDate() + days + 3);
//   const fmt = (x) => x.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
//   return `${fmt(d)} - ${fmt(to)}`;
// }

// export default function OrderSuccess() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     let cancelled = false;
//     async function fetchOrder() {
//       setLoading(true);
//       setErr("");
//       try {
//         // Try common endpoints; change to your specific endpoint if needed
//         const tries = [
//           `/api/orders/${id}`,
//           `/api/checkout/order/${id}`,
//           `/api/checkout/${id}`
//         ];

//         let resJson = null;
//         for (const url of tries) {
//           try {
//             const resp = await fetch(url, { credentials: "include" });
//             if (!resp.ok) {
//               // try next
//               continue;
//             }
//             resJson = await resp.json();
//             // break if we got something useful
//             if (resJson) break;
//           } catch (e) {
//             // network / parse error, try next
//             continue;
//           }
//         }

//         if (!resJson) {
//           throw new Error("Order not found on server");
//         }

//         // Some APIs return { order: {...} } or the order directly
//         const ord = resJson.order ?? resJson.data ?? resJson;
//         if (!ord || (!ord._id && !ord.id)) {
//           throw new Error("Invalid order data returned");
//         }

//         if (!cancelled) setOrder(ord);
//       } catch (e) {
//         if (!cancelled) setErr(e.message || "Failed to load order");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     if (!id) {
//       setErr("Missing order id");
//       setLoading(false);
//     } else {
//       fetchOrder();
//     }
//     return () => { cancelled = true; };
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="max-w-5xl mx-auto py-12 px-4 text-center">
//         <div className="text-gray-600">Loading order details…</div>
//       </div>
//     );
//   }

//   if (err) {
//     return (
//       <div className="max-w-5xl mx-auto py-12 px-4 text-center">
//         <div className="text-red-600 font-semibold mb-3">Could not load order</div>
//         <div className="text-gray-600 mb-6">{err}</div>
//         <div className="flex justify-center gap-3">
//           <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Go back</button>
//           <Link to="/" className="px-4 py-2 bg-yellow-700 text-white rounded">Go home</Link>
//         </div>
//       </div>
//     );
//   }

//   // Normalize a few fields with safe fallbacks
//   const orderId = order._id ?? order.id ?? order.appOrderId ?? id;
//   const createdAt = order.createdAt ?? order.createdAtString ?? order.date ?? order.createdAt;
//   const totalAmount = order.totalAmount ?? order.amount ?? order.orderTotal ?? 0;
//   const items = Array.isArray(order.items) ? order.items : (order.cartItems ?? []);
//   const payStatus = order.paymentStatus ?? (order.paymentInfo?.status) ?? (order.paymentInfo?.razorpay?.status) ?? "pending";
//   const paymentId = order.paymentInfo?.razorpay?.paymentId ?? order.paymentInfo?.paymentId ?? order.paymentId;
//   const paymentMethod = order.paymentMethod ?? order.paymentInfo?.method ?? (order.paymentInfo?.razorpay ? "Razorpay" : "Unknown");
//   const shipping = order.shippingAddress ?? order.address ?? order.customer?.address ?? null;
//   const customer = order.customer ?? order.customerDetail ?? {};

//   return (
//     <div className="max-w-6xl mx-auto py-8 px-4">
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
//         {/* Main */}
//         <div>
//           {/* Big green success card */}
//           <div className="rounded-lg overflow-hidden shadow-md">
//             <div className="bg-green-600 text-white py-12 px-8 text-center">
//               <div className="text-sm uppercase opacity-90">You will be redirected in a moment</div>
//               <h1 className="text-3xl font-bold mt-3">Payment Successful</h1>
//               <div className="mt-6 flex justify-center">
//                 <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
//                   <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden>
//                     <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </div>
//               </div>
//               <div className="mt-6 inline-block bg-white bg-opacity-10 px-4 py-3 rounded">
//                 <div className="flex items-center justify-between gap-6 min-w-[360px]">
//                   <div>
//                     <div className="font-semibold">AJIO Clone</div>
//                     <div className="text-sm">{formatDate(createdAt)}</div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-xl font-bold">{formatCurrency(totalAmount)}</div>
//                     <div className="text-sm text-white/90">{paymentMethod}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* white content area */}
//             <div className="bg-white p-6">
//               <div className="flex items-start justify-between gap-6">
//                 <div>
//                   <div className="text-gray-700 font-semibold">Order ID</div>
//                   <div className="text-sm text-gray-600 mt-1">{orderId}</div>
//                 </div>

//                 <div>
//                   <div className="text-gray-700 font-semibold">Payment ID</div>
//                   <div className="text-sm text-gray-600 mt-1">{paymentId ?? "—"}</div>
//                 </div>

//                 <div>
//                   <div className="text-gray-700 font-semibold">Status</div>
//                   <div className="text-sm mt-1">
//                     {payStatus === "paid" || payStatus === "captured" ? (
//                       <span className="inline-block px-3 py-1 rounded bg-green-50 text-green-700 font-medium">Paid</span>
//                     ) : (
//                       <span className="inline-block px-3 py-1 rounded bg-yellow-50 text-yellow-700">Pending</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Shipping & delivery */}
//               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="border rounded p-4">
//                   <div className="font-semibold mb-2">Shipping Address</div>
//                   {shipping ? (
//                     <>
//                       <div className="text-sm font-medium">{shipping.name ?? customer.name ?? "Customer"}</div>
//                       <div className="text-sm text-gray-700 mt-1">{shipping.address ?? shipping}</div>
//                       <div className="text-sm mt-2">Phone: <span className="font-medium">{shipping.phone ?? customer.phone ?? "—"}</span></div>
//                     </>
//                   ) : (
//                     <div className="text-sm text-gray-500">No shipping address recorded</div>
//                   )}
//                 </div>

//                 <div className="border rounded p-4">
//                   <div className="font-semibold mb-2">Delivery Estimate</div>
//                   <div className="text-sm text-gray-700">{estimateDelivery(createdAt)}</div>

//                   <div className="mt-4">
//                     <div className="font-semibold">Order Summary</div>
//                     <div className="text-sm text-gray-600 mt-1">Items: {items.length}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Items */}
//               <div className="mt-6">
//                 <div className="font-semibold mb-3">Items in this order</div>
//                 <div className="space-y-4">
//                   {items.length === 0 ? (
//                     <div className="text-sm text-gray-500">No items listed</div>
//                   ) : (
//                     items.map((it, idx) => {
//                       // expected shapes: it.product, it.title, it.image, it.price, it.quantity
//                       const title = it.title ?? it.product?.title ?? it.name ?? "Product";
//                       const img = it.image ?? it.product?.image ?? "/placeholder.png";
//                       const qty = it.quantity ?? it.qty ?? 1;
//                       const price = it.price ?? it.product?.price ?? 0;
//                       return (
//                         <div key={idx} className="flex items-start gap-4 border rounded p-3">
//                           <div className="w-20 h-24 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
//                             <img src={img} alt={title} className="w-full h-full object-cover" />
//                           </div>
//                           <div className="flex-1">
//                             <div className="font-medium text-gray-800">{title}</div>
//                             <div className="text-sm text-gray-600 mt-1">{it.brand ?? it.vendorName ?? ""}</div>
//                             <div className="mt-3 text-sm text-gray-700">Qty: {qty} • {formatCurrency(price)}</div>
//                           </div>
//                           <div className="text-right">
//                             <div className="font-semibold">{formatCurrency((price ?? 0) * qty)}</div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>

//               {/* Bottom CTA */}
//               <div className="mt-6 flex items-center justify-between gap-4">
//                 <div>
//                   <Link to="/" className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Continue shopping</Link>
//                   <Link to="/orders" className="ml-3 inline-block px-4 py-2 border rounded">View my orders</Link>
//                 </div>

//                 <div>
//                   <button onClick={() => navigate(`/track/${orderId}`)} className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800">Track Order</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right column: order totals summary */}
//         <aside>
//           <div className="border rounded p-5 sticky top-20 bg-white">
//             <div className="text-sm text-gray-500">Order Total</div>
//             <div className="text-2xl font-bold mt-2">{formatCurrency(totalAmount)}</div>

//             <div className="mt-4 text-sm space-y-2">
//               <div className="flex justify-between">
//                 <div>Bag Total</div>
//                 <div>{formatCurrency(order.subtotal ?? order.bagTotal ?? totalAmount)}</div>
//               </div>
//               <div className="flex justify-between">
//                 <div>Delivery Fee</div>
//                 <div>{order.deliveryFee ? formatCurrency(order.deliveryFee) : "Free"}</div>
//               </div>
//               <div className="flex justify-between">
//                 <div>Platform Fee</div>
//                 <div>{order.platformFee ? formatCurrency(order.platformFee) : formatCurrency(order.platformCharge ?? 0)}</div>
//               </div>
//               <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
//                 <div>Total Paid</div>
//                 <div>{formatCurrency(totalAmount)}</div>
//               </div>
//             </div>

//             <div className="mt-4">
//               <div className="text-xs text-gray-500">If you have any questions, contact customer care.</div>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }




//  *****************************************************************************************


// src/pages/OrderSuccess.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { api } from "../lib/api"; // your fetch wrapper (should return parsed JSON)
// import { format as formatDate } from "date-fns";

// export default function OrderSuccess() {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     if (!id) return setErr("Missing order id");
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setErr("");
//       try {
//         // Use your api wrapper; if you use axios change accordingly
//         const res = await api.get(`/orders/${id}`); // expects GET /api/orders/:id mapped in backend
//         if (!mounted) return;
//         setOrder(res || null);
//       } catch (e) {
//         console.error("Order fetch failed", e);
//         setErr(e?.message || "Failed to fetch order");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [id]);

//   if (loading) return <div className="p-8 text-center">Loading order…</div>;
//   if (err) return <div className="p-8 text-center text-red-600">Error: {err}</div>;
//   if (!order) return <div className="p-8 text-center">Order not found</div>;

//   const isPaid = order.paymentStatus === "paid" || order.paymentStatus === "captured" || (order.paymentInfo?.razorpay && order.paymentInfo.razorpay.paymentId);

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <div className={`rounded-lg shadow p-8 ${isPaid ? "bg-green-50" : "bg-white"}`}>
//         <h1 className="text-2xl font-bold mb-2">{isPaid ? "Payment Successful" : "Order details"}</h1>
//         <p className="text-sm text-gray-600 mb-6">
//           {isPaid ? "Thank you! Your payment was received." : "You can check order status below."}
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Order ID</div>
//               <div className="font-medium">{order._id}</div>
//             </div>

//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Placed on</div>
//               <div className="font-medium">{new Date(order.createdAt).toLocaleString()}</div>
//             </div>

//             <div>
//               <div className="text-sm text-gray-500">Payment</div>
//               <div className="mt-1">
//                 <div className="font-medium">{order.paymentStatus}</div>
//                 {order.paymentInfo?.razorpay?.paymentId && (
//                   <div className="text-sm text-gray-600 mt-1">
//                     Payment ID: {order.paymentInfo.razorpay.paymentId}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Amount</div>
//               <div className="text-xl font-semibold">₹{Number(order.totalAmount || 0).toFixed(2)}</div>
//             </div>

//             <div>
//               <div className="text-sm text-gray-500">Shipping address</div>
//               <div className="mt-1 text-sm">{order.shippingAddress ? (
//                 <>
//                   <div>{order.shippingAddress.name}</div>
//                   <div>{order.shippingAddress.addressLine}</div>
//                   <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</div>
//                 </>
//               ) : "Not provided" }</div>
//             </div>
//           </div>
//         </div>

//         <hr className="my-6" />

//         <div>
//           <h3 className="font-semibold mb-3">Items</h3>
//           <div className="space-y-4">
//             {(order.items || []).map((it, i) => (
//               <div key={i} className="flex items-start gap-4">
//                 <div className="w-20 h-24 bg-gray-50 border rounded overflow-hidden">
//                   <img src={it.image || it.product?.image || "/placeholder.png"} alt={it.title || it.product?.title} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-medium">{it.title || it.product?.title}</div>
//                   <div className="text-sm text-gray-600">{it.vendorName || it.vendor}</div>
//                   <div className="text-sm text-gray-700 mt-1">Qty: {it.quantity || 1} • ₹{(it.price || 0).toFixed(2)}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6 flex gap-3">
//           <Link to="/" className="px-4 py-2 bg-gray-200 rounded">Continue Shopping</Link>
//           <Link to="/account/orders" className="px-4 py-2 bg-yellow-700 text-white rounded">View My Orders</Link>
//         </div>
//       </div>
//     </div>
//   );
// }




// *****************************************************************

// /frontend/src/pages/OrderSuccess.jsx

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { api } from "../lib/api";
// // import place

// export default function OrderSuccess() {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     if (!id) {
//       setErr("Missing order id");
//       setLoading(false);
//       return;
//     }

//     console.log("OrderSuccess: id param =", id);

//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setErr("");
//       try {
//         // Try with /api prefix first (common case)
//         const tryUrls = [`/api/orders/${id}`, `/orders/${id}`];

//         let res = null;
//         let usedUrl = null;
//         for (const u of tryUrls) {
//           try {
//             console.log("OrderSuccess: trying fetch", u);
//             // If your api wrapper already sets baseURL to /api, this will still work.
//             const r = await api.get(u);
//             // If the wrapper returns a response object (axios) adjust:
//             const parsed = r && r.data ? r.data : r;
//             if (parsed) {
//               res = parsed;
//               usedUrl = u;
//               break;
//             }
//           } catch (fetchErr) {
//             console.warn("OrderSuccess: fetch failed for", u, fetchErr?.message || fetchErr);
//             // continue to next possibility
//           }
//         }

//         if (!mounted) return;

//         console.log("OrderSuccess: fetch result for", usedUrl, res);

//         if (!res) {
//           setErr("Order not found");
//           setOrder(null);
//         } else {
//           setOrder(res);
//         }
//       } catch (e) {
//         console.error("Order fetch failed (unexpected):", e);
//         setErr(e?.message || "Failed to fetch order");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [id]);

//   if (loading) return <div className="p-8 text-center">Loading order…</div>;
//   if (err) return <div className="p-8 text-center text-red-600">Error: {err}</div>;
//   if (!order) return <div className="p-8 text-center">Order not found</div>;

//   const isPaid =
//     order.paymentStatus === "paid" ||
//     order.paymentStatus === "captured" ||
//     (order.paymentInfo?.razorpay && order.paymentInfo.razorpay.paymentId);


//   const getAbsoluteImage = (img) => {
//   if (!img) return "/placeholder.png"; // public placeholder
//   // if already absolute URL, return as-is
//   if (/^https?:\/\//i.test(img)) return img;
//   // otherwise, prefix with API base or current origin + / if needed
//   const base = import.meta.env.VITE_API_BASE || "";
//   // if base empty -> use current origin to form absolute url to backend
//   if (base) return base.replace(/\/$/, "") + "/" + img.replace(/^\//, "");
//   return window.location.origin.replace(/\/$/, "") + "/" + img.replace(/^\//, "");
// };  

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <div
//         className={`rounded-lg shadow p-8 ${
//           isPaid ? "bg-green-50" : "bg-white"
//         }`}
//       >
//         <h1 className="text-2xl font-bold mb-2">
//           {isPaid ? "Payment Successful" : "Order details"}
//         </h1>
//         <p className="text-sm text-gray-600 mb-6">
//           {isPaid
//             ? "Thank you! Your payment was received."
//             : "You can check order status below."}
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Order ID</div>
//               <div className="font-medium">{order._id}</div>
//             </div>

//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Placed on</div>
//               <div className="font-medium">
//                 {new Date(order.createdAt).toLocaleString()}
//               </div>
//             </div>

//             <div>
//               <div className="text-sm text-gray-500">Payment</div>
//               <div className="mt-1">
//                 <div className="font-medium">{order.paymentStatus}</div>
//                 {order.paymentInfo?.razorpay?.paymentId && (
//                   <div className="text-sm text-gray-600 mt-1">
//                     Payment ID: {order.paymentInfo.razorpay.paymentId}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Amount</div>
//               <div className="text-xl font-semibold">
//                 ₹{Number(order.totalAmount || 0).toFixed(2)}
//               </div>
//             </div>

//             <div>
//               <div className="text-sm text-gray-500">Shipping address</div>
//               <div className="mt-1 text-sm">
//                       Bengaluru, Karnataka - 560001
//                 </div>

//               {/* <div className="mt-1 text-sm">
//                 {order.shippingAddress ? (
//                   <>
//                     <div>{order.shippingAddress.name}</div>
//                     <div>{order.shippingAddress.addressLine}</div>
//                     <div>
//                       {order.shippingAddress.city},{""}
//                       {order.shippingAddress.state} -{""}
//                       {order.shippingAddress.postalCode}
//                     </div>
                     
//                   </>
//                 ) : (
//                   "Not provided"
//                 )}
//               </div> */}

//             </div>
//           </div>
//         </div>

//         <hr className="my-6" />

//         <div>
//           <h3 className="font-semibold mb-3">Items</h3>
//           <div className="space-y-4">
//             {(order.items || []).map((it, i) => (
//               <div key={i} className="flex items-start gap-4">
//                 <div className="w-20 h-24 bg-gray-50 border rounded overflow-hidden">
//                   <img
//                     src={it.image || it.product?.image || "/placeholder.png"}
//                     alt={it.title || it.product?.title}
//                     className="w-full h-full object-cover"
//                   />

                
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-medium">
//                     {it.title || it.product?.title}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     {it.vendorName || it.vendor}
//                   </div>
//                   <div className="text-sm text-gray-700 mt-1">
//                     Qty: {it.quantity || 1} • ₹{(it.price || 0).toFixed(2)}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6 flex gap-3">
//           <Link to="/" className="px-4 py-2 bg-gray-200 rounded">
//             Continue Shopping
//           </Link>
//           <Link
//             to="/account/orders"
//             className="px-4 py-2 bg-yellow-700 text-white rounded"
//           >
//             View My Orders
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// ********************************************************************************************


// frontend/src/pages/OrderSuccess.jsx

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { api } from "../lib/api";

// export default function OrderSuccess() {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     if (!id) {
//       setErr("Missing order id");
//       setLoading(false);
//       return;
//     }

//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setErr("");
//       try {
//         const tryUrls = [`/api/orders/${id}`, `/orders/${id}`];

//         let res = null;
//         for (const u of tryUrls) {
//           try {
//             const r = await api.get(u);
//             const parsed = r && r.data ? r.data : r;
//             if (parsed) {
//               res = parsed;
//               break;
//             }
//           } catch (fetchErr) {
//             // continue
//           }
//         }

//         if (!mounted) return;

//         if (!res) {
//           setErr("Order not found");
//           setOrder(null);
//         } else {
//           setOrder(res);
//         }
//       } catch (e) {
//         setErr(e?.message || "Failed to fetch order");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [id]);

//   if (loading) return <div className="p-8 text-center">Loading order…</div>;
//   if (err) return <div className="p-8 text-center text-red-600">Error: {err}</div>;
//   if (!order) return <div className="p-8 text-center">Order not found</div>;

//   const isPaid =
//     order.paymentStatus === "paid" ||
//     order.paymentStatus === "captured" ||
//     (order.paymentInfo?.razorpay && order.paymentInfo.razorpay.paymentId);

//   const getAbsoluteImage = (img) => {
//     if (!img) return "/placeholder.png";
//     if (/^https?:\/\//i.test(img)) return img;
//     const base = import.meta.env.VITE_API_BASE || "";
//     if (base) return base.replace(/\/$/, "") + "/" + img.replace(/^\//, "");
//     return window.location.origin.replace(/\/$/, "") + "/" + img.replace(/^\//, "");
//   };

//   // Helper to render shipping address in an easy-to-read format
//   const renderShipping = (sa) => {
//     if (!sa) return <div>Not provided</div>;
//     // fields may be named different depending on backend shape; handle common cases
//     const name = sa.name || sa.fullName || "";
//     const phone = sa.phone || sa.contact || "";
//     const line1 = sa.line1 || sa.address || sa.addressLine || "";
//     const city = sa.city || "";
//     const state = sa.state || "";
//     const pincode = sa.pincode || sa.postalCode || sa.postal_code || "";
//     const country = sa.country || "India";

//     return (
//       <>
//         {name && <div>{name}</div>}
//         {line1 && <div>{line1}</div>}
//         <div>
//           {[city, state].filter(Boolean).join(", ")} {pincode ? `- ${pincode}` : ""}
//         </div>
//         {phone && <div>Phone: {phone}</div>}
//         {country && <div className="text-sm text-gray-500">{country}</div>}
//       </>
//     );
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <div className={`rounded-lg shadow p-8 ${isPaid ? "bg-green-50" : "bg-white"}`}>
//         <h1 className="text-2xl font-bold mb-2">{isPaid ? "Payment Successful" : "Order details"}</h1>
//         <p className="text-sm text-gray-600 mb-6">
//           {isPaid ? "Thank you! Your payment was received." : "You can check order status below."}
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Order ID</div>
//               <div className="font-medium">{order._id}</div>
//             </div>

//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Placed on</div>
//               <div className="font-medium">{new Date(order.createdAt).toLocaleString()}</div>
//             </div>

//             <div>
//               <div className="text-sm text-gray-500">Payment</div>
//               <div className="mt-1">
//                 <div className="font-medium">{order.paymentStatus}</div>
//                 {order.paymentInfo?.razorpay?.paymentId && (
//                   <div className="text-sm text-gray-600 mt-1">Payment ID: {order.paymentInfo.razorpay.paymentId}</div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Amount</div>
//               <div className="text-xl font-semibold">₹{Number(order.totalAmount || 0).toFixed(2)}</div>
//             </div>

//             <div>
//               <div className="text-sm text-gray-500">Shipping address</div>
//               <div className="mt-1 text-sm">
//                 {renderShipping(order.shippingAddress)}
//               </div>
//             </div>
//           </div>
//         </div>

//         <hr className="my-6" />

//         <div>
//           <h3 className="font-semibold mb-3">Items</h3>
//           <div className="space-y-4">
//             {(order.items || []).map((it, i) => (
//               <div key={i} className="flex items-start gap-4">
//                 <div className="w-20 h-24 bg-gray-50 border rounded overflow-hidden">
//                   <img src={getAbsoluteImage(it.image || it.product?.image)} alt={it.title || it.product?.title} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-medium">{it.title || it.product?.title}</div>
//                   <div className="text-sm text-gray-600">{it.vendorName || it.vendor}</div>
//                   <div className="text-sm text-gray-700 mt-1">Qty: {it.quantity || 1} • ₹{Number(it.price || 0).toFixed(2)}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6 flex gap-3">
//           <Link to="/" className="px-4 py-2 bg-gray-200 rounded">Continue Shopping</Link>
//           <Link to="/account/orders" className="px-4 py-2 bg-yellow-700 text-white rounded">View My Orders</Link>
//         </div>
//       </div>
//     </div>
//   );
// }



// ***********************************************************************


// frontend/src/pages/OrderSuccess.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { api } from "../lib/api";

// export default function OrderSuccess() {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     if (!id) {
//       setErr("Missing order id");
//       setLoading(false);
//       return;
//     }
//     let mounted = true;
//     (async () => {
//       try {
//         const tryUrls = [`/api/orders/${id}`, `/orders/${id}`];
//         let res = null;
//         for (const u of tryUrls) {
//           try {
//             const r = await api.get(u);
//             res = r && r.data ? r.data : r;
//             if (res) break;
//           } catch {}
//         }
//         if (!mounted) return;
//         if (!res) {
//           setErr("Order not found");
//           setOrder(null);
//         } else {
//           setOrder(res);
//         }
//       } catch (e) {
//         setErr(e?.message || "Failed to fetch order");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [id]);

//   if (loading) return <div className="p-8 text-center">Loading order…</div>;
//   if (err) return <div className="p-8 text-center text-red-600">Error: {err}</div>;
//   if (!order) return <div className="p-8 text-center">Order not found</div>;

//   const isPaid =
//     order.paymentStatus === "paid" ||
//     order.paymentStatus === "captured" ||
//     (order.paymentInfo?.razorpay && order.paymentInfo.razorpay.paymentId);

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <div
//         className={`rounded-lg shadow p-8 ${
//           isPaid ? "bg-green-50" : "bg-white"
//         }`}
//       >
//         <h1 className="text-2xl font-bold mb-2">
//           {isPaid ? "Payment Successful" : "Order details"}
//         </h1>
//         <p className="text-sm text-gray-600 mb-6">
//           {isPaid
//             ? "Thank you! Your payment was received."
//             : "You can check order status below."}
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Order ID</div>
//               <div className="font-medium">{order._id}</div>
//             </div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Placed on</div>
//               <div className="font-medium">
//                 {new Date(order.createdAt).toLocaleString()}
//               </div>
//             </div>
//             <div>
//               <div className="text-sm text-gray-500">Payment</div>
//               <div className="mt-1 font-medium">{order.paymentStatus}</div>
//               {order.paymentInfo?.razorpay?.paymentId && (
//                 <div className="text-sm text-gray-600 mt-1">
//                   Payment ID: {order.paymentInfo.razorpay.paymentId}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div>
//             <div className="mb-4">
//               <div className="text-sm text-gray-500">Amount</div>
//               <div className="text-xl font-semibold">
//                 ₹{Number(order.totalAmount || 0).toFixed(2)}
//               </div>
//             </div>
//             <div>
//               <div className="text-sm text-gray-500">Shipping address</div>
//               {order.shippingAddress ? (
//                 <div className="mt-1 text-sm">
//                   <div>{order.shippingAddress.name}</div>
//                   <div>{order.shippingAddress.line1}</div>
//                   <div>
//                     {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
//                     {order.shippingAddress.pincode}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mt-1 text-sm">Not provided</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <hr className="my-6" />

//         <div>
//           <h3 className="font-semibold mb-3">Items</h3>
//           <div className="space-y-4">
//             {(order.items || []).map((it, i) => (
//               <div key={i} className="flex items-start gap-4">
//                 <div className="w-20 h-24 bg-gray-50 border rounded overflow-hidden">
//                   <img
//                     src={it.image || "/placeholder.png"}
//                     alt={it.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-medium">{it.title}</div>
//                   <div className="text-sm text-gray-700 mt-1">
//                     Qty: {it.quantity || 1} • ₹{(it.price || 0).toFixed(2)}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6 flex gap-3">
//           <Link to="/" className="px-4 py-2 bg-gray-200 rounded">
//             Continue Shopping
//           </Link>
//           <Link
//             to="/account/orders"
//             className="px-4 py-2 bg-yellow-700 text-white rounded"
//           >
//             View My Orders
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }




// ****************************************************************************


// frontend/src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) {
      setErr("Missing order id");
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        // Try a couple of common endpoints. Use api.get which may return resp or { data }.
        const tryUrls = [`/api/orders/${id}`, `/orders/${id}`];
        let found = null;

        for (const u of tryUrls) {
          try {
            const resp = await api.get(u);
            const data = resp && resp.data ? resp.data : resp;
            if (data) {
              found = data;
              break;
            }
          } catch (e) {
            // ignore and try next url
            console.info("[OrderSuccess] fetch failed for", u, e?.message || e);
          }
        }

        if (!mounted) return;

        if (!found) {
          setErr("Order not found");
          setOrder(null);
        } else {
          // Defensive normalization: if the server wrapped order in { order: {...} } or { data: {...} }
          const normalized = found.order ?? found.data ?? found;
          setOrder(normalized);
          // after you've set the order (where you currently do setOrder(normalized))
console.log("[OrderSuccess] shippingAddress:", normalized.shippingAddress);

        }
      } catch (e) {
        console.error("[OrderSuccess] unexpected error fetching order:", e);
        setErr(e?.message || "Failed to fetch order");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading order…</div>;
  if (err) return <div className="p-8 text-center text-red-600">Error: {err}</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  // Detect payment
  const isPaid =
    order.paymentStatus === "paid" ||
    order.paymentStatus === "captured" ||
    Boolean(order.paymentInfo?.razorpay?.paymentId);

  // Amount: handle if backend stored amount in paise by mistake
  const rawAmount = Number(order.totalAmount ?? order.amount ?? 0);
  // If amount looks very large ( > 100000 ), assume it's paise and convert to rupees
  const amountInRupees = rawAmount > 100000 ? rawAmount / 100 : rawAmount;
  const formattedAmount = Number.isFinite(amountInRupees) ? amountInRupees.toFixed(2) : "0.00";

  // Created date fallback
  const createdAt = order.createdAt ? new Date(order.createdAt) : null;
  const createdAtStr = createdAt ? createdAt.toLocaleString() : "—";



  // helper (put near top of component, above return)



  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className={`rounded-lg shadow p-8 ${isPaid ? "bg-green-50" : "bg-white"}`}>
        <h1 className="text-2xl font-bold mb-2">
          {isPaid ? "Payment Successful" : "Order details"}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {isPaid ? "Thank you! Your payment was received." : "You can check order status below."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Order ID</div>
              <div className="font-medium">{order._id || order.id || "—"}</div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-500">Placed on</div>
              <div className="font-medium">{createdAtStr}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Payment</div>
              <div className="mt-1 font-medium">{order.paymentStatus || (isPaid ? "paid" : "pending")}</div>
              {order.paymentInfo?.razorpay?.paymentId && (
                <div className="text-sm text-gray-600 mt-1">
                  Payment ID: {order.paymentInfo.razorpay.paymentId}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Amount</div>
              <div className="text-xl font-semibold">₹{formattedAmount}</div>
            </div>

            {/* <div>
              <div className="text-sm text-gray-500">Shipping address</div>
              {order.shippingAddress ? (
                <div className="mt-1 text-sm">
                  {order.shippingAddress.name && <div>{order.shippingAddress.name}</div>}
                  {order.shippingAddress.line1 && <div>{order.shippingAddress.line1}</div>}
                  <div>
                    {order.shippingAddress.city || ""}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}{" "}
                    {order.shippingAddress.pincode ? `- ${order.shippingAddress.pincode}` : ""}
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-sm">Not provided</div>
              )}
            </div> */}


            {/* <div>
              <div className="text-sm text-gray-500">Shipping address</div>
              {order.shippingAddress ? (
                <div className="mt-1 text-sm leading-snug">
                  {order.shippingAddress.name && <div>{order.shippingAddress.name}</div>}
                  {order.shippingAddress.address && <div>{order.shippingAddress.address}</div>}
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </div>
                  {order.shippingAddress.phone && (
                    <div>Phone: {order.shippingAddress.phone}</div>
                  )}
                </div>
              ) : (
                <div className="mt-1 text-sm">Not provided</div>
              )}
            </div> */}


     <div>
  <div className="text-sm text-gray-500">Shipping address</div>
  {order.shippingAddress ? (
    <div className="mt-1 text-sm leading-snug">
      {order.shippingAddress.name && <div>{order.shippingAddress.name}</div>}
      {order.shippingAddress.address && <div>{order.shippingAddress.address}</div>}
      <div>
        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
      </div>
      {order.shippingAddress.phone && (
        <div>Phone: {order.shippingAddress.phone}</div>
      )}
    </div>
  ) : (
    <div className="mt-1 text-sm">Not provided</div>
  )}
</div> 









          </div>
        </div>

        <hr className="my-6" />

        <div>
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-4">
            {(order.items || []).map((it, i) => {
              // defensive read
              const title = it.title || it.name || it.product?.title || "Product";
              const qty = Number(it.quantity ?? it.qty ?? 1);
              const priceRaw = Number(it.price ?? it.unitPrice ?? 0);
              // handle if price in paise ( > 100000)
              const price = priceRaw > 100000 ? priceRaw / 100 : priceRaw;

              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-20 h-24 bg-gray-50 border rounded overflow-hidden">
                    <img
                      src={it.image || (it.product && it.product.image) || "/placeholder.png"}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-gray-700 mt-1">
                      Qty: {qty} • ₹{Number(price || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
            {(!order.items || order.items.length === 0) && (
              <div className="text-sm text-gray-500">No items found for this order.</div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link to="/" className="px-4 py-2 bg-gray-200 rounded">
            Continue Shopping
          </Link>
          <Link to="/account/orders" className="px-4 py-2 bg-yellow-700 text-white rounded">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
