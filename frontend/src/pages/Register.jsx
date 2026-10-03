import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
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
        "/auth/user/register",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      login(response.data.token, response.data.user);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Registration failed. Please try again.";
      if (errMsg.toLowerCase().includes("exist")) {
        toast.error("User already exists");
      } else {
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream-100">
      {/* Left - Brand image */}
      <div className="hidden lg:flex lg:w-1/2 bg-sage-800 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-900/90 to-sage-800/80" />
        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200"
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
            Smart technology. Thoughtful design.
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
              Create Account
            </h2>
            <p className="text-sage-500 mt-2">
              Join us and start shopping
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
                <input
                  type="text"
                  required
                  className="input pl-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-sage-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-sage-800 hover:text-accent-600 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
