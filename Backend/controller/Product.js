import Product from "../model/Product.js";
import { buildMongoQuery, parseWithAi } from "./groqParse.js";
import { fetchImageBuffer, generateDesc, getEmbeddingFromBuffer } from "../services/ai.service.js";

const PUBLIC_PRODUCT_FIELDS = "-embedding";
const PRODUCT_PAGE_LIMIT = Number(process.env.PRODUCT_PAGE_LIMIT || 20);
const MAX_BULK_CREATE = Number(process.env.PRODUCT_MAX_BULK_CREATE || 25);

const buildEmbeddingFromImages = async (images = []) => {
  const imageUrl = images[0]?.url;
  if (!imageUrl?.startsWith("http")) return [];

  const imageBuffer = await fetchImageBuffer(imageUrl);
  return getEmbeddingFromBuffer(imageBuffer);
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
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Number(req.query.limit || PRODUCT_PAGE_LIMIT), 50);
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .select(PUBLIC_PRODUCT_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      count: products.length,
      page,
      limit,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(PUBLIC_PRODUCT_FIELDS).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id).select("_id").lean();

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
    const aiData = await parseWithAi(query);
    const mongoQuery = buildMongoQuery(aiData);

    const products = await Product.find(mongoQuery)
      .select(PUBLIC_PRODUCT_FIELDS)
      .limit(50)
      .lean();

    return res.json({ success: true, products, aiData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const suggestProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json([]);

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
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
