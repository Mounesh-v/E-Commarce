import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../services/api";

const CreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    name: "",
    desc: "",
    brand: "",
    price: "",
    discountPrice: "",
    imageUrl: "",
    stock: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // Step 1: upload image file to get a real URL
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await api.post("/product/upload-image", formData);
        imageUrl = uploadRes.data.url;
      }

      // Step 2: save product with the real URL
      const payload = {
        name: form.name,
        desc: form.desc,
        brand: form.brand,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice),
        stock: Number(form.stock),
        ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
      };

      await axios.post("http://localhost:3000/api/product", payload);
      toast.success("Product created ");
      setForm({
        name: "",
        desc: "",
        brand: "",
        price: "",
        discountPrice: "",
        imageUrl: "",
        stock: "",
      });
      setImageFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating product");
    }
  };

  const generateDescription = async () => {
    if (!form.name || !form.brand)
      return toast.error("Enter name & brand first");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("brand", form.brand);
      if (imageFile) formData.append("image", imageFile);
      const res = await api.post("/product/generate-desc-combined", formData);
      setForm((prev) => ({ ...prev, desc: res.data.desc }));
      toast.success("AI Description Generated 🤖");
    } catch (err) {
      toast.error("Failed to generate description");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setImageFile(file);
  };

  const inputClass =
    "w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-black dark:focus:border-primary-500 focus:ring-1 focus:ring-black dark:focus:ring-primary-500 transition-all bg-white dark:bg-slate-800";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 px-4 py-10 transition-colors">
      <div className="w-full max-w-md">
        {/* Page heading */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Product</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
            Fill in the details below to list a new item
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-4 transition-colors"
        >
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Mens Jacket"
              className={inputClass}
            />
          </div>

          {/* Brand */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Brand
            </label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Nike"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Description
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-medium text-black border border-black rounded-lg px-3 py-1 hover:bg-black hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>✨ AI Generate</>
                )}
              </button>
            </div>
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              placeholder="Description will appear here, or write your own..."
              rows={4}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Price · Discount · Stock */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "price", label: "Price", placeholder: "0.00" },
              { name: "discountPrice", label: "Discount", placeholder: "0.00" },
              { name: "stock", label: "Stock", placeholder: "Qty" },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  type="number"
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Product Image
            </label>

            {imageFile ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="w-full h-44 object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="text-xs font-semibold bg-white text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {/* AI analyzing indicator */}
                {loading && (
                  <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm px-3 py-2 flex items-center gap-2">
                    <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <span className="text-xs text-gray-600">
                      Analyzing image...
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  dragOver
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={dragOver ? "#111" : "#9ca3af"}
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-black">
                      Click to upload
                    </span>{" "}
                    or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
