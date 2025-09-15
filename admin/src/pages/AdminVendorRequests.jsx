// admin/src/pages/AdminVendorRequests.jsx
// import React, { useEffect, useState } from "react";

// export default function AdminVendorRequests() {
//   const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
//   const token = localStorage.getItem("admin_token");

//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState(null);

//   useEffect(() => {
//     fetchList();
//     // eslint-disable-next-line
//   }, []);

//   async function fetchList() {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/api/admin/vendor-requests`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setMsg({ type: "error", text: data.message || "Failed to fetch" });
//       } else {
//         setList(data);
//       }
//     } catch (err) {
//       setMsg({ type: "error", text: "Network error" });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function approve(id) {
//     if (!confirm("Approve this vendor request?")) return;
//     try {
//       const res = await fetch(`${API_BASE}/api/admin/vendor-requests/${id}/approve`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) return setMsg({ type: "error", text: data.message || "Failed" });
//       setMsg({ type: "success", text: "Approved" });
//       fetchList();
//     } catch {
//       setMsg({ type: "error", text: "Network error" });
//     }
//   }

//   async function reject(id) {
//     const reason = prompt("Reason for rejection (optional)");
//     try {
//       const res = await fetch(`${API_BASE}/api/admin/vendor-requests/${id}/reject`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ reason }),
//       });
//       const data = await res.json();
//       if (!res.ok) return setMsg({ type: "error", text: data.message || "Failed" });
//       setMsg({ type: "success", text: "Rejected" });
//       fetchList();
//     } catch {
//       setMsg({ type: "error", text: "Network error" });
//     }
//   }

//   // split into pending vs approved (and rejected)
//   const pending = list.filter((r) => r.status === "pending");
//   const approved = list.filter((r) => r.status === "approved");
//   const rejected = list.filter((r) => r.status === "rejected");

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">Vendor Requests</h1>

//       {msg && (
//         <div className={`mb-4 p-3 rounded ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
//           {msg.text}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Pending */}
//         <div className="bg-white rounded shadow p-4">
//           <h2 className="text-lg font-medium mb-3">Pending Requests ({pending.length})</h2>
//           {pending.length === 0 ? (
//             <div className="text-sm text-gray-500">No pending requests.</div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left border-b">
//                   <th className="p-2">Name</th>
//                   <th className="p-2">Email</th>
//                   <th className="p-2">Mobile</th>
//                   <th className="p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pending.map((r) => (
//                   <tr key={r._id} className="border-b">
//                     <td className="p-2">{r.name}</td>
//                     <td className="p-2">{r.email}</td>
//                     <td className="p-2">{r.mobile}</td>
//                     <td className="p-2">
//                       <button onClick={() => approve(r._id)} className="mr-2 px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
//                       <button onClick={() => reject(r._id)} className="px-3 py-1 bg-rose-500 text-white rounded">Reject</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Approved */}
//         <div className="bg-white rounded shadow p-4">
//           <h2 className="text-lg font-medium mb-3">Approved Vendors ({approved.length})</h2>
//           {approved.length === 0 ? (
//             <div className="text-sm text-gray-500">No approved vendors.</div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left border-b">
//                   <th className="p-2">Name</th>
//                   <th className="p-2">Email</th>
//                   <th className="p-2">Mobile</th>
//                   <th className="p-2">Since</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {approved.map((r) => (
//                   <tr key={r._id} className="border-b">
//                     <td className="p-2">{r.name}</td>
//                     <td className="p-2">{r.email}</td>
//                     <td className="p-2">{r.mobile}</td>
//                     <td className="p-2">{new Date(r.updatedAt || r.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* Rejected small list below approved */}
//           <div className="mt-6">
//             <h3 className="text-sm text-gray-500 mb-2">Rejected ({rejected.length})</h3>
//             {rejected.length === 0 ? <div className="text-xs text-gray-400">None</div> : (
//               <ul className="text-sm">
//                 {rejected.map((r) => <li key={r._id} className="py-1 border-b">{r.name} — {r.email}</li>)}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// ************************************************************************


// admin/src/pages/AdminVendorRequests.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * AdminVendorRequests
 * - Fetches all vendor requests (backend returns whole list)
 * - Client-side search (name/email/mobile) with debounce
 * - Client-side pagination
 * - Splits into Pending / Approved / Rejected sections
 * - Approve / Reject actions call your existing endpoints and refresh list
 */

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AdminVendorRequests() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const token = localStorage.getItem("admin_token");

  const [all, setAll] = useState([]); // full list from server
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [q, setQ] = useState("");
  const qDebounced = useDebounce(q, 300);

  // pagination state (for the currently visible list view)
  const [page, setPage] = useState(1);
  const perPageOptions = [8, 12, 20];
  const [perPage, setPerPage] = useState(perPageOptions[0]);

  // which tab: "pending" | "approved" | "rejected" | "all"
  const [tab, setTab] = useState("pending");

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // reset to page 1 when search or tab changes
    setPage(1);
  }, [qDebounced, tab, perPage]);

  async function fetchList() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/vendor-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.message || "Failed to fetch" });
        setAll([]);
      } else {
        setAll(Array.isArray(data) ? data : data || []);
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
      setAll([]);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    if (!confirm("Approve this vendor request?")) return;
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/vendor-requests/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.message || "Approve failed" });
      } else {
        setMsg({ type: "success", text: "Vendor approved" });
        fetchList();
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
    }
  }

  async function reject(id) {
    const reason = prompt("Reason for rejection (optional)");
    if (reason === null) return; // user cancelled
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/vendor-requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.message || "Reject failed" });
      } else {
        setMsg({ type: "success", text: "Vendor rejected" });
        fetchList();
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
    }
  }

  // filtered lists (search applied)
  const filtered = useMemo(() => {
    const s = (qDebounced || "").trim().toLowerCase();
    if (!s) return all;
    return all.filter((r) => {
      const fields = [
        r.name || "",
        r.email || "",
        r.mobile || "",
        (r.gstin || "") + "",
        (r.status || ""),
      ].join(" ").toLowerCase();
      return fields.includes(s);
    });
  }, [all, qDebounced]);

  const pending = filtered.filter((r) => r.status === "pending");
  const approved = filtered.filter((r) => r.status === "approved");
  const rejected = filtered.filter((r) => r.status === "rejected");

  // pick which list to render based on tab
  const activeList = tab === "pending" ? pending : tab === "approved" ? approved : tab === "rejected" ? rejected : filtered;

  // pagination calculations
  const total = activeList.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paged = activeList.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Vendor Requests</h1>

        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / email / mobile / gstin..."
            className="border rounded p-2 w-72"
          />
          <div>
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="border rounded p-2">
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {msg.text}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={() => setTab("pending")}
          className={`px-3 py-1 rounded ${tab === "pending" ? "bg-emerald-600 text-white" : "bg-white border"}`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`px-3 py-1 rounded ${tab === "approved" ? "bg-emerald-600 text-white" : "bg-white border"}`}
        >
          Approved ({approved.length})
        </button>
        <button
          onClick={() => setTab("rejected")}
          className={`px-3 py-1 rounded ${tab === "rejected" ? "bg-rose-500 text-white" : "bg-white border"}`}
        >
          Rejected ({rejected.length})
        </button>
        <button
          onClick={() => setTab("all")}
          className={`px-3 py-1 rounded ${tab === "all" ? "bg-emerald-600 text-white" : "bg-white border"}`}
        >
          All ({filtered.length})
        </button>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div>Loading...</div>
        ) : paged.length === 0 ? (
          <div className="text-sm text-gray-500 p-4">No requests found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Mobile</th>
                <th className="p-2">Age</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr key={r._id} className="border-b">
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.mobile}</td>
                  <td className="p-2">{r.age}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">
                    {r.status === "pending" ? (
                      <>
                        <button onClick={() => approve(r._id)} className="mr-2 px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
                        <button onClick={() => reject(r._id)} className="px-3 py-1 bg-rose-500 text-white rounded">Reject</button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing {paged.length} of {total}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((s) => Math.max(1, s - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <div className="px-3 py-1 border rounded">Page {page} / {totalPages}</div>
            <button
              onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
