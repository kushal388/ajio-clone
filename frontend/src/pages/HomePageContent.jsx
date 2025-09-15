import React from "react";
import Carousel from "../components/Carousel";
import TopTrends from "../components/TopTrends";

/**
 * Example slide arrays. Replace src with your real image URLs.
 * In a real app, load these from your API or import local assets.
 */


const LARGE_SLIDES = [

  { id: "l1", src: "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/7/25/9be788ff-39a4-4214-99d0-fc97505aae5a1658752545685-USPA_Desk_Banner.jpg", alt: "Hero 1"  },
  { id: "l2", src: "https://media.centrepointstores.com/i/centrepoint/Web_En_SP_Men_Summer_31July?$banimg-d-rb$&$quality-standard$&fmt=auto", alt: "Hero 2" },
  { id: "l3", src:"https://media.centrepointstores.com/i/centrepoint/Web_HP_En_preramadan_men_HP_V3_31jan?$banimg-d-rb$&$quality-standard$&fmt=auto", alt: "Hero 3" },
     { id: "l4", src: "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/7/25/179e278f-77ee-44c2-bf39-9f00b0cd08e01658752429301-Handbags_Desk.jpg", alt: "Hero 4" },
  { id: "l5", src: "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/5/31/4031994d-9092-4aa7-aea1-f52f2ae5194f1654006594976-Activewear_DK.jpg", alt: "Hero 5" },




];

const SMALL_SLIDES = [
  { id: "s1", src: "https://assets.ajio.com/cms/AJIO/WEB/HSBC-1440x128.jpg", alt: "Banner 1" },
  { id: "s2", src: "https://assets.ajio.com/cms/AJIO/WEB/060123-D-UHP-offers-relianceone.jpg", alt: "Banner 2" },
  { id: "s3", src: "https://assets.ajio.com/cms/AJIO/WEB/060123-D-UHP-offers-payupto3AJIOpoints.jpg", alt: "Banner 3" },

];

const THIRD_SLIDES = [

  { id: "l1", src: "https://assets.ajio.com/cms/AJIO/WEB/060123-D-UHP-trendscarousel-azorte.jpg", alt: "Hero 1"  },
  { id: "l2", src: "https://assets.ajio.com/cms/AJIO/WEB/D-UHP-trendscarousel-womensethnic-edited.jpg", alt: "Hero 2" },
  { id: "l3", src:"https://assets.ajio.com/cms/AJIO/WEB/060123-D-UHP-trendscarousel-kidswear.jpg", alt: "Hero 3" },
     { id: "l4", src: "https://assets.ajio.com/cms/AJIO/WEB/17012023-UHP-D-UHPwomen-p1-nike-fila-40to50.jpg", alt: "Hero 4" },
  { id: "l5", src: "https://assets.ajio.com/cms/AJIO/WEB/D-UHP-trendscarousel-winterwear-edited.jpg", alt: "Hero 5" },




];

export default function HomePageContent() {
  return (
    <div className="homepage-content" style={{ display: "grid", gap: 24, padding: 16 }}>
      {/* Big hero carousel (like the top carousel in screenshot) */}
      <div style={{ width: "100%" }}>
        <Carousel
          slides={LARGE_SLIDES}
          autoPlayInterval={2000}
          startPlaying={true}
          height="520px"       // adjust as needed
          showDots={true}
          showArrows={true}
          showPlayPause={true}
        />
      </div>

      {/* Smaller promo carousel (like the thin one below in the screenshot) */}
      <div style={{ width: "100%"}} className="smalC">
        <Carousel
          slides={SMALL_SLIDES}
          autoPlayInterval={1500}
          startPlaying={true}
          height="140px"      // smaller height for banner
          showDots={true}
          showArrows={true}
          showPlayPause={true}
        />
      </div>

      
         <TopTrends />


        <div style={{ width: "100%" }}>
        <Carousel
          slides={THIRD_SLIDES}
          autoPlayInterval={2000}
          startPlaying={true}
          height="520px"       // adjust as needed
          showDots={true}
          showArrows={true}
          showPlayPause={true}
        />
      </div>


      {/* add the rest of your homepage sections below */}
      <section>
        {/* <h2>New User Perks, Unlocked</h2> */}
       
        {/* ... */}
      </section>

      {/* AJIO CARES Section */}
      <div className="bg-[#22313f] text-center text-white py-6 px-4 border-4 border-yellow-600">
        <h2 className="text-xl font-bold tracking-wide mb-2 text-yellow-200 ">AJIO CARES</h2>
        <p className="text-sm max-w-4xl mx-auto leading-relaxed">
          WE DO NOT ASK FOR YOUR BANK ACCOUNT OR CARD DETAILS VERBALLY OR TELEPHONICALLY. <br />
          WE ALSO DO NOT ASK FOR MONEY TO PARTICIPATE IN ANY OF OUR OFFERS OR RUN ANY LUCKY DRAWS.
        </p>
      </div>


    </div>
  );
}


// 
// src/pages/HomePageContent.jsx
// import React, { useRef } from "react";
// import Carousel from "../components/Carousel";

// const LARGE_SLIDES = [
//   { id: "l1", src: "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/7/25/9be788ff-39a4-4214-99d0-fc97505aae5a1658752545685-USPA_Desk_Banner.jpg", alt: "Hero 1"  },
//   { id: "l2", src: "https://media.centrepointstores.com/i/centrepoint/Web_En_SP_Men_Summer_31July?$banimg-d-rb$&$quality-standard$&fmt=auto", alt: "Hero 2" },
//   { id: "l3", src:"https://media.centrepointstores.com/i/centrepoint/Web_HP_En_preramadan_men_HP_V3_31jan?$banimg-d-rb$&$quality-standard$&fmt=auto", alt: "Hero 3" },
//   { id: "l4", src: "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/7/25/179e278f-77ee-44c2-bf39-9f00b0cd08e01658752429301-Handbags_Desk.jpg", alt: "Hero 4" },
//   { id: "l5", src: "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/5/31/4031994d-9092-4aa7-aea1-f52f2ae5194f1654006594976-Activewear_DK.jpg", alt: "Hero 5" },
// ];

// const SMALL_SLIDES = [
//   { id: "s1", src: "https://assets.ajio.com/cms/AJIO/WEB/HSBC-1440x128.jpg", alt: "Banner 1" },
//   { id: "s2", src: "https://assets.ajio.com/cms/AJIO/WEB/060123-D-UHP-offers-relianceone.jpg", alt: "Banner 2" },
//   { id: "s3", src: "https://assets.ajio.com/cms/AJIO/WEB/060123-D-UHP-offers-payupto3AJIOpoints.jpg", alt: "Banner 3" },
// ];

// const TOP_TRENDS = [
//   {
//     id: "t1",
//     image:
//       "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/7/25/9be788ff-39a4-4214-99d0-fc97505aae5a1658752545685-USPA_Desk_Banner.jpg",
//     title: "TRENDS",
//     priceLabel: "UNDER ₹399*",
//   },
//   {
//     id: "t2",
//     image:
//       "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/7/25/179e278f-77ee-44c2-bf39-9f00b0cd08e01658752429301-Handbags_Desk.jpg",
//     title: "YOUSTA",
//     priceLabel: "UNDER ₹499*",
//   },
//   {
//     id: "t3",
//     image:
//       "https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/5/31/4031994d-9092-4aa7-aea1-f52f2ae5194f1654006594976-Activewear_DK.jpg",
//     title: "Kurta & Kurti Sets",
//     priceLabel: "UNDER ₹599*",
//   },
//   {
//     id: "t4",
//     image:
//       "https://media.centrepointstores.com/i/centrepoint/Web_HP_En_preramadan_men_HP_V3_31jan?$banimg-d-rb$&$quality-standard$&fmt=auto",
//     title: "AZORTE",
//     priceLabel: "MIN. 70% OFF*",
//   },
// ];

// export default function HomePageContent() {
//   const gridRef = useRef(null);

//   // scroll the grid wrapper by one card width (useful on small screens if overflow exists)
//   const scrollNext = () => {
//     const wrapper = gridRef.current;
//     if (!wrapper) return;
//     const card = wrapper.querySelector(".trend-card");
//     const amount = (card?.clientWidth ?? wrapper.clientWidth / 4) + 16; // include gap
//     wrapper.scrollBy({ left: amount, behavior: "smooth" });
//   };

//   return (
//     <div className="homepage-content" style={{ display: "grid", gap: 24, padding: 16 }}>
//       {/* Big hero carousel */}
//       <div style={{ width: "100%" }}>
//         <Carousel
//           slides={LARGE_SLIDES}
//           autoPlayInterval={2000}
//           startPlaying={true}
//           height="520px"
//           showDots={true}
//           showArrows={true}
//           showPlayPause={true}
//         />
//       </div>

//       {/* Smaller promo carousel */}
//       <div style={{ width: "100%"}} className="smalC">
//         <Carousel
//           slides={SMALL_SLIDES}
//           autoPlayInterval={1500}
//           startPlaying={true}
//           height="140px"
//           showDots={true}
//           showArrows={true}
//           showPlayPause={true}
//         />
//       </div>

//       {/* Top Trends 4-column grid (inserted directly here) */}
//       <section className="w-full">
//         <div className=" mx-auto relative px-2">
//           <h2 className="text-3xl font-bold text-center mb-5">Top Trends</h2>

//           {/* wrapper has horizontal overflow enabled for small screens; desktop shows 4 columns */}
//           <div
//             ref={gridRef}
//             className="overflow-x-auto scrollbar-hide"
//             style={{ WebkitOverflowScrolling: "touch" }}
//           >
//             <div
//               className="grid gap-4"
//               style={{
//                 gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
//                 alignItems: "stretch",
//                 minWidth: "100%",
//               }}
//             >
//               {TOP_TRENDS.map((item) => (
//                 <div
//                   key={item.id}
//                   className="trend-card relative rounded-lg overflow-hidden shadow-sm bg-white"
//                   style={{ minHeight: 360 }}
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.title}
//                     className="w-full h-full object-cover block"
//                     draggable="false"
//                   />

//                   {/* bottom gradient overlay */}
//                   <div className="absolute left-0 right-0 bottom-0 p-4 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
//                     <div className="text-white font-semibold text-lg">{item.title}</div>
//                     <div className="text-white font-bold text-sm px-3 py-1 rounded-full bg-white/6 border border-white/10">
//                       {item.priceLabel}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* floating right arrow (vertical center) */}
//           <button
//             onClick={scrollNext}
//             aria-label="Next trends"
//             className="hidden md:inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border absolute right-[-10px] top-1/2 transform -translate-y-1/2"
//             style={{ zIndex: 40 }}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
//       </section>

//       {/* AJIO CARES Section */}
//       <div className="bg-[#22313f] text-center text-white py-6 px-4 border-4 border-yellow-600">
//         <h2 className="text-xl font-bold tracking-wide mb-2 text-yellow-200 ">AJIO CARES</h2>
//         <p className="text-sm max-w-4xl mx-auto leading-relaxed">
//           WE DO NOT ASK FOR YOUR BANK ACCOUNT OR CARD DETAILS VERBALLY OR TELEPHONICALLY. <br />
//           WE ALSO DO NOT ASK FOR MONEY TO PARTICIPATE IN ANY OF OUR OFFERS OR RUN ANY LUCKY DRAWS.
//         </p>
//       </div>
//     </div>
//   );
// }
