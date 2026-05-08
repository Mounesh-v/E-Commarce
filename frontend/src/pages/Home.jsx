import React, { useState, useEffect } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import SerachBar from "../components/SerachBar";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product/get-all-products");
        if (response?.data?.products && response?.data?.products?.length > 0) {
          setProducts(response.data.products);
        } else {
          setProducts(response?.data?.products);
        }
      } catch (error) {
        console.log("Using mock data, backend not reachable:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600",
      title: "Redefining Your Digital Life",
      subtitle: "Explore premium tech accessories",
    },
    {
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600",
      title: "Next Gen Gadgets",
      subtitle: "Upgrade your lifestyle today",
    },
    {
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600",
      title: "Smart Living Starts Here",
      subtitle: "Discover innovation",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="pb-12 space-y-12">
      {/* Search Bar with full width */}
      <SerachBar />

      {/* Hero Section */}
      <div className="relative w-full h-[70vh] rounded-[2.5rem] overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
              index === current ? "opacity-100 z-20" : "opacity-0 z-0"
            }`}
          >
            {/* Image */}
            <img
              src={slide.img}
              className="w-full h-full object-cover"
              alt="hero"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-30">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-lg text-gray-300 mb-6">
                {slide.subtitle}
              </p>

              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold">
                Shop Now
              </button>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/30 p-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/30 p-2 rounded-full"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-40">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full ${
                i === current ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div id="products">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Trending Now
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Discover our most popular products this week
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 mx-auto text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <circle cx="12" cy="3" r="1">
                    <animate
                      id="spinner_7Z73"
                      begin="0;spinner_tKsu.end-0.5s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="16.50" cy="4.21" r="1">
                    <animate
                      id="spinner_Wd87"
                      begin="spinner_7Z73.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="7.50" cy="4.21" r="1">
                    <animate
                      id="spinner_tKsu"
                      begin="spinner_9Qlc.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="19.79" cy="7.50" r="1">
                    <animate
                      id="spinner_lMMO"
                      begin="spinner_Wd87.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="4.21" cy="7.50" r="1">
                    <animate
                      id="spinner_9Qlc"
                      begin="spinner_Khxv.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="21.00" cy="12.00" r="1">
                    <animate
                      id="spinner_5L9t"
                      begin="spinner_lMMO.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="3.00" cy="12.00" r="1">
                    <animate
                      id="spinner_Khxv"
                      begin="spinner_ld6P.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="19.79" cy="16.50" r="1">
                    <animate
                      id="spinner_BfTD"
                      begin="spinner_5L9t.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="4.21" cy="16.50" r="1">
                    <animate
                      id="spinner_ld6P"
                      begin="spinner_XyBs.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="16.50" cy="19.79" r="1">
                    <animate
                      id="spinner_7gAK"
                      begin="spinner_BfTD.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="7.50" cy="19.79" r="1">
                    <animate
                      id="spinner_XyBs"
                      begin="spinner_HiSl.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <circle cx="12" cy="21" r="1">
                    <animate
                      id="spinner_HiSl"
                      begin="spinner_7gAK.begin+0.1s"
                      attributeName="r"
                      calcMode="spline"
                      dur="0.6s"
                      values="1;2;1"
                      keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                    ></animate>
                  </circle>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="6s"
                    values="360 12 12;0 12 12"
                    repeatCount="indefinite"
                  ></animateTransform>
                </g>
              </svg>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
