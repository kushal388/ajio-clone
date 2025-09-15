import React from "react";

const PRICE_BUCKETS = [
  { label: "Under ₹999",    min: null, max: 999  },
  { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
  { label: "₹2000 - ₹4999", min: 2000, max: 4999 },
  { label: "₹5000+",        min: 5000, max: null },
];

export default function Filters({
  genders, setGenders,         // Set<string>
  brands, setBrands,           // Set<string>
  priceRange, setPriceRange,   // {min,max}
  brandOptions = [],           // all available brands to show
}) {
  const toggle = (set, value) => {
    const copy = new Set(set);
    copy.has(value) ? copy.delete(value) : copy.add(value);
    return copy;
  };

  return (
    <aside className="filters">
      <h3 className="filters-title">Refine By</h3>

      {/* Gender */}
      <div className="filter-section">
        <div className="filter-header">Gender</div>
        <div className="filter-options">
          {["Men","Women","Boys","Girls","Unisex"].map(g => (
            <label key={g}>
              <input
                type="checkbox"
                checked={genders.has(g)}
                onChange={() => setGenders(toggle(genders, g))}
              /> {g}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="filter-section">
        <div className="filter-header">Price</div>
        <div className="filter-options">
          {PRICE_BUCKETS.map(b => {
            const checked =
              (priceRange.min ?? null) === (b.min ?? null) &&
              (priceRange.max ?? null) === (b.max ?? null);
            return (
              <label key={b.label}>
                <input
                  type="radio"
                  name="price"
                  checked={checked}
                  onChange={() => setPriceRange({ min: b.min, max: b.max })}
                /> {b.label}
              </label>
            );
          })}
          <label>
            <input
              type="radio"
              name="price"
              checked={priceRange.min == null && priceRange.max == null}
              onChange={() => setPriceRange({ min: null, max: null })}
            /> Any
          </label>
        </div>
      </div>

      {/* Brands */}
      <div className="filter-section">
        <div className="filter-header">Brands</div>
        <div className="filter-options">
          {brandOptions.map(br => (
            <label key={br}>
              <input
                type="checkbox"
                checked={brands.has(br)}
                onChange={() => setBrands(toggle(brands, br))}
              /> {br}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
