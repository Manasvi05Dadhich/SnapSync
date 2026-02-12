const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    photo: {
      type: String,
    },

    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },


    pushSubscriptions: [
      {
        endpoint: String,
        keys: {
          p256dh: String,
          auth: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
