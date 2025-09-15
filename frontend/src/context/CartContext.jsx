


// **********************************************************************************************************************************
// src/context/CartContext.jsx
// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { api } from "../lib/api";

// const CartContext = createContext();
// export function useCart() { return useContext(CartContext); }

// const LOCAL_KEY = "ajio_cart_v1";

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // localStorage helpers
//   const saveLocal = useCallback((items) => {
//     try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items || [])); } catch (err) { console.error("saveLocal failed", err); }
//   }, []);

//   const loadLocal = useCallback(() => {
//     try { const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : []; } catch (err) { console.error("loadLocal failed", err); return []; }
//   }, []);

//   // normalization helper (same as before)
//   const normalizeItem = (it) => {
//     if (!it) return null;
//     if (it.productId && (it.title || it.image || it.price != null)) {
//       return {
//         productId: it.productId,
//         title: it.title ?? it.name ?? "",
//         image: it.image ?? (Array.isArray(it.images) && it.images[0]) ?? null,
//         price: Number(it.price ?? 0),
//         mrp: Number(it.mrp ?? 0),
//         quantity: Number(it.quantity ?? 1),
//         size: it.size ?? null,
//         sizes: it.sizes ?? (Array.isArray(it.availableSizes) ? it.availableSizes : undefined),
//         raw: it,
//       };
//     }
//     if (it.productId && (it.productId._id || it.productId.productId || it.productId.id)) {
//       const p = it.productId;
//       return {
//         productId: p._id ?? p.productId ?? p.id,
//         title: p.title ?? p.name ?? "",
//         image: p.image ?? (Array.isArray(p.images) && p.images[0]) ?? null,
//         price: Number(p.price ?? it.price ?? 0),
//         mrp: Number(p.mrp ?? it.mrp ?? 0),
//         quantity: Number(it.quantity ?? 1),
//         size: it.size ?? null,
//         sizes: Array.isArray(p.sizes) ? p.sizes : undefined,
//         raw: it,
//       };
//     }
//     if (it.product && (it.product._id || it.product.productId || it.product.id)) {
//       const p = it.product;
//       return {
//         productId: p._id ?? p.productId ?? p.id,
//         title: p.title ?? p.name ?? "",
//         image: p.image ?? (Array.isArray(p.images) && p.images[0]) ?? null,
//         price: Number(p.price ?? it.price ?? 0),
//         mrp: Number(p.mrp ?? it.mrp ?? 0),
//         quantity: Number(it.quantity ?? 1),
//         size: it.size ?? null,
//         sizes: Array.isArray(p.sizes) ? p.sizes : undefined,
//         raw: it,
//       };
//     }
//     return {
//       productId: it._id ?? it.productId ?? it.id ?? `anon-${Math.random().toString(36).slice(2, 8)}`,
//       title: it.title ?? it.name ?? "Untitled product",
//       image: it.image ?? (Array.isArray(it.images) && it.images[0]) ?? null,
//       price: Number(it.price ?? 0),
//       mrp: Number(it.mrp ?? 0),
//       quantity: Number(it.quantity ?? 1),
//       size: it.size ?? null,
//       sizes: Array.isArray(it.sizes) ? it.sizes : undefined,
//       raw: it,
//     };
//   };

//   const normalizeList = (arr) => Array.isArray(arr) ? arr.map(normalizeItem).filter(Boolean) : [];

//   // init load
//   useEffect(() => {
//     let mounted = true;
//     const init = async () => {
//       try {
//         setLoading(true);
//         await api.get("/auth/me"); // throws if not logged in
//         if (!mounted) return;
//         setIsLoggedIn(true);
//         const serverCart = await api.get("/api/cart");
//         if (!mounted) return;
//         setCart(normalizeList(serverCart));
//       } catch (err) {
//         if (!mounted) return;
//         setIsLoggedIn(false);
//         setCart(normalizeList(loadLocal()));
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     init();
//     return () => { mounted = false; };
//   }, [loadLocal]);

//   // persist to localStorage when guest
//   useEffect(() => {
//     if (!isLoggedIn) saveLocal(cart);
//   }, [cart, isLoggedIn, saveLocal]);

//   // helper to detect ObjectId-like string
//   const looksLikeObjectId = (v) => typeof v === "string" && /^[a-fA-F0-9]{24}$/.test(v);

//   // CRUD operations (same signatures as before)
//   const findIndex = (items, productId, size) =>
//     items.findIndex((it) => it.productId === productId && (it.size ?? "") === (size ?? ""));

//   const makeItemFromProduct = (product, quantity = 1, size = undefined) => {
//     if (!product) return null;
//     const pId = product._id ?? product.productId ?? product.id;
//     return normalizeItem({
//       productId: pId,
//       title: product.title ?? product.name,
//       image: product.image ?? (Array.isArray(product.images) && product.images[0]),
//       price: product.price ?? product.offerPrice ?? 0,
//       mrp: product.mrp,
//       quantity,
//       size,
//       sizes: product.sizes ?? undefined,
//     });
//   };

//   const addToCart = async (product, quantity = 1, size) => {
//     const item = makeItemFromProduct(product, quantity, size);
//     if (!item) return;
//     if (isLoggedIn) {
//       try {
//         await api.post("/api/cart", { productId: item.productId, quantity: item.quantity, size: item.size });
//         const serverCart = await api.get("/api/cart");
//         setCart(normalizeList(serverCart));
//       } catch (err) {
//         console.error("Add to cart (server) failed", err);
//         setCart((prev) => {
//           const idx = findIndex(prev, item.productId, item.size);
//           if (idx > -1) {
//             const next = [...prev]; next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }; return next;
//           } else return [...prev, item];
//         });
//       }
//     } else {
//       setCart((prev) => {
//         const idx = findIndex(prev, item.productId, item.size);
//         if (idx > -1) return prev.map((p, i) => i === idx ? { ...p, quantity: p.quantity + quantity } : p);
//         else return [...prev, item];
//       });
//     }
//   };

//   const removeFromCart = async (idOrProductId, size) => {
//     if (!idOrProductId) return;
//     if (isLoggedIn) {
//       try {
//         if (looksLikeObjectId(String(idOrProductId))) {
//           await api.del(`/api/cart/${encodeURIComponent(idOrProductId)}`);
//         } else {
//           const q = size ? `?size=${encodeURIComponent(size)}` : "";
//           await api.del(`/api/cart/${encodeURIComponent(idOrProductId)}${q}`);
//         }
//         const serverCart = await api.get("/api/cart");
//         setCart(normalizeList(serverCart));
//       } catch (err) {
//         console.error("Remove from cart (server) failed", err);
//         setCart((prev) => prev.filter((p) => {
//           const entryId = String(p.raw?._id ?? p._id ?? p.productId);
//           if (looksLikeObjectId(String(idOrProductId))) {
//             return entryId !== String(idOrProductId);
//           }
//           const pid = String(p.productId ?? p._id ?? "");
//           if (pid !== String(idOrProductId)) return true;
//           if (typeof size !== "undefined") return (p.size ?? "") !== (size ?? "");
//           return false;
//         }));
//       }
//     } else {
//       setCart((prev) => prev.filter((p) => {
//         const entryId = String(p.raw?._id ?? p._id ?? p.productId);
//         if (looksLikeObjectId(String(idOrProductId))) {
//           return entryId !== String(idOrProductId);
//         }
//         const pid = String(p.productId ?? p._id ?? "");
//         if (pid !== String(idOrProductId)) return true;
//         if (typeof size !== "undefined") return (p.size ?? "") !== (size ?? "");
//         return false;
//       }));
//     }
//   };

//   const updateQuantity = async (idOrProductId, quantity, size) => {
//     if (!idOrProductId) return;
//     if (isLoggedIn) {
//       try {
//         if (looksLikeObjectId(String(idOrProductId))) {
//           await api.put("/api/cart", { cartEntryId: idOrProductId, quantity, size });
//         } else {
//           await api.put("/api/cart", { productId: idOrProductId, quantity, size });
//         }
//         const serverCart = await api.get("/api/cart");
//         setCart(normalizeList(serverCart));
//       } catch (err) {
//         console.error("Update quantity (server) failed", err);
//         setCart((prev) => prev.map((p) => {
//           const entryId = String(p.raw?._id ?? p._id ?? p.productId);
//           const pid = String(p.productId ?? p._id ?? "");
//           if (looksLikeObjectId(String(idOrProductId))) {
//             if (entryId === String(idOrProductId)) return { ...p, quantity, size: typeof size !== "undefined" ? size : p.size };
//             return p;
//           }
//           if (pid === String(idOrProductId)) {
//             if (typeof size !== "undefined") {
//               if ((p.size ?? "") === (size ?? "")) return { ...p, quantity };
//               return p;
//             }
//             return { ...p, quantity };
//           }
//           return p;
//         }));
//       }
//     } else {
//       setCart((prev) => prev.map((p) => {
//         const entryId = String(p.raw?._id ?? p._id ?? p.productId);
//         const pid = String(p.productId ?? p._id ?? "");
//         if (looksLikeObjectId(String(idOrProductId))) {
//           if (entryId === String(idOrProductId)) return { ...p, quantity, size: typeof size !== "undefined" ? size : p.size };
//           return p;
//         }
//         if (pid === String(idOrProductId)) {
//           if (typeof size !== "undefined") {
//             if ((p.size ?? "") === (size ?? "")) return { ...p, quantity };
//             return p;
//           }
//           return { ...p, quantity };
//         }
//         return p;
//       }));
//     }
//   };

//   const mergeLocalToServer = async () => {
//     const local = loadLocal();
//     if (!local || !local.length) {
//       setIsLoggedIn(true);
//       try {
//         const serverCart = await api.get("/api/cart");
//         setCart(normalizeList(serverCart));
//       } catch (err) {
//         console.error("refresh server cart after login failed", err);
//       }
//       return;
//     }
//     try {
//       for (const it of local) {
//         await api.post("/api/cart", {
//           productId: it.productId,
//           quantity: it.quantity,
//           size: it.size,
//         });
//       }
//       const resp = await api.get("/api/cart");
//       const serverCart = resp?.data ?? resp;
//       setCart(normalizeList(serverCart));
//       setIsLoggedIn(true);
//       localStorage.removeItem(LOCAL_KEY);
//     } catch (err) {
//       console.error("mergeLocalToServer failed", err);
//     }
//   };

//   const markLoggedIn = (v = true) => setIsLoggedIn(!!v);

//   // Event listeners so login/logout propagate instantly
//   useEffect(() => {
//     const onSignedIn = async () => {
//       try {
//         // fetch server cart & also merge any local items
//         await mergeLocalToServer();
//       } catch (err) {
//         console.error("onSignedIn handler failed", err);
//       }
//     };
//     const onSignedOut = async () => {
//       // set as guest and load from localStorage
//       setIsLoggedIn(false);
//       setCart(normalizeList(loadLocal()));
//     };

//     window.addEventListener("signed-in", onSignedIn);
//     window.addEventListener("signed-out", onSignedOut);
//     return () => {
//       window.removeEventListener("signed-in", onSignedIn);
//       window.removeEventListener("signed-out", onSignedOut);
//     };
//   }, [loadLocal]);

//   const value = {
//     cart,
//     loading,
//     isLoggedIn,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     mergeLocalToServer,
//     setCart,
//     LOCAL_KEY,
//     markLoggedIn,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }




// ************************************************************************************


// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const CartContext = createContext();
export function useCart() { return useContext(CartContext); }

const LOCAL_KEY = "ajio_cart_v1";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // localStorage helpers
  const saveLocal = useCallback((items) => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items || [])); } catch (err) { console.error("saveLocal failed", err); }
  }, []);

  const loadLocal = useCallback(() => {
    try { const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : []; } catch (err) { console.error("loadLocal failed", err); return []; }
  }, []);

  // normalization helper
  const normalizeItem = (it) => {
    if (!it) return null;
    if (it.productId && (it.title || it.image || it.price != null)) {
      return {
        productId: it.productId,
        title: it.title ?? it.name ?? "",
        image: it.image ?? (Array.isArray(it.images) && it.images[0]) ?? null,
        price: Number(it.price ?? 0),
        mrp: Number(it.mrp ?? 0),
        quantity: Number(it.quantity ?? 1),
        size: it.size ?? null,
        sizes: it.sizes ?? (Array.isArray(it.availableSizes) ? it.availableSizes : undefined),
        raw: it,
      };
    }
    if (it.productId && (it.productId._id || it.productId.productId || it.productId.id)) {
      const p = it.productId;
      return {
        productId: p._id ?? p.productId ?? p.id,
        title: p.title ?? p.name ?? "",
        image: p.image ?? (Array.isArray(p.images) && p.images[0]) ?? null,
        price: Number(p.price ?? it.price ?? 0),
        mrp: Number(p.mrp ?? it.mrp ?? 0),
        quantity: Number(it.quantity ?? 1),
        size: it.size ?? null,
        sizes: Array.isArray(p.sizes) ? p.sizes : undefined,
        raw: it,
      };
    }
    if (it.product && (it.product._id || it.product.productId || it.product.id)) {
      const p = it.product;
      return {
        productId: p._id ?? p.productId ?? p.id,
        title: p.title ?? p.name ?? "",
        image: p.image ?? (Array.isArray(p.images) && p.images[0]) ?? null,
        price: Number(p.price ?? it.price ?? 0),
        mrp: Number(p.mrp ?? it.mrp ?? 0),
        quantity: Number(it.quantity ?? 1),
        size: it.size ?? null,
        sizes: Array.isArray(p.sizes) ? p.sizes : undefined,
        raw: it,
      };
    }
    return {
      productId: it._id ?? it.productId ?? it.id ?? `anon-${Math.random().toString(36).slice(2, 8)}`,
      title: it.title ?? it.name ?? "Untitled product",
      image: it.image ?? (Array.isArray(it.images) && it.images[0]) ?? null,
      price: Number(it.price ?? 0),
      mrp: Number(it.mrp ?? 0),
      quantity: Number(it.quantity ?? 1),
      size: it.size ?? null,
      sizes: Array.isArray(it.sizes) ? it.sizes : undefined,
      raw: it,
    };
  };

  const normalizeList = (arr) => Array.isArray(arr) ? arr.map(normalizeItem).filter(Boolean) : [];

  // init load
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        setLoading(true);
        await api.get("/auth/me"); // throws if not logged in
        if (!mounted) return;
        setIsLoggedIn(true);
        const serverCart = await api.get("/api/cart");
        if (!mounted) return;
        setCart(normalizeList(serverCart));
      } catch (err) {
        if (!mounted) return;
        setIsLoggedIn(false);
        setCart(normalizeList(loadLocal()));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, [loadLocal]);

  // persist to localStorage when guest
  useEffect(() => {
    if (!isLoggedIn) saveLocal(cart);
  }, [cart, isLoggedIn, saveLocal]);

  // helper to detect ObjectId-like string
  const looksLikeObjectId = (v) => typeof v === "string" && /^[a-fA-F0-9]{24}$/.test(v);

  // CRUD operations
  const findIndex = (items, productId, size) =>
    items.findIndex((it) => it.productId === productId && (it.size ?? "") === (size ?? ""));

  const makeItemFromProduct = (product, quantity = 1, size = undefined) => {
    if (!product) return null;
    const pId = product._id ?? product.productId ?? product.id;
    return normalizeItem({
      productId: pId,
      title: product.title ?? product.name,
      image: product.image ?? (Array.isArray(product.images) && product.images[0]),
      price: product.price ?? product.offerPrice ?? 0,
      mrp: product.mrp,
      quantity,
      size,
      sizes: product.sizes ?? undefined,
    });
  };

  const addToCart = async (product, quantity = 1, size) => {
    const item = makeItemFromProduct(product, quantity, size);
    if (!item) return;
    if (isLoggedIn) {
      try {
        await api.post("/api/cart", { productId: item.productId, quantity: item.quantity, size: item.size });
        const serverCart = await api.get("/api/cart");
        setCart(normalizeList(serverCart));
      } catch (err) {
        console.error("Add to cart (server) failed", err);
        setCart((prev) => {
          const idx = findIndex(prev, item.productId, item.size);
          if (idx > -1) {
            const next = [...prev]; next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }; return next;
          } else return [...prev, item];
        });
      }
    } else {
      setCart((prev) => {
        const idx = findIndex(prev, item.productId, item.size);
        if (idx > -1) return prev.map((p, i) => i === idx ? { ...p, quantity: p.quantity + quantity } : p);
        else return [...prev, item];
      });
    }
  };

  const removeFromCart = async (idOrProductId, size) => {
    if (!idOrProductId) return;
    if (isLoggedIn) {
      try {
        if (looksLikeObjectId(String(idOrProductId))) {
          await api.del(`/api/cart/${encodeURIComponent(idOrProductId)}`);
        } else {
          const q = size ? `?size=${encodeURIComponent(size)}` : "";
          await api.del(`/api/cart/${encodeURIComponent(idOrProductId)}${q}`);
        }
        const serverCart = await api.get("/api/cart");
        setCart(normalizeList(serverCart));
      } catch (err) {
        console.error("Remove from cart (server) failed", err);
        setCart((prev) => prev.filter((p) => {
          const entryId = String(p.raw?._id ?? p._id ?? p.productId);
          if (looksLikeObjectId(String(idOrProductId))) {
            return entryId !== String(idOrProductId);
          }
          const pid = String(p.productId ?? p._id ?? "");
          if (pid !== String(idOrProductId)) return true;
          if (typeof size !== "undefined") return (p.size ?? "") !== (size ?? "");
          return false;
        }));
      }
    } else {
      setCart((prev) => prev.filter((p) => {
        const entryId = String(p.raw?._id ?? p._id ?? p.productId);
        if (looksLikeObjectId(String(idOrProductId))) {
          return entryId !== String(idOrProductId);
        }
        const pid = String(p.productId ?? p._id ?? "");
        if (pid !== String(idOrProductId)) return true;
        if (typeof size !== "undefined") return (p.size ?? "") !== (size ?? "");
        return false;
      }));
    }
  };

  const updateQuantity = async (idOrProductId, quantity, size) => {
    if (!idOrProductId) return;
    if (isLoggedIn) {
      try {
        if (looksLikeObjectId(String(idOrProductId))) {
          await api.put("/api/cart", { cartEntryId: idOrProductId, quantity, size });
        } else {
          await api.put("/api/cart", { productId: idOrProductId, quantity, size });
        }
        const serverCart = await api.get("/api/cart");
        setCart(normalizeList(serverCart));
      } catch (err) {
        console.error("Update quantity (server) failed", err);
        setCart((prev) => prev.map((p) => {
          const entryId = String(p.raw?._id ?? p._id ?? p.productId);
          const pid = String(p.productId ?? p._id ?? "");
          if (looksLikeObjectId(String(idOrProductId))) {
            if (entryId === String(idOrProductId)) return { ...p, quantity, size: typeof size !== "undefined" ? size : p.size };
            return p;
          }
          if (pid === String(idOrProductId)) {
            if (typeof size !== "undefined") {
              if ((p.size ?? "") === (size ?? "")) return { ...p, quantity };
              return p;
            }
            return { ...p, quantity };
          }
          return p;
        }));
      }
    } else {
      setCart((prev) => prev.map((p) => {
        const entryId = String(p.raw?._id ?? p._id ?? p.productId);
        const pid = String(p.productId ?? p._id ?? "");
        if (looksLikeObjectId(String(idOrProductId))) {
          if (entryId === String(idOrProductId)) return { ...p, quantity, size: typeof size !== "undefined" ? size : p.size };
          return p;
        }
        if (pid === String(idOrProductId)) {
          if (typeof size !== "undefined") {
            if ((p.size ?? "") === (size ?? "")) return { ...p, quantity };
            return p;
          }
          return { ...p, quantity };
        }
        return p;
      }));
    }
  };

  const mergeLocalToServer = async () => {
    const local = loadLocal();
    if (!local || !local.length) {
      setIsLoggedIn(true);
      try {
        const serverCart = await api.get("/api/cart");
        setCart(normalizeList(serverCart));
      } catch (err) {
        console.error("refresh server cart after login failed", err);
      }
      return;
    }
    try {
      for (const it of local) {
        await api.post("/api/cart", {
          productId: it.productId,
          quantity: it.quantity,
          size: it.size,
        });
      }
      const resp = await api.get("/api/cart");
      const serverCart = resp?.data ?? resp;
      setCart(normalizeList(serverCart));
      setIsLoggedIn(true);
      localStorage.removeItem(LOCAL_KEY);
    } catch (err) {
      console.error("mergeLocalToServer failed", err);
    }
  };

  const markLoggedIn = (v = true) => setIsLoggedIn(!!v);

  // Clear entire cart (server + local)
  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        // Prefer a server endpoint that clears all items in one request
        // e.g. DELETE /api/cart
        await api.del("/api/cart");
        // Refresh server cart after clearing
        const newServer = await api.get("/api/cart");
        setCart(normalizeList(newServer));
      } catch (err) {
        console.error("clearCart (server) failed", err);
        // fallback: clear local state anyway
        setCart([]);
      }
    } else {
      try {
        localStorage.removeItem(LOCAL_KEY);
      } catch (err) { console.error("local remove failed", err); }
      setCart([]);
    }
  };

  // Event listeners so login/logout propagate instantly
  useEffect(() => {
    const onSignedIn = async () => {
      try {
        // fetch server cart & also merge any local items
        await mergeLocalToServer();
      } catch (err) {
        console.error("onSignedIn handler failed", err);
      }
    };
    const onSignedOut = async () => {
      // set as guest and load from localStorage
      setIsLoggedIn(false);
      setCart(normalizeList(loadLocal()));
    };

    window.addEventListener("signed-in", onSignedIn);
    window.addEventListener("signed-out", onSignedOut);
    return () => {
      window.removeEventListener("signed-in", onSignedIn);
      window.removeEventListener("signed-out", onSignedOut);
    };
  }, [loadLocal]);

  const value = {
    cart,
    loading,
    isLoggedIn,
    addToCart,
    removeFromCart,
    updateQuantity,
    mergeLocalToServer,
    setCart,
    LOCAL_KEY,
    markLoggedIn,
    clearCart, // <-- exported
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
