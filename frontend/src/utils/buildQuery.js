// turn a filter object into axios params
export function buildQuery({
  category,
  subcategory,
  genders,        // Set or array of "Men" | "Women" | "Boys" | "Girls" | "Unisex"
  brands,         // Set or array of brand names
  priceRange,     // { min: number|null, max: number|null }
  sort,           // "relevance" | "lowtohigh" | "hightolow" | "newest"
  page,           // number
  limit,          // number
}) {
  const params = {};
  if (category) params.category = category.toLowerCase();
  if (subcategory) params.subcategory = subcategory;

  // gender (API expects a single value; we’ll send first selected if multiple)
  const g = Array.isArray(genders) ? genders : [...(genders || [])];
  if (g.length) params.gender = g[0];

  // brands -> comma separated
  const b = Array.isArray(brands) ? brands : [...(brands || [])];
  if (b.length) params.brand = b.join(",");

  if (priceRange?.min != null) params.minPrice = priceRange.min;
  if (priceRange?.max != null) params.maxPrice = priceRange.max;

  if (sort) params.sort = sort;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return params;
}
