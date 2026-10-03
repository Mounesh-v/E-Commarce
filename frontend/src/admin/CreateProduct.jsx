import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { Loader2, Sparkles } from "lucide-react";

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

    const price = Number(form.price);
    if (!form.name.trim()) return toast.error("Product name is required");
    if (!Number.isFinite(price) || price <= 0)
      return toast.error("Enter a valid price");

    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await api.post("/product/upload-image", formData);
        imageUrl = uploadRes.data.url;
      }

      const discountPrice = Number(form.discountPrice);
      const stock = Number(form.stock);

      const payload = {
        name: form.name.trim(),
        desc: form.desc,
        brand: form.brand,
        price,
        ...(Number.isFinite(discountPrice) && discountPrice > 0
          ? { discountPrice }
          : {}),
        ...(Number.isFinite(stock) && stock >= 0 ? { stock } : {}),
        ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
      };

      await api.post("/product", payload);
      toast.success("Product created");
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
      toast.success("AI Description Generated");
    } catch {
      toast.error("Failed to generate description");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setImageFile(file);
  };

  const inputClass =
    "w-full border border-sage-200 rounded-xl px-4 py-2.5 text-sm text-sage-800 placeholder-sage-400 outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 transition-all bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-display font-bold text-sage-900">
            Add Product
          </h1>
          <p className="text-sm text-sage-500 mt-1">
            Fill in the details to list a new item
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-sage-500 uppercase tracking-wider">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-sage-500 uppercase tracking-wider">
              Brand
            </label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Sony"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-sage-500 uppercase tracking-wider">
                Description
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-medium text-sage-700 border border-sage-200 rounded-lg px-3 py-1 hover:bg-sage-50 transition-all disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {loading ? "Generating..." : "AI Generate"}
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

          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "price", label: "Price", placeholder: "0.00" },
              { name: "discountPrice", label: "Discount", placeholder: "0.00" },
              { name: "stock", label: "Stock", placeholder: "Qty" },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="text-xs font-semibold text-sage-500 uppercase tracking-wider">
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

          <div className="space-y-1">
            <label className="text-xs font-semibold text-sage-500 uppercase tracking-wider">
              Product Image
            </label>

            {imageFile ? (
              <div className="relative rounded-xl overflow-hidden border border-sage-200 group">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer text-xs font-semibold bg-white text-sage-800 px-3 py-1.5 rounded-lg hover:bg-cream-50 transition-colors">
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
                    className="text-xs font-semibold bg-white text-sage-600 px-3 py-1.5 rounded-lg hover:bg-cream-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {loading && (
                  <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm px-3 py-2 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 text-sage-600 animate-spin flex-shrink-0" />
                    <span className="text-xs text-sage-600">
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
                    ? "border-sage-500 bg-cream-50"
                    : "border-sage-200 hover:border-sage-400 hover:bg-cream-50"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={dragOver ? "#30483B" : "#9CA3AF"}
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div className="text-center">
                  <p className="text-sm text-sage-500">
                    <span className="font-semibold text-sage-700">
                      Click to upload
                    </span>{" "}
                    or drag & drop
                  </p>
                  <p className="text-xs text-sage-400 mt-0.5">
                    PNG, JPG, WEBP
                  </p>
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

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
