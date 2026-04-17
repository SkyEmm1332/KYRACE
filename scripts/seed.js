/**
 * Seed Script - Initialiser des données de démo
 * Utilisation: node scripts/seed.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const Produit = require("../backend/models/Produit");
const Stock = require("../backend/models/Stock");
const CodePromo = require("../backend/models/CodePromo");

async function seed() {
  try {
    // Connexion MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/kyrace",
    );
    console.log("✅ Connecté à MongoDB");

    // Nettoyer les collections
    await Produit.deleteMany({});
    await Stock.deleteMany({});
    await CodePromo.deleteMany({});
    console.log("🗑️  Collections vidées");

    // Créer des produits de démo
    const produits = [
      {
        name: "Survêtement Technique Premium",
        category: "survet",
        subcategory: "sport",
        price: 45000,
        oldPrice: 55000,
        vedette: true,
        promo: true,
        colorClass: "img-ph--charcoal",
        sizes: { S: 10, M: 15, L: 12, XL: 8, XXL: 5 },
        description: "Survêtement haute performance en polyester technique.",
        matiere: "Polyester technique",
      },
      {
        name: "Costume 3 Pièces Luxe",
        category: "costume",
        subcategory: "3-pieces",
        price: 150000,
        vedette: true,
        colorClass: "img-ph--navy",
        sizes: { S: 3, M: 6, L: 5, XL: 4, XXL: 2 },
        description: "Costume 3 pièces avec gilet intégré.",
        matiere: "Laine mélangée",
        nbPieces: 3,
      },
      {
        name: "Costume 2 Pièces Élégant",
        category: "costume",
        subcategory: "2-pieces",
        price: 120000,
        vedette: true,
        colorClass: "img-ph--black",
        sizes: { S: 5, M: 8, L: 7, XL: 6, XXL: 3 },
        description: "Costume 2 pièces veste + pantalon.",
        matiere: "Laine 100%",
        nbPieces: 2,
      },
      {
        name: "Survêtement Femme Chic",
        category: "survet",
        subcategory: "femme",
        price: 48000,
        vedette: true,
        colorClass: "img-ph--terracotta",
        sizes: { S: 12, M: 18, L: 14, XL: 10, XXL: 6 },
        description: "Survêtement femme coupe ajustée.",
        matiere: "Polyester elastique",
      },
      {
        name: "Ceinture Cuir Premium",
        category: "accessoires",
        price: 15000,
        promo: true,
        colorClass: "img-ph--black",
        sizes: { S: 50, M: 50, L: 50, XL: 50, XXL: 50 },
        description: "Ceinture cuir véritable avec boucle dorée.",
      },
      {
        name: "Blazer Premium Homme",
        category: "costume",
        subcategory: "blazer",
        price: 85000,
        colorClass: "img-ph--forest",
        sizes: { S: 4, M: 8, L: 7, XL: 5, XXL: 2 },
        description: "Blazer premium pour homme.",
        matiere: "Laine",
      },
    ];

    const createdProduits = await Produit.insertMany(produits);
    console.log(`📦 ${createdProduits.length} produits créés`);

    // Créer les entrées stock correspondantes
    for (const produit of createdProduits) {
      await Stock.create({
        produitId: produit._id,
        tailles: {
          S: { quantite: produit.sizes.S, minAlerte: 5 },
          M: { quantite: produit.sizes.M, minAlerte: 5 },
          L: { quantite: produit.sizes.L, minAlerte: 5 },
          XL: { quantite: produit.sizes.XL, minAlerte: 5 },
          XXL: { quantite: produit.sizes.XXL, minAlerte: 5 },
        },
      });
    }
    console.log("📊 Stock initialisé");

    // Créer des codes promo
    const promos = [
      {
        code: "NOEL2025",
        description: "Noël 2025 - 20% de réduction",
        type: "pourcentage",
        valeur: 20,
        minMontant: 50000,
        maxUtilisations: null,
        dateDebut: new Date("2025-12-01"),
        dateFin: new Date("2025-12-31"),
        actif: true,
      },
      {
        code: "BIENVENUE",
        description: "Premier achat - 10 000 FCFA de réduction",
        type: "montant_fixe",
        valeur: 10000,
        minMontant: 30000,
        maxUtilisations: 100,
        dateDebut: new Date("2025-01-01"),
        dateFin: new Date("2026-12-31"),
        actif: true,
      },
      {
        code: "PROMO50",
        description: "50 000 FCFA de réduction",
        type: "montant_fixe",
        valeur: 50000,
        minMontant: 100000,
        maxUtilisations: 50,
        dateDebut: new Date("2025-02-01"),
        dateFin: new Date("2025-02-28"),
        actif: true,
      },
    ];

    await CodePromo.insertMany(promos);
    console.log(`🎁 ${promos.length} codes promo créés`);

    console.log("\n✅ Seed terminé avec succès!");
    console.log("Vous pouvez maintenant accéder à http://localhost:5000");
  } catch (err) {
    console.error("❌ Erreur:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
