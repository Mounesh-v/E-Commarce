import React from "react";
import Navbar from "./Navbar";
import { Outlet, Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

const Footer = () => (
  <footer className="bg-sage-800 text-cream-200 mt-auto">
    {/* Links grid */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div>
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-display font-bold text-lg text-white">
              ShopModern
            </span>
          </Link>
          <p className="text-sage-400 text-sm leading-relaxed mb-4">
            Calm technology. Thoughtful design. Smarter shopping.
          </p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg bg-sage-700/50 flex items-center justify-center text-sage-400 hover:text-white hover:bg-sage-700 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-sage-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-sage-400">
        <p>&copy; {new Date().getFullYear()} ShopModern. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> +91 98765 43210
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> support@shopmodern.in
          </span>
        </div>
      </div>
    </div>
  </footer>
);

const Layout = () => {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
