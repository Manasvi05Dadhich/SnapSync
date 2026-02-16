const jwt = require("jsonwebtoken");
const User = require("../models/users");

const protect = async (req, res, next) => {
  // Session (cookie) - works for same-origin
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // JWT (Bearer token) - works cross-origin when cookies are blocked
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, process.env.SESSION_SECRET || "supersecret");
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      // Invalid or expired token
    }
  }

  return res.status(401).json({
    message: "Not authenticated",
  });
};

module.exports = protect;