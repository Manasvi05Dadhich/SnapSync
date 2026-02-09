const protect = (req, res, next) => {
  // Passport adds isAuthenticated and user when a session is valid
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    message: "Not authenticated",
  });
};

module.exports = protect;

