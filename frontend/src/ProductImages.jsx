// ProductImages.jsx
import React, { useState, useMemo } from "react";

export default function ProductImages({ images = [] }) {
  // sort by order to be safe
  const sorted = useMemo(() => {
    return images.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [images]);

  // set initial index to primary if present else 0
  const initialIndex = useMemo(() => {
    const primaryIndex = sorted.findIndex(img => img.isPrimary);
    return primaryIndex >= 0 ? primaryIndex : 0;
  }, [sorted]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (!sorted.length) return <div>No images</div>;

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* thumbnails */}
      <div className="col-span-1 hidden lg:block">
        <div className="space-y-4 sticky top-28">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-20 h-20 p-1 rounded overflow-hidden border ${i === activeIndex ? "border-gray-800" : "border-gray-200"}`}
            >
              <img src={img.url} alt={img.alt || `thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* main image */}
      <div className="col-span-12 lg:col-span-6">
        <div className="relative">
          <img src={sorted[activeIndex].url} alt={sorted[activeIndex].alt || "product"} className="w-full h-[600px] object-contain" />
        </div>

        {/* mobile thumbnails under main image */}
        <div className="lg:hidden mt-4 flex gap-2 overflow-auto">
          {sorted.map((img, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`w-24 h-24 p-1 rounded border ${i===activeIndex ? 'border-gray-800' : 'border-gray-200'}`}>
              <img src={img.url} alt={img.alt || `thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
