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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[350px]">
        <h2 className="text-lg font-bold mb-4">Add to Collection</h2>

        {/* Create */}
        <input
          type="text"
          placeholder="New Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4"
        />

        <button
          onClick={handleCreateAndAdd}
          className="w-full bg-primary-600 text-white py-2 rounded-lg mb-4"
        >
          Create & Add
        </button>

        {/* Existing */}
        <h3 className="text-sm font-semibold mb-2">Select Collection</h3>

        {collections.length === 0 ? (
          <p className="text-gray-500 text-sm">No collections found</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {collections.map((col) => (
              <button
                key={col._id}
                onClick={() => handleSelectCollection(col._id)}
                className="w-full text-left p-2 border rounded-lg hover:bg-gray-100"
              >
                {col.name}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-200 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CollectionModal;
