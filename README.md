# KYRACE — Plateforme E-Commerce Premium

Application web complète et professionnelle pour la vente de survêtements et costumes premium confectionnés à Abidjan.

## 📋 Architecture

### Frontend

- **SPA (Single Page Application)** avec routing dynamique
- **Responsive Design** (Desktop, Tablet, Mobile)
- **Thème Premium** : or, noir, beige avec typographie élégante (Bebas Neue, Cormorant Garamond, Outfit)

### Backend

- **Express.js** pour les routes API
- **MongoDB** pour la base de données
- **JWT** pour l'authentification admin
- **Mongoose** pour la modélisation

### Dashboard Admin

- ✅ Gestion complète des produits (CRUD)
- ✅ Gestion du stock par taille (S, M, L, XL, XXL)
- ✅ Suivi des commandes avec statuts
- ✅ Gestion des messages de contact
- ✅ Création et gestion des codes promo
- ✅ Statistiques en temps réel

---

## 🚀 Installation

### 1. Prérequis

- **Node.js** (v14+)
- **MongoDB** (local ou MongoDB Atlas)
- **npm** ou **yarn**

### 2. Cloner et Installer

```bash
cd kyrace-app
npm install
```

### 3. Configuration

Éditer le fichier `.env` :

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/kyrace
# Ou avec MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/kyrace

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (changer en production!)
JWT_SECRET=your_super_secret_jwt_key_change_me_in_production

# Admin Credentials
ADMIN_EMAIL=admin@kyrace.com
ADMIN_PASSWORD=admin123456
```

### 4. Démarrer le Serveur

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

### 5. Accès

- **Frontend** : http://localhost:5000
- **Admin Dashboard** : http://localhost:5000/admin
- **API Documentation** : http://localhost:5000/api

---

## 📦 Structure du Projet

```
kyrace-app/
├── package.json
├── .env
├── server.js (Point d'entrée)
│
├── /frontend
│   ├── index.html (Vue principale)
│   ├── /css
│   │   ├── styles.css (Styles principaux)
│   │   └── responsive.css (Media queries)
│   ├── /js
│   │   ├── app.js (Routing SPA)
│   │   ├── cart.js (Gestion panier)
│   │   ├── search.js (Recherche & contact)
│   │   └── ui.js (UI utilities)
│   └── /admin
│       ├── index.html (Dashboard)
│       ├── /css/admin.css
│       └── /js/admin.js
│
├── /backend
│   ├── /models (Schémas Mongoose)
│   │   ├── Produit.js
│   │   ├── Commande.js
│   │   ├── Message.js
│   │   ├── CodePromo.js
│   │   └── Stock.js
│   ├── /routes (Endpoints API)
│   │   ├── produits.js
│   │   ├── commandes.js
│   │   ├── messages.js
│   │   ├── promos.js
│   │   └── auth.js
│   ├── /controllers (Logic métier)
│   │   ├── produitController.js
│   │   ├── commandeController.js
│   │   └── messageController.js
│   └── /middleware (Auth, Error handling)
│       ├── auth.js
│       └── errorHandler.js
```

---

## 🔌 API Endpoints

### Produits

- `GET /api/produits` - Liste tous les produits (+ filtres)
- `GET /api/produits/vedettes` - Produits en vedette (max 8)
- `GET /api/produits/:id` - Un produit
- `POST /api/produits` - Créer (Admin)
- `PUT /api/produits/:id` - Éditer (Admin)
- `DELETE /api/produits/:id` - Supprimer (Admin)
- `PATCH /api/produits/:id/stock` - Mettre à jour le stock (Admin)

### Commandes

- `POST /api/commandes` - Créer une commande
- `GET /api/commandes/:id` - Une commande
- `GET /api/commandes` - Toutes (Admin)
- `PUT /api/commandes/:id/statut` - Changer le statut (Admin)

### Messages

- `POST /api/messages` - Créer un message
- `GET /api/messages/:id` - Un message
- `GET /api/messages` - Tous (Admin)
- `PUT /api/messages/:id/reply` - Répondre (Admin)
- `DELETE /api/messages/:id` - Supprimer (Admin)

### Codes Promo

- `GET /api/promos/check/:code` - Vérifier un code
- `GET /api/promos` - Tous (Admin)
- `POST /api/promos` - Créer (Admin)
- `PUT /api/promos/:id` - Éditer (Admin)
- `DELETE /api/promos/:id` - Supprimer (Admin)

### Authentification

- `POST /api/auth/login` - Login admin
- `POST /api/auth/verify` - Vérifier token

---

## 💾 Modèles de Données

### Produit

```javascript
{
  name: String,
  category: 'survet' | 'costume' | 'accessoires',
  subcategory: String,
  price: Number,
  oldPrice: Number,
  vedette: Boolean,
  promo: Boolean,
  colorClass: String,
  imageUrl: String,
  sizes: { S, M, L, XL, XXL: Number },
  description: String,
  matiere: String,
  nbPieces: Number
}
```

### Commande

```javascript
{
  numero: String (auto-généré),
  client: { prenom, nom, email, telephone, adresse, ville, codePostal },
  items: [{ produitId, name, price, taille, quantity, subtotal }],
  sousTotal: Number,
  fraisLivraison: Number,
  codePromo: ObjectId,
  reduction: Number,
  total: Number,
  statut: 'en_attente' | 'validee' | 'en_preparation' | 'en_route' | 'livree' | 'annulee',
  methodePayment: 'carte' | 'virement' | 'cash' | 'mobile_money'
}
```

### Message

```javascript
{
  prenom: String,
  nom: String,
  email: String,
  telephone: String,
  sujet: String,
  message: String,
  lu: Boolean,
  repondu: Boolean
}
```

### CodePromo

```javascript
{
  code: String (UPPERCASE, unique),
  description: String,
  type: 'pourcentage' | 'montant_fixe',
  valeur: Number,
  minMontant: Number,
  maxUtilisations: Number,
  utilisations: Number,
  dateDebut: Date,
  dateFin: Date,
  actif: Boolean
}
```

---

## 🎯 Fonctionnalités

### Frontend Client

- ✅ Navigation fluide (SPA)
- ✅ Recherche produits en temps réel
- ✅ Filtres par catégorie
- ✅ Panier persistant (localStorage)
- ✅ Système de tailles avec stock
- ✅ Formulaire de contact
- ✅ Newsletter subscription
- ✅ Design responsive
- ✅ Performance optimisée

### Dashboard Admin

- ✅ Authentification JWT
- ✅ Tableau de bord stats
- ✅ CRUD complet produits
- ✅ Gestion du stock par taille
- ✅ Sélection vedettes (max 8)
- ✅ Suivi commandes avec changement de statut
- ✅ Gestion messages contact
- ✅ Gestion codes promo (création, édition, suppression)
- ✅ Export statistiques

---

## 🔐 Sécurité

### En Place

- JWT pour authentification admin
- Validation inputs côté serveur
- CORS configuré
- Helmet pour headers de sécurité
- Rate limiting recommandé

### À Faire (Production)

- ✓ Changer le JWT_SECRET
- ✓ Changer les credentials admin
- ✓ Utiliser HTTPS
- ✓ Ajouter rate limiting
- ✓ Ajouter validations strictes
- ✓ Implémenter CSRF protection
- ✓ Hashage des mots de passe
- ✓ Audit logging

---

## 📊 Gestion du Stock

Le système de stock fonctionne par **taille** :

- **S, M, L, XL, XXL** : Chaque taille a sa quantité
- Lors de l'ajout panier : Si une taille = 0, le bouton est désactivé
- Admin peut mettre à jour le stock individuellement
- Mouvements sauvegardés dans l'historique

---

## 🎨 Personnalisation

### Couleurs (Variables CSS)

```css
--black: #0d0d0d --white: #faf8f3 --gold: #c8a96e --terracotta: #c4623a
  --forest: #2d4a3e;
```

### Ajouter une Catégorie

1. Éditer `Produit.js` : ajouter dans l'enum `category`
2. Ajouter le bouton filtre dans `index.html`
3. Ajouter la route dans `app.js`

### Ajouter des Tailles

Éditer `Produit.js` et `Stock.js` pour ajouter les nouvelles tailles dans le schéma `sizes`.

---

## 🧪 Tests

```bash
# Vérifier la connexion API
curl http://localhost:5000/api/health

# Créer un produit (nécessite JWT)
curl -X POST http://localhost:5000/api/produits \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 📞 Support & Maintenance

- **Logs serveur** : Consulter la console Node.js
- **Erreurs MongoDB** : Vérifier la connexion string
- **Issues API** : Vérifier le token JWT
- **Performance** : Ajouter des indexes MongoDB

---

## 📝 Licence

Propriétaire - KYRACE Abidjan © 2025

---

## ✨ Prochaines Améliorations

- [ ] Upload images (multer)
- [ ] Email notifications
- [ ] Paiement en ligne (Stripe/PayPal)
- [ ] Multi-langue
- [ ] Wishlist utilisateurs
- [ ] Avis produits
- [ ] Notifications temps réel
- [ ] Analytics avancées
- [ ] SEO optimization
- [ ] PWA (Progressive Web App)

---

**Démarrage rapide :**

```bash
npm install
npm run dev
# Aller sur http://localhost:5000
# Dashboard: http://localhost:5000/admin
# Login: admin@kyrace.com / admin123456
```