import groq from "../config/groqsetup.js";

const SYSTEM_PROMPT = `
You are an e-commerce search query parser.

Convert the user query into a JSON object with these fields:
- "keywords": string — only the product/brand terms (no price words, no numbers)
- "maxPrice": number — the maximum price if the query mentions one (e.g. "under 5000" => 5000), otherwise omit it

Return ONLY valid JSON. No markdown, no explanations.
Example: {"keywords": "wireless headphones", "maxPrice": 5000}
`;

const STOPWORDS =
  /^(under|below|within|less|than|upto|up|to|max|maximum|min|minimum|budget|price|rs|inr|rupees|for|with|a|an|the|buy|me|i|want|need|show|find|get|some|any|that|this|in|on|of|and|or)$/i;

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractJson = (text) => {
  if (!text) return null;
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
};

export async function parseWithAi(query) {
  if (!query || !String(query).trim()) return null;

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_TEXT_MODEL || "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: String(query) },
      ],
      temperature: 0,
      max_tokens: 200,
    });

    const text = completion.choices[0]?.message?.content;
    return extractJson(text);
  } catch (error) {
    console.error("AI query parse failed, using text fallback:", error.message);
    return null;
  }
}

export function buildMongoQuery(aiData, rawQuery = "") {
  const filter = {};

  const keywords =
    typeof aiData?.keywords === "string" && aiData.keywords.trim()
      ? aiData.keywords.trim()
      : "";

  const search = keywords || String(rawQuery || "").trim();

  const words = search
    .replace(/[₹,]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(
      (word) =>
        word &&
        !/^\d+$/.test(word) &&
        !STOPWORDS.test(word) &&
        !/^[\W_]+$/.test(word),
    );

  if (words.length) {
    filter.$and = words.map((word) => {
      const rx = new RegExp(escapeRegex(word), "i");
      return { $or: [{ name: rx }, { brand: rx }, { desc: rx }] };
    });
  }

  const maxPrice = Number(aiData?.maxPrice);
  if (Number.isFinite(maxPrice) && maxPrice > 0) {
    filter.price = { $lte: maxPrice };
  }

  return filter;
}
