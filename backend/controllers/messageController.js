/**
 * Contrôleur Message
 */
const Message = require("../models/Message");

// Créer un message (formulaire contact)
exports.createMessage = async (req, res) => {
  try {
    const { prenom, nom, email, telephone, sujet, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: "Email et message requis" });
    }

    const newMessage = new Message({
      prenom,
      nom,
      email,
      telephone,
      sujet,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer tous les messages (Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ dateMessage: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un message par ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ error: "Message introuvable" });

    // Marquer comme lu
    message.lu = true;
    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Répondre à un message (Admin)
exports.replyToMessage = async (req, res) => {
  try {
    const { reponseText } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        repondu: true,
        dateReponse: new Date(),
        reponseText,
      },
      { new: true },
    );
    if (!message) return res.status(404).json({ error: "Message introuvable" });
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un message (Admin)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: "Message introuvable" });
    res.json({ message: "Message supprimé", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les statistiques des messages (Admin)
exports.getStatistiques = async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const nonLus = await Message.countDocuments({ lu: false });
    const nonRepond = await Message.countDocuments({ repondu: false });

    res.json({ total, nonLus, nonRepond });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
