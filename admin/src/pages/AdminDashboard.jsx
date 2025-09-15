
//admin/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const token = localStorage.getItem("admin_token");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    fetchList();
    // eslint-disable-next-line
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/vendor-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.message || "Failed to fetch" });
      } else {
        setList(data);
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    if (!confirm("Approve this vendor request?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/vendor-requests/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return setMsg({ type: "error", text: data.message || "Failed" });
      setMsg({ type: "success", text: "Approved" });
      fetchList();
    } catch {
      setMsg({ type: "error", text: "Network error" });
    }
  }

  async function reject(id) {
    const reason = prompt("Reason for rejection (optional)");
    try {
      const res = await fetch(`${API_BASE}/api/admin/vendor-requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg({ type: "error", text: data.message || "Failed" });
      setMsg({ type: "success", text: "Rejected" });
      fetchList();
    } catch {
      setMsg({ type: "error", text: "Network error" });
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin — Vendor Requests</h1>
          <div>
            <button onClick={logout} className="px-3 py-1 bg-rose-500 text-white rounded">Logout</button>
          </div>
        </header>

        {msg && <div className={`mb-4 p-3 rounded ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{msg.text}</div>}

        {loading ? <div>Loading...</div> : (
          <div className="bg-white rounded shadow p-4">
            {list.length === 0 ? <div className="text-sm text-gray-500">No requests</div> : (
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
                  {list.map((r) => (
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
                            {/* <button onClick={() => reject(r._1?._id || r._id)} className="px-3 py-1 bg-rose-500 text-white rounded">Reject</button> */}
                            <button onClick={() => reject(r._id)} className="px-3 py-1 bg-rose-500 text-white rounded">Reject</button>

                          
                          </>
                        ) : <span className="text-sm text-gray-500">Processed</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
