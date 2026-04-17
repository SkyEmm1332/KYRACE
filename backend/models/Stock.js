/**
 * Modèle Stock - Gestion avancée du stock par taille
 */
const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    produitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
      unique: true,
    },
    tailles: {
      S: {
        quantite: { type: Number, default: 0 },
        minAlerte: { type: Number, default: 5 },
      },
      M: {
        quantite: { type: Number, default: 0 },
        minAlerte: { type: Number, default: 5 },
      },
      L: {
        quantite: { type: Number, default: 0 },
        minAlerte: { type: Number, default: 5 },
      },
      XL: {
        quantite: { type: Number, default: 0 },
        minAlerte: { type: Number, default: 5 },
      },
      XXL: {
        quantite: { type: Number, default: 0 },
        minAlerte: { type: Number, default: 5 },
      },
    },
    mouvements: [
      {
        type: {
          type: String,
          enum: ["entree", "sortie", "ajustement"],
          required: true,
        },
        taille: String,
        quantite: Number,
        raison: String,
        date: { type: Date, default: Date.now },
      },
    ],
    lastUpdate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Stock", StockSchema);
