import axios from "axios";
import { pipeline } from "@xenova/transformers";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Groq from "groq-sdk";

// auto generate product description using llama3 model from text generation api
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateDesc = async (subject, brand) => {
  try {
    const prompt = brand
      ? `Write a SHORT ecommerce product description (2 lines only) for ${subject} by ${brand}. No headings. No bullet points. Maximum 40 words.`
      : `Write a SHORT ecommerce product description (2 lines only) for: ${subject}. No headings. No bullet points. Maximum 40 words.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // same Llama3, free on Groq
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    return response.choices[0].message.content.trim();
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
    "Xenova/clip-vit-base-patch32",
  );
  console.log("✅ CLIP Image Model Loaded");
};

export const getEmbeddingFromBuffer = async (buffer) => {
  if (!extractor) throw new Error("Model not loaded");

  const tempPath = path.join(__dirname, "../uploads", `temp-${Date.now()}.jpg`);

  fs.writeFileSync(tempPath, buffer);

  const output = await extractor(tempPath);

  fs.unlinkSync(tempPath);

  const raw = output[0]?.data || output.data;

  const embedding = Array.from(raw).flat();

  // normalize HERE
  const mag = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  return mag === 0 ? embedding : embedding.map((v) => v / mag);
};

export const getImageCaption = async (buffer) => {
  try {
    const base64 = buffer.toString("base64");

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // free vision model on Groq
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64}` },
            },
            {
              type: "text",
              text: "Describe this product image in one short sentence for an ecommerce listing.",
            },
          ],
        },
      ],
      max_tokens: 60,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Caption error:", error.message);
    return "";
  }
};
