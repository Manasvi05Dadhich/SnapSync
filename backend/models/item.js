const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
   
    userId: {
      type: String,
      required: true,
    },

   
    type: {
      type: String,
      enum: ["event", "task", "note"],
      required: true,
    },

    
    title: {
      type: String,
      required: true,
    },

   
    date: {
      type: String,
      default: null,
    },

    
    time: {
      type: String,
      default: null,
    },

    
    location: {
      type: String,
      default: null,
    },

   
    description: {
      type: String,
      default: "",
    },

    
    addedToCalendar: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);