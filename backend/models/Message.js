/**
 * Modèle Message - Formulaire de contact
 */
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    email: { type: String, required: true },
    telephone: String,
    sujet: {
      type: String,
      enum: [
        "commande",
        "sur-mesure",
        "survêt",
        "costume",
        "revendeur",
        "partenariat",
        "autre",
      ],
      default: "autre",
    },
    message: { type: String, required: true },
    lu: { type: Boolean, default: false },
    repondu: { type: Boolean, default: false },
    dateMessage: { type: Date, default: Date.now },
    dateReponse: Date,
    reponseText: String,
  },
  { timestamps: true },
);

MessageSchema.index({ email: 1, lu: 1 });

module.exports = mongoose.model("Message", MessageSchema);
