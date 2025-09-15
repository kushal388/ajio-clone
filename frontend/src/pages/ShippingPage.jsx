// src/pages/ShippingPage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// export default function ShippingPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();

//   // Local addresses (sample, can later connect to user profile DB)
//   const [addresses, setAddresses] = useState([
//     {
//       id: 1,
//       name: "Kushal Chaturvedi",
//       label: "HOME",
//       address: "43, sira, rangnatha stores, tumkur, karnataka, india - 572137",
//       phone: "9606730783",
//       selected: true,
//     },
//     {
//       id: 2,
//       name: "Kushal",
//       label: "Default",
//       address: "sai annapurna pg, 1st cross mico layout, btm 2nd stage, bangalore, karnataka, india - 560076",
//       phone: "9606730783",
//       selected: false,
//     },
//   ]);

//   const [showDrawer, setShowDrawer] = useState(false);

//   // Totals (reuse from cart)
//   const bagTotal = cart.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
//   const bagDiscount = cart.reduce(
//     (s, i) => s + Math.max(0, (Number(i.mrp || i.price || 0) - Number(i.price || 0))) * Number(i.quantity || 1),
//     0
//   );
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   const handleSelectAddress = (id) => {
//     setAddresses((prev) =>
//       prev.map((a) => ({ ...a, selected: a.id === id }))
//     );
//     setShowDrawer(false);
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-6 px-4 flex gap-6">
//       {/* Left side: delivery + expected delivery */}
//       <div className="flex-1">
//         {/* Delivery Address */}
//         <div className="border rounded p-4 mb-6">
//           <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
//             <span role="img" aria-label="location">📍</span>
//             Delivery Address
//           </h2>

//           {addresses.find((a) => a.selected) ? (
//             <div className="ml-6">
//               <p className="font-semibold">{addresses.find((a) => a.selected).name} <span className="ml-2 text-xs border px-2 py-0.5 rounded">{addresses.find((a) => a.selected).label}</span></p>
//               <p className="text-sm text-gray-700">{addresses.find((a) => a.selected).address}</p>
//               <p className="text-sm">Phone: <span className="font-medium">{addresses.find((a) => a.selected).phone}</span></p>
//             </div>
//           ) : (
//             <p className="text-sm text-gray-500">No address selected</p>
//           )}

//           <button
//             onClick={() => setShowDrawer(true)}
//             className="mt-3 ml-6 text-sm text-blue-600 hover:underline"
//           >
//             Change Address
//           </button>
//         </div>

//         {/* Expected Delivery */}
//         <div className="border rounded p-4">
//           <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
//             <span role="img" aria-label="truck">🚚</span>
//             Expected Delivery
//           </h2>
//           <div className="grid grid-cols-3 gap-4">
//             {cart.map((item, idx) => (
//               <div key={idx} className="flex gap-2 items-start">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="w-16 h-20 object-cover rounded border"
//                 />
//                 <div className="text-sm">
//                   <p className="font-semibold">
//                     {new Date(Date.now() + (idx + 2) * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                     })}
//                   </p>
//                   <p className="text-gray-700">{item.brand}</p>
//                   <p className="text-gray-500">{item.title}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right side: Order Summary */}
//       <div className="w-80">
//         <div className="border rounded p-4 sticky top-20">
//           <h4 className="text-sm font-semibold mb-3">Order Details</h4>
//           <div className="text-sm space-y-2">
//             <div className="flex justify-between">
//               <span>Bag Total</span>
//               <span>₹{bagTotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-green-600">
//               <span>Bag Discount</span>
//               <span>-₹{bagDiscount.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery Fee</span>
//               <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Platform Fee</span>
//               <span>₹{platformFee}</span>
//             </div>
//             <div className="flex justify-between font-semibold border-t pt-2 mt-2">
//               <span>Order Total</span>
//               <span>₹{orderTotal.toFixed(2)}</span>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate("/payment")}
//             className="mt-4 w-full bg-yellow-700 text-white py-2 rounded hover:bg-yellow-800"
//           >
//             PROCEED TO PAYMENT
//           </button>
//         </div>
//       </div>

//       {/* Drawer for Change Address */}
//       {showDrawer && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
//           <div className="bg-white w-96 h-full p-6 overflow-y-auto shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 📍 Change Address
//               </h2>
//               <button onClick={() => setShowDrawer(false)} className="text-gray-500">✕</button>
//             </div>

//             <div className="space-y-4">
//               {addresses.map((addr) => (
//                 <div
//                   key={addr.id}
//                   className={`p-4 border rounded ${addr.selected ? "bg-yellow-50" : ""}`}
//                 >
//                   <p className="font-semibold">
//                     {addr.name}{" "}
//                     <span className="ml-2 text-xs border px-2 py-0.5 rounded">{addr.label}</span>
//                   </p>
//                   <p className="text-sm text-gray-700">{addr.address}</p>
//                   <p className="text-sm">Phone: {addr.phone}</p>
//                   <div className="mt-2 flex justify-between items-center">
//                     <button
//                       onClick={() => handleSelectAddress(addr.id)}
//                       className="text-sm text-blue-600 hover:underline"
//                     >
//                       {addr.selected ? "Selected" : "Deliver Here"}
//                     </button>
//                     <button className="text-xs text-gray-500">Edit</button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={() =>
//                 setAddresses((prev) => [
//                   ...prev,
//                   {
//                     id: Date.now(),
//                     name: "New User",
//                     label: "HOME",
//                     address: "Sample new address added here",
//                     phone: "9999999999",
//                     selected: false,
//                   },
//                 ])
//               }
//               className="mt-6 w-full border py-2 rounded text-sm text-blue-600 hover:bg-gray-50"
//             >
//               + Add New Address
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// *************************************************************************************


// import React, { useState } from "react";
// import { useCart } from "../context/CartContext";

// export default function ShippingPage() {
//   const { cart } = useCart();

//   // Sample addresses (later can integrate user DB)
//   const [addresses, setAddresses] = useState([
//     {
//       id: 1,
//       name: "Kushal Chaturvedi",
//       label: "HOME",
//       address: "43, sira, rangnatha stores, tumkur, karnataka, india - 572137",
//       phone: "9606730783",
//       selected: true,
//     },
//     {
//       id: 2,
//       name: "Kushal",
//       label: "Default",
//       address: "Sai Annapurna PG, 1st cross mico layout, Bangalore, India - 560076",
//       phone: "9606730783",
//       selected: false,
//     },
//   ]);

//   const [showDrawer, setShowDrawer] = useState(false);

//   // Totals
//   const bagTotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
//   const bagDiscount = cart.reduce(
//     (s, i) => s + Math.max(0, (i.mrp || i.price || 0) - (i.price || 0)) * (i.quantity || 1),
//     0
//   );
//   const deliveryFee = cart.length > 0 ? 0 : 0; // free in your UI
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   return (
//     <div className="flex max-w-6xl mx-auto py-6 gap-6">
//       {/* Left side: Shipping content */}
//       <div className="flex-1 space-y-6">
//         {/* Delivery Address + COD Box */}
//         <div className="border rounded p-4">
//           <div className="grid grid-cols-[1fr_250px] gap-6">
//             {/* Address */}
//             <div>
//               <h2 className="font-semibold text-lg flex items-center gap-2">
//                 📍 Delivery Address
//               </h2>
//               <p className="text-sm text-gray-500 mb-3">
//                 We will deliver your order to this address
//               </p>

//               {addresses.find((a) => a.selected) && (
//                 <div>
//                   <p className="font-semibold">
//                     {addresses.find((a) => a.selected).name}{" "}
//                     <span className="ml-2 text-xs border px-2 py-0.5 rounded">
//                       {addresses.find((a) => a.selected).label}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-700">
//                     {addresses.find((a) => a.selected).address}
//                   </p>
//                   <p className="text-sm">
//                     Phone:{" "}
//                     <span className="font-medium">
//                       {addresses.find((a) => a.selected).phone}
//                     </span>
//                   </p>
//                   <button
//                     onClick={() => setShowDrawer(true)}
//                     className="mt-2 text-sm text-blue-600 hover:underline"
//                   >
//                     Change Address
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* COD Box */}
//             <div className="border border-dashed p-4 rounded text-center">
//               <p className="text-green-700 font-semibold">
//                 Cash on delivery available
//               </p>
//               <p className="text-sm text-gray-600 mt-1">
//                 Est Delivery{" "}
//                 <span className="font-semibold">
//                   {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                     month: "short",
//                   })}{" "}
//                   -{" "}
//                   {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                     month: "short",
//                   })}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Expected Delivery */}
//         <div className="border rounded p-4">
//           <h2 className="font-semibold text-lg mb-1">📦 Expected Delivery</h2>
//           <p className="text-sm text-gray-500 mb-4">
//             Estimated delivery dates for your order
//           </p>

//           <div className="grid grid-cols-3 gap-4">
//             {cart.map((item, idx) => (
//               <div key={idx} className="flex gap-2 items-start">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="w-16 h-20 object-cover rounded border"
//                 />
//                 <div className="text-sm">
//                   <p className="font-semibold">
//                     {new Date(Date.now() + (idx + 2) * 24 * 60 * 60 * 1000).toLocaleDateString(
//                       "en-IN",
//                       { day: "2-digit", month: "short" }
//                     )}
//                   </p>
//                   <p className="text-gray-700">{item.brand}</p>
//                   <p className="text-gray-500">{item.title}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right: Order Summary */}
//       <div className="w-80">
//         <div className="border rounded p-4">
//           <h4 className="text-sm font-semibold mb-3">Order Details</h4>
//           <div className="text-sm space-y-2">
//             <div className="flex justify-between">
//               <span>Bag Total</span>
//               <span>₹{bagTotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-green-600">
//               <span>Bag Discount</span>
//               <span>-₹{bagDiscount.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery Fee</span>
//               <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Platform Fee</span>
//               <span>₹{platformFee}</span>
//             </div>
//             <div className="flex justify-between font-semibold border-t pt-2 mt-2">
//               <span>Order Total</span>
//               <span>₹{orderTotal.toFixed(2)}</span>
//             </div>
//           </div>

//           <button className="mt-4 w-full bg-yellow-700 text-white py-2 rounded">
//             PROCEED TO PAYMENT
//           </button>
//         </div>
//       </div>

//       {/* Drawer for changing address */}
//       {showDrawer && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
//           <div className="bg-white w-96 h-full p-6 overflow-y-auto shadow-lg">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-semibold">Change Address</h3>
//               <button onClick={() => setShowDrawer(false)}>✕</button>
//             </div>

//             {addresses.map((addr) => (
//               <div
//                 key={addr.id}
//                 className={`p-4 mb-4 border rounded ${
//                   addr.selected ? "bg-yellow-50" : "bg-white"
//                 }`}
//               >
//                 <div className="flex justify-between">
//                   <div>
//                     <p className="font-semibold">{addr.name}</p>
//                     <p className="text-sm text-gray-600">{addr.address}</p>
//                     <p className="text-sm">
//                       Phone:{" "}
//                       <span className="font-medium">{addr.phone}</span>
//                     </p>
//                   </div>
//                   <button
//                     className="text-blue-600 text-sm"
//                     onClick={() =>
//                       setAddresses((prev) =>
//                         prev.map((a) => ({ ...a, selected: a.id === addr.id }))
//                       )
//                     }
//                   >
//                     {addr.selected ? "Selected" : "Select"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// ************************************************************************


// src/pages/ShippingPage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// /**
//  * ShippingPage - improved visuals:
//  * - Larger header icons (location + box) with title + subtitle styling
//  * - COD box aligned right of address (grid)
//  * - Expected Delivery items: larger thumbnails and clearer spacing
//  * - Order summary unchanged
//  *
//  * Replace your current ShippingPage.jsx with this file.
//  */

// function formatShortDate(daysFromNow = 2) {
//   const d = new Date();
//   d.setDate(d.getDate() + daysFromNow);
//   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }); // e.g. "20 Sep"
// }

// export default function ShippingPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();

//   // sample local addresses (persist later if you want)
//   const [addresses, setAddresses] = useState([
//     {
//       id: 1,
//       name: "Kushal Chaturvedi",
//       label: "HOME",
//       address: "43, sira, rangnatha stores, tumkur, karnataka, india - 572137",
//       phone: "9606730783",
//       selected: true,
//     },
//     {
//       id: 2,
//       name: "Kushal",
//       label: "DEFAULT",
//       address: "Sai Annapurna PG, BTM 2nd stage, Bangalore - 560076",
//       phone: "9606730783",
//       selected: false,
//     },
//   ]);

//   const [showDrawer, setShowDrawer] = useState(false);

//   // totals (same logic as CartPage)
//   const bagTotal = cart.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
//   const bagDiscount = cart.reduce(
//     (s, i) => s + Math.max(0, (Number(i.mrp || i.price || 0) - Number(i.price || 0))) * Number(i.quantity || 1),
//     0
//   );
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   const selectedAddress = addresses.find((a) => a.selected) || null;

//   return (
//     <div className="max-w-6xl mx-auto py-6 px-4">
//       {/* Progress area is handled by Navbar; page content below */}
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         {/* Left column */}
//         <div className="space-y-6">
//           {/* Delivery Address card (grid: left address / right COD box) */}
//           <div className="bg-white border rounded p-6">
//             <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start">
//               {/* Left: icon + title + subtitle + address */}
//               <div>
//                 <div className="flex items-start gap-4">
//                   {/* Large location icon in a circle box */}
//                   <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white">
//                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
//                       <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.25 11.2 20.5 11.5 20.8C11.7 21 12.3 21 12.5 20.8C12.8 20.5 19 13.25 19 9C19 5.13401 15.866 2 12 2Z" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <circle cx="12" cy="9" r="2.2" fill="#111827" />
//                     </svg>
//                   </div>

//                   <div className="flex-1">
//                     <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
//                     <p className="text-sm text-gray-500 mt-1">We will deliver your order to this address</p>

//                     {/* address block */}
//                     {selectedAddress ? (
//                       <div className="mt-4">
//                         <p className="font-medium text-gray-800">
//                           {selectedAddress.name}{" "}
//                           <span className="ml-2 inline-block px-2 py-0.5 text-xs border rounded text-gray-700">
//                             {selectedAddress.label}
//                           </span>
//                         </p>
//                         <p className="text-sm text-gray-700 mt-2 leading-snug">{selectedAddress.address}</p>
//                         <p className="text-sm mt-2">Phone: <span className="font-medium">{selectedAddress.phone}</span></p>

//                         <button
//                           onClick={() => setShowDrawer(true)}
//                           className="mt-3 text-sm text-blue-600 hover:underline"
//                         >
//                           Change Address
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="mt-4 text-sm text-gray-500">No address selected</div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Right: COD box (dashed border, centered) */}
//               <div className="flex items-center justify-center">
//                 <div className="w-full border border-dashed rounded p-4 text-center">
//                   <p className="text-green-700 font-semibold text-sm">Cash on delivery available</p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Est Delivery{" "}
//                     <span className="font-semibold">
//                       {formatShortDate(2)} - {formatShortDate(5)}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Expected Delivery */}
//           <div className="bg-white border rounded p-6">
//             <div className="flex items-center gap-4">
//               {/* large box icon in square */}
//               <div className="w-12 h-12 rounded-md border border-gray-200 flex items-center justify-center bg-white">
//                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
//                   <path d="M21 16V8a1 1 0 0 0-.553-.894l-8-4.5a1 1 0 0 0-.894 0l-8 4.5A1 1 0 0 0 3 8v8a1 1 0 0 0 .553.894l8 4.5a1 1 0 0 0 .894 0l8-4.5A1 1 0 0 0 21 16z" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M7 8.5l5 2.5 5-2.5" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Expected Delivery</h3>
//                 <p className="text-sm text-gray-500">Estimated delivery dates for your order</p>
//               </div>
//             </div>

//             {/* Items grid: larger thumbnails and spacing */}
//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {cart.length === 0 ? (
//                 <div className="text-sm text-gray-500">No items in bag.</div>
//               ) : (
//                 cart.map((item, idx) => {
//                   const dateLabel = formatShortDate(idx + 2);
//                   return (
//                     <div key={idx} className="flex items-start gap-4">
//                       {/* larger thumb */}
//                       <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                         <img
//                           src={item.image || item.product?.image || "/placeholder.png"}
//                           alt={item.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>

//                       <div className="flex-1">
//                         <p className="text-sm font-semibold text-gray-900">{dateLabel}</p>
//                         <p className="text-sm text-gray-700 mt-1">{item.brand || item.vendorName || "Brand"}</p>
//                         <p className="text-sm text-gray-500 mt-1">{item.title}</p>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right column: summary */}
//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Order Details</h4>

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
//               onClick={() => navigate("/payment")}
//               className="mt-4 w-full bg-yellow-700 text-white py-2 rounded hover:bg-yellow-800"
//             >
//               PROCEED TO PAYMENT
//             </button>
//           </div>
//         </aside>
//       </div>

//       {/* Address Drawer (right-side) */}
//       {showDrawer && (
//         <div className="fixed inset-0 z-50 flex">
//           <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowDrawer(false)} />
//           <div className="relative ml-auto w-full sm:w-96 bg-white h-full shadow-lg overflow-y-auto p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Change Address</h3>
//               <button onClick={() => setShowDrawer(false)} className="text-gray-600">✕</button>
//             </div>

//             <div className="space-y-4">
//               {addresses.map((addr) => (
//                 <div key={addr.id} className={`p-4 border rounded ${addr.selected ? "bg-yellow-50" : "bg-white"}`}>
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="font-semibold">{addr.name}</p>
//                       <p className="text-sm text-gray-700 mt-1">{addr.address}</p>
//                       <p className="text-sm mt-1">Phone: <span className="font-medium">{addr.phone}</span></p>
//                     </div>
//                     <div className="flex flex-col items-end">
//                       <button
//                         onClick={() =>
//                           setAddresses((prev) => prev.map((a) => ({ ...a, selected: a.id === addr.id })))
//                         }
//                         className="text-sm text-blue-600"
//                       >
//                         {addr.selected ? "Selected" : "Deliver Here"}
//                       </button>
//                       <button className="text-xs text-gray-500 mt-2">Edit</button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={() =>
//                 setAddresses((prev) => [
//                   ...prev,
//                   {
//                     id: Date.now(),
//                     name: "New Address",
//                     label: "HOME",
//                     address: "New sample address line",
//                     phone: "9999999999",
//                     selected: false,
//                   },
//                 ])
//               }
//               className="mt-6 w-full border py-2 rounded text-sm text-blue-600"
//             >
//               + Add New Address
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// ********************************************************************

//frintend/src/pages/Shipping.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// /**
//  * ShippingPage - show all items in a 2-column expected-delivery grid (no pagination)
//  * Layout & functionality otherwise unchanged.
//  */

// function formatShortDate(daysFromNow = 4) {
//   const d = new Date();
//   d.setDate(d.getDate() + daysFromNow);
//   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }); // e.g. "20 Sep"
// }

// export default function ShippingPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();

//   // sample local addresses (persist later if you want)
//   const [addresses, setAddresses] = useState([
//     {
//       id: 1,
//       name: "Kushal Chaturvedi",
//       label: "HOME",
//       address: "43, sira, rangnatha stores, tumkur, karnataka, india - 572137",
//       phone: "9606730783",
//       selected: true,
//     },
//     {
//       id: 2,
//       name: "Kushal",
//       label: "DEFAULT",
//       address: "Sai Annapurna PG, BTM 2nd stage, Bangalore - 560076",
//       phone: "9606730783",
//       selected: false,
//     },
//   ]);

//   const [showDrawer, setShowDrawer] = useState(false);

//   // totals (same logic as CartPage)
//   const bagTotal = cart.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
//   const bagDiscount = cart.reduce(
//     (s, i) => s + Math.max(0, (Number(i.mrp || i.price || 0) - Number(i.price || 0))) * Number(i.quantity || 1),
//     0
//   );
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   const selectedAddress = addresses.find((a) => a.selected) || null;

//   return (
//     <div className="max-w-6xl mx-auto py-6 px-4">
//       {/* Progress area is handled by Navbar; page content below */}
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         {/* Left column */}
//         <div className="space-y-6">
//           {/* Delivery Address card (grid: left address / right COD box) */}
//           <div className="bg-white border rounded p-6">
//             <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start">
//               {/* Left: icon + title + subtitle + address */}
//               <div>
//                 <div className="flex items-start gap-4">
//                   {/* Large location icon in a circle box */}
//                   <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white">
//                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
//                       <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.25 11.2 20.5 11.5 20.8C11.7 21 12.3 21 12.5 20.8C12.8 20.5 19 13.25 19 9C19 5.13401 15.866 2 12 2Z" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <circle cx="12" cy="9" r="2.2" fill="#111827" />
//                     </svg>
//                   </div>

//                   <div className="flex-1">
//                     <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
//                     <p className="text-sm text-gray-500 mt-1">We will deliver your order to this address</p>

//                     {/* address block */}
//                     {selectedAddress ? (
//                       <div className="mt-4">
//                         <p className="font-medium text-gray-800">
//                           {selectedAddress.name}{" "}
//                           <span className="ml-2 inline-block px-2 py-0.5 text-xs border rounded text-gray-700">
//                             {selectedAddress.label}
//                           </span>
//                         </p>
//                         <p className="text-sm text-gray-700 mt-2 leading-snug">{selectedAddress.address}</p>
//                         <p className="text-sm mt-2">Phone: <span className="font-medium">{selectedAddress.phone}</span></p>

//                         <button
//                           onClick={() => setShowDrawer(true)}
//                           className="mt-3 text-sm text-blue-600 hover:underline"
//                         >
//                           Change Address
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="mt-4 text-sm text-gray-500">No address selected</div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Right: COD box (dashed border, centered) */}
//               <div className="flex items-center justify-center">
//                 <div className="w-full border border-dashed rounded p-4 text-center">
//                   <p className="text-green-700 font-semibold text-sm">Cash on delivery available</p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Est Delivery{" "}
//                     <span className="font-semibold">
//                       {formatShortDate(4)} - {formatShortDate(7)}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Expected Delivery */}
//           <div className="bg-white border rounded p-6">
//             <div className="flex items-center gap-4">
//               {/* large box icon in square */}
//               <div className="w-12 h-12 rounded-md border border-gray-200 flex items-center justify-center bg-white">
//                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
//                   <path d="M21 16V8a1 1 0 0 0-.553-.894l-8-4.5a1 1 0 0 0-.894 0l-8 4.5A1 1 0 0 0 3 8v8a1 1 0 0 0 .553.894l8 4.5a1 1 0 0 0 .894 0l8-4.5A1 1 0 0 0 21 16z" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M7 8.5l5 2.5 5-2.5" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Expected Delivery</h3>
//                 <p className="text-sm text-gray-500">Estimated delivery dates for your order</p>
//               </div>
//             </div>

//             {/* Items grid: show ALL items in 2 columns (wrap naturally) */}
//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {cart.length === 0 ? (
//                 <div className="text-sm text-gray-500">No items in bag.</div>
//               ) : (
//                 cart.map((item, idx) => {
//                   const dateLabel = formatShortDate(idx + 4);
//                   return (
//                     <div key={item._id || item.productId || idx} className="flex items-start gap-4">
//                       {/* larger thumb */}
//                       <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                         <img
//                           src={item.image || item.product?.image || "/placeholder.png"}
//                           alt={item.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>

//                       <div className="flex-1">
//                         <p className="text-sm font-semibold text-gray-900">{dateLabel}</p>
//                         <p className="text-sm text-gray-700 mt-1">{item.brand || item.vendorName || "Brand"}</p>
//                         <p className="text-sm text-gray-500 mt-1">{item.title}</p>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right column: summary */}
//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Order Details</h4>

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
//               onClick={() => navigate("/payment")}
//               className="mt-4 w-full bg-yellow-700 text-white py-2 rounded hover:bg-yellow-800"
//             >
//               PROCEED TO PAYMENT
//             </button>
//           </div>
//         </aside>
//       </div>

//       {/* Address Drawer (right-side) */}
//       {showDrawer && (
//         <div className="fixed inset-0 z-50 flex">
//           <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowDrawer(false)} />
//           <div className="relative ml-auto w-full sm:w-96 bg-white h-full shadow-lg overflow-y-auto p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Change Address</h3>
//               <button onClick={() => setShowDrawer(false)} className="text-gray-600">✕</button>
//             </div>

//             <div className="space-y-4">
//               {addresses.map((addr) => (
//                 <div key={addr.id} className={`p-4 border rounded ${addr.selected ? "bg-yellow-50" : "bg-white"}`}>
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="font-semibold">{addr.name}</p>
//                       <p className="text-sm text-gray-700 mt-1">{addr.address}</p>
//                       <p className="text-sm mt-1">Phone: <span className="font-medium">{addr.phone}</span></p>
//                     </div>
//                     <div className="flex flex-col items-end">
//                       <button
//                         onClick={() =>
//                           setAddresses((prev) => prev.map((a) => ({ ...a, selected: a.id === addr.id })))
//                         }
//                         className="text-sm text-blue-600"
//                       >
//                         {addr.selected ? "Selected" : "Deliver Here"}
//                       </button>
//                       <button className="text-xs text-gray-500 mt-2">Edit</button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={() =>
//                 setAddresses((prev) => [
//                   ...prev,
//                   {
//                     id: Date.now(),
//                     name: "New Address",
//                     label: "HOME",
//                     address: "New sample address line",
//                     phone: "9999999999",
//                     selected: false,
//                   },
//                 ])
//               }
//               className="mt-6 w-full border py-2 rounded text-sm text-blue-600"
//             >
//               + Add New Address
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// ************************************************************************* 

// frontend/src/pages/Shipping.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// function formatShortDate(daysFromNow = 4) {
//   const d = new Date();
//   d.setDate(d.getDate() + daysFromNow);
//   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
// }

// export default function ShippingPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();

//   const [addresses, setAddresses] = useState([
//     {
//       id: 1,
//       name: "Kushal Chaturvedi",
//       label: "HOME",
//       address: "43, sira, rangnatha stores, tumkur, karnataka, india - 572137",
//       phone: "9606730783",
//       selected: true,
//     },
//     {
//       id: 2,
//       name: "Kushal",
//       label: "DEFAULT",
//       address: "Sai Annapurna PG, BTM 2nd stage, Bangalore - 560076",
//       phone: "9606730783",
//       selected: false,
//     },
//   ]);

//   const [showDrawer, setShowDrawer] = useState(false);

//   const bagTotal = cart.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
//   const bagDiscount = cart.reduce(
//     (s, i) => s + Math.max(0, (Number(i.mrp || i.price || 0) - Number(i.price || 0))) * Number(i.quantity || 1),
//     0
//   );
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee - bagDiscount;

//   const selectedAddress = addresses.find((a) => a.selected) || null;

//   const handleProceedToPayment = () => {
//     if (!selectedAddress) {
//       alert("Please select a delivery address");
//       return;
//     }

//     // Extract structured shippingAddress
//     const shippingAddress = {
//       name: selectedAddress.name,
//       phone: selectedAddress.phone,
//       line1: selectedAddress.address,
//       city: selectedAddress.address.includes("Bangalore") ? "Bengaluru" : "Other",
//       state: "Karnataka",
//       pincode: selectedAddress.address.match(/\d{6}/)?.[0] || "",
//       country: "India",
//     };

//     if (shippingAddress.city !== "Bengaluru") {
//       alert("Sorry, we currently deliver only in Bengaluru.");
//       return;
//     }

//     navigate("/payment", {
//       state: {
//         bagTotal,
//         bagDiscount,
//         deliveryFee,
//         platformFee,
//         orderTotal,
//         shippingAddress,
//       },
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-6 px-4">
//       {/* ...existing UI unchanged... */}

//       <aside className="w-full lg:w-[320px]">
//         <div className="bg-white border rounded p-5 sticky top-20">
//           <h4 className="text-sm font-semibold mb-3">Order Details</h4>

//           <div className="text-sm space-y-2">
//             <div className="flex justify-between">
//               <span>Bag Total</span>
//               <span>₹{bagTotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-green-600">
//               <span>Bag Discount</span>
//               <span>-₹{bagDiscount.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery Fee</span>
//               <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Platform Fee</span>
//               <span>₹{platformFee}</span>
//             </div>
//             <div className="flex justify-between font-semibold border-t pt-3 mt-3">
//               <span>Order Total</span>
//               <span>₹{orderTotal.toFixed(2)}</span>
//             </div>
//           </div>

//           <button
//             onClick={handleProceedToPayment}
//             className="mt-4 w-full bg-yellow-700 text-white py-2 rounded hover:bg-yellow-800"
//           >
//             PROCEED TO PAYMENT
//           </button>
//         </div>
//       </aside>

//       {/* existing drawer code unchanged */}
//     </div>
//   );
// }



// **********************************************************************


// frontend/src/pages/Shipping.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// function formatShortDate(daysFromNow = 4) {
//   const d = new Date();
//   d.setDate(d.getDate() + daysFromNow);
//   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
// }

// export default function ShippingPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();

//   const [addresses, setAddresses] = useState([
//     {
//       id: 1,
//       name: "Kushal Chaturvedi",
//       label: "HOME",
//       address: "43, sira, rangnatha stores, tumkur, karnataka, india - 572137",
//       phone: "9606730783",
//       selected: true,
//     },
//     {
//       id: 2,
//       name: "Kushal",
//       label: "DEFAULT",
//       address: "Sai Annapurna PG, BTM 2nd stage, Bangalore - 560076",
//       phone: "9606730783",
//       selected: false,
//     },
//   ]);

//   const [showDrawer, setShowDrawer] = useState(false);

//   // editing state for drawer (id of address being edited)
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({
//     name: "",
//     label: "",
//     address: "",
//     phone: "",
//   });

//   const bagTotal = cart.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
//   const bagDiscount = cart.reduce(
//     (s, i) => s + Math.max(0, (Number(i.mrp || i.price || 0) - Number(i.price || 0))) * Number(i.quantity || 1),
//     0
//   );
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee - bagDiscount;

//   const selectedAddress = addresses.find((a) => a.selected) || null;

//   const startEdit = (addr) => {
//     setEditingId(addr.id);
//     setEditForm({
//       name: addr.name || "",
//       label: addr.label || "",
//       address: addr.address || "",
//       phone: addr.phone || "",
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: "", label: "", address: "", phone: "" });
//   };

//   const saveEdit = (id) => {
//     setAddresses((prev) =>
//       prev.map((a) => (a.id === id ? { ...a, ...editForm } : a))
//     );
//     cancelEdit();
//   };

//   const addNewAddress = () => {
//     const newAddr = {
//       id: Date.now(),
//       name: "New Address",
//       label: "HOME",
//       address: "New sample address line",
//       phone: "9999999999",
//       selected: false,
//     };
//     setAddresses((prev) => [newAddr, ...prev]);
//     // open editor for new one
//     setTimeout(() => {
//       startEdit(newAddr);
//     }, 50);
//   };

//   const handleProceedToPayment = () => {
//     if (!selectedAddress) {
//       alert("Please select a delivery address");
//       return;
//     }

//     // try to extract pincode and simple city detection
//     const pincode = (selectedAddress.address.match(/\d{6}/) || [null])[0] || "";
//     // simplest city detection: presence of Bangalore/Bengaluru
//     const city =
//       /bengaluru|bangalore/i.test(selectedAddress.address) ? "Bengaluru" : "Other";

//     const shippingAddress = {
//       name: selectedAddress.name,
//       phone: selectedAddress.phone,
//       line1: selectedAddress.address,
//       city,
//       state: "Karnataka",
//       pincode,
//       country: "India",
//     };

//     if (shippingAddress.city !== "Bengaluru") {
//       alert("Sorry, we currently deliver only in Bengaluru.");
//       return;
//     }

//     navigate("/payment", {
//       state: {
//         bagTotal,
//         bagDiscount,
//         deliveryFee,
//         platformFee,
//         orderTotal,
//         shippingAddress,
//       },
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-6 px-4">
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         <div className="space-y-6">
//           <div className="bg-white border rounded p-6">
//             <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start">
//               <div>
//                 <div className="flex items-start gap-4">
//                   <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white">
//                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
//                       <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.25 11.2 20.5 11.5 20.8C11.7 21 12.3 21 12.5 20.8C12.8 20.5 19 13.25 19 9C19 5.13401 15.866 2 12 2Z" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <circle cx="12" cy="9" r="2.2" fill="#111827" />
//                     </svg>
//                   </div>

//                   <div className="flex-1">
//                     <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
//                     <p className="text-sm text-gray-500 mt-1">We will deliver your order to this address</p>

//                     {selectedAddress ? (
//                       <div className="mt-4">
//                         <p className="font-medium text-gray-800">
//                           {selectedAddress.name}{" "}
//                           <span className="ml-2 inline-block px-2 py-0.5 text-xs border rounded text-gray-700">
//                             {selectedAddress.label}
//                           </span>
//                         </p>
//                         <p className="text-sm text-gray-700 mt-2 leading-snug">{selectedAddress.address}</p>
//                         <p className="text-sm mt-2">Phone: <span className="font-medium">{selectedAddress.phone}</span></p>

//                         <button
//                           onClick={() => setShowDrawer(true)}
//                           className="mt-3 text-sm text-blue-600 hover:underline"
//                         >
//                           Change Address
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="mt-4 text-sm text-gray-500">No address selected</div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center justify-center">
//                 <div className="w-full border border-dashed rounded p-4 text-center">
//                   <p className="text-green-700 font-semibold text-sm">Cash on delivery available</p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Est Delivery{" "}
//                     <span className="font-semibold">
//                       {formatShortDate(4)} - {formatShortDate(7)}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-md border border-gray-200 flex items-center justify-center bg-white">
//                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
//                   <path d="M21 16V8a1 1 0 0 0-.553-.894l-8-4.5a1 1 0 0 0-.894 0l-8 4.5A1 1 0 0 0 3 8v8a1 1 0 0 0 .553.894l8 4.5a1 1 0 0 0 .894 0l8-4.5A1 1 0 0 0 21 16z" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M7 8.5l5 2.5 5-2.5" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Expected Delivery</h3>
//                 <p className="text-sm text-gray-500">Estimated delivery dates for your order</p>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {cart.length === 0 ? (
//                 <div className="text-sm text-gray-500">No items in bag.</div>
//               ) : (
//                 cart.map((item, idx) => {
//                   const dateLabel = formatShortDate(idx + 4);
//                   return (
//                     <div key={item._id || item.productId || idx} className="flex items-start gap-4">
//                       <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                         <img
//                           src={item.image || item.product?.image || "/placeholder.png"}
//                           alt={item.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>

//                       <div className="flex-1">
//                         <p className="text-sm font-semibold text-gray-900">{dateLabel}</p>
//                         <p className="text-sm text-gray-700 mt-1">{item.brand || item.vendorName || "Brand"}</p>
//                         <p className="text-sm text-gray-500 mt-1">{item.title}</p>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>

//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Order Details</h4>

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
//               onClick={handleProceedToPayment}
//               className="mt-4 w-full bg-yellow-700 text-white py-2 rounded hover:bg-yellow-800"
//             >
//               PROCEED TO PAYMENT
//             </button>
//           </div>
//         </aside>
//       </div>

//       {/* Address Drawer */}
//       {showDrawer && (
//         <div className="fixed inset-0 z-50 flex">
//           <div className="absolute inset-0 bg-black opacity-40" onClick={() => { setShowDrawer(false); cancelEdit(); }} />
//           <div className="relative ml-auto w-full sm:w-96 bg-white h-full shadow-lg overflow-y-auto p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Change Address</h3>
//               <button
//                 onClick={() => { setShowDrawer(false); cancelEdit(); }}
//                 className="text-gray-600"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-4">
//               {addresses.map((addr) => (
//                 <div key={addr.id} className={`p-4 border rounded ${addr.selected ? "bg-yellow-50" : "bg-white"}`}>
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="font-semibold">{addr.name}</p>
//                       <p className="text-sm text-gray-700 mt-1">{addr.address}</p>
//                       <p className="text-sm mt-1">Phone: <span className="font-medium">{addr.phone}</span></p>
//                     </div>

//                     <div className="flex flex-col items-end">
//                       <button
//                         onClick={() =>
//                           setAddresses((prev) => prev.map((a) => ({ ...a, selected: a.id === addr.id })))
//                         }
//                         className="text-sm text-blue-600"
//                       >
//                         {addr.selected ? "Selected" : "Deliver Here"}
//                       </button>

//                       <button
//                         onClick={() => startEdit(addr)}
//                         className="text-xs text-gray-500 mt-2"
//                       >
//                         Edit
//                       </button>
//                     </div>
//                   </div>

//                   {/* Inline edit form for the address being edited */}
//                   {editingId === addr.id && (
//                     <div className="mt-3 border-t pt-3">
//                       <div className="space-y-2">
//                         <div>
//                           <label className="text-xs text-gray-600">Name</label>
//                           <input
//                             className="w-full border rounded px-2 py-1 mt-1 text-sm"
//                             value={editForm.name}
//                             onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
//                           />
//                         </div>
//                         <div>
//                           <label className="text-xs text-gray-600">Label</label>
//                           <input
//                             className="w-full border rounded px-2 py-1 mt-1 text-sm"
//                             value={editForm.label}
//                             onChange={(e) => setEditForm((s) => ({ ...s, label: e.target.value }))}
//                           />
//                         </div>
//                         <div>
//                           <label className="text-xs text-gray-600">Address</label>
//                           <textarea
//                             className="w-full border rounded px-2 py-1 mt-1 text-sm"
//                             rows={2}
//                             value={editForm.address}
//                             onChange={(e) => setEditForm((s) => ({ ...s, address: e.target.value }))}
//                           />
//                         </div>
//                         <div>
//                           <label className="text-xs text-gray-600">Phone</label>
//                           <input
//                             className="w-full border rounded px-2 py-1 mt-1 text-sm"
//                             value={editForm.phone}
//                             onChange={(e) => setEditForm((s) => ({ ...s, phone: e.target.value }))}
//                           />
//                         </div>

//                         <div className="flex gap-2 mt-2">
//                           <button
//                             onClick={() => saveEdit(addr.id)}
//                             className="px-3 py-1 bg-yellow-700 text-white rounded text-sm"
//                           >
//                             Save
//                           </button>
//                           <button onClick={cancelEdit} className="px-3 py-1 border rounded text-sm">Cancel</button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={addNewAddress}
//               className="mt-6 w-full border py-2 rounded text-sm text-blue-600"
//             >
//               + Add New Address
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// ********************************************************************************************

// frontend/src/pages/Shipping.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// function formatShortDate(daysFromNow = 4) {
//   const d = new Date();
//   d.setDate(d.getDate() + daysFromNow);
//   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
// }

// export default function ShippingPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();

//   const [addresses, setAddresses] = useState([
//     {
//       id: 1,
//       name: "Kushal Chaturvedi",
//       label: "HOME",
//       address: "43, sira, rangnatha stores, tumkur, karnataka, india - 572137",
//       phone: "9606730783",
//       selected: true,
//     },
//     {
//       id: 2,
//       name: "Kushal",
//       label: "DEFAULT",
//       address: "Sai Annapurna PG, BTM 2nd stage, Bangalore - 560076",
//       phone: "9606730783",
//       selected: false,
//     },
//   ]);

//   const [showDrawer, setShowDrawer] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({
//     name: "",
//     label: "",
//     address: "",
//     phone: "",
//   });

//   // BAG TOTAL (cart is authoritative)
//   const bagTotal = cart.reduce((s, i) => {
//     const price = Number(i.price || 0);
//     const qty = Number(i.quantity || 1);
//     return s + price * qty;
//   }, 0);

//   // BAG DISCOUNT: robust numeric handling + clamp so discount cannot exceed bagTotal
//   const computedDiscount = cart.reduce((s, i) => {
//     // safe read: use i.mrp if available else i.originalPrice else i.price (so discount >= 0)
//     const mrp = Number(i.mrp ?? i.originalPrice ?? 0);
//     const price = Number(i.price ?? 0);
//     const qty = Number(i.quantity ?? 1);
//     const singleDiscount = Math.max(0, mrp - price);
//     return s + singleDiscount * qty;
//   }, 0);

//   // clamp discount to not exceed bagTotal
//   const bagDiscount = Math.min(Number(computedDiscount || 0), Number(bagTotal || 0));

//   // fees
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = cart.length > 0 ? 29 : 0;

//   // final total (never negative because bagDiscount is clamped)
//   const orderTotal = Number((bagTotal + deliveryFee + platformFee - bagDiscount) || 0);

//   const selectedAddress = addresses.find((a) => a.selected) || null;

//   const startEdit = (addr) => {
//     setEditingId(addr.id);
//     setEditForm({
//       name: addr.name || "",
//       label: addr.label || "",
//       address: addr.address || "",
//       phone: addr.phone || "",
//     });
//   };
//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: "", label: "", address: "", phone: "" });
//   };
//   const saveEdit = (id) => {
//     setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...editForm } : a)));
//     cancelEdit();
//   };
//   const addNewAddress = () => {
//     const newAddr = {
//       id: Date.now(),
//       name: "New Address",
//       label: "HOME",
//       address: "New sample address line",
//       phone: "9999999999",
//       selected: false,
//     };
//     setAddresses((prev) => [newAddr, ...prev]);
//     setTimeout(() => startEdit(newAddr), 50);
//   };

//   const handleProceedToPayment = () => {
//     if (!selectedAddress) {
//       alert("Please select a delivery address");
//       return;
//     }

//     // Extract pincode and simple city detection
//     const pincode = (selectedAddress.address.match(/\d{6}/) || [null])[0] || "";
//     const city = /bengaluru|bangalore/i.test(selectedAddress.address) ? "Bengaluru" : "Other";

//     if (city !== "Bengaluru") {
//       alert("Sorry, we currently deliver only in Bengaluru.");
//       return;
//     }

//     const shippingAddress = {
//       name: selectedAddress.name,
//       phone: selectedAddress.phone,
//       line1: selectedAddress.address,
//       city,
//       state: "Karnataka",
//       pincode,
//       country: "India",
//     };

//     // Navigate to payment — Payment page will compute totals from cart (cart is source of truth).
//     navigate("/payment", {
//       state: {
//         shippingAddress,
//       },
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-6 px-4">
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         <div className="space-y-6">
//           <div className="bg-white border rounded p-6">
//             <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start">
//               <div>
//                 <div className="flex items-start gap-4">
//                   <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white">
//                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
//                       <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.25 11.2 20.5 11.5 20.8C11.7 21 12.3 21 12.5 20.8C12.8 20.5 19 13.25 19 9C19 5.13401 15.866 2 12 2Z" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <circle cx="12" cy="9" r="2.2" fill="#111827" />
//                     </svg>
//                   </div>

//                   <div className="flex-1">
//                     <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
//                     <p className="text-sm text-gray-500 mt-1">We will deliver your order to this address</p>

//                     {selectedAddress ? (
//                       <div className="mt-4">
//                         <p className="font-medium text-gray-800">
//                           {selectedAddress.name}{" "}
//                           <span className="ml-2 inline-block px-2 py-0.5 text-xs border rounded text-gray-700">
//                             {selectedAddress.label}
//                           </span>
//                         </p>
//                         <p className="text-sm text-gray-700 mt-2 leading-snug">{selectedAddress.address}</p>
//                         <p className="text-sm mt-2">Phone: <span className="font-medium">{selectedAddress.phone}</span></p>

//                         <button onClick={() => setShowDrawer(true)} className="mt-3 text-sm text-blue-600 hover:underline">
//                           Change Address
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="mt-4 text-sm text-gray-500">No address selected</div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center justify-center">
//                 <div className="w-full border border-dashed rounded p-4 text-center">
//                   <p className="text-green-700 font-semibold text-sm">Cash on delivery available</p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Est Delivery{" "}
//                     <span className="font-semibold">
//                       {formatShortDate(4)} - {formatShortDate(7)}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-md border border-gray-200 flex items-center justify-center bg-white">
//                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
//                   <path d="M21 16V8a1 1 0 0 0-.553-.894l-8-4.5a1 1 0 0 0-.894 0l-8 4.5A1 1 0 0 0 3 8v8a1 1 0 0 0 .553.894l8 4.5a1 1 0 0 0 .894 0l8-4.5A1 1 0 0 0 21 16z" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M7 8.5l5 2.5 5-2.5" stroke="#111827" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Expected Delivery</h3>
//                 <p className="text-sm text-gray-500">Estimated delivery dates for your order</p>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {cart.length === 0 ? (
//                 <div className="text-sm text-gray-500">No items in bag.</div>
//               ) : (
//                 cart.map((item, idx) => {
//                   const dateLabel = formatShortDate(idx + 4);
//                   return (
//                     <div key={item._id || item.productId || idx} className="flex items-start gap-4">
//                       <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                         <img
//                           src={item.image || item.product?.image || "/placeholder.png"}
//                           alt={item.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>

//                       <div className="flex-1">
//                         <p className="text-sm font-semibold text-gray-900">{dateLabel}</p>
//                         <p className="text-sm text-gray-700 mt-1">{item.brand || item.vendorName || "Brand"}</p>
//                         <p className="text-sm text-gray-500 mt-1">{item.title}</p>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>

//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Order Details</h4>

//             <div className="text-sm space-y-2">
//               <div className="flex justify-between">
//                 <span>Bag Total</span>
//                 <span>₹{Number(bagTotal || 0).toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between text-green-600">
//                 <span>Bag Discount</span>
//                 <span>-₹{Number(bagDiscount || 0).toFixed(2)}</span>
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
//                 <span>₹{Number(orderTotal || 0).toFixed(2)}</span>
//               </div>
//             </div>

//             <button onClick={handleProceedToPayment} className="mt-4 w-full bg-yellow-700 text-white py-2 rounded hover:bg-yellow-800">
//               PROCEED TO PAYMENT
//             </button>
//           </div>
//         </aside>
//       </div>

//       {showDrawer && (
//         <div className="fixed inset-0 z-50 flex">
//           <div className="absolute inset-0 bg-black opacity-40" onClick={() => { setShowDrawer(false); cancelEdit(); }} />
//           <div className="relative ml-auto w-full sm:w-96 bg-white h-full shadow-lg overflow-y-auto p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Change Address</h3>
//               <button onClick={() => { setShowDrawer(false); cancelEdit(); }} className="text-gray-600">✕</button>
//             </div>

//             <div className="space-y-4">
//               {addresses.map((addr) => (
//                 <div key={addr.id} className={`p-4 border rounded ${addr.selected ? "bg-yellow-50" : "bg-white"}`}>
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="font-semibold">{addr.name}</p>
//                       <p className="text-sm text-gray-700 mt-1">{addr.address}</p>
//                       <p className="text-sm mt-1">Phone: <span className="font-medium">{addr.phone}</span></p>
//                     </div>
//                     <div className="flex flex-col items-end">
//                       <button
//                         onClick={() => setAddresses((prev) => prev.map((a) => ({ ...a, selected: a.id === addr.id })))}
//                         className="text-sm text-blue-600"
//                       >
//                         {addr.selected ? "Selected" : "Deliver Here"}
//                       </button>

//                       <button onClick={() => startEdit(addr)} className="text-xs text-gray-500 mt-2">
//                         Edit
//                       </button>
//                     </div>
//                   </div>

//                   {editingId === addr.id && (
//                     <div className="mt-3 border-t pt-3">
//                       <div className="space-y-2">
//                         <div>
//                           <label className="text-xs text-gray-600">Name</label>
//                           <input className="w-full border rounded px-2 py-1 mt-1 text-sm" value={editForm.name} onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))} />
//                         </div>
//                         <div>
//                           <label className="text-xs text-gray-600">Label</label>
//                           <input className="w-full border rounded px-2 py-1 mt-1 text-sm" value={editForm.label} onChange={(e) => setEditForm((s) => ({ ...s, label: e.target.value }))} />
//                         </div>
//                         <div>
//                           <label className="text-xs text-gray-600">Address</label>
//                           <textarea className="w-full border rounded px-2 py-1 mt-1 text-sm" rows={2} value={editForm.address} onChange={(e) => setEditForm((s) => ({ ...s, address: e.target.value }))} />
//                         </div>
//                         <div>
//                           <label className="text-xs text-gray-600">Phone</label>
//                           <input className="w-full border rounded px-2 py-1 mt-1 text-sm" value={editForm.phone} onChange={(e) => setEditForm((s) => ({ ...s, phone: e.target.value }))} />
//                         </div>

//                         <div className="flex gap-2 mt-2">
//                           <button onClick={() => saveEdit(addr.id)} className="px-3 py-1 bg-yellow-700 text-white rounded text-sm">Save</button>
//                           <button onClick={cancelEdit} className="px-3 py-1 border rounded text-sm">Cancel</button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <button onClick={addNewAddress} className="mt-6 w-full border py-2 rounded text-sm text-blue-600">+ Add New Address</button>
//           </div>
//         </div>
//       )}


//     </div>
//   );
// }








// ****************************************************************************************


// frontend/src/pages/Shipping.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// function formatShortDate(daysFromNow = 4) {
//   const d = new Date();
//   d.setDate(d.getDate() + daysFromNow);
//   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
// }

// export default function ShippingPage() {
//   const navigate = useNavigate();
//   const { cart } = useCart();

//   const [addresses, setAddresses] = useState([
//     {
//       id: 1,
//       name: "Kushal Chaturvedi",
//       label: "HOME",
//       line1: "43, sira, rangnatha stores",
//       city: "Tumkur",
//       state: "Karnataka",
//       pincode: "572137",
//       phone: "9606730783",
//       selected: true,
//     },
//     {
//       id: 2,
//       name: "Kushal",
//       label: "DEFAULT",
//       line1: "Sai Annapurna PG, BTM 2nd stage",
//       city: "Bengaluru",
//       state: "Karnataka",
//       pincode: "560076",
//       phone: "9606730783",
//       selected: false,
//     },
//   ]);

//   const [showDrawer, setShowDrawer] = useState(false);
//   const [editingAddress, setEditingAddress] = useState(null);

//   // totals (same as Cart)
//   const bagTotal = cart.reduce(
//     (s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)),
//     0
//   );
//   const deliveryFee = bagTotal > 1000 ? 0 : 99;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   const selectedAddress = addresses.find((a) => a.selected) || null;

//   const handleSaveAddress = () => {
//     setAddresses((prev) =>
//       prev.map((a) =>
//         a.id === editingAddress.id ? { ...editingAddress, selected: true } : a
//       )
//     );
//     setEditingAddress(null);
//     setShowDrawer(false);
//   };

//   const isDeliverable = selectedAddress?.city?.toLowerCase() === "bengaluru";

//   return (
//     <div className="max-w-6xl mx-auto py-6 px-4">
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
//         {/* Left column */}
//         <div className="space-y-6">
//           {/* Delivery Address */}
//           <div className="bg-white border rounded p-6">
//             <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Delivery Address
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   We will deliver your order to this address
//                 </p>

//                 {selectedAddress ? (
//                   <div className="mt-4">
//                     <p className="font-medium text-gray-800">
//                       {selectedAddress.name}{" "}
//                       <span className="ml-2 inline-block px-2 py-0.5 text-xs border rounded text-gray-700">
//                         {selectedAddress.label}
//                       </span>
//                     </p>
//                     <p className="text-sm text-gray-700 mt-2 leading-snug">
//                       {selectedAddress.line1},{" "}
//                       {selectedAddress.city}, {selectedAddress.state} -{" "}
//                       {selectedAddress.pincode}
//                     </p>
//                     <p className="text-sm mt-2">
//                       Phone:{" "}
//                       <span className="font-medium">{selectedAddress.phone}</span>
//                     </p>

//                     <button
//                       onClick={() => setShowDrawer(true)}
//                       className="mt-3 text-sm text-blue-600 hover:underline"
//                     >
//                       Change Address
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="mt-4 text-sm text-gray-500">
//                     No address selected
//                   </div>
//                 )}
//               </div>

//               {/* COD box */}
//               <div className="flex items-center justify-center">
//                 <div className="w-full border border-dashed rounded p-4 text-center">
//                   <p className="text-green-700 font-semibold text-sm">
//                     Cash on delivery available
//                   </p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Est Delivery{" "}
//                     <span className="font-semibold">
//                       {formatShortDate(4)} - {formatShortDate(7)}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Expected Delivery */}
//           <div className="bg-white border rounded p-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Expected Delivery
//             </h3>
//             <p className="text-sm text-gray-500">
//               Estimated delivery dates for your order
//             </p>
//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {cart.map((item, idx) => (
//                 <div
//                   key={item._id || idx}
//                   className="flex items-start gap-4"
//                 >
//                   <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
//                     <img
//                       src={item.image || "/placeholder.png"}
//                       alt={item.title}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-gray-900">
//                       {formatShortDate(idx + 4)}
//                     </p>
//                     <p className="text-sm text-gray-700 mt-1">
//                       {item.brand || "Brand"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">{item.title}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right column: summary */}
//         <aside className="w-full lg:w-[320px]">
//           <div className="bg-white border rounded p-5 sticky top-20">
//             <h4 className="text-sm font-semibold mb-3">Order Details</h4>
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
//               onClick={() =>
//                 navigate("/payment", { state: { shippingAddress: selectedAddress } })
//               }
//               className={`mt-4 w-full py-2 rounded ${
//                 isDeliverable
//                   ? "bg-yellow-700 text-white hover:bg-yellow-800"
//                   : "bg-gray-400 text-gray-100 cursor-not-allowed"
//               }`}
//               disabled={!isDeliverable}
//             >
//               PROCEED TO PAYMENT
//             </button>
//             {!isDeliverable && (
//               <p className="text-xs text-red-600 mt-2">
//                 Orders can only be delivered to Bengaluru city.
//               </p>
//             )}
//           </div>
//         </aside>
//       </div>

//       {/* Address Drawer */}
//       {showDrawer && (
//         <div className="fixed inset-0 z-50 flex">
//           <div
//             className="absolute inset-0 bg-black opacity-40"
//             onClick={() => setShowDrawer(false)}
//           />
//           <div className="relative ml-auto w-full sm:w-96 bg-white h-full shadow-lg overflow-y-auto p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Change Address</h3>
//               <button onClick={() => setShowDrawer(false)}>✕</button>
//             </div>

//             {editingAddress ? (
//               <div className="space-y-3">
//                 <input
//                   className="border w-full p-2 text-sm rounded"
//                   value={editingAddress.name}
//                   onChange={(e) =>
//                     setEditingAddress({ ...editingAddress, name: e.target.value })
//                   }
//                   placeholder="Name"
//                 />
//                 <input
//                   className="border w-full p-2 text-sm rounded"
//                   value={editingAddress.line1}
//                   onChange={(e) =>
//                     setEditingAddress({ ...editingAddress, line1: e.target.value })
//                   }
//                   placeholder="Address"
//                 />
//                 <input
//                   className="border w-full p-2 text-sm rounded"
//                   value={editingAddress.city}
//                   onChange={(e) =>
//                     setEditingAddress({ ...editingAddress, city: e.target.value })
//                   }
//                   placeholder="City"
//                 />
//                 <input
//                   className="border w-full p-2 text-sm rounded"
//                   value={editingAddress.state}
//                   onChange={(e) =>
//                     setEditingAddress({ ...editingAddress, state: e.target.value })
//                   }
//                   placeholder="State"
//                 />
//                 <input
//                   className="border w-full p-2 text-sm rounded"
//                   value={editingAddress.pincode}
//                   onChange={(e) =>
//                     setEditingAddress({ ...editingAddress, pincode: e.target.value })
//                   }
//                   placeholder="Pincode"
//                 />
//                 <input
//                   className="border w-full p-2 text-sm rounded"
//                   value={editingAddress.phone}
//                   onChange={(e) =>
//                     setEditingAddress({ ...editingAddress, phone: e.target.value })
//                   }
//                   placeholder="Phone"
//                 />

//                 <button
//                   onClick={handleSaveAddress}
//                   className="mt-4 w-full bg-yellow-700 text-white py-2 rounded"
//                 >
//                   Save Address
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {addresses.map((addr) => (
//                   <div
//                     key={addr.id}
//                     className={`p-4 border rounded ${
//                       addr.selected ? "bg-yellow-50" : "bg-white"
//                     }`}
//                   >
//                     <div className="flex justify-between">
//                       <div>
//                         <p className="font-semibold">{addr.name}</p>
//                         <p className="text-sm text-gray-700 mt-1">
//                           {addr.line1}, {addr.city}
//                         </p>
//                         <p className="text-sm mt-1">
//                           Phone: <span className="font-medium">{addr.phone}</span>
//                         </p>
//                       </div>
//                       <div className="flex flex-col items-end">
//                         <button
//                           onClick={() =>
//                             setAddresses((prev) =>
//                               prev.map((a) => ({
//                                 ...a,
//                                 selected: a.id === addr.id,
//                               }))
//                             )
//                           }
//                           className="text-sm text-blue-600"
//                         >
//                           {addr.selected ? "Selected" : "Deliver Here"}
//                         </button>
//                         <button
//                           onClick={() => setEditingAddress(addr)}
//                           className="text-xs text-gray-500 mt-2"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}  

   



      


//     </div>
//   );
// }




// ******************************************************



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function formatShortDate(daysFromNow = 4) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export default function ShippingPage() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Kushal Chaturvedi",
      label: "HOME",
      address: "43, sira, rangnatha stores",
      city: "Tumkur",
      state: "Karnataka",
      pincode: "572137",
      phone: "9606730783",
      selected: true,
    },
    {
      id: 2,
      name: "Kushal",
      label: "DEFAULT",
      address: "Sai Annapurna PG, BTM 2nd stage",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560076",
      phone: "9606730783",
      selected: false,
    },
  ]);

  const [showDrawer, setShowDrawer] = useState(false);

  // Drawer edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    label: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // totals (same as Cart)
  const bagTotal = cart.reduce(
    (s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)),
    0
  );
  const deliveryFee = bagTotal > 1000 ? 0 : 99;
  const platformFee = cart.length > 0 ? 29 : 0;
  const orderTotal = bagTotal + deliveryFee + platformFee;

  const selectedAddress = addresses.find((a) => a.selected) || null;

  const isDeliverable = selectedAddress?.city?.toLowerCase() === "bengaluru";

  /* ---------- Drawer helpers ---------- */

  function openDrawer() {
    setShowDrawer(true);
    // reset edit state
    setEditingId(null);
    setEditForm({
      name: "",
      label: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
  }

  function startEdit(addr) {
    setEditingId(addr.id);
    setEditForm({
      name: addr.name || "",
      label: addr.label || "",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      phone: addr.phone || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({
      name: "",
      label: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
  }

  function saveEdit(id) {
    // basic validation
    if (!editForm.name.trim() || !editForm.address.trim()) {
      alert("Please provide name and address");
      return;
    }

    setAddresses((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              name: editForm.name,
              label: editForm.label,
              address: editForm.address,
              city: editForm.city,
              state: editForm.state,
              pincode: editForm.pincode,
              phone: editForm.phone,
              selected: true, // when saving we mark it selected (common UX)
            }
          : { ...a, selected: false }
      )
    );

    // close edit panel for that address
    setEditingId(null);
    setEditForm({
      name: "",
      label: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
  }

  function addNewAddress() {
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const newAddr = {
      id: newId,
      name: "",
      label: "HOME",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      selected: false,
    };

    // push new address and start editing it
    setAddresses((prev) => [...prev.map(a => ({...a, selected:false})), newAddr]);
    setEditingId(newId);
    setEditForm({
      name: "",
      label: "HOME",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
  }

  /* ---------- End drawer helpers ---------- */

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-white border rounded p-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  We will deliver your order to this address
                </p>

                {selectedAddress ? (
                  <div className="mt-4">
                    <p className="font-medium text-gray-800">
                      {selectedAddress.name}{" "}
                      <span className="ml-2 inline-block px-2 py-0.5 text-xs border rounded text-gray-700">
                        {selectedAddress.label}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 mt-2 leading-snug">
                      {selectedAddress.address},{" "}
                      {selectedAddress.city}, {selectedAddress.state} -{" "}
                      {selectedAddress.pincode}
                    </p>
                    <p className="text-sm mt-2">
                      Phone:{" "}
                      <span className="font-medium">{selectedAddress.phone}</span>
                    </p>

                    <button
                      onClick={openDrawer}
                      className="mt-3 text-sm text-blue-600 hover:underline"
                    >
                      Change Address
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-500">No address selected</div>
                )}
              </div>

              {/* COD box */}
              <div className="flex items-center justify-center">
                <div className="w-full border border-dashed rounded p-4 text-center">
                  <p className="text-green-700 font-semibold text-sm">
                    Cash on delivery available
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Est Delivery{" "}
                    <span className="font-semibold">
                      {formatShortDate(4)} - {formatShortDate(7)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Delivery */}
          <div className="bg-white border rounded p-6">
            <h3 className="text-lg font-semibold text-gray-900">Expected Delivery</h3>
            <p className="text-sm text-gray-500">Estimated delivery dates for your order</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cart.map((item, idx) => (
                <div key={item._id || idx} className="flex items-start gap-4">
                  <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatShortDate(idx + 4)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{item.brand || "Brand"}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: summary */}
        <aside className="w-full lg:w-[320px]">
          <div className="bg-white border rounded p-5 sticky top-20">
            <h4 className="text-sm font-semibold mb-3">Order Details</h4>
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
              onClick={() =>
                navigate("/payment", { state: { shippingAddress: selectedAddress } })
              }
              className={`mt-4 w-full py-2 rounded ${
                isDeliverable
                  ? "bg-yellow-700 text-white hover:bg-yellow-800"
                  : "bg-gray-400 text-gray-100 cursor-not-allowed"
              }`}
              disabled={!isDeliverable}
            >
              PROCEED TO PAYMENT
            </button>
            {!isDeliverable && (
              <p className="text-xs text-red-600 mt-2">Orders can only be delivered to Bengaluru city.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Address Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => {
              setShowDrawer(false);
              cancelEdit();
            }}
          />
          <div className="relative ml-auto w-full sm:w-96 bg-white h-full shadow-lg overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Address</h3>
              <button
                onClick={() => {
                  setShowDrawer(false);
                  cancelEdit();
                }}
                className="text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 border rounded ${addr.selected ? "bg-yellow-50" : "bg-white"}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{addr.name || "Unnamed"}</p>
                      <p className="text-sm text-gray-700 mt-1">{addr.address}</p>
                      <p className="text-sm mt-1">
                        Phone: <span className="font-medium">{addr.phone}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() =>
                          setAddresses((prev) =>
                            prev.map((a) => ({ ...a, selected: a.id === addr.id }))
                          )
                        }
                        className="text-sm text-blue-600"
                      >
                        {addr.selected ? "Selected" : "Deliver Here"}
                      </button>

                      <button
                        onClick={() => startEdit(addr)}
                        className="text-xs text-gray-500 mt-2"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {editingId === addr.id && (
                    <div className="mt-3 border-t pt-3">
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-600">Name</label>
                          <input
                            className="w-full border rounded px-2 py-1 mt-1 text-sm"
                            value={editForm.name}
                            onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Label</label>
                          <input
                            className="w-full border rounded px-2 py-1 mt-1 text-sm"
                            value={editForm.label}
                            onChange={(e) => setEditForm((s) => ({ ...s, label: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Address</label>
                          <textarea
                            className="w-full border rounded px-2 py-1 mt-1 text-sm"
                            rows={2}
                            value={editForm.address}
                            onChange={(e) => setEditForm((s) => ({ ...s, address: e.target.value }))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600">City</label>
                            <input
                              className="w-full border rounded px-2 py-1 mt-1 text-sm"
                              value={editForm.city}
                              onChange={(e) => setEditForm((s) => ({ ...s, city: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">State</label>
                            <input
                              className="w-full border rounded px-2 py-1 mt-1 text-sm"
                              value={editForm.state}
                              onChange={(e) => setEditForm((s) => ({ ...s, state: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600">Pincode</label>
                            <input
                              className="w-full border rounded px-2 py-1 mt-1 text-sm"
                              value={editForm.pincode}
                              onChange={(e) => setEditForm((s) => ({ ...s, pincode: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Phone</label>
                            <input
                              className="w-full border rounded px-2 py-1 mt-1 text-sm"
                              value={editForm.phone}
                              onChange={(e) => setEditForm((s) => ({ ...s, phone: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveEdit(addr.id)}
                            className="px-3 py-1 bg-yellow-700 text-white rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 border rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addNewAddress}
              className="mt-6 w-full border py-2 rounded text-sm text-blue-600"
            >
              + Add New Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
