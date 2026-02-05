const Item = require("../models/Item");


const createItem = async (req, res) => {
  try {
    const { userId, type, title, date, time, location, description } = req.body;

    if (!userId || !type || !title) {
      return res.status(400).json({
        message: "userId, type and title are required fields",
      });
    }

    const newItem = await Item.create({
      userId,
      type,
      title,
      date,
      time,
      location,
      description,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({
      message: "Error creating item",
      error: error.message,
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId query parameter is required",
      });
    }

    const allItems = await Item.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch items",
      error: error.message,
    });
  }
};


const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({
      message: "Error updating item",
      error: error.message,
    });
  }
};


const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete item",
      error: error.message,
    });
  }
};

module.exports = {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
};
