// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import VendorRegistration from './pages/VendorRegistration'

// function App() {


//    return (
//     <>
//          <VendorRegistration />
//     </>
//    )
    
// }

// export default App

// ****************************************************************************************

// vendor/src/App.jsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import VendorRegistration from "./pages/VendorRegistration";
// import Dashboard from "./vendor/Dashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Vendor registration + login */}
//         <Route path="/vendor" element={<VendorRegistration />} />

//         {/* Vendor dashboard (after login) */}
//         <Route path="/vendor/dashboard" element={<Dashboard />} />

//         {/* Default route (optional) */}
//         <Route path="*" element={<VendorRegistration />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// **************************************************************************

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import VendorRegistration from "./pages/VendorRegistration";
// import Dashboard from "./vendor/Dashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <main className="min-h-[calc(100vh-64px)]">
//         <Routes>
//           <Route path="/vendor" element={<VendorRegistration />} />
//           <Route path="/vendor/dashboard" element={<Dashboard />} />
//           {/* <Route path="*" element={<VendorRegistration />} /> */}
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }

// export default App;


// ********************************************************************

// vendor/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import VendorRegistration from "./pages/VendorRegistration";
import Dashboard from "./vendor/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/vendor" element={<VendorRegistration />} />
          <Route path="/vendor/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/vendor" replace />} />
          <Route path="*" element={<Navigate to="/vendor" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}



// ******************************************************


// src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import VendorRegistration from "./pages/VendorRegistration";
// import Dashboard from "./vendor/Dashboard";

// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("vendor_token");
//   if (!token) return <Navigate to="/vendor" replace />;
//   return children;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <main className="min-h-[calc(100vh-64px)] bg-gray-50">
//         <Routes>
//           <Route path="/vendor" element={<VendorRegistration />} />
//           <Route path="/vendor/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//           <Route path="/" element={<Navigate to="/vendor" replace />} />
//           <Route path="*" element={<Navigate to="/vendor" replace />} />
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }
