const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const passport = require("../configs/passport");

const router = express.Router();

const JWT_SECRET = process.env.SESSION_SECRET || "supersecret";

// Register
router.post("/register", async (req, res) => {
  console.log("Registration attempt:", req.body);
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    console.log("Creating user...");
    const user = await User.create({ name, email, password });
    console.log("User created:", user._id);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "30d" });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("FULL REGISTRATION ERROR:", err);
    res.status(500).json({
      message: err.message || "Registration failed",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.json(null);
  }
  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    res.json(user || null);
  } catch (err) {
    res.json(null);
  }
});

// Logout (client-side — just tells frontend to clear token)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

// --- Google OAuth (Hybrid Flow) ---

// Initiate Google Auth
// We use 'session: false' because we're using JWTs
router.get(
  "/google",
  (req, res, next) => {
    if (!passport || passport.isMock) {
      return res.status(503).json({ message: "Google integration is disabled due to missing dependencies. Please run npm install." });
    }
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar.events"],
    accessType: "offline",
    prompt: "consent",
    session: false,
  })
);

// Google Auth Callback
router.get(
  "/google/callback",
  (req, res, next) => {
    if (!passport || passport.isMock) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/#error=missing_dependencies`);
    }
    next();
  },
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    try {
      const { profile, accessToken, refreshToken } = req.user;

      // Look for user by email (from Google profile)
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      if (user) {
        // Link Google tokens to existing account
        user.googleId = profile.id;
        user.accessToken = accessToken;
        if (refreshToken) user.refreshToken = refreshToken; // Only provided on first consent
        if (!user.photo) user.photo = profile.photos[0].value;
        await user.save();
      } else {
        // Create new account via Google if it doesn't exist
        // Note: Password will be empty, so they must use Google or set one later
        user = await User.create({
          name: profile.displayName,
          email: email,
          googleId: profile.id,
          accessToken: accessToken,
          refreshToken: refreshToken,
          photo: profile.photos[0].value,
          password: Math.random().toString(36).slice(-10), // Random temp password
        });
      }

      // Generate JWT for the user
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "30d" });

      // Redirect back to frontend with token in hash
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(`${frontendUrl}/#token=${token}`);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/#error=auth_failed`);
    }
  }
);

module.exports = router;