/**
 * Contrôleur Commande
 */
const Commande = require("../models/Commande");
const CodePromo = require("../models/CodePromo");

// Créer une commande
exports.createCommande = async (req, res) => {
  try {
    const { client, items, codePromo, methodePayment } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Panier vide" });
    }

    let sousTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    let reduction = 0;
    let fraisLivraison = 5000; // 5000 FCFA

    // Appliquer code promo si fourni
    let promoUsed = null;
    if (codePromo) {
      promoUsed = await CodePromo.findById(codePromo);
      if (
        promoUsed &&
        promoUsed.estValide &&
        sousTotal >= promoUsed.minMontant
      ) {
        reduction =
          promoUsed.type === "pourcentage"
            ? (sousTotal * promoUsed.valeur) / 100
            : promoUsed.valeur;
        promoUsed.utilisations += 1;
        await promoUsed.save();
      }
    }

    const total = sousTotal - reduction + fraisLivraison;

    const commande = new Commande({
      client,
      items,
      sousTotal,
      fraisLivraison,
      codePromo: promoUsed ? promoUsed._id : null,
      reduction,
      total,
      methodePayment,
      statut: "en_attente",
    });

    await commande.save();
    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer toutes les commandes (Admin)
exports.getAllCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find()
      .populate("codePromo")
      .sort({ dateCommande: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer une commande par ID
exports.getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).populate(
      "codePromo",
    );
    if (!commande)
      return res.status(404).json({ error: "Commande introuvable" });
    res.json(commande);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour le statut d'une commande (Admin)
exports.updateStatutCommande = async (req, res) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { statut, dateLivraison: statut === "livree" ? new Date() : undefined },
      { new: true },
    );
    if (!commande)
      return res.status(404).json({ error: "Commande introuvable" });
    res.json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer les statistiques des commandes (Admin)
exports.getStatistiques = async (req, res) => {
  try {
    const totalCommandes = await Commande.countDocuments();
    const totalRevenu = await Commande.aggregate([
      { $match: { statut: "livree" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const parStatut = await Commande.aggregate([
      { $group: { _id: "$statut", count: { $sum: 1 } } },
    ]);

    res.json({
      totalCommandes,
      totalRevenu: totalRevenu[0]?.total || 0,
      parStatut,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
