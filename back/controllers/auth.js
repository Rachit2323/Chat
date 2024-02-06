const jwt = require("jsonwebtoken");
const JWT_SECRET = "djbdjbbbhdbh3y3";

const isAuthenticated = (req, res, next) => {
  const authorizationHeader = req.header("Authorization");
 

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const token = authorizationHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded?.userId;

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ error: "Invalid token. Please log in again." });
    } else {
      res.status(401).json({ error: "Token is not valid" });
    }
  }
};

module.exports = isAuthenticated;
