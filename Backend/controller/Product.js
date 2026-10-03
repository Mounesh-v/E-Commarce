import Product from "../model/Product.js";
import mongoose from "mongoose";
import { buildMongoQuery, parseWithAi } from "./groqParse.js";
import { fetchImageBuffer, generateDesc, getEmbeddingFromBuffer } from "../services/ai.service.js";

const PUBLIC_PRODUCT_FIELDS = "-embedding";
const PRODUCT_PAGE_LIMIT = Number(process.env.PRODUCT_PAGE_LIMIT || 20);
const MAX_BULK_CREATE = Number(process.env.PRODUCT_MAX_BULK_CREATE || 25);
const UPDATABLE_FIELDS = [
  "name",
  "desc",
  "brand",
  "price",
  "discountPrice",
  "images",
  "stock",
  "ratings",
];

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildEmbeddingFromImages = async (images = []) => {
  try {
    const imageUrl = images[0]?.url;
    if (!imageUrl?.startsWith("http")) return [];

    const imageBuffer = await fetchImageBuffer(imageUrl);
    return await getEmbeddingFromBuffer(imageBuffer);
  } catch (error) {
    console.error("Embedding build skipped:", error.message);
    return [];
  }
};

export const createProduct = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const inputProducts = req.body.slice(0, MAX_BULK_CREATE);
      const createdProducts = [];

      for (const item of inputProducts) {
        const { name, desc, brand, price, discountPrice, images = [], stock } = item;
        if (!name || !price) continue;

        const embedding = await buildEmbeddingFromImages(images);
        const product = await Product.create({
          name,
          desc,
          brand,
          price,
          discountPrice,
          images,
          stock,
          embedding,
        });

        createdProducts.push(product.toObject());
      }

      return res.status(201).json({
        success: true,
        count: createdProducts.length,
        products: createdProducts.map(({ embedding, ...product }) => product),
      });
    }

    let { name, desc, brand, price, discountPrice, images, stock } = req.body;
    const safeImages = images?.filter((img) => img?.url?.trim()) ?? [];

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name & Price required",
      });
    }

    if (!desc || desc.trim() === "") {
      desc = await generateDesc(name, brand);
    }

    const embedding = await buildEmbeddingFromImages(safeImages);

    const product = await Product.create({
      name,
      desc,
      brand,
      price,
      discountPrice,
      images: safeImages,
      stock,
      embedding,
    });

    const { embedding: _embedding, ...publicProduct } = product.toObject();

    return res.status(201).json({
      success: true,
      message: "Product created",
      product: publicProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const wantsAll = String(req.query.limit || "").toLowerCase() === "all";

    const page = wantsAll ? 1 : Math.max(Number(req.query.page || 1), 1);
    const limit = wantsAll
      ? 0
      : Math.min(Number(req.query.limit || PRODUCT_PAGE_LIMIT), 50);
    const skip = wantsAll ? 0 : (page - 1) * limit;

    let query = Product.find({});
    if (!wantsAll) {
      query = query.skip(skip).limit(limit);
    }

    const products = await query
      .select(PUBLIC_PRODUCT_FIELDS)
      .sort({ createdAt: -1 })
      .lean();

    const response = {
      success: true,
      count: products.length,
      page,
      limit: wantsAll ? products.length : limit,
      products,
    };

    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findById(req.params.id).select(PUBLIC_PRODUCT_FIELDS).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const response = { success: true, product };
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingProduct = await Product.findById(req.params.id).select("_id").lean();

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updates = {};
    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .select(PUBLIC_PRODUCT_FIELDS)
      .lean();

    return res.json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findById(req.params.id).select("_id");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !String(query).trim()) {
      return res.json({ success: true, products: [], aiData: null });
    }

    const aiData = await parseWithAi(query);
    const mongoQuery = buildMongoQuery(aiData, query);

    const products = await Product.find(mongoQuery)
      .select(PUBLIC_PRODUCT_FIELDS)
      .limit(50)
      .lean();

    return res.json({ success: true, products, aiData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const suggestProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !String(query).trim()) {
      return res.json({ success: true, products: [] });
    }

    const products = await Product.find({
      name: { $regex: escapeRegex(query), $options: "i" },
    })
      .select("name images price")
      .limit(5)
      .lean();

    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createProductsBulk = async (req, res) => {
  try {
    const inputProducts = Array.isArray(req.body) ? req.body.slice(0, MAX_BULK_CREATE) : [];
    const products = await Product.insertMany(inputProducts, { ordered: false });
    return res.json(
      products.map((doc) => {
        const { embedding, ...product } = doc.toObject();
        return product;
      }),
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
