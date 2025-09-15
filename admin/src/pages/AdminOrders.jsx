// admin/src/pages/AdminOrders.jsx
// import React from "react";

// export default function AdminOrders() {
//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">Orders</h1>
//       <div className="bg-white rounded shadow p-6 text-gray-500">Orders admin UI will go here.</div>
//     </div>
//   );
// }



// *************************************************************************************



// // admin/src/pages/AdminOrders.jsx
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";

// // statuses for Admin (includes delivered)
// const ADMIN_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

// function AdminOrders() {
//   const [rawOrders, setRawOrders] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [counts, setCounts] = useState({});

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("date");
//   const [dir, setDir] = useState("desc");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const searchRef = useRef(null);
//   const [updatingMap, setUpdatingMap] = useState({});

//   function computeCounts(fetched) {
//     const c = { all: 0 };
//     ADMIN_STATUSES.forEach((s) => (c[s] = 0));
//     c.all = Array.isArray(fetched) ? fetched.length : 0;

//     if (Array.isArray(fetched)) {
//       for (const o of fetched) {
//         if (!Array.isArray(o.items)) continue;
//         const seen = new Set();
//         for (const it of o.items) {
//           if (ADMIN_STATUSES.includes(it.status) && !seen.has(it.status)) {
//             c[it.status] += 1;
//             seen.add(it.status);
//           }
//         }
//       }
//     }
//     return c;
//   }

//   async function fetchOrders() {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get("/api/admin/orders", { params: { search, sort, dir } });

//       let fetched = [];
//       if (Array.isArray(res.data)) fetched = res.data;
//       else if (Array.isArray(res.data.orders)) fetched = res.data.orders;

//       setRawOrders(fetched);
//       setCounts(computeCounts(fetched));

//       if (statusFilter !== "all") {
//         setOrders(fetched.filter((o) => o.items.some((i) => i.status === statusFilter)));
//       } else {
//         setOrders(fetched);
//       }
//     } catch (err) {
//       console.error("Admin orders fetch error:", err);
//       setError(err.message);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     const t = setTimeout(fetchOrders, 300);
//     return () => clearTimeout(t);
//   }, [search, sort, dir, statusFilter]);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const updateItemStatus = async (orderId, itemId, newStatus) => {
//     setUpdatingMap((m) => ({ ...m, [itemId]: true }));
//     try {
//       const res = await api.patch(`/api/admin/orders/${orderId}/items/${itemId}/status`, { status: newStatus });
//       if (res.data?.order) {
//         setOrders((prev) => prev.map((o) => (o._id === res.data.order._id ? res.data.order : o)));
//       }
//       fetchOrders();
//     } catch (err) {
//       alert("Update failed: " + err.message);
//     } finally {
//       setUpdatingMap((m) => {
//         const c = { ...m };
//         delete c[itemId];
//         return c;
//       });
//     }
//   };

//   const btnBase = "px-4 py-2 rounded-md border";
//   const activeBase = "bg-green-600 text-white border-green-600";
//   const inactiveBase = "bg-white text-gray-800 border-gray-300";

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">Orders</h1>

//       <div className="flex flex-col gap-3 mb-4">
//         <div className="flex gap-3 items-center">
//           <input
//             ref={searchRef}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search order ID or customer name"
//             className="border p-2 rounded w-80"
//           />
//           <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
//             <option value="date">Date</option>
//             <option value="customer">Customer</option>
//           </select>
//           <select value={dir} onChange={(e) => setDir(e.target.value)} className="border p-2 rounded">
//             <option value="desc">Desc</option>
//             <option value="asc">Asc</option>
//           </select>
//           <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded">Refresh</button>
//         </div>

//         {/* Status buttons */}
//         <div className="flex gap-3 flex-wrap">
//           <button
//             onClick={() => setStatusFilter("all")}
//             className={`${btnBase} ${statusFilter === "all" ? activeBase : inactiveBase}`}
//           >
//             All ({counts.all || 0})
//           </button>
//           {ADMIN_STATUSES.map((s) => (
//             <button
//               key={s}
//               onClick={() => setStatusFilter(s)}
//               className={`${btnBase} ${statusFilter === s ? activeBase : inactiveBase}`}
//             >
//               {s} ({counts[s] || 0})
//             </button>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//         <div>Loading…</div>
//       ) : error ? (
//         <div className="text-red-500">Error: {error}</div>
//       ) : orders.length === 0 ? (
//         <div>No orders found.</div>
//       ) : (
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2 text-left">Order ID</th>
//               <th className="p-2 text-left">Customer</th>
//               <th className="p-2 text-left">Items</th>
//               <th className="p-2 text-left">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id} className="border-t">
//                 <td className="p-2">{order._id}</td>
//                 <td className="p-2">{order.customer?.name || order.customer?.email}</td>
//                 <td className="p-2">
//                   {order.items.map((i) => (
//                     <div key={i._id} className="flex items-center gap-3 mb-2 border-b pb-2">
//                       <img src={i.image || "/placeholder.png"} alt="" className="w-16 h-16 object-cover rounded" />
//                       <div className="flex-1">
//                         <div>{i.title}</div>
//                         <div className="text-sm">Qty: {i.quantity} • ₹{i.price}</div>
//                       </div>
//                       <select
//                         value={i.status}
//                         onChange={(e) => updateItemStatus(order._id, i._id, e.target.value)}
//                         disabled={!!updatingMap[i._id]}
//                         className="border p-1 rounded"
//                       >
//                         {ADMIN_STATUSES.map((s) => (
//                           <option key={s} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </div>
//                   ))}
//                 </td>
//                 <td className="p-2">₹{order.totalAmount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default AdminOrders;






// **********************************************



// admin/src/pages/AdminOrders.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api"; // ✅ admin/api with admin_token

// statuses for Admin (includes delivered)
const ADMIN_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const [rawOrders, setRawOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [dir, setDir] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const searchRef = useRef(null);
  const [updatingMap, setUpdatingMap] = useState({});

  // compute counts
  function computeCounts(fetched) {
    const c = { all: 0 };
    ADMIN_STATUSES.forEach((s) => (c[s] = 0));
    c.all = Array.isArray(fetched) ? fetched.length : 0;

    if (Array.isArray(fetched)) {
      for (const o of fetched) {
        if (!Array.isArray(o.items)) continue;
        const seen = new Set();
        for (const it of o.items) {
          if (ADMIN_STATUSES.includes(it.status) && !seen.has(it.status)) {
            c[it.status] += 1;
            seen.add(it.status);
          }
        }
      }
    }
    return c;
  }

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/admin/orders", { params: { search, sort, dir } });

      let fetched = [];
      if (Array.isArray(res.data)) fetched = res.data;
      else if (Array.isArray(res.data.orders)) fetched = res.data.orders;

      setRawOrders(fetched);
      setCounts(computeCounts(fetched));

      if (statusFilter !== "all") {
        setOrders(fetched.filter((o) => o.items.some((i) => i.status === statusFilter)));
      } else {
        setOrders(fetched);
      }
    } catch (err) {
      console.error("Admin orders fetch error:", err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [search, sort, dir, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateItemStatus = async (orderId, itemId, newStatus) => {
    setUpdatingMap((m) => ({ ...m, [itemId]: true }));
    try {
      const res = await api.patch(`/api/admin/orders/${orderId}/items/${itemId}/status`, {
        status: newStatus,
      });
      if (res.data?.order) {
        setOrders((prev) => prev.map((o) => (o._id === res.data.order._id ? res.data.order : o)));
      }
      fetchOrders();
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setUpdatingMap((m) => {
        const c = { ...m };
        delete c[itemId];
        return c;
      });
    }
  };

  const btnBase = "px-4 py-2 rounded-md border";
  const activeBase = "bg-green-600 text-white border-green-600";
  const inactiveBase = "bg-white text-gray-800 border-gray-300";

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

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

        {/* Status buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setStatusFilter("all")}
            className={`${btnBase} ${statusFilter === "all" ? activeBase : inactiveBase}`}
          >
            All ({counts.all || 0})
          </button>
          {ADMIN_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`${btnBase} ${statusFilter === s ? activeBase : inactiveBase}`}
            >
              {s} ({counts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
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
              <tr key={order._id} className="border-t">
                <td className="p-2 align-top">
                  <div className="break-all">{order._id}</div>
                  <div className="text-xs text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                  </div>
                </td>
                <td className="p-2 align-top">
                  {order.customer?.name || order.customer?.email || "N/A"}
                </td>
                <td className="p-2">
                  {order.items.map((i) => (
                    <div key={i._id} className="flex items-center gap-3 mb-2 border-b pb-2">
                      <img
                        src={i.image || "/placeholder.png"}
                        alt=""
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{i.title || i.name || "Item"}</div>
                        <div className="text-sm text-gray-600">
                          Qty: {i.quantity ?? 1} • ₹{i.price ?? "N/A"}
                        </div>

                        {/* ✅ Added history snippet like Vendor side */}
                        {Array.isArray(i.history) && i.history.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Last: {i.history[i.history.length - 1].status} •{" "}
                            {new Date(i.history[i.history.length - 1].changedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <select
                        value={i.status}
                        onChange={(e) => updateItemStatus(order._id, i._id, e.target.value)}
                        disabled={!!updatingMap[i._id]}
                        className="border p-1 rounded"
                      >
                        {ADMIN_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </td>
                <td className="p-2 align-top">₹{order.totalAmount ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;


// ***********************************************************************************


