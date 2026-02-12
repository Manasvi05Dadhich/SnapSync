const express = require("express");
const {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  addItemToCalendar,
} = require("../controllers/item.controller");
const protect = require("../middleware/protect");

const router = express.Router();

n
router.use(protect);

router.post("/", createItem);
router.get("/", getAllItems);
router.put("/:id", updateItem);
router.post("/:id/add-to-calendar", addItemToCalendar);
router.delete("/:id", deleteItem);

module.exports = router;