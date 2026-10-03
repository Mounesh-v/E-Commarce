import React, { useEffect, useState } from "react";
import api from "../services/api";
import { formatINR } from "../utils/currency";
import { Link } from "react-router-dom";
import { Folder, Package, ArrowRight } from "lucide-react";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/cart/collections")
      .then((res) => {
        if (!cancelled) setCollections(res.data.collections || []);
      })
      .catch((err) => console.log(err));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="py-6 sm:py-8">
      <div className="mb-8">
        <h1 className="section-title">My Collections</h1>
        <p className="section-subtitle">
          Organize and save products you love.
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mb-5">
            <Folder className="w-10 h-10 text-sage-300" />
          </div>
          <h2 className="text-xl font-display font-bold text-sage-800 mb-2">
            No collections yet
          </h2>
          <p className="text-sage-500 text-sm mb-6">
            Start adding products to collections from the cart or product page.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 text-sm">
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {collections.map((col) => (
            <div key={col._id} className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center">
                    <Folder className="w-5 h-5 text-sage-600" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-sage-900 text-lg">
                      {col.name}
                    </h2>
                    <p className="text-xs text-sage-500">
                      {col.items.length} item{col.items.length !== 1 && "s"}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-sage-900">
                  {formatINR(col.totalPrice)}
                </span>
              </div>

              {col.items.length === 0 ? (
                <div className="bg-cream-50 rounded-2xl p-8 text-center">
                  <Package className="w-8 h-8 text-sage-300 mx-auto mb-2" />
                  <p className="text-sm text-sage-500">No items in this collection</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {col.items.map((item) => (
                    <Link
                      key={item._id}
                      to={`/product/${item.product}`}
                      className="group bg-cream-50 rounded-2xl p-3 hover:shadow-soft transition-all border border-sage-50"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-sm font-semibold text-sage-800 line-clamp-1 group-hover:text-sage-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-sage-700">
                        {formatINR(item.price)}
                      </p>
                      <p className="text-[11px] text-sage-400">
                        Qty: {item.quantity}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
