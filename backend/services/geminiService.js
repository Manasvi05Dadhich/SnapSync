const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractStructuredData = async (text) => {
  const model = genAI.getGenerativeModel({ model: "	gemini-2.5-flash-lite" });

  const prompt = `
    You are an intelligent assistant that extracts structured data from text.

    Analyze the following text and extract information into a JSON object with the following keys:
    - type: one of "event", "task", or "note"
    - title: a brief title for the item
    - date: the date if mentioned, otherwise null
    - time: the time if mentioned, otherwise null
    - location: the location if mentioned, otherwise null
    - description: a description of the item

    Return ONLY a valid JSON object, no additional text.

    Text: "${text}"
    `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Clean the response by removing markdown code block formatting
  const cleanedResponse = response.replace(/```json\n?/, '').replace(/\n?```$/, '');

  return JSON.parse(cleanedResponse);
};

module.exports = { extractStructuredData };
