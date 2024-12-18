const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret";

const verifyJwt = (req, res, next) => {
  console.log("header:", req.headers);
  const token = req.headers["authorization"]?.split(" ")[1]; // Check for token in cookie or Authorization header
  console.log("Token:", token);
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = { verifyJwt };
