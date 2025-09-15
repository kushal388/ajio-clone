
// *************************** DIsPLY PAGE ******************

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";

// import { useState } from "react";

// import Men from "./pages/Men";
// import Women from "./pages/Women";
// import Kids from "./pages/Kids";
// import Beauty from "./pages/Beauty";
// import HomeKitchen from "./pages/HomeKitchen";
// import AuthModal from "./components/AuthModal";

// // import ProductPage from "./components/ProductPage"; // import your ProductPage component

// // ⬇️ import your category page
// import CategoryPage from "./pages/CategoryPage";

// import ProductPage from "./pages/ProductPage";

// function App() {
//   const [showModal, setShowModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   return (
//     <Router>
//       <Navbar
//         onSignInClick={() => setShowModal(true)}
//         currentUser={currentUser}
//         onSignOut={() => setCurrentUser(null)}
//       />

//       <Routes>
//         {/* your old routes (keep if you still use them) */}
//         <Route path="/men" element={<Men />} />
//         <Route path="/women" element={<Women />} />
//         <Route path="/kids" element={<Kids />} />
//         <Route path="/beauty" element={<Beauty />} />
//         <Route path="/home-kitchen" element={<HomeKitchen />} />

//         {/* ⬇️ NEW: single dynamic category/subcategory route */}
//         <Route path="/c/:category/:subcategory?" element={<CategoryPage />} />

//         {/* optional: default home could point somewhere */}
//         {/* <Route path="/" element={<Home />} /> */}


//         <Route path="/product/:id" element={<ProductPage />} />

        
//       </Routes>

//       {showModal && (
//         <AuthModal
//           onClose={() => setShowModal(false)}
//           onLoginSuccess={(user) => {
//             setCurrentUser(user);
//             setShowModal(false);
//           }}
//         />
//       )}

//     </Router>
//   );
// }

// export default App;



// ***************************** **************************



// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";

// import { useState } from "react";

// import Men from "./pages/Men";
// import Women from "./pages/Women";
// import Kids from "./pages/Kids";
// import Beauty from "./pages/Beauty";
// import HomeKitchen from "./pages/HomeKitchen";
// import AuthModal from "./components/AuthModal";
// import CartPage from "./pages/CartPage";


// // import ProductPage from "./components/ProductPage"; // import your ProductPage component

// // ⬇️ import your category page
// import CategoryPage from "./pages/CategoryPage";

// import ProductPage from "./pages/ProductPage";
// import WishlistPage from "./pages/WishlistPage";

// function App() {
//   const [showModal, setShowModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   return (
//     <Router>
//       <Navbar
//         onSignInClick={() => setShowModal(true)}
//         currentUser={currentUser}
//         onSignOut={() => setCurrentUser(null)}
//       />


//       <div className="pt-16">

//             <Routes>
//               {/* your old routes (keep if you still use them) */}
//               <Route path="/men" element={<Men />} />
//               <Route path="/women" element={<Women />} />
//               <Route path="/kids" element={<Kids />} />
//               <Route path="/beauty" element={<Beauty />} />
//               <Route path="/home-kitchen" element={<HomeKitchen />} />

//               {/* ⬇️ NEW: single dynamic category/subcategory route */}
//               <Route path="/c/:category/:subcategory?" element={<CategoryPage />} />

//               {/* optional: default home could point somewhere */}
//               {/* <Route path="/" element={<Home />} /> */}


//               <Route path="/product/:id" element={<ProductPage />} />
//               <Route path="/cart" element={<CartPage />} />
//               <Route path="/wishlist" element={<WishlistPage />} />
              
//             </Routes>

//         </div>

//       {showModal && (
//         <AuthModal
//           onClose={() => setShowModal(false)}
//           onLoginSuccess={(user) => {
//             setCurrentUser(user);
//             setShowModal(false);
//           }}
//         />
//       )}

//     </Router>
//   );
// }

// export default App;


// ***************************** user data ******************************************

// src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import { useState, useEffect } from "react";
// // import axios from "axios";
// import { api } from "./lib/api"

// import Men from "./pages/Men";
// import Women from "./pages/Women";
// import Kids from "./pages/Kids";
// import Beauty from "./pages/Beauty";
// import HomeKitchen from "./pages/HomeKitchen";
// import AuthModal from "./components/AuthModal";
// import CartPage from "./pages/CartPage";
// import CategoryPage from "./pages/CategoryPage";
// import ProductPage from "./pages/ProductPage";
// import WishlistPage from "./pages/WishlistPage";
// import Home from "./pages/hOME.JSX"; // optional: create a simple Home component or change to your desired default

// // Ensure axios sends cookies. Ideally put this in src/main.jsx once, but keeping here is safe:
// // axios.defaults.withCredentials = true;
// // Keep baseURL empty in dev so Vite proxy works. In production you may set VITE_API_BASE.
// // axios.defaults.baseURL = import.meta.env.PROD ? (import.meta.env.VITE_API_BASE || "") : "";

// function App() {
//   const [showModal, setShowModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [checkingSession, setCheckingSession] = useState(true);

//   // On mount: check /auth/me to persist login on refresh
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setCheckingSession(true);
//         const res = await api.get("/auth/me");// relative path -> Vite proxy -> backend
//         if (mounted) { setCurrentUser(res || null); } // api.get returns parsed JSON body
//       } catch (err) {
//         // not logged in or error — keep currentUser null
//         if (mounted) setCurrentUser(null);
//       } finally {
//         if (mounted) setCheckingSession(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // sign out: call server to clear cookie (optional) then clear client state
//   const handleSignOut = async () => {
//     try {
//       await axios.post("/auth/logout"); // server should clear cookie
//     } catch (err) {
//       // ignore errors; proceed to clear local state
//       console.warn("Logout request failed", err);
//     } finally {
//       setCurrentUser(null);
//     }
//   };

//   return (
//     <Router>
//       <Navbar
//         onSignInClick={() => setShowModal(true)}
//         currentUser={currentUser}
//         onSignOut={handleSignOut}
//       />

//       <div className="pt-16">
//         <Routes>
//           <Route path="/" element={<Home />} /> {/* add a home page or change as needed */}
//           <Route path="/men" element={<Men />} />
//           <Route path="/women" element={<Women />} />
//           <Route path="/kids" element={<Kids />} />
//           <Route path="/beauty" element={<Beauty />} />
//           <Route path="/home-kitchen" element={<HomeKitchen />} />

//           <Route path="/c/:category/:subcategory?" element={<CategoryPage />} />
//           <Route path="/product/:id" element={<ProductPage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/wishlist" element={<WishlistPage />} />
//         </Routes>
//       </div>

//       {showModal && (
//         <AuthModal
//           onClose={() => setShowModal(false)}
//           onLoginSuccess={(user) => {
//             setCurrentUser(user);
//             setShowModal(false);
//           }}
//         />
//       )}
//     </Router>
//   );
// }

// export default App;




// **************************************************************************************************

// src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import { useState, useEffect } from "react";
// import { api } from "./lib/api";

// import Men from "./pages/Men";
// import Women from "./pages/Women";
// import Kids from "./pages/Kids";
// import Beauty from "./pages/Beauty";
// import HomeKitchen from "./pages/HomeKitchen";
// import AuthModal from "./components/AuthModal";
// import CartPage from "./pages/CartPage";
// import CategoryPage from "./pages/CategoryPage";
// import ProductPage from "./pages/ProductPage";
// import WishlistPage from "./pages/WishlistPage";
// import Home from "./pages/Home";

// function App() {
//   const [showModal, setShowModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [checkingSession, setCheckingSession] = useState(true);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setCheckingSession(true);
//         const res = await api.get("/auth/me"); // will return user object when logged in
//         if (mounted) setCurrentUser(res || null);
//       } catch (err) {
//         if (mounted) setCurrentUser(null);
//       } finally {
//         if (mounted) setCheckingSession(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       await api.post("/auth/logout"); // use api (fetch wrapper) so credentials & proxy are used
//     } catch (err) {
//       console.warn("Logout request failed", err);
//     } finally {
//       setCurrentUser(null);
//       // optionally: dispatch a small event so contexts can refresh if you want
//       // window.dispatchEvent(new Event("signed-out"));
//     }
//   };

//   return (
//     <Router>
//       <Navbar onSignInClick={() => setShowModal(true)} currentUser={currentUser} onSignOut={handleSignOut} />
//       <div className="pt-16">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/men" element={<Men />} />
//           <Route path="/women" element={<Women />} />
//           <Route path="/kids" element={<Kids />} />
//           <Route path="/beauty" element={<Beauty />} />
//           <Route path="/home-kitchen" element={<HomeKitchen />} />
//           <Route path="/c/:category/:subcategory?" element={<CategoryPage />} />
//           <Route path="/product/:id" element={<ProductPage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/wishlist" element={<WishlistPage />} />
//         </Routes>
//       </div>

//       {showModal && (
//         <AuthModal
//           onClose={() => setShowModal(false)}
//           onLoginSuccess={(user) => { setCurrentUser(user); setShowModal(false); }}
//         />
//       )}
//     </Router>
//   );
// }

// export default App;


// ***************************************************************************************************************

// src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import { useState, useEffect, useCallback } from "react";
// import { api } from "./lib/api";

// import Men from "./pages/Men";
// import Women from "./pages/Women";
// import Kids from "./pages/Kids";
// import Beauty from "./pages/Beauty";
// import HomeKitchen from "./pages/HomeKitchen";
// import AuthModal from "./components/AuthModal";
// import CartPage from "./pages/CartPage";
// import CategoryPage from "./pages/CategoryPage";
// import ProductPage from "./pages/ProductPage";
// import WishlistPage from "./pages/WishlistPage";
// import SearchResultsPage from "./pages/SearchResultsPage";
// import ShippingPage from "./pages/ShippingPage";
// import PaymentPage from "./pages/PaymentPage";

// import Home from "./pages/Home";

// function App() {
//   const [showModal, setShowModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [checkingSession, setCheckingSession] = useState(true);

//   const refreshSession = useCallback(async () => {
//     try {
//       const res = await api.get("/auth/me");
//       setCurrentUser(res || null);
//       return res || null;
//     } catch (err) {
//       setCurrentUser(null);
//       return null;
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       if (!mounted) return;
//       setCheckingSession(true);
//       await refreshSession();
//       if (mounted) setCheckingSession(false);
//     })();
//     return () => { mounted = false; };
//   }, [refreshSession]);

//   const handleSignOut = async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (err) {
//       console.warn("Logout request failed", err);
//     } finally {
//       // clear local UI user immediately
//       setCurrentUser(null);

//       // notify contexts/components to refresh/clear data
//       window.dispatchEvent(new Event("signed-out"));

//       // double-check session on server (optional)
//       await refreshSession();
//     }
//   };

//   return (
//     <Router>
//       <Navbar onSignInClick={() => setShowModal(true)} currentUser={currentUser} onSignOut={handleSignOut} />
//       <div className="pt-16">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/men" element={<Men />} />
//           <Route path="/women" element={<Women />} />
//           <Route path="/kids" element={<Kids />} />
//           <Route path="/beauty" element={<Beauty />} />
//           <Route path="/home-kitchen" element={<HomeKitchen />} />
//           <Route path="/c/:category/:subcategory?" element={<CategoryPage />} />
//           <Route path="/product/:id" element={<ProductPage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/wishlist" element={<WishlistPage />} />
//           <Route path="/search" element={<SearchResultsPage />} />
//           <Route path="/shipping" element={<ShippingPage />} />
//           <Route path="/payment" element={<PaymentPage />} />
//         </Routes>
//       </div>

//       {showModal && (
//         <AuthModal
//           onClose={() => setShowModal(false)}
//           onLoginSuccess={async (user) => {
//             // user is the object returned by verify-otp; update UI
//             setCurrentUser(user || null);
//             setShowModal(false);

//             // notify contexts to merge local -> server and refresh
//             // (AuthModal itself may have done mergeLocalToServer; this ensures others refresh)
//             window.dispatchEvent(new Event("signed-in"));

//             // re-check the session from server — ensures cookie-based auth is valid
//             await refreshSession();
//           }}
//         />
//       )}
//     </Router>
//   );
// }

// export default App;



// / ********************************************************************************************

// ****************** PAYMNET ******************************


// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { api } from "./lib/api";

// import Men from "./pages/Men";
// import Women from "./pages/Women";
// import Kids from "./pages/Kids";
// import Beauty from "./pages/Beauty";
// import HomeKitchen from "./pages/HomeKitchen";
import AuthModal from "./components/AuthModal";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import WishlistPage from "./pages/WishlistPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import Home from "./pages/Home";
import PaymentPage from "./pages/PaymentPage";
import ShippingPage from "./pages/ShippingPage";
import OrderSuccess from "./pages/OrderSuccess";

// import provider
import { UserProvider, useUser } from "./context/UserContext";

function AppInner() {
  // local UI state
  const [showModal, setShowModal] = useState(false);

  // useUser inside AppInner only to pass sign-in callbacks to Navbar
  const { user, setUser, refreshSession } = useUser();

  const handleSignOut = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed", err);
    } finally {
      setUser(null);
      window.dispatchEvent(new Event("signed-out"));
      await refreshSession();
    }
  };

  return (
    <>
      <Router>
        <Navbar onSignInClick={() => setShowModal(true)} currentUser={user} onSignOut={handleSignOut} />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/men" element={<Men />} /> */}
            {/* <Route path="/women" element={<Women />} /> */}
            {/* <Route path="/kids" element={<Kids />} /> */}
            {/* <Route path="/beauty" element={<Beauty />} /> */}
            {/* <Route path="/home-kitchen" element={<HomeKitchen />} /> */}
            <Route path="/c/:category/:subcategory?" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />


          </Routes>
        </div>

        {showModal && (
          <AuthModal
            onClose={() => setShowModal(false)}
            onLoginSuccess={async (userObj) => {
              // update provider state
              setUser(userObj || null);
              setShowModal(false);
              window.dispatchEvent(new Event("signed-in"));
              await refreshSession();
            }}
          />
        )}
      </Router>
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppInner />
    </UserProvider>
  );
}



