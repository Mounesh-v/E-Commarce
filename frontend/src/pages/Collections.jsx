import React, { useEffect, useState } from "react";
import api from "../services/api";
import { formatINR } from "../utils/currency";
import { Link } from "react-router-dom";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await api.get("/cart/collections");
      setCollections(res.data.collections);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">My Collections</h1>

      {collections.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">No collections found</p>
      ) : (
        <div className="space-y-6">
          {collections.map((col) => (
            <div key={col._id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow border border-slate-100 dark:border-slate-700 transition-colors">
              <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{col.name}</h2>

              {col.items.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">No items</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {col.items.map((item) => (
                    <div key={item._id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-700/50 transition-colors">
                      <Link to={`/product/${item.product}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded"
                        />
                      </Link>

                      <Link
                        to={`/product/${item.product}`}
                        className="text-sm font-semibold mt-2 block hover:text-primary-600 dark:hover:text-primary-400 text-slate-900 dark:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {formatINR(item.price)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 font-bold text-slate-900 dark:text-white">
                Total: {formatINR(col.totalPrice)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
