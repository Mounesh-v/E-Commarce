import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import useCart from "../hooks/useCart";
import { formatINR } from "../utils/currency";
import CollectionModal from "./CollectionModal";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleGetProduct = () => navigate(`/product/${product._id}`);

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : 0;

  return (
    <div className="card group flex flex-col overflow-hidden">
      {/* Image */}
      <div
        onClick={handleGetProduct}
        className="relative aspect-square overflow-hidden bg-cream-50 cursor-pointer"
      >
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={product?.images?.[0]?.url}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-muted-red text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
              {discountPct}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-sage-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3 flex-1" onClick={handleGetProduct}>
          {product.brand && (
            <p className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="font-semibold text-sage-900 line-clamp-1 group-hover:text-sage-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-sage-500 line-clamp-2 mt-1 min-h-[36px]">
            {product.desc || "Premium product you'll love."}
          </p>
        </div>

        {/* Price + Actions */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <span className="text-lg font-bold text-sage-900">
              {formatINR(product.price)}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-sage-400 line-through">
                {formatINR(product.discountPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-sage-800 hover:bg-sage-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
              setShowModal(true);
            }}
            className="px-3 py-2.5 border border-sage-200 rounded-xl text-sage-600 hover:bg-sage-50 transition-colors text-sm font-medium"
            title="Add to Collection"
          >
            +
          </button>
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

export default ProductCard;
