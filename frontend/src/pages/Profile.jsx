import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Camera,
  Loader2,
  Mail,
  Package,
  Save,
  ShoppingBag,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import api from "../services/api";
import useCart from "../hooks/useCart";
import { formatINR } from "../utils/currency";

const getStoredUser = () => {
  try {
    const value = localStorage.getItem("userInfo");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    _id: user._id || user.id,
    id: user.id || user._id,
    profilePic: user.profilePic || user.avatar || "",
  };
};

const Profile = () => {
  const [user, setUser] = useState(() => normalizeUser(getStoredUser()));
  const [form, setForm] = useState({
    name: user?.name || "",
    profilePic: user?.profilePic || "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { cartItems, cartTotal, cartCount, loading: cartLoading } = useCart();

  const initials = useMemo(() => {
    const name = form.name || user?.name || user?.email || "User";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [form.name, user]);

  const recentCartItems = useMemo(() => cartItems.slice(0, 3), [cartItems]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        const nextUser = normalizeUser(res.data.user);
        setUser(nextUser);
        setForm({ name: nextUser?.name || "", profilePic: nextUser?.profilePic || "" });
        localStorage.setItem("userInfo", JSON.stringify(nextUser));
        window.dispatchEvent(new Event("auth-changed"));
      } catch (error) {
        const stored = normalizeUser(getStoredUser());
        if (stored?._id) {
          try {
            const res = await api.get(`/auth/user/${stored._id}`);
            const nextUser = normalizeUser(res.data.user);
            setUser(nextUser);
            setForm({ name: nextUser?.name || "", profilePic: nextUser?.profilePic || "" });
            localStorage.setItem("userInfo", JSON.stringify(nextUser));
            window.dispatchEvent(new Event("auth-changed"));
          } catch {
            toast.error("Failed to load profile");
          }
        } else {
          toast.error(error.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", {
        name: form.name,
        profilePic: form.profilePic,
      });
      const nextUser = normalizeUser(res.data.user);
      setUser(nextUser);
      localStorage.setItem("userInfo", JSON.stringify(nextUser));
      window.dispatchEvent(new Event("auth-changed"));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-6 sm:py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sage-500">
            My Account
          </p>
          <h1 className="mt-2 section-title text-3xl">Your Profile</h1>
          <p className="mt-2 text-sage-500 text-sm max-w-lg">
            Manage your account details and keep track of your cart.
          </p>
        </div>
        <Link
          to="/orders"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sage-800 px-5 text-sm font-semibold text-white hover:bg-sage-700 transition-colors"
        >
          View Orders
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Profile card */}
        <section className="card p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 rounded-2xl bg-sage-800 text-white overflow-hidden">
              {form.profilePic ? (
                <img
                  src={form.profilePic}
                  alt={form.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-black">
                  {initials || <UserRound className="h-8 w-8" />}
                </div>
              )}
              <div className="absolute bottom-1.5 right-1.5 rounded-full bg-white p-1.5 text-sage-600 shadow-md">
                <Camera className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-display font-bold text-sage-900">
                {user?.name || "Customer"}
              </h2>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-sage-500">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sage-100 px-2.5 py-1 text-xs font-semibold text-sage-700">
                Active shopper
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-sage-700">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-sage-700">
                Profile image URL
              </label>
              <input
                name="profilePic"
                value={form.profilePic}
                onChange={handleChange}
                className="input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-sage-700">
                Email address
              </label>
              <input
                value={user?.email || ""}
                readOnly
                className="input cursor-not-allowed bg-cream-50"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </section>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sage-50 text-sage-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-sage-900">{cartCount}</p>
              <p className="text-sm text-sage-500">Cart items</p>
            </div>
            <div className="card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cream-200 text-accent-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-sage-900">
                {formatINR(cartTotal)}
              </p>
              <p className="text-sm text-sage-500">Cart total</p>
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-bold text-sage-900">
                Current Cart
              </h3>
              <Link
                to="/cart"
                className="text-sm font-semibold text-sage-600 hover:text-sage-800 transition-colors"
              >
                Open cart
              </Link>
            </div>

            {cartLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-sage-400" />
              </div>
            ) : recentCartItems.length === 0 ? (
              <div className="bg-cream-50 rounded-2xl p-6 text-center">
                <Package className="mx-auto mb-2 h-7 w-7 text-sage-300" />
                <p className="font-semibold text-sage-800 text-sm">
                  Your cart is empty
                </p>
                <p className="text-xs text-sage-500 mt-1">
                  Add products to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-5 w-5 text-sage-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-sage-900 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-sage-500">
                        Qty {item.cartQuantity} &middot; {formatINR(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
