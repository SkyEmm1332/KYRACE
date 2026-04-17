/**
 * Routes Commandes API
 */
const express = require("express");
const router = express.Router();
const commandeCtrl = require("../controllers/commandeController");
const authMW = require("../middleware/auth");

// POST - Créer une commande
router.post("/", commandeCtrl.createCommande);

// GET - Récupérer une commande par ID
router.get("/:id", commandeCtrl.getCommandeById);

// GET - Récupérer toutes les commandes (Admin)
router.get("/", authMW, commandeCtrl.getAllCommandes);

// PUT - Mettre à jour le statut (Admin)
router.put("/:id/statut", authMW, commandeCtrl.updateStatutCommande);

// GET - Statistiques (Admin)
router.get("/admin/statistiques", authMW, commandeCtrl.getStatistiques);

module.exports = router;
