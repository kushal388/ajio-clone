// frontend/pages/WishlistPage.jsx
// import { useWishlist } from "../context/WishlistContext";

// export default function WishlistPage() {
//   const { wishlist, removeFromWishlist } = useWishlist();

//   if (wishlist.length === 0) {
//     return <h2 className="text-center mt-10 text-gray-600">Your Wishlist is empty</h2>;
//   }

//   return (
//     <div className="p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
//       {wishlist.map((item) => (
//         <div key={item._id} className="border p-4 rounded-md relative">
//           <img src={item.image} alt={item.name} className="w-full h-60 object-cover" />
//           <h3 className="mt-2 font-semibold">{item.brand}</h3>
//           <p className="text-sm">{item.title}</p>
//           <p className="font-bold">₹{item.price}</p>    
//           <p className="text-sm text-gray-500 line-through">₹{item.mrp}</p>

//           <button
//             onClick={() => removeFromWishlist(item._id)}
//             className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
//           >
//             ✕
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }


// ******************************************************************************


// import React from "react";
// import { useWishlist } from "../context/WishlistContext";
// import { useCart } from "../context/CartContext";

// export default function WishlistPage() {
//   const { wishlist, removeFromWishlist } = useWishlist();
//   const { addToCart } = useCart();

//   if (!wishlist || wishlist.length === 0) {
//     return <h2 className="text-center mt-10 text-gray-600">Your Wishlist is empty</h2>;
//   }

//   return (
//     <div className="p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
//       {wishlist.map((item) => {
//         const pid = item.productId ?? item._id;
//         return (
//           <div key={pid} className="border p-4 rounded-md relative">
//             {item.image ? (
//               <img src={item.image} alt={item.title} className="w-full h-60 object-cover" />
//             ) : (
//               <div className="w-full h-60 bg-gray-100 flex items-center justify-center text-sm text-gray-500">No image</div>
//             )}
//             <h3 className="mt-2 font-semibold">{item.brand ?? item.title}</h3>
//             <p className="text-sm">{item.title}</p>
//             <p className="font-bold">₹{item.price}</p>
//             <p className="text-sm text-gray-500 line-through">₹{item.mrp}</p>

//             <div className="mt-3 flex gap-2">
//               <button
//                 onClick={() => {
//                   // move to cart (default qty 1)
//                   addToCart(item, 1, item.size ?? null);
//                   // then remove from wishlist
//                   removeFromWishlist(pid);
//                 }}
//                 className="px-3 py-1 border rounded text-sm"
//               >
//                 Move to bag
//               </button>

//               <button
//                 onClick={() => removeFromWishlist(pid)}
//                 className="px-3 py-1 bg-red-500 text-white rounded text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// *********************************************************************************************


// import React from "react";
// import { useWishlist } from "../context/WishlistContext";
// import { useCart } from "../context/CartContext";

// export default function WishlistPage() {
//   const { wishlist, removeFromWishlist } = useWishlist();
//   const { addToCart } = useCart();

//   if (!wishlist || wishlist.length === 0) {
//     return <h2 className="text-center mt-10 text-gray-600">Your Wishlist is empty</h2>;
//   }

//   return (
//     <div className="p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
//       {wishlist.map((item) => {
//         const pid = item.productId ?? item._id;
//         const entryId = item.raw?._id ?? item._id ?? pid;

//         return (
//           <div key={entryId} className="border p-4 rounded-md relative">
//             {item.image ? (
//               <img src={item.image} alt={item.title} className="w-full h-60 object-cover" />
//             ) : (
//               <div className="w-full h-60 bg-gray-100 flex items-center justify-center text-sm text-gray-500">No image</div>
//             )}
//             <h3 className="mt-2 font-semibold">{item.brand ?? item.title}</h3>
//             <p className="text-sm">{item.title}</p>
//             <p className="font-bold">₹{item.price}</p>
//             <p className="text-sm text-gray-500 line-through">₹{item.mrp}</p>

//             <div className="mt-3 flex gap-2">
//               <button
//                 onClick={async () => {
//                   try {
//                     await addToCart(item, 1, item.size ?? null);
//                     // remove from wishlist by entry id (reliable)
//                     await removeFromWishlist(entryId);
//                   } catch (err) {
//                     console.error("Move to bag failed", err);
//                   }
//                 }}
//                 className="px-3 py-1 border rounded text-sm"
//               >
//                 Move to bag
//               </button>

//               <button
//                 onClick={() => removeFromWishlist(entryId)}
//                 className="px-3 py-1 bg-red-500 text-white rounded text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }



// *************************************************************************************************

// src/pages/WishlistPage.jsx

// src/pages/WishlistPage.jsx
// import React, { useState } from "react";
// import { useWishlist } from "../context/WishlistContext";
// import { useCart } from "../context/CartContext";
// import { FaTrashAlt, FaShoppingBag } from "react-icons/fa";

// export default function WishlistPage() {
//   const { wishlist, removeFromWishlist } = useWishlist();
//   const { addToCart } = useCart();

//   const [loadingIds, setLoadingIds] = useState(new Set());

//   if (!wishlist || wishlist.length === 0) {
//     return (
//       <h2 className="text-center mt-10 text-gray-600">Your Wishlist is empty</h2>
//     );
//   }

//   const setLoading = (id, v) => {
//     setLoadingIds((prev) => {
//       const next = new Set(prev);
//       if (v) next.add(String(id)); else next.delete(String(id));
//       return next;
//     });
//   };

//   const isLoading = (id) => loadingIds.has(String(id));

//   const handleMoveToCart = async (item) => {
//     const entryId = item.raw?._id ?? item._id ?? item.productId;
//     try {
//       setLoading(entryId, true);
//       // addToCart(item, qty, size) — expects product shape your context understands
//       await addToCart(item, 1, item.size ?? null);
//       // only remove from wishlist after successful add
//       await removeFromWishlist(entryId);
//     } catch (err) {
//       console.error("Move to bag failed", err);
//       // no toast UI — errors are logged; you can inspect console/network
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleRemove = async (item) => {
//     const entryId = item.raw?._id ?? item._id ?? item.productId;
//     try {
//       setLoading(entryId, true);
//       await removeFromWishlist(entryId);
//     } catch (err) {
//       console.error("Remove from wishlist failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
//       <h2 className="text-2xl font-bold text-center mb-10">My Wishlist</h2>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//         {wishlist.map((item) => {
//           const entryId = item.raw?._id ?? item._id ?? item.productId;
//           const busy = isLoading(entryId);

//           return (
//             <div
//               key={entryId}
//               className="border p-4 rounded-md relative flex flex-col"
//             >
//               {/* Image */}
//               {item.image ? (
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="w-full h-60 object-cover rounded"
//                 />
//               ) : (
//                 <div className="w-full h-60 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-500">
//                   No image
//                 </div>
//               )}

//               {/* Delete */}
//               <button
//                 onClick={() => handleRemove(item)}
//                 className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
//                 title="Remove from Wishlist"
//                 disabled={busy}
//               >
//                 <FaTrashAlt className="text-red-500 hover:text-red-700" />
//               </button>

//               {/* Move to Bag */}
//               <button
//                 onClick={() => handleMoveToCart(item)}
//                 className={`absolute bottom-3 right-3 bg-yellow-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-800 ${busy ? "opacity-60 pointer-events-none" : ""
//                   }`}
//                 title="Move to Bag"
//                 disabled={busy}
//               >
//                 <FaShoppingBag size={14} />
//               </button>

//               {/* Info */}
//               <h3 className="mt-3 font-semibold uppercase text-sm text-yellow-900">
//                 {item.brand}
//               </h3>
//               <p className="text-sm text-gray-700 line-clamp-2">{item.title}</p>

//               <div className="mt-2 flex items-center gap-2">
//                 <span className="font-bold text-lg">₹{item.price}</span>
//                 {item.mrp && (
//                   <span className="text-gray-500 line-through ml-2">₹{item.mrp}</span>
//                 )}
//                 {item.discountPercent && (
//                   <span className="text-red-600 ml-2">({item.discountPercent}% off)</span>
//                 )}
//               </div>

//               {/* Optional meta */}
//               <div className="mt-3 text-sm text-gray-500 flex justify-between items-center">
//                 <div>{item.color ? item.color : ""}</div>
//                 <div>{item.size ? `Size: ${item.size}` : ""}</div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


// ************************************************************************


// src/pages/WishlistPage.jsx
// import React, { useState } from "react";
// import { useWishlist } from "../context/WishlistContext";
// import { useCart } from "../context/CartContext";
// import { FaTrashAlt, FaShoppingBag } from "react-icons/fa";

// export default function WishlistPage() {
//   const { wishlist, removeFromWishlist } = useWishlist();
//   const { addToCart } = useCart();

//   const [loadingIds, setLoadingIds] = useState(new Set());

//   const getEntryId = (item) => {
//     const subId = item?.raw?._id ?? item?._id;
//     if (subId) return String(subId);
//     const pid = item?.productId;
//     if (pid && typeof pid === "object") return String(pid._id ?? pid.productId ?? pid);
//     return pid ? String(pid) : "";
//   };

//   if (!wishlist || wishlist.length === 0) {
//     return (
//       <h2 className="text-center mt-10 text-gray-600">Your Wishlist is empty</h2>
//     );
//   }

//   const setLoading = (id, v) => {
//     setLoadingIds((prev) => {
//       const next = new Set(prev);
//       if (v) next.add(String(id));
//       else next.delete(String(id));
//       return next;
//     });
//   };

//   const isLoading = (id) => loadingIds.has(String(id));

//   const handleMoveToCart = async (item) => {
//     const entryId = getEntryId(item);
//     try {
//       setLoading(entryId, true);
//       // addToCart expects a product-like object; item should contain product fields
//       await addToCart(item, 1, item.size ?? null);
//       // remove wishlist entry (pass entry id which may be subdoc _id or productId)
//       await removeFromWishlist(entryId);
//     } catch (err) {
//       console.error("Move to bag failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   const handleRemove = async (item) => {
//     const entryId = getEntryId(item);
//     try {
//       setLoading(entryId, true);
//       await removeFromWishlist(entryId);
//     } catch (err) {
//       console.error("Remove from wishlist failed", err);
//     } finally {
//       setLoading(entryId, false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
//       <h2 className="text-2xl font-bold text-center mb-10">My Wishlist</h2>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//         {wishlist.map((item) => {
//           const entryId = getEntryId(item);
//           const busy = isLoading(entryId);

//           return (
//             <div
//               key={entryId || Math.random()}
//               className="border p-4 rounded-md relative flex flex-col"
//             >
//               {/* Image */}
//               {item.image ? (
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="w-full h-60 object-cover rounded"
//                 />
//               ) : (
//                 <div className="w-full h-60 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-500">
//                   No image
//                 </div>
//               )}

//               {/* Delete */}
//               <button
//                 onClick={() => handleRemove(item)}
//                 className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
//                 title="Remove from Wishlist"
//                 disabled={busy}
//               >
//                 <FaTrashAlt className="text-red-500 hover:text-red-700" />
//               </button>

//               {/* Move to Bag */}
//               <button
//                 onClick={() => handleMoveToCart(item)}
//                 className={`absolute bottom-3 right-3 bg-yellow-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-800 ${busy ? "opacity-60 pointer-events-none" : ""
//                   }`}
//                 title="Move to Bag"
//                 disabled={busy}
//               >
//                 <FaShoppingBag size={14} />
//               </button>

//               {/* Info */}
//               <h3 className="mt-3 font-semibold uppercase text-sm text-yellow-900">
//                 {item.brand}
//               </h3>
//               <p className="text-sm text-gray-700 line-clamp-2">{item.title}</p>

//               <div className="mt-2 flex items-center gap-2">
//                 <span className="font-bold text-lg">₹{item.price}</span>
//                 {item.mrp && (
//                   <span className="text-gray-500 line-through ml-2">₹{item.mrp}</span>
//                 )}
//                 {item.discountPercent && (
//                   <span className="text-red-600 ml-2">({item.discountPercent}% off)</span>
//                 )}
//               </div>

//               {/* Optional meta */}
//               <div className="mt-3 text-sm text-gray-500 flex justify-between items-center">
//                 <div>{item.color ? item.color : ""}</div>
//                 <div>{item.size ? `Size: ${item.size}` : ""}</div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }




// *************************************************************************


// src/context/WishlistContext.jsx
// src/pages/WishlistPage.jsx
import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { FaTrashAlt, FaShoppingBag } from "react-icons/fa";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToWishlist } = useWishlist();
  const { addToCart, mergeLocalToServer } = useCart();

  const [loadingIds, setLoadingIds] = useState(new Set());
  const setLoading = (id, v) => {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      if (v) next.add(String(id)); else next.delete(String(id));
      return next;
    });
  };
  const isLoading = (id) => loadingIds.has(String(id));

  if (!wishlist || wishlist.length === 0) {
    return <h2 className="text-center mt-10 text-gray-600">Your Wishlist is empty</h2>;
  }

  const getEntryId = (item) => item?.raw?._id ?? item._id ?? (item.productId ?? "");

  const handleMoveToCart = async (item) => {
    const entryId = getEntryId(item);
    try {
      setLoading(entryId, true);
      // addToCart takes a product-like shape — we pass item (normalize handles)
      await addToCart(item, 1, item.size ?? null);
      // remove wishlist after successful add
      await removeFromWishlist(entryId);
    } catch (err) {
      console.error("Move to bag failed", err);
    } finally {
      setLoading(entryId, false);
    }
  };

  const handleRemove = async (item) => {
    const entryId = getEntryId(item);
    try {
      setLoading(entryId, true);
      await removeFromWishlist(entryId);
    } catch (err) {
      console.error("Remove from wishlist failed", err);
    } finally {
      setLoading(entryId, false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <h2 className="text-2xl font-bold text-center mb-10">My Wishlist</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {wishlist.map((item) => {
          const entryId = getEntryId(item);
          const busy = isLoading(entryId);

          return (
            <div key={entryId} className="border p-4 rounded-md relative flex flex-col">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-60 object-cover rounded" />
              ) : (
                <div className="w-full h-60 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-500">No image</div>
              )}

              <button onClick={() => handleRemove(item)} disabled={busy} className="absolute top-3 right-3 text-gray-500 hover:text-red-600" title="Remove from Wishlist">
                <FaTrashAlt className="text-red-500 hover:text-red-700" />
              </button>

              <button onClick={() => handleMoveToCart(item)} disabled={busy} className={`absolute bottom-3 right-3 bg-yellow-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-800 ${busy ? "opacity-60 pointer-events-none" : ""}`} title="Move to Bag">
                <FaShoppingBag size={14} />
              </button>

              <h3 className="mt-3 font-semibold uppercase text-sm text-yellow-900">{item.brand ?? item.title}</h3>
              <p className="text-sm text-gray-700 line-clamp-2">{item.title}</p>

              <div className="mt-2 flex items-center gap-2">
                <span className="font-bold text-lg">₹{item.price}</span>
                {item.mrp && <span className="text-gray-500 line-through ml-2">₹{item.mrp}</span>}
                {item.discountPercent && <span className="text-red-600 ml-2">({item.discountPercent}% off)</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

