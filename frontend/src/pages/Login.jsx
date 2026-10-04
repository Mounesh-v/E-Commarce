import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(
        "/auth/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const userObj = response.data.user || { role: "user" };
      login(response.data.token, userObj);
      toast.success("Logged in successfully!");
      navigate(userObj.role === "admin" ? "/admin" : "/");
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream-100 relative">
      {/* Back button */}
      <button
        type="button"
        onClick={() =>
          window.history.length > 1 ? navigate(-1) : navigate("/")
        }
        className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-white/80 hover:bg-white text-sage-800 border border-sage-200 hover:border-sage-300 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-soft transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Left - Brand image */}
      <div className="hidden lg:flex lg:w-1/2 bg-sage-800 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-900/90 to-sage-800/80" />
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-accent-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/30">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-4xl font-display font-extrabold text-white mb-3">
            ShopModern
          </h1>
          <p className="text-cream-300 text-lg">
            Calm technology. Thoughtful design.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-display font-bold text-xl text-sage-900">
              ShopModern
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-extrabold text-sage-950">
              Welcome Back
            </h2>
            <p className="text-sage-500 mt-2">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
                <input
                  type="email"
                  required
                  className="input pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
                <input
                  type="password"
                  required
                  className="input pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-sage-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-sage-800 hover:text-accent-600 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
