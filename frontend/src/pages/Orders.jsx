import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import api from "../services/api";
import { formatINR } from "../utils/currency";

const STATUS_STYLES = {
  pending: { icon: Clock, className: "bg-amber-50 text-amber-700" },
  paid: { icon: CheckCircle, className: "bg-accent-50 text-accent-700" },
  shipped: { icon: Truck, className: "bg-sky-50 text-sky-700" },
  delivered: { icon: PackageCheck, className: "bg-emerald-50 text-emerald-700" },
  cancelled: { icon: XCircle, className: "bg-red-50 text-muted-red" },
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/order");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mb-5">
          <Package className="w-10 h-10 text-sage-300" />
        </div>
        <h2 className="text-xl font-display font-bold text-sage-800 mb-2">
          No orders yet
        </h2>
        <p className="text-sage-500 mb-6 max-w-md text-sm">
          When you place an order, it will show up here with its status and
          details.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 text-sm">
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="mb-8">
        <h1 className="section-title">My Orders</h1>
        <p className="section-subtitle">
          Track the status of everything you&apos;ve purchased.
        </p>
      </div>

      <div className="space-y-5">
        {orders.map((order) => {
          const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
          const StatusIcon = status.icon;

          return (
            <div key={order._id} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sage-100">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sage-400">
                    Order placed
                  </p>
                  <p className="text-sm font-medium text-sage-700 mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${status.className}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {order.status?.charAt(0).toUpperCase() +
                      order.status?.slice(1)}
                  </span>
                  <span className="text-lg font-extrabold text-sage-950">
                    {formatINR(order.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-sage-50">
                {(order.products || []).map((item, index) => (
                  <div
                    key={item.product || index}
                    className="flex items-center gap-4 py-3"
                  >
                    <Link
                      to={item.product ? `/product/${item.product}` : "/"}
                      className="w-14 h-14 shrink-0 bg-cream-50 rounded-xl overflow-hidden"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-sage-800 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-sage-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-sage-700 whitespace-nowrap">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
