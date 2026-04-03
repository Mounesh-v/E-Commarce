// scripts/generateEmbeddings.js

import Product from "../model/Product.js";
import axios from "axios";
import { getEmbeddingFromBuffer, loadModel } from "../services/ai.service.js";
import connectDb from "../config/db.js";

const run = async () => {
  await connectDb();
  await loadModel();

  const products = await Product.find();

  for (let p of products) {
    try {
      if (!p.images || !p.images[0]?.url) continue;

      console.log("📥 Processing:", p.name);

      // 🔥 fetch image
      const response = await axios.get(p.images[0].url, {
        responseType: "arraybuffer",
      });

      // 🔥 generate embedding
      const embedding = await getEmbeddingFromBuffer(response.data);

      // 🔥 save to DB
      p.embedding = embedding;
      await p.save();

      console.log("✅ Saved embedding:", p.name);
    } catch (err) {
      console.log("❌ Error:", p.name, err.message);
    }
  }

  console.log("🎯 Done");
  process.exit();
};

run();