const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const itemRoutes = require("./routes/item.routes");
const extractRoutes = require("./routes/extract.routes");
const authRoutes = require("./routes/auth.routes");
require("./configs/passport");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/extract", extractRoutes);

module.exports = app;