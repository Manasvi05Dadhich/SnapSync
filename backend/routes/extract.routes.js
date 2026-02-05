const express = require("express");
const { extractFromText } = require("../controllers/extract.controller");

const router = express.Router();

router.post("/", extractFromText);

module.exports = router;
