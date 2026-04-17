# 🚀 Guide d'Installation KYRACE

## Installation Complète Étape par Étape

### **Étape 1 : Installation de MongoDB**

#### Option A : MongoDB Local (Windows)

1. Télécharger depuis https://www.mongodb.com/try/download/community
2. Installer avec les options par défaut
3. Vérifier l'installation :

```bash
mongod --version
```

#### Option B : MongoDB Atlas (Cloud)

1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un nouveau cluster
3. Récupérer la connection string et remplacer dans `.env` :

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/kyrace
```

---

### **Étape 2 : Installation du Projet**

```bash
# Naviguer dans le dossier du projet
cd kyrace-app

# Installer les dépendances
npm install

# Vérifier que tout est installé
npm list
```

---

### **Étape 3 : Configuration de l'Environnement**

Créer/Éditer le fichier `.env` à la racine du projet :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/kyrace

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=kyrace_secret_key_super_secure_change_in_production

# Admin (à changer en production!)
ADMIN_EMAIL=admin@kyrace.com
ADMIN_PASSWORD=admin123456
```

---

### **Étape 4 : Initialiser les Données de Démo**

```bash
# Créer les collections et ajouter des produits
node scripts/seed.js
```

**Résultat attendu :**

```
✅ Connecté à MongoDB
🗑️  Collections vidées
📦 6 produits créés
📊 Stock initialisé
🎁 3 codes promo créés

✅ Seed terminé avec succès!
```

---

### **Étape 5 : Démarrer le Serveur**

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

**Output attendu :**

```
✅ MongoDB connecté
🚀 Serveur KYRACE lancé sur http://localhost:5000
📊 Admin dashboard: http://localhost:5000/admin
🌐 Frontend: http://localhost:5000
```

---

## ✅ Vérification de l'Installation

### 1. Frontend Accessible

- Ouvrir http://localhost:5000 dans le navigateur
- Vérifier que la page charge avec le design KYRACE

### 2. Navigation

- Cliquer sur "Boutique" → Page avec produits
- Cliquer sur "Survêtements" → Filtrage OK
- Rechercher un produit → Résultats

### 3. Panier

- Ajouter un produit au panier
- Ouvrir le panier (icône)
- Quantité correcte

### 4. Dashboard Admin

- Aller sur http://localhost:5000/admin
- **Credentials :**
  - Email: `admin@kyrace.com`
  - Mot de passe: `admin123456`
- Se connecter
- Vérifier que les sections sont accessibles

### 5. API Test

```bash
# Tester l'endpoint santé
curl http://localhost:5000/api/health

# Récupérer les produits
curl http://localhost:5000/api/produits
```

---

## 🐛 Troubleshooting

### MongoDB ne démarre pas

```bash
# Windows: Vérifier le service
net start MongoDB

# Relancer le service
mongod --dbpath "C:\data\db"
```

### Port 5000 déjà utilisé

```bash
# Changer le port dans .env
PORT=3000

# Ou trouver le processus et le tuer
lsof -i :5000
kill -9 <PID>
```

### "Module not found"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur de connexion MongoDB

```bash
# Vérifier la connection string dans .env
# Vérifier que MongoDB est lancé
# Pour local: mongod doit tourner
# Pour Atlas: vérifier les credentials
```

### Le seed ne fonctionne pas

```bash
# Vérifier que MongoDB est lancé
# Lancer le seed avec plus de détails
node scripts/seed.js
```

---

## 📱 Tests Fonctionnels

### Parcours Client

1. ✅ Accueil avec vedettes
2. ✅ Recherche produit
3. ✅ Filtre par catégorie
4. ✅ Ajouter au panier
5. ✅ Modifier quantité
6. ✅ Formulaire contact
7. ✅ Newsletter

### Admin Dashboard

1. ✅ Login
2. ✅ Voir produits
3. ✅ Ajouter produit
4. ✅ Modifier stock
5. ✅ Voir commandes
6. ✅ Changer statut commande
7. ✅ Lire messages
8. ✅ Créer code promo
9. ✅ Voir stats

---

## 🔄 Workflow Développement

### Mode développement avec auto-reload

```bash
npm run dev
```

### Apporter des modifications

1. Éditer les fichiers (backend ou frontend)
2. Serveur redémarre automatiquement (grâce à nodemon)
3. Rafraîchir le navigateur pour les changements frontend

### Déboguer

```bash
# Activer les logs détaillés
DEBUG=* npm run dev

# Ou dans le code
console.log('Debug info:', variable);
```

---

## 🚀 Déploiement (Exemple: Heroku)

### 1. Créer un compte Heroku

```bash
# Installation Heroku CLI
npm install -g heroku

# Login
heroku login
```

### 2. Créer l'app

```bash
heroku create kyrace-app
```

### 3. Ajouter MongoDB Atlas

- Créer un cluster sur MongoDB Atlas
- Copier la connection string

### 4. Configurer les variables

```bash
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your_secret"
heroku config:set NODE_ENV="production"
```

### 5. Déployer

```bash
git push heroku main
```

---

## 📚 Ressources Supplémentaires

- **MongoDB Docs** : https://docs.mongodb.com/
- **Express Docs** : https://expressjs.com/
- **Mongoose Docs** : https://mongoosejs.com/
- **JWT Info** : https://jwt.io/

---

## 💬 Support

En cas de problème :

1. Vérifier les logs (console du terminal)
2. Vérifier MongoDB est lancé
3. Vérifier le `.env` est correctement configuré
4. Consulter la section Troubleshooting
5. Tester les endpoints API avec curl

---

**Installation terminée ? 🎉**

Vous pouvez maintenant :

- Développer de nouvelles fonctionnalités
- Importer vos vrais produits
- Customiser le design
- Déployer en production

Bon développement ! 🚀
