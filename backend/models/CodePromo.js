/**
 * Modèle Code Promo - Gestion des codes de réduction
 */
const mongoose = require("mongoose");

const CodePromoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ["pourcentage", "montant_fixe"],
      default: "pourcentage",
    },
    valeur: { type: Number, required: true, min: 0 }, // % ou montant
    minMontant: { type: Number, default: 0 }, // Montant minimum de panier
    maxUtilisations: { type: Number, default: null }, // null = illimité
    utilisations: { type: Number, default: 0 },

    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },

    actif: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Vérifier si le code est expiré
CodePromoSchema.virtual("estExpire").get(function () {
  return new Date() > this.dateFin;
});

// Vérifier si le code peut être utilisé
CodePromoSchema.virtual("estValide").get(function () {
  return (
    this.actif &&
    !this.estExpire &&
    (!this.maxUtilisations || this.utilisations < this.maxUtilisations)
  );
});

CodePromoSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("CodePromo", CodePromoSchema);
