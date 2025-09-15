// admin/src/pages/AdminProducts.jsx
// import React from "react";

// export default function AdminProducts() {
//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">Products</h1>
//       <div className="bg-white rounded shadow p-6 text-gray-500">Products admin UI will go here.</div>
//     </div>
//   );
// }



// *******************************************************


// import React, { useEffect, useState } from "react";
// import api from "../utils/api";

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [q, setQ] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   async function fetchProducts() {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get("/api/admin/products", { params: { q } });
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error("Fetch admin products error:", err.response?.data || err.message);
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchProducts();
//   }, [q]);

//   async function handleDelete(p) {
//     if (!confirm(`Delete "${p.title}"?`)) return;
//     try {
//       await api.delete(`/api/admin/products/${p._id}`);
//       setProducts((prev) => prev.filter((x) => x._id !== p._id));
//     } catch (err) {
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   }

//   async function handleApprove(p, approved) {
//     try {
//       const res = await api.patch(`/api/admin/products/${p._id}/approve`, { approved });
//       setProducts((prev) =>
//         prev.map((x) => (x._id === p._id ? res.data.product : x))
//       );
//     } catch (err) {
//       alert(err.response?.data?.message || "Approval failed");
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">All Products</h2>
//         <input
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           placeholder="Search products..."
//           className="border rounded p-2 w-72"
//         />
//       </div>

//       {loading ? (
//         <div>Loading…</div>
//       ) : error ? (
//         <div className="text-red-600">{error}</div>
//       ) : products.length === 0 ? (
//         <div>No products found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((p) => (
//             <div
//               key={p._id}
//               className="border rounded-lg p-4 shadow bg-white flex flex-col"
//             >
//               <div className="h-48 mb-3 flex items-center justify-center bg-gray-50 rounded">
//                 <img
//                   src={p.image || p.images?.[0] || "/assets/placeholder.png"}
//                   alt={p.title}
//                   className="max-h-full max-w-full object-contain"
//                 />
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-semibold text-lg">{p.title}</h3>
//                 <p className="text-sm text-gray-700">₹{p.price}</p>
//                 {p.brand && (
//                   <div className="text-xs text-gray-500 mt-1">{p.brand}</div>
//                 )}
//                 <div className="text-xs text-gray-500">
//                   Stock: {p.stock ?? 0}
//                 </div>
//                 <div
//                   className={`mt-1 text-xs font-medium ${
//                     p.isVendorApproved ? "text-green-600" : "text-orange-600"
//                   }`}
//                 >
//                   {p.isVendorApproved ? "Approved" : "Pending approval"}
//                 </div>
//               </div>
//               <div className="mt-4 flex gap-2">
//                 <button
//                   onClick={() => handleDelete(p)}
//                   className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//                 {!p.isVendorApproved && (
//                   <>
//                     <button
//                       onClick={() => handleApprove(p, true)}
//                       className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleApprove(p, false)}
//                       className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// *********************************************************************
// no pagination 

//admin/src/pages/AdminProducts.jsx
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";

// /**
//  * Admin Products page
//  * - Grid like vendor UI
//  * - No "Add Product"
//  * - Approve / Reject for pending vendor products
//  * - Edit / Delete available
//  * - Filter buttons: All (default) | Approved | Pending (with counts)
//  */

// export default function AdminProducts() {
//   const [rawProducts, setRawProducts] = useState([]); // full fetched set
//   const [products, setProducts] = useState([]); // shown set after filter
//   const [counts, setCounts] = useState({ all: 0, approved: 0, pending: 0 });

//   const [q, setQ] = useState("");
//   const [filter, setFilter] = useState("all"); // all | approved | pending
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const searchRef = useRef(null);

//   // compute counts from fetched list
//   function computeCounts(list = []) {
//     const c = { all: 0, approved: 0, pending: 0 };
//     c.all = Array.isArray(list) ? list.length : 0;
//     for (const p of list) {
//       if (p.isVendorApproved) c.approved += 1;
//       else c.pending += 1;
//     }
//     return c;
//   }

//   // fetch products (server supports approved query param but we fetch all to compute counts)
//   async function fetchProducts() {
//     setLoading(true);
//     setError(null);
//     try {
//       // We fetch all so we can compute counts client-side.
//       // For extremely large datasets you may want server-provided counts / pagination.
//       const res = await api.get("/api/admin/products", { params: { q: q || undefined, perPage: 200 } });

//       const list = res.data?.products ?? [];
//       setRawProducts(list);

//       const c = computeCounts(list);
//       setCounts(c);

//       applyFilter(list, filter);
//     } catch (err) {
//       console.error("Fetch admin products error:", err.response?.data || err.message);
//       setRawProducts([]);
//       setProducts([]);
//       setCounts({ all: 0, approved: 0, pending: 0 });
//       setError(err.response?.data?.message || err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // apply current filter to a list (client-side)
//   function applyFilter(list, f) {
//     if (!Array.isArray(list)) return setProducts([]);
//     if (f === "approved") setProducts(list.filter((p) => p.isVendorApproved));
//     else if (f === "pending") setProducts(list.filter((p) => !p.isVendorApproved));
//     else setProducts(list);
//   }

//   useEffect(() => {
//     // basic debounce for search
//     const t = setTimeout(() => {
//       fetchProducts();
//     }, 250);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q]);

//   useEffect(() => {
//     // re-apply filter when filter or rawProducts change
//     applyFilter(rawProducts, filter);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filter, rawProducts]);

//   useEffect(() => {
//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function handleDelete(p) {
//     if (!confirm(`Delete "${p.title}"?`)) return;
//     try {
//       await api.delete(`/api/admin/products/${p._id}`);
//       // remove locally
//       setRawProducts((prev) => prev.filter((x) => x._id !== p._id));
//     } catch (err) {
//       console.error("Delete error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   }

//   async function handleApprove(p, approved) {
//     try {
//       const res = await api.patch(`/api/admin/products/${p._id}/approve`, { approved });
//       const updated = res.data?.product;
//       if (updated) {
//         setRawProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
//       } else {
//         // fallback: refetch
//         fetchProducts();
//       }
//     } catch (err) {
//       console.error("Approval error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Approval failed");
//     }
//   }

//   async function handleEdit(p) {
//     // If you have an admin edit UI, navigate to it or open modal.
//     // For now we'll just prompt to edit title inline (simple fallback).
//     const newTitle = prompt("Edit title:", p.title);
//     if (!newTitle || newTitle === p.title) return;
//     try {
//       const payload = { title: newTitle };
//       const res = await api.put(`/api/admin/products/${p._id}`, payload);
//       const updated = res.data?.product;
//       if (updated) setRawProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
//     } catch (err) {
//       console.error("Edit failed:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Edit failed");
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">Products</h2>

//         <div className="flex items-center gap-3">
//           <input
//             ref={searchRef}
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search products by title/brand/sku..."
//             className="border rounded p-2 w-72"
//           />
//           <button onClick={fetchProducts} className="px-4 py-2 rounded bg-blue-600 text-white">Refresh</button>
//         </div>
//       </div>

//       {/* Filter segmented buttons */}
//       <div className="mb-4 flex gap-3 items-center flex-wrap">
//         <button
//           onClick={() => setFilter("all")}
//           className={`px-4 py-2 rounded-md border ${filter === "all" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           All ({counts.all})
//         </button>

//         <button
//           onClick={() => setFilter("approved")}
//           className={`px-4 py-2 rounded-md border ${filter === "approved" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           Approved ({counts.approved})
//         </button>

//         <button
//           onClick={() => setFilter("pending")}
//           className={`px-4 py-2 rounded-md border ${filter === "pending" ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           Pending ({counts.pending})
//         </button>
//       </div>

//       {loading ? (
//         <div className="p-4">Loading products…</div>
//       ) : error ? (
//         <div className="p-4 text-red-600">Error: {error}</div>
//       ) : products.length === 0 ? (
//         <div className="p-4 text-gray-600">No products found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((p) => (
//             <div key={p._id} className="border rounded-lg p-4 shadow bg-white flex flex-col">
//               <div className="w-full h-56 mb-3 overflow-hidden rounded-md bg-gray-50 p-3 flex items-center justify-center">
//                 <img
//                   src={p.image || p.images?.[0] || "/assets/placeholder.png"}
//                   alt={p.title}
//                   className="max-h-full max-w-full object-contain object-center"
//                 />
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-semibold text-lg">{p.title || "Untitled"}</h3>
//                 <p className="text-sm text-gray-700 mt-1">₹{p.price ?? "N/A"}</p>
//                 {p.brand && <div className="text-xs text-gray-500 mt-1">{p.brand}</div>}
//                 <div className="text-xs text-gray-500 mt-1">Stock: {p.stock ?? 0}</div>

//                 <div className={`mt-2 text-xs font-medium ${p.isVendorApproved ? "text-green-600" : "text-orange-600"}`}>
//                   {p.isVendorApproved ? "Approved" : "Pending approval"}
//                 </div>
//               </div>

//               <div className="mt-4 flex gap-2">
//                 <button
//                   onClick={() => handleEdit(p)}
//                   className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(p)}
//                   className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
//                 >
//                   Delete
//                 </button>

//                 {!p.isVendorApproved && (
//                   <>
//                     <button
//                       onClick={() => handleApprove(p, true)}
//                       className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//                     >
//                       Approve
//                     </button>

//                     <button
//                       onClick={() => handleApprove(p, false)}
//                       className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// **********************************************************************
// pagination 

// admin/src/pages/AdminProducts.jsx
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";

// /**
//  * Admin Products page with server-side pagination
//  * - Grid like vendor UI
//  * - No "Add Product"
//  * - Approve / Reject for pending vendor products
//  * - Edit / Delete available
//  * - Filter buttons: All (default) | Approved | Pending (with counts for current page)
//  */

// export default function AdminProducts() {
//   const [rawProducts, setRawProducts] = useState([]); // current page results
//   const [products, setProducts] = useState([]); // shown set after filter (from current page)
//   const [counts, setCounts] = useState({ all: 0, approved: 0, pending: 0 });

//   const [q, setQ] = useState("");
//   const [filter, setFilter] = useState("all"); // all | approved | pending

//   const [page, setPage] = useState(1);
//   const perPage = 12; // change as you like
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const searchRef = useRef(null);

//   // compute counts for current fetched page
//   function computeCounts(list = []) {
//     const c = { all: 0, approved: 0, pending: 0 };
//     c.all = Array.isArray(list) ? list.length : 0;
//     for (const p of list) {
//       if (p.isVendorApproved) c.approved += 1;
//       else c.pending += 1;
//     }
//     return c;
//   }

//   // fetch products for current page/search
//   async function fetchProducts() {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = { q: q || undefined, page, perPage };
//       // Server supports page/perPage and returns { products, total, page, perPage }
//       const res = await api.get("/api/admin/products", { params });

//       const list = res.data?.products ?? [];
//       const tot = res.data?.total ?? 0;

//       setRawProducts(list);
//       setTotal(tot);

//       const c = computeCounts(list);
//       setCounts(c);

//       applyFilter(list, filter);
//     } catch (err) {
//       console.error("Fetch admin products error:", err.response?.data || err.message);
//       setRawProducts([]);
//       setProducts([]);
//       setCounts({ all: 0, approved: 0, pending: 0 });
//       setTotal(0);
//       setError(err.response?.data?.message || err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // apply current filter to a list (client-side)
//   function applyFilter(list, f) {
//     if (!Array.isArray(list)) return setProducts([]);
//     if (f === "approved") setProducts(list.filter((p) => p.isVendorApproved));
//     else if (f === "pending") setProducts(list.filter((p) => !p.isVendorApproved));
//     else setProducts(list);
//   }

//   // debounce search & reset page on new search
//   useEffect(() => {
//     setPage(1);
//     const t = setTimeout(() => {
//       fetchProducts();
//     }, 250);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q]);

//   // fetch when page or filter changes (filter just re-applies on current page)
//   useEffect(() => {
//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page]);

//   useEffect(() => {
//     applyFilter(rawProducts, filter);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filter, rawProducts]);

//   // actions
//   async function handleDelete(p) {
//     if (!confirm(`Delete "${p.title}"?`)) return;
//     try {
//       await api.delete(`/api/admin/products/${p._id}`);
//       // remove locally from current page
//       setRawProducts((prev) => prev.filter((x) => x._id !== p._id));
//       setProducts((prev) => prev.filter((x) => x._id !== p._id));
//       // optionally refetch to refresh total
//       fetchProducts();
//     } catch (err) {
//       console.error("Delete error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   }

//   async function handleApprove(p, approved) {
//     try {
//       const res = await api.patch(`/api/admin/products/${p._id}/approve`, { approved });
//       const updated = res.data?.product;
//       if (updated) {
//         setRawProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
//       } else {
//         await fetchProducts();
//       }
//     } catch (err) {
//       console.error("Approval error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Approval failed");
//     }
//   }

//   async function handleEdit(p) {
//     // If you have an admin edit UI, navigate to it or open modal.
//     // Simple inline title edit fallback:
//     const newTitle = prompt("Edit title:", p.title);
//     if (!newTitle || newTitle === p.title) return;
//     try {
//       const payload = { title: newTitle };
//       const res = await api.put(`/api/admin/products/${p._id}`, payload);
//       const updated = res.data?.product;
//       if (updated) setRawProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
//     } catch (err) {
//       console.error("Edit failed:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Edit failed");
//     }
//   }

//   // pagination helpers
//   const canPrev = page > 1;
//   const canNext = page * perPage < total;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">Products</h2>

//         <div className="flex items-center gap-3">
//           <input
//             ref={searchRef}
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search products by title/brand/sku..."
//             className="border rounded p-2 w-72"
//           />
//           <button onClick={() => fetchProducts()} className="px-4 py-2 rounded bg-blue-600 text-white">Refresh</button>
//         </div>
//       </div>

//       {/* Filter segmented buttons */}
//       <div className="mb-4 flex gap-3 items-center flex-wrap">
//         <button
//           onClick={() => setFilter("all")}
//           className={`px-4 py-2 rounded-md border ${filter === "all" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           All ({counts.all})
//         </button>

//         <button
//           onClick={() => setFilter("approved")}
//           className={`px-4 py-2 rounded-md border ${filter === "approved" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           Approved ({counts.approved})
//         </button>

//         <button
//           onClick={() => setFilter("pending")}
//           className={`px-4 py-2 rounded-md border ${filter === "pending" ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           Pending ({counts.pending})
//         </button>
//       </div>

//       {/* Page info */}
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-600">Showing {products.length} of {total}</div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => canPrev && setPage((s) => Math.max(1, s - 1))} disabled={!canPrev} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
//           <div className="px-3 py-1 border rounded">Page {page}</div>
//           <button onClick={() => canNext && setPage((s) => s + 1)} disabled={!canNext} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="p-4">Loading products…</div>
//       ) : error ? (
//         <div className="p-4 text-red-600">Error: {error}</div>
//       ) : products.length === 0 ? (
//         <div className="p-4 text-gray-600">No products found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((p) => (
//             <div key={p._id} className="border rounded-lg p-4 shadow bg-white flex flex-col">
//               <div className="w-full h-56 mb-3 overflow-hidden rounded-md bg-gray-50 p-3 flex items-center justify-center">
//                 <img
//                   src={p.image || p.images?.[0] || "/assets/placeholder.png"}
//                   alt={p.title}
//                   className="max-h-full max-w-full object-contain object-center"
//                 />
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-semibold text-lg">{p.title || "Untitled"}</h3>
//                 <p className="text-sm text-gray-700 mt-1">₹{p.price ?? "N/A"}</p>
//                 {p.brand && <div className="text-xs text-gray-500 mt-1">{p.brand}</div>}
//                 <div className="text-xs text-gray-500 mt-1">Stock: {p.stock ?? 0}</div>

//                 <div className={`mt-2 text-xs font-medium ${p.isVendorApproved ? "text-green-600" : "text-orange-600"}`}>
//                   {p.isVendorApproved ? "Approved" : "Pending approval"}
//                 </div>
//               </div>

//               <div className="mt-4 flex gap-2">
//                 <button
//                   onClick={() => handleEdit(p)}
//                   className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(p)}
//                   className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
//                 >
//                   Delete
//                 </button>

//                 {!p.isVendorApproved && (
//                   <>
//                     <button
//                       onClick={() => handleApprove(p, true)}
//                       className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//                     >
//                       Approve
//                     </button>

//                     <button
//                       onClick={() => handleApprove(p, false)}
//                       className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



//******************************************************************** */


// admin/src/pages/AdminProducts.jsx
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";
// import AdminProductForm from "../components/AdminProductForm";

// /**
//  * Admin Products page with server-side pagination
//  * - Grid like vendor UI
//  * - No "Add Product"
//  * - Approve / Reject for pending vendor products
//  * - Edit (modal) / Delete available
//  * - Filter buttons: All (default) | Approved | Pending (with counts for current page)
//  */

// export default function AdminProducts() {
//   const [rawProducts, setRawProducts] = useState([]); // current page results
//   const [products, setProducts] = useState([]); // shown set after filter (from current page)
//   const [counts, setCounts] = useState({ all: 0, approved: 0, pending: 0 });

//   const [q, setQ] = useState("");
//   const [filter, setFilter] = useState("all"); // all | approved | pending

//   const [page, setPage] = useState(1);
//   const perPage = 12; // change as you like
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const searchRef = useRef(null);

//   // modal state for edit form
//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState(null);

//   // compute counts for current fetched page
//   function computeCounts(list = []) {
//     const c = { all: 0, approved: 0, pending: 0 };
//     c.all = Array.isArray(list) ? list.length : 0;
//     for (const p of list) {
//       if (p.isVendorApproved) c.approved += 1;
//       else c.pending += 1;
//     }
//     return c;
//   }

//   // fetch products for current page/search
//   async function fetchProducts() {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = { q: q || undefined, page, perPage };
//       // Server supports page/perPage and returns { products, total, page, perPage }
//       const res = await api.get("/api/admin/products", { params });

//       const list = res.data?.products ?? [];
//       const tot = res.data?.total ?? 0;

//       setRawProducts(list);
//       setTotal(tot);

//       const c = computeCounts(list);
//       setCounts(c);

//       applyFilter(list, filter);
//     } catch (err) {
//       console.error("Fetch admin products error:", err.response?.data || err.message);
//       setRawProducts([]);
//       setProducts([]);
//       setCounts({ all: 0, approved: 0, pending: 0 });
//       setTotal(0);
//       setError(err.response?.data?.message || err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // apply current filter to a list (client-side)
//   function applyFilter(list, f) {
//     if (!Array.isArray(list)) return setProducts([]);
//     if (f === "approved") setProducts(list.filter((p) => p.isVendorApproved));
//     else if (f === "pending") setProducts(list.filter((p) => !p.isVendorApproved));
//     else setProducts(list);
//   }

//   // debounce search & reset page on new search
//   useEffect(() => {
//     setPage(1);
//     const t = setTimeout(() => {
//       fetchProducts();
//     }, 250);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q]);

//   // fetch when page changes
//   useEffect(() => {
//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page]);

//   useEffect(() => {
//     applyFilter(rawProducts, filter);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filter, rawProducts]);

//   // actions
//   async function handleDelete(p) {
//     if (!confirm(`Delete "${p.title}"?`)) return;
//     try {
//       await api.delete(`/api/admin/products/${p._id}`);
//       // remove locally from current page
//       setRawProducts((prev) => prev.filter((x) => x._id !== p._id));
//       setProducts((prev) => prev.filter((x) => x._id !== p._id));
//       // optionally refetch to refresh total
//       fetchProducts();
//     } catch (err) {
//       console.error("Delete error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   }

//   async function handleApprove(p, approved) {
//     try {
//       const res = await api.patch(`/api/admin/products/${p._id}/approve`, { approved });
//       const updated = res.data?.product;
//       if (updated) {
//         setRawProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
//       } else {
//         await fetchProducts();
//       }
//     } catch (err) {
//       console.error("Approval error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Approval failed");
//     }
//   }

//   // open edit modal
//   function openEdit(p) {
//     setEditing(p);
//     setFormOpen(true);
//   }

//   // handle saved from modal - update local lists
//   function handleSaved(savedData) {
//     const product = savedData?.product || savedData?.data || savedData;
//     if (!product) {
//       fetchProducts();
//       return;
//     }
//     const id = product._id || product.id;
//     setRawProducts((prev) => prev.map((p) => (String(p._id || p.id) === String(id) ? product : p)));
//     setProducts((prev) => prev.map((p) => (String(p._id || p.id) === String(id) ? product : p)));
//   }

//   // replaced inline prompt edit with modal open
//   async function handleEdit(p) {
//     openEdit(p);
//   }

//   // pagination helpers
//   const canPrev = page > 1;
//   const canNext = page * perPage < total;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">Products</h2>

//         <div className="flex items-center gap-3">
//           <input
//             ref={searchRef}
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search products by title/brand/sku..."
//             className="border rounded p-2 w-72"
//           />
//           <button onClick={() => fetchProducts()} className="px-4 py-2 rounded bg-blue-600 text-white">Refresh</button>
//         </div>
//       </div>

//       {/* Filter segmented buttons */}
//       <div className="mb-4 flex gap-3 items-center flex-wrap">
//         <button
//           onClick={() => setFilter("all")}
//           className={`px-4 py-2 rounded-md border ${filter === "all" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           All ({counts.all})
//         </button>

//         <button
//           onClick={() => setFilter("approved")}
//           className={`px-4 py-2 rounded-md border ${filter === "approved" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           Approved ({counts.approved})
//         </button>

//         <button
//           onClick={() => setFilter("pending")}
//           className={`px-4 py-2 rounded-md border ${filter === "pending" ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-gray-800 border-gray-300"}`}
//         >
//           Pending ({counts.pending})
//         </button>
//       </div>

//       {/* Page info */}
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-600">Showing {products.length} of {total}</div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => canPrev && setPage((s) => Math.max(1, s - 1))} disabled={!canPrev} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
//           <div className="px-3 py-1 border rounded">Page {page}</div>
//           <button onClick={() => canNext && setPage((s) => s + 1)} disabled={!canNext} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="p-4">Loading products…</div>
//       ) : error ? (
//         <div className="p-4 text-red-600">Error: {error}</div>
//       ) : products.length === 0 ? (
//         <div className="p-4 text-gray-600">No products found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((p) => (
//             <div key={p._id} className="border rounded-lg p-4 shadow bg-white flex flex-col">
//               <div className="w-full h-56 mb-3 overflow-hidden rounded-md bg-gray-50 p-3 flex items-center justify-center">
//                 <img
//                   src={p.image || p.images?.[0] || "/assets/placeholder.png"}
//                   alt={p.title}
//                   className="max-h-full max-w-full object-contain object-center"
//                 />
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-semibold text-lg">{p.title || "Untitled"}</h3>
//                 <p className="text-sm text-gray-700 mt-1">₹{p.price ?? "N/A"}</p>
//                 {p.brand && <div className="text-xs text-gray-500 mt-1">{p.brand}</div>}
//                 <div className="text-xs text-gray-500 mt-1">Stock: {p.stock ?? 0}</div>

//                 <div className={`mt-2 text-xs font-medium ${p.isVendorApproved ? "text-green-600" : "text-orange-600"}`}>
//                   {p.isVendorApproved ? "Approved" : "Pending approval"}
//                 </div>
//               </div>

//               <div className="mt-4 flex gap-2">
//                 <button
//                   onClick={() => handleEdit(p)}
//                   className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(p)}
//                   className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
//                 >
//                   Delete
//                 </button>

//                 {!p.isVendorApproved && (
//                   <>
//                     <button
//                       onClick={() => handleApprove(p, true)}
//                       className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//                     >
//                       Approve
//                     </button>

//                     <button
//                       onClick={() => handleApprove(p, false)}
//                       className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Edit modal */}
//       <AdminProductForm
//         open={formOpen}
//         onClose={() => setFormOpen(false)}
//         onSaved={handleSaved}
//         initial={editing || {}}
//         api={api}
//       />
//     </div>
//   );
// }








// **********************************************************************************


// admin/src/pages/AdminProducts.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import AdminProductForm from "../components/AdminProductForm";

/**
 * Admin Products page with server-side pagination
 * - Grid like vendor UI
 * - No "Add Product"
 * - Approve / Reject for pending vendor products
 * - Edit (modal) / Delete available
 * - Filter buttons: All (default) | Approved | Pending (with global counts)
 */

export default function AdminProducts() {
  const [rawProducts, setRawProducts] = useState([]); // current page results
  const [products, setProducts] = useState([]); // shown set after filter (from current page)

  // counts for current page (keeps page info) and globalCounts for the badges
  const [counts, setCounts] = useState({ all: 0, approved: 0, pending: 0 });
  const [globalCounts, setGlobalCounts] = useState({ all: 0, approved: 0, pending: 0 });

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all | approved | pending

  const [page, setPage] = useState(1);
  const perPage = 12; // change as you like
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // modal state for edit form
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // compute counts for current fetched page
  function computeCounts(list = []) {
    const c = { all: 0, approved: 0, pending: 0 };
    c.all = Array.isArray(list) ? list.length : 0;
    for (const p of list) {
      if (p.isVendorApproved) c.approved += 1;
      else c.pending += 1;
    }
    return c;
  }

  // fetch global counts (All / Approved / Pending)
  async function fetchCounts() {
    try {
      const res = await api.get("/api/admin/products/counts");
      const data = res.data || {};
      setGlobalCounts({
        all: Number(data.all || 0),
        approved: Number(data.approved || 0),
        pending: Number(data.pending || 0),
      });
    } catch (err) {
      console.error("Failed to fetch global counts:", err.response?.data || err.message);
      // don't block UI on counts failure
    }
  }

  // fetch products for current page/search
  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const params = { q: q || undefined, page, perPage };
      // Server supports page/perPage and returns { products, total, page, perPage }
      const res = await api.get("/api/admin/products", { params });

      const list = res.data?.products ?? [];
      const tot = res.data?.total ?? 0;

      setRawProducts(list);
      setTotal(tot);

      const c = computeCounts(list);
      setCounts(c);

      applyFilter(list, filter);
    } catch (err) {
      console.error("Fetch admin products error:", err.response?.data || err.message);
      setRawProducts([]);
      setProducts([]);
      setCounts({ all: 0, approved: 0, pending: 0 });
      setTotal(0);
      setError(err.response?.data?.message || err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  // apply current filter to a list (client-side)
  function applyFilter(list, f) {
    if (!Array.isArray(list)) return setProducts([]);
    if (f === "approved") setProducts(list.filter((p) => p.isVendorApproved));
    else if (f === "pending") setProducts(list.filter((p) => !p.isVendorApproved));
    else setProducts(list);
  }

  // debounce search & reset page on new search
  useEffect(() => {
    setPage(1);
    const t = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // fetch when page changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // fetch counts once on mount
  useEffect(() => {
    fetchCounts();
    // also initial fetch of products
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilter(rawProducts, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, rawProducts]);

  // actions
  async function handleDelete(p) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await api.delete(`/api/admin/products/${p._id}`);
      // remove locally from current page
      setRawProducts((prev) => prev.filter((x) => x._id !== p._id));
      setProducts((prev) => prev.filter((x) => x._id !== p._id));
      // refresh total and global counts
      await fetchProducts();
      await fetchCounts();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  async function handleApprove(p, approved) {
    try {
      const res = await api.patch(`/api/admin/products/${p._id}/approve`, { approved });
      const updated = res.data?.product;
      if (updated) {
        setRawProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
        // update products shown as well
        setProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      } else {
        await fetchProducts();
      }
      // refresh global counts
      await fetchCounts();
    } catch (err) {
      console.error("Approval error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Approval failed");
    }
  }

  // open edit modal
  function openEdit(p) {
    setEditing(p);
    setFormOpen(true);
  }

  // handle saved from modal - update local lists & refresh counts
  function handleSaved(savedData) {
    const product = savedData?.product || savedData?.data || savedData;
    if (!product) {
      fetchProducts();
      fetchCounts();
      return;
    }
    const id = product._id || product.id;
    setRawProducts((prev) => prev.map((p) => (String(p._id || p.id) === String(id) ? product : p)));
    setProducts((prev) => prev.map((p) => (String(p._id || p.id) === String(id) ? product : p)));
    // update global counts (if the saved product changed approval flag)
    fetchCounts();
  }

  // replaced inline prompt edit with modal open
  function handleEdit(p) {
    openEdit(p);
  }

  // pagination helpers
  const canPrev = page > 1;
  const canNext = page * perPage < total;

  // modal state for edit form (declared after functions for clarity)
  // const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Products</h2>

        <div className="flex items-center gap-3">
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products by title/brand/sku..."
            className="border rounded p-2 w-72"
          />
          <button onClick={() => { fetchProducts(); fetchCounts(); }} className="px-4 py-2 rounded bg-blue-600 text-white">Refresh</button>
        </div>
      </div>

      {/* Filter segmented buttons (use globalCounts for badges) */}
      <div className="mb-4 flex gap-3 items-center flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md border ${filter === "all" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-gray-300"}`}
        >
          All ({globalCounts.all})
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-md border ${filter === "approved" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-gray-300"}`}
        >
          Approved ({globalCounts.approved})
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-md border ${filter === "pending" ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-gray-800 border-gray-300"}`}
        >
          Pending ({globalCounts.pending})
        </button>
      </div>

      {/* Page info */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {products.length} of {total}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => canPrev && setPage((s) => Math.max(1, s - 1))} disabled={!canPrev} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <div className="px-3 py-1 border rounded">Page {page}</div>
          <button onClick={() => canNext && setPage((s) => s + 1)} disabled={!canNext} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      {loading ? (
        <div className="p-4">Loading products…</div>
      ) : error ? (
        <div className="p-4 text-red-600">Error: {error}</div>
      ) : products.length === 0 ? (
        <div className="p-4 text-gray-600">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded-lg p-4 shadow bg-white flex flex-col">
              <div className="w-full h-56 mb-3 overflow-hidden rounded-md bg-gray-50 p-3 flex items-center justify-center">
                <img
                  src={p.image || p.images?.[0] || "/assets/placeholder.png"}
                  alt={p.title}
                  className="max-h-full max-w-full object-contain object-center"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{p.title || "Untitled"}</h3>
                <p className="text-sm text-gray-700 mt-1">₹{p.price ?? "N/A"}</p>
                {p.brand && <div className="text-xs text-gray-500 mt-1">{p.brand}</div>}
                <div className="text-xs text-gray-500 mt-1">Stock: {p.stock ?? 0}</div>

                <div className={`mt-2 text-xs font-medium ${p.isVendorApproved ? "text-green-600" : "text-orange-600"}`}>
                  {p.isVendorApproved ? "Approved" : "Pending approval"}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p)}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Delete
                </button>

                {!p.isVendorApproved && (
                  <>
                    <button
                      onClick={() => handleApprove(p, true)}
                      className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleApprove(p, false)}
                      className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <AdminProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        initial={editing || {}}
        api={api}
      />
    </div>
  );
}
