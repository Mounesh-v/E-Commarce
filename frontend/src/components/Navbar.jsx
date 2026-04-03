import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  Image as ImageIcon,
  Folder,
  Menu,
  X,
  Package,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
                ShopModern
              </span>
            </Link>

            <button
              className="sm:hidden p-2 rounded-lg bg-slate-100"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-3 sm:gap-6">
              <Link
                to="/ai-search"
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl transition-all h-10"
              >
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">AI Match</span>
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl transition-all h-10"
              >
                <Package className="w-6 h-6" />
                <span className="hidden sm:inline">Orders</span>
              </Link>
              <Link
                to="/collections"
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl transition-all h-10"
              >
                <Folder className="h-4 w-4" />
                <span className="hidden sm:inline">Collections</span>
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all h-10"
                >
                  Admin Area
                </Link>
              )}

              <Link
                to="/cart"
                className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors h-10 w-10 flex items-center justify-center bg-slate-50 hover:bg-primary-50 rounded-xl"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full border-2 border-white min-w-[20px]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <div
                    onClick={handleProfile}
                    className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="text-slate-600 hover:text-red-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-white bg-slate-900 px-4 h-10 rounded-xl"
                >
                  <span>Sign In</span>
                  <User className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          className={`fixed inset-0 z-[9999] overflow-hidden flex ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          {/* Overlay - Enhanced with deeper blur + subtle gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-xl transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar - Premium look */}
          <div
            className={`absolute left-0 top-0 h-full w-72 bg-white/95 dark:bg-slate-900/95 
                backdrop-blur-2xl shadow-2xl flex flex-col gap-4 
                rounded-r-3xl overflow-hidden border-r border-white/20
                transition-all duration-500 ease-out
                ${isOpen ? "translate-x-0 opacity-100 scale-100" : "-translate-x-full opacity-0 scale-95"}`}
          >
            {/* Subtle background accent (gradient overlay) */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-6 pb-2 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✦</span>
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                  Menu
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Links Container */}
            <div className="flex-1 px-3 space-y-1 relative z-10">
              <Link
                to="/ai-search"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 px-4 py-3.5 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-2xl transition-all duration-300 active:scale-[0.985]"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/50 rounded-xl group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium">AI Match</span>
              </Link>
              <Link
                to="/orders"
                className="group flex items-center gap-3 px-4 py-3.5 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-2xl transition-all duration-300 active:scale-[0.985]"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/50 rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="font-medium">Orders</span>
              </Link>
              <Link
                to="/collections"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 px-4 py-3.5 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-2xl transition-all duration-300 active:scale-[0.985]"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/50 rounded-xl group-hover:scale-110 transition-transform">
                  <Folder className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium">Collections</span>
              </Link>

              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between px-4 py-3.5 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-2xl transition-all duration-300 active:scale-[0.985]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/50 rounded-xl group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-medium">Cart</span>
                </div>

                {cartCount > 0 && (
                  <span className="text-xs font-semibold bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 text-indigo-600 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 rounded-2xl font-semibold hover:shadow-md transition-all active:scale-[0.985]"
                >
                  <span className="text-xl">⚡</span>
                  Admin Dashboard
                </Link>
              )}

              {/* Divider */}
              <div className="border-t border-slate-200 dark:border-slate-700 my-6 mx-4" />

              {/* User Section */}
              {user ? (
                <div className="px-3 space-y-1">
                  <button
                    onClick={() => {
                      handleProfile();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-2xl transition-all active:scale-[0.985]"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-2xl transition-all active:scale-[0.985]"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="mx-3 mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-black hover:from-slate-800 hover:to-black text-white py-3.5 rounded-2xl font-semibold shadow-lg shadow-slate-900/30 transition-all active:scale-[0.985]"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Optional subtle footer accent */}
            <div className="p-6 text-[10px] text-slate-400 dark:text-slate-500 text-center">
              v1.4 • Made with ❤️
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
