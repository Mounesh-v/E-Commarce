import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import useCart from "../hooks/useCart";
import { formatINR } from "../utils/currency";
import CollectionModal from "../components/CollectionModal";
import { ProductDetailsSkeleton } from "../components/Skeletons";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/product/${id}`);
        setProduct(response.data.product);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-sage-800">Product not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sage-600 hover:text-sage-800 font-medium"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const hasDiscount =
    product.discountPrice && product.discountPrice > product.price;

  return (
    <div className="py-6 sm:py-8 lg:py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sage-500 hover:text-sage-800 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to products</span>
      </button>

      <div className="card p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image */}
          <div className="relative aspect-square bg-cream-50 rounded-3xl overflow-hidden">
            <img
              src={
                product?.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
              }
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-muted-red text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                {Math.round(
                  ((product.discountPrice - product.price) /
                    product.discountPrice) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.brand && (
              <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-2">
                {product.brand}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-sage-950 tracking-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-sage-950">
                {formatINR(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-sage-400 line-through">
                  {formatINR(product.discountPrice)}
                </span>
              )}
            </div>

            {product.stock !== 0 ? (
              <div className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-700 mb-5">
                <Check className="w-4 h-4 text-sage-600" />
                In Stock
              </div>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-muted-red mb-5 w-fit">
                Out of Stock
              </span>
            )}

            <p className="text-sage-600 leading-relaxed mb-8">
              {product.desc}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex items-center bg-cream-50 rounded-xl border border-sage-200 h-12 px-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-sage-400 hover:text-sage-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-sage-900 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-sage-400 hover:text-sage-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-semibold transition-all active:scale-[0.98] ${
                  addedToCart
                    ? "bg-sage-600 text-white"
                    : "bg-sage-800 hover:bg-sage-700 text-white shadow-soft hover:shadow-card"
                } disabled:bg-sage-300 disabled:cursor-not-allowed`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            <button
              className="text-sm font-medium text-sage-600 hover:text-sage-800 mb-8 transition-colors"
              onClick={() => {
                setSelectedProduct(product);
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

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sage-100">
              {[
                { icon: Truck, title: "Free Shipping", desc: "Orders over ₹999" },
                { icon: RotateCcw, title: "7-Day Returns", desc: "Easy returns" },
                { icon: ShieldCheck, title: "1 Year Warranty", desc: "Full coverage" },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <item.icon className="w-5 h-5 text-sage-600 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-sage-800">{item.title}</p>
                  <p className="text-[11px] text-sage-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
