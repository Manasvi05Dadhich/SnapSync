const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { extractStructuredData } = require("../services/geminiService");
const { extractTextFromImage } = require("../services/ocrService");
const calenderService = require("../services/calenderService");
const Item = require("../models/item");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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
    const userId = req.user?._id?.toString();

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
      });
    }
    if (!userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const extractedData = await extractStructuredData(text);

    const item = await Item.create({
      userId,
      type: extractedData.type || "note",
      title: extractedData.title || "Untitled",
      date: extractedData.date || null,
      time: extractedData.time || null,
      location: extractedData.location || null,
      description: extractedData.description || "",
    });

    res.status(201).json({
      success: true,
      data: extractedData,
      item,
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

    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const imagePath = req.file.path;


    const extractedText = await extractTextFromImage(imagePath);

    try {
      fs.unlinkSync(imagePath);
    } catch (err) {

    }

    if (!extractedText) {
      return res.status(502).json({
        message: "OCR could not extract text from image",
      });
    }


    const extractedData = await extractStructuredData(extractedText);

    if (!extractedData) {
      return res.status(502).json({
        message: "AI could not extract structured data from OCR text",
      });
    }

    const item = await Item.create({
      userId,
      type: extractedData.type || "note",
      title: extractedData.title || "Untitled",
      date: extractedData.date || null,
      time: extractedData.time || null,
      location: extractedData.location || null,
      description: extractedData.description || "",
    });

    res.status(201).json({
      success: true,
      data: extractedData,
      extractedText: extractedText,
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Image extraction failed",
      error: error.message,
    });
  }
};

module.exports = { extractFromText, extractFromImage, upload };
