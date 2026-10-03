import React, { useState } from "react";
import { UploadCloud, Search, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const AISearch = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleImageUpload = async (e) => {
    try {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      setFile(URL.createObjectURL(selectedFile));
      setLoading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await api.post("/ai/image-search", formData);
      setResults(res.data.similarProducts || []);
      setSearched(true);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Image search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setFile(null);
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="py-6 sm:py-8 lg:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
          AI-Powered
        </div>
        <h1 className="section-title text-3xl sm:text-4xl mb-3">
          Find What Fits You
        </h1>
        <p className="section-subtitle max-w-xl mx-auto">
          Upload an image and we'll match you with the right products.
        </p>
      </div>

      {/* Upload area */}
      <div className="max-w-2xl mx-auto mb-12">
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-sage-300 rounded-3xl cursor-pointer bg-white hover:bg-cream-50 hover:border-sage-400 transition-all relative overflow-hidden">
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-sage-50 flex items-center justify-center mb-4">
              <UploadCloud className="w-7 h-7 text-sage-500" />
            </div>
            <p className="text-sage-700 font-semibold mb-1">
              Click to upload
            </p>
            <p className="text-sage-400 text-sm">PNG, JPG or WEBP</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {loading && (
            <div className="absolute inset-0 bg-white/90 flex flex-col justify-center items-center">
              <Loader2 className="w-8 h-8 text-sage-500 animate-spin mb-3" />
              <p className="text-sm text-sage-600 font-medium">
                Analyzing image...
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Uploaded image */}
      {file && !loading && (
        <div className="mb-10 flex flex-col items-center">
          <h2 className="text-lg font-display font-bold text-sage-900 mb-3">
            Uploaded Image
          </h2>
          <img
            src={file}
            alt="Uploaded"
            className="h-44 rounded-2xl object-cover shadow-soft border border-sage-100"
          />
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !loading && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-sage-600" />
            <h2 className="text-xl font-display font-bold text-sage-900">
              Similar Products ({results.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {results.map((item) => (
              <div key={item.product._id}>
                <ProductCard product={item.product} />
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center bg-sage-100 text-sage-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {(item.score * 100).toFixed(1)}% match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-sage-300" />
          </div>
          <h2 className="text-xl font-display font-bold text-sage-800 mb-2">
            No similar products found
          </h2>
          <p className="text-sage-500 mb-5 text-sm">
            Try uploading a clearer image or a different product.
          </p>
          <button onClick={resetSearch} className="btn-primary text-sm">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AISearch;
