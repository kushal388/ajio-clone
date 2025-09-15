// import React from "react";

// export default function ProductCard({ p, onEdit, onDelete }) {
//   return (
//     <div className="border rounded p-4 shadow bg-white flex flex-col">
//       <div className="h-40 w-full mb-3 overflow-hidden rounded">
//         <img
//           src={p.image || p.images?.[0] || "/assets/placeholder.png"}
//           alt={p.title || "Product"}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       <div className="flex-1">
//         <h3 className="font-semibold text-lg">{p.title || "Untitled"}</h3>
//         <p className="text-sm text-gray-700 mt-1">₹{p.price ?? "N/A"}</p>
//         {p.brand && <div className="text-xs text-gray-500 mt-2">{p.brand}</div>}
//         <div className="text-xs text-gray-500 mt-1">Stock: {p.stock ?? 0}</div>
//       </div>

//       <div className="mt-4 flex gap-2">
//         <button onClick={() => onEdit(p)} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Edit</button>
//         <button onClick={() => onDelete(p)} className="px-3 py-1 rounded bg-red-500 text-white text-sm">Delete</button>
//       </div>
//     </div>
//   );
// }




// *******************************************************************************************************

//vednor/src/vendor/ProductCard.jsx
import React from "react";

export default function ProductCard({ p, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg p-4 shadow bg-white flex flex-col hover:shadow-md transition">
      {/* IMAGE: use object-contain so entire image is visible (no cropping).
          We add padding and a neutral bg so the product sits centered like a catalog shot. */}
      <div className="w-full h-56 mb-3 overflow-hidden rounded-md bg-gray-50 p-3 flex items-center justify-center">
        <img
          src={p.image || p.images?.[0] || "/assets/placeholder.png"}
          alt={p.title || "Product"}
          // object-contain -> show entire image, centered; max constraints keep it from overflowing
          className="max-h-full max-w-full object-contain object-center"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{p.title || "Untitled"}</h3>
        <p className="text-sm text-gray-700 mt-1">₹{p.price ?? "N/A"}</p>
        {p.brand && <div className="text-xs text-gray-500 mt-1">{p.brand}</div>}
        <div className="text-xs text-gray-500 mt-1">Stock: {p.stock ?? 0}</div>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(p)}
          className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(p)}
          className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
