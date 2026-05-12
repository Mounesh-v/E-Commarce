import express from "express";
import multer from "multer";
import {
  createProduct,
  createProductsBulk,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  searchProducts,
  suggestProducts,
  updateProduct,
} from "../controller/Product.js";
import { generateDesc, getImageCaption } from "../services/ai.service.js";
import storage from "../middleware/cloudinary.js";
const uploadimgDes = multer();
const upload = multer({ storage });
import { uploadMemory } from "../middleware/upload.js";

const product = express.Router();

product.post("/", createProduct);

// auto generate product description using llama3 model from text generation api
product.post("/generate-desc", async (req, res) => {
  try {
    const { name, brand } = req.body;

    const desc = await generateDesc(name, brand);

    res.json({ desc });
  } catch (err) {
    console.error("❌ Generate Desc Error:", err);
    res.status(500).json({ error: err.message });
  }
});
product.get("/get-all-products", getAllProducts);
product.post("/bulk", createProductsBulk);

// always keep search and suggest routes above the :id route to avoid conflicts
product.get("/search", searchProducts);
product.get("/suggest", suggestProducts);

// /:id route should be at the end to avoid conflicts with other routes
product.get("/:id", getSingleProduct);
product.put("/:id", updateProduct);
product.delete("/:id", deleteProduct);

product.post(
  "/generate-desc-image",
  uploadimgDes.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image required" });
      }

      // 🔥 Step 1: get caption from image
      const caption = await getImageCaption(req.file.buffer);
      console.log("🧠 Caption:", caption);

      // 🔥 Step 2: generate description using LLaMA
      const desc = await generateDesc(caption, ""); // reuse your function

      res.json({ desc, caption });
    } catch (err) {
      console.error("❌ Image Desc Error:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

product.post(
  "/generate-desc-combined",
  uploadMemory.single("image"), //  this is the only change needed
  async (req, res) => {
    try {
      const { name, brand } = req.body;

      if (!name || !brand) {
        return res.status(400).json({ error: "name and brand are required" });
      }

      let caption = null;

      if (req.file && req.file.buffer) {
        // ✅ buffer now exists
        caption = await getImageCaption(req.file.buffer);
        console.log("🧠 Caption:", caption);
      }

      const subject = caption
        ? `${name} by ${brand}. Visual description: ${caption}`
        : `${name} by ${brand}`;

      const desc = await generateDesc(subject, "");
      res.json({ desc, caption });
    } catch (err) {
      console.error("❌ Combined Desc Error:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

// POST /api/product/upload-image
product.post(
  "/upload-image",
  upload.single("image"), //  disk/cloudinary for permanent storage
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      res.json({ url: req.file.path });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

export default product;
