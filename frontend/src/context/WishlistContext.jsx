// import { createContext, useContext, useState } from "react";

// const WishlistContext = createContext();

// export function WishlistProvider({ children }) {
//   const [wishlist, setWishlist] = useState([]);

//   const addToWishlist = (product) => {
//     // prevent duplicates
//     if (!wishlist.some((item) => item._id === product._id)) {
//       setWishlist([...wishlist, product]);
//     }
//   };

//   const removeFromWishlist = (productId) => {
//     setWishlist(wishlist.filter((item) => item._id !== productId));
//   };

//   return (
//     <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// }

// export const useWishlist = () => useContext(WishlistContext);




// ******************************************* USER DATA ( funcanality missing) ***********************************

// src/context/WishlistContext.jsx
// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { api } from "../lib/api";

// const WishlistContext = createContext();
// export function useWishlist() { return useContext(WishlistContext); }

// const LOCAL_KEY = "ajio_wishlist_v1";

// export function WishlistProvider({ children }) {
//   const [wishlist, setWishlist] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const saveLocal = useCallback((items) => {
//     localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
//   }, []);
//   const loadLocal = useCallback(() => {
//     try {
//       const raw = localStorage.getItem(LOCAL_KEY);
//       return raw ? JSON.parse(raw) : [];
//     } catch { return []; }
//   }, []);

//   useEffect(() => {
//     let mounted = true;
//     const init = async () => {
//       try {
//         await api.get("/auth/me");
//         if (!mounted) return;
//         setIsLoggedIn(true);
//         const server = await api.get("/api/wishlist");
//         if (!mounted) return;
//         setWishlist(server || []);
//       } catch {
//         if (!mounted) return;
//         setIsLoggedIn(false);
//         setWishlist(loadLocal());
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     init();
//     return () => (mounted = false);
//   }, [loadLocal]);

//   useEffect(() => {
//     if (!isLoggedIn) saveLocal(wishlist);
//   }, [wishlist, isLoggedIn, saveLocal]);

//   const addToWishlist = async (product) => {
//     const productId = product._id || product.productId || product.id;
//     if (isLoggedIn) {
//       try {
//         await api.post("/api/wishlist", { productId });
//         const server = await api.get("/api/wishlist");
//         setWishlist(server || []);
//       } catch (err) { console.error(err); }
//     } else {
//       setWishlist((prev) => {
//         if (prev.some((i) => i.productId === productId)) return prev;
//         return [...prev, { productId, addedAt: Date.now(), ...product }];
//       });
//     }
//   };

//   const removeFromWishlist = async (productId) => {
//     if (isLoggedIn) {
//       try {
//         await api.del(`/api/wishlist/${productId}`);
//         const server = await api.get("/api/wishlist");
//         setWishlist(server || []);
//       } catch (err) { console.error(err); }
//     } else {
//       setWishlist((prev) => prev.filter((p) => p.productId !== productId));
//     }
//   };

//   const mergeLocalToServer = async () => {
//     const local = loadLocal();
//     if (!local.length) return;
//     try {
//       for (const it of local) {
//         await api.post("/api/wishlist", { productId: it.productId });
//       }
//       const server = await api.get("/api/wishlist");
//       setWishlist(server || []);
//       localStorage.removeItem(LOCAL_KEY);
//     } catch (err) {
//       console.error("wishlist merge failed", err);
//     }
//   };

//   return (
//     <WishlistContext.Provider value={{
//       wishlist, loading, isLoggedIn, addToWishlist, removeFromWishlist, mergeLocalToServer
//     }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// }



//  ******************************************* USER DATA (Func added) ***********************************



// context/WishlistContext.jsx
// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { api } from "../lib/api";

// const WishlistContext = createContext();
// export function useWishlist() {
//   return useContext(WishlistContext);
// }

// const LOCAL_KEY = "ajio_wishlist_v1";

// export function WishlistProvider({ children }) {
//   const [wishlist, setWishlist] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // localStorage helpers
//   const saveLocal = useCallback((items) => {
//     try {
//       localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
//     } catch (err) {
//       console.error("saveLocal (wishlist) failed", err);
//     }
//   }, []);

//   const loadLocal = useCallback(() => {
//     try {
//       const raw = localStorage.getItem(LOCAL_KEY);
//       return raw ? JSON.parse(raw) : [];
//     } catch (err) {
//       console.error("loadLocal (wishlist) failed", err);
//       return [];
//     }
//   }, []);

//   // init: check auth -> load server wishlist if logged, otherwise local
//   useEffect(() => {
//     let mounted = true;
//     const init = async () => {
//       try {
//         await api.get("/auth/me");
//         if (!mounted) return;
//         setIsLoggedIn(true);

//         const server = await api.get("/api/wishlist");
//         if (!mounted) return;
//         setWishlist(server || []);
//       } catch (err) {
//         if (!mounted) return;
//         setIsLoggedIn(false);
//         setWishlist(loadLocal());
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     init();
//     return () => {
//       mounted = false;
//     };
//   }, [loadLocal]);

//   // keep localStorage in sync when not logged in
//   useEffect(() => {
//     if (!isLoggedIn) saveLocal(wishlist);
//   }, [wishlist, isLoggedIn, saveLocal]);

//   // helper: normalize productId
//   const getProductId = (product) => product._id || product.productId || product.id;

//   // add to wishlist (local or server)
//   const addToWishlist = async (product) => {
//     const productId = getProductId(product);
//     if (!productId) {
//       console.warn("addToWishlist called with product missing id", product);
//       return;
//     }

//     if (isLoggedIn) {
//       try {
//         // server should ignore duplicates or handle idempotency
//         await api.post("/api/wishlist", { productId });
//         const server = await api.get("/api/wishlist");
//         setWishlist(server || []);
//       } catch (err) {
//         console.error("Add to wishlist (server) failed", err);
//         // fallback: keep UI responsive by updating local state
//         setWishlist((prev) => {
//           if (prev.some((i) => getProductId(i) === productId)) return prev;
//           return [...prev, { productId, addedAt: Date.now(), ...product }];
//         });
//       }
//     } else {
//       // local duplicate prevention (from Page B behavior)
//       setWishlist((prev) => {
//         if (prev.some((i) => getProductId(i) === productId)) return prev;
//         return [...prev, { productId, addedAt: Date.now(), ...product }];
//       });
//     }
//   };

//   // remove from wishlist (local or server)
//   const removeFromWishlist = async (productId) => {
//     if (!productId) return;
//     if (isLoggedIn) {
//       try {
//         await api.del(`/api/wishlist/${productId}`);
//         const server = await api.get("/api/wishlist");
//         setWishlist(server || []);
//       } catch (err) {
//         console.error("Remove from wishlist (server) failed", err);
//         // fallback local removal
//         setWishlist((prev) => prev.filter((p) => getProductId(p) !== productId));
//       }
//     } else {
//       setWishlist((prev) => prev.filter((p) => getProductId(p) !== productId));
//     }
//   };

//   // merge local (guest) wishlist into server after login
//   const mergeLocalToServer = async () => {
//     const local = loadLocal();
//     if (!local || !local.length) return;

//     try {
//       for (const it of local) {
//         const pid = getProductId(it) || it.productId;
//         if (!pid) continue;
//         // POST each item; server should handle duplicates
//         await api.post("/api/wishlist", { productId: pid });
//       }
//       const server = await api.get("/api/wishlist");
//       setWishlist(server || []);
//       localStorage.removeItem(LOCAL_KEY);
//     } catch (err) {
//       console.error("wishlist merge failed", err);
//     }
//   };

//   const value = {
//     wishlist,
//     loading,
//     isLoggedIn,
//     addToWishlist,
//     removeFromWishlist,
//     mergeLocalToServer,
//     // optional extras:
//     setWishlist,
//     LOCAL_KEY,
//   };

//   return (
//     <WishlistContext.Provider value={value}>
//       {children}
//     </WishlistContext.Provider>
//   );
// }



// *******************************************************************************************************


// src/context/WishlistContext.jsx
// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { api } from "../lib/api";

// const WishlistContext = createContext();
// export function useWishlist() { return useContext(WishlistContext); }

// const LOCAL_KEY = "ajio_wishlist_v1";

// export function WishlistProvider({ children }) {
//   const [wishlist, setWishlist] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const saveLocal = useCallback((items) => {
//     try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items || [])); } catch (err) { console.error("saveLocal (wishlist) failed", err); }
//   }, []);

//   const loadLocal = useCallback(() => {
//     try { const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : []; } catch (err) { console.error("loadLocal (wishlist) failed", err); return []; }
//   }, []);

//   useEffect(() => {
//     let mounted = true;
//     const init = async () => {
//       try {
//         setLoading(true);
//         await api.get("/auth/me");
//         if (!mounted) return;
//         setIsLoggedIn(true);
//         const server = await api.get("/api/wishlist");
//         if (!mounted) return;
//         setWishlist(server || []);
//       } catch (err) {
//         if (!mounted) return;
//         setIsLoggedIn(false);
//         setWishlist(loadLocal());
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     init();
//     return () => { mounted = false; };
//   }, [loadLocal]);

//   useEffect(() => { if (!isLoggedIn) saveLocal(wishlist); }, [wishlist, isLoggedIn, saveLocal]);

//   const getProductId = (product) => product._id || product.productId || product.id;

//   const addToWishlist = async (product) => {
//     const productId = getProductId(product);
//     if (!productId) return;
//     if (isLoggedIn) {
//       try {
//         await api.post("/api/wishlist", { productId });
//         const server = await api.get("/api/wishlist");
//         setWishlist(server || []);
//       } catch (err) {
//         console.error("Add to wishlist (server) failed", err);
//         setWishlist((prev) => prev.some((i) => getProductId(i) === productId) ? prev : [...prev, { productId, addedAt: Date.now(), ...product }]);
//       }
//     } else {
//       setWishlist((prev) => prev.some((i) => getProductId(i) === productId) ? prev : [...prev, { productId, addedAt: Date.now(), ...product }]);
//     }
//   };

//   const removeFromWishlist = async (productId) => {
//     if (!productId) return;
//     if (isLoggedIn) {
//       try {
//         await api.del(`/api/wishlist/${productId}`);
//         const server = await api.get("/api/wishlist");
//         setWishlist(server || []);
//       } catch (err) {
//         console.error("Remove from wishlist (server) failed", err);
//         setWishlist((prev) => prev.filter((p) => getProductId(p) !== productId));
//       }
//     } else {
//       setWishlist((prev) => prev.filter((p) => getProductId(p) !== productId));
//     }
//   };



//   const mergeLocalToServer = async () => {
//   const local = loadLocal();
//   if (!local || !local.length) {
//     setIsLoggedIn(true);
//     return;
//   }
//   try {
//     for (const it of local) {
//       const pid = getProductId(it) || it.productId;
//       if (!pid) continue;
//       await api.post("/api/wishlist", { productId: pid });
//     }
//     const server = await api.get("/api/wishlist");
//     setWishlist(server || []);
//     localStorage.removeItem(LOCAL_KEY);

//     // Important
//     setIsLoggedIn(true);
//   } catch (err) {
//     console.error("wishlist merge failed", err);
//   }
// };

//  const markLoggedIn = (v = true) => setIsLoggedIn(!!v);


//   const value = {
//     wishlist,
//     loading,
//     isLoggedIn,
//     addToWishlist,
//     removeFromWishlist,
//     mergeLocalToServer,
//     setWishlist,
//     LOCAL_KEY,
//     markLoggedIn
//   };

//   return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
// }

// ******************************************************************************************************************

// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { api } from "../lib/api";

// const WishlistContext = createContext();
// export function useWishlist() { return useContext(WishlistContext); }

// const LOCAL_KEY = "ajio_wishlist_v1";

// export function WishlistProvider({ children }) {
//   const [wishlist, setWishlist] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const saveLocal = useCallback((items) => {
//     try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items || [])); } catch (err) { console.error("saveLocal (wishlist) failed", err); }
//   }, []);

//   const loadLocal = useCallback(() => {
//     try { const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : []; } catch (err) { console.error("loadLocal (wishlist) failed", err); return []; }
//   }, []);

//   const normalizeItem = (it) => {
//     if (!it) return null;

//     // populated product under wishlist.productId
//     if (it.productId && typeof it.productId === "object" && (it.productId._id || it.productId.productId)) {
//       const p = it.productId;
//       return {
//         productId: String(p._id ?? p.productId ?? p.id),
//         title: p.title ?? p.name ?? "",
//         image: p.image ?? (Array.isArray(p.images) && p.images[0]) ?? null,
//         price: Number(p.price ?? it.price ?? 0),
//         mrp: Number(p.mrp ?? it.mrp ?? 0),
//         addedAt: it.addedAt ?? Date.now(),
//         raw: it,
//       };
//     }

//     // local/canonical
//     const pid = it.productId ?? it._id ?? it.id ?? (it.raw && (it.raw.productId ?? it.raw._id));
//     return {
//       productId: pid ? String(pid) : `anon-${Math.random().toString(36).slice(2, 8)}`,
//       title: it.title ?? it.name ?? "Untitled product",
//       image: it.image ?? (Array.isArray(it.images) && it.images[0]) ?? null,
//       price: Number(it.price ?? 0),
//       mrp: Number(it.mrp ?? 0),
//       addedAt: it.addedAt ?? Date.now(),
//       raw: it,
//     };
//   };

//   const normalizeList = (arr) => Array.isArray(arr) ? arr.map(normalizeItem).filter(Boolean) : [];

//   // get product id helper
//   const getPid = (it) => {
//     if (!it) return null;
//     return String(it.productId ?? it._id ?? it.id ?? (it.raw && (it.raw.productId ?? it.raw._id)) ?? it.product?._id ?? it.product?.productId ?? null);
//   };

//   // init
//   useEffect(() => {
//     let mounted = true;
//     const init = async () => {
//       try {
//         setLoading(true);
//         await api.get("/auth/me");
//         if (!mounted) return;
//         setIsLoggedIn(true);
//         const server = await api.get("/api/wishlist");
//         const arr = Array.isArray(server) ? server : (server?.data ?? server?.wishlist ?? []);
//         if (!mounted) return;
//         setWishlist(normalizeList(arr));
//       } catch (err) {
//         if (!mounted) return;
//         setIsLoggedIn(false);
//         setWishlist(normalizeList(loadLocal()));
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     init();
//     return () => { mounted = false; };
//   }, [loadLocal]);

//   useEffect(() => { if (!isLoggedIn) saveLocal(wishlist); }, [wishlist, isLoggedIn, saveLocal]);

//   const addToWishlist = async (product) => {
//     const pid = getPid(product) || (product && (product._id ?? product.productId ?? product.id));
//     if (!pid) return;
//     if (isLoggedIn) {
//       try {
//         await api.post("/api/wishlist", { productId: pid });
//         const server = await api.get("/api/wishlist");
//         const arr = Array.isArray(server) ? server : (server?.data ?? server?.wishlist ?? []);
//         setWishlist(normalizeList(arr));
//       } catch (err) {
//         console.error("Add to wishlist (server) failed", err);
//         setWishlist((prev) => prev.some((i) => i.productId === String(pid)) ? prev : [...prev, normalizeItem({ productId: pid, ...product })]);
//       }
//     } else {
//       setWishlist((prev) => prev.some((i) => i.productId === String(pid)) ? prev : [...prev, normalizeItem({ productId: pid, ...product })]);
//     }
//   };

//   const removeFromWishlist = async (productIdOrEntryId) => {
//     if (!productIdOrEntryId) return;
//     if (isLoggedIn) {
//       try {
//         await api.del(`/api/wishlist/${encodeURIComponent(productIdOrEntryId)}`);
//         const server = await api.get("/api/wishlist");
//         const arr = Array.isArray(server) ? server : (server?.data ?? server?.wishlist ?? []);
//         setWishlist(normalizeList(arr));
//       } catch (err) {
//         console.error("Remove from wishlist (server) failed", err);
//         setWishlist((prev) => prev.filter((p) => p.productId !== String(productIdOrEntryId) && !(p.raw && p.raw._id === productIdOrEntryId)));
//       }
//     } else {
//       setWishlist((prev) => prev.filter((p) => p.productId !== String(productIdOrEntryId) && !(p.raw && p.raw._id === productIdOrEntryId)));
//     }
//   };

//   const mergeLocalToServer = async () => {
//     const local = loadLocal();
//     if (!local || !local.length) {
//       setIsLoggedIn(true);
//       return;
//     }
//     try {
//       for (const it of local) {
//         const pid = getPid(it);
//         if (!pid) continue;
//         try {
//           await api.post("/api/wishlist", { productId: pid });
//         } catch (e) {
//           console.warn("wishlist merge item failed", pid, e?.message || e);
//         }
//       }
//       const server = await api.get("/api/wishlist");
//       const arr = Array.isArray(server) ? server : (server?.data ?? server?.wishlist ?? []);
//       setWishlist(normalizeList(arr));
//       localStorage.removeItem(LOCAL_KEY);
//       setIsLoggedIn(true);
//     } catch (err) {
//       console.error("wishlist merge failed", err);
//     }
//   };

//   const markLoggedIn = (v = true) => setIsLoggedIn(!!v);

//   const value = {
//     wishlist,
//     loading,
//     isLoggedIn,
//     addToWishlist,
//     removeFromWishlist,
//     mergeLocalToServer,
//     setWishlist,
//     LOCAL_KEY,
//     markLoggedIn,
//   };

//   return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
// }


// ***********************************************************


// src/context/WishlistContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const WishlistContext = createContext();

// Named hook export (important)
export function useWishlist() {
  return useContext(WishlistContext);
}

const LOCAL_KEY = "ajio_wishlist_v1";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const saveLocal = useCallback((items) => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items || [])); } catch (err) { console.error("saveLocal (wishlist) failed", err); }
  }, []);

  const loadLocal = useCallback(() => {
    try { const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : []; } catch (err) { console.error("loadLocal (wishlist) failed", err); return []; }
  }, []);

  const normalizeItem = (it) => {
    if (!it) return null;

    // populated product under wishlist.productId
    if (it.productId && typeof it.productId === "object" && (it.productId._id || it.productId.productId)) {
      const p = it.productId;
      return {
        productId: String(p._id ?? p.productId ?? p.id),
        title: p.title ?? p.name ?? "",
        image: p.image ?? (Array.isArray(p.images) && p.images[0]) ?? null,
        price: Number(p.price ?? it.price ?? 0),
        mrp: Number(p.mrp ?? it.mrp ?? 0),
        addedAt: it.addedAt ?? Date.now(),
        raw: it,
      };
    }

    // local/canonical
    const pid = it.productId ?? it._id ?? it.id ?? (it.raw && (it.raw.productId ?? it.raw._id));
    return {
      productId: pid ? String(pid) : `anon-${Math.random().toString(36).slice(2, 8)}`,
      title: it.title ?? it.name ?? "Untitled product",
      image: it.image ?? (Array.isArray(it.images) && it.images[0]) ?? null,
      price: Number(it.price ?? 0),
      mrp: Number(it.mrp ?? 0),
      addedAt: it.addedAt ?? Date.now(),
      raw: it,
    };
  };

  const normalizeList = (arr) => Array.isArray(arr) ? arr.map(normalizeItem).filter(Boolean) : [];

  // get product id helper
  const getPid = (it) => {
    if (!it) return null;
    return String(it.productId ?? it._id ?? it.id ?? (it.raw && (it.raw.productId ?? it.raw._id)) ?? it.product?._id ?? it.product?.productId ?? null);
  };

  // init
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        setLoading(true);
        await api.get("/auth/me");
        if (!mounted) return;
        setIsLoggedIn(true);
        const server = await api.get("/api/wishlist");
        const arr = Array.isArray(server) ? server : (server?.data ?? server?.wishlist ?? []);
        if (!mounted) return;
        setWishlist(normalizeList(arr));
      } catch (err) {
        if (!mounted) return;
        setIsLoggedIn(false);
        setWishlist(normalizeList(loadLocal()));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, [loadLocal]);

  useEffect(() => { if (!isLoggedIn) saveLocal(wishlist); }, [wishlist, isLoggedIn, saveLocal]);

  const addToWishlist = async (product) => {
    const pid = getPid(product) || (product && (product._id ?? product.productId ?? product.id));
    if (!pid) return;
    if (isLoggedIn) {
      try {
        await api.post("/api/wishlist", { productId: pid });
        const server = await api.get("/api/wishlist");
        const arr = Array.isArray(server) ? server : (server?.data ?? server?.wishlist ?? []);
        setWishlist(normalizeList(arr));
      } catch (err) {
        console.error("Add to wishlist (server) failed", err);
        setWishlist((prev) => prev.some((i) => i.productId === String(pid)) ? prev : [...prev, normalizeItem({ productId: pid, ...product })]);
      }
    } else {
      setWishlist((prev) => prev.some((i) => i.productId === String(pid)) ? prev : [...prev, normalizeItem({ productId: pid, ...product })]);
    }
  };

  const removeFromWishlist = async (productIdOrEntryId) => {
    if (!productIdOrEntryId) return;
    if (isLoggedIn) {
      try {
        await api.del(`/api/wishlist/${encodeURIComponent(productIdOrEntryId)}`);
        const server = await api.get("/api/wishlist");
        const arr = Array.isArray(server) ? server : (server?.data ?? server?.wishlist ?? []);
        setWishlist(normalizeList(arr));
      } catch (err) {
        console.error("Remove from wishlist (server) failed", err);
        setWishlist((prev) => prev.filter((p) => p.productId !== String(productIdOrEntryId) && !(p.raw && p.raw._id === productIdOrEntryId)));
      }
    } else {
      setWishlist((prev) => prev.filter((p) => p.productId !== String(productIdOrEntryId) && !(p.raw && p.raw._id === productIdOrEntryId)));
    }
  };

  const mergeLocalToServer = async () => {
    const local = loadLocal();
    if (!local || !local.length) {
      setIsLoggedIn(true);
      return;
    }
    try {
      for (const it of local) {
        const pid = getPid(it);
        if (!pid) continue;
        try {
          await api.post("/api/wishlist", { productId: pid });
        } catch (e) {
          console.warn("wishlist merge item failed", pid, e?.message || e);
        }
      }
      const server = await api.get("/api/wishlist");
      const arr = Array.isArray(server) ? server : (server?.data ?? server?.wishlist ?? []);
      setWishlist(normalizeList(arr));
      localStorage.removeItem(LOCAL_KEY);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("wishlist merge failed", err);
    }
  };

  const markLoggedIn = (v = true) => setIsLoggedIn(!!v);

  // expose
  const value = {
    wishlist,
    loading,
    isLoggedIn,
    addToWishlist,
    removeFromWishlist,
    mergeLocalToServer,
    setWishlist,
    LOCAL_KEY,
    markLoggedIn,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
