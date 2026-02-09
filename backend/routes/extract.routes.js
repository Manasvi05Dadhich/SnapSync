const express = require("express");
const {
  extractFromText,
  extractFromImage,
  upload,
} = require("../controllers/extract.controller");
const protect = require("../middleware/protect");

const router = express.Router();

// All extract routes require authentication
router.post("/", protect, extractFromText);
router.post("/image", protect, upload.single("image"), extractFromImage);

module.exports = router;
