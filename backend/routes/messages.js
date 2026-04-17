/**
 * Routes Messages API
 */
const express = require("express");
const router = express.Router();
const messageCtrl = require("../controllers/messageController");
const authMW = require("../middleware/auth");

// POST - Créer un message (formulaire contact)
router.post("/", messageCtrl.createMessage);

// GET - Un message par ID
router.get("/:id", messageCtrl.getMessageById);

// GET - Tous les messages (Admin)
router.get("/", authMW, messageCtrl.getAllMessages);

// PUT - Répondre à un message (Admin)
router.put("/:id/reply", authMW, messageCtrl.replyToMessage);

// DELETE - Supprimer un message (Admin)
router.delete("/:id", authMW, messageCtrl.deleteMessage);

// GET - Statistiques (Admin)
router.get("/admin/statistiques", authMW, messageCtrl.getStatistiques);

module.exports = router;
