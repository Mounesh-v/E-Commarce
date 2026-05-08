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
        setForm({
          name: nextUser?.name || "",
          profilePic: nextUser?.profilePic || "",
        });
        localStorage.setItem("userInfo", JSON.stringify(nextUser));
        window.dispatchEvent(new Event("auth-changed"));
      } catch (error) {
        const stored = normalizeUser(getStoredUser());
        if (stored?._id) {
          try {
            const res = await api.get(`/auth/user/${stored._id}`);
            const nextUser = normalizeUser(res.data.user);

            setUser(nextUser);
            setForm({
              name: nextUser?.name || "",
              profilePic: nextUser?.profilePic || "",
            });
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

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
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            My Account
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Your shopping profile
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
            Manage your account details and keep an eye on what is waiting in
            your cart.
          </p>
        </div>

        <Link
          to="/orders"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-700 px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 dark:hover:bg-slate-600"
        >
          View Orders
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-primary-600 text-white shadow-lg shadow-primary-500/20">
              {form.profilePic ? (
                <img
                  src={form.profilePic}
                  alt={form.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-black">
                  {initials || <UserRound className="h-10 w-10" />}
                </div>
              )}
              <div className="absolute bottom-2 right-2 rounded-full bg-white p-2 text-slate-700 shadow-md">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold text-slate-900 dark:text-white">
                {user?.name || "Customer"}
              </h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Active shopper
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-700/50 px-4 text-slate-900 dark:text-white outline-none transition-all focus:border-primary-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary-500/10"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Profile image URL
              </label>
              <input
                name="profilePic"
                value={form.profilePic}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-700/50 px-4 text-slate-900 dark:text-white outline-none transition-all focus:border-primary-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary-500/10"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <input
                value={user?.email || ""}
                readOnly
                className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 px-4 text-slate-500 dark:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600"
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

        <aside className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 text-primary-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{cartCount}</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cart items</p>
            </div>

            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {formatINR(cartTotal)}
              </p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cart total</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Current Cart</h3>
              <Link
                to="/cart"
                className="text-sm font-bold text-primary-600 hover:text-primary-700"
              >
                Open cart
              </Link>
            </div>

            {cartLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-7 w-7 animate-spin text-primary-600" />
              </div>
            ) : recentCartItems.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-6 text-center">
                <Package className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <p className="font-semibold text-slate-900 dark:text-white">
                  Your cart is empty
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add products to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-700">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Qty {item.cartQuantity} - {formatINR(item.price)}
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
