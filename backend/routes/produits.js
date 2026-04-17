/**
 * Routes Produits API
 */
const express = require("express");
const router = express.Router();
const produitCtrl = require("../controllers/produitController");
const authMW = require("../middleware/auth");

// GET - Récupérer tous les produits (avec filtres optionnels)
router.get("/", produitCtrl.getAllProduits);

// GET - Produits en vedette
router.get("/vedettes", produitCtrl.getVedettes);

// GET - Un produit par ID
router.get("/:id", produitCtrl.getProduitById);

// POST - Créer un produit (Admin)
router.post("/", authMW, produitCtrl.createProduit);

// PUT - Mettre à jour un produit (Admin)
router.put("/:id", authMW, produitCtrl.updateProduit);

// DELETE - Supprimer un produit (Admin)
router.delete("/:id", authMW, produitCtrl.deleteProduit);

// PATCH - Mettre à jour le stock d'une taille
router.patch("/:id/stock", authMW, produitCtrl.updateStock);

module.exports = router;
