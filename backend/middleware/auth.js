/**
 * Middleware d'authentification JWT
 */
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token requis" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

module.exports = authMiddleware;
