import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-16">
      <p className="text-7xl sm:text-8xl font-display font-extrabold text-sage-200 select-none">
        404
      </p>
      <div className="w-16 h-1.5 bg-accent-500 rounded-full my-6" />
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-sage-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-sage-500 max-w-md mb-8 text-sm sm:text-base">
        The page you're looking for doesn't exist or has been moved. Let's get
        you back to shopping.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/collections"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-sage-200 text-sage-700 hover:border-sage-400 hover:bg-white font-semibold transition-colors"
        >
          <Search className="w-4 h-4" />
          Browse Collections
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-sage-200 text-sage-700 hover:border-sage-400 hover:bg-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
