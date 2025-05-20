const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

function createToken(payload, expiresIn = "2h") {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = { createToken, verifyToken };
