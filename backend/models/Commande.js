/**
 * Modèle Commande - Suivi des commandes
 */
const mongoose = require("mongoose");

const CommandeItemSchema = new mongoose.Schema(
  {
    produitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },
    name: String,
    price: Number,
    taille: String,
    quantity: Number,
    subtotal: Number,
  },
  { _id: false },
);

const CommandeSchema = new mongoose.Schema(
  {
    numero: { type: String, unique: true, sparse: true },
    client: {
      prenom: { type: String, required: true },
      nom: { type: String, required: true },
      email: { type: String, required: true },
      telephone: String,
      adresse: String,
      ville: String,
      codePostal: String,
    },
    items: [CommandeItemSchema],
    sousTotal: Number,
    fraisLivraison: { type: Number, default: 0 },
    codePromo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodePromo",
      default: null,
    },
    reduction: { type: Number, default: 0 },
    total: Number,

    statut: {
      type: String,
      enum: [
        "en_attente",
        "validee",
        "en_preparation",
        "en_route",
        "livree",
        "annulee",
      ],
      default: "en_attente",
    },

    methodePayment: {
      type: String,
      enum: ["carte", "virement", "cash", "mobile_money"],
      default: "mobile_money",
    },

    dateCommande: { type: Date, default: Date.now },
    dateLivraison: Date,
    notes: String,
  },
  { timestamps: true },
);

// Générer un numéro de commande automatique
CommandeSchema.pre("save", async function (next) {
  if (!this.numero) {
    const count = await mongoose.model("Commande").countDocuments();
    this.numero = `KYRC-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model("Commande", CommandeSchema);
