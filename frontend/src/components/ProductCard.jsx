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

  const handleGetProduct = async (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 group flex flex-col">
      <div
        onClick={() => handleGetProduct(product._id)}
        className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700"
      >
        <img
          src={product?.images?.[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-primary-500/30">
            NEW
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4 flex-1">
          <div onClick={() => handleGetProduct(product._id)} className="block">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 min-h-[40px]">
              {product.description || "Amazing product you need right now."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            {formatINR(product.price)}
          </span>
          <button
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-primary-500/30 active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button
            className="text-sm font-medium mt-2 flex items-center gap-1 bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-all"
            onClick={() => {
              setSelectedProduct(product); //  correct
              setShowModal(true);
            }}
          >
            Add Collection
          </button>

          <CollectionModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            product={selectedProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
