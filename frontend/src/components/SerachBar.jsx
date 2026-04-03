import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Search } from "lucide-react";

const SerachBar = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    const res = await api.get(`/product/search?query=${query}`);
    setProducts(res.data.products);
    console.log("Search Results:", res.data);
  };

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length > 1) {
        const res = await api.get(`/product/suggest?query=${query}`);
        console.log("Suggestions:", res.data.products);
        setSuggestions(res.data.products || []);
      } else {
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(delay);
  }, [query]);

  // hide Dropdown
  const location = useLocation();

  useEffect(() => {
    setSuggestions([]);
    setProducts([]);
  }, [location.pathname]);

  // hide dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".group")) {
        setSuggestions([]);
        setProducts([]);
        inputRef.current?.blur(); // 🔥 remove focus
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Search Input */}
      {/* <div className="flex-1 max-w-lg mx-4 hidden md:flex"> */}
      <div className="relative w-full group">
        <input
          value={query}
          ref={inputRef}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2 
      focus:outline-none focus:ring-2 focus:ring-primary-500 
      focus:border-transparent transition-all"
        />
        <Search
          onClick={handleSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 cursor-pointer"
        />

        {/* Suggestions */}
        {query.length > 1 && isFocused && (
          <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-lg rounded-xl z-[999] border">
            <p className="text-xs text-gray-500 px-3 py-2 border-b">
              Suggestions
            </p>

            {suggestions.length > 0 ? (
              suggestions.map((s) => (
                <div
                  key={s._id}
                  className="px-3 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => {
                    setQuery(s.name);
                    navigate(`/product/${s._id}`);
                    setSuggestions([]);
                  }}
                >
                  {/* Image */}
                  <img
                    src={
                      s?.images?.[0]?.url || "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 object-cover rounded"
                  />

                  {/* Name */}
                  <p className="text-sm font-medium text-slate-800 flex-1">
                    {s.name}
                  </p>

                  {/* Price */}
                  <p className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                    ₹{s.price}
                  </p>
                </div>
              ))
            ) : (
              //  NO RESULTS UI
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {products.length > 0 && (
          <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-lg rounded-xl z-50 max-h-64 overflow-y-auto border">
            {products.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  navigate(`/product/${p._id}`);
                  setSuggestions([]);
                  setProducts([]);
                }}
              >
                <img
                  src={p?.images?.[0]?.url || "https://via.placeholder.com/40"}
                  className="w-10 h-10 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">
                    {p.name}
                  </p>
                  <p className="text-xs text-green-600 font-semibold">
                    ₹{p.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* </div> */}
    </>
  );
};

export default SerachBar;
