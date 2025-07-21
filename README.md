# Portfolio Bilingue – Fullstack React/Node.js

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

## 🚀 Fonctionnalités
- **Frontend React** moderne, responsive, multilingue (fr/en)
- **Backend Node.js/Express** (API REST, stockage cloud Upstash KV)
- **Admin sécurisé** (login JWT, dashboard, gestion avancée)
- **Gestion des témoignages** (validation, refus, suppression, stats, pagination)
- **Chatbot IA** (Q&A, suggestions, apprentissage admin, stats)
- **Notifications visuelles, pagination, filtres, recherche**
- **SEO optimisé, accessibilité, performance**

---

## 🎬 Démo
- [Démo en ligne (Vercel)](https://portfolio-xxxxxx.vercel.app)

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
