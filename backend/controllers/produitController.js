/**
 * Contrôleur Produit
 */
const Produit = require("../models/Produit");
const Stock = require("../models/Stock");

// Récupérer tous les produits avec filtres
exports.getAllProduits = async (req, res) => {
  try {
    const { category, vedette, promo, subcategory, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (vedette === "true") filter.vedette = true;
    if (promo === "true") filter.promo = true;

    let query = Produit.find(filter).sort({ createdAt: -1 });

    if (search) {
      query = Produit.find(
        { $text: { $search: search }, ...filter },
        { score: { $meta: "textScore" } },
      ).sort({ score: { $meta: "textScore" } });
    }

    const produits = await query;
    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer produits en vedette (max 8)
exports.getVedettes = async (req, res) => {
  try {
    const vedettes = await Produit.find({ vedette: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(vedettes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un produit par ID
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ error: "Produit introuvable" });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un produit (Admin)
exports.createProduit = async (req, res) => {
  try {
    const produit = new Produit(req.body);
    await produit.save();

    // Créer une entrée stock associée
    const stock = new Stock({
      produitId: produit._id,
      tailles: {
        S: { quantite: 0, minAlerte: 5 },
        M: { quantite: 0, minAlerte: 5 },
        L: { quantite: 0, minAlerte: 5 },
        XL: { quantite: 0, minAlerte: 5 },
        XXL: { quantite: 0, minAlerte: 5 },
      },
    });
    await stock.save();

    res.status(201).json(produit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour un produit (Admin)
exports.updateProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!produit) return res.status(404).json({ error: "Produit introuvable" });
    res.json(produit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un produit (Admin)
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ error: "Produit introuvable" });

    // Supprimer aussi le stock associé
    await Stock.deleteOne({ produitId: req.params.id });

    res.json({ message: "Produit supprimé", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour le stock par taille
exports.updateStock = async (req, res) => {
  try {
    const { taille, quantite, raison } = req.body;
    const produit = await Produit.findById(req.params.id);

    if (!produit) return res.status(404).json({ error: "Produit introuvable" });

    // Mettre à jour le produit
    produit.sizes[taille] = quantite;
    await produit.save();

    // Enregistrer le mouvement
    const stock = await Stock.findOne({ produitId: req.params.id });
    if (stock) {
      stock.tailles[taille].quantite = quantite;
      stock.mouvements.push({
        type: "ajustement",
        taille,
        quantite,
        raison: raison || "Ajustement manuel",
      });
      await stock.save();
    }

    res.json(produit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
