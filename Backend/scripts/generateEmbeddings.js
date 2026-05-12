import Product from "../model/Product.js";
import connectDb from "../config/db.js";
import {
  cleanupAiResources,
  fetchImageBuffer,
  getEmbeddingFromBuffer,
} from "../services/ai.service.js";
import { logMemoryUsage } from "../services/transformer.util.js";

const run = async () => {
  await connectDb();

  const cursor = Product.find({
    "images.0.url": { $exists: true },
    $or: [{ embedding: { $exists: false } }, { embedding: { $size: 0 } }],
  })
    .select("_id name images +embedding")
    .cursor({ batchSize: Number(process.env.EMBEDDING_SCRIPT_BATCH_SIZE || 10) });

  let processed = 0;

  for await (const product of cursor) {
    try {
      console.log("Processing:", product.name);
      const imageBuffer = await fetchImageBuffer(product.images[0].url);
      const embedding = await getEmbeddingFromBuffer(imageBuffer);

      await Product.updateOne({ _id: product._id }, { $set: { embedding } });
      processed += 1;

      if (processed % 10 === 0) logMemoryUsage(`embedding-script-${processed}`);
    } catch (err) {
      console.log("Embedding error:", product.name, err.message);
    }
  }

  console.log(`Done. Generated embeddings for ${processed} products.`);
  await cleanupAiResources();
  process.exit(0);
};

run().catch(async (error) => {
  console.error(error);
  await cleanupAiResources();
  process.exit(1);
});
