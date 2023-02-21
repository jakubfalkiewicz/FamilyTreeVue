const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("User authenticated");
    return next();
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
};

module.exports = checkAuthenticated;
