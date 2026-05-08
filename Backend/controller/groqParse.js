

export async function parseWithAi(query) {
  const completion = await groq.chat.completion.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `
You are an e-commerce query parser.

Convert user query into JSON with fields:
category, gender, maxPrice

Return ONLY JSON.
        `,
      },
      {
        role: "user",
        content: query,
      },
    ],
    temperature: 0,
  });
  console.log("completion",completion)
  const text = completion.choices[0].message.content;

  return JSON.parse(text);
}

export function buildMongoQuery(aiData) {
  const filter = {};

  if (aiData.category) {
    filter.category = new RegExp(aiData.category, "i");
  }

  if (aiData.gender) {
    filter.gender = aiData.gender;
  }

  if (aiData.maxPrice) {
    filter.price = { $lte: aiData.maxPrice };
  }

  console.log("Final Filter:", filter);

  return filter;
}
