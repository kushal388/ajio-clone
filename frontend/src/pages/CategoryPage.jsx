


// src/pages/CategoryPage.jsx


// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import axios from "axios";

// const PRICE_BUCKETS = [
//   { label: "Under ₹999", min: null, max: 999 },
//   { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
//   { label: "₹2000 - ₹4999", min: 2000, max: 4999 },
//   { label: "₹5000+", min: 5000, max: null },
// ];

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// export default function CategoryPage() {
//   const { category, subcategory } = useParams();
//   const [searchParams] = useSearchParams();

//   // UI state
//   const [gridCols, setGridCols] = useState(4);
//   const [sort, setSort] = useState("relevance");
//   const [page, setPage] = useState(1);
//   const limit = 24;

//   // Filters
//   const [genders, setGenders] = useState(new Set());
//   const [brands, setBrands] = useState(new Set());
//   const [priceRange, setPriceRange] = useState({ min: null, max: null });

//   // Data
//   const [products, setProducts] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Preselect brand if present as ?brand=...
//   useEffect(() => {
//     const b = searchParams.get("brand");
//     if (b) setBrands(new Set([b]));
//   }, [searchParams]);

//   // Build query params for API
//   const params = useMemo(() => {
//     const p = {};
//     // if (category) p.category = category.toLowerCase();
//     if (category) p.category = category;
//     if (subcategory) p.subcategory = subcategory;

//     const g = [...genders];
//     if (g.length) p.gender = g[0]; // backend expects single gender; send first selected

//     const b = [...brands];
//     if (b.length) p.brand = b.join(",");

//     if (priceRange.min != null) p.minPrice = priceRange.min;
//     if (priceRange.max != null) p.maxPrice = priceRange.max;

//     p.sort = sort;
//     p.page = page;
//     p.limit = limit;

//     return p;
//   }, [category, subcategory, genders, brands, priceRange, sort, page]);

//   // Fetch products
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const { data } = await api.get("/products", { params });
//         if (!cancelled) {
//           setProducts(data.items || []);
//           setTotal(data.total || 0);
//         }
//       } catch (e) {
//         if (!cancelled) setError(e?.response?.data?.error || e.message);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [params]);

//   // Brand options from current result (fallback list if empty)
//   const brandOptions = useMemo(() => {
//     const s = new Set();
//     products.forEach(p => p.brand && s.add(p.brand));
//     return s.size ? Array.from(s).sort() : ["Puma","Nike","Levis","Buda Jeans Co","POSHAX"];
//   }, [products]);

//   // Helpers
//   const toggleSet = (set, value) => {
//     const copy = new Set(set);
//     copy.has(value) ? copy.delete(value) : copy.add(value);
//     return copy;
//     };
//   const totalPages = Math.max(1, Math.ceil(total / limit));

//   return (
//     <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
//       {/* Breadcrumb */}
//       <div className="text-sm text-gray-500 mb-2">
//         Home / {category || "All"} {subcategory ? `/ ${subcategory}` : ""}
//       </div>

//       {/* Title */}
//       <h1 className="text-3xl font-serif text-gray-900 text-center mb-6">
//         {subcategory || (category ? category.toUpperCase() : "All Products")}
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
//         {/* Sidebar */}
//         <aside className="space-y-6">
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Refine By</h3>
//             {/* Gender */}
//             <div className="border-t">
//               <button className="w-full flex items-center justify-between py-3 font-medium">
//                 <span>Gender</span>
//               </button>
//               <div className="space-y-2 pb-3">
//                 {["Men","Women","Boys","Girls","Unisex"].map(g => (
//                   <label key={g} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={genders.has(g)}
//                       onChange={() => {
//                         setGenders(toggleSet(genders, g));
//                         setPage(1);
//                       }}
//                     />
//                     {g}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Category list (static look – optional) */}
//             <div className="border-t">
//               <button className="w-full flex items-center justify-between py-3 font-medium">
//                 <span>Category</span>
//               </button>
//               <div className="text-sm text-gray-600 pb-3">
//                 {subcategory ? subcategory : "All"}
//               </div>
//             </div>

//             {/* Price */}
//             <div className="border-t">
//               <button className="w-full flex items-center justify-between py-3 font-medium">
//                 <span>Price</span>
//               </button>
//               <div className="space-y-2 pb-3">
//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="radio"
//                     name="price"
//                     checked={priceRange.min == null && priceRange.max == null}
//                     onChange={() => { setPriceRange({ min: null, max: null }); setPage(1); }}
//                   />
//                   Any
//                 </label>
//                 {PRICE_BUCKETS.map(b => {
//                   const checked =
//                     (priceRange.min ?? null) === (b.min ?? null) &&
//                     (priceRange.max ?? null) === (b.max ?? null);
//                   return (
//                     <label key={b.label} className="flex items-center gap-2 text-sm">
//                       <input
//                         type="radio"
//                         name="price"
//                         checked={checked}
//                         onChange={() => { setPriceRange({ min: b.min, max: b.max }); setPage(1); }}
//                       />
//                       {b.label}
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Brands */}
//             <div className="border-t">
//               <button className="w-full flex items-center justify-between py-3 font-medium">
//                 <span>Brands</span>
//               </button>
//               <div className="space-y-2 max-h-56 overflow-auto pr-1 pb-3">
//                 {brandOptions.map(br => (
//                   <label key={br} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={brands.has(br)}
//                       onChange={() => { setBrands(toggleSet(brands, br)); setPage(1); }}
//                     />
//                     {br}
//                   </label>
//                 ))}
//                 {!brandOptions.length && (
//                   <div className="text-sm text-gray-400">No brands</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main */}
//         <main className="space-y-4">
//           {/* Top bar */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//             <div className="text-sm text-gray-600">
//               {loading ? "Loading..." : error ? (
//                 <span className="text-red-600">Error: {error}</span>
//               ) : (
//                 <span>{total} Items Found</span>
//               )}
//             </div>

//             <div className="flex items-center gap-4">
//               {/* Grid switcher */}
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="text-gray-500">GRID</span>
//                 {[3,4,5].map(cols => (
//                   <button
//                     key={cols}
//                     onClick={() => setGridCols(cols)}
//                     className={`px-2 py-1 border rounded ${gridCols===cols ? "bg-gray-900 text-white" : "bg-white"}`}
//                     title={`${cols} columns`}
//                   >
//                     {"▦".repeat(Math.min(cols, 5))}
//                   </button>
//                 ))}
//               </div>

//               {/* Sort */}
//               <div className="text-sm">
//                 <span className="mr-2 text-gray-500">Sort By</span>
//                 <select
//                   value={sort}
//                   onChange={(e) => { setSort(e.target.value); setPage(1); }}
//                   className="border rounded px-2 py-1"
//                 >
//                   <option value="relevance">Relevance</option>
//                   <option value="lowtohigh">Price: Low to High</option>
//                   <option value="hightolow">Price: High to Low</option>
//                   <option value="newest">Newest</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Grid */}
//           <div
//             className={`grid gap-6 ${
//               gridCols === 3
//                 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                 : gridCols === 5
//                 ? "grid-cols-1 sm:grid-cols-3 xl:grid-cols-5"
//                 : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
//             }`}
//           >
//             {!loading && !error && products.length === 0 && (
//               <div className="col-span-full text-center text-gray-500 py-10">
//                 No products found.
//               </div>
//             )}

//             {(loading ? Array.from({ length: 8 }).map((_, i) => ({ _id: i })) : products).map((p, index) => (
//               <div
//                 key={p.productId || p._id || index}
//                 className="relative border rounded-lg overflow-hidden hover:shadow-md transition"
//               >
//                 {/* tags */}
//                 {!loading && index % 2 === 0 && (
//                   <span className="absolute top-2 left-2 text-[10px] font-semibold bg-gray-900 text-white px-2 py-1 rounded">
//                     BESTSELLER
//                   </span>
//                 )}
//                 {!loading && index % 3 === 0 && (
//                   <span className="absolute top-2 right-2 text-[10px] font-semibold bg-green-600 text-white px-2 py-1 rounded">
//                     NEW
//                   </span>
//                 )} 

//                 {/* image / skeleton */}
//                 <div className="aspect-[4/5] bg-gray-100">
//                   {loading ? (
//                     <div className="w-full h-full animate-pulse bg-gray-200" />
//                   ) : (
//                     <img
//                       src={p.image}
//                       alt={p.title}
//                       className="w-full h-full object-cover"
//                       loading="lazy"
//                     />
//                   )}
//                 </div>

//                 {/* content */}
//                 <div className="p-3">
//                   <div className="text-xs text-gray-600">{loading ? "…" : (p.brand || " ")}</div>
//                   <div className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
//                     {loading ? "Loading…" : p.title}
//                   </div>

//                   {/* rating */}
//                   <div className="text-xs text-green-700 mt-1">
//                     {loading ? " " : (p.rating ? `${p.rating}★ | ${p.ratingCount || 0}` : "—")}
//                   </div>

//                   {/* prices */}
//                   <div className="mt-2 flex items-baseline gap-2">
//                     <div className="text-lg font-semibold">₹{loading ? "…" : p.price}</div>
//                     {(!loading && p.mrp) && (
//                       <div className="text-sm text-gray-500 line-through">₹{p.mrp}</div>
//                     )}
//                     {(!loading && p.discountPercent != null) && (
//                       <div className="text-sm text-green-700">({p.discountPercent}% off)</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {!loading && total > limit && (
//             <div className="flex items-center justify-center gap-4 pt-4">
//               <button
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//                 disabled={page === 1}
//                 onClick={() => setPage(p => Math.max(1, p - 1))}
//               >
//                 Prev
//               </button>
//               <span className="text-sm">
//                 Page <b>{page}</b> / {totalPages}
//               </span>
//               <button
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//                 disabled={page >= totalPages}
//                 onClick={() => setPage(p => p + 1)}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }



// ************************** DISPLAY PAGE ******************************


// src/pages/CategoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const PRICE_BUCKETS = [
  { label: "Under ₹999", min: null, max: 999 },
  { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
  { label: "₹2000 - ₹4999", min: 2000, max: 4999 },
  { label: "₹5000+", min: 5000, max: null },
];

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default function CategoryPage() {
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();

  // UI state
  const [gridCols, setGridCols] = useState(4);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const limit = 24;

  // Filters
  const [genders, setGenders] = useState(new Set());
  const [brands, setBrands] = useState(new Set());
  const [priceRange, setPriceRange] = useState({ min: null, max: null });

  // Data
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Preselect brand if present as ?brand=...
  useEffect(() => {
    const b = searchParams.get("brand");
    if (b) setBrands(new Set([b]));
  }, [searchParams]);

  // Build query params for API
  const params = useMemo(() => {
    const p = {};
    if (category) p.category = category;
    if (subcategory) p.subcategory = subcategory;

    const g = [...genders];
    if (g.length) p.gender = g[0];

    const b = [...brands];
    if (b.length) p.brand = b.join(",");

    if (priceRange.min != null) p.minPrice = priceRange.min;
    if (priceRange.max != null) p.maxPrice = priceRange.max;

    p.sort = sort;
    p.page = page;
    p.limit = limit;

    return p;
  }, [category, subcategory, genders, brands, priceRange, sort, page]);

  // Fetch products
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products", { params });
        if (!cancelled) {
          setProducts(data.items || []);
          setTotal(data.total || 0);
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params]);

  // Brand options from current result (fallback list if empty)
  const brandOptions = useMemo(() => {
    const s = new Set();
    products.forEach(p => p.brand && s.add(p.brand));
    return s.size ? Array.from(s).sort() : ["Puma","Nike","Levis","Buda Jeans Co","POSHAX"];
  }, [products]);

  const toggleSet = (set, value) => {
    const copy = new Set(set);
    copy.has(value) ? copy.delete(value) : copy.add(value);
    return copy;
  };
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        Home / {category || "All"} {subcategory ? `/ ${subcategory}` : ""}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-serif text-gray-900 text-center mb-6">
        {subcategory || (category ? category.toUpperCase() : "All Products")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Refine By</h3>

            {/* Gender */}
            <div className="border-t">
              <button className="w-full flex items-center justify-between py-3 font-medium">
                <span>Gender</span>
              </button>
              <div className="space-y-2 pb-3">
                {["Men","Women","Boys","Girls","Unisex"].map(g => (
                  <label key={g} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={genders.has(g)}
                      onChange={() => {
                        setGenders(toggleSet(genders, g));
                        setPage(1);
                      }}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Category (display only) */}
            <div className="border-t">
              <button className="w-full flex items-center justify-between py-3 font-medium">
                <span>Category</span>
              </button>
              <div className="text-sm text-gray-600 pb-3">
                {subcategory ? subcategory : "All"}
              </div>
            </div>

            {/* Price */}
            <div className="border-t">
              <button className="w-full flex items-center justify-between py-3 font-medium">
                <span>Price</span>
              </button>
              <div className="space-y-2 pb-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange.min == null && priceRange.max == null}
                    onChange={() => { setPriceRange({ min: null, max: null }); setPage(1); }}
                  />
                  Any
                </label>
                {PRICE_BUCKETS.map(b => {
                  const checked =
                    (priceRange.min ?? null) === (b.min ?? null) &&
                    (priceRange.max ?? null) === (b.max ?? null);
                  return (
                    <label key={b.label} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="price"
                        checked={checked}
                        onChange={() => { setPriceRange({ min: b.min, max: b.max }); setPage(1); }}
                      />
                      {b.label}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Brands */}
            <div className="border-t">
              <button className="w-full flex items-center justify-between py-3 font-medium">
                <span>Brands</span>
              </button>
              <div className="space-y-2 max-h-56 overflow-auto pr-1 pb-3">
                {brandOptions.map(br => (
                  <label key={br} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={brands.has(br)}
                      onChange={() => { setBrands(toggleSet(brands, br)); setPage(1); }}
                    />
                    {br}
                  </label>
                ))}
                {!brandOptions.length && (
                  <div className="text-sm text-gray-400">No brands</div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="space-y-4">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-gray-600">
              {loading ? "Loading..." : error ? (
                <span className="text-red-600">Error: {error}</span>
              ) : (
                <span>{total} Items Found</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Grid switcher */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">GRID</span>
                {[3,4,5].map(cols => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`px-2 py-1 border rounded ${gridCols===cols ? "bg-gray-900 text-white" : "bg-white"}`}
                    title={`${cols} columns`}
                  >
                    {"▦".repeat(Math.min(cols, 5))}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="text-sm">
                <span className="mr-2 text-gray-500">Sort By</span>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="border rounded px-2 py-1"
                >
                  <option value="relevance">Relevance</option>
                  <option value="lowtohigh">Price: Low to High</option>
                  <option value="hightolow">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div
            className={`grid gap-6 ${
              gridCols === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : gridCols === 5
                ? "grid-cols-1 sm:grid-cols-3 xl:grid-cols-5"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {!loading && !error && products.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                No products found.
              </div>
            )}

            {(loading ? Array.from({ length: 8 }).map((_, i) => ({ _id: i })) : products).map((p, index) => (
              <Link
                key={p.productId || p._id || index}
                to={`/product/${p._id || p.productId}`}
                className="relative border rounded-lg overflow-hidden hover:shadow-md transition block"
              >
                {/* tags */}
                {!loading && index % 2 === 0 && (
                  <span className="absolute top-2 left-2 text-[10px] font-semibold bg-gray-900 text-white px-2 py-1 rounded">
                    BESTSELLER
                  </span>
                )}
                {!loading && index % 3 === 0 && (
                  <span className="absolute top-2 right-2 text-[10px] font-semibold bg-green-600 text-white px-2 py-1 rounded">
                    NEW
                  </span>
                )}

                {/* image / skeleton */}
                <div className="aspect-[4/5] bg-gray-100">
                  {loading ? (
                    <div className="w-full h-full animate-pulse bg-gray-200" />
                  ) : (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* content */}
                <div className="p-3">
                  <div className="text-xs text-gray-600">{loading ? "…" : (p.brand || " ")}</div>
                  <div className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                    {loading ? "Loading…" : p.title}
                  </div>

                  {/* rating */}
                  <div className="text-xs text-green-700 mt-1">
                    {loading ? " " : (p.rating ? `${p.rating}★ | ${p.ratingCount || 0}` : "—")}
                  </div>

                  {/* prices */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <div className="text-lg font-semibold">₹{loading ? "…" : p.price}</div>
                    {(!loading && p.mrp) && (
                      <div className="text-sm text-gray-500 line-through">₹{p.mrp}</div>
                    )}
                    {(!loading && p.discountPercent != null) && (
                      <div className="text-sm text-green-700">({p.discountPercent}% off)</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {!loading && total > limit && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="text-sm">
                Page <b>{page}</b> / {totalPages}
              </span>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
