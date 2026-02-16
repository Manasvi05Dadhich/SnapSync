const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar.events"],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
  }),
  (req, res) => {
    // JWT in redirect - avoids cross-origin cookie issues in production
    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.SESSION_SECRET || "supersecret",
      { expiresIn: "30d" }
    );
    res.redirect(`${frontendUrl}#token=${token}`);
  }
);

router.get("/success", (req, res) => {
  res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
});

router.get("/failure", (req, res) => {
  res.send("Login failed");
});

// Middleware: populate req.user from JWT if no session
const optionalJwt = async (req, res, next) => {
  if (req.user) return next(); // Already have user from session
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, process.env.SESSION_SECRET || "supersecret");
      req.user = await User.findById(decoded.userId);
    } catch (err) {
      // Invalid or expired - leave req.user as is
    }
  }
  next();
};

router.get("/me", optionalJwt, (req, res) => {
  res.json(req.user || null);
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  });
});

module.exports = router;