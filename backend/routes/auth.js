/**
 * Routes Authentification
 */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Login Admin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Credentials de démo (à remplacer en production par une vraie DB)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@kyrace.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123456";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { id: "admin", email: ADMIN_EMAIL },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    res.json({ token, email: ADMIN_EMAIL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vérifier le token
router.post("/verify", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token requis" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(403).json({ error: "Token invalide" });
  }
});

module.exports = router;
