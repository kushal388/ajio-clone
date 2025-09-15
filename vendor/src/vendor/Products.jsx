// src/vendor/Products.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Products = () => {
//   const [products, setProducts] = useState([]);

// //   useEffect(() => {
// //     axios
// //       .get("/api/vendor/products", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("vendor_token")}`, // vendor JWT
// //         },
// //       })
// //       .then((res) => setProducts(res.data))
// //       .catch((err) => console.error(err));
// //   }, []);


// useEffect(() => {
//   axios
//     .get("http://localhost:5000/api/vendor/products", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("vendor_token")}`,
//       },
//     })
//     .then((res) => {
//       console.log("Products API Response:", res.data); // 🔍 log here
//       if (Array.isArray(res.data)) {
//         setProducts(res.data);
//       } else if (res.data.products && Array.isArray(res.data.products)) {
//         setProducts(res.data.products);
//       } else {
//         setProducts([]);
//         console.warn("Unexpected response format:", res.data);
//       }
//     })
//     .catch((err) => console.error(err));
// }, []);

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Products</h2>
//       <div className="grid grid-cols-3 gap-4">
//         {products.map((p) => (
//           <div key={p._id} className="border rounded p-4 shadow">
//             <img
//               src={p.image}
//               alt={p.title}
//               className="h-32 w-full object-cover mb-2"
//             />
//             <h3 className="font-semibold">{p.title}</h3>
//             <p>₹{p.price}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Products;  // ✅ make sure this is here

// *******************************************************************************************************

// src/vendor/Products.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Products = () => {
//   const [products, setProducts] = useState([]); // always array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchProducts() {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("vendor_token");
//         console.log("vendor_token (exists?):", !!token);

//         const res = await axios.get(
//           // use relative path if your Vite dev server proxies /api to backend,
//           // otherwise use full backend URL e.g. "http://localhost:5000/api/vendor/products"
//           "/api/vendor/products",
//           {
//             headers: {
//               Authorization: token ? `Bearer ${token}` : "",
//             },
//             // withCredentials: true, // enable if your backend relies on cookies
//           }
//         );

//         console.log("Products API Response (res.data):", res.data);

//         // Normalize response into an array
//         if (Array.isArray(res.data)) {
//           setProducts(res.data);
//         } else if (Array.isArray(res.data.products)) {
//           setProducts(res.data.products);
//         } else if (Array.isArray(res.data.data)) {
//           setProducts(res.data.data);
//         } else {
//           // server might return error object like { message: "Unauthorized" }
//           setProducts([]); // safe fallback
//           setError("Unexpected response format from server. See console.");
//           console.warn("Unexpected products response:", res.data);
//         }
//       } catch (err) {
//         console.error("Products fetch error:", err.response?.data || err.message);
//         setProducts([]);
//         setError(err.response?.data?.message || err.message || "Network error");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   if (loading) return <div className="p-4">Loading products…</div>;
//   if (error)
//     return (
//       <div className="p-4 text-red-600">
//         Error loading products: {error}
//         <div className="text-sm text-gray-500 mt-2">Check browser console / network tab.</div>
//       </div>
//     );

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Products</h2>

//       {products.length === 0 ? (
//         <div className="p-4 text-gray-600">No products found.</div>
//       ) : (
//         <div className="grid grid-cols-3 gap-4">
//           {products.map((p) => (
//             <div key={p._id || p.id} className="border rounded p-4 shadow">
//               <img src={p.image || p.images?.[0] || ""} alt={p.title || "Product"} className="h-32 w-full object-cover mb-2" />
//               <h3 className="font-semibold">{p.title || "Untitled"}</h3>
//               <p>₹{p.price ?? "N/A"}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;




// **************************************************************************

// src/vendor/Products.jsx
// import React, { useEffect, useState } from "react";
// import api from "../utils/api";

// const Products = () => {
//   const [products, setProducts] = useState([]); // always keep as array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     async function load() {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await api.get("/api/vendor/products");
//         console.log("Products API res.data:", res.data);

//         if (Array.isArray(res.data)) {
//           if (mounted) setProducts(res.data);
//         } else if (Array.isArray(res.data.products)) {
//           if (mounted) setProducts(res.data.products);
//         } else if (Array.isArray(res.data.data)) {
//           if (mounted) setProducts(res.data.data);
//         } else {
//           // Unexpected response (could be { message: "Unauthorized" } etc.)
//           if (mounted) setProducts([]);
//           setError("Unexpected response from server. See console/network tab.");
//           console.warn("Unexpected products response:", res.data);
//         }
//       } catch (err) {
//         console.error("Products fetch error:", err.response?.data || err.message);
//         if (mounted) setProducts([]);
//         setError(err.response?.data?.message || err.message || "Network error");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (loading) return <div className="p-4">Loading products…</div>;
//   if (error)
//     return (
//       <div className="p-4 text-red-600">
//         Error loading products: {error}
//         <div className="text-sm text-gray-500 mt-2">Open browser console / network tab to inspect.</div>
//       </div>
//     );

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">My Products</h2>

//       {products.length === 0 ? (
//         <div className="p-4 text-gray-600">No products found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((p) => (
//             <div key={p._id || p.id} className="border rounded p-4 shadow">
//               <img
//                 src={p.image || p.images?.[0] || ""}
//                 alt={p.title || "Product"}
//                 className="h-32 w-full object-cover mb-2"
//               />
//               <h3 className="font-semibold">{p.title || "Untitled"}</h3>
//               <p className="text-sm text-gray-700">₹{p.price ?? "N/A"}</p>
//               {p.brand && <div className="text-xs text-gray-500 mt-1">{p.brand}</div>}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;


// *************************************


// import React, { useEffect, useState } from "react";
// import api from "../utils/api";
// import useDebounce from "./useDebounce";
// import ProductCard from "./ProductCard";
// import ProductForm from "./ProductForm";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI state
//   const [q, setQ] = useState("");
//   const debouncedQ = useDebounce(q, 300);

//   const [page, setPage] = useState(1);
//   const perPage = 12;
//   const [total, setTotal] = useState(0);

//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState(null);

//   async function fetchProducts() {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get("/api/vendor/products", {
//         params: { q: debouncedQ || undefined, page, perPage },
//       });
//       // server returns { products, total } or an array
//       if (res.data?.products) {
//         setProducts(res.data.products);
//         setTotal(res.data.total ?? res.data.products.length);
//       } else if (Array.isArray(res.data)) {
//         setProducts(res.data);
//         setTotal(res.data.length);
//       } else {
//         setProducts([]);
//         console.warn("Unexpected products response:", res.data);
//       }
//     } catch (err) {
//       console.error("Products fetch error:", err.response?.data || err.message);
//       setProducts([]);
//       setError(err.response?.data?.message || err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debouncedQ, page]);

//   function openAdd() {
//     setEditing(null);
//     setFormOpen(true);
//   }

//   function openEdit(p) {
//     setEditing(p);
//     setFormOpen(true);
//   }

//   async function handleDelete(product) {
//     if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
//     try {
//       await api.delete(`/api/vendor/products/${product._id || product.id}`);
//       // remove locally
//       setProducts((prev) => prev.filter((x) => String(x._id || x.id) !== String(product._id || product.id)));
//       // optionally refetch
//       // fetchProducts();
//     } catch (err) {
//       console.error("Delete error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   }

//   function handleSaved(savedData) {
//     // server may return the saved product as .product or .data
//     const product = savedData?.product || savedData?.data || savedData;
//     if (!product) {
//       // if server didn't return product, just refetch
//       fetchProducts();
//       return;
//     }

//     // if editing, replace, else prepend
//     const id = product._id || product.id;
//     setProducts((prev) => {
//       const exists = prev.find((p) => String(p._id || p.id) === String(id));
//       if (exists) {
//         return prev.map((p) => (String(p._id || p.id) === String(id) ? product : p));
//       }
//       return [product, ...prev];
//     });
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">My Products</h2>
//         <div className="flex items-center gap-3">
//           <input
//             value={q}
//             onChange={(e) => {
//               setPage(1);
//               setQ(e.target.value);
//             }}
//             placeholder="Search products by title / brand / id..."
//             className="border rounded p-2 w-72"
//           />
//           <button onClick={openAdd} className="px-4 py-2 rounded bg-blue-600 text-white">
//             + Add Product
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="p-4">Loading products…</div>
//       ) : error ? (
//         <div className="p-4 text-red-600">
//           Error loading products: {error}
//           <div className="text-sm text-gray-500 mt-2">Open browser console / network tab to inspect.</div>
//         </div>
//       ) : products.length === 0 ? (
//         <div className="p-4 text-gray-600">No products found.</div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {products.map((p) => (
//               <ProductCard
//                 key={p._id || p.id}
//                 p={p}
//                 onEdit={openEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>

//           {/* Simple pagination */}
//           <div className="mt-6 flex items-center justify-between">
//             <div className="text-sm text-gray-600">
//               Showing {products.length} of {total}
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setPage((s) => Math.max(1, s - 1))}
//                 disabled={page === 1}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               <div className="px-3 py-1 border rounded">Page {page}</div>
//               <button
//                 onClick={() => setPage((s) => s + 1)}
//                 className="px-3 py-1 border rounded"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       <ProductForm
//         open={formOpen}
//         onClose={() => setFormOpen(false)}
//         onSaved={handleSaved}
//         initial={editing || {}}
//         api={api}
//       />
//     </div>
//   );
// }



// ***************************************************************************************

//vednor/src/vendor/Products.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api"; // your axios wrapper
import useDebounce from "./useDebounce";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);

  const [page, setPage] = useState(1);
  const perPage = 12;
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/vendor/products", {
        params: { q: debouncedQ || undefined, page, perPage },
      });
      if (res.data?.products) {
        setProducts(res.data.products);
        setTotal(res.data.total ?? res.data.products.length);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
        setTotal(res.data.length);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Products fetch error:", err.response?.data || err.message);
      setProducts([]);
      setError(err.response?.data?.message || err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, page]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(p) {
    setEditing(p);
    setFormOpen(true);
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.title}"?`)) return;
    try {
      await api.delete(`/api/vendor/products/${product._id || product.id}`);
      setProducts((prev) => prev.filter((x) => String(x._id || x.id) !== String(product._id || product.id)));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  function handleSaved(savedData) {
    const product = savedData?.product || savedData?.data || savedData;
    if (!product) {
      fetchProducts();
      return;
    }
    const id = product._id || product.id;
    setProducts((prev) => {
      const exists = prev.find((p) => String(p._id || p.id) === String(id));
      if (exists) return prev.map((p) => (String(p._id || p.id) === String(id) ? product : p));
      return [product, ...prev];
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Products</h2>
        <div className="flex items-center gap-3">
          <input value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} placeholder="Search products by title/brand/sku..." className="border rounded p-2 w-72" />
          <button onClick={openAdd} className="px-4 py-2 rounded bg-blue-600 text-white">+ Add Product</button>
        </div>
      </div>

      {loading ? <div className="p-4">Loading products…</div> : error ? (
        <div className="p-4 text-red-600">Error: {error}</div>
      ) : products.length === 0 ? <div className="p-4 text-gray-600">No products found.</div> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => <ProductCard key={p._id || p.id} p={p} onEdit={openEdit} onDelete={handleDelete} />)}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {products.length} of {total}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <div className="px-3 py-1 border rounded">Page {page}</div>
              <button onClick={() => setPage((s) => s + 1)} className="px-3 py-1 border rounded">Next</button>
            </div>
          </div>
        </>
      )}

      <ProductForm open={formOpen} onClose={() => setFormOpen(false)} onSaved={handleSaved} initial={editing || {}} api={api} />
    </div>
  );
}
