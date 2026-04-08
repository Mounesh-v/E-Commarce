import React, { useState } from "react";
import { UploadCloud, Search, Loader2 } from "lucide-react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const AISearch = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [identifiedProduct, setIdentifiedProduct] = useState(null);
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
      setIdentifiedProduct(res.data.identifiedProduct || null);
      setSearched(true);
    } catch (err) {
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setFile(null);
    setResults([]);
    setIdentifiedProduct(null);
    setSearched(false);
  };

  return (
    <div className="py-8 lg:py-12 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 mb-6">
          AI Visual Search
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload an image and find similar products instantly.
        </p>
      </div>

      {/* Upload */}
      <div className="max-w-2xl mx-auto mb-16">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary-200 border-dashed rounded-3xl cursor-pointer bg-primary-50/50 hover:bg-primary-50 transition group relative overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 text-primary-500 mb-3" />
            <p className="text-lg text-slate-700">
              <span className="font-semibold text-primary-600">
                Click to upload
              </span>
            </p>
          </div>

          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {loading && (
            <div className="absolute inset-0 bg-white/80 flex flex-col justify-center items-center">
              <div className="w-12 mx-auto text-blue-600 flex items-center justify-center">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <circle cx="12" cy="3" r="1">
                      <animate
                        id="spinner_7Z73"
                        begin="0;spinner_tKsu.end-0.5s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="16.50" cy="4.21" r="1">
                      <animate
                        id="spinner_Wd87"
                        begin="spinner_7Z73.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="7.50" cy="4.21" r="1">
                      <animate
                        id="spinner_tKsu"
                        begin="spinner_9Qlc.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="19.79" cy="7.50" r="1">
                      <animate
                        id="spinner_lMMO"
                        begin="spinner_Wd87.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="4.21" cy="7.50" r="1">
                      <animate
                        id="spinner_9Qlc"
                        begin="spinner_Khxv.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="21.00" cy="12.00" r="1">
                      <animate
                        id="spinner_5L9t"
                        begin="spinner_lMMO.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="3.00" cy="12.00" r="1">
                      <animate
                        id="spinner_Khxv"
                        begin="spinner_ld6P.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="19.79" cy="16.50" r="1">
                      <animate
                        id="spinner_BfTD"
                        begin="spinner_5L9t.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="4.21" cy="16.50" r="1">
                      <animate
                        id="spinner_ld6P"
                        begin="spinner_XyBs.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="16.50" cy="19.79" r="1">
                      <animate
                        id="spinner_7gAK"
                        begin="spinner_BfTD.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="7.50" cy="19.79" r="1">
                      <animate
                        id="spinner_XyBs"
                        begin="spinner_HiSl.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <circle cx="12" cy="21" r="1">
                      <animate
                        id="spinner_HiSl"
                        begin="spinner_7gAK.begin+0.1s"
                        attributeName="r"
                        calcMode="spline"
                        dur="0.6s"
                        values="1;2;1"
                        keySplines=".27,.42,.37,.99;.53,0,.61,.73"
                      ></animate>
                    </circle>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      dur="6s"
                      values="360 12 12;0 12 12"
                      repeatCount="indefinite"
                    ></animateTransform>
                  </g>
                </svg>
              </div>
            </div>
          )}
        </label>
      </div>

      {/* Uploaded Image */}
      {file && !loading && (
        <div className="mb-10 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Uploaded Image</h2>
          <img
            src={file}
            alt="Uploaded"
            className="h-48 rounded-xl object-cover shadow"
          />
        </div>
      )}

      {/* Identified Product */}
      {/* {identifiedProduct && !loading && (
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Best Match</h2>
          <div className="flex justify-center">
            <ProductCard product={identifiedProduct} />
          </div>
        </div>
      )} */}

      {/* Similar Products */}
      {results.length > 0 && !loading && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary-600" />
            <h2 className="text-2xl font-bold">
              Similar Products ({results.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((item) => (
              <div key={item.product._id}>
                <ProductCard product={item.product} />
                <p className="text-xs text-center mt-1 text-gray-500">
                  {(item.score * 100).toFixed(1)}% match
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            No similar products found
          </h2>
          <p className="text-slate-500 mb-4">
            Try uploading a clearer image or a different product.
          </p>

          <button
            onClick={resetSearch}
            className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AISearch;
