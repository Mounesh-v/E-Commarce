import storage from "../middleware/cloudinary.js";
import Product from "../model/Product.js";
import {
  generateDesc,
  getEmbeddingFromBuffer,
} from "../services/ai.service.js";
import axios from "axios";

export const createProduct = async (req, res) => {
  try {
    // 🔥 Bulk insert
    if (Array.isArray(req.body)) {
      const updatedProducts = [];

      for (let item of req.body) {
        let { name, desc, brand, price, discountPrice, images, stock } = item;

        if (!name || !price) continue;

        //  generate embedding
        let embedding = [];

        if (images && images[0]?.url) {
          const response = await axios.get(images[0].url, {
            responseType: "arraybuffer",
          });

          embedding = await getEmbeddingFromBuffer(response.data);
        }

        const product = await Product.create({
          name,
          desc,
          brand,
          price,
          discountPrice,
          images,
          stock,
          embedding, //  SAVE HERE
        });

        updatedProducts.push(product);
      }

      return res.status(201).json({
        success: true,
        count: updatedProducts.length,
        products: updatedProducts,
      });
    }

    // 🔥 Single product
    let { name, desc, brand, price, discountPrice, images, stock } = req.body;
    const safeImages = images?.filter((img) => img?.url?.trim()) ?? [];

    // 🔥 auto generate if desc missing
    if (!desc || desc.trim() === "") {
      desc = await generateDesc(name, brand);
    }
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name & Price required",
      });
    }

    // 🔥 generate embedding
    let embedding = [];

    if (images && images[0]?.url && images[0].url.startsWith("http")) {
      // ✅ only fetch if it's a real URL (Cloudinary), not a local path
      const response = await axios.get(images[0].url, {
        responseType: "arraybuffer",
      });
      embedding = await getEmbeddingFromBuffer(response.data);
    }

    const product = await Product.create({
      name,
      desc,
      brand,
      price,
      discountPrice,
      images: safeImages,
      stock,
      embedding, // 🔥 IMPORTANT
    });

    res.status(201).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    console.error("❌ Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query, minPrice, maxPrice } = req.query;
    let filters = {};

    if (query) {
      filters.$text = { $search: query };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filters)
      .sort(query ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export const suggestProducts = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("QUERY:", query);
    if (!query) return res.status(400).json([]);

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    })
      .select("name images price")
      .limit(5);

    // const suggestions = products.map((p) => p.name);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createProductsBulk = async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
