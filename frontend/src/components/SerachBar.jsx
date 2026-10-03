import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const res = await api.get(
        `/product/search?query=${encodeURIComponent(trimmed)}`
      );
      setProducts(res.data.products || []);
      setSuggestions([]);
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed. Please try again.");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const delay = setTimeout(async () => {
      if (query.length > 1) {
        try {
          const res = await api.get(
            `/product/suggest?query=${encodeURIComponent(query)}`
          );
          if (!cancelled) setSuggestions(res.data.products || []);
        } catch (err) {
          console.error("Suggest error:", err);
          if (!cancelled) setSuggestions([]);
        }
      } else if (!cancelled) {
        setSuggestions([]);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(delay);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-group")) {
        setSuggestions([]);
        setProducts([]);
        setSearched(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeDropdowns = () => {
    setSuggestions([]);
    setProducts([]);
    setSearched(false);
  };

  const showNoResults = searched && products.length === 0 && isFocused;

  return (
    <div className="relative w-full search-group">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sage-400" />
        <input
          ref={inputRef}
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for products, brands and more..."
          className="w-full bg-white border border-sage-200 rounded-2xl pl-12 pr-4 py-4 text-sage-900 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 shadow-soft transition-all text-base"
        />
      </div>

      {/* Suggestions dropdown */}
      {query.length > 1 && isFocused && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-elevated rounded-2xl z-[999] border border-sage-100 overflow-hidden">
          <p className="text-[11px] font-semibold text-sage-400 uppercase tracking-wider px-4 py-2.5 border-b border-sage-100">
            Suggestions
          </p>
          {suggestions.map((s) => (
            <div
              key={s._id}
              className="px-4 py-3 flex items-center gap-3 hover:bg-cream-100 cursor-pointer transition-colors"
              onMouseDown={() => {
                setQuery(s.name);
                navigate(`/product/${s._id}`);
                closeDropdowns();
              }}
            >
              <img
                src={s?.images?.[0]?.url || "https://via.placeholder.com/40"}
                className="w-10 h-10 object-cover rounded-xl"
                alt=""
              />
              <p className="text-sm font-medium text-sage-800 flex-1 line-clamp-1">
                {s.name}
              </p>
              <p className="text-sm font-bold text-sage-700 whitespace-nowrap">
                ₹{s.price}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Search results */}
      {products.length > 0 && isFocused && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-elevated rounded-2xl z-50 max-h-72 overflow-y-auto border border-sage-100">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-cream-100 cursor-pointer transition-colors"
              onMouseDown={() => {
                navigate(`/product/${p._id}`);
                closeDropdowns();
              }}
            >
              <img
                src={p?.images?.[0]?.url || "https://via.placeholder.com/40"}
                className="w-10 h-10 object-cover rounded-xl"
                alt=""
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sage-800 line-clamp-1">
                  {p.name}
                </p>
                <p className="text-xs font-semibold text-sage-600">
                  ₹{p.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {showNoResults && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-elevated rounded-2xl z-50 border border-sage-100 px-4 py-4 text-center">
          <p className="text-sm text-sage-600 font-medium">
            No products found for “{query.trim()}”
          </p>
          <p className="text-xs text-sage-400 mt-1">
            Try a different keyword or brand.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
