const jwt = require("jsonwebtoken");

const getUser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "Rishi@123");
    if (!decoded.id) {
      return res.status(401).json({ message: "Access denied. Invalid token." });
    }
    req.id = decoded.id;
    console.log("Middleware Cleared")
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = getUser;
