# Configuration EmailJS pour l'envoi d'emails de vérification

## 📧 Configuration EmailJS

### 1. Créer un compte EmailJS
1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit
3. Vérifiez votre email

### 2. Configurer un service email
1. Dans votre dashboard EmailJS, allez dans "Email Services"
2. Cliquez sur "Add New Service"
3. Choisissez votre fournisseur email (Gmail, Outlook, etc.)
4. Suivez les instructions pour autoriser EmailJS
5. Notez votre **Service ID** (ex: `service_abc123`)

### 3. Créer un template d'email
1. Allez dans "Email Templates"
2. Cliquez sur "Create New Template"
3. Configurez le template avec les variables suivantes :

#### Variables du template :
```
{{to_email}} - Email du destinataire
{{to_name}} - Nom du destinataire
{{name}} - Nom de la personne
{{position}} - Poste de la personne
{{company}} - Entreprise (ou "Non spécifié")
{{rating}} - Note donnée (1-5)
{{message}} - Contenu du témoignage
{{verification_link}} - Lien de vérification
{{subject}} - Sujet de l'email
```

#### Exemple de template HTML :
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vérification de témoignage</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e90ff;">Vérification de témoignage - DSONKOUAT Remus</h2>
        
        <p>Bonjour {{name}},</p>
        
        <p>Vous avez soumis un témoignage sur le portfolio de DSONKOUAT Remus Herlandes.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Détails du témoignage :</h3>
            <ul>
                <li><strong>Nom :</strong> {{name}}</li>
                <li><strong>Poste :</strong> {{position}}</li>
                <li><strong>Entreprise :</strong> {{company}}</li>
                <li><strong>Note :</strong> {{rating}}/5</li>
                <li><strong>Message :</strong> {{message}}</li>
            </ul>
        </div>
        
        <p>Pour publier votre témoignage, veuillez cliquer sur le bouton suivant :</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{verification_link}}" 
               style="background: #1e90ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Vérifier mon témoignage
            </a>
        </div>
        
        <p style="font-size: 14px; color: #666;">
            Ce lien expire dans 7 jours.<br>
            Si vous n'avez pas soumis ce témoignage, vous pouvez ignorer cet email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #666;">
            Cordialement,<br>
            Portfolio DSONKOUAT Remus Herlandes
        </p>
    </div>
</body>
</html>
```

4. Notez votre **Template ID** (ex: `template_xyz789`)

### 4. Obtenir votre Public Key
1. Dans votre dashboard EmailJS, allez dans "Account" > "API Keys"
2. Copiez votre **Public Key** (ex: `user_abc123def456`)

### 5. Configurer le fichier emailConfig.js
1. Ouvrez le fichier `src/emailConfig.js`
2. Remplacez les valeurs par vos vraies données :

```javascript
export const emailConfig = {
  serviceId: 'service_kjwjyqw',        // <-- VOTRE NOUVEAU SERVICE ID
  templateId: 'VOTRE_TEMPLATE_ID',     // à compléter
  publicKey: 'VOTRE_PUBLIC_KEY',       // à compléter
  adminEmail: 'dsonkouatremus@gmail.com',
  baseUrl: window.location.origin + window.location.pathname
};
```

### 6. Installer les dépendances
```bash
npm install
```

### 7. Tester l'envoi d'emails
1. Démarrez votre application : `npm start`
2. Allez dans la section "Témoignages"
3. Soumettez un témoignage avec votre vraie adresse email
4. Vérifiez votre boîte email pour le lien de vérification

## 🔧 Dépannage

### Erreur Gmail API : "Request had insufficient authentication scopes"

Cette erreur est courante avec Gmail. Voici les solutions :

#### Solution 1 : Réautoriser Gmail
1. Allez dans votre dashboard EmailJS
2. Supprimez le service Gmail existant
3. Recréez le service Gmail
4. **Important** : Assurez-vous d'accepter TOUTES les autorisations demandées
5. Vérifiez que vous êtes connecté avec le bon compte Gmail

#### Solution 2 : Utiliser un autre service email
Si Gmail continue à poser problème, utilisez une alternative :

**Outlook/Hotmail :**
1. Créez un nouveau service EmailJS
2. Choisissez "Outlook"
3. Connectez-vous avec votre compte Microsoft
4. Autorisez EmailJS

**Yahoo Mail :**
1. Créez un nouveau service EmailJS
2. Choisissez "Yahoo"
3. Connectez-vous avec votre compte Yahoo
4. Autorisez EmailJS

**SMTP personnalisé :**
1. Créez un nouveau service EmailJS
2. Choisissez "Custom SMTP"
3. Configurez avec les paramètres de votre fournisseur email

#### Solution 3 : Vérifier les paramètres Gmail
1. Allez dans [Google Account Settings](https://myaccount.google.com/)
2. Sécurité > Connexions tierces
3. Vérifiez qu'EmailJS a les autorisations nécessaires
4. Si nécessaire, révoquez et réautorisez

#### Solution 4 : Utiliser un compte Gmail dédié
1. Créez un nouveau compte Gmail spécifiquement pour EmailJS
2. Activez l'authentification à 2 facteurs
3. Générez un mot de passe d'application
4. Utilisez ce compte pour configurer EmailJS

### EmailJS non configuré
Si vous voyez le message "⚠️ EmailJS non configuré", cela signifie que les valeurs dans `emailConfig.js` n'ont pas été mises à jour. Le système fonctionnera en mode local avec des liens de test dans la console.

### Erreur d'envoi d'email
- Vérifiez que votre Service ID, Template ID et Public Key sont corrects
- Assurez-vous que votre service email est bien configuré et autorisé
- Vérifiez que les variables du template correspondent à celles utilisées dans le code

### Liens de vérification
En mode local, les liens de vérification s'affichent dans la console du navigateur (F12). En mode EmailJS configuré, les vrais emails sont envoyés avec les liens de vérification.

## 🚀 Solutions alternatives

### Option 1 : Service SMTP gratuit
- **SendGrid** : 100 emails/jour gratuit
- **Mailgun** : 5,000 emails/mois gratuit
- **Mailjet** : 200 emails/jour gratuit

### Option 2 : Backend simple
Si EmailJS pose trop de problèmes, vous pouvez créer un backend simple avec :
- **Node.js + Nodemailer**
- **Python + Flask + SMTP**
- **PHP + PHPMailer**

### Option 3 : Service de formulaires
- **Formspree** : Redirige les soumissions vers votre email
- **Netlify Forms** : Si vous déployez sur Netlify
- **Google Forms** : Intégration simple

## 📋 Fonctionnalités

### Mode local (EmailJS non configuré)
- ✅ Soumission de témoignages
- ✅ Validation des données
- ✅ Liens de vérification dans la console
- ✅ Persistance dans localStorage

### Mode EmailJS configuré
- ✅ Envoi d'emails réels
- ✅ Templates d'email personnalisés
- ✅ Liens de vérification fonctionnels
- ✅ Gestion des erreurs d'envoi
- ✅ Toutes les fonctionnalités du mode local

## 🔒 Sécurité

- Les emails de vérification contiennent uniquement les informations du témoignage
- Les liens de vérification sont uniques et liés à chaque témoignage
- Les données sont stockées localement dans le navigateur
- Aucune donnée sensible n'est transmise à des tiers

## 📞 Support

Pour toute question sur la configuration EmailJS, consultez leur documentation officielle : [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)

### Contact EmailJS
- Email : support@emailjs.com
- Documentation : [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Forum communautaire : [https://www.emailjs.com/community/](https://www.emailjs.com/community/) 