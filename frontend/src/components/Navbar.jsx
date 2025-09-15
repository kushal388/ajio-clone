

// ******************************************************** CART BAR CHNAGES *****************************



// Navbar.jsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";
import { menuData } from "../data/Menudata";
import React, { useState, useRef, useEffect } from "react";
import { slugify } from "../utils/slugify";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";

const Navbar = ({ onSignInClick, currentUser, onSignOut }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [shopTab, setShopTab] = useState("categories");
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart(); // get cart from context

  // Determine if we are on cart page (toggle navbar)
  // use startsWith so /cart/delivery etc also work
  const isCartPage = location.pathname.startsWith("/cart");

  // toast state for navbar
  const [toast, setToast] = useState({ visible: false, msg: "", style: {}, anchor: "" });
  const toastTimerRef = useRef(null);

  // refs for the icons to anchor toast near them
  const wishlistRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    function onShowToast(e) {
      const { msg = "", type = "cart" } = e?.detail || {};
      const anchorRef = type === "wishlist" ? wishlistRef : cartRef;
      if (!anchorRef?.current) {
        // fallback: show at top-right
        setToast({ visible: true, msg, style: { right: 16, top: 60 }, anchor: type });
      } else {
        const rect = anchorRef.current.getBoundingClientRect();
        // navbar is fixed; we'll position toast relative to viewport
        // place toast slightly below the icon
        const style = {
          position: "fixed",
          left: Math.max(8, rect.left + rect.width / 2 - 80), // center a 160px toast approx
          top: rect.bottom + 8,
          zIndex: 9999,
        };
        setToast({ visible: true, msg, style, anchor: type });
      }

      // clear prior timer
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, 2000);
    }

    window.addEventListener("show-toast", onShowToast);
    return () => {
      window.removeEventListener("show-toast", onShowToast);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const subLink = (cat, sub) => `/c/${cat}/${encodeURIComponent(sub)}`;

  return (
    <header className="fixed top-0 left-0 right-0 pt-1 pb-1 z-50 bg-white shadow-md">
      <div className="h-16 flex items-center">
        {/* Main navbar container: 2-column grid (logo | right area) */}
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-[260px_1fr] items-center w-full">
          {/* Logo (left column) */}
          <div>
            <Link
              to="/"
              className="text-[46px] font-semibold text-gray-800 tracking-wide leading-none"
              style={{ letterSpacing: "2px" }}
            >
              AJIO
            </Link>
          </div>

          {/* Right side: column with 2 rows (top links, bottom nav/search/icons) */}
          <div className="flex flex-col">
            {/* Row 1: Top Links (rendered once, unchanged) */}
            <div className="flex justify-end items-center text-xs text-gray-600 mb-1">
              {currentUser ? (
                <>
                  <span className="mx-2 font-medium">{currentUser.name}</span>
                  <Link to="/account" className="hover:underline mx-2">
                    My Account
                  </Link>
                  <button
                    onClick={onSignOut}
                    className="hover:underline mx-2 cursor-pointer bg-transparent border-none text-gray-600 text-xs"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={onSignInClick}
                  className="hover:underline mx-2 cursor-pointer bg-transparent border-none text-gray-600 text-xs"
                >
                  Sign In / Join AJIO
                </button>
              )}

              <Link to="/customer-care" className="hover:underline mx-2">
                Customer Care
              </Link>
              <Link to="/ajio-luxe" className="bg-black text-white text-xs px-3 py-1 ml-2">
                Visit AJIOLUXE
              </Link>
            </div>

            {/* Row 2: toggle between normal nav & cart-progress (keep same height) */}
            <div className="flex items-center justify-between">
              {/* If NOT cart page -> render original nav + mega + search + icons */}
              {!isCartPage ? (
                <>
                  {/* Nav */}
                  <nav className="flex gap-10 text-sm font-medium relative">
                    {Object.keys(menuData).map((key) => (
                      <span
                        key={key}
                        className="cursor-pointer hover:text-gray-600"
                        onMouseEnter={() => {
                          setActiveMenu(key);
                          setShopTab("categories");
                        }}
                        onMouseLeave={() => setActiveMenu(null)}
                        onClick={() => navigate(`/c/${key}`)}
                      >
                        {key.toUpperCase()}
                      </span>
                    ))}

                    {/* Mega Dropdown (unchanged) */}
                    {activeMenu && (
                      <div
                        className="absolute ml-[300px] top-full transform -translate-x-1/2 w-[900px] bg-white shadow-lg p-6 z-50 h-[500px]"
                        onMouseEnter={() => setActiveMenu(activeMenu)}
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        {/* Tabs */}
                        <div className="flex items-center mb-4 text-xs font-medium">
                          <span className="text-gray-400 mr-2">Shop By:</span>

                          <button
                            onMouseEnter={() => setShopTab("categories")}
                            className={`px-4 py-2 border ${
                              shopTab === "categories"
                                ? "bg-white text-black border-gray-300 font-semibold"
                                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-white hover:text-black"
                            }`}
                          >
                            CATEGORIES
                          </button>

                          <button
                            onMouseEnter={() => setShopTab("brands")}
                            className={`px-4 py-2 border ${
                              shopTab === "brands"
                                ? "bg-white text-black border-gray-300 font-semibold"
                                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-white hover:text-black"
                            }`}
                          >
                            BRANDS
                          </button>
                        </div>

                        {/* Categories Content */}
                        {shopTab === "categories" && (
                          <div className="grid grid-cols-[200px_1fr] gap-6">
                            {/* Left side */}
                            <div className="flex flex-col gap-2">
                              {menuData[activeMenu].left.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-gray-800 font-semibold hover:text-black cursor-pointer"
                                >
                                  {item.includes("|") ? (
                                    <>
                                      {item.split("|")[0]}{" "}
                                      <span
                                        className={`ml-1 text-xs px-1 rounded ${
                                          item.split("|")[1] === "hot"
                                            ? "bg-yellow-200 text-yellow-800"
                                            : "bg-red-200 text-red-700"
                                        }`}
                                      >
                                        {item.split("|")[1].toUpperCase()}
                                      </span>
                                    </>
                                  ) : (
                                    item
                                  )}
                                </span>
                              ))}
                            </div>

                            {/* Right side */}
                            <div className="grid grid-cols-4 gap-6">
                              {Object.entries(menuData[activeMenu].right).map(([section, items]) => (
                                <div key={section}>
                                  <h4 className="font-semibold text-gray-900 mb-2 uppercase">
                                    {section}
                                  </h4>
                                  <ul className="flex flex-col gap-1 text-sm">
                                    {items.map((subItem, i) => (
                                      <li key={i}>
                                        <Link to={`/c/${activeMenu}/${slugify(subItem)}`}>{subItem}</Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Brands Content */}
                        {shopTab === "brands" && (
                          <div className="grid grid-cols-4 gap-6 max-h-[400px] overflow-y-auto">
                            {menuData[activeMenu]?.brands ? (
                              Object.entries(menuData[activeMenu].brands).map(([section, brands]) => (
                                <div key={section}>
                                  <h4 className="font-semibold text-gray-900 mb-2 uppercase">
                                    {section}
                                  </h4>
                                  <ul className="flex flex-col gap-1 text-sm">
                                    {brands.map((brand, i) => (
                                      <li key={i}>
                                        <Link
                                          to={`/c/${activeMenu}?brand=${encodeURIComponent(brand)}`}
                                          className="text-gray-600 hover:text-black"
                                        >
                                          {brand}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400">No brands available</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </nav>

                  {/* Search + Icons */}
                  <div className="flex items-center gap-4">
                    <SearchBar />

                    <div className="flex items-center gap-3 text-xl text-gray-800">
                      <Link to="/wishlist" ref={wishlistRef} className="relative">
                        <FaHeart className="p-2 rounded-full bg-[#2f4154] text-white w-8 h-8" />
                      </Link>

                      <Link to="/cart" ref={cartRef} className="relative">
                        <FaShoppingBag className="p-2 rounded-full bg-[#2f4154] text-white w-8 h-8" />
                        {cart.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                            {cart.length}
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                /* CART PAGE: more compact, left-aligned progress block */
                <div className="w-full flex justify-start">
                  <div className="w-full max-w-[400px] pb-2 ml-4">
                    <div className="flex items-center justify-between">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="w-7 h-7 rounded-full bg-[#2f4154] text-white flex items-center justify-center">
                          <FaShoppingBag className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] mt-1">Bag</span>
                      </div>

                      {/* connector */}
                      <div className="flex-1 h-[1px] bg-gray-200 mx-2" />

                      {/* Step 2 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium">2</span>
                        </div>
                        <span className="text-[10px] mt-1">Delivery Details</span>
                      </div>

                      {/* connector */}
                      <div className="flex-1 h-[1px] bg-gray-200 mx-2" />

                      {/* Step 3 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium">3</span>
                        </div>
                        <span className="text-[10px] mt-1">Payment</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast UI element (positioned using style computed from icon position) */}
      {toast.visible && (
        <div
          className="px-3 py-2 rounded-md shadow-lg text-sm bg-aqua text-green"
          style={toast.style}
        >
          {toast.msg}
        </div>
      )}
    </header>
  );
};

export default Navbar;


