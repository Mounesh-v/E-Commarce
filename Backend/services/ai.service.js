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

const DEFAULT_TEXT_MODEL = "openai/gpt-oss-120b";

const cleanDescription = (text) => {
  if (!text) return "";
  return text
    .replace(/```[a-z]*|```/gi, "")
    .replace(/^[#>\-*\s]+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/^(product\s+)?description\s*[:\-–]\s*/i, "")
    .replace(/^["']|["']$/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const fallbackDescription = (subject) => {
  const label = (subject || "This product").replace(/\s+/g, " ").trim();
  return `${label} is designed for dependable everyday performance, combining thoughtful design with quality materials for a smooth, reliable experience. Built to last and easy to use, it fits seamlessly into your routine.`;
};

export const generateDesc = async (subject, brand = "", caption = "") => {
  try {
    const lines = [`Product: ${subject || "Unknown product"}`];
    if (brand) lines.push(`Brand: ${brand}`);
    if (caption) lines.push(`Visual details from the product image: ${caption}`);

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_TEXT_MODEL || DEFAULT_TEXT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert ecommerce copywriter who writes clear, natural, persuasive product descriptions in plain text.",
        },
        {
          role: "user",
          content: `Write a product description for the following:\n${lines.join(
            "\n",
          )}\n\nRequirements:\n- 2 to 3 sentences, 40 to 60 words total\n- Friendly, persuasive marketing tone\n- Mention the brand naturally when provided\n- Plain text only: no headings, no bullet points, no markdown, no quotation marks, no line breaks\n- Never mention images, captions, or that the text was generated`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      reasoning_effort: "low",
    });

    const cleaned = cleanDescription(completion.choices[0]?.message?.content);
    return cleaned || fallbackDescription(subject);
  } catch (error) {
    console.error("Description error:", error.message);
    return fallbackDescription(subject);
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
