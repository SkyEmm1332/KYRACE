/**
 * Modèle Produit - Survêtements, Costumes, Accessoires
 */
const mongoose = require("mongoose");

const SizesSchema = new mongoose.Schema(
  {
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 },
    XXL: { type: Number, default: 0 },
  },
  { _id: false },
);

const ProduitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["survet", "costume", "accessoires"],
    },
    subcategory: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    vedette: { type: Boolean, default: false },
    promo: { type: Boolean, default: false },
    colorClass: {
      type: String,
      default: "img-ph--charcoal",
      enum: [
        "img-ph--black",
        "img-ph--charcoal",
        "img-ph--navy",
        "img-ph--forest",
        "img-ph--gold",
        "img-ph--terracotta",
        "img-ph--grey",
        "img-ph--beige",
      ],
    },
    imageUrl: { type: String, default: null },
    sizes: {
      type: SizesSchema,
      default: () => ({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 }),
    },
    description: { type: String, default: "" },
    matiere: { type: String, default: "" },
    nbPieces: { type: Number, default: null },
  },
  { timestamps: true },
);

// Indexer pour les recherches rapides
ProduitSchema.index({ name: "text", category: 1, vedette: 1 });

ProduitSchema.virtual("totalStock").get(function () {
  return Object.values(this.sizes).reduce((a, b) => a + b, 0);
});

ProduitSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Produit", ProduitSchema);
