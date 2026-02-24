const Item = require('../models/item');
const calenderService = require('../services/calenderService');

const createItem = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    const { type, title, date, time, location, description } = req.body;

    if (!userId || !type || !title) {
      return res.status(400).json({
        message: "type and title are required, and user must be authenticated",
      });
    }

    const newItem = await Item.create({
      userId,
      type,
      title,
      date: date || null,
      time: time || null,
      location: location || null,
      description: description || "",
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
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(401).json({
        message: "Not authenticated",
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
    const userId = req.user?._id?.toString();

    const updatedItem = await Item.findOneAndUpdate(
      { _id: id, userId },
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
    const userId = req.user?._id?.toString();

    const deletedItem = await Item.findOneAndDelete({ _id: id, userId });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};

const addItemToCalendar = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (!req.user.refreshToken) {
      return res.status(400).json({ message: 'Google Calendar not connected' });
    }

    const event = await calenderService.createCalendarEvent(
      {
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken,
      },
      {
        title: item.title,
        description: item.description,
        date: item.date,
      }
    );

    res.json({ message: 'Added to Google Calendar', event });
  } catch (err) {
    console.error('Calendar error:', err);
    res.status(500).json({ message: 'Failed to add to calendar', error: err.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  addItemToCalendar,
};
