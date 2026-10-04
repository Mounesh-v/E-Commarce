import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import {
  ShoppingCart,
  User,
  LogOut,
  Image as ImageIcon,
  Folder,
  Menu,
  X,
  Package,
} from "lucide-react";

const navLinks = [
  { to: "/ai-search", label: "AI Product Search", icon: ImageIcon },
  { to: "/collections", label: "Collections", icon: Folder },
  { to: "/orders", label: "Orders", icon: Package },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleProfile = () => navigate("/profile");

  return (
    <>
      {/* Main header */}
      <header className="bg-sage-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/20 group-hover:shadow-accent-500/40 transition-shadow">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  ShopModern
                </span>
                <span className="block text-[10px] text-cream-300 -mt-0.5 tracking-wide">
                  Tech for a Better You
                </span>
              </div>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              <Link
                to="/ai-search"
                className="flex items-center gap-1.5 text-sm font-medium text-cream-200 hover:text-white bg-sage-700/60 hover:bg-sage-700 px-3 py-2 rounded-xl transition-colors h-9"
                title="AI-based Image Search for product discovery"
              >
                <ImageIcon className="h-4 w-4 text-accent-400" />
                <span className="hidden sm:inline whitespace-nowrap">
                  AI Product Search
                </span>
              </Link>

              <Link
                to="/orders"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-cream-200 hover:text-white hover:bg-sage-700 px-3 py-2 rounded-xl transition-colors h-9"
              >
                <Package className="h-4 w-4" />
                <span className="whitespace-nowrap">Orders</span>
              </Link>

              <Link
                to="/collections"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-cream-200 hover:text-white hover:bg-sage-700 px-3 py-2 rounded-xl transition-colors h-9"
              >
                <Folder className="h-4 w-4" />
                <span className="whitespace-nowrap">Collections</span>
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-accent-400 hover:text-accent-300 bg-sage-700/50 hover:bg-sage-700 px-3 py-2 rounded-xl transition-colors"
                >
                  Admin
                </Link>
              )}

              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-sage-300 hover:text-white hover:bg-sage-700 transition-colors"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-accent-500 rounded-full border-2 border-sage-800">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleProfile}
                    className="w-9 h-9 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center font-bold text-sm hover:bg-accent-500/30 transition-colors"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="p-2.5 rounded-xl text-sage-400 hover:text-white hover:bg-sage-700 transition-colors hidden sm:flex"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 h-9 rounded-xl text-sm font-semibold transition-colors"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <User className="h-4 w-4" />
                </Link>
              )}

              <button
                className="p-2.5 rounded-xl text-sage-300 hover:text-white hover:bg-sage-700 transition-colors md:hidden"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative left-0 top-0 h-full w-72 bg-cream-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-sage-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="font-display font-bold text-lg text-sage-900">
                  Menu
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-sage-50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-sage-600" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sage-700 hover:text-sage-900 hover:bg-sage-50 rounded-xl transition-colors"
                >
                  <link.icon className="w-5 h-5 text-sage-500" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sage-700 hover:text-sage-900 hover:bg-sage-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-sage-500" />
                  <span className="font-medium">Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="text-xs font-bold bg-accent-500 text-white px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-accent-600 bg-accent-50 rounded-xl font-semibold"
                >
                  <span className="text-lg">⚡</span>
                  Admin
                </Link>
              )}

              <div className="border-t border-sage-100 my-3" />

              {user ? (
                <>
                  <button
                    onClick={() => {
                      handleProfile();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sage-700 hover:bg-sage-50 rounded-xl transition-colors"
                  >
                    <User className="w-5 h-5 text-sage-500" />
                    <span className="font-medium">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-muted-red hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-sage-800 text-white py-3 rounded-xl font-semibold"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>

            <div className="p-4 text-[10px] text-sage-400 text-center border-t border-sage-100">
              ShopModern &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
