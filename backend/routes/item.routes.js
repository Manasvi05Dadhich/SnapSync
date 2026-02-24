const express = require("express");
const itemController = require("../controllers/item.controller");
const protect = require("../middleware/protect");

const router = express.Router();

router.use(protect);

router.post("/", itemController.createItem);
router.get("/", itemController.getAllItems);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);
router.post("/:id/add-to-calendar", itemController.addItemToCalendar);

module.exports = router;