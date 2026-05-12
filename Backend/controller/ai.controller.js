import Product from "../model/Product.js";
import { getEmbeddingFromBuffer } from "../services/ai.service.js";
import { logMemoryUsage, normalizeVector } from "../services/transformer.util.js";

const VECTOR_FIELDS = "name desc brand price discountPrice images stock ratings +embedding";
const RESPONSE_LIMIT = Number(process.env.IMAGE_SEARCH_LIMIT || 8);
const MIN_BEST_SCORE = Number(process.env.IMAGE_SEARCH_MIN_BEST_SCORE || 0.25);
const MIN_SIMILAR_SCORE = Number(process.env.IMAGE_SEARCH_MIN_SIMILAR_SCORE || 0.35);

const cosineSimilarity = (a, b) => {
  if (!a.length || !b.length || a.length !== b.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const denominator = Math.sqrt(magA) * Math.sqrt(magB);
  return denominator ? dot / denominator : 0;
};

const stripEmbedding = (product) => {
  const { embedding, ...safeProduct } = product;
  return safeProduct;
};

const addTopResult = (topResults, candidate) => {
  topResults.push(candidate);
  topResults.sort((a, b) => b.score - a.score);
  if (topResults.length > RESPONSE_LIMIT) topResults.pop();
};

export const searchByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    logMemoryUsage("image-search-start");
    const queryEmbedding = await getEmbeddingFromBuffer(req.file.buffer);
    const topResults = [];

    const cursor = Product.find({ embedding: { $exists: true, $ne: [] } })
      .select(VECTOR_FIELDS)
      .lean()
      .cursor({ batchSize: Number(process.env.IMAGE_SEARCH_BATCH_SIZE || 25) });

    for await (const product of cursor) {
      const productEmbedding = normalizeVector(product.embedding);
      const score = cosineSimilarity(queryEmbedding, productEmbedding);

      if (score >= MIN_SIMILAR_SCORE || topResults.length < RESPONSE_LIMIT) {
        addTopResult(topResults, {
          product: stripEmbedding(product),
          score,
        });
      }
    }

    if (!topResults.length || topResults[0].score < MIN_BEST_SCORE) {
      logMemoryUsage("image-search-no-match");
      return res.json({
        identifiedProduct: null,
        similarProducts: [],
      });
    }

    const similarProducts = topResults.filter((item) => item.score > MIN_SIMILAR_SCORE);

    logMemoryUsage("image-search-done");
    return res.json({
      identifiedProduct: topResults[0].product,
      similarProducts,
    });
  } catch (err) {
    console.error("Image search error:", err);
    return res.status(500).json({ error: err.message });
  }
};
