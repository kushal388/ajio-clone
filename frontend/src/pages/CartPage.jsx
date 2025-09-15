// ***************************** DATA NOT LOADING **********************

// pages/CartPage.jsx
// import { useCart } from "../context/CartContext";

// export default function CartPage() {
// const { cart, removeFromCart, updateQuantity } = useCart();

// const bagTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
// const bagDiscount = cart.reduce(
//   (sum, item) => sum + (item.mrp - item.price) * item.quantity, 0
// );

// // ✅ If cart empty → fees = 0
// const deliveryFee = cart.length > 0 ? 99 : 0;
// const platformFee = cart.length > 0 ? 29 : 0;

// const orderTotal = bagTotal + deliveryFee + platformFee;


//   return (
//     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 py-8">
//       {/* Bag Items */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">My Bag ({cart.length} items)</h2>
//         {cart.map((item) => (
//           <div key={item.productId} className="flex items-center gap-4 border-b py-4">
//             <img src={item.image} alt={item.title} className="w-24 h-24 object-cover" />
//             <div className="flex-1">
//               <h3 className="font-medium">{item.title}</h3>
//               <p>Size: {item.size || "Free Size"}</p>
//               <div className="flex items-center gap-2">
//                 Qty:
//                 <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>-</button>
//                 <span>{item.quantity}</span>
//                 <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
//               </div>
//               <p className="text-sm text-gray-500 line-through">₹{item.mrp}</p>
//               <p className="font-bold">₹{item.price}</p>
//             </div>
//             <button onClick={() => removeFromCart(item.productId)} className="text-red-600">
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Order Details */}
//       <div className="border p-4 rounded-lg">
//         <h2 className="text-lg font-semibold mb-4">Order Details</h2>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Bag Total</span> <span>₹{bagTotal}</span>
//           </div>
//           <div className="flex justify-between text-green-600">
//             <span>Bag Discount</span> <span>-₹{bagDiscount}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery Fee</span> <span>₹{deliveryFee}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Platform Fee</span> <span>₹{platformFee}</span>
//           </div>
//           <div className="flex justify-between font-semibold">
//             <span>Order Total</span> <span>₹{orderTotal}</span>
//           </div>
//         </div>

//         {/* Coupon Section */}
//         <div className="mt-4">
//           <input
//             type="text"
//             placeholder="Enter coupon code"
//             className="border px-2 py-1 w-full mb-2"
//           />
//           <button className="w-full bg-gray-900 text-white py-2 rounded">
//             APPLY
//           </button>
//         </div>

//         <button className="mt-4 w-full bg-yellow-700 text-white py-3 rounded">
//           PROCEED TO SHIPPING
//         </button>
//       </div>
//     </div>
//   );
// }


// ************************* TO LOAD DATA FROM LOCAL STORAGE *************************

//frontend/pages/CartPage.jsx
// import React from "react";
// import { useCart } from "../context/CartContext";

// function safeNum(v, fallback = 0) {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// }

// // helpers: try several common shapes
// function getProductId(item) {
//   return item.productId ?? item._id ?? item.id ?? item.product?.productId ?? item.product?._id ?? null;
// }
// function getTitle(item) {
//   return item.title ?? item.name ?? item.product?.title ?? item.product?.name ?? "Untitled product";
// }
// function getImage(item) {
//   // multiple possible fields: image, images[0], product.image, product.images[0]
//   if (item.image) return item.image;
//   if (Array.isArray(item.images) && item.images.length) return item.images[0];
//   if (item.product?.image) return item.product.image;
//   if (Array.isArray(item.product?.images) && item.product.images.length) return item.product.images[0];
//   // else placeholder
//   return null;
// }
// function getPrice(item) {
//   // price might be under item.price or item.product.price
//   return safeNum(item.price ?? item.product?.price ?? item?.offerPrice ?? 0, 0);
// }
// function getMrp(item) {
//   return safeNum(item.mrp ?? item.product?.mrp ?? 0, 0);
// }
// function getQuantity(item) {
//   return Math.max(1, safeNum(item.quantity ?? item.qty ?? (item.product?.quantity ?? 1), 1));
// }
// function getSize(item) {
//   return item.size ?? item.selectedSize ?? item.product?.size ?? "Free Size";
// }

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity } = useCart();

//   // debug: inspect the cart shape
//   // console.log("Cart contents:", cart);

//   // compute totals safely
//   const bagTotal = cart.reduce((sum, raw) => {
//     const price = getPrice(raw);
//     const qty = getQuantity(raw);
//     return sum + price * qty;
//   }, 0);

//   const bagDiscount = cart.reduce((sum, raw) => {
//     const mrp = getMrp(raw);
//     const price = getPrice(raw);
//     const qty = getQuantity(raw);
//     return sum + Math.max(0, (mrp - price)) * qty;
//   }, 0);

//   const deliveryFee = cart.length > 0 ? 99 : 0;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   return (
//     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 py-8">
//       {/* Bag Items */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">My Bag ({cart.length} items)</h2>

//         {cart.length === 0 && (
//           <div className="p-6 text-center text-gray-600">Your bag is empty.</div>
//         )}

//         {cart.map((item, idx) => {
//           const productId = getProductId(item) ?? `item-${idx}`;
//           const image = getImage(item);
//           const title = getTitle(item);
//           const size = getSize(item);
//           const quantity = getQuantity(item);
//           const price = getPrice(item);
//           const mrp = getMrp(item);

//           return (
//             <div key={productId} className="flex items-center gap-4 border-b py-4">
//               <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
//                 {image ? (
//                   <img src={image} alt={title} className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="text-xs text-gray-500 px-2 text-center">No image</div>
//                 )}
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-medium">{title}</h3>
//                 <p className="text-sm text-gray-600">Size: {size}</p>

//                 <div className="flex items-center gap-2 mt-2">
//                   <div className="text-sm">Qty:</div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
//                       className="px-2 py-1 border rounded"
//                     >
//                       -
//                     </button>

//                     <span className="min-w-[32px] text-center">{quantity}</span>

//                     <button
//                       onClick={() => updateQuantity(productId, quantity + 1)}
//                       className="px-2 py-1 border rounded"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   <div className="text-sm text-gray-500 line-through">₹{mrp || "-"}</div>
//                   <div className="font-bold">₹{price}</div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => removeFromCart(productId)}
//                 className="text-red-600 ml-4"
//               >
//                 Delete
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {/* Order Details */}
//       <div className="border p-4 rounded-lg">
//         <h2 className="text-lg font-semibold mb-4">Order Details</h2>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Bag Total</span> <span>₹{bagTotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600">
//             <span>Bag Discount</span> <span>-₹{bagDiscount.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery Fee</span> <span>₹{deliveryFee}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Platform Fee</span> <span>₹{platformFee}</span>
//           </div>
//           <div className="flex justify-between font-semibold">
//             <span>Order Total</span> <span>₹{orderTotal.toFixed(2)}</span>
//           </div>
//         </div>

//         {/* Coupon Section */}
//         <div className="mt-4">
//           <input
//             type="text"
//             placeholder="Enter coupon code"
//             className="border px-2 py-1 w-full mb-2"
//           />
//           <button className="w-full bg-gray-900 text-white py-2 rounded">
//             APPLY
//           </button>
//         </div>

//         <button className="mt-4 w-full bg-yellow-700 text-white py-3 rounded">
//           PROCEED TO SHIPPING
//         </button>
//       </div>
//     </div>
//   );
// }


// *****************************************************************************************************************


// import React from "react";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// function safeNum(v, fallback = 0) {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// }

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity } = useCart();
//   const { addToWishlist } = useWishlist();

//   // compute totals safely
//   const bagTotal = cart.reduce((sum, raw) => {
//     const price = safeNum(raw.price);
//     const qty = Math.max(1, safeNum(raw.quantity, 1));
//     return sum + price * qty;
//   }, 0);

//   const bagDiscount = cart.reduce((sum, raw) => {
//     const mrp = safeNum(raw.mrp);
//     const price = safeNum(raw.price);
//     const qty = Math.max(1, safeNum(raw.quantity, 1));
//     return sum + Math.max(0, (mrp - price)) * qty;
//   }, 0);

//   const deliveryFee = cart.length > 0 ? 99 : 0;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   return (
//     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 py-8">
//       {/* Bag Items */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">My Bag ({cart.length} items)</h2>

//         {cart.length === 0 && (
//           <div className="p-6 text-center text-gray-600">Your bag is empty.</div>
//         )}

//         {cart.map((item, idx) => {
//           const productId = item.productId ?? `item-${idx}`;
//           const image = item.image;
//           const title = item.title;
//           const size = item.size ?? "Free Size";
//           const quantity = Math.max(1, Number(item.quantity ?? 1));
//           const price = Number(item.price ?? 0);
//           const mrp = Number(item.mrp ?? 0);


//           const entryId = item.raw?._id ?? item._id ?? productId;

//           return (
//             <div key={`${productId}-${size}-${idx}`} className="flex items-center gap-4 border-b py-4">
//               <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
//                 {image ? (
//                   <img src={image} alt={title} className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="text-xs text-gray-500 px-2 text-center">No image</div>
//                 )}
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-medium">{title}</h3>
//                 <p className="text-sm text-gray-600">Size: {size}</p>

//                 <div className="flex items-center gap-2 mt-2">
//                   <div className="text-sm">Qty:</div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => updateQuantity(productId, Math.max(1, quantity - 1), size)}
//                       className="px-2 py-1 border rounded"
//                     >
//                       -
//                     </button>

//                     <span className="min-w-[32px] text-center">{quantity}</span>

//                     <button
//                       onClick={() => updateQuantity(productId, quantity + 1, size)}
//                       className="px-2 py-1 border rounded"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   <div className="text-sm text-gray-500 line-through">₹{mrp || "-"}</div>
//                   <div className="font-bold">₹{price}</div>
//                 </div>

//                 <div className="mt-3 flex items-center gap-3">
//                   <button
//                     onClick={() => addToWishlist(item)}
//                     className="text-sm px-3 py-1 border rounded"
//                   >
//                     Move to wishlist
//                   </button>

//                   <button
//                         onClick={() => removeFromCart(entryId)}
//                         className="text-red-600 ml-4"
//                       >
//                         Delete
//                   </button>

//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Order Details */}
//       <div className="border p-4 rounded-lg">
//         <h2 className="text-lg font-semibold mb-4">Order Details</h2>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Bag Total</span> <span>₹{bagTotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600">
//             <span>Bag Discount</span> <span>-₹{bagDiscount.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery Fee</span> <span>₹{deliveryFee}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Platform Fee</span> <span>₹{platformFee}</span>
//           </div>
//           <div className="flex justify-between font-semibold">
//             <span>Order Total</span> <span>₹{orderTotal.toFixed(2)}</span>
//           </div>
//         </div>

//         {/* Coupon Section */}
//         <div className="mt-4">
//           <input
//             type="text"
//             placeholder="Enter coupon code"
//             className="border px-2 py-1 w-full mb-2"
//           />
//           <button className="w-full bg-gray-900 text-white py-2 rounded">
//             APPLY
//           </button>
//         </div>

//         <button className="mt-4 w-full bg-yellow-700 text-white py-3 rounded">
//           PROCEED TO SHIPPING
//         </button>
//       </div>
//     </div>
//   );
// }




// ******************************************************************************************************************


// import React from "react";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// function safeNum(v, fallback = 0) {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// }

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity } = useCart();
//   const { addToWishlist } = useWishlist();

//   // compute totals safely
//   const bagTotal = cart.reduce((sum, raw) => {
//     const price = safeNum(raw.price);
//     const qty = Math.max(1, safeNum(raw.quantity, 1));
//     return sum + price * qty;
//   }, 0);

//   const bagDiscount = cart.reduce((sum, raw) => {
//     const mrp = safeNum(raw.mrp);
//     const price = safeNum(raw.price);
//     const qty = Math.max(1, safeNum(raw.quantity, 1));
//     return sum + Math.max(0, (mrp - price)) * qty;
//   }, 0);

//   const deliveryFee = cart.length > 0 ? 99 : 0;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   return (
//     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 py-8">
//       {/* Bag Items */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">My Bag ({cart.length} items)</h2>

//         {cart.length === 0 && (
//           <div className="p-6 text-center text-gray-600">Your bag is empty.</div>
//         )}

//         {cart.map((item, idx) => {
//           const productId = item.productId ?? `item-${idx}`;
//           const image = item.image;
//           const title = item.title;
//           const size = item.size ?? "Free Size";
//           const quantity = Math.max(1, Number(item.quantity ?? 1));
//           const price = Number(item.price ?? 0);
//           const mrp = Number(item.mrp ?? 0);

//           // Prefer the cart-entry _id (subdocument id). Fallback to item._id or productId.
//           const entryId = item.raw?._id ?? item._id ?? productId;

//           return (
//             <div key={`${productId}-${size}-${idx}`} className="flex items-center gap-4 border-b py-4">
//               <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
//                 {image ? (
//                   <img src={image} alt={title} className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="text-xs text-gray-500 px-2 text-center">No image</div>
//                 )}
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-medium">{title}</h3>
//                 <p className="text-sm text-gray-600">Size: {size}</p>

//                 <div className="flex items-center gap-2 mt-2">
//                   <div className="text-sm">Qty:</div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => updateQuantity(productId, Math.max(1, quantity - 1), size)}
//                       className="px-2 py-1 border rounded"
//                     >
//                       -
//                     </button>

//                     <span className="min-w-[32px] text-center">{quantity}</span>

//                     <button
//                       onClick={() => updateQuantity(productId, quantity + 1, size)}
//                       className="px-2 py-1 border rounded"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   <div className="text-sm text-gray-500 line-through">₹{mrp || "-"}</div>
//                   <div className="font-bold">₹{price}</div>
//                 </div>

//                 <div className="mt-3 flex items-center gap-3">
//                   <button
//                     onClick={async () => {
//                       try {
//                         await addToWishlist(item);
//                         // remove the exact cart entry (entryId) after successfully adding to wishlist
//                         await removeFromCart(entryId);
//                       } catch (err) {
//                         console.error("Move to wishlist failed", err);
//                       }
//                     }}
//                     className="text-sm px-3 py-1 border rounded"
//                   >
//                     Move to wishlist
//                   </button>

//                   <button
//                     onClick={() => removeFromCart(entryId)}
//                     className="text-sm px-3 py-1 border rounded text-red-600"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Order Details */}
//       <div className="border p-4 rounded-lg">
//         <h2 className="text-lg font-semibold mb-4">Order Details</h2>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Bag Total</span> <span>₹{bagTotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-green-600">
//             <span>Bag Discount</span> <span>-₹{bagDiscount.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery Fee</span> <span>₹{deliveryFee}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Platform Fee</span> <span>₹{platformFee}</span>
//           </div>
//           <div className="flex justify-between font-semibold">
//             <span>Order Total</span> <span>₹{orderTotal.toFixed(2)}</span>
//           </div>
//         </div>

//         {/* Coupon Section */}
//         <div className="mt-4">
//           <input
//             type="text"
//             placeholder="Enter coupon code"
//             className="border px-2 py-1 w-full mb-2"
//           />
//           <button className="w-full bg-gray-900 text-white py-2 rounded">
//             APPLY
//           </button>
//         </div>

//         <button className="mt-4 w-full bg-yellow-700 text-white py-3 rounded">
//           PROCEED TO SHIPPING
//         </button>
//       </div>
//     </div>
//   );
// }




// ****************************************************************************************


// src/pages/CartPage.jsx
// src/pages/CartPage.jsx
// import React, { useState } from "react";
// import { FaTrashAlt, FaHeart } from "react-icons/fa";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity } = useCart();
//   const { addToWishlist } = useWishlist();

//   // local loading state per cart-entry id to prevent duplicate actions
//   const [loadingIds, setLoadingIds] = useState(new Set());

//   const setLoading = (id, v) => {
//     setLoadingIds((prev) => {
//       const next = new Set(prev);
//       if (v) next.add(String(id));
//       else next.delete(String(id));
//       return next;
//     });
//   };
//   const isLoading = (id) => loadingIds.has(String(id));

//   // Totals
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
//   const deliveryFee = cart.length > 0 ? 99 : 0;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   // helper to get a product identifier for API calls
//   const getProductIdForApi = (item) => {
//     if (!item) return null;
//     // handle populated productId object
//     if (typeof item.productId === "object" && item.productId !== null) {
//       return item.productId._id ?? item.productId.productId ?? item.productId;
//     }
//     // some shapes may have nested product
//     if (item.product && typeof item.product === "object") {
//       return item.product._id ?? item.product.productId ?? item.productId ?? item._id;
//     }
//     return item.productId ?? item._id;
//   };

//   // handlers
//   const handleQtyChange = async (item, newQty) => {
//     const productId = getProductIdForApi(item);
//     const entryId = item.raw?._id ?? item._id ?? productId;
//     try {
//       setLoading(entryId, true);
//       await updateQuantity(productId, Number(newQty), item.size ?? null);
//     } catch (err) {
//       console.error("Update quantity failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleSizeChange = async (item, newSize) => {
//     const productId = getProductIdForApi(item);
//     const entryId = item.raw?._id ?? item._id ?? productId;
//     try {
//       setLoading(entryId, true);
//       // reuse updateQuantity to update size on server (quantity unchanged)
//       await updateQuantity(productId, Number(item.quantity ?? 1), newSize);
//     } catch (err) {
//       console.error("Update size failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleRemove = async (item) => {
//     const entryId = item.raw?._id ?? item._id ?? (item.productId ?? "");
//     try {
//       setLoading(entryId, true);
//       await removeFromCart(entryId);
//     } catch (err) {
//       console.error("Remove from cart failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleMoveToWishlist = async (item) => {
//     const entryId = item.raw?._id ?? item._id ?? (item.productId ?? "");
//     try {
//       setLoading(entryId, true);
//       await addToWishlist(item);
//       // remove the exact cart-entry _id to avoid mismatch
//       await removeFromCart(entryId);
//     } catch (err) {
//       console.error("Move to wishlist failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   return (
//     <div className="flex max-w-6xl mx-auto py-6 gap-6">
//       {/* Left: Bag items */}
//       <div className="bg-white border rounded w-3/4">
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-lg font-semibold">My Bag ({cart.length} items)</h2>
//         </div>

//         <div>
//           {cart.map((item) => {
//             const productIdForApi =
//               getProductIdForApi(item) ?? `item-${item._id ?? Math.random()}`;
//             const entryId = item.raw?._id ?? item._id ?? productIdForApi;
//             const busy = isLoading(entryId);

//             // sizes to show in the dropdown: try item.sizes or product sizes
//             const sizes =
//               (Array.isArray(item.sizes) && item.sizes.length && item.sizes) ||
//               (Array.isArray(item.productId?.sizes) &&
//                 item.productId.sizes.length &&
//                 item.productId.sizes) ||
//               [];

//             const qty = Math.max(1, Number(item.quantity ?? 1));
//             const size = item.size ?? "";

//             return (
//               <div
//                 key={`${entryId}-${size}`}
//                 className="grid grid-cols-[130px_1fr_220px] gap-4 items-start p-6 border-b last:border-b-0"
//               >
//                 {/* Left: product image */}
//                 <div className="w-32 h-40 flex items-center justify-center bg-gray-50 rounded-sm">
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       className="max-h-full object-contain"
//                     />
//                   ) : (
//                     <div className="text-sm text-gray-500">No image</div>
//                   )}
//                 </div>

//                 {/* Middle: title, size, qty, note */}
//                 <div className="min-w-0">
//                   <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
//                   <div className="mt-1 text-xs text-gray-500">{item.brand}</div>

//                   <div className="mt-12 space-y-4">
//                     <div className="flex items-center gap-6 text-sm text-gray-600">
//                       {/* Size dropdown */}
//                       <div className="flex items-center gap-2">
//                         <span>Size</span>
//                         <select
//                           value={size}
//                           onChange={(e) => handleSizeChange(item, e.target.value)}
//                           className="border rounded px-2 py-1 text-sm"
//                           disabled={busy}
//                         >
//                           {sizes && sizes.length ? (
//                             sizes.map((s) => (
//                               <option key={s} value={s}>
//                                 {s}
//                               </option>
//                             ))
//                           ) : (
//                             <option value={size}>{size || "Free Size"}</option>
//                           )}
//                         </select>
//                       </div>

//                       {/* Qty dropdown */}
//                       <div className="flex items-center gap-2">
//                         <span>Qty</span>
//                         <select
//                           value={qty}
//                           onChange={(e) =>
//                             handleQtyChange(
//                               item,
//                               Math.max(1, Math.min(10, Number(e.target.value)))
//                             )
//                           }
//                           className="border rounded px-2 py-1 text-sm"
//                           disabled={busy}
//                         >
//                           {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
//                             <option key={n} value={n}>
//                               {n}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div className="text-xs text-gray-500">Free exchange within 7 days</div>
//                   </div>
//                 </div>

//                 {/* Right: price & actions */}
//                 <div className="flex flex-col items-end justify-between h-full">
//                   {/* Price */}
//                   <div className="self-end">
//                     <div className="inline-flex items-center">
//                       <div className="w-1 h-10 bg-teal-700 rounded-l-sm"></div>
//                       <div className="px-4 py-2 border border-gray-200 rounded-r-sm text-sm font-semibold bg-gray-50">
//                         Rs.{" "}
//                         {Number(item.price * item.quantity).toLocaleString("en-IN", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="mt-6 flex items-center gap-6 text-sm">
//                     <button
//                       onClick={() => handleRemove(item)}
//                       className="flex items-center gap-2 text-teal-700 hover:underline"
//                       disabled={busy}
//                     >
//                       <FaTrashAlt /> <span>Delete</span>
//                     </button>

//                     <button
//                       onClick={() => handleMoveToWishlist(item)}
//                       className="flex items-center gap-2 text-teal-700 hover:underline"
//                       disabled={busy}
//                     >
//                       <FaHeart /> <span>Move to Wishlist</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {cart.length === 0 && (
//             <div className="p-8 text-center text-gray-500">Your bag is empty.</div>
//           )}
//         </div>
//       </div>

//       {/* Right: order summary */}
//       <div className="w-1/4">
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
//               <span>₹{deliveryFee}</span>
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

//           <button className="mt-4 w-full bg-teal-700 text-white py-2 rounded">
//             PROCEED TO SHIPPING
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// ************************************************************************************************************


// src/pages/CartPage.jsx
// import React, { useState } from "react";
// import { FaTrashAlt, FaHeart } from "react-icons/fa";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity } = useCart();
//   const { addToWishlist } = useWishlist();

//   // local loading state per cart-entry id to prevent duplicate actions
//   const [loadingIds, setLoadingIds] = useState(new Set());

//   const setLoading = (id, v) => {
//     setLoadingIds((prev) => {
//       const next = new Set(prev);
//       if (v) next.add(String(id));
//       else next.delete(String(id));
//       return next;
//     });
//   };
//   const isLoading = (id) => loadingIds.has(String(id));

//   // Totals
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
//   const deliveryFee = cart.length > 0 ? 99 : 0;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   // helpers
//   const getEntryId = (item) => {
//     const subId = item?.raw?._id ?? item?._id;
//     if (subId) return String(subId);
//     const pid = item?.productId;
//     if (pid && typeof pid === "object") return String(pid._id ?? pid.productId ?? pid);
//     return pid ? String(pid) : "";
//   };

//   const getProductIdForApi = (item) => {
//     if (!item) return null;
//     if (typeof item.productId === "object" && item.productId !== null) {
//       return item.productId._id ?? item.productId.productId ?? item.productId;
//     }
//     if (item.product && typeof item.product === "object") {
//       return item.product._id ?? item.product.productId ?? item.productId ?? item._id;
//     }
//     return item.productId ?? item._id;
//   };

//   // handlers
//   const handleQtyChange = async (item, newQty) => {
//     const productId = getProductIdForApi(item);
//     const entryId = getEntryId(item) || productId;
//     try {
//       setLoading(entryId, true);
//       await updateQuantity(productId, Number(newQty), item.size ?? null);
//     } catch (err) {
//       console.error("Update quantity failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleSizeChange = async (item, newSize) => {
//     const productId = getProductIdForApi(item);
//     const entryId = getEntryId(item) || productId;
//     try {
//       setLoading(entryId, true);
//       // reuse updateQuantity to update size on server (quantity unchanged)
//       await updateQuantity(productId, Number(item.quantity ?? 1), newSize);
//     } catch (err) {
//       console.error("Update size failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleRemove = async (item) => {
//     const entryId = getEntryId(item) || (item.productId ?? "");
//     try {
//       setLoading(entryId, true);
//       await removeFromCart(entryId);
//     } catch (err) {
//       console.error("Remove from cart failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleMoveToWishlist = async (item) => {
//     const entryId = getEntryId(item) || (item.productId ?? "");
//     try {
//       setLoading(entryId, true);
//       await addToWishlist(item);
//       // remove the exact cart-entry id to avoid mismatch
//       await removeFromCart(entryId);
//     } catch (err) {
//       console.error("Move to wishlist failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   return (
//     <div className="flex max-w-6xl mx-auto py-6 gap-6">
//       {/* Left: Bag items */}
//       <div className="bg-white border rounded w-3/4">
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-lg font-semibold">My Bag ({cart.length} items)</h2>
//         </div>

//         <div>
//           {cart.map((item) => {
//             const productIdForApi =
//               getProductIdForApi(item) ?? `item-${item._id ?? Math.random()}`;
//             const entryId = getEntryId(item) || productIdForApi;
//             const busy = isLoading(entryId);

//             // sizes to show in the dropdown: try item.sizes or product sizes
//             const sizes =
//               (Array.isArray(item.sizes) && item.sizes.length && item.sizes) ||
//               (Array.isArray(item.productId?.sizes) &&
//                 item.productId.sizes.length &&
//                 item.productId.sizes) ||
//               [];

//             const qty = Math.max(1, Number(item.quantity ?? 1));
//             const size = item.size ?? "";

//             return (
//               <div
//                 key={`${entryId}-${size}`}
//                 className="grid grid-cols-[130px_1fr_220px] gap-4 items-start p-6 border-b last:border-b-0"
//               >
//                 {/* Left: product image */}
//                 <div className="w-32 h-40 flex items-center justify-center bg-gray-50 rounded-sm">
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       className="max-h-full object-contain"
//                     />
//                   ) : (
//                     <div className="text-sm text-gray-500">No image</div>
//                   )}
//                 </div>

//                 {/* Middle: title, size, qty, note */}
//                 <div className="min-w-0">
//                   <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
//                   <div className="mt-1 text-xs text-gray-500">{item.brand}</div>

//                   <div className="mt-12 space-y-4">
//                     <div className="flex items-center gap-6 text-sm text-gray-600">
//                       {/* Size dropdown */}
//                       <div className="flex items-center gap-2">
//                         <span>Size</span>
//                         <select
//                           value={size}
//                           onChange={(e) => handleSizeChange(item, e.target.value)}
//                           className="border rounded px-2 py-1 text-sm"
//                           disabled={busy}
//                         >
//                           {sizes && sizes.length ? (
//                             sizes.map((s) => (
//                               <option key={s} value={s}>
//                                 {s}
//                               </option>
//                             ))
//                           ) : (
//                             <option value={size}>{size || "Free Size"}</option>
//                           )}
//                         </select>
//                       </div>

//                       {/* Qty dropdown */}
//                       <div className="flex items-center gap-2">
//                         <span>Qty</span>
//                         <select
//                           value={qty}
//                           onChange={(e) =>
//                             handleQtyChange(
//                               item,
//                               Math.max(1, Math.min(10, Number(e.target.value)))
//                             )
//                           }
//                           className="border rounded px-2 py-1 text-sm"
//                           disabled={busy}
//                         >
//                           {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
//                             <option key={n} value={n}>
//                               {n}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div className="text-xs text-gray-500">Free exchange within 7 days</div>
//                   </div>
//                 </div>

//                 {/* Right: price & actions */}
//                 <div className="flex flex-col items-end justify-between h-full">
//                   {/* Price */}
//                   <div className="self-end">
//                     <div className="inline-flex items-center">
//                       <div className="w-1 h-10 bg-teal-700 rounded-l-sm"></div>
//                       <div className="px-4 py-2 border border-gray-200 rounded-r-sm text-sm font-semibold bg-gray-50">
//                         Rs.{" "}
//                         {Number(item.price * item.quantity).toLocaleString("en-IN", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="mt-6 flex items-center gap-6 text-sm">
//                     <button
//                       onClick={() => handleRemove(item)}
//                       className="flex items-center gap-2 text-teal-700 hover:underline"
//                       disabled={busy}
//                     >
//                       <FaTrashAlt /> <span>Delete</span>
//                     </button>

//                     <button
//                       onClick={() => handleMoveToWishlist(item)}
//                       className="flex items-center gap-2 text-teal-700 hover:underline"
//                       disabled={busy}
//                     >
//                       <FaHeart /> <span>Move to Wishlist</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {cart.length === 0 && (
//             <div className="p-8 text-center text-gray-500">Your bag is empty.</div>
//           )}
//         </div>
//       </div>

//       {/* Right: order summary */}
//       <div className="w-1/4">
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
//               <span>₹{deliveryFee}</span>
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

//           <button className="mt-4 w-full bg-teal-700 text-white py-2 rounded">
//             PROCEED TO SHIPPING
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// ********************************************************************************************


// frontend/src/pages/CartPage.jsx
// import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";
// import { FaTrashAlt, FaHeart } from "react-icons/fa";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";
// import Footer from "./Footer";



// export default function CartPage() {

//   const navigate = useNavigate();





//   const { cart, removeFromCart, updateQuantity } = useCart();
//   const { addToWishlist } = useWishlist();

//   // local loading state per cart-entry id to prevent duplicate actions
//   const [loadingIds, setLoadingIds] = useState(new Set());

//   const setLoading = (id, v) => {
//     setLoadingIds((prev) => {
//       const next = new Set(prev);
//       if (v) next.add(String(id));
//       else next.delete(String(id));
//       return next;
//     });
//   };
//   const isLoading = (id) => loadingIds.has(String(id));

//   // Totals
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
//   const deliveryFee = cart.length > 0 ? 99 : 0;
//   const platformFee = cart.length > 0 ? 29 : 0;
//   const orderTotal = bagTotal + deliveryFee + platformFee;

//   // helpers
//   const getEntryId = (item) => {
//     const subId = item?.raw?._id ?? item?._id;
//     if (subId) return String(subId);
//     const pid = item?.productId;
//     if (pid && typeof pid === "object") return String(pid._id ?? pid.productId ?? pid);
//     return pid ? String(pid) : "";
//   };

//   const getProductIdForApi = (item) => {
//     if (!item) return null;
//     if (typeof item.productId === "object" && item.productId !== null) {
//       return item.productId._id ?? item.productId.productId ?? item.productId;
//     }
//     if (item.product && typeof item.product === "object") {
//       return item.product._id ?? item.product.productId ?? item.productId ?? item._id;
//     }
//     return item.productId ?? item._id;
//   };

//   // handlers (use entryId as primary identifier)
//   const handleQtyChange = async (item, newQty) => {
//     const entryId = getEntryId(item);
//     try {
//       setLoading(entryId, true);
//       await updateQuantity(entryId, Number(newQty), item.size ?? null);
//     } catch (err) {
//       console.error("Update quantity failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleSizeChange = async (item, newSize) => {
//     const entryId = getEntryId(item);
//     try {
//       setLoading(entryId, true);
//       // updateQuantity prefers cartEntryId now
//       await updateQuantity(entryId, Number(item.quantity ?? 1), newSize);
//     } catch (err) {
//       console.error("Update size failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleRemove = async (item) => {
//     const entryId = getEntryId(item);
//     try {
//       setLoading(entryId, true);
//       await removeFromCart(entryId);
//     } catch (err) {
//       console.error("Remove from cart failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleMoveToWishlist = async (item) => {
//     const entryId = getEntryId(item);
//     try {
//       setLoading(entryId, true);
//       await addToWishlist(item);
//       await removeFromCart(entryId);
//     } catch (err) {
//       console.error("Move to wishlist failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };



//   return (
//     <>
//     <div className="flex max-w-6xl mx-auto py-6 gap-6">
//       {/* Left: Bag items */}
//       <div className="bg-white border rounded w-3/4">
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-lg font-semibold">My Bag ({cart.length} items)</h2>
//         </div>

//         <div>
//           {cart.map((item) => {
//             const entryId = getEntryId(item) || `item-${item._id ?? Math.random()}`;
//             const busy = isLoading(entryId);

//             // sizes to show in the dropdown: try item.sizes or product sizes
//             const sizes =
//               (Array.isArray(item.sizes) && item.sizes.length && item.sizes) ||
//               (Array.isArray(item.productId?.sizes) &&
//                 item.productId.sizes.length &&
//                 item.productId.sizes) ||
//               [];

//             const qty = Math.max(1, Number(item.quantity ?? 1));
//             const size = item.size ?? "";

//             return (
//               <div
//                 key={`${entryId}-${size}`}
//                 className="grid grid-cols-[130px_1fr_220px] gap-4 items-start p-6 border-b last:border-b-0"
//               >
//                 {/* Left: product image */}
//                 <div className="w-32 h-40 flex items-center justify-center bg-gray-50 rounded-sm">
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       className="max-h-full object-contain"
//                     />
//                   ) : (
//                     <div className="text-sm text-gray-500">No image</div>
//                   )}
//                 </div>

//                 {/* Middle: title, size, qty, note */}
//                 <div className="min-w-0">
//                   <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
//                   <div className="mt-1 text-xs text-gray-500">{item.brand}</div>

//                   <div className="mt-12 space-y-4">
//                     <div className="flex items-center gap-6 text-sm text-gray-600">
//                       {/* Size dropdown */}
//                       <div className="flex items-center gap-2">
//                         <span>Size</span>
//                         <select
//                           value={size}
//                           onChange={(e) => handleSizeChange(item, e.target.value)}
//                           className="border rounded px-2 py-1 text-sm"
//                           disabled={busy}
//                         >
//                           {sizes && sizes.length ? (
//                             sizes.map((s) => (
//                               <option key={s} value={s}>
//                                 {s}
//                               </option>
//                             ))
//                           ) : (
//                             <option value={size}>{size || "Free Size"}</option>
//                           )}
//                         </select>
//                       </div>

//                       {/* Qty dropdown */}
//                       <div className="flex items-center gap-2">
//                         <span>Qty</span>
//                         <select
//                           value={qty}
//                           onChange={(e) =>
//                             handleQtyChange(
//                               item,
//                               Math.max(1, Math.min(10, Number(e.target.value)))
//                             )
//                           }
//                           className="border rounded px-2 py-1 text-sm"
//                           disabled={busy}
//                         >
//                           {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
//                             <option key={n} value={n}>
//                               {n}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div className="text-xs text-gray-500">Free exchange within 7 days</div>
//                   </div>
//                 </div>

//                 {/* Right: price & actions */}
//                 <div className="flex flex-col items-end justify-between h-full">
//                   {/* Price */}
//                   <div className="self-end">
//                     <div className="inline-flex items-center">
//                       <div className="w-1 h-10 bg-teal-700 rounded-l-sm"></div>
//                       <div className="px-4 py-2 border border-gray-200 rounded-r-sm text-sm font-semibold bg-gray-50">
//                         Rs.{" "}
//                         {Number(item.price * item.quantity).toLocaleString("en-IN", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="mt-6 flex items-center gap-6 text-sm">
//                     <button
//                       onClick={() => handleRemove(item)}
//                       className="flex items-center gap-2 text-teal-700 hover:underline"
//                       disabled={busy}
//                     >
//                       <FaTrashAlt /> <span>Delete</span>
//                     </button>

//                     <button
//                       onClick={() => handleMoveToWishlist(item)}
//                       className="flex items-center gap-2 text-teal-700 hover:underline"
//                       disabled={busy}
//                     >
//                       <FaHeart /> <span>Move to Wishlist</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {cart.length === 0 && (
//             <div className="p-8 text-center text-gray-500">Your bag is empty.</div>
//           )}
//         </div>
//       </div>

//       {/* Right: order summary */}
//       <div className="w-1/4">
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
//               <span>₹{deliveryFee}</span>
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

//           {/* <button className="mt-4 w-full bg-teal-700 text-white py-2 rounded">
//             PROCEED TO SHIPPING
//           </button> */}

//           <button
//             onClick={() => navigate("/shipping")} className="mt-4 w-full bg-teal-700 text-white py-2 rounded">
//             PROCEED TO SHIPPING
//           </button>



//         </div>
//       </div>
    
          
          

    

//     </div>

//      {/* <Footer /> */}
//     <Footer showInfo={true} showPopular={false} showLists={true} showBottom={true} />



//     </>
//   );
// }




// ********************************************************************


// frontend/src/pages/CartPage.jsx
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaTrashAlt, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Footer from "./Footer";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { addToWishlist } = useWishlist();

  const [loadingIds, setLoadingIds] = useState(new Set());
  const setLoading = (id, v) => {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      if (v) next.add(String(id));
      else next.delete(String(id));
      return next;
    });
  };
  const isLoading = (id) => loadingIds.has(String(id));

  // Totals (no discount)
  const bagTotal = cart.reduce(
    (s, i) => s + (Number(i.price || 0) * Number(i.quantity || 1)),
    0
  );
  const deliveryFee = cart.length > 0 ? 99 : 0;
  const platformFee = cart.length > 0 ? 29 : 0;
  const orderTotal = bagTotal + deliveryFee + platformFee;

  const getEntryId = (item) => {
    const subId = item?.raw?._id ?? item?._id;
    if (subId) return String(subId);
    const pid = item?.productId;
    if (pid && typeof pid === "object") return String(pid._id ?? pid.productId ?? pid);
    return pid ? String(pid) : "";
  };

  const handleQtyChange = async (item, newQty) => {
    const entryId = getEntryId(item);
    try {
      setLoading(entryId, true);
      await updateQuantity(entryId, Number(newQty), item.size ?? null);
    } finally {
      setLoading(entryId, false);
    }
  };

  const handleSizeChange = async (item, newSize) => {
    const entryId = getEntryId(item);
    try {
      setLoading(entryId, true);
      await updateQuantity(entryId, Number(item.quantity ?? 1), newSize);
    } finally {
      setLoading(entryId, false);
    }
  };

  const handleRemove = async (item) => {
    const entryId = getEntryId(item);
    try {
      setLoading(entryId, true);
      await removeFromCart(entryId);
    } finally {
      setLoading(entryId, false);
    }
  };

  const handleMoveToWishlist = async (item) => {
    const entryId = getEntryId(item);
    try {
      setLoading(entryId, true);
      await addToWishlist(item);
      await removeFromCart(entryId);
    } finally {
      setLoading(entryId, false);
    }
  };

  return (
    <>
      <div className="flex max-w-6xl mx-auto py-6 gap-6">
        {/* Left: Bag items */}
        <div className="bg-white border rounded w-3/4">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">My Bag ({cart.length} items)</h2>
          </div>

          <div>
            {cart.map((item) => {
              const entryId = getEntryId(item) || `item-${item._id ?? Math.random()}`;
              const busy = isLoading(entryId);

              const sizes =
                (Array.isArray(item.sizes) && item.sizes.length && item.sizes) ||
                (Array.isArray(item.productId?.sizes) && item.productId.sizes.length && item.productId.sizes) ||
                [];

              const qty = Math.max(1, Number(item.quantity ?? 1));
              const size = item.size ?? "";

              return (
                <div
                  key={`${entryId}-${size}`}
                  className="grid grid-cols-[130px_1fr_220px] gap-4 items-start p-6 border-b last:border-b-0"
                >
                  {/* Left: product image */}
                  <div className="w-32 h-40 flex items-center justify-center bg-gray-50 rounded-sm">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="max-h-full object-contain" />
                    ) : (
                      <div className="text-sm text-gray-500">No image</div>
                    )}
                  </div>

                  {/* Middle: info */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                    <div className="mt-1 text-xs text-gray-500">{item.brand}</div>

                    <div className="mt-12 space-y-4">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        {/* Size dropdown */}
                        <div className="flex items-center gap-2">
                          <span>Size</span>
                          <select
                            value={size}
                            onChange={(e) => handleSizeChange(item, e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            disabled={busy}
                          >
                            {sizes && sizes.length ? (
                              sizes.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))
                            ) : (
                              <option value={size}>{size || "Free Size"}</option>
                            )}
                          </select>
                        </div>

                        {/* Qty dropdown */}
                        <div className="flex items-center gap-2">
                          <span>Qty</span>
                          <select
                            value={qty}
                            onChange={(e) => handleQtyChange(item, Math.max(1, Math.min(10, Number(e.target.value))))}
                            className="border rounded px-2 py-1 text-sm"
                            disabled={busy}
                          >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">Free exchange within 7 days</div>
                    </div>
                  </div>

                  {/* Right: price & actions */}
                  <div className="flex flex-col items-end justify-between h-full">
                    <div className="self-end">
                      <div className="inline-flex items-center">
                        <div className="w-1 h-10 bg-teal-700 rounded-l-sm"></div>
                        <div className="px-4 py-2 border border-gray-200 rounded-r-sm text-sm font-semibold bg-gray-50">
                          Rs.{" "}
                          {Number(item.price * item.quantity).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-6 text-sm">
                      <button
                        onClick={() => handleRemove(item)}
                        className="flex items-center gap-2 text-teal-700 hover:underline"
                        disabled={busy}
                      >
                        <FaTrashAlt /> <span>Delete</span>
                      </button>

                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="flex items-center gap-2 text-teal-700 hover:underline"
                        disabled={busy}
                      >
                        <FaHeart /> <span>Move to Wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {cart.length === 0 && (
              <div className="p-8 text-center text-gray-500">Your bag is empty.</div>
            )}
          </div>
        </div>

        {/* Right: order summary */}
        <div className="w-1/4">
          <div className="border rounded p-4">
            <h4 className="text-sm font-semibold mb-3">Order Details</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Bag Total</span>
                <span>₹{bagTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Order Total</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/shipping")}
              className="mt-4 w-full bg-teal-700 text-white py-2 rounded"
            >
              PROCEED TO SHIPPING
            </button>
          </div>
        </div>
      </div>

      <Footer showInfo={true} showPopular={false} showLists={true} showBottom={true} />
    </>
  );
}
