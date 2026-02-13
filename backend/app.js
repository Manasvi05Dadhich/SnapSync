const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const itemRoutes = require("./routes/item.routes");
const extractRoutes = require("./routes/extract.routes");
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require("./routes/notification.routes");
require("./configs/passport");

const app = express();

// Trust proxies (Render, Vercel) so secure cookies work
app.set('trust proxy', 1);

// CORS must come first
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

// Passport must come after session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/extract", extractRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;