const express = require("express");
const passport = require("passport");

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
    // After successful auth, redirect to frontend
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
);

router.get("/success", (req, res) => {
  res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
});

router.get("/failure", (req, res) => {
  res.send("Login failed");
});

router.get("/me", (req, res) => {
  res.json(req.user || null);
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  });
});

module.exports = router;