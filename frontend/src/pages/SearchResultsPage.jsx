import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify"; // optional, if you want to link to category pages

// Small ProductCard used in both results and recently viewed
const ProductCard = ({ p }) => {
  // p is expected to have: _id or id, image (url), brand, title, price, mrp, discountPercent
  const price = p.price ?? p.offerPrice ?? p.finalPrice ?? 0;
  const mrp = p.mrp ?? p.originalPrice ?? 0;
  const discount = p.discountPercent ?? (mrp ? Math.round(((mrp - price) / mrp) * 100) : 0);

  return (
    <div className="flex flex-col items-center text-center p-3">
      <div className="w-40 h-48 mb-3 bg-white flex items-center justify-center overflow-hidden">
        <img
          src={p.image || p.images?.[0] || "/placeholder.png"}
          alt={p.title || p.brand}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="text-sm font-semibold tracking-wide text-[#6a4b2a]">
        {p.brand || p.seller || "Brand"}
      </div>
      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{p.title || p.name}</div>

      <div className="mt-2 text-sm">
        <span className="font-semibold">₹{price}</span>{" "}
        {mrp ? <span className="line-through text-xs text-gray-400 ml-2">₹{mrp}</span> : null}
        {discount ? <div className="text-xs text-green-700">({discount}% off)</div> : null}
      </div>
    </div>
  );
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage() {
  const queryParams = useQuery();
  const query = queryParams.get("query") ?? "";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // array of product objects
  const [error, setError] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // fetch search results from server
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data = await res.json();
        // expect data to be an array of product objects
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Could not fetch search results. Try again later.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  useEffect(() => {
    // load recently viewed from localStorage
    // expected key: 'recentlyViewed' (you can change)
    const rv = localStorage.getItem("recentlyViewed");
    if (!rv) return setRecentlyViewed([]);

    try {
      const parsed = JSON.parse(rv);
      if (!Array.isArray(parsed)) {
        setRecentlyViewed([]);
        return;
      }

      // If parsed items look like full product objects (have image/title/price) -> use directly
      const looksLikeObjects = parsed.length > 0 && typeof parsed[0] === "object" && (parsed[0].image || parsed[0].title || parsed[0].brand);
      if (looksLikeObjects) {
        setRecentlyViewed(parsed);
        return;
      }

      // Else assume it's an array of product IDs; try to fetch details
      const ids = parsed.filter((x) => typeof x === "string" || typeof x === "number");
      if (ids.length === 0) {
        setRecentlyViewed([]);
        return;
      }

      const fetchByIds = async () => {
        try {
          // This endpoint is optional — create one server-side if you don't have it.
          // Alternatively, comment this out and show empty recently viewed.
          const res = await fetch(`http://localhost:5000/api/products/byIds`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          });
          if (!res.ok) throw new Error("Failed to fetch recently viewed products");
          const data = await res.json();
          setRecentlyViewed(Array.isArray(data) ? data : []);
        } catch (err) {
          console.warn("Could not fetch recently viewed product details, showing ids fallback", err);
          // fallback: show empty
          setRecentlyViewed([]);
        }
      };

      fetchByIds();
    } catch (err) {
      console.warn("Invalid recentlyViewed in localStorage", err);
      setRecentlyViewed([]);
    }
  }, []);

  const handleCategoryClick = (item) => {
    // If your product object has category/subcategory fields, navigate to that category
    if (!item) return;
    if (item.category && item.subcategory) {
      navigate(`/c/${item.category}/${slugify(item.subcategory)}`);
    } else if (item._id) {
      navigate(`/product/${item._id}`);
    } else {
      // fallback: navigate to search for the brand/title
      const fallback = item.title || item.brand || query;
      navigate(`/search?query=${encodeURIComponent(fallback)}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center py-20">Loading results for "<strong>{query}</strong>"...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-600">{error}</div>
      ) : results.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Search results for “{query}”</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {results.map((p) => (
              <div
                key={p._id || p.id || `${p.title}-${Math.random()}`}
                className="cursor-pointer"
                onClick={() => handleCategoryClick(p)}
              >
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </>
      ) : (
        // NO RESULTS UI
        <>
          <div className="border-2 border-[#f7edd5] bg-[#fffdf7] p-8 rounded-sm shadow-sm text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-serif mb-2">
              Sorry! We couldn't find any matching items for
            </h1>
            <div className="text-xl font-semibold mt-2 mb-4">{query}</div>
            <div className="mx-auto w-24 h-[1px] bg-[#d0c2b1] mb-4" />
            <p className="text-xs text-gray-500">
              Don't give up - check the spelling, or try less specific search terms
            </p>
          </div>

          {/* Recently Viewed */}
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="flex-grow h-[1px] bg-gray-200" />
              <h3 className="px-4 text-lg font-medium">Recently Viewed</h3>
              <div className="flex-grow h-[1px] bg-gray-200" />
            </div>

            {recentlyViewed.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {recentlyViewed.map((p, idx) => (
                  <div
                    key={p._id || p.id || idx}
                    className="cursor-pointer"
                    onClick={() => handleCategoryClick(p)}
                  >
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No recently viewed items yet.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
