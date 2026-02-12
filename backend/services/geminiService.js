const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractStructuredData = async (text) => {
  const model = genAI.getGenerativeModel({ model: "	gemini-2.5-flash-lite" });

  // Get current year for date inference
  const currentYear = new Date().getFullYear();

  const prompt = `
    You are an intelligent assistant that extracts structured data from text.

    Analyze the following text and extract information into a JSON object with the following keys:
    - type: one of "event", "task", or "note"
    - title: a brief title for the item
    - date: the date in ISO format (YYYY-MM-DD). If year is not mentioned, use ${currentYear}. If no date is found, use null.
    - time: the time in 24-hour format (HH:mm). Convert 12-hour format to 24-hour (e.g., "1 PM" becomes "13:00", "1:30 PM" becomes "13:30"). If no time is found, use null.
    - location: the location if mentioned, otherwise null
    - description: a brief description of the item

    IMPORTANT FORMAT REQUIREMENTS:
    - date must be in YYYY-MM-DD format (e.g., "2026-02-14", "2026-12-25")
    - time must be in HH:mm format with leading zeros (e.g., "09:00", "13:30", "23:45")
    - If you see "14th" or "Feb 14" or "February 14", convert it to proper ISO format
    - If you see "1 PM", "1:00 PM", or "1pm", convert it to "13:00"
    - If you see "9 AM" or "9am", convert it to "09:00"

    Examples:
    - "Meeting on 14th at 1 PM" → date: "2026-02-14", time: "13:00"
    - "Feb 14 at 1:30 PM" → date: "2026-02-14", time: "13:30"
    - "Team standup tomorrow 9am" → date: null, time: null (unless you can infer the exact date)

    Return ONLY a valid JSON object, no additional text or markdown formatting.

    Text: "${text}"
    `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Clean the response by removing markdown code block formatting
  const cleanedResponse = response.replace(/```json\n?/, '').replace(/\n?```$/, '');

  return JSON.parse(cleanedResponse);
};

module.exports = { extractStructuredData };
