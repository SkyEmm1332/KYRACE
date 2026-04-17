/**
 * Routes Codes Promo API
 */
const express = require("express");
const router = express.Router();
const CodePromo = require("../models/CodePromo");
const authMW = require("../middleware/auth");

// GET - Vérifier si un code est valide
router.get("/check/:code", async (req, res) => {
  try {
    const code = await CodePromo.findOne({
      code: req.params.code.toUpperCase(),
    });

    if (!code || !code.estValide) {
      return res.status(404).json({ error: "Code invalide ou expiré" });
    }

    res.json({
      id: code._id,
      valeur: code.valeur,
      type: code.type,
      minMontant: code.minMontant,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Tous les codes (Admin)
router.get("/", authMW, async (req, res) => {
  try {
    const codes = await CodePromo.find().sort({ dateDebut: -1 });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Créer un code (Admin)
router.post("/", authMW, async (req, res) => {
  try {
    const code = new CodePromo(req.body);
    await code.save();
    res.status(201).json(code);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - Éditer un code (Admin)
router.put("/:id", authMW, async (req, res) => {
  try {
    const code = await CodePromo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!code) return res.status(404).json({ error: "Code introuvable" });
    res.json(code);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Supprimer un code (Admin)
router.delete("/:id", authMW, async (req, res) => {
  try {
    const code = await CodePromo.findByIdAndDelete(req.params.id);
    if (!code) return res.status(404).json({ error: "Code introuvable" });
    res.json({ message: "Code supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
