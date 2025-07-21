# Portfolio Bilingue - Développeur Web & Informaticien Industriel

Un portfolio professionnel moderne et responsive, développé en React avec support multilingue (français/anglais).

## 🚀 Fonctionnalités

- **Design sobre et professionnel** adapté à l'industrie
- **Support multilingue** (français/anglais) avec détection automatique
- **Responsive design** pour tous les appareils
- **Sections complètes** : Accueil, À propos, Projets, Contact
- **Projets fictifs** adaptés à l'informatique industrielle
- **Navigation fluide** avec défilement automatique
- **Animations et transitions** modernes

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. **Cloner ou télécharger le projet**
   ```bash
   # Si vous avez git
   git clone [URL_DU_REPO]
   cd portfolio-bilingue
   
   # Ou simplement naviguer dans le dossier
   cd portfolio-bilingue
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   - Le site s'ouvre automatiquement sur `http://localhost:3000`
   - Si ce n'est pas le cas, ouvrez manuellement cette URL

## 🎨 Personnalisation

### Informations personnelles

1. **Modifier les traductions** dans `src/i18n.js`
2. **Remplacer les projets fictifs** dans `src/components/Projects.js`
3. **Mettre à jour les contacts** dans `src/components/Contact.js`

### Design

- **Couleurs** : Modifiez les variables CSS dans `src/App.css` (section `:root`)
- **Police** : Changez `font-family` dans `body`
- **Images** : Remplacez les emojis par vos propres images

### Exemple de personnalisation des contacts

```javascript
// Dans src/components/Contact.js
const contactInfo = [
  {
    type: 'email',
    label: t('contact.email'),
    value: 'votre-email@example.com', // ← Votre email
    icon: '📧',
    link: 'mailto:votre-email@example.com'
  },
  {
    type: 'linkedin',
    label: t('contact.linkedin'),
    value: 'linkedin.com/in/votre-profil', // ← Votre profil LinkedIn
    icon: '💼',
    link: 'https://linkedin.com/in/votre-profil'
  },
  // Ajoutez d'autres contacts...
];
```

## 🌐 Hébergement

### Option 1 : Vercel (Recommandé)

1. **Créer un compte** sur [vercel.com](https://vercel.com)
2. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```
3. **Déployer**
   ```bash
   vercel
   ```
4. **Suivre les instructions** pour connecter votre projet

### Option 2 : Netlify

1. **Créer un compte** sur [netlify.com](https://netlify.com)
2. **Glisser-déposer** le dossier `build` après `npm run build`
3. **Ou connecter** votre repository GitHub

### Option 3 : GitHub Pages

1. **Créer un repository** sur GitHub
2. **Pousser votre code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [URL_DU_REPO]
   git push -u origin main
   ```
3. **Activer GitHub Pages** dans les paramètres du repository
4. **Configurer** la source sur la branche `main` et le dossier `/docs`

### Option 4 : Firebase Hosting

1. **Installer Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```
2. **Initialiser Firebase**
   ```bash
   firebase login
   firebase init hosting
   ```
3. **Configurer** le dossier public sur `build`
4. **Déployer**
   ```bash
   npm run build
   firebase deploy
   ```

## 📦 Scripts disponibles

```bash
npm start          # Lance le serveur de développement
npm run build      # Crée une version de production
npm test           # Lance les tests
npm run eject      # Éjecte la configuration (irréversible)
```

## 🎯 Structure du projet

```
portfolio-bilingue/
├── public/                 # Fichiers publics
├── src/
│   ├── components/         # Composants React
│   │   ├── Navigation.js
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Projects.js
│   │   ├── Contact.js
│   │   └── Footer.js
│   ├── i18n.js            # Configuration multilingue
│   ├── App.js             # Composant principal
│   ├── App.css            # Styles principaux
│   └── index.js           # Point d'entrée
├── package.json           # Dépendances et scripts
└── README.md             # Ce fichier
```

## 🔧 Technologies utilisées

- **React** - Framework JavaScript
- **react-i18next** - Gestion multilingue
- **CSS3** - Styles et animations
- **HTML5** - Structure sémantique

## 📱 Responsive Design

Le portfolio s'adapte automatiquement à :
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (< 768px)

## 🚀 Optimisations

- **Performance** : Code optimisé et images compressées
- **SEO** : Métadonnées et structure sémantique
- **Accessibilité** : Navigation clavier et lecteurs d'écran
- **Sécurité** : Liens externes sécurisés

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la console du navigateur pour les erreurs
2. Assurez-vous que toutes les dépendances sont installées
3. Redémarrez le serveur de développement

## 📄 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser et de le modifier selon vos besoins.

---

**Bon développement ! 🎉**
