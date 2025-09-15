



// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { FaChevronLeft, FaChevronRight, FaShareAlt, FaHeart } from "react-icons/fa";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// const api = axios.create({ baseURL: "http://localhost:5000/api" });

// // /** Helper: check whether a string is a valid CSS color */
// function isValidCssColor(str) {
//   if (!str || typeof window === "undefined") return false;
//   const s = new Option().style;
//   s.color = "";
//   s.color = str;
//   return s.color !== "";
// }

// /** Optional mapping for consistent swatch shades */
// const COLOR_NAME_MAP = {
//   khaki: "#C3B091",
//   grey: "grey",
//   gray: "gray",
//   white: "#ffffff",
//   black: "#000000",
//   navy: "#0b3d91",
//   blue: "#1e90ff",
//   olive: "#808000",
//   brown: "#8b4513",
//   bronze: "#cd7f32",
// };

// export default function ProductPage() {
//   const { id } = useParams();

//   // data state
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ui state
//   const [mainIdx, setMainIdx] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);

//   // thumbnail scroll pointer (desktop vertical)
//   const [thumbStart, setThumbStart] = useState(0);
//   const THUMB_VISIBLE = 5;

//   // popup (from Page A)
//   const [popup, setPopup] = useState("");

//   // contexts (cart & wishlist)
//   const { cart, addToCart } = useCart();
//   const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

//   // fetch product from backend
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await api.get(`/products/${id}`);
//         if (cancelled) return;
//         const p = res.data || null;
//         if (!p) {
//           setProduct(null);
//           setError("Product not found");
//           return;
//         }
//         // normalize images
//         p.images = Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []);
//         setProduct(p);
//         setMainIdx(0);
//         setSelectedColor(p.colors && p.colors.length ? p.colors[0] : null);
//         setSelectedSize(null);
//         setThumbStart(0);
//       } catch (err) {
//         if (cancelled) return;
//         setError(err?.response?.data?.error || err.message || "Failed to fetch product");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [id]);

//   // Keep selectedColor synced to product.colors changes
//   useEffect(() => {
//     if (!product) return;
//     if (product.colors && product.colors.length) {
//       if (!selectedColor || !product.colors.includes(selectedColor)) {
//         setSelectedColor(product.colors[0]);
//       }
//     } else {
//       setSelectedColor(null);
//     }
//   }, [product?.colors]);

//   // Split images into chunks per color (client-side)
//   const colorImagesMap = useMemo(() => {
//     if (!product) return {};
//     const colors = Array.isArray(product.colors) ? product.colors : [];
//     const imgs = Array.isArray(product.images) ? product.images : [];

//     // fallback no colors -> single group "all"
//     if (!colors.length) {
//       return { all: imgs.length ? imgs : (product.image ? [product.image] : []) };
//     }

//     // fallback no images -> one image per color using product.image
//     if (!imgs.length) {
//       const fallback = {};
//       colors.forEach(c => (fallback[c] = product.image ? [product.image] : []));
//       return fallback;
//     }

//     const C = colors.length;
//     const M = imgs.length;
//     const per = Math.floor(M / C);
//     const rem = M % C;

//     const map = {};
//     let cursor = 0;
//     for (let i = 0; i < C; i++) {
//       const take = per + (i < rem ? 1 : 0);
//       map[colors[i]] = take > 0 ? imgs.slice(cursor, cursor + take) : [];
//       cursor += take;
//     }
//     if (cursor < M) {
//       const lastColor = colors[C - 1];
//       map[lastColor] = map[lastColor].concat(imgs.slice(cursor));
//     }
//     return map;
//   }, [product]);

//   // active images depend on selectedColor
//   const activeImages = useMemo(() => {
//     if (!product) return [];
//     if (!product.colors || product.colors.length === 0) {
//       return product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
//     }
//     const chosen = selectedColor || product.colors[0];
//     const imgs = colorImagesMap[chosen];
//     if (!imgs || imgs.length === 0) {
//       return product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
//     }
//     return imgs;
//   }, [product, colorImagesMap, selectedColor]);

//   // reset main index when active images change
//   useEffect(() => {
//     setMainIdx(0);
//     setThumbStart(0);
//   }, [activeImages]);

//   // UI handlers
//   const nextMain = () => setMainIdx(i => (activeImages.length ? (i + 1) % activeImages.length : 0));
//   const prevMain = () => setMainIdx(i => (activeImages.length ? (i - 1 + activeImages.length) % activeImages.length : 0));
//   const thumbUp = () => setThumbStart(s => Math.max(0, s - 1));
//   const thumbDown = () => setThumbStart(s => {
//     const maxStart = Math.max(0, (activeImages.length || 0) - THUMB_VISIBLE);
//     return Math.min(maxStart, s + 1);
//   });
//   const selectColor = (c) => { setSelectedColor(c); setSelectedSize(null); };

//   const sizeLeft = () => {
//     if (!product?.sizes?.length) return;
//     const arr = product.sizes;
//     const cur = selectedSize ?? arr[0];
//     const idx = Math.max(0, arr.indexOf(cur));
//     setSelectedSize(arr[idx <= 0 ? arr.length - 1 : idx - 1]);
//   };
//   const sizeRight = () => {
//     if (!product?.sizes?.length) return;
//     const arr = product.sizes;
//     const cur = selectedSize ?? arr[0];
//     const idx = Math.max(0, arr.indexOf(cur));
//     setSelectedSize(arr[idx >= arr.length - 1 ? 0 : idx + 1]);
//   };

//   // Popup helper (from Page A)
//   const showPopup = (msg) => {
//     setPopup(msg);
//     setTimeout(() => setPopup(""), 2000);
//   };

//   // Cart / Wishlist helpers (integrated)
//   const inCart = product ? cart.some((item) => item.productId === product._id || item._id === product._id) : false;
//   const inWishlist = product ? wishlist.some((item) => item._id === product._id) : false;

//   const handleAddToBag = () => {
//     if (product?.sizes?.length && !selectedSize) {
//       showPopup("Please select a size!");
//       return;
//     }
//     // add selected options to cart item
//     addToCart({ ...product, selectedSize, selectedColor });
//     showPopup("Added to Cart 🛒");
//   };

//   const toggleWishlist = () => {
//     if (!product) return;
//     if (inWishlist) {
//       removeFromWishlist(product._id);
//       showPopup("Removed from Wishlist ❌");
//     } else {
//       addToWishlist(product);
//       showPopup("Added to Wishlist ❤️");
//     }
//   };

//   if (loading) return <div className="p-8 text-center">Loading product…</div>;
//   if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
//   if (!product) return <div className="p-8 text-center">Product not found</div>;

//   // computed
//   const offerPrice = Math.max(1, Math.round(product.price * 0.95));

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
//       <div className="text-sm text-gray-500 mb-4">
//         Home / {product.category} / {product.section} / {product.subcategory} / {product.title}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_420px] gap-8 items-start">
//         <div className="hidden md:flex flex-col items-center">
//           <button onClick={thumbUp} className="w-8 h-8 rounded-full border flex items-center justify-center mb-3 text-gray-600">
//             <FaChevronLeft className="rotate-90" />
//           </button>

//           <div className="flex-1 overflow-hidden">
//             <div className="flex flex-col gap-3">
//               {activeImages.slice(thumbStart, thumbStart + THUMB_VISIBLE).map((img, i) => {
//                 const realIdx = thumbStart + i;
//                 return (
//                   <button
//                     key={img + realIdx}
//                     onClick={() => setMainIdx(realIdx)}
//                     className={`w-16 h-20 border rounded overflow-hidden ${mainIdx === realIdx ? "ring-2 ring-yellow-500" : ""}`}
//                   >
//                     <img src={img} alt={`${product.title}-thumb-${realIdx}`} className="w-full h-full object-cover" />
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <button onClick={thumbDown} className="w-8 h-8 rounded-full border flex items-center justify-center mt-3 text-gray-600">
//             <FaChevronRight className="rotate-90" />
//           </button>
//         </div>

//         <div className="relative border rounded-lg overflow-hidden bg-white">
//           <div className="absolute right-3 top-3 z-10">
//             <button className="p-2 rounded-full bg-white shadow text-gray-600"><FaShareAlt /></button>
//           </div>

//           <div className="flex items-center justify-center h-[640px] bg-gray-50">
//             <img src={activeImages[mainIdx] || product.image} alt={product.title} className="max-h-[600px] object-contain" />
//           </div>

//           <button onClick={prevMain} className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow text-gray-700">
//             <FaChevronLeft />
//           </button>
//           <button onClick={nextMain} className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow text-gray-700">
//             <FaChevronRight />
//           </button>
//         </div>

//         <div className="py-2">
//           <div className="text-sm text-gray-500 uppercase">{product.brand}</div>
//           <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.title}</h1>

//           <div className="flex items-center gap-3 mt-3">
//             <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
//               {product.rating ?? "—"} ★
//             </div>
//             <div className="text-sm text-gray-500">{product.ratingCount ?? 0} Ratings</div>
//           </div>

//           <div className="mt-4 flex items-end gap-4">
//             <div className="text-3xl font-bold text-green-800">₹{product.price}</div>
//             {product.mrp && <div className="text-sm text-gray-500 line-through">MRP ₹{product.mrp}</div>}
//             {product.discountPercent != null && <div className="text-sm text-red-600">({product.discountPercent}% off)</div>}
//           </div>

//           <div className="mt-4 border border-dashed border-yellow-300 rounded p-3 bg-yellow-50 text-sm">
//             <div className="font-semibold">Offer</div>
//             <div className="mt-1">Get it for ₹{offerPrice} • Use Code <span className="font-semibold">NEWS30</span></div>
//           </div>

//           {product.colors?.length > 0 && (
//             <div className="mt-6">
//               <div className="text-sm font-medium text-gray-700">Primary Color</div>
//               <div className="flex items-center gap-3 mt-3">
//                 {product.colors.map((c, i) => {
//                   const raw = String(c || "").trim();
//                   const lower = raw.toLowerCase();
//                   const mapped = COLOR_NAME_MAP[lower] || raw;
//                   const valid = isValidCssColor(mapped) || isValidCssColor(raw);
//                   const dotStyle = valid ? { backgroundColor: (isValidCssColor(mapped) ? mapped : raw) } : {};
//                   return (
//                     <button
//                       key={raw + i}
//                       onClick={() => selectColor(raw)}
//                       className={`w-10 h-10 rounded-full border flex items-center justify-center ${selectedColor === raw ? "ring-2 ring-yellow-500" : ""}`}
//                       title={raw}
//                     >
//                       {valid ? (
//                         <div style={{ width: 18, height: 18, borderRadius: 999, ...dotStyle }} />
//                       ) : (
//                         <div className="text-xs font-medium text-gray-700">{raw.length <= 3 ? raw.toUpperCase() : raw.slice(0,2).toUpperCase()}</div>
//                       )}
//                     </button>
//                   );
//                 })}
//                 <div className="text-sm text-gray-600 ml-2">{selectedColor}</div>
//               </div>
//             </div>
//           )}

//           {product.sizes?.length > 0 && (
//             <div className="mt-6">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm font-medium text-gray-700">Select Size</div>
//                 <div className="text-xs text-gray-400">Check Size Chart</div>
//               </div>

//               <div className="flex items-center gap-3 mt-3">
//                 <button onClick={sizeLeft} className="w-8 h-8 rounded-full border flex items-center justify-center">
//                   <FaChevronLeft />
//                 </button>

//                 <div className="flex gap-2 flex-wrap">
//                   {product.sizes.map(s => (
//                     <button
//                       key={s}
//                       onClick={() => setSelectedSize(s)}
//                       className={`px-3 py-2 border rounded ${selectedSize === s ? "bg-gray-900 text-white" : "bg-white"}`}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>

//                 <button onClick={sizeRight} className="w-8 h-8 rounded-full border flex items-center justify-center">
//                   <FaChevronRight />
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="mt-4 text-sm text-gray-600">Stock: {product.stock ?? 0}</div>

//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={handleAddToBag}
//               disabled={inCart}
//               className={`px-6 py-3 rounded text-white font-semibold ${inCart ? "bg-gray-400 cursor-not-allowed" : (selectedSize || !product?.sizes?.length ? "bg-yellow-700 hover:bg-yellow-800" : "bg-gray-300 cursor-not-allowed")}`}
//             >
//               {inCart ? "Go to Bag" : "ADD TO BAG"}
//             </button>

//             <button
//               onClick={toggleWishlist}
//               className={`px-6 py-3 rounded border font-semibold flex items-center gap-3 ${inWishlist ? "text-red-600 border-red-600" : ""}`}
//             >
//               <FaHeart className={inWishlist ? "text-red-600" : "text-gray-600"} />
//               {inWishlist ? "REMOVE WISHLIST" : "SAVE TO WISHLIST"}
//             </button>
//           </div>

//           <div className="mt-6 text-sm text-gray-700">
//             <h4 className="font-semibold">Product Details</h4>
//             <p className="mt-2">{product.description || product.title}</p>
//             <div className="mt-3">
//               <Link to={`/c/${product.category || "all"}`} className="text-sm text-blue-600">Back to category</Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mt-10">
//         <h3 className="font-semibold mb-3">Product Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
//           <div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Primary Color</div>
//               <div>{product.colors?.[0] ?? "-"}</div>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Wash</div>
//               <div>{product.wash ?? "Clean"}</div>
//             </div>
//           </div>
//           <div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Size Tip</div>
//               <div>{product.sizeTip ?? "We recommend you buy a size larger"}</div>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Fabric</div>
//               <div>{product.fabric ?? "-"}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Popup (bottom-right) */}
//       {popup && (
//         <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-md shadow-lg">
//           {popup}
//         </div>
//       )}
//     </div>
//   );
// }



// ********************************** user Data (func missing) *********************************


// src/pages/ProductPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { FaChevronLeft, FaChevronRight, FaShareAlt, FaHeart } from "react-icons/fa";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// const api = axios.create({ baseURL: "http://localhost:5000/api" });

// // /** Helper: check whether a string is a valid CSS color */
// function isValidCssColor(str) {
//   if (!str || typeof window === "undefined") return false;
//   const s = new Option().style;
//   s.color = "";
//   s.color = str;
//   return s.color !== "";
// }

// /** Optional mapping for consistent swatch shades */
// const COLOR_NAME_MAP = {
//   khaki: "#C3B091",
//   grey: "grey",
//   gray: "gray",
//   white: "#ffffff",
//   black: "#000000",
//   navy: "#0b3d91",
//   blue: "#1e90ff",
//   olive: "#808000",
//   brown: "#8b4513",
//   bronze: "#cd7f32",
// };

// export default function ProductPage() {
//   const { id } = useParams();

//   // data state
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ui state
//   const [mainIdx, setMainIdx] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);

//   // thumbnail scroll pointer (desktop vertical)
//   const [thumbStart, setThumbStart] = useState(0);
//   const THUMB_VISIBLE = 5;

//   // local fallback popup (if navbar listener not present)
//   const [popup, setPopup] = useState("");

//   // contexts (cart & wishlist)
//   const { cart, addToCart } = useCart();
//   const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

//   // fetch product from backend
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await api.get(`/products/${id}`);
//         if (cancelled) return;
//         const p = res.data || null;
//         if (!p) {
//           setProduct(null);
//           setError("Product not found");
//           return;
//         }
//         // normalize images
//         p.images = Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []);
//         setProduct(p);
//         setMainIdx(0);
//         setSelectedColor(p.colors && p.colors.length ? p.colors[0] : null);
//         setSelectedSize(null);
//         setThumbStart(0);
//       } catch (err) {
//         if (cancelled) return;
//         setError(err?.response?.data?.error || err.message || "Failed to fetch product");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [id]);

//   // Keep selectedColor synced to product.colors changes
//   useEffect(() => {
//     if (!product) return;
//     if (product.colors && product.colors.length) {
//       if (!selectedColor || !product.colors.includes(selectedColor)) {
//         setSelectedColor(product.colors[0]);
//       }
//     } else {
//       setSelectedColor(null);
//     }
//   }, [product?.colors]);

//   // Split images into chunks per color (client-side)
//   const colorImagesMap = useMemo(() => {
//     if (!product) return {};
//     const colors = Array.isArray(product.colors) ? product.colors : [];
//     const imgs = Array.isArray(product.images) ? product.images : [];

//     // fallback no colors -> single group "all"
//     if (!colors.length) {
//       return { all: imgs.length ? imgs : (product.image ? [product.image] : []) };
//     }

//     // fallback no images -> one image per color using product.image
//     if (!imgs.length) {
//       const fallback = {};
//       colors.forEach(c => (fallback[c] = product.image ? [product.image] : []));
//       return fallback;
//     }

//     const C = colors.length;
//     const M = imgs.length;
//     const per = Math.floor(M / C);
//     const rem = M % C;

//     const map = {};
//     let cursor = 0;
//     for (let i = 0; i < C; i++) {
//       const take = per + (i < rem ? 1 : 0);
//       map[colors[i]] = take > 0 ? imgs.slice(cursor, cursor + take) : [];
//       cursor += take;
//     }
//     if (cursor < M) {
//       const lastColor = colors[C - 1];
//       map[lastColor] = map[lastColor].concat(imgs.slice(cursor));
//     }
//     return map;
//   }, [product]);

//   // active images depend on selectedColor
//   const activeImages = useMemo(() => {
//     if (!product) return [];
//     if (!product.colors || product.colors.length === 0) {
//       return product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
//     }
//     const chosen = selectedColor || product.colors[0];
//     const imgs = colorImagesMap[chosen];
//     if (!imgs || imgs.length === 0) {
//       return product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
//     }
//     return imgs;
//   }, [product, colorImagesMap, selectedColor]);

//   // reset main index when active images change
//   useEffect(() => {
//     setMainIdx(0);
//     setThumbStart(0);
//   }, [activeImages]);

//   // UI handlers
//   const nextMain = () => setMainIdx(i => (activeImages.length ? (i + 1) % activeImages.length : 0));
//   const prevMain = () => setMainIdx(i => (activeImages.length ? (i - 1 + activeImages.length) % activeImages.length : 0));
//   const thumbUp = () => setThumbStart(s => Math.max(0, s - 1));
//   const thumbDown = () => setThumbStart(s => {
//     const maxStart = Math.max(0, (activeImages.length || 0) - THUMB_VISIBLE);
//     return Math.min(maxStart, s + 1);
//   });
//   const selectColor = (c) => { setSelectedColor(c); setSelectedSize(null); };

//   const sizeLeft = () => {
//     if (!product?.sizes?.length) return;
//     const arr = product.sizes;
//     const cur = selectedSize ?? arr[0];
//     const idx = Math.max(0, arr.indexOf(cur));
//     setSelectedSize(arr[idx <= 0 ? arr.length - 1 : idx - 1]);
//   };
//   const sizeRight = () => {
//     if (!product?.sizes?.length) return;
//     const arr = product.sizes;
//     const cur = selectedSize ?? arr[0];
//     const idx = Math.max(0, arr.indexOf(cur));
//     setSelectedSize(arr[idx >= arr.length - 1 ? 0 : idx + 1]);
//   };

//   // Popup helper (dispatch event to navbar; fallback to local popup)
//   const showPopup = (msg, type = "cart") => {
//     // type: "cart" | "wishlist"
//     if (typeof window !== "undefined" && window?.dispatchEvent) {
//       try {
//         window.dispatchEvent(new CustomEvent("show-toast", { detail: { msg, type } }));
//         return;
//       } catch (e) {
//         // fall through to local popup fallback
//       }
//     }
//     // fallback local popup (bottom-right)
//     setPopup(msg);
//     setTimeout(() => setPopup(""), 2000);
//   };

//   // Cart / Wishlist helpers (integrated)
//   const inCart = product ? cart.some((item) => item.productId === product._id || item._id === product._id) : false;
//   const inWishlist = product ? wishlist.some((item) => item._id === product._id) : false;

//   const handleAddToBag = () => {
//     if (product?.sizes?.length && !selectedSize) {
//       showPopup("Please select a size!", "cart");
//       return;
//     }
//     addToCart({ ...product, selectedSize, selectedColor });
//     showPopup("Item added to bag", "cart");
//   };

//   const toggleWishlist = () => {
//     if (!product) return;
//     if (inWishlist) {
//       removeFromWishlist(product._id);
//       showPopup("Removed from wishlist", "wishlist");
//     } else {
//       addToWishlist(product);
//       showPopup("Item saved in my wishlist", "wishlist");
//     }
//   };

//   if (loading) return <div className="p-8 text-center">Loading product…</div>;
//   if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
//   if (!product) return <div className="p-8 text-center">Product not found</div>;

//   // computed
//   const offerPrice = Math.max(1, Math.round(product.price * 0.95));

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
//       <div className="text-sm text-gray-500 mb-4">
//         Home / {product.category} / {product.section} / {product.subcategory} / {product.title}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_420px] gap-8 items-start">
//         <div className="hidden md:flex flex-col items-center">
//           <button onClick={thumbUp} className="w-8 h-8 rounded-full border flex items-center justify-center mb-3 text-gray-600">
//             <FaChevronLeft className="rotate-90" />
//           </button>

//           <div className="flex-1 overflow-hidden">
//             <div className="flex flex-col gap-3">
//               {activeImages.slice(thumbStart, thumbStart + THUMB_VISIBLE).map((img, i) => {
//                 const realIdx = thumbStart + i;
//                 return (
//                   <button
//                     key={img + realIdx}
//                     onClick={() => setMainIdx(realIdx)}
//                     className={`w-16 h-20 border rounded overflow-hidden ${mainIdx === realIdx ? "ring-2 ring-yellow-500" : ""}`}
//                   >
//                     <img src={img} alt={`${product.title}-thumb-${realIdx}`} className="w-full h-full object-cover" />
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <button onClick={thumbDown} className="w-8 h-8 rounded-full border flex items-center justify-center mt-3 text-gray-600">
//             <FaChevronRight className="rotate-90" />
//           </button>
//         </div>

//         <div className="relative border rounded-lg overflow-hidden bg-white">
//           <div className="absolute right-3 top-3 z-10">
//             <button className="p-2 rounded-full bg-white shadow text-gray-600"><FaShareAlt /></button>
//           </div>

//           <div className="flex items-center justify-center h-[640px] bg-gray-50">
//             <img src={activeImages[mainIdx] || product.image} alt={product.title} className="max-h-[600px] object-contain" />
//           </div>

//           <button onClick={prevMain} className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow text-gray-700">
//             <FaChevronLeft />
//           </button>
//           <button onClick={nextMain} className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow text-gray-700">
//             <FaChevronRight />
//           </button>
//         </div>

//         <div className="py-2">
//           <div className="text-sm text-gray-500 uppercase">{product.brand}</div>
//           <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.title}</h1>

//           <div className="flex items-center gap-3 mt-3">
//             <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
//               {product.rating ?? "—"} ★
//             </div>
//             <div className="text-sm text-gray-500">{product.ratingCount ?? 0} Ratings</div>
//           </div>

//           <div className="mt-4 flex items-end gap-4">
//             <div className="text-3xl font-bold text-green-800">₹{product.price}</div>
//             {product.mrp && <div className="text-sm text-gray-500 line-through">MRP ₹{product.mrp}</div>}
//             {product.discountPercent != null && <div className="text-sm text-red-600">({product.discountPercent}% off)</div>}
//           </div>

//           <div className="mt-4 border border-dashed border-yellow-300 rounded p-3 bg-yellow-50 text-sm">
//             <div className="font-semibold">Offer</div>
//             <div className="mt-1">Get it for ₹{offerPrice} • Use Code <span className="font-semibold">NEWS30</span></div>
//           </div>

//           {product.colors?.length > 0 && (
//             <div className="mt-6">
//               <div className="text-sm font-medium text-gray-700">Primary Color</div>
//               <div className="flex items-center gap-3 mt-3">
//                 {product.colors.map((c, i) => {
//                   const raw = String(c || "").trim();
//                   const lower = raw.toLowerCase();
//                   const mapped = COLOR_NAME_MAP[lower] || raw;
//                   const valid = isValidCssColor(mapped) || isValidCssColor(raw);
//                   const dotStyle = valid ? { backgroundColor: (isValidCssColor(mapped) ? mapped : raw) } : {};
//                   return (
//                     <button
//                       key={raw + i}
//                       onClick={() => selectColor(raw)}
//                       className={`w-10 h-10 rounded-full border flex items-center justify-center ${selectedColor === raw ? "ring-2 ring-yellow-500" : ""}`}
//                       title={raw}
//                     >
//                       {valid ? (
//                         <div style={{ width: 18, height: 18, borderRadius: 999, ...dotStyle }} />
//                       ) : (
//                         <div className="text-xs font-medium text-gray-700">{raw.length <= 3 ? raw.toUpperCase() : raw.slice(0,2).toUpperCase()}</div>
//                       )}
//                     </button>
//                   );
//                 })}
//                 <div className="text-sm text-gray-600 ml-2">{selectedColor}</div>
//               </div>
//             </div>
//           )}

//           {product.sizes?.length > 0 && (
//             <div className="mt-6">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm font-medium text-gray-700">Select Size</div>
//                 <div className="text-xs text-gray-400">Check Size Chart</div>
//               </div>

//               <div className="flex items-center gap-3 mt-3">
//                 <button onClick={sizeLeft} className="w-8 h-8 rounded-full border flex items-center justify-center">
//                   <FaChevronLeft />
//                 </button>

//                 <div className="flex gap-2 flex-wrap">
//                   {product.sizes.map(s => (
//                     <button
//                       key={s}
//                       onClick={() => setSelectedSize(s)}
//                       className={`px-3 py-2 border rounded ${selectedSize === s ? "bg-gray-900 text-white" : "bg-white"}`}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>

//                 <button onClick={sizeRight} className="w-8 h-8 rounded-full border flex items-center justify-center">
//                   <FaChevronRight />
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="mt-4 text-sm text-gray-600">Stock: {product.stock ?? 0}</div>

//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={handleAddToBag}
//               disabled={inCart}
//               className={`px-6 py-3 rounded text-white font-semibold ${inCart ? "bg-gray-400 cursor-not-allowed" : (selectedSize || !product?.sizes?.length ? "bg-yellow-700 hover:bg-yellow-800" : "bg-gray-300 cursor-not-allowed")}`}
//             >
//               {inCart ? "Go to Bag" : "ADD TO BAG"}
//             </button>

//             <button
//               onClick={toggleWishlist}
//               className={`px-6 py-3 rounded border font-semibold flex items-center gap-3 ${inWishlist ? "text-red-600 border-red-600" : ""}`}
//             >
//               <FaHeart className={inWishlist ? "text-red-600" : "text-gray-600"} />
//               {inWishlist ? "REMOVE WISHLIST" : "SAVE TO WISHLIST"}
//             </button>
//           </div>

//           <div className="mt-6 text-sm text-gray-700">
//             <h4 className="font-semibold">Product Details</h4>
//             <p className="mt-2">{product.description || product.title}</p>
//             <div className="mt-3">
//               <Link to={`/c/${product.category || "all"}`} className="text-sm text-blue-600">Back to category</Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mt-10">
//         <h3 className="font-semibold mb-3">Product Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
//           <div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Primary Color</div>
//               <div>{product.colors?.[0] ?? "-"}</div>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Wash</div>
//               <div>{product.wash ?? "Clean"}</div>
//             </div>
//           </div>
//           <div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Size Tip</div>
//               <div>{product.sizeTip ?? "We recommend you buy a size larger"}</div>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Fabric</div>
//               <div>{product.fabric ?? "-"}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Local fallback Popup (bottom-right) */}
//       {popup && (
//         <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-md shadow-lg">
//           {popup}
//         </div>
//       )}
//     </div>
//   );
// }



// ************************************ User Data (func present) ***********************************


// pages/ProductPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { FaChevronLeft, FaChevronRight, FaShareAlt, FaHeart } from "react-icons/fa";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";


// const api = axios.create({ baseURL: "http://localhost:5000/api" });

// // /** Helper: check whether a string is a valid CSS color */
// function isValidCssColor(str) {
//   if (!str || typeof window === "undefined") return false;
//   const s = new Option().style;
//   s.color = "";
//   s.color = str;
//   return s.color !== "";
// }

// /** Optional mapping for consistent swatch shades */
// const COLOR_NAME_MAP = {
//   khaki: "#C3B091",
//   grey: "grey",
//   gray: "gray",
//   white: "#ffffff",
//   black: "#000000",
//   navy: "#0b3d91",
//   blue: "#1e90ff",
//   olive: "#808000",
//   brown: "#8b4513",
//   bronze: "#cd7f32",
// };

// export default function ProductPage() {
//   const { id } = useParams();

//   // data state
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ui state
//   const [mainIdx, setMainIdx] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);

//   // thumbnail scroll pointer (desktop vertical)
//   const [thumbStart, setThumbStart] = useState(0);
//   const THUMB_VISIBLE = 5;

//   // local fallback popup (if navbar listener not present)
//   const [popup, setPopup] = useState("");

//   // contexts (cart & wishlist)
//   const { cart, addToCart } = useCart();
//   const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

//   // fetch product from backend
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await api.get(`/products/${id}`);
//         if (cancelled) return;
//         const p = res.data || null;
//         if (!p) {
//           setProduct(null);
//           setError("Product not found");
//           return;
//         }
//         // normalize images
//         p.images = Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []);
//         setProduct(p);
//         setMainIdx(0);
//         setSelectedColor(p.colors && p.colors.length ? p.colors[0] : null);
//         setSelectedSize(null);
//         setThumbStart(0);
//       } catch (err) {
//         if (cancelled) return;
//         setError(err?.response?.data?.error || err.message || "Failed to fetch product");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [id]);

//   // Keep selectedColor synced to product.colors changes
//   useEffect(() => {
//     if (!product) return;
//     if (product.colors && product.colors.length) {
//       if (!selectedColor || !product.colors.includes(selectedColor)) {
//         setSelectedColor(product.colors[0]);
//       }
//     } else {
//       setSelectedColor(null);
//     }
//   }, [product?.colors]);

//   // Split images into chunks per color (client-side)
//   const colorImagesMap = useMemo(() => {
//     if (!product) return {};
//     const colors = Array.isArray(product.colors) ? product.colors : [];
//     const imgs = Array.isArray(product.images) ? product.images : [];

//     // fallback no colors -> single group "all"
//     if (!colors.length) {
//       return { all: imgs.length ? imgs : (product.image ? [product.image] : []) };
//     }

//     // fallback no images -> one image per color using product.image
//     if (!imgs.length) {
//       const fallback = {};
//       colors.forEach(c => (fallback[c] = product.image ? [product.image] : []));
//       return fallback;
//     }

//     const C = colors.length;
//     const M = imgs.length;
//     const per = Math.floor(M / C);
//     const rem = M % C;

//     const map = {};
//     let cursor = 0;
//     for (let i = 0; i < C; i++) {
//       const take = per + (i < rem ? 1 : 0);
//       map[colors[i]] = take > 0 ? imgs.slice(cursor, cursor + take) : [];
//       cursor += take;
//     }
//     if (cursor < M) {
//       const lastColor = colors[C - 1];
//       map[lastColor] = map[lastColor].concat(imgs.slice(cursor));
//     }
//     return map;
//   }, [product]);

//   // active images depend on selectedColor
//   const activeImages = useMemo(() => {
//     if (!product) return [];
//     if (!product.colors || product.colors.length === 0) {
//       return product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
//     }
//     const chosen = selectedColor || product.colors[0];
//     const imgs = colorImagesMap[chosen];
//     if (!imgs || imgs.length === 0) {
//       return product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
//     }
//     return imgs;
//   }, [product, colorImagesMap, selectedColor]);

//   // reset main index when active images change
//   useEffect(() => {
//     setMainIdx(0);
//     setThumbStart(0);
//   }, [activeImages]);

//   // UI handlers
//   const nextMain = () => setMainIdx(i => (activeImages.length ? (i + 1) % activeImages.length : 0));
//   const prevMain = () => setMainIdx(i => (activeImages.length ? (i - 1 + activeImages.length) % activeImages.length : 0));
//   const thumbUp = () => setThumbStart(s => Math.max(0, s - 1));
//   const thumbDown = () => setThumbStart(s => {
//     const maxStart = Math.max(0, (activeImages.length || 0) - THUMB_VISIBLE);
//     return Math.min(maxStart, s + 1);
//   });
//   const selectColor = (c) => { setSelectedColor(c); setSelectedSize(null); };

//   const sizeLeft = () => {
//     if (!product?.sizes?.length) return;
//     const arr = product.sizes;
//     const cur = selectedSize ?? arr[0];
//     const idx = Math.max(0, arr.indexOf(cur));
//     setSelectedSize(arr[idx <= 0 ? arr.length - 1 : idx - 1]);
//   };
//   const sizeRight = () => {
//     if (!product?.sizes?.length) return;
//     const arr = product.sizes;
//     const cur = selectedSize ?? arr[0];
//     const idx = Math.max(0, arr.indexOf(cur));
//     setSelectedSize(arr[idx >= arr.length - 1 ? 0 : idx + 1]);
//   };

//   // Popup helper (dispatch event to navbar; fallback to local popup)
//   const showPopup = (msg, type = "cart") => {
//     // type: "cart" | "wishlist"
//     if (typeof window !== "undefined" && window?.dispatchEvent) {
//       try {
//         window.dispatchEvent(new CustomEvent("show-toast", { detail: { msg, type } }));
//         return;
//       } catch (e) {
//         // fall through to local popup fallback
//       }
//     }
//     // fallback local popup (bottom-right)
//     setPopup(msg);
//     setTimeout(() => setPopup(""), 2000);
//   };

//   // Cart / Wishlist helpers (integrated)
//   // handle different shapes: server may use productId, local may store _id, etc.
//   const productId = product?._id ?? product?.productId ?? product?.id ?? null;
//   const inCart = product ? cart.some((item) =>
//     item.productId === productId || item._id === productId || item.productId === product._id
//   ) : false;
//   const inWishlist = product ? wishlist.some((item) =>
//     item.productId === productId || item._id === productId || item.productId === product._id
//   ) : false;

//   const handleAddToBag = () => {
//     if (product?.sizes?.length && !selectedSize) {
//       showPopup("Please select a size!", "cart");
//       return;
//     }

//     if (!product) return;

//     // Use addToCart(product, quantity, size)
//     // Our CartContext supports product object; it will extract product._id/productId as needed
//     addToCart({ ...product, selectedSize, selectedColor }, 1, selectedSize);
//     showPopup("Item added to bag", "cart");
//   };

//   const toggleWishlist = () => {
//     if (!product) return;
//     if (inWishlist) {
//       // remove by id (wishlist context handles server/local)
//       const pid = productId;
//       if (!pid) {
//         console.warn("toggleWishlist: product ID missing", product);
//         return;
//       }
//       removeFromWishlist(pid);
//       showPopup("Removed from wishlist", "wishlist");
//     } else {
//       // add product snapshot (keep selected size/color info)
//       addToWishlist({ ...product, selectedSize, selectedColor });
//       showPopup("Item saved in my wishlist", "wishlist");
//     }
//   };

//   if (loading) return <div className="p-8 text-center">Loading product…</div>;
//   if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
//   if (!product) return <div className="p-8 text-center">Product not found</div>;

//   // computed
//   const offerPrice = Math.max(1, Math.round(product.price * 0.95));

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
//       <div className="text-sm text-gray-500 mb-4">
//         Home / {product.category} / {product.section} / {product.subcategory} / {product.title}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_420px] gap-8 items-start">
//         <div className="hidden md:flex flex-col items-center">
//           <button onClick={thumbUp} className="w-8 h-8 rounded-full border flex items-center justify-center mb-3 text-gray-600">
//             <FaChevronLeft className="rotate-90" />
//           </button>

//           <div className="flex-1 overflow-hidden">
//             <div className="flex flex-col gap-3">
//               {activeImages.slice(thumbStart, thumbStart + THUMB_VISIBLE).map((img, i) => {
//                 const realIdx = thumbStart + i;
//                 return (
//                   <button
//                     key={img + realIdx}
//                     onClick={() => setMainIdx(realIdx)}
//                     className={`w-16 h-20 border rounded overflow-hidden ${mainIdx === realIdx ? "ring-2 ring-yellow-500" : ""}`}
//                   >
//                     <img src={img} alt={`${product.title}-thumb-${realIdx}`} className="w-full h-full object-cover" />
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <button onClick={thumbDown} className="w-8 h-8 rounded-full border flex items-center justify-center mt-3 text-gray-600">
//             <FaChevronRight className="rotate-90" />
//           </button>
//         </div>

//         <div className="relative border rounded-lg overflow-hidden bg-white">
//           <div className="absolute right-3 top-3 z-10">
//             <button className="p-2 rounded-full bg-white shadow text-gray-600"><FaShareAlt /></button>
//           </div>

//           <div className="flex items-center justify-center h-[640px] bg-gray-50">
//             <img src={activeImages[mainIdx] || product.image} alt={product.title} className="max-h-[600px] object-contain" />
//           </div>

//           <button onClick={prevMain} className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow text-gray-700">
//             <FaChevronLeft />
//           </button>
//           <button onClick={nextMain} className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow text-gray-700">
//             <FaChevronRight />
//           </button>
//         </div>

//         <div className="py-2">
//           <div className="text-sm text-gray-500 uppercase">{product.brand}</div>
//           <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.title}</h1>

//           <div className="flex items-center gap-3 mt-3">
//             <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
//               {product.rating ?? "—"} ★
//             </div>
//             <div className="text-sm text-gray-500">{product.ratingCount ?? 0} Ratings</div>
//           </div>

//           <div className="mt-4 flex items-end gap-4">
//             <div className="text-3xl font-bold text-green-800">₹{product.price}</div>
//             {product.mrp && <div className="text-sm text-gray-500 line-through">MRP ₹{product.mrp}</div>}
//             {product.discountPercent != null && <div className="text-sm text-red-600">({product.discountPercent}% off)</div>}
//           </div>

//           <div className="mt-4 border border-dashed border-yellow-300 rounded p-3 bg-yellow-50 text-sm">
//             <div className="font-semibold">Offer</div>
//             <div className="mt-1">Get it for ₹{offerPrice} • Use Code <span className="font-semibold">NEWS30</span></div>
//           </div>

//           {product.colors?.length > 0 && (
//             <div className="mt-6">
//               <div className="text-sm font-medium text-gray-700">Primary Color</div>
//               <div className="flex items-center gap-3 mt-3">
//                 {product.colors.map((c, i) => {
//                   const raw = String(c || "").trim();
//                   const lower = raw.toLowerCase();
//                   const mapped = COLOR_NAME_MAP[lower] || raw;
//                   const valid = isValidCssColor(mapped) || isValidCssColor(raw);
//                   const dotStyle = valid ? { backgroundColor: (isValidCssColor(mapped) ? mapped : raw) } : {};
//                   return (
//                     <button
//                       key={raw + i}
//                       onClick={() => selectColor(raw)}
//                       className={`w-10 h-10 rounded-full border flex items-center justify-center ${selectedColor === raw ? "ring-2 ring-yellow-500" : ""}`}
//                       title={raw}
//                     >
//                       {valid ? (
//                         <div style={{ width: 18, height: 18, borderRadius: 999, ...dotStyle }} />
//                       ) : (
//                         <div className="text-xs font-medium text-gray-700">{raw.length <= 3 ? raw.toUpperCase() : raw.slice(0,2).toUpperCase()}</div>
//                       )}
//                     </button>
//                   );
//                 })}
//                 <div className="text-sm text-gray-600 ml-2">{selectedColor}</div>
//               </div>
//             </div>
//           )}

//           {product.sizes?.length > 0 && (
//             <div className="mt-6">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm font-medium text-gray-700">Select Size</div>
//                 <div className="text-xs text-gray-400">Check Size Chart</div>
//               </div>

//               <div className="flex items-center gap-3 mt-3">
//                 <button onClick={sizeLeft} className="w-8 h-8 rounded-full border flex items-center justify-center">
//                   <FaChevronLeft />
//                 </button>

//                 <div className="flex gap-2 flex-wrap">
//                   {product.sizes.map(s => (
//                     <button
//                       key={s}
//                       onClick={() => setSelectedSize(s)}
//                       className={`px-3 py-2 border rounded ${selectedSize === s ? "bg-gray-900 text-white" : "bg-white"}`}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>

//                 <button onClick={sizeRight} className="w-8 h-8 rounded-full border flex items-center justify-center">
//                   <FaChevronRight />
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="mt-4 text-sm text-gray-600">Stock: {product.stock ?? 0}</div>

//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={handleAddToBag}
//               disabled={inCart}
//               className={`px-6 py-3 rounded text-white font-semibold ${inCart ? "bg-gray-400 cursor-not-allowed" : (selectedSize || !product?.sizes?.length ? "bg-yellow-700 hover:bg-yellow-800" : "bg-gray-300 cursor-not-allowed")}`}
//             >
//               {inCart ? "Go to Bag" : "ADD TO BAG"}
//             </button>

//             <button
//               onClick={toggleWishlist}
//               className={`px-6 py-3 rounded border font-semibold flex items-center gap-3 ${inWishlist ? "text-red-600 border-red-600" : ""}`}
//             >
//               <FaHeart className={inWishlist ? "text-red-600" : "text-gray-600"} />
//               {inWishlist ? "REMOVE WISHLIST" : "SAVE TO WISHLIST"}
//             </button>
//           </div>

//           <div className="mt-6 text-sm text-gray-700">
//             <h4 className="font-semibold">Product Details</h4>
//             <p className="mt-2">{product.description || product.title}</p>
//             <div className="mt-3">
//               <Link to={`/c/${product.category || "all"}`} className="text-sm text-blue-600">Back to category</Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mt-10">
//         <h3 className="font-semibold mb-3">Product Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
//           <div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Primary Color</div>
//               <div>{product.colors?.[0] ?? "-"}</div>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Wash</div>
//               <div>{product.wash ?? "Clean"}</div>
//             </div>
//           </div>
//           <div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Size Tip</div>
//               <div>{product.sizeTip ?? "We recommend you buy a size larger"}</div>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <div className="text-gray-600">Fabric</div>
//               <div>{product.fabric ?? "-"}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Local fallback Popup (bottom-right) */}
//       {popup && (
//         <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-md shadow-lg">
//           {popup}
//         </div>
//       )}

     
//     </div>
//   );
// }



// ******************** search bar fix *****************************************************************************

//src/pages/ProductPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaShareAlt, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

// /** Helper: check whether a string is a valid CSS color */
function isValidCssColor(str) {
  if (!str || typeof window === "undefined") return false;
  const s = new Option().style;
  s.color = "";
  s.color = str;
  return s.color !== "";
}

/** Optional mapping for consistent swatch shades */
const COLOR_NAME_MAP = {
  khaki: "#C3B091",
  grey: "grey",
  gray: "gray",
  white: "#ffffff",
  black: "#000000",
  navy: "#0b3d91",
  blue: "#1e90ff",
  olive: "#808000",
  brown: "#8b4513",
  bronze: "#cd7f32",
};

export default function ProductPage() {
  const { id } = useParams();

  // data state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ui state
  const [mainIdx, setMainIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // thumbnail scroll pointer (desktop vertical)
  const [thumbStart, setThumbStart] = useState(0);
  const THUMB_VISIBLE = 5;

  // local fallback popup (if navbar listener not present)
  const [popup, setPopup] = useState("");

  // contexts (cart & wishlist)
  const { cart, addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // --- NEW: Save a small snapshot to localStorage.recentlyViewed (keeps uniqueness & max 8)
  const pushRecentlyViewed = (prod) => {
    try {
      if (!prod) return;
      const small = {
        _id: prod._id || prod.id || prod.productId || null,
        image: Array.isArray(prod.images) ? prod.images[0] : (prod.image || ""),
        brand: prod.brand || prod.seller || "",
        title: prod.title || prod.name || "",
        price: prod.price ?? null,
        mrp: prod.mrp ?? null
      };

      if (!small._id) return; // require id to avoid duplicates of undefined

      const raw = localStorage.getItem("recentlyViewed");
      let arr = [];
      if (raw) {
        try { arr = JSON.parse(raw) || []; } catch { arr = []; }
        if (!Array.isArray(arr)) arr = [];
      }

      // Add new at front, keep unique by _id, limit to 8
      arr = [small, ...arr.filter(item => item && item._id !== small._id)].slice(0, 8);
      localStorage.setItem("recentlyViewed", JSON.stringify(arr));
    } catch (err) {
      // fail silently
    }
  };
  // --- end pushRecentlyViewed

  // fetch product from backend
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/products/${id}`);
        if (cancelled) return;
        const p = res.data || null;
        if (!p) {
          setProduct(null);
          setError("Product not found");
          return;
        }
        // normalize images
        p.images = Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []);
        setProduct(p);
        setMainIdx(0);
        setSelectedColor(p.colors && p.colors.length ? p.colors[0] : null);
        setSelectedSize(null);
        setThumbStart(0);

        // ← PUSH recently viewed after product is set (non-invasive)
        pushRecentlyViewed(p);
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.error || err.message || "Failed to fetch product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Keep selectedColor synced to product.colors changes
  useEffect(() => {
    if (!product) return;
    if (product.colors && product.colors.length) {
      if (!selectedColor || !product.colors.includes(selectedColor)) {
        setSelectedColor(product.colors[0]);
      }
    } else {
      setSelectedColor(null);
    }
  }, [product?.colors]);

  // Split images into chunks per color (client-side)
  const colorImagesMap = useMemo(() => {
    if (!product) return {};
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const imgs = Array.isArray(product.images) ? product.images : [];

    // fallback no colors -> single group "all"
    if (!colors.length) {
      return { all: imgs.length ? imgs : (product.image ? [product.image] : []) };
    }

    // fallback no images -> one image per color using product.image
    if (!imgs.length) {
      const fallback = {};
      colors.forEach(c => (fallback[c] = product.image ? [product.image] : []));
      return fallback;
    }

    const C = colors.length;
    const M = imgs.length;
    const per = Math.floor(M / C);
    const rem = M % C;

    const map = {};
    let cursor = 0;
    for (let i = 0; i < C; i++) {
      const take = per + (i < rem ? 1 : 0);
      map[colors[i]] = take > 0 ? imgs.slice(cursor, cursor + take) : [];
      cursor += take;
    }
    if (cursor < M) {
      const lastColor = colors[C - 1];
      map[lastColor] = map[lastColor].concat(imgs.slice(cursor));
    }
    return map;
  }, [product]);

  // active images depend on selectedColor
  const activeImages = useMemo(() => {
    if (!product) return [];
    if (!product.colors || product.colors.length === 0) {
      return product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
    }
    const chosen = selectedColor || product.colors[0];
    const imgs = colorImagesMap[chosen];
    if (!imgs || imgs.length === 0) {
      return product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
    }
    return imgs;
  }, [product, colorImagesMap, selectedColor]);

  // reset main index when active images change
  useEffect(() => {
    setMainIdx(0);
    setThumbStart(0);
  }, [activeImages]);

  // UI handlers
  const nextMain = () => setMainIdx(i => (activeImages.length ? (i + 1) % activeImages.length : 0));
  const prevMain = () => setMainIdx(i => (activeImages.length ? (i - 1 + activeImages.length) % activeImages.length : 0));
  const thumbUp = () => setThumbStart(s => Math.max(0, s - 1));
  const thumbDown = () => setThumbStart(s => {
    const maxStart = Math.max(0, (activeImages.length || 0) - THUMB_VISIBLE);
    return Math.min(maxStart, s + 1);
  });
  const selectColor = (c) => { setSelectedColor(c); setSelectedSize(null); };

  const sizeLeft = () => {
    if (!product?.sizes?.length) return;
    const arr = product.sizes;
    const cur = selectedSize ?? arr[0];
    const idx = Math.max(0, arr.indexOf(cur));
    setSelectedSize(arr[idx <= 0 ? arr.length - 1 : idx - 1]);
  };
  const sizeRight = () => {
    if (!product?.sizes?.length) return;
    const arr = product.sizes;
    const cur = selectedSize ?? arr[0];
    const idx = Math.max(0, arr.indexOf(cur));
    setSelectedSize(arr[idx >= arr.length - 1 ? 0 : idx + 1]);
  };

  // Popup helper (dispatch event to navbar; fallback to local popup)
  const showPopup = (msg, type = "cart") => {
    // type: "cart" | "wishlist"
    if (typeof window !== "undefined" && window?.dispatchEvent) {
      try {
        window.dispatchEvent(new CustomEvent("show-toast", { detail: { msg, type } }));
        return;
      } catch (e) {
        // fall through to local popup fallback
      }
    }
    // fallback local popup (bottom-right)
    setPopup(msg);
    setTimeout(() => setPopup(""), 2000);
  };

  // Cart / Wishlist helpers (integrated)
  // handle different shapes: server may use productId, local may store _id, etc.
  const productId = product?._id ?? product?.productId ?? product?.id ?? null;
  const inCart = product ? cart.some((item) =>
    item.productId === productId || item._id === productId || item.productId === product._id
  ) : false;
  const inWishlist = product ? wishlist.some((item) =>
    item.productId === productId || item._id === productId || item.productId === product._id
  ) : false;

  const handleAddToBag = () => {
    if (product?.sizes?.length && !selectedSize) {
      showPopup("Please select a size!", "cart");
      return;
    }

    if (!product) return;

    // Use addToCart(product, quantity, size)
    // Our CartContext supports product object; it will extract product._id/productId as needed
    addToCart({ ...product, selectedSize, selectedColor }, 1, selectedSize);
    showPopup("Item added to bag", "cart");
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      // remove by id (wishlist context handles server/local)
      const pid = productId;
      if (!pid) {
        console.warn("toggleWishlist: product ID missing", product);
        return;
      }
      removeFromWishlist(pid);
      showPopup("Removed from wishlist", "wishlist");
    } else {
      // add product snapshot (keep selected size/color info)
      addToWishlist({ ...product, selectedSize, selectedColor });
      showPopup("Item saved in my wishlist", "wishlist");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading product…</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  // computed
  const offerPrice = Math.max(1, Math.round(product.price * 0.95));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="text-sm text-gray-500 mb-4">
        Home / {product.category} / {product.section} / {product.subcategory} / {product.title}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_420px] gap-8 items-start">
        <div className="hidden md:flex flex-col items-center">
          <button onClick={thumbUp} className="w-8 h-8 rounded-full border flex items-center justify-center mb-3 text-gray-600">
            <FaChevronLeft className="rotate-90" />
          </button>

          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col gap-3">
              {activeImages.slice(thumbStart, thumbStart + THUMB_VISIBLE).map((img, i) => {
                const realIdx = thumbStart + i;
                return (
                  <button
                    key={img + realIdx}
                    onClick={() => setMainIdx(realIdx)}
                    className={`w-16 h-20 border rounded overflow-hidden ${mainIdx === realIdx ? "ring-2 ring-yellow-500" : ""}`}
                  >
                    <img src={img} alt={`${product.title}-thumb-${realIdx}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={thumbDown} className="w-8 h-8 rounded-full border flex items-center justify-center mt-3 text-gray-600">
            <FaChevronRight className="rotate-90" />
          </button>
        </div>

        <div className="relative border rounded-lg overflow-hidden bg-white">
          <div className="absolute right-3 top-3 z-10">
            <button className="p-2 rounded-full bg-white shadow text-gray-600"><FaShareAlt /></button>
          </div>

          <div className="flex items-center justify-center h-[640px] bg-gray-50">
            <img src={activeImages[mainIdx] || product.image} alt={product.title} className="max-h-[600px] object-contain" />
          </div>

          <button onClick={prevMain} className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow text-gray-700">
            <FaChevronLeft />
          </button>
          <button onClick={nextMain} className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow text-gray-700">
            <FaChevronRight />
          </button>
        </div>

        <div className="py-2">
          <div className="text-sm text-gray-500 uppercase">{product.brand}</div>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.title}</h1>

          <div className="flex items-center gap-3 mt-3">
            <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
              {product.rating ?? "—"} ★
            </div>
            <div className="text-sm text-gray-500">{product.ratingCount ?? 0} Ratings</div>
          </div>

          <div className="mt-4 flex items-end gap-4">
            <div className="text-3xl font-bold text-green-800">₹{product.price}</div>
            {product.mrp && <div className="text-sm text-gray-500 line-through">MRP ₹{product.mrp}</div>}
            {product.discountPercent != null && <div className="text-sm text-red-600">({product.discountPercent}% off)</div>}
          </div>

          <div className="mt-4 border border-dashed border-yellow-300 rounded p-3 bg-yellow-50 text-sm">
            <div className="font-semibold">Offer</div>
            <div className="mt-1">Get it for ₹{offerPrice} • Use Code <span className="font-semibold">NEWS30</span></div>
          </div>

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium text-gray-700">Primary Color</div>
              <div className="flex items-center gap-3 mt-3">
                {product.colors.map((c, i) => {
                  const raw = String(c || "").trim();
                  const lower = raw.toLowerCase();
                  const mapped = COLOR_NAME_MAP[lower] || raw;
                  const valid = isValidCssColor(mapped) || isValidCssColor(raw);
                  const dotStyle = valid ? { backgroundColor: (isValidCssColor(mapped) ? mapped : raw) } : {};
                  return (
                    <button
                      key={raw + i}
                      onClick={() => selectColor(raw)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center ${selectedColor === raw ? "ring-2 ring-yellow-500" : ""}`}
                      title={raw}
                    >
                      {valid ? (
                        <div style={{ width: 18, height: 18, borderRadius: 999, ...dotStyle }} />
                      ) : (
                        <div className="text-xs font-medium text-gray-700">{raw.length <= 3 ? raw.toUpperCase() : raw.slice(0,2).toUpperCase()}</div>
                      )}
                    </button>
                  );
                })}
                <div className="text-sm text-gray-600 ml-2">{selectedColor}</div>
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">Select Size</div>
                <div className="text-xs text-gray-400">Check Size Chart</div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <button onClick={sizeLeft} className="w-8 h-8 rounded-full border flex items-center justify-center">
                  <FaChevronLeft />
                </button>

                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-2 border rounded ${selectedSize === s ? "bg-gray-900 text-white" : "bg-white"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button onClick={sizeRight} className="w-8 h-8 rounded-full border flex items-center justify-center">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">Stock: {product.stock ?? 0}</div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToBag}
              disabled={inCart}
              className={`px-6 py-3 rounded text-white font-semibold ${inCart ? "bg-gray-400 cursor-not-allowed" : (selectedSize || !product?.sizes?.length ? "bg-yellow-700 hover:bg-yellow-800" : "bg-gray-300 cursor-not-allowed")}`}
            >
              {inCart ? "Go to Bag" : "ADD TO BAG"}
            </button>

            <button
              onClick={toggleWishlist}
              className={`px-6 py-3 rounded border font-semibold flex items-center gap-3 ${inWishlist ? "text-red-600 border-red-600" : ""}`}
            >
              <FaHeart className={inWishlist ? "text-red-600" : "text-gray-600"} />
              {inWishlist ? "REMOVE WISHLIST" : "SAVE TO WISHLIST"}
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-700">
            <h4 className="font-semibold">Product Details</h4>
            <p className="mt-2">{product.description || product.title}</p>
            <div className="mt-3">
              <Link to={`/c/${product.category || "all"}`} className="text-sm text-blue-600">Back to category</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mt-10">
        <h3 className="font-semibold mb-3">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <div className="flex justify-between py-2 border-b">
              <div className="text-gray-600">Primary Color</div>
              <div>{product.colors?.[0] ?? "-"}</div>
            </div>
            <div className="flex justify-between py-2 border-b">
              <div className="text-gray-600">Wash</div>
              <div>{product.wash ?? "Clean"}</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between py-2 border-b">
              <div className="text-gray-600">Size Tip</div>
              <div>{product.sizeTip ?? "We recommend you buy a size larger"}</div>
            </div>
            <div className="flex justify-between py-2 border-b">
              <div className="text-gray-600">Fabric</div>
              <div>{product.fabric ?? "-"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Local fallback Popup (bottom-right) */}
      {popup && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-md shadow-lg">
          {popup}
        </div>
      )}
    </div>
  );
}
