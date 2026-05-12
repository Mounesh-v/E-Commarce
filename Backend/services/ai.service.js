import axios from "axios";
import Groq from "groq-sdk";
import {
  disposeTransformerModel,
  getImageEmbeddingExtractor,
  getImageEmbeddingFromBuffer,
} from "./transformer.util.js";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateDesc = async (subject, brand) => {
  try {
    const prompt = brand
      ? `Write a SHORT ecommerce product description (2 lines only) for ${subject} by ${brand}. No headings. No bullet points. Maximum 40 words.`
      : `Write a SHORT ecommerce product description (2 lines only) for: ${subject}. No headings. No bullet points. Maximum 40 words.`;

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_TEXT_MODEL || "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Description error:", error.message);
    return "High quality product with excellent performance.";
  }
};

// Backward-compatible export. This is intentionally lazy: callers may invoke it,
// but server startup should not.
export const loadModel = async () => getImageEmbeddingExtractor();

export const getEmbeddingFromBuffer = async (buffer) => getImageEmbeddingFromBuffer(buffer);

export const cleanupAiResources = disposeTransformerModel;

export const getImageCaption = async (buffer) => {
  try {
    const base64 = buffer.toString("base64");

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct",
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

export const fetchImageBuffer = async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    maxContentLength: Number(process.env.AI_IMAGE_MAX_BYTES || 5 * 1024 * 1024),
    timeout: Number(process.env.AI_IMAGE_FETCH_TIMEOUT_MS || 15000),
  });

  return Buffer.from(response.data);
};
