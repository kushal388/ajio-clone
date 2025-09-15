import React from "react";
import "./toptrends.css";

/**
 * items: array of { id, image, title, brandLogoUrl, priceLabel }
 * If you want different layouts per item, pass custom nodes.
 */
export default function TopTrends({ items = [] }) {
  // fallback sample items (4) if none provided
  const fallback = [
    {
      id: "t1",
      image:"https://d168jcr2cillca.cloudfront.net/uploadimages/coupons/5842-Reliance-Trnds_Hyderabad_Sales_2.jpg",
      title: "Trends",
      brandLogoUrl: "", // optional small brand mark
      priceLabel: "UNDER ₹399*",
    },
    {
      id: "t2",
      image:
        "https://assets.ajio.com/medias/sys_master/images/images/h91/h41/47135238488094/04022022-D-unisex-ajiomania-internationalbrands-clarks-3050.jpg",
      title: "Clarks",
      brandLogoUrl: "",
      priceLabel: "UNDER ₹499*",
    },
    {
      id: "t3",
      image:
        "https://assets.ajio.com/medias/sys_master/images/images/h7e/hf4/47135238291486/04022022-D-unisex-ajiomania-internationalbrands-gas-min30.jpg",
      title: "GAS",
      brandLogoUrl: "",
      priceLabel: "UNDER ₹599*",
    },
    {
      id: "t4",
      image:
        "https://img.etimg.com/thumb/width-1200,height-1200,imgsize-71648,resizemode-75,msid-114425346/industry/cons-products/fashion-/-cosmetics-/-jewellery/reliance-retail-expands-azorte-with-12-new-stores-in-india.jpg",
      title: "Azorte",
      brandLogoUrl: "",
      priceLabel: "MIN. 70% OFF*",
    },
    
  ];

  const list = items.length ? items : fallback;

  return (
    <section className="top-trends-section w-full">
      <div className="top-trends-inner">
        <h3 className="top-trends-title">Top Trends</h3>

        <div className="top-trends-grid" role="list">
          {list.map((it) => (
            <article key={it.id} className="trend-card" role="listitem">
              <div className="trend-image-wrap">
                <img src={it.image} alt={it.title || "trend"} draggable="false" />
                {/* bottom overlay with logos/text */}
                <div className="trend-overlay">
                  <div className="trend-overlay-left">
                    {it.brandLogoUrl ? (
                      <img className="brand-logo" src={it.brandLogoUrl} alt="brand" />
                    ) : (
                      <span className="overlay-title">{it.title}</span>
                    )}
                  </div>
                  <div className="trend-overlay-right">
                    <span className="price-label">{it.priceLabel}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* optional right-side vertical arrow like screenshot (simple clickable control) */}
        <button
          className="top-trends-arrow"
          aria-label="Next trends"
          onClick={() => {
            // simple scroll to next group: try to scroll grid 1 column width
            const grid = document.querySelector(".top-trends-grid");
            if (!grid) return;
            const colWidth = grid.querySelector(".trend-card")?.clientWidth || 300;
            grid.scrollBy({ left: colWidth, behavior: "smooth" });
          }}
        >
          ›
        </button>
      </div>
    </section>
   



       

  );
}
