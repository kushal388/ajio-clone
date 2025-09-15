// admin/src/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // if you use react-router

export default function AdminLogin() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const navigate = typeof useNavigate === "function" ? useNavigate() : null;

  async function handleLogin(e) {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.message || "Login failed" });
        return;
      }
      localStorage.setItem("admin_token", data.token);
      setMsg({ type: "success", text: "Logged in" });
      // navigate to dashboard if using router
      if (navigate) navigate("/admin/dashboard");
      else window.location.href = "/admin/dashboard";
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Sign in</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <input type="email" placeholder="admin email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full py-2 bg-indigo-600 text-white rounded">Sign in</button>
        </form>
        {msg && <div className={`mt-3 p-2 rounded ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{msg.text}</div>}
      </div>
    </div>
  );
}
