const { extractStructuredData } = require("../services/geminiService");

const extractFromText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
      });
    }

    const extractedData = await extractStructuredData(text);

    res.status(200).json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI extraction failed",
      error: error.message,
    });
  }
};

module.exports = { extractFromText };
