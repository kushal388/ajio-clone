


// *********************************************************


// import React, { useEffect, useState } from "react";
// import "./footer.css";

// export default function Footer() {
//   const [showTop, setShowTop] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setShowTop(window.scrollY > 300);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

//   return (
//     <footer className="site-footer">
//       {/* Light info bar */}
//       <div className="footer-infobar">
//         <div className="info-inner">
//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* bag icon */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M6 7V6a6 6 0 0112 0v1" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <rect x="3" y="7" width="18" height="14" rx="2" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M16 11a4 4 0 01-8 0" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">EASY EXCHANGE</div>
//             </div>
//           </div>

//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* hand heart */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M20 12.5v6a2 2 0 01-2 2H6" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M12 7s2-2.5 4-2.5 3 1.6 3 4.25S17 13 12 18 3 12 3 9.5 6 7 8 7s4 0 4 0" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">100% HANDPICKED</div>
//             </div>
//           </div>

//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* badge/check */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 2l3 1 2 3 3 2-1 3 1 3-3 2-2 3-3-1-3 1-2-3-3-2 1-3-1-3 3-2 2-3 3-1z" stroke="#28333b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M9 12l2 2 4-4" stroke="#28333b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">ASSURED QUALITY</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main dark footer */}
//       <div className="footer-main">


//     <div className="bg-[#22313f] text-gray-200 py-8 px-6 space-y-8 text-sm">
//         {/* Popular Search */}
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <h3 className="font-semibold uppercase mb-2 flex items-center gap-2">
//             Popular Search <span className="flex-1 border-t border-gray-500"></span>
//           </h3>
//           <p className="leading-relaxed text-gray-300">
//             Wool Sweaters | Oversized Hoodies | Monte Carlo Sweaters | Denim Dresses | Printed Sarees | 
//             Short Skirts | Maheshwari Sarees | Levis Jeans | Gym Wear | Indian Dresses | Kraus Jeans | 
//             Ethnic Dresses | Mens Sports Shoes | Laptop Backpacks | Cotton Shirts | Kitten Heels | 
//             Floral Sarees | Long Tops | Long Gowns | Slim Fit Jeans | Relaxed Fit Jeans | Pink Tops | 
//             Messenger Bags | Biba Kurtis | Kalamkari Kurtis | Kota Sarees | Straight Fit Pants | 
//             Soch Sarees | Kalamkari Blouse | Sports Wear
//           </p>
//         </div>

//         {/* Popular Brands */}
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <h3 className="font-semibold uppercase mb-2 flex items-center gap-2">
//             Popular Brands <span className="flex-1 border-t border-gray-500"></span>
//           </h3>
//           <p className="leading-relaxed text-gray-300">
//             puma | nike | red tape | superdry | gap | us polo assn | american polo | adidas | levis | 
//             performax | armani exchange | marks & spencer | asos design | max | hm | monte carlo | skechers | 
//             adidas originals | crocs | louis philippe | clarks | tommy hilfiger | van heusen | allen solly | 
//             steve madden | new balance | reebok | trampoline | gas brand | aldo | soch | biba | w | Arrow | 
//             Levi's | Louis Philippe | Van Heusen | Allen Solly | Monte Carlo | BIBA | SOCH | FABINDIA | 
//             AURELIA | TRUEBROWNS | LABEL BY RITU KUMAR | AARKE BY RITU KUMAR | W
//           </p>
//         </div>

//         {/* Popular Categories */}
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <h3 className="font-semibold uppercase mb-2 flex items-center gap-2">
//             Popular Categories <span className="flex-1 border-t border-gray-500"></span>
//           </h3>
//           <p className="leading-relaxed text-gray-300">
//             earrings | bracelet for women | girls t-shirt | jumpsuit for girls | jackets for boys | bikini | 
//             lingerie | shorts | tshirt | mens blazer | suit | jackets | leather jacket for men | sweatshirts | 
//             shelves | automatic watches | men watches | women watch | fastrack | sarees | ready to wear saree | 
//             silk saree | dupatta | salwar suits | kurta sets | dress for women | cropped tops | jeans for women | 
//             one piece dress | party wear dresses for women | night suit for women | cord set for women | track pant | 
//             women trousers | women sweaters | women blazers | women trackpants | cardigan for women | lehenga | Shoes
//           </p>
//         </div>


//       </div>

//       {/* Footer Links (from previous code) */}
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
//           <div>
//             <h3 className="font-semibold mb-4">Ajio</h3>
//             <ul className="space-y-2">
//               <li>Who We Are</li>
//               <li>Join Our Team</li>
//               <li>Terms & Conditions</li>
//               <li>We Respect Your Privacy</li>
//               <li>Fees & Payments</li>
//               <li>Returns & Refunds Policy</li>
//               <li>Promotions Terms & Conditions</li>
//               <li>Blog</li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Help</h3>
//             <ul className="space-y-2">
//               <li>Track Your Order</li>
//               <li>Frequently Asked Questions</li>
//               <li>Returns</li>
//               <li>Cancellations</li>
//               <li>Payments</li>
//               <li>Customer Care</li>
//               <li>How Do I Redeem My Coupon</li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Shop by</h3>
//             <ul className="space-y-2">
//               <li>All</li>
//               <li>Men</li>
//               <li>Women</li>
//               <li>Kids</li>
//               <li>Indie</li>
//               <li>Stores</li>
//               <li>New Arrivals</li>
//               <li>Brand Directory</li>
//               <li>Home</li>
//               <li>Collections</li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Follow us</h3>
//             <ul className="space-y-2">
//               <li>Facebook</li>
//               <li>Instagram- AJIOlife</li>
//               <li>Instagram- AJIO LUXE</li>
//               <li>Twitter</li>
//               <li>Pinterest</li>
//             </ul>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-500 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
//           <div className="flex items-center gap-6 mb-6 md:mb-0">
//             <span className="font-semibold">Payment methods</span>

//             <img src="" alt="" />
//             <span>NetBanking</span>
//             <span>Visa</span>
//             <span>MasterCard mastercard</span>
//             <span>Cash on Delivery</span>
//             <span>Jio Money</span>

//           </div>
//           <div className="flex items-center gap-3">
//             <span className="font-semibold">Secure systems</span>
//             <span>🔒 256 BIT ENCRYPTION</span>
//           </div>
//         </div>



//       </div>


//       </div>

  

//       {/* floating buttons */}
//       <button
//         className={`footer-top-btn ${showTop ? "visible" : ""}`}
//         onClick={scrollTop}
//         aria-label="Back to top"
//       >
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//           <path d="M12 5l-6 6h4v8h4v-8h4l-6-6z" fill="#1f2937"/>
//         </svg>
//       </button>

//       <div className="footer-more-btn" aria-hidden>
//         <div className="dots">⋯</div>
//       </div>
//     </footer>
//   );
// }



// *******************************************************************


// // Footer.jsx
// import React, { useEffect, useState } from "react";
// import "./footer.css";

// function renderSection(content) {
//   // content can be:
//   // - React node -> return as-is
//   // - object { title, items } -> render heading + list
//   // - array of strings -> render list
//   // - string -> paragraph
//   if (!content) return null;

//   if (React.isValidElement(content)) return content;

//   if (typeof content === "string") {
//     return <p className="footer-list">{content}</p>;
//   }

//   if (Array.isArray(content)) {
//     return (
//       <ul className="footer-list">
//         {content.map((it, idx) => (
//           <li key={idx}>{it}</li>
//         ))}
//       </ul>
//     );
//   }

//   if (typeof content === "object" && content !== null) {
//     const { title, items, node } = content;
//     // if user provided a full node inside object, render it
//     if (node && React.isValidElement(node)) return node;

//     return (
//       <div>
//         {title && <h3 className="footer-heading">{title}</h3>}
//         {items ? (
//           Array.isArray(items) ? (
//             <ul className="footer-list">
//               {items.map((it, idx) => (
//                 <li key={idx}>{it}</li>
//               ))}
//             </ul>
//           ) : typeof items === "string" ? (
//             <p className="footer-list">{items}</p>
//           ) : (
//             items
//           )
//         ) : null}
//       </div>
//     );
//   }

//   return null;
// }

// // export default function Footer({ f1, f2, f3, f4 }) {
// export default function Footer({ f1, f2, f3, f4,  }) {

//   const [showTop, setShowTop] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setShowTop(window.scrollY > 300);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

//   // Default content used when prop is not provided
//   const default1 = {
//     title: "Ajio",
//     items: [
//       "Who We Are",
//       "Join Our Team",
//       "Terms & Conditions",
//       "We Respect Your Privacy",
//       "Fees & Payments",
//       "Returns & Refunds Policy",
//       "Promotions Terms & Conditions",
//       "Blog",
//     ],
//   };

//   const default2 = {
//     title: "Help",
//     items: [
//       "Track Your Order",
//       "Frequently Asked Questions",
//       "Returns",
//       "Cancellations",
//       "Payments",
//       "Customer Care",
//       "How Do I Redeem My Coupon",
//     ],
//   };

//   const default3 = {
//     title: "Shop by",
//     items: [
//       "All",
//       "Men",
//       "Women",
//       "Kids",
//       "Indie",
//       "Stores",
//       "New Arrivals",
//       "Brand Directory",
//       "Home",
//       "Collections",
//     ],
//   };

//   const default4 = {
//     title: "Follow us",
//     items: ["Facebook", "Instagram - AJIOlife", "Instagram - AJIO LUXE", "Twitter", "Pinterest"],
//   };

//   return (
//     <footer className="site-footer">
//       {/* Light info bar */}
//       <div className="footer-infobar">
//         <div className="info-inner">
//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* bag icon */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M6 7V6a6 6 0 0112 0v1" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <rect x="3" y="7" width="18" height="14" rx="2" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M16 11a4 4 0 01-8 0" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">EASY EXCHANGE</div>
//             </div>
//           </div>

//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* hand heart */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M20 12.5v6a2 2 0 01-2 2H6" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M12 7s2-2.5 4-2.5 3 1.6 3 4.25S17 13 12 18 3 12 3 9.5 6 7 8 7s4 0 4 0" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">100% HANDPICKED</div>
//             </div>
//           </div>

//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* badge/check */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 2l3 1 2 3 3 2-1 3 1 3-3 2-2 3-3-1-3 1-2-3-3-2 1-3-1-3 3-2 2-3 3-1z" stroke="#28333b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M9 12l2 2 4-4" stroke="#28333b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">ASSURED QUALITY</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main dark footer */}
//       <div className="footer-main">
//         <div className="bg-section">
//           {/* Popular sections (kept as full-width area you had previously) */}
//           <div className="max-w-7xl mx-auto px-6 py-12">
//             <h3 className="font-semibold uppercase mb-2 flex items-center gap-2">
//               Popular Search <span className="flex-1 border-t border-gray-500"></span>
//             </h3>
//             <p className="leading-relaxed text-gray-300">
//               Wool Sweaters | Oversized Hoodies | Monte Carlo Sweaters | Denim Dresses | Printed Sarees |
//               Short Skirts | Maheshwari Sarees | Levis Jeans | Gym Wear | Indian Dresses | Kraus Jeans |
//               Ethnic Dresses | Mens Sports Shoes | Laptop Backpacks | Cotton Shirts | Kitten Heels |
//               Floral Sarees | Long Tops | Long Gowns | Slim Fit Jeans | Relaxed Fit Jeans | Pink Tops |
//               Messenger Bags | Biba Kurtis | Kalamkari Kurtis | Kota Sarees | Straight Fit Pants |
//               Soch Sarees | Kalamkari Blouse | Sports Wear
//             </p>
//           </div>

//           {/* Popular Brands and Categories can remain here or be switched into the 4 columns if you prefer */}
//         </div>

//         {/* Footer columns (4 configurable parts) */}
//         <div className="max-w-7xl mx-auto px-6 py-12 footer-main-inner">
//           <div className="footer-columns">
//             <div>{renderSection(f1 ?? default1)}</div>
//             <div>{renderSection(f2 ?? default2)}</div>
//             <div>{renderSection(f3 ?? default3)}</div>
//             <div>{renderSection(f4 ?? default4)}</div>
//           </div>


           




//           {/* Divider & payment row */}
//           <div className="border-t border-gray-500 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
//             <div className="flex items-center gap-6 mb-6 md:mb-0">
//               <span className="font-semibold">Payment methods</span>
//               <span>NetBanking</span>
//               <span>Visa</span>
//               <span>MasterCard</span>
//               <span>Cash on Delivery</span>
//               <span>Jio Money</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="font-semibold">Secure systems</span>
//               <span>🔒 256 BIT ENCRYPTION</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* floating buttons */}
//       <button
//         className={`footer-top-btn ${showTop ? "visible" : ""}`}
//         onClick={scrollTop}
//         aria-label="Back to top"
//       >
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//           <path d="M12 5l-6 6h4v8h4v-8h4l-6-6z" fill="#1f2937"/>
//         </svg>
//       </button>

//       <div className="footer-more-btn" aria-hidden>
//         <div className="dots">⋯</div>
//       </div>
//     </footer>
//   );
// }



// ************************************************************************



// src/components/Footer.jsx
// import React, { useEffect, useState } from "react";
// import "./footer.css";

// function renderSection(content) {
//   if (!content) return null;

//   if (React.isValidElement(content)) return content;

//   if (typeof content === "string") {
//     return <p className="footer-list">{content}</p>;
//   }

//   if (Array.isArray(content)) {
//     return (
//       <ul className="footer-list">
//         {content.map((it, idx) => (
//           <li key={idx}>{it}</li>
//         ))}
//       </ul>
//     );
//   }

//   if (typeof content === "object" && content !== null) {
//     const { title, items, node } = content;
//     if (node && React.isValidElement(node)) return node;

//     return (
//       <div className="footer-col">
//         {title && <h3 className="footer-heading">{title}</h3>}
//         {items ? (
//           Array.isArray(items) ? (
//             <ul className="footer-list">
//               {items.map((it, idx) => (
//                 <li key={idx}>{it}</li>
//               ))}
//             </ul>
//           ) : typeof items === "string" ? (
//             <p className="footer-list">{items}</p>
//           ) : (
//             items
//           )
//         ) : null}
//       </div>
//     );
//   }

//   return null;
// }

// export default function Footer({ f1, f2, f3, f4 }) {
//   const [showTop, setShowTop] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setShowTop(window.scrollY > 300);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

//   // defaults (used when corresponding prop is not passed)
//   const default1 = {
//     title: "Ajio",
//     items: [
//       "Who We Are",
//       "Join Our Team",
//       "Terms & Conditions",
//       "We Respect Your Privacy",
//       "Fees & Payments",
//       "Returns & Refunds Policy",
//       "Promotions Terms & Conditions",
//       "Blog",
//     ],
//   };

//   const default2 = {
//     title: "Help",
//     items: [
//       "Track Your Order",
//       "Frequently Asked Questions",
//       "Returns",
//       "Cancellations",
//       "Payments",
//       "Customer Care",
//       "How Do I Redeem My Coupon",
//     ],
//   };

//   const default3 = {
//     title: "Shop by",
//     items: [
//       "All",
//       "Men",
//       "Women",
//       "Kids",
//       "Indie",
//       "Stores",
//       "New Arrivals",
//       "Brand Directory",
//       "Home",
//       "Collections",
//     ],
//   };

//   const default4 = {
//     title: "Follow us",
//     items: ["Facebook", "Instagram - AJIOlife", "Instagram - AJIO LUXE", "Twitter", "Pinterest"],
//   };

//   return (
//     <footer className="site-footer" role="contentinfo">
//       {/* Top white info bar (f1 can be reused if you prefer) */}
//       <div className="footer-infobar" aria-hidden="false">
//         <div className="info-inner">
//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* bag icon */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
//                 <path d="M6 7V6a6 6 0 0112 0v1" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <rect x="3" y="7" width="18" height="14" rx="2" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M16 11a4 4 0 01-8 0" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">EASY EXCHANGE</div>
//             </div>
//           </div>

//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* hand heart */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
//                 <path d="M20 12.5v6a2 2 0 01-2 2H6" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M12 7s2-2.5 4-2.5 3 1.6 3 4.25S17 13 12 18 3 12 3 9.5 6 7 8 7s4 0 4 0" stroke="#28333b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">100% HANDPICKED</div>
//             </div>
//           </div>

//           <div className="info-item">
//             <div className="info-icon" aria-hidden>
//               {/* badge/check */}
//               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
//                 <path d="M12 2l3 1 2 3 3 2-1 3 1 3-3 2-2 3-3-1-3 1-2-3-3-2 1-3-1-3 3-2 2-3 3-1z" stroke="#28333b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M9 12l2 2 4-4" stroke="#28333b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="info-text">
//               <div className="info-title">ASSURED QUALITY</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main dark footer */}
//       <div className="footer-main">
//         {/* Popular search (full width region) */}
//         <div className="bg-section">
//           <div className="popular-inner">
//             <h3 className="popular-title">
//               Popular Search <span className="popular-rule" />
//             </h3>
//             <p className="popular-list">
//               Wool Sweaters | Oversized Hoodies | Monte Carlo Sweaters | Denim Dresses | Printed Sarees |
//               Short Skirts | Maheshwari Sarees | Levis Jeans | Gym Wear | Indian Dresses | Kraus Jeans |
//               Ethnic Dresses | Mens Sports Shoes | Laptop Backpacks | Cotton Shirts | Kitten Heels |
//               Floral Sarees | Long Tops | Long Gowns | Slim Fit Jeans | Relaxed Fit Jeans | Pink Tops |
//               Messenger Bags | Biba Kurtis | Kalamkari Kurtis | Kota Sarees | Straight Fit Pants |
//               Soch Sarees | Kalamkari Blouse | Sports Wear
//             </p>
//           </div>
//         </div>

//         {/* 4-column area (configurable) */}
//         <div className="footer-main-inner">
//           <div className="footer-columns">
//             {renderSection(f1 ?? default1)}
//             {renderSection(f2 ?? default2)}
//             {renderSection(f3 ?? default3)}
//             {renderSection(f4 ?? default4)}
//           </div>

//           {/* divider + payment row */}
//           <div className="footer-bottom-row">
//             <div className="payment-block">
//               <span className="payment-title">Payment methods</span>
//               <span className="payment-item">NetBanking</span>
//               <span className="payment-item">Visa</span>
//               <span className="payment-item">MasterCard</span>
//               <span className="payment-item">Cash on Delivery</span>
//               <span className="payment-item">Jio Money</span>
//             </div>

//             <div className="secure-block">
//               <span className="secure-title">Secure systems</span>
//               <span className="secure-item" aria-hidden>🔒 256 BIT ENCRYPTION</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* floating back-to-top button */}
//       <button
//         className={`footer-top-btn ${showTop ? "visible" : ""}`}
//         onClick={scrollTop}
//         aria-label="Back to top"
//         title="Back to top"
//       >
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
//           <path d="M12 5l-6 6h4v8h4v-8h4l-6-6z" fill="#1f2937"/>
//         </svg>
//       </button>

//       {/* three-dot more button */}
//       <button
//         className="footer-more-btn"
//         aria-label="More footer actions"
//         title="More"
//         onClick={() => {
//           // you can replace this with a real menu
//           window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
//         }}
//       >
//         <span className="dots">⋯</span>
//       </button>
//     </footer>
//   );
// }



// ***********************************************************



// src/components/Footer.jsx
// import React, { useEffect, useState } from "react";
// import "./footer.css";

// /**
//  * Props:
//  * - showInfo (bool)      : show top icon/info bar
//  * - showPopular (bool)   : show popular search full-width block
//  * - showLists (bool)     : show grouped lists block (Ajio/Help/Shop by/Follow us)
//  * - showBottom (bool)    : show payment & secure row
//  * - lists (array/object)  : grouped lists data (single prop for the whole list area)
//  * - infoItems (array)    : override top info items (optional)
//  */
// export default function Footer({
//   showInfo = true,
//   showPopular = true,
//   showLists = true,
//   showBottom = true,
//   lists = null,
//   infoItems = null,
// }) {
//   const [showTop, setShowTop] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setShowTop(window.scrollY > 300);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

//   // defaults
//   const defaultInfo = [
//     { title: "EASY EXCHANGE", icon: "bag" },
//     { title: "100% HANDPICKED", icon: "hand" },
//     { title: "ASSURED QUALITY", icon: "badge" },
//   ];

//   const defaultLists = [
//     {
//       title: "Ajio",
//       items: [
//         "Who We Are",
//         "Join Our Team",
//         "Terms & Conditions",
//         "We Respect Your Privacy",
//         "Fees & Payments",
//         "Returns & Refunds Policy",
//         "Promotions Terms & Conditions",
//         "Blog",
//       ],
//     },
//     {
//       title: "Help",
//       items: [
//         "Track Your Order",
//         "Frequently Asked Questions",
//         "Returns",
//         "Cancellations",
//         "Payments",
//         "Customer Care",
//         "How Do I Redeem My Coupon",
//       ],
//     },
//     {
//       title: "Shop by",
//       items: ["All", "Men", "Women", "Kids", "New Arrivals", "Brand Directory", "Home", "Collections"],
//     },
//     {
//       title: "Follow us",
//       items: ["Instagram - @brand", "Facebook - Brand"],
//     },
//   ];

//   const info = infoItems ?? defaultInfo;
//   const groupedLists = lists ?? defaultLists;

//   return (
//     <footer className="site-footer" role="contentinfo">
//       {/* 1) Info bar */}
//       {showInfo && (
//         <div className="footer-infobar">
//           <div className="info-inner">
//             {info.map((it, i) => (
//               <div className="info-item" key={i}>
//                 <div className="info-icon" aria-hidden>
//                   {/* simple generic SVG placeholders by type */}
//                   {it.icon === "bag" && (
//                     <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="14" rx="2" stroke="#28333b" strokeWidth="1.4"/></svg>
//                   )}
//                   {it.icon === "hand" && (
//                     <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M6 21V12" stroke="#28333b" strokeWidth="1.4"/></svg>
//                   )}
//                   {it.icon === "badge" && (
//                     <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 1 2 3 3 2-1 3 1 3-3 2-2 3-3-1-3 1-2-3-3-2 1-3-1-3 3-2 2-3 3-1z" stroke="#28333b" strokeWidth="1"/></svg>
//                   )}
//                 </div>
//                 <div className="info-text">
//                   <div className="info-title">{it.title}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 2) Popular Search (full width block) */}
//       {showPopular && (
//         <div className="footer-popular">
//           <div className="popular-inner">
//             <h3 className="popular-title">
//               Popular Search <span className="popular-rule" />
//             </h3>
//             <p className="popular-list">
//               Wool Sweaters | Oversized Hoodies | Monte Carlo Sweaters | Denim Dresses | Printed Sarees |
//               Short Skirts | Maheshwari Sarees | Levis Jeans | Gym Wear | Indian Dresses | Kraus Jeans |
//               Ethnic Dresses | Mens Sports Shoes | Laptop Backpacks | Cotton Shirts | Kitten Heels |
//               Floral Sarees | Long Tops | Long Gowns | Slim Fit Jeans | Relaxed Fit Jeans | Pink Tops |
//               Messenger Bags | Biba Kurtis | Kalamkari Kurtis | Kota Sarees | Straight Fit Pants |
//               Soch Sarees | Kalamkari Blouse | Sports Wear
//             </p>
//           </div>
//         </div>
//       )}

//       {/* 3) Grouped Lists block (this is ONE part containing all lists together) */}
//       {showLists && (
//         <div className="footer-lists">
//           <div className="footer-main-inner">
//             <div className="lists-grid" role="navigation" aria-label="Footer links">
//               {groupedLists.map((col, idx) => (
//                 <div className="list-col" key={idx}>
//                   {col.title && <h4 className="list-title">{col.title}</h4>}
//                   <ul className="list-items">
//                     {(col.items || []).map((it, i2) => (
//                       <li key={i2} className="list-item">
//                         {/* If you want these to be links, change below to <a href={it.href || '#'}> */}
//                         {it}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 4) Bottom payment & secure row */}
//       {showBottom && (
//         <div className="footer-bottom">
//           <div className="footer-bottom-inner">
//             <div className="payment-block">
//               <span className="payment-title">Payment methods</span>
//               <span className="payment-item">NetBanking</span>
//               <span className="payment-item">Visa</span>
//               <span className="payment-item">MasterCard</span>
//               <span className="payment-item">Cash on Delivery</span>
//               <span className="payment-item">Jio Money</span>
//             </div>
//             <div className="secure-block">
//               <span className="secure-title">Secure systems</span>
//               <span className="secure-item">🔒 256 BIT ENCRYPTION</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* floating back-to-top */}
//       <button
//         className={`footer-top-btn ${showTop ? "visible" : ""}`}
//         onClick={scrollTop}
//         aria-label="Back to top"
//         title="Back to top"
//       >
//         ▲
//       </button>
//     </footer>
//   );
// }



// ******************************************************************************


// src/components/Footer.jsx
// import React, { useEffect, useState } from "react";
// import "./footer.css";

// export default function Footer({
//   showInfo = true,
//   showPopular = true,
//   showLists = true,
//   showBottom = true,
//   lists = null,
//   infoItems = null,
// }) {
//   const [showTop, setShowTop] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setShowTop(window.scrollY > 300);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);
//   const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

//   const defaultInfo = [
//     { title: "EASY EXCHANGE", icon: "bag" },
//     { title: "100% HANDPICKED", icon: "hand" },
//     { title: "ASSURED QUALITY", icon: "badge" },
//   ];

//   const defaultLists = [
//     { title: "Ajio", items: ["Who We Are", "Join Our Team", "Terms & Conditions", "Blog"] },
//     { title: "Help", items: ["Track Your Order", "Returns", "Payments", "Customer Care"] },
//     { title: "Shop by", items: ["Men", "Women", "Kids", "New Arrivals"] },
//     { title: "Follow us", items: ["Instagram - @brand", "Facebook - Brand"] },
//   ];

//   const info = infoItems ?? defaultInfo;
//   const groupedLists = lists ?? defaultLists;

//   // small helper to render icons (inline SVGs)
//   function Icon({ name, title }) {
//     // explicit stroke/fill so they are always visible
//     const stroke = "#0f1720"; // dark icon stroke
//     const fill = "none";
//     if (name === "bag") {
//       return (
//         <svg className="icon-svg" viewBox="0 0 24 24" role="img" aria-label={title}>
//           <path d="M6 7V6a6 6 0 0112 0v1" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
//           <rect x="3" y="7" width="18" height="14" rx="2" stroke={stroke} strokeWidth="1.4" fill={fill}/>
//           <path d="M16 11a4 4 0 01-8 0" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
//         </svg>
//       );
//     }
//     if (name === "hand") {
//       return (
//         <svg className="icon-svg" viewBox="0 0 24 24" role="img" aria-label={title}>
//           <path d="M20 12.5v6a2 2 0 01-2 2H6" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
//           <path d="M12 7s2-2.5 4-2.5 3 1.6 3 4.25S17 13 12 18 3 12 3 9.5 6 7 8 7s4 0 4 0" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
//         </svg>
//       );
//     }
//     if (name === "badge") {
//       return (
//         <svg className="icon-svg" viewBox="0 0 24 24" role="img" aria-label={title}>
//           <path d="M12 2l3 1 2 3 3 2-1 3 1 3-3 2-2 3-3-1-3 1-2-3-3-2 1-3-1-3 3-2 2-3 3-1z" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
//           <path d="M9 12l2 2 4-4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
//         </svg>
//       );
//     }
//     // fallback: emoji (visible everywhere)
//     return <span className="icon-fallback" aria-hidden>🔹</span>;
//   }

//   return (
//     <footer className="site-footer" role="contentinfo">
//       {showInfo && (
//         <div className="footer-infobar">
//           <div className="info-inner">
//             {info.map((it, i) => (
//               <div className="info-item" key={i}>
//                 <div className="info-icon" aria-hidden>
//                   <Icon name={it.icon} title={it.title} />
//                 </div>
//                 <div className="info-text">
//                   <div className="info-title">{it.title}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {showPopular && (
//         <div className="footer-popular">
//           <div className="popular-inner">
//             <h3 className="popular-title">Popular Search <span className="popular-rule" /></h3>
//             <p className="popular-list">Wool Sweaters | Oversized Hoodies | Denim Dresses | Printed Sarees | ...</p>
//           </div>
//         </div>
//       )}

//       {showLists && (
//         <div className="footer-lists">
//           <div className="footer-main-inner">
//             <div className="lists-grid" role="navigation" aria-label="Footer links">
//               {groupedLists.map((col, idx) => (
//                 <div className="list-col" key={idx}>
//                   {col.title && <h4 className="list-title">{col.title}</h4>}
//                   <ul className="list-items">
//                     {(col.items || []).map((it, i2) => <li key={i2} className="list-item">{it}</li>)}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {showBottom && (
//         <div className="footer-bottom">
//           <div className="footer-bottom-inner">
//             <div className="payment-block">
//               <span className="payment-title">Payment methods</span>
//               <span className="payment-item">NetBanking</span>
//               <span className="payment-item">Visa</span>
//               <span className="payment-item">MasterCard</span>
//               <span className="payment-item">Cash on Delivery</span>
//             </div>
//             <div className="secure-block">
//               <span className="secure-title">Secure systems</span>
//               <span className="secure-item">🔒 256 BIT ENCRYPTION</span>
//             </div>
//           </div>
//         </div>
//       )}

//       <button className={`footer-top-btn ${showTop ? "visible" : ""}`} onClick={scrollTop} aria-label="Back to top">▲</button>
//     </footer>
//   );
// }



// *************************************************************************


import React, { useEffect, useState } from "react";

/**
 * Footer (Tailwind)
 *
 * Props:
 * - showInfo (bool)    : show top icon/info bar (white)
 * - showPopular (bool) : show full-width "Popular Search" block
 * - showLists (bool)   : show grouped lists (Ajio / Help / Shop by / Follow us)
 * - showBottom (bool)  : show payment & secure row
 * - lists (array)      : override grouped lists (single array for all 4 columns)
 * - infoItems (array)  : override top info items
 */
export default function Footer({
  showInfo = true,
  showPopular = true,
  showLists = true,
  showBottom = true,
  lists = null,
  infoItems = null,
}) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const defaultInfo = [
    { title: "EASY EXCHANGE", icon: "bag" },
    { title: "100% HANDPICKED", icon: "hand" },
    { title: "ASSURED QUALITY", icon: "badge" },
  ];

  const defaultLists = [
    {
      title: "Ajio",
      items: [
        "Who We Are",
        "Join Our Team",
        "Terms & Conditions",
        "We Respect Your Privacy",
        "Fees & Payments",
        "Returns & Refunds Policy",
        "Promotions Terms & Conditions",
        "Blog",
      ],
    },
    {
      title: "Help",
      items: [
        "Track Your Order",
        "Frequently Asked Questions",
        "Returns",
        "Cancellations",
        "Payments",
        "Customer Care",
        "How Do I Redeem My Coupon",
      ],
    },
    {
      title: "Shop by",
      items: [
        "All",
        "Men",
        "Women",
        "Kids",
        "Indie",
        "Stores",
        "New Arrivals",
        "Brand Directory",
        "Home",
        "Collections",
      ],
    },
    {
      title: "Follow us",
      items: ["Instagram - @brand", "Facebook - Brand"],
    },
  ];

  const info = infoItems ?? defaultInfo;
  const groupedLists = lists ?? defaultLists;

  function Icon({ name, className = "", title }) {
    // Use currentColor so Tailwind text color controls icon color.
    if (name === "bag") {
      return (
        <svg
          className={`w-8 h-8 ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label={title}
        >
          <path d="M6 7V6a6 6 0 0112 0v1" />
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <path d="M16 11a4 4 0 01-8 0" />
        </svg>
      );
    }
    if (name === "hand") {
      return (
        <svg
          className={`w-8 h-8 ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label={title}
        >
          <path d="M20 12.5v6a2 2 0 01-2 2H6" />
          <path d="M12 7s2-2.5 4-2.5 3 1.6 3 4.25S17 13 12 18 3 12 3 9.5 6 7 8 7s4 0 4 0" />
        </svg>
      );
    }
    if (name === "badge") {
      return (
        <svg
          className={`w-8 h-8 ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label={title}
        >
          <path d="M12 2l3 1 2 3 3 2-1 3 1 3-3 2-2 3-3-1-3 1-2-3-3-2 1-3-1-3 3-2 2-3 3-1z" />
          <path d="M9 12l2 2 4-4" strokeWidth="1.6" />
        </svg>
      );
    }
    return <span className="text-base" aria-hidden>🔹</span>;
  }

  return (
    <footer className="w-full bg-[#22313f] text-[#dfeef5] mt-auto">
      {/* 1) Info bar (white background) */}
      {showInfo && (
        <div className="bg-white border-t-4 border-[#ebe6db]">
          <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
            {info.map((it, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center text-center">
                <div className="text-[#28333b]">
                  <Icon name={it.icon} title={it.title} className="text-[#28333b]" />
                </div>
                <div className="mt-2 text-xs font-semibold text-[#28333b] tracking-wide">{it.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2) Popular Search full-width block */}
      {showPopular && (
        <div className="border-b border-[rgba(255,255,255,0.04)]">
          <div className="max-w-[1200px] mx-auto px-4 py-4">
            <h3 className="text-sm font-semibold uppercase text-white flex items-center gap-3">
              <span>Popular Search</span>
              <span className="flex-1 h-px bg-[rgba(255,255,255,0.12)] block" />
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.78)] leading-relaxed">
              Wool Sweaters | Oversized Hoodies | Monte Carlo Sweaters | Denim Dresses | Printed Sarees |
              Short Skirts | Maheshwari Sarees | Levis Jeans | Gym Wear | Indian Dresses | Kraus Jeans |
              Ethnic Dresses | Mens Sports Shoes | Laptop Backpacks | Cotton Shirts | Kitten Heels |
              Floral Sarees | Long Tops | Long Gowns | Slim Fit Jeans | Relaxed Fit Jeans | Pink Tops |
              Messenger Bags | Biba Kurtis | Kalamkari Kurtis | Kota Sarees | Straight Fit Pants |
              Soch Sarees | Kalamkari Blouse | Sports Wear
            </p>
          </div>
        </div>
      )}

      {/* 3) Grouped lists block */}
      {showLists && (
        <div>
          <div className="max-w-[1200px] mx-auto px-4 py-8">
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {groupedLists.map((col, i) => (
                        <div key={i}>
                          {col.title && <h4 className="text-white font-semibold mb-3">{col.title}</h4>}
                          <ul className="space-y-2 text-[rgba(255,255,255,0.78)] text-sm">
                            {(col.items || []).map((it, j) => (
                              <li key={j}>{it}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
          </div>




          </div>
        </div>
      )}

      {/* 4) Bottom payment & secure row */}
      {showBottom && (
        <div className="border-t border-[rgba(255,255,255,0.04)]">
          <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-white">Payment methods</span>
              <span className="text-[rgba(255,255,255,0.78)]">NetBanking</span>
              <span className="text-[rgba(255,255,255,0.78)]">Visa</span>
              <span className="text-[rgba(255,255,255,0.78)]">MasterCard</span>
              <span className="text-[rgba(255,255,255,0.78)]">Cash on Delivery</span>
              <span className="text-[rgba(255,255,255,0.78)]">Jio Money</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">Secure systems</span>
              <span className="text-[rgba(255,255,255,0.78)]">🔒 256 BIT ENCRYPTION</span>
            </div>
          </div>
        </div>
      )}

      {/* floating back-to-top & small more button */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`fixed right-6 ${showTop ? "bottom-24 opacity-100 translate-y-0" : "bottom-20 opacity-0 translate-y-3 pointer-events-none"} transition-all duration-200 bg-white w-11 h-11 rounded-lg shadow-lg flex items-center justify-center z-50`}
      >
        <svg className="w-4 h-4 text-[#1f2937]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5l-6 6h4v8h4v-8h4l-6-6z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        aria-label="More"
        className="fixed right-6 bottom-6 bg-white w-11 h-11 rounded-lg shadow-lg flex items-center justify-center z-50 text-[#1f2937]"
      >
        <span className="text-xl">⋯</span>
      </button>
    </footer>
  );
}
