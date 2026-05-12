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
import { uploadMemory } from "../middleware/upload.js";

const product = express.Router();
const maxImageBytes = Number(process.env.UPLOAD_IMAGE_MAX_BYTES || 2 * 1024 * 1024);
const upload = multer({
  storage,
  limits: { fileSize: maxImageBytes, files: 1 },
});

product.post("/", createProduct);
product.get("/get-all-products", getAllProducts);
product.post("/bulk", createProductsBulk);
product.get("/search", searchProducts);
product.get("/suggest", suggestProducts);

product.post("/generate-desc", async (req, res) => {
  try {
    const { name, brand } = req.body;
    const desc = await generateDesc(name, brand);
    return res.json({ desc });
  } catch (err) {
    console.error("Generate Desc Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

product.post("/generate-desc-image", uploadMemory.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    const caption = await getImageCaption(req.file.buffer);
    const desc = await generateDesc(caption, "");

    return res.json({ desc, caption });
  } catch (err) {
    console.error("Image Desc Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

product.post("/generate-desc-combined", uploadMemory.single("image"), async (req, res) => {
  try {
    const { name, brand } = req.body;

    if (!name || !brand) {
      return res.status(400).json({ error: "name and brand are required" });
    }

    const caption = req.file?.buffer ? await getImageCaption(req.file.buffer) : null;
    const subject = caption
      ? `${name} by ${brand}. Visual description: ${caption}`
      : `${name} by ${brand}`;

    const desc = await generateDesc(subject, "");
    return res.json({ desc, caption });
  } catch (err) {
    console.error("Combined Desc Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

product.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    return res.json({ url: req.file.path });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

product.get("/:id", getSingleProduct);
product.put("/:id", updateProduct);
product.delete("/:id", deleteProduct);

export default product;
