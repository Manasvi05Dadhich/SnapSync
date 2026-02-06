const { extractStructuredData } = require("../services/geminiService");
const { extractTextFromImage } = require("../services/ocrService");
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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

const extractFromImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    const imagePath = req.file.path;

    // Extract text from image using OCR
    const extractedText = await extractTextFromImage(imagePath);

    if (!extractedText) {
      return res.status(502).json({
        message: "OCR could not extract text from image",
      });
    }

    // Extract structured data from the OCR text using Gemini
    const extractedData = await extractStructuredData(extractedText);

    if (!extractedData) {
      return res.status(502).json({
        message: "AI could not extract structured data from OCR text",
      });
    }

    res.status(200).json({
      success: true,
      data: extractedData,
      extractedText: extractedText, // Optional: include the raw OCR text
    });

  } catch (error) {
    res.status(500).json({
      message: "Image extraction failed",
      error: error.message,
    });
  }
};

module.exports = { extractFromText, extractFromImage, upload };
