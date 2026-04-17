/**
 * KYRACE Server - Serveur principal Express
 * Port: 5000
 */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

// Charger les variables d'environnement
dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "frontend")));

// ===== CONNEXION MONGODB =====
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/kyrace", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// ===== ROUTES API =====
app.use("/api/produits", require("./backend/routes/produits"));
app.use("/api/commandes", require("./backend/routes/commandes"));
app.use("/api/messages", require("./backend/routes/messages"));
app.use("/api/promos", require("./backend/routes/promos"));
app.use("/api/auth", require("./backend/routes/auth"));

// ===== ROUTE HEALTH CHECK =====
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Serveur KYRACE opérationnel" });
});

// ===== ROUTE SPA FALLBACK =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "admin", "index.html"));
});

// ===== GESTION DES ERREURS =====
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Erreur serveur interne",
    status: err.status || 500,
  });
});

// ===== LANCER LE SERVEUR =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur KYRACE lancé sur http://localhost:${PORT}`);
  console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`🌐 Frontend: http://localhost:${PORT}\n`);
});
