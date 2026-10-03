import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import { toast } from "react-hot-toast";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Minus,
  Plus,
  Truck,
} from "lucide-react";
import { formatINR } from "../utils/currency";
import CollectionModal from "../components/CollectionModal";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } =
    useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const orderResponse = await api.post("/payment/create-order", {
        amount: cartTotal,
        currency: "INR",
        receipt: `cart_${Date.now()}`,
      });

      const { orderId, amount, currency } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount,
        currency,
        name: "ShopModern",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.cartQuantity,
              })),
              totalPrice: cartTotal,
            });
            toast.success("Payment successful!");
            clearCart();
            navigate("/success");
          } catch {
            toast.error("Payment verification failed");
            navigate("/cancel");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#30483B" },
        modal: {
          ondismiss: () => toast.error("Payment cancelled"),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-sage-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-sage-300" />
        </div>
        <h2 className="text-2xl font-display font-bold text-sage-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-sage-500 mb-8 max-w-md">
          Looks like you haven't added anything yet. Discover our latest
          products.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          Start Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8">
      <h1 className="text-3xl font-display font-extrabold text-sage-950 tracking-tight mb-8">
        Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1">
          <div className="card overflow-hidden divide-y divide-sage-100">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5"
              >
                <Link
                  to={`/product/${item._id}`}
                  className="w-28 h-28 shrink-0 bg-cream-50 rounded-2xl overflow-hidden"
                >
                  <img
                    src={item?.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${item._id}`}
                      className="font-semibold text-sage-900 hover:text-sage-700 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-sage-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-sage-900">
                      {formatINR(item.price)}
                    </span>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-cream-50 rounded-lg border border-sage-200 p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              Math.max(0, item.cartQuantity - 1)
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-sage-400 hover:text-sage-700 rounded-md transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-sage-900">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.cartQuantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-sage-400 hover:text-sage-700 rounded-md transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-sage-400 hover:text-muted-red hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        className="px-2.5 py-1 text-[11px] font-medium text-sage-600 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowModal(true);
                        }}
                      >
                        Collection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px]">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-display font-bold text-sage-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-sage-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold text-sage-900">
                  {formatINR(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sage-600">
                <span>Shipping</span>
                <span className="font-semibold text-sage-700">Free</span>
              </div>
            </div>

            <div className="border-t border-sage-100 pt-4 mb-6 flex justify-between items-center">
              <span className="text-base font-bold text-sage-900">Total</span>
              <span className="text-2xl font-extrabold text-sage-950">
                {formatINR(cartTotal)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-sage-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure SSL Checkout
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-sage-500">
              <Truck className="w-3.5 h-3.5" />
              Free shipping above ₹999
            </div>
          </div>
        </div>
      </div>

      <CollectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Cart;
