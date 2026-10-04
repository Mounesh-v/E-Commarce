import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SerachBar";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product/get-all-products?limit=all");
        setProducts(response?.data?.products || []);
      } catch (error) {
        console.log("Backend not reachable:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600",
      title: "Upgrade Your Everyday",
      subtitle: "Smart technology. Thoughtful design. A better digital life.",
      cta: "Shop Now",
    },
    {
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600",
      title: "Next Gen Gadgets",
      subtitle: "Explore premium tech for modern living.",
      cta: "Explore Now",
    },
    {
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600",
      title: "Smart Living Starts Here",
      subtitle: "Thoughtfully designed technology for every moment.",
      cta: "Discover",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="pb-16 space-y-16">
      {/* Search */}
      <SearchBar />

      {/* Hero */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-3xl overflow-hidden bg-sage-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.img}
              className="w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sage-900/90 via-sage-900/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
                <div className="max-w-lg">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-cream-300 text-base sm:text-lg mb-8 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/"
                      className="bg-accent-500 hover:bg-accent-600 text-white px-7 py-3.5 rounded-xl font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      {slide.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/collections"
                      className="border-2 border-cream-300/40 text-cream-200 hover:bg-white/10 px-7 py-3.5 rounded-xl font-semibold transition-colors"
                    >
                      Explore Collections
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-accent-500" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div id="products">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Handpicked tech for a smarter everyday.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 skeleton w-1/3" />
                  <div className="h-5 skeleton w-2/3" />
                  <div className="h-3 skeleton w-full" />
                  <div className="h-6 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
