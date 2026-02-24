const express = require("express");
const cors = require("cors");
const itemRoutes = require("./routes/item.routes");
const extractRoutes = require("./routes/extract.routes");
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require("./routes/notification.routes");
const passport = require("./configs/passport");

const app = express();

app.use(passport.initialize());

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      process.env.BACKEND_URL || "http://localhost:5000"
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/extract", extractRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;