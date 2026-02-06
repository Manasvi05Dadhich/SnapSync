const express = require("express");
const { extractFromText, extractFromImage, upload } = require("../controllers/extract.controller");

const router = express.Router();

router.post("/", extractFromText);
router.post("/image", upload.single('image'), extractFromImage);

module.exports = router;
