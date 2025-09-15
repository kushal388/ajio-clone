// admin/src/layout/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("admin_token");
    // optional: you may want to clear other admin state
    navigate("/admin/login");
  }

  const sideItems = [
    { key: "requests", label: "Vendor Requests", to: "/admin/dashboard/requests" },
    { key: "orders", label: "Orders", to: "/admin/dashboard/orders" },
    { key: "products", label: "Products", to: "/admin/dashboard/products" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>

        <nav className="space-y-3">
          {sideItems.map((it) => (
            <NavLink
              key={it.key}
              to={it.to}
              className={({ isActive }) =>
                `block px-2 py-2 rounded ${isActive ? "bg-emerald-700 font-semibold" : "hover:bg-gray-800"}`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-6 overflow-auto">
        {/* top bar with logout aligned right */}
        <div className="flex items-center justify-end mb-6">
          <button onClick={logout} className="px-3 py-1 bg-rose-500 text-white rounded">
            Logout
          </button>
        </div>

        {/* Outlet renders nested admin pages */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
