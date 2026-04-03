import axios from "axios";
import { pipeline } from "@xenova/transformers";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// auto generate product description using llama3 model from text generation api
export const generateDesc = async (name, brand) => {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `Write a SHORT ecommerce product description (2 lines only) for ${name} by ${brand}. No headings. No bullet points. Maximum 40 words.`,
      stream: false,
    });

    return response.data.response;
  } catch (error) {
    console.error(error.message);
    return "High quality product with excellent performance.";
  }
};

// model for the Ai img Search
let extractor;


export const loadModel = async () => {
  extractor = await pipeline(
    "image-feature-extraction",
    "Xenova/clip-vit-base-patch32"
  );
  console.log("✅ CLIP Image Model Loaded");
};

export const getEmbeddingFromBuffer = async (buffer) => {
  if (!extractor) throw new Error("Model not loaded");

  const tempPath = path.join(__dirname, "../uploads", `temp-${Date.now()}.jpg`);

  fs.writeFileSync(tempPath, buffer);

  const output = await extractor(tempPath);

  fs.unlinkSync(tempPath);

  return Array.from(output.data || output[0]?.data || []);
};