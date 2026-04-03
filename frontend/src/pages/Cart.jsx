import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
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

  // const handleCheckout = async () => {
  //   if (!user) {
  //     toast.error("Please login to place an order");
  //     navigate("/login");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await api.post("/order", {
  //       items: cartItems.map((i) => ({
  //         product: i._id,
  //         quantity: i.cartQuantity,
  //       })),
  //       totalAmount: cartTotal,
  //     });

  //     console.log("response", response);

  //     toast.success("Order placed successfully!");
  //     clearCart();
  //     navigate("/orders");
  //   } catch {
  //     toast.error("Success order placed! (Mock fallback)");
  //     clearCart();
  //     navigate("/orders");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCheckout = async () => {
    try {
      const product_data = {
        name: "Cart Items",
        price: cartTotal,
        images: [cartItems[0]?.image], // Use the image of the first item in the cart
      }
      const response = await api.post("/payment/create-checkout-session", {
        product_data,
      });

      console.log("payment response",response)
      
      const { url } = response.data;
      window.location.href = url; // Redirect to Stripe Checkout


    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-primary-300" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-slate-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our
          latest products and collections.
        </p>
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-8">
        Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 group"
                >
                  <div className="w-32 h-32 shrink-0 bg-slate-50 rounded-2xl overflow-hidden">
                    <img
                      src={item?.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                    <div className="flex-1 mb-4 sm:mb-0 pr-4 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        <Link
                          to={`/product/${item._id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="text-xl font-extrabold text-slate-900">
                        {formatINR(item?.price)}
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end justify-between">
                      <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200/60 p-1 mb-4">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              Math.max(0, item.cartQuantity - 1),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors font-medium"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-semibold text-slate-900 text-sm">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.cartQuantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors font-medium"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                      <button
                        className="text-sm font-medium   mt-2 flex items-center gap-1 bg-primary-600 text-white py-2 rounded-lg"
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowModal(true);
                        }}
                      >
                        + Add to Collection
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full lg:w-[380px]">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6 font-display">
              Order Summary
            </h2>

            <div className="space-y-4 mb-8 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold text-slate-900">
                  {formatINR(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping estimate</span>
                <span className="font-semibold text-slate-900">Free</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Tax estimate</span>
                <span className="font-semibold text-slate-900">{formatINR(cartTotal * 0.08)}</span>
              </div> */}
            </div>

            <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total</span>
              {/* <span className="text-3xl font-extrabold text-slate-900">{formatINR(cartTotal * 1.08)}</span> */}
              <span className="text-3xl font-extrabold text-slate-900">
                {formatINR(cartTotal)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/30 transition-all hover:shadow-primary-500/50 hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Checkout Securely
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <div className="mt-6 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Secure SSL Checkout
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
