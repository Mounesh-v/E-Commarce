import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const CollectionModal = ({ isOpen, onClose, product }) => {
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState("");

  useEffect(() => {
    if (isOpen) fetchCollections();
  }, [isOpen]);

  const fetchCollections = async () => {
    try {
      const res = await api.get("/cart/collections");
      setCollections(res.data.collections);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectCollection = async (colId) => {
    try {
      await api.post("/cart/collection", {
        productId: product._id,
        collectionId: colId,
        quantity: product.cartQuantity || 1,
      });

      toast.success("Added to collection ✅");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  const handleCreateAndAdd = async () => {
    try {
      if (!collectionName) {
        toast.error("Enter collection name");
        return;
      }

      const res = await api.post("/cart/create-collection", {
        name: collectionName,
      });

      const newId = res.data.collection._id;

      await handleSelectCollection(newId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-[350px] border border-slate-200 dark:border-slate-700 shadow-xl transition-colors duration-300">
        <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Add to Collection</h2>

        {/* Create */}
        <input
          type="text"
          placeholder="New Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          className="w-full border border-slate-300 dark:border-slate-600 p-2 rounded-lg mb-4 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors"
        />

        <button
          onClick={handleCreateAndAdd}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg mb-4 font-medium transition-all"
        >
          Create & Add
        </button>

        {/* Existing */}
        <h3 className="text-sm font-semibold mb-2 text-slate-900 dark:text-white">Select Collection</h3>

        {collections.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">No collections found</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {collections.map((col) => (
              <button
                key={col._id}
                onClick={() => handleSelectCollection(col._id)}
                className="w-full text-left p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors"
              >
                {col.name}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CollectionModal;
