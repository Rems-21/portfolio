# OUTILS, BIBLIOTHÈQUES ET ALGORITHMES DU PORTFOLIO

## Frameworks & Librairies principales

- **React** (`react`) : Framework JavaScript pour la création d'interfaces utilisateur interactives et réactives.
- **React DOM** (`react-dom`) : Rendu des composants React dans le DOM.
- **react-i18next** (`react-i18next`) : Bibliothèque de gestion de l'internationalisation (i18n) pour React, permettant le support multilingue (français/anglais).

## Outils de build et de développement

- **Babel** (`@babel/core`, `babel-loader`, etc.) : Transpileur JavaScript permettant d'utiliser les dernières fonctionnalités du langage tout en assurant la compatibilité navigateur.
- **ESLint** (`eslint`) : Outil d'analyse statique pour garantir la qualité et la cohérence du code JavaScript/React.
- **npm** (`npm`) : Gestionnaire de paquets pour installer et gérer les dépendances du projet.
- **Webpack** (`webpack`, `webpack-cli`) : (si utilisé) Bundler pour la construction du projet React.
- **Jest** (`jest`) : (si utilisé) Framework de tests unitaires pour JavaScript/React.

## Algorithmes et logiques personnalisées

- **Matching par mots-clés (fuzzy matching)** :
  - Permet de retrouver la réponse la plus pertinente dans la base de questions/réponses du chatbot, même en cas de fautes de frappe ou de variations d'écriture.
  - Utilise l'extraction de mots-clés en supprimant les mots vides (stopwords) selon la langue.

- **Distance de Levenshtein** :
  - Algorithme de calcul de la distance minimale (nombre de modifications) entre deux chaînes de caractères.
  - Utilisé pour tolérer les fautes de frappe dans les mots-clés lors de la recherche de réponse dans le chatbot.

- **Recherche intelligente multilingue** :
  - Le chatbot détecte la langue de l'utilisateur (français/anglais) et adapte ses réponses et la recherche de mots-clés en conséquence.

- **Gestion des stopwords** :
  - Liste de mots vides pour chaque langue, ignorés lors de l'extraction des mots-clés.

- **Gestion de la base de données locale (messagerie)** :
  - Tableau JavaScript de 300 questions/réponses bilingues, chaque entrée associée à des mots-clés pour un matching rapide.

- **Gestion du style sombre (dark mode)** :
  - Application d'une palette sombre cohérente avec le portfolio (bleu foncé, bleu clair, blanc atténué).

- **Gestion du responsive/mobile** :
  - Adaptation automatique de la fenêtre du chatbot et du bouton flottant sur mobile et desktop.

- **Gestion de l'accessibilité** :
  - Utilisation d'attributs `aria-label` pour les boutons, navigation clavier possible.

- **Gestion du multilingue dans la messagerie** :
  - Switch dynamique de langue (FR/EN) dans l'interface du chatbot, avec réinitialisation du contexte.

- **Gestion des messages (messagerie)** :
  - Utilisation de l'état React pour stocker la liste des messages (auteur, texte, langue).
  - Scroll automatique vers le bas à chaque nouveau message.
  - Focus automatique sur le champ de saisie lors de l'ouverture du chat.
  - Réinitialisation du chat lors du changement de langue.

- **Gestion de la structure des messages** :
  - Chaque message contient l'auteur (bot/user), la langue, le texte.

- **Gestion de la personnalisation du style** :
  - Utilisation de styles inline pour un contrôle précis (dark, border-radius, ombres, couleurs, etc.).

- **Gestion de l'animation** :
  - Animation CSS (keyframes) pour l'ouverture du chat et la pulsation du bouton flottant.

- **Gestion du bouton d'envoi** :
  - Bouton rond avec icône SVG (avion papier), accessible au clavier.

- **Gestion de la fermeture du chat** :
  - Bouton croix pour fermer la fenêtre du chatbot.

- **Gestion des placeholders dynamiques** :
  - Placeholder du champ de saisie adapté à la langue sélectionnée.

- **Gestion de la performance** :
  - Matching rapide sur 300 questions/réponses grâce à une structure optimisée.

---

Ce document recense tous les outils, bibliothèques (avec leur nom npm), algorithmes et logiques qui rendent ce portfolio interactif, multilingue, intelligent et accessible, y compris pour la messagerie/chatbot. 