// vendor/src/components/Navbar.jsx
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// /**
//  * Simple Navbar with:
//  * - link to home/vendor register page
//  * - link to vendor dashboard
//  * - login/register or logout button (based on vendor_token)
//  *
//  * Drop this into src/components/Navbar.jsx
//  */

// export default function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("vendor_token");

//   function handleLogout() {
//     localStorage.removeItem("vendor_token");
//     // optional: remove other vendor data
//     navigate("/vendor"); // go back to vendor registration/login
//     // force reload so protected UI updates
//     window.location.reload();
//   }

//   return (
//     <header className="bg-white border-b shadow-sm">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Link to="/" className="text-lg font-bold text-gray-800">AjioClone</Link>

//           <nav className="hidden md:flex gap-4 text-sm text-gray-600">
//             <Link to="/" className="hover:text-gray-900">Home</Link>
//             <Link to="/vendor" className="hover:text-gray-900">Vendor</Link>
//             <Link to="/vendor/dashboard" className="hover:text-gray-900">Dashboard</Link>
//           </nav>
//         </div>

//         <div>
//           {token ? (
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => navigate("/vendor/dashboard")}
//                 className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm"
//               >
//                 Dashboard
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="px-3 py-1 rounded-md bg-rose-500 text-white text-sm"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-3">
//               <Link to="/vendor" className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">
//                 Sign / Register
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// ********************************************************************

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [vendor, setVendor] = useState(() => {
//     try {
//       const raw = localStorage.getItem("vendor_info");
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   });

//   useEffect(() => {
//     function onStorage(e) {
//       if (e.key === "vendor_info") {
//         setVendor(e.newValue ? JSON.parse(e.newValue) : null);
//       }
//       if (e.key === "vendor_token" && !e.newValue) {
//         setVendor(null);
//       }
//     }

//     function onVendorLogin(e) {
//       setVendor(e.detail || null);
//     }
//     function onVendorLogout() {
//       setVendor(null);
//     }

//     window.addEventListener("storage", onStorage);
//     window.addEventListener("vendor-login", onVendorLogin);
//     window.addEventListener("vendor-logout", onVendorLogout);

//     return () => {
//       window.removeEventListener("storage", onStorage);
//       window.removeEventListener("vendor-login", onVendorLogin);
//       window.removeEventListener("vendor-logout", onVendorLogout);
//     };
//   }, []);

//   function handleLogout() {
//     localStorage.removeItem("vendor_token");
//     localStorage.removeItem("vendor_info");
//     window.dispatchEvent(new Event("vendor-logout"));
//     setVendor(null);
//     navigate("/vendor");
//   }

//   return (
//     <header className="bg-white border-b">
//       <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-6">
//           <Link to="/" className="text-xl font-bold text-gray-800">AjioClone</Link>
//           <nav className="hidden md:flex gap-6 text-sm text-gray-600">
//             {/* <Link to="/" className="hover:text-gray-900">Home</Link>
//             <Link to="/vendor" className="hover:text-gray-900">Vendor</Link>
//             <Link to="/vendor/dashboard" className="hover:text-gray-900">Dashboard</Link> */}
//           </nav>
//         </div>

//         <div className="flex items-center gap-4">
//           {vendor ? (
//             <div className="flex items-center gap-4">
//               <div className="text-sm text-gray-700 hidden sm:block">
//                 Hello, <span className="font-semibold">{vendor.name}</span>
//               </div>

//               <button
//                 onClick={() => navigate("/vendor/dashboard")}
//                 className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm"
//               >
//                 Dashboard
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="px-3 py-1 rounded-md bg-rose-500 text-white text-sm"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div>
//               <button
//                 onClick={() => window.dispatchEvent(new CustomEvent("open-vendor-auth", { detail: { tab: "login" } }))}
//                 className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700"
//               >
//                 Sign IN / Register
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// ******************************************************************************



// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();

//   // Safety: If vendor_info is present but vendor_token missing, clear vendor_info
//   const [vendor, setVendor] = useState(() => {
//     try {
//       const rawInfo = localStorage.getItem("vendor_info");
//       const token = localStorage.getItem("vendor_token");
//       if (rawInfo && !token) {
//         // stale info without token -> remove it
//         localStorage.removeItem("vendor_info");
//         return null;
//       }
//       return rawInfo ? JSON.parse(rawInfo) : null;
//     } catch {
//       return null;
//     }
//   });

//   useEffect(() => {
//     function onStorage(e) {
//       if (e.key === "vendor_info") {
//         setVendor(e.newValue ? JSON.parse(e.newValue) : null);
//       }
//       if (e.key === "vendor_token" && !e.newValue) {
//         setVendor(null);
//       }
//     }

//     function onVendorLogin(e) {
//       setVendor(e.detail || null);
//     }
//     function onVendorLogout() {
//       setVendor(null);
//     }

//     window.addEventListener("storage", onStorage);
//     window.addEventListener("vendor-login", onVendorLogin);
//     window.addEventListener("vendor-logout", onVendorLogout);

//     return () => {
//       window.removeEventListener("storage", onStorage);
//       window.removeEventListener("vendor-login", onVendorLogin);
//       window.removeEventListener("vendor-logout", onVendorLogout);
//     };
//   }, []);

//   function handleLogout() {
//     localStorage.removeItem("vendor_token");
//     localStorage.removeItem("vendor_info");
//     window.dispatchEvent(new Event("vendor-logout"));
//     setVendor(null);
//     navigate("/vendor");
//   }

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b w-full">
//       <div className="max-w-6xl mx-auto px-6 py-4  flex items-center justify-between">
//         <div className="flex items-center gap-6">
//           <Link to="/" className="text-xl font-bold text-gray-800">AjioClone</Link>
//           <nav className="hidden md:flex gap-6 text-sm text-gray-600">
//             {/* nav links if any */}
//           </nav>
//         </div>

//         <div className="flex items-center gap-4">
//           {vendor ? (
//             <div className="flex items-center gap-4">
//               <div className="text-sm text-gray-700 hidden sm:block">
//                 Hello, <span className="font-semibold">{vendor.name}</span>
//               </div>

//               <button
//                 onClick={() => navigate("/vendor/dashboard")}
//                 className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm"
//               >
//                 Dashboard
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="px-3 py-1 rounded-md bg-rose-500 text-white text-sm"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div>
//               <button
//                 onClick={() => window.dispatchEvent(new CustomEvent("open-vendor-auth", { detail: { tab: "login" } }))}
//                 className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700"
//               >
//                 Sign IN / Register
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }










// **********************************************************************



// Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // vendor state logic (preserves your original safety checks)
  const [vendor, setVendor] = useState(() => {
    try {
      const rawInfo = localStorage.getItem("vendor_info");
      const token = localStorage.getItem("vendor_token");
      if (rawInfo && !token) {
        localStorage.removeItem("vendor_info");
        return null;
      }
      return rawInfo ? JSON.parse(rawInfo) : null;
    } catch {
      return null;
    }
  });

  // measure header and set css variable --header-h so other components can use it
  useEffect(() => {
    function updateHeaderHeight() {
      const h = headerRef.current?.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    }
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // storage + custom event listeners for cross-tab and app-level vendor changes
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "vendor_info") {
        setVendor(e.newValue ? JSON.parse(e.newValue) : null);
      }
      if (e.key === "vendor_token" && !e.newValue) {
        setVendor(null);
      }
    }

    function onVendorLogin(e) {
      setVendor(e.detail || null);
    }
    function onVendorLogout() {
      setVendor(null);
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("vendor-login", onVendorLogin);
    window.addEventListener("vendor-logout", onVendorLogout);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vendor-login", onVendorLogin);
      window.removeEventListener("vendor-logout", onVendorLogout);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("vendor_token");
    localStorage.removeItem("vendor_info");
    window.dispatchEvent(new Event("vendor-logout"));
    setVendor(null);
    navigate("/vendor"); // or wherever your vendor login lives
  }

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b w-full"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-gray-800">
            AjioClone
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-gray-600">
            {/* any nav links */}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {vendor ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700 hidden sm:block">
                Hello, <span className="font-semibold">{vendor.name}</span>
              </div>

              <button
                onClick={() => navigate("/vendor/dashboard")}
                className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md bg-rose-500 text-white text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("open-vendor-auth", { detail: { tab: "login" } })
                  )
                }
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700"
              >
                Sign IN / Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
