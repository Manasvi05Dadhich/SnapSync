const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
    successRedirect: "/api/auth/success",
  })
);

router.get("/success", (req, res) => {
  res.send("Login successful");
});

router.get("/failure", (req, res) => {
  res.send("Login failed");
});

router.get("/me", (req, res) => {
  res.json(req.user || null);
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.send("Logged out");
  });
});

module.exports = router;