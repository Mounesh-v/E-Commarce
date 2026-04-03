import Product from "../model/Product.js";
import { getEmbeddingFromBuffer } from "../services/ai.service.js";

// cosine similarity
const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

// normalize vector
const normalize = (vec) => {
  const mag = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return vec.map((v) => v / mag);
};

export const searchByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // get embedding
    const embedding = normalize(
      await getEmbeddingFromBuffer(req.file.buffer)
    );

    const products = await Product.find();

    //  scoring
    const scored = products
      .filter((p) => p.embedding && p.embedding.length > 0)
      .map((p) => {
        const score = cosineSimilarity(
          embedding,
          normalize(p.embedding)
        );

        console.log(`🔍 ${p.name}: ${score.toFixed(3)}`);

        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score);

    if (!scored.length) {
      return res.json({
        identifiedProduct: null,
        similarProducts: [],
      });
    }

    const bestScore = scored[0].score;
    console.log("🏆 Best:", bestScore.toFixed(3));

    //  no relevant match
    if (bestScore < 0.25) {
      return res.json({
        identifiedProduct: null,
        similarProducts: [],
      });
    }

    // ✅ best match
    const identifiedProduct = scored[0].product;

    // ✅ similar products
    const similarProducts = scored
      .filter((item) => item.score > 0.35)
      .slice(0, 8);

    // 🔥 final response (frontend friendly)
    res.json({
      identifiedProduct,
      similarProducts,
    });

  } catch (err) {
    console.error("❌ Backend Error:", err);
    res.status(500).json({ error: err.message });
  }
};