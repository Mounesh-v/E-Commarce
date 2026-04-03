import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Loader2,
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import useCart from "../hooks/useCart";
import { formatINR } from "../utils/currency";
import CollectionModal from "../components/CollectionModal";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // call single product API
        const response = await api.get(`/product/${id}`);

        console.log("single product", response.data.product);

        setProduct(response.data.product); // correct
      } catch (error) {
        console.log("Error fetching product:", error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-primary-600 hover:underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to products</span>
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100/50 overflow-hidden lg:p-12 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-slate-50 rounded-3xl overflow-hidden group">
            <img
              src={
                product?.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
              }
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-2 text-sm font-semibold tracking-wider text-primary-600 uppercase">
              {product.category || "Premium Tech"}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-bold text-slate-900">
                {formatINR(product?.price)}
              </span>
              {product.stock !== 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 mb-2">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {product.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 pt-8 border-t border-slate-100">
              <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-200/60 w-fit h-14 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 text-2xl font-light rounded-xl hover:bg-slate-200/50 transition-colors"
                >
                  -
                </button>
                <span className="w-14 text-center font-semibold text-slate-900 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 text-2xl font-light rounded-xl hover:bg-slate-200/50 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all hover:shadow-primary-500/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
              <button
                className="text-sm font-medium mt-2 flex items-center gap-1 bg-primary-600 text-white py-2 px-3 rounded-lg"
                onClick={() => {
                  setSelectedProduct(product); // ✅ correct
                  setShowModal(true);
                }}
              >
                + Add to Collection
              </button>

              <CollectionModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                product={selectedProduct}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
              <div className="flex flex-col gap-2">
                <Truck className="w-6 h-6 text-primary-500" />
                <span className="font-semibold text-slate-900">
                  Free Shipping
                </span>
                <span className="text-sm text-slate-500">
                  On orders over ₹50
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <RotateCcw className="w-6 h-6 text-primary-500" />
                <span className="font-semibold text-slate-900">
                  30-Day Returns
                </span>
                <span className="text-sm text-slate-500">
                  No questions asked
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-6 h-6 text-primary-500" />
                <span className="font-semibold text-slate-900">
                  2 Year Warranty
                </span>
                <span className="text-sm text-slate-500">
                  Full coverage included
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
