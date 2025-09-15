// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//    return (
//     <h1 className="text-3xl font-bold underline">
//       Hello world!
//     </h1>
//   )
 
// }

// export default App

// *****************************************************************

// /admin/src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";

// /**
//  * Protects routes that require an admin token.
//  * If no token -> redirect to /admin/login and preserve `from` location.
//  */
// function RequireAdmin({ children }) {
//   const location = useLocation();
//   const token = localStorage.getItem("admin_token");
//   if (!token) {
//     return <Navigate to="/admin/login" state={{ from: location }} replace />;
//   }
//   return children;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public admin login */}
//         <Route path="/admin/login" element={<AdminLogin />} />

//         {/* Protected admin dashboard */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <RequireAdmin>
//               <AdminDashboard />
//             </RequireAdmin>
//           }
//         />

//         {/* Optional: root redirects to admin login */}
//         <Route path="/" element={<Navigate to="/admin/login" replace />} />

//         {/* Catch-all: redirect to root */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }



// ***************************************************

// admin/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./layout/AdminLayout";
import AdminVendorRequests from "./pages/AdminVendorRequests";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

function RequireAdmin({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("admin_token");
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin area with layout + nested pages */}
        <Route
          path="/admin/dashboard/*"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Navigate to="requests" replace />} />
          <Route path="requests" element={<AdminVendorRequests />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

