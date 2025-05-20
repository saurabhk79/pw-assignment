const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }

  req.user = user;
  next();
}

module.exports = authMiddleware;
