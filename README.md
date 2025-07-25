# Portfolio Bilingue – Fullstack React/Node.js

---

## 📝 Historique des modifications récentes
- Grille responsive pour les témoignages, suppression de la pagination fixe
- Notifications toast flottantes en haut à droite
- Suppression des réactions/likes sur les témoignages
- Nettoyage du code (suppression des variables/fonctions inutilisées)
- Expérience utilisateur responsive et moderne
- Amélioration du dashboard admin (UI, responsive, simplification)
- Sécurité renforcée (auth admin, vérification email)
- Correction de bugs et conformité ESLint
- **Évolution IA : intégration Gemini, prompt personnalisé, analyse IA admin, affichage enrichi, sécurité renforcée**

---

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://vercel.com/) [![Licence: MIT](https://img.shields.io/badge/Licence-MIT-blue.svg)](LICENSE)

Un portfolio professionnel, moderne et sécurisé, développé en **React** (frontend) et **Node.js/Express** (backend), avec stockage cloud (Upstash KV), admin protégé, gestion avancée des témoignages, chatbot IA, et support multilingue (français/anglais).

---

## 🗂️ Sommaire
- [Fonctionnalités](#fonctionnalités)
- [Démo](#démo)
- [Prérequis](#prérequis)
- [Installation & Lancement](#installation--lancement)
- [Configuration (environnements)](#configuration-environnements)
- [Structure du projet](#structure-du-projet)
- [Admin sécurisé](#admin-sécurisé)
- [Chatbot IA](#chatbot-ia)
- [Déploiement Vercel](#déploiement-vercel)
- [Technos](#technos)
- [Support](#support)
- [Licence](#licence)

---

## 🚀 Fonctionnalités principales (mise à jour)
- **Témoignages** :
  - Affichage en grille responsive (1 colonne mobile, 2-4 desktop)
  - Plus de pagination fixe : tous les témoignages sont visibles, triés du plus récent au plus ancien
  - Notifications toast flottantes en haut à droite pour les retours utilisateur (succès, erreur, etc.)
  - Formulaire d’ajout avec validation et feedback via toast
  - Vérification des témoignages par email (lien unique)
  - Expérience utilisateur moderne, responsive, sans débordement de texte
  - Réactions/likes supprimés pour simplification
  - Code nettoyé, plus de variables/fonctions inutilisées

---

## 📋 Prérequis
- Node.js 16+
- npm ou yarn
- Un compte [Vercel](https://vercel.com/) (pour le déploiement cloud)

---

## 🛠️ Installation & Lancement

1. **Cloner le projet**
   ```bash
   git clone https://github.com/ton-utilisateur/portfolio-bilingue.git
   cd portfolio-bilingue
   ```
2. **Installer les dépendances frontend & backend**
   ```bash
   cd portfolio-bilingue
   npm install
   cd backend
   npm install
   ```
3. **Configurer les variables d’environnement** (voir section ci-dessous)
4. **Lancer en local**
   - Frontend :
     ```bash
     cd portfolio-bilingue
     npm start
     ```
   - Backend :
     ```bash
     cd backend
     npm run dev
     ```

---

## ⚙️ Configuration (environnements)

Créer un fichier `.env` dans `backend/` avec :
```
PORT=8080
EMAILJS_SERVICE_ID=xxx
EMAILJS_TEMPLATE_ID=xxx
EMAILJS_USER_ID=xxx
EMAILJS_PRIVATE_KEY=xxx
ADMIN_PASSWORD=tonmotdepasseadmin
JWT_SECRET=unePhraseSecrèteUltraLongue
# Upstash KV (ajouté automatiquement par Vercel/Upstash)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```
- Les variables Upstash KV sont créées automatiquement lors de l’intégration sur Vercel.
- Les variables EmailJS sont à récupérer sur [emailjs.com](https://dashboard.emailjs.com/).

---

## 🏗️ Structure du projet

```
portfolio-bilingue/
├── backend/                # Backend Node.js/Express (API, stockage KV)
│   ├── server.js
│   ├── chatbot-logic.js
│   ├── .env
│   └── ...
├── public/                 # Fichiers publics (favicon, images, manifest)
├── src/
│   ├── components/         # Composants React (UI, admin, chatbot...)
│   ├── i18n.js             # Internationalisation
│   ├── App.js, App.css     # Entrée principale
│   └── ...
├── vercel.json             # Configuration déploiement Vercel
├── README.md
└── ...
```

---

## 🔐 Admin sécurisé
- **Accès** : `/admin` (login requis)
- **Protection JWT** : token stocké côté client, vérifié à chaque requête
- **Fonctionnalités** :
  - Voir, valider, refuser, supprimer les témoignages
  - Pagination, recherche, filtres, stats
  - Gérer la base de connaissances du chatbot (Q&A)
  - Voir les questions utilisateurs, ajouter une Q&A à partir d’une question
  - Statistiques avancées
- **Sécurité** : expiration du token, déconnexion auto, confirmation avant suppression

---

## 🤖 Chatbot IA
- **Base de connaissances Q&A** (éditable en admin)
- **Suggestions intelligentes** (levenshtein, synonymes, stopwords)
- **Apprentissage admin** : ajouter une Q&A à partir d’une question utilisateur
- **Statistiques d’utilisation**

---

## 🤖 Fonctionnalités IA (mise à jour)
- Chatbot IA basé sur Gemini (Google Generative Language)
- Prompt personnalisé : ne répond qu’aux questions sur Remus/le site, jamais sur la mythologie ou d’autres sujets
- Analyse IA personnalisée côté admin (questions, tendances, FAQ synthétique)
- Affichage enrichi et responsive des résultats IA dans l’admin
- Sécurité : prompt restrictif, clé API jamais exposée, accès admin protégé
- Nettoyage du code IA, conformité sécurité et UX

---

## 🛠️ Fonctionnalités UI témoignages
- Grille responsive sans pagination fixe
- Toasts flottants pour les notifications
- Formulaire avec validation et feedback immédiat
- Sécurité : vérification par email
- Expérience fluide sur mobile, tablette, desktop

---

## 🚀 Déploiement Vercel
- **Déploiement fullstack** (frontend + backend) via [Vercel](https://vercel.com/)
- **Stockage cloud Upstash KV** (scalable, rapide, sans maintenance)
- **Configuration automatique des variables d’environnement**
- **URL gratuite en `.vercel.app` ou domaine personnalisé**

---

## 🛠️ Technos
- **React** (frontend)
- **Node.js/Express** (backend)
- **Upstash KV** (stockage cloud)
- **EmailJS** (envoi d’emails)
- **JWT** (authentification admin)
- **CSS3** (UI/UX moderne, responsive)

---

## 📞 Support
- Ouvrez une issue sur GitHub pour toute question ou bug
- Contact : [remspc53@gmail.com]

---

## 📄 Licence
MIT – Utilisation et modification libres, même pour usage pro.

---

**Bon développement et bonne découverte du projet ! 🚀**
