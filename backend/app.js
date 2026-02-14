const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const itemRoutes = require("./routes/item.routes");
const extractRoutes = require("./routes/extract.routes");
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require("./routes/notification.routes");
require("./configs/passport");

const app = express();

// Required when behind a reverse proxy (Render, Heroku, etc.) so secure cookies work
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      process.env.BACKEND_URL || "http://localhost:5000"
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 30 * 24 * 60 * 60, // 30 days
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === "production"
        ? undefined  
        : "localhost",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/extract", extractRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;