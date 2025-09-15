// // src/vendor/Orders.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     axios.get("/api/vendor/orders", { withCredentials: true })
//       .then(res => setOrders(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Orders</h2>
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2">Order ID</th>
//             <th className="p-2">Customer</th>
//             <th className="p-2">Items</th>
//             <th className="p-2">Total</th>
//             <th className="p-2">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(order => (
//             <tr key={order._id} className="border-t">
//               <td className="p-2">{order._id}</td>
//               <td className="p-2">{order.customer?.name}</td>
//               <td className="p-2">
//                 {order.items.map(i => (
//                   <div key={i._id}>
//                     {i.title} (x{i.quantity}) – ₹{i.price}
//                   </div>
//                 ))}
//               </td>
//               <td className="p-2">₹{order.totalAmount}</td>
//               <td className="p-2">{order.items[0]?.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Orders;


// *************************************************


// src/vendor/Orders.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Orders = () => {
//   const [orders, setOrders] = useState([]); // always an array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchOrders() {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("vendor_token");
//         console.log("vendor_token present?", !!token);

//         const res = await axios.get("/api/vendor/orders", {
//           // If your frontend dev server does not proxy /api to backend,
//           // replace "/api/vendor/orders" with "http://localhost:5000/api/vendor/orders"
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//         });

//         console.log("Orders API response (res.data):", res.data);

//         // Normalize into array
//         if (Array.isArray(res.data)) {
//           setOrders(res.data);
//         } else if (Array.isArray(res.data.orders)) {
//           setOrders(res.data.orders);
//         } else if (Array.isArray(res.data.data)) {
//           setOrders(res.data.data);
//         } else {
//           // Unexpected shape (maybe { message: "Unauthorized" } or { ok:false })
//           setOrders([]);
//           setError("Unexpected response from server — see console for details.");
//           console.warn("Unexpected orders response:", res.data);
//         }
//       } catch (err) {
//         // Show helpful error message
//         console.error("Orders API error:", err.response?.data || err.message);
//         setOrders([]);
//         setError(err.response?.data?.message || err.message || "Network error");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, []);

//   if (loading) return <div className="p-4">Loading orders…</div>;
//   if (error)
//     return (
//       <div className="p-4 text-red-600">
//         Error loading orders: {error}
//         <div className="text-sm text-gray-500 mt-2">Open browser console → Network to inspect response.</div>
//       </div>
//     );

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Orders</h2>

//       {orders.length === 0 ? (
//         <div className="p-4 text-gray-600">No orders found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 text-left">Order ID</th>
//                 <th className="p-2 text-left">Customer</th>
//                 <th className="p-2 text-left">Items</th>
//                 <th className="p-2 text-left">Total</th>
//                 <th className="p-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id || order.id} className="border-t">
//                   <td className="p-2 align-top">{order._id || order.id}</td>
//                   <td className="p-2 align-top">{order.customer?.name || order.customer?.email || "N/A"}</td>
//                   <td className="p-2">
//                     {Array.isArray(order.items) && order.items.length > 0 ? (
//                       order.items.map((i) => (
//                         <div key={i._id || i.id} className="mb-1">
//                           <div className="font-medium">{i.title || i.name || "Item"}</div>
//                           <div className="text-sm text-gray-600">
//                             Qty: {i.quantity ?? 1} • ₹{i.price ?? "N/A"}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm text-gray-500">No items</div>
//                     )}
//                   </td>
//                   <td className="p-2 align-top">₹{order.totalAmount ?? order.total ?? "N/A"}</td>
//                   <td className="p-2 align-top">
//                     {/* show per-item status if vendor wants; otherwise show overall payment/status */}
//                     {order.items?.[0]?.status || order.status || order.paymentStatus || "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;



// ****************************************************************************

// src/vendor/Orders.jsx
// import React, { useEffect, useState } from "react";
// import api from "../utils/api";

// const Orders = () => {
//   const [orders, setOrders] = useState([]); // always array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     async function load() {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await api.get("/api/vendor/orders");
//         console.log("Orders API res.data:", res.data);

//         if (Array.isArray(res.data)) {
//           if (mounted) setOrders(res.data);
//         } else if (Array.isArray(res.data.orders)) {
//           if (mounted) setOrders(res.data.orders);
//         } else if (Array.isArray(res.data.data)) {
//           if (mounted) setOrders(res.data.data);
//         } else {
//           if (mounted) setOrders([]);
//           setError("Unexpected response from server. See console/network tab.");
//           console.warn("Unexpected orders response:", res.data);
//         }
//       } catch (err) {
//         console.error("Orders fetch error:", err.response?.data || err.message);
//         if (mounted) setOrders([]);
//         setError(err.response?.data?.message || err.message || "Network error");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (loading) return <div className="p-4">Loading orders…</div>;
//   if (error)
//     return (
//       <div className="p-4 text-red-600">
//         Error loading orders: {error}
//         <div className="text-sm text-gray-500 mt-2">Open browser console / network tab to inspect.</div>
//       </div>
//     );

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Orders</h2>

//       {orders.length === 0 ? (
//         <div className="p-4 text-gray-600">No orders found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 text-left">Order ID</th>
//                 <th className="p-2 text-left">Customer</th>
//                 <th className="p-2 text-left">Items</th>
//                 <th className="p-2 text-left">Total</th>
//                 <th className="p-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id || order.id} className="border-t align-top">
//                   <td className="p-2 align-top">{order._id || order.id}</td>
//                   <td className="p-2 align-top">{order.customer?.name || order.customer?.email || "N/A"}</td>
//                   <td className="p-2">
//                     {Array.isArray(order.items) && order.items.length > 0 ? (
//                       order.items.map((i) => (
//                         <div key={i._id || i.id} className="mb-1">
//                           <div className="font-medium">{i.title || i.name || "Item"}</div>
//                           <div className="text-sm text-gray-600">
//                             Qty: {i.quantity ?? 1} • ₹{i.price ?? "N/A"}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm text-gray-500">No items</div>
//                     )}
//                   </td>
//                   <td className="p-2 align-top">₹{order.totalAmount ?? order.total ?? "N/A"}</td>
//                   <td className="p-2 align-top">
//                     {order.items?.[0]?.status || order.status || order.paymentStatus || "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;




// ********************************************************************************


// src/vendor/Orders.jsx
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";

// const STATUS_OPTIONS = ["placed", "processing", "shipped", "delivered", "cancelled"];

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI state
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("date");
//   const [dir, setDir] = useState("desc");
//   const searchRef = useRef(null);

//   async function fetchOrders() {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get("/api/vendor/orders", {
//         params: { search, sort, dir },
//       });
//       if (Array.isArray(res.data)) {
//         setOrders(res.data);
//       } else if (Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error("Orders fetch error:", err.response?.data || err.message);
//       setOrders([]);
//       setError(err.response?.data?.message || err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//  useEffect(() => {
//   const t = setTimeout(() => {
//     fetchOrders();
//   }, 300); // wait 300ms after last change

//   return () => clearTimeout(t); // cleanup on re-render/unmount
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [search, sort, dir]);


//   const updateItemStatus = async (orderId, itemId, newStatus) => {
//     const backup = JSON.parse(JSON.stringify(orders));
//     // optimistic update
//     setOrders((prev) =>
//       prev.map((o) =>
//         o._id === orderId
//           ? { ...o, items: o.items.map((i) => (i._id === itemId ? { ...i, status: newStatus } : i)) }
//           : o
//       )
//     );

//     try {
//       const res = await api.patch(`/api/vendor/orders/${orderId}/items/${itemId}/status`, {
//         status: newStatus,
//       });
//       if (res.data?.order) {
//         // replace updated order
//         setOrders((prev) =>
//           prev.map((o) => (o._id === res.data.order._id ? res.data.order : o))
//         );
//       }
//     } catch (err) {
//       console.error("Status update failed:", err.response?.data || err.message);
//       alert("Failed to update status");
//       setOrders(backup); // rollback
//     }
//   };

//   if (loading) return <div className="p-4">Loading orders…</div>;
//   if (error)
//     return (
//       <div className="p-4 text-red-600">
//         Error loading orders: {error}
//       </div>
//     );

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Orders</h2>

//       {/* Controls */}
//       <div className="flex gap-3 mb-4 items-center">
//         <input
//           ref={searchRef}
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search order ID or customer name"
//           className="border p-2 rounded w-80"
//         />
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="date">Date</option>
//           <option value="customer">Customer</option>
//           <option value="status">Status</option>
//         </select>
//         <select
//           value={dir}
//           onChange={(e) => setDir(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="desc">Desc</option>
//           <option value="asc">Asc</option>
//         </select>
//         <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded">
//           Refresh
//         </button>
//       </div>

//       {orders.length === 0 ? (
//         <div className="p-4 text-gray-600">No orders found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 text-left">Order ID</th>
//                 <th className="p-2 text-left">Customer</th>
//                 <th className="p-2 text-left">Items</th>
//                 <th className="p-2 text-left">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="border-t align-top">
//                   <td className="p-2 align-top">
//                     <div>{order._id}</div>
//                     <div className="text-xs text-gray-500">
//                       {new Date(order.createdAt).toLocaleString()}
//                     </div>
//                   </td>
//                   <td className="p-2 align-top">
//                     {order.customer?.name || order.customer?.email || "N/A"}
//                   </td>
//                   <td className="p-2">
//                     {order.items?.map((i) => (
//                       <div
//                         key={i._id}
//                         className="flex items-center gap-3 mb-2 border-b pb-2"
//                       >
//                         <img
//                           src={i.image || "/placeholder.png"}
//                           alt={i.title}
//                           className="w-16 h-16 object-cover rounded border"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                         <div className="flex-1">
//                           <div className="font-medium">{i.title}</div>
//                           <div className="text-sm text-gray-600">
//                             Qty: {i.quantity} • ₹{i.price}
//                           </div>
//                         </div>
//                         {/* Status dropdown */}
//                         <select
//                           value={i.status}
//                           onChange={(e) =>
//                             updateItemStatus(order._id, i._id, e.target.value)
//                           }
//                           className="border p-1 rounded"
//                         >
//                           {STATUS_OPTIONS.map((s) => (
//                             <option key={s} value={s}>
//                               {s}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     ))}
//                   </td>
//                   <td className="p-2 align-top">
//                     ₹{order.totalAmount ?? "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;



// ******************************************************************


// src/vendor/Orders.jsx
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";

// const STATUS_OPTIONS = ["placed", "processing", "shipped",  "cancelled"];

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI controls
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("date");
//   const [dir, setDir] = useState("desc");
//   const searchRef = useRef(null);

//   // map of itemId -> boolean for update-in-progress
//   const [updatingMap, setUpdatingMap] = useState({});

//   // fetch orders from server
//   async function fetchOrders() {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get("/api/vendor/orders", {
//         params: { search, sort, dir },
//       });

//       // server may respond with different shapes; handle common ones
//       if (Array.isArray(res.data)) {
//         setOrders(res.data);
//       } else if (Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       } else if (Array.isArray(res.data.data)) {
//         setOrders(res.data.data);
//       } else {
//         setOrders([]);
//         console.warn("Unexpected orders response shape:", res.data);
//       }
//     } catch (err) {
//       console.error("Orders fetch error:", err.response?.data || err.message);
//       setOrders([]);
//       setError(err.response?.data?.message || err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // debounce fetch when search/sort/dir change
//   useEffect(() => {
//     const t = setTimeout(() => {
//       fetchOrders();
//     }, 300);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, sort, dir]);

//   // initial load
//   useEffect(() => {
//     fetchOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // update the status for a single item (optimistic with rollback)
//   const updateItemStatus = async (orderId, itemId, newStatus) => {
//     // mark this item as updating
//     setUpdatingMap((m) => ({ ...m, [itemId]: true }));

//     const backup = JSON.parse(JSON.stringify(orders));

//     // optimistic UI update
//     setOrders((prev) =>
//       prev.map((o) =>
//         o._id === orderId
//           ? { ...o, items: o.items.map((i) => (i._id === itemId ? { ...i, status: newStatus } : i)) }
//           : o
//       )
//     );

//     try {
//       const res = await api.patch(`/api/vendor/orders/${orderId}/items/${itemId}/status`, {
//         status: newStatus,
//       });

//       if (res.data?.order) {
//         // replace the updated order returned by server
//         setOrders((prev) => prev.map((o) => (o._id === res.data.order._id ? res.data.order : o)));
//         // success feedback (replace with your toast if you have one)
//         console.log("Status updated");
//       } else {
//         // if server did not return order, re-fetch to be safe
//         await fetchOrders();
//       }
//     } catch (err) {
//       console.error("Status update failed:", err.response?.data || err.message);
//       // rollback
//       setOrders(backup);
//       // user feedback (replace with toast if available)
//       alert("Failed to update status: " + (err.response?.data?.message || err.message));
//     } finally {
//       // clear updating flag
//       setUpdatingMap((m) => {
//         const copy = { ...m };
//         delete copy[itemId];
//         return copy;
//       });
//     }
//   };

//   if (loading) return <div className="p-4">Loading orders…</div>;
//   if (error)
//     return (
//       <div className="p-4 text-red-600">
//         Error loading orders: {error}
//         <div className="text-sm text-gray-500 mt-2">Open browser console / network tab to inspect.</div>
//       </div>
//     );

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Orders</h2>

//       {/* Controls */}
//       <div className="flex gap-3 mb-4 items-center">
//         <input
//           ref={searchRef}
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search order ID or customer name"
//           className="border p-2 rounded w-80"
//         />
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="date">Date</option>
//           <option value="customer">Customer</option>
//           <option value="status">Status</option>
//         </select>
//         <select
//           value={dir}
//           onChange={(e) => setDir(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="desc">Desc</option>
//           <option value="asc">Asc</option>
//         </select>
//         <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded">
//           Refresh
//         </button>
//       </div>

//       {orders.length === 0 ? (
//         <div className="p-4 text-gray-600">No orders found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 text-left">Order ID</th>
//                 <th className="p-2 text-left">Customer</th>
//                 <th className="p-2 text-left">Items</th>
//                 <th className="p-2 text-left">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="border-t align-top">
//                   <td className="p-2 align-top">
//                     <div className="break-all">{order._id}</div>
//                     <div className="text-xs text-gray-500">
//                       {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
//                     </div>
//                   </td>

//                   <td className="p-2 align-top">
//                     {order.customer?.name || order.customer?.email || "N/A"}
//                   </td>

//                   <td className="p-2">
//                     {Array.isArray(order.items) && order.items.length > 0 ? (
//                       order.items.map((i) => (
//                         <div key={i._id} className="flex items-center gap-3 mb-2 border-b pb-2">
//                           <img
//                             src={i.image || "/placeholder.png"}
//                             alt={i.title || "item"}
//                             className="w-16 h-16 object-cover rounded border"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = "/placeholder.png";
//                             }}
//                           />
//                           <div className="flex-1">
//                             <div className="font-medium">{i.title || i.name || "Item"}</div>
//                             <div className="text-sm text-gray-600">
//                               Qty: {i.quantity ?? 1} • ₹{i.price ?? "N/A"}
//                             </div>
//                             {/* Optional: show last history entry */}
//                             {Array.isArray(i.history) && i.history.length > 0 && (
//                               <div className="text-xs text-gray-500 mt-1">
//                                 Last: {i.history[i.history.length - 1].status} •{" "}
//                                 {new Date(i.history[i.history.length - 1].changedAt).toLocaleString()}
//                               </div>
//                             )}
//                           </div>

//                           {/* Status dropdown + saving indicator */}
//                           <div style={{ minWidth: 150 }}>
//                             <select
//                               value={i.status}
//                               onChange={(e) => updateItemStatus(order._id, i._id, e.target.value)}
//                               className="border p-1 rounded w-full"
//                               disabled={!!updatingMap[i._id]}
//                             >
//                               {STATUS_OPTIONS.map((s) => (
//                                 <option key={s} value={s}>
//                                   {s}
//                                 </option>
//                               ))}
//                             </select>

//                             {updatingMap[i._id] && (
//                               <div className="text-xs text-gray-500 mt-1">saving…</div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm text-gray-500">No items</div>
//                     )}
//                   </td>

//                   <td className="p-2 align-top">₹{order.totalAmount ?? "N/A"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;





// ********************* Vendor status restrictions ******************************************


// src/vendor/Orders.jsx
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";

// // full status set (for clarity)
// const ALL_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

// // vendor policy for next transitions (must match server)
// const vendorAllowedTransitions = {
//   placed: ["processing", "cancelled"],
//   processing: ["shipped", "cancelled"],
//   shipped: ["cancelled"],
//   delivered: [],
//   cancelled: [],
// };

// // helper: include current status first so the select shows current
// function availableForVendor(currentStatus) {
//   const next = vendorAllowedTransitions[currentStatus] || [];
//   return [currentStatus, ...next.filter((s) => s !== currentStatus)];
// }

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI controls
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("date");
//   const [dir, setDir] = useState("desc");
//   const searchRef = useRef(null);
//   const [updatingMap, setUpdatingMap] = useState({});

//   async function fetchOrders() {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get("/api/vendor/orders", {
//         params: { search, sort, dir },
//       });

//       if (Array.isArray(res.data)) setOrders(res.data);
//       else if (Array.isArray(res.data.orders)) setOrders(res.data.orders);
//       else setOrders([]);
//     } catch (err) {
//       console.error("Orders fetch error:", err.response?.data || err.message);
//       setOrders([]);
//       setError(err.response?.data?.message || err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     const t = setTimeout(fetchOrders, 300);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, sort, dir]);

//   useEffect(() => {
//     fetchOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const updateItemStatus = async (orderId, itemId, newStatus) => {
//     setUpdatingMap((m) => ({ ...m, [itemId]: true }));
//     const backup = JSON.parse(JSON.stringify(orders));

//     // optimistic
//     setOrders((prev) =>
//       prev.map((o) =>
//         o._id === orderId
//           ? { ...o, items: o.items.map((i) => (i._id === itemId ? { ...i, status: newStatus } : i)) }
//           : o
//       )
//     );

//     try {
//       const res = await api.patch(`/api/vendor/orders/${orderId}/items/${itemId}/status`, {
//         status: newStatus,
//       });

//       if (res.data?.order) {
//         setOrders((prev) => prev.map((o) => (o._id === res.data.order._id ? res.data.order : o)));
//       } else {
//         await fetchOrders();
//       }

//       // optional: if server returned a warning about missing item.vendor, you can log it
//       if (res.data?.warning) console.warn("Vendor API warning:", res.data.warning);
//     } catch (err) {
//       console.error("Status update failed:", err.response?.data || err.message);
//       alert("Failed to update status: " + (err.response?.data?.message || err.message));
//       setOrders(backup);
//     } finally {
//       setUpdatingMap((m) => {
//         const c = { ...m };
//         delete c[itemId];
//         return c;
//       });
//     }
//   };

//   if (loading) return <div className="p-4">Loading orders…</div>;
//   if (error)
//     return (
//       <div className="p-4 text-red-600">
//         Error loading orders: {error}
//         <div className="text-sm text-gray-500 mt-2">Open browser console / network tab to inspect.</div>
//       </div>
//     );

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Orders</h2>

//       <div className="flex gap-3 mb-4 items-center">
//         <input
//           ref={searchRef}
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search order ID or customer name"
//           className="border p-2 rounded w-80"
//         />
//         <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
//           <option value="date">Date</option>
//           <option value="customer">Customer</option>
//           <option value="status">Status</option>
//         </select>
//         <select value={dir} onChange={(e) => setDir(e.target.value)} className="border p-2 rounded">
//           <option value="desc">Desc</option>
//           <option value="asc">Asc</option>
//         </select>
//         <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded">
//           Refresh
//         </button>
//       </div>

//       {orders.length === 0 ? (
//         <div className="p-4 text-gray-600">No orders found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 text-left">Order ID</th>
//                 <th className="p-2 text-left">Customer</th>
//                 <th className="p-2 text-left">Items</th>
//                 <th className="p-2 text-left">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="border-t align-top">
//                   <td className="p-2 align-top">
//                     <div className="break-all">{order._id}</div>
//                     <div className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</div>
//                   </td>

//                   <td className="p-2 align-top">{order.customer?.name || order.customer?.email || "N/A"}</td>

//                   <td className="p-2">
//                     {Array.isArray(order.items) && order.items.length > 0 ? (
//                       order.items.map((i) => (
//                         <div key={i._id} className="flex items-center gap-3 mb-2 border-b pb-2">
//                           <img
//                             src={i.image || "/placeholder.png"}
//                             alt={i.title || "item"}
//                             className="w-16 h-16 object-cover rounded border"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = "/placeholder.png";
//                             }}
//                           />
//                           <div className="flex-1">
//                             <div className="font-medium">{i.title || i.name || "Item"}</div>
//                             <div className="text-sm text-gray-600">Qty: {i.quantity ?? 1} • ₹{i.price ?? "N/A"}</div>

//                             {Array.isArray(i.history) && i.history.length > 0 && (
//                               <div className="text-xs text-gray-500 mt-1">
//                                 Last: {i.history[i.history.length - 1].status} •{" "}
//                                 {new Date(i.history[i.history.length - 1].changedAt).toLocaleString()}
//                               </div>
//                             )}
//                           </div>

//                           <div style={{ minWidth: 150 }}>
//                             <select
//                               value={i.status}
//                               onChange={(e) => updateItemStatus(order._id, i._id, e.target.value)}
//                               className="border p-1 rounded w-full"
//                               disabled={!!updatingMap[i._id]}
//                             >
//                               {availableForVendor(i.status).map((s) => (
//                                 <option key={s} value={s}>
//                                   {s}
//                                 </option>
//                               ))}
//                             </select>

//                             {updatingMap[i._id] && <div className="text-xs text-gray-500 mt-1">saving…</div>}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm text-gray-500">No items</div>
//                     )}
//                   </td>

//                   <td className="p-2 align-top">₹{order.totalAmount ?? "N/A"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;




// *******************************************************************************


// src/vendor/Orders.jsx
// src/vendor/Orders.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";

// statuses shown in the vendor status filter (per your request)
const VENDOR_STATUSES = ["placed", "processing", "shipped", "cancelled"];

// vendor policy for next transitions (must match server)
const vendorAllowedTransitions = {
  placed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["cancelled"],
  delivered: [],
  cancelled: [],
};

// helper: include current status first so the select shows current
function availableForVendor(currentStatus) {
  const next = vendorAllowedTransitions[currentStatus] || [];
  return [currentStatus, ...next.filter((s) => s !== currentStatus)];
}

const Orders = () => {
  const [rawOrders, setRawOrders] = useState([]); // full fetched set
  const [orders, setOrders] = useState([]); // filtered list shown in table
  const [counts, setCounts] = useState({ all: 0, placed: 0, processing: 0, shipped: 0, cancelled: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI controls
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [dir, setDir] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all"); // selected status button
  const searchRef = useRef(null);
  const [updatingMap, setUpdatingMap] = useState({});

  // compute order counts by status.
  // We treat an order as belonging to a status bucket if ANY of its items has that status.
  function computeCounts(fetched) {
    const c = { all: 0, placed: 0, processing: 0, shipped: 0, cancelled: 0 };
    c.all = Array.isArray(fetched) ? fetched.length : 0;

    if (Array.isArray(fetched)) {
      for (const o of fetched) {
        if (!Array.isArray(o.items)) continue;
        const seen = new Set();
        for (const it of o.items) {
          const s = it.status;
          if (!s) continue;
          if (VENDOR_STATUSES.includes(s) && !seen.has(s)) {
            c[s] += 1;
            seen.add(s);
          }
        }
        // note: an order with multiple different-status items increments multiple buckets
      }
    }

    return c;
  }

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      // For counts we prefer to fetch entire set (server-side status filter optional)
      const params = { search, sort, dir };
      // If the server supports status filtering and you want to fetch only that status,
      // uncomment the next lines. Currently we fetch all and filter client-side so counts work.
      // if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await api.get("/api/vendor/orders", { params });

      let fetched = [];
      if (Array.isArray(res.data)) fetched = res.data;
      else if (Array.isArray(res.data.orders)) fetched = res.data.orders;
      else fetched = [];

      setRawOrders(fetched);

      const newCounts = computeCounts(fetched);
      setCounts(newCounts);

      // apply client-side filtering based on selected status
      if (statusFilter && statusFilter !== "all") {
        const filtered = fetched.filter((o) => Array.isArray(o.items) && o.items.some((it) => it.status === statusFilter));
        setOrders(filtered);
      } else {
        setOrders(fetched);
      }
    } catch (err) {
      console.error("Orders fetch error:", err.response?.data || err.message);
      setRawOrders([]);
      setOrders([]);
      setCounts({ all: 0, placed: 0, processing: 0, shipped: 0, cancelled: 0 });
      setError(err.response?.data?.message || err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  // debounce controls changes
  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, dir, statusFilter]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateItemStatus = async (orderId, itemId, newStatus) => {
    setUpdatingMap((m) => ({ ...m, [itemId]: true }));
    const backupRaw = JSON.parse(JSON.stringify(rawOrders));
    const backupShown = JSON.parse(JSON.stringify(orders));

    // optimistic update in both rawOrders and shown orders
    function optimisticUpdate(list) {
      return list.map((o) =>
        o._id === orderId ? { ...o, items: o.items.map((i) => (i._id === itemId ? { ...i, status: newStatus } : i)) } : o
      );
    }

    setRawOrders((r) => optimisticUpdate(r));
    setOrders((r) => optimisticUpdate(r));

    try {
      const res = await api.patch(`/api/vendor/orders/${orderId}/items/${itemId}/status`, {
        status: newStatus,
      });

      if (res.data?.order) {
        // replace that order in rawOrders and orders (if present)
        setRawOrders((prev) => prev.map((o) => (o._id === res.data.order._id ? res.data.order : o)));
        setOrders((prev) => prev.map((o) => (o._id === res.data.order._id ? res.data.order : o)));
      } else {
        // re-fetch everything to be safe
        await fetchOrders();
      }
      if (res.data?.warning) console.warn("Vendor API warning:", res.data.warning);
    } catch (err) {
      console.error("Status update failed:", err.response?.data || err.message);
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
      // rollback
      setRawOrders(backupRaw);
      setOrders(backupShown);
    } finally {
      // recompute counts from current rawOrders after change
      setCounts((_) => computeCounts(rawOrders));
      setUpdatingMap((m) => {
        const c = { ...m };
        delete c[itemId];
        return c;
      });
    }
  };

  if (loading) return <div className="p-4">Loading orders…</div>;
  if (error)
    return (
      <div className="p-4 text-red-600">
        Error loading orders: {error}
        <div className="text-sm text-gray-500 mt-2">Open browser console / network tab to inspect.</div>
      </div>
    );

  // styling helper for segmented buttons
  const btnBase = "px-4 py-2 rounded-md inline-flex items-center gap-2 border";
  const activeBase = "bg-green-600 text-white border-green-600";
  const inactiveBase = "bg-white text-gray-800 border-gray-300 hover:shadow-sm";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex gap-3 items-center">
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or customer name"
            className="border p-2 rounded w-80"
          />

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
            <option value="date">Date</option>
            <option value="customer">Customer</option>
          </select>

          <select value={dir} onChange={(e) => setDir(e.target.value)} className="border p-2 rounded">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded">
            Refresh
          </button>
        </div>

        {/* Segmented status buttons (like your reference) */}
        <div className="flex gap-3">
          {/* All */}
          <button
            onClick={() => setStatusFilter("all")}
            className={`${btnBase} ${statusFilter === "all" ? activeBase : inactiveBase}`}
            aria-pressed={statusFilter === "all"}
          >
            <span>All</span>
            <span className="ml-2 text-sm font-semibold">({counts.all})</span>
          </button>

          {/* dynamic status buttons */}
          {VENDOR_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`${btnBase} ${statusFilter === s ? activeBase : inactiveBase}`}
              aria-pressed={statusFilter === s}
            >
              <span className="capitalize">{s}</span>
              <span className="ml-2 text-sm font-semibold">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-4 text-gray-600">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Order ID</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Items</th>
                <th className="p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t align-top">
                  <td className="p-2 align-top">
                    <div className="break-all">{order._id}</div>
                    <div className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</div>
                  </td>

                  <td className="p-2 align-top">{order.customer?.name || order.customer?.email || "N/A"}</td>

                  <td className="p-2">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((i) => (
                        <div key={i._id} className="flex items-center gap-3 mb-2 border-b pb-2">
                          <img
                            src={i.image || "/placeholder.png"}
                            alt={i.title || "item"}
                            className="w-16 h-16 object-cover rounded border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{i.title || i.name || "Item"}</div>
                            <div className="text-sm text-gray-600">Qty: {i.quantity ?? 1} • ₹{i.price ?? "N/A"}</div>

                            {Array.isArray(i.history) && i.history.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Last: {i.history[i.history.length - 1].status} •{" "}
                                {new Date(i.history[i.history.length - 1].changedAt).toLocaleString()}
                              </div>
                            )}
                          </div>

                          <div style={{ minWidth: 150 }}>
                            <select
                              value={i.status}
                              onChange={(e) => updateItemStatus(order._id, i._id, e.target.value)}
                              className="border p-1 rounded w-full"
                              disabled={!!updatingMap[i._id]}
                            >
                              {availableForVendor(i.status).map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>

                            {updatingMap[i._id] && <div className="text-xs text-gray-500 mt-1">saving…</div>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No items</div>
                    )}
                  </td>

                  <td className="p-2 align-top">₹{order.totalAmount ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;

