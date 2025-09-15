
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Top Trends Data
const topTrends = [
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROT3l0T9VElhqi1SrKSvsSwbwK2B9hiQnPVCQ13S_MG0LhuGYdQEBJfryYQLB0F-KhAH4&usqp=CAU",
    title: "DNMX, Netplay & more",
    price: "UNDER ₹399*",
  },
  {
    img: "https://cmsimages.shoppersstop.com/denim_destination_app_1d99461511/denim_destination_app_1d99461511.png",
    title: "yousta",
    price: "UNDER ₹499*",
  },
  {
    img: "https://panorama-mall.com/wp-content/uploads/2019/12/%D8%A8%D9%84%D9%88%D8%A7%D9%8A%D8%AC-498x400.jpg",
    title: "Kurta & Kurti Sets",
    price: "UNDER ₹599*",
  },
  {
    img: "https://www.shutterstock.com/image-vector/denim-jeans-banner-design-social-260nw-2299961357.jpg",
    title: "AZORTE",
    price: "MIN. 70% OFF*",
  },
];

const HomeCarousel = () => {
  const swiperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current.swiper;
    if (!swiper) return;

    if (isPlaying) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Carousel Section */}
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="rounded-lg overflow-hidden"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="flex items-center justify-between w-full h-[360px] bg-yellow-300 m-6">
            <div className="flex-1 flex justify-center items-center h-full">
              <img
                src="https://mercury.akamaized.net/i/b2a0934ce36332ca93c5c0463c35dd61_339103_0.jpg"
                alt="Models"
                className="h-full object-contain"
              />
            </div>
            <div className="flex-1 bg-gray-100 flex flex-col justify-center items-center h-full p-6">
              <h2 className="text-2xl font-bold text-center">
                TeamSpirit & DNMX <br /> BRAND DAY
              </h2>
              <p className="text-lg mt-3 font-semibold">30-50% OFF*</p>
              <button className="mt-4 px-6 py-2 bg-black text-white rounded">
                SHOP NOW
              </button>
              <p className="text-xs mt-2">*T&C apply</p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="flex justify-center items-center w-full h-[400px] bg-white">
            <img
              src="https://assets-jiocdn.ajio.com/cms/AJIO/WEB/D-RHS-UHP-1.0-S1-Mainbanner-P1-Finalclearancesale-5090-01092025.jpg"
              alt="Banner"
              className="h-full object-contain"
            />
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="flex justify-center items-center w-full h-[400px] bg-white">
            <img
              src="https://assets.ajio.com/cms/AJIO/WEB/10112022-unisex-d-top-p2-brands-min50.jpg"
              alt="Banner"
              className="h-full object-contain"
            />
          </div>
        </SwiperSlide>

        {/* Slide 4 */}
        <SwiperSlide>
          <div className="flex justify-center items-center w-full h-[360px] bg-white m-6">
            <img
              src="https://assets.ajio.com/medias/sys_master/images/images/h8c/h21/32084073054238/26042021-d-unisex-topcarousel-athleisure-30to60.jpg"
              alt="Banner"
              className="h-full object-contain"
            />
          </div>
        </SwiperSlide>

        {/* Slide 5 */}
        <SwiperSlide>
          <div className="flex justify-center items-center w-[1200px] h-[350px] bg-white m-6">
            <img
              src="https://st-images.honasa.in/Desktop_FLA_Sh_Sale_Feb_25_5b96fb1bd1.jpg?format=auto&width=&qualilty="
              alt="Banner"
              className="h-full object-contain"
            />
          </div>
        </SwiperSlide>

        {/* Slide 6 */}
        <SwiperSlide>
          <div className="flex justify-center items-center w-full h-[350px] bg-white m-6">
            <img
              src="https://mediabrief.com/wp-content/uploads/2023/06/Image-the-ajio-big-bold-sale-is-here-MediaBrief.jpg"
              alt="Banner"
              className="h-full object-contain"
            />
          </div>
        </SwiperSlide>

        {/* Slide 7 - Coupon */}
        <SwiperSlide>
          <div className="flex items-center justify-center w-full h-[400px] bg-pink-100">
            <div className="relative border-2 border-pink-400 rounded-xl w-full max-w-3xl py-8 text-center bg-white">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-100 border-2 border-pink-400"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-100 border-2 border-pink-400"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                GET 5%* INSTANT DISCOUNT
              </h2>
              <p className="mt-3 text-gray-700">On all prepaid transactions</p>
              <p className="text-xs mt-2">*T&C apply</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* ✅ Pause/Play Button overlay on carousel */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause carousel autoplay" : "Play carousel autoplay"}
        className="absolute left-5 bg-black/70 text-white px-3 py-1 rounded-lg text-sm hover:bg-black transition"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Top Trends Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Top Trends</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {topTrends.map((trend, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <img
                  src={trend.img}
                  alt={trend.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold">{trend.title}</h3>
                  <p className="text-gray-700 mt-1">{trend.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Fashion World Section */}
      <div className="max-w-7xl mx-auto mt-12 mb-3">
        <h2 className="text-2xl font-bold mb-6 text-center">Fashion World</h2>
        <img
          src="https://admin.pacificmalls.in/uploads/blog/1746613554_spring%20summer%20blog%20copy%20(1).jpg"
          alt="Fashion World"
          className="mx-auto rounded-lg shadow"
        />
      </div>
    </div>
  );
};

export default HomeCarousel;
