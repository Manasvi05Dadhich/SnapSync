const express = require("express");
const {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
} = require("../controllers/item.controller");
const protect = require("../middleware/protect");

const router = express.Router();

// All item routes require authentication
router.use(protect);

router.post("/", createItem);
router.get("/", getAllItems);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;