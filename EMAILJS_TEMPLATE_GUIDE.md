# Guide de Configuration EmailJS avec Outlook

## Configuration du Service EmailJS

### 1. Service EmailJS
- **Service ID** : `service_nup3ddy` (Service Outlook)
- **Type** : Service Outlook/Hotmail

### 2. Configuration requise dans emailConfig.js
```javascript
const emailConfig = {
  serviceId: 'service_nup3ddy', // Service Outlook
  templateId: 'template_xfyk2ig', // Votre Template ID
  publicKey: 'wtZB4UMvwc_NBbhLt', // Votre Public Key
  adminEmail: 'dsonkouatremus@gmail.com', // Votre email
  templateVariables: {
    from_name: 'DSONKOUAT Remus Portfolio',
    reply_to: 'dsonkouatremus@gmail.com'
  }
};
```

### 3. Variables du Template EmailJS pour Outlook

#### Variables OBLIGATOIRES pour le service Outlook :
- `to_email` : Email du destinataire (OBLIGATOIRE)
- `to_name` : Nom du destinataire
- `from_name` : Nom de l'expéditeur
- `reply_to` : Email de réponse

#### Variables spécifiques aux témoignages :
- `name` : Nom complet du témoin
- `position` : Poste du témoin
- `company` : Entreprise du témoin
- `rating` : Note (1-5)
- `message` : Contenu du témoignage
- `verification_link` : Lien de vérification

### 4. Template EmailJS Complet pour Outlook

#### Configuration du template dans EmailJS Dashboard :

1. **Allez dans EmailJS Dashboard** → Email Templates
2. **Trouvez votre template** `template_xfyk2ig`
3. **Cliquez sur "Edit"**

#### Version Texte (Email Content) :
```
To: {{to_email}}
From: {{from_name}}
Reply-To: {{reply_to}}
Subject: Vérification de témoignage - DSONKOUAT Remus

Bonjour {{to_name}},

Vous avez soumis un témoignage pour le portfolio de DSONKOUAT Remus Herlandes.

Détails du témoignage :
- Nom : {{name}}
- Poste : {{position}}
- Entreprise : {{company}}
- Note : {{rating}}/5
- Message : {{message}}

Pour vérifier et publier ce témoignage, cliquez sur le lien suivant :
{{verification_link}}

Si vous n'avez pas soumis ce témoignage, ignorez cet email.

Cordialement,
{{from_name}}

Email de réponse : {{reply_to}}
```

#### Version HTML (Email Content) :
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vérification de Témoignage</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Bonjour {{to_name}},</h2>
        
        <p>Vous avez soumis un témoignage pour le portfolio de <strong>DSONKOUAT Remus Herlandes</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #495057;">Détails du témoignage :</h3>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Nom :</strong> {{name}}</li>
                <li><strong>Poste :</strong> {{position}}</li>
                <li><strong>Entreprise :</strong> {{company}}</li>
                <li><strong>Note :</strong> {{rating}}/5</li>
                <li><strong>Message :</strong> {{message}}</li>
            </ul>
        </div>
        
        <p>Pour vérifier et publier ce témoignage, cliquez sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{verification_link}}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Vérifier le Témoignage
            </a>
        </div>
        
        <p style="font-size: 14px; color: #6c757d;">
            Si vous n'avez pas soumis ce témoignage, ignorez cet email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6c757d;">
            Cordialement,<br>
            <strong>{{from_name}}</strong><br>
            Email de réponse : {{reply_to}}
        </p>
    </div>
</body>
</html>
```

### 5. Configuration du Service Outlook

1. **Dans EmailJS Dashboard** :
   - Allez dans "Email Services"
   - Sélectionnez le service `service_nup3ddy`
   - Vérifiez que le service Outlook est bien configuré

2. **Paramètres du service** :
   - Assurez-vous que l'email Outlook est vérifié
   - Vérifiez les permissions d'envoi

### 6. Test de Configuration

Après avoir configuré le template, testez en :
1. Remplissant le formulaire de témoignage
2. Vérifiant que l'email arrive dans votre boîte
3. Cliquant sur le lien de vérification

### 7. Dépannage

**Erreur "The 3rd parameter is expected to be the HTML form element"** :
- ✅ **RÉSOLU** : Utilisez uniquement `emailjs.send()` avec les paramètres
- ❌ Ne pas utiliser `emailjs.sendForm()` avec FormData

**Erreur "recipients address is empty"** :
- Vérifiez que `to_email` est bien défini dans le template
- Assurez-vous que l'email n'est pas vide dans les paramètres

**Erreur d'authentification** :
- Vérifiez votre clé publique EmailJS
- Assurez-vous que le service Outlook est actif

**Emails non reçus** :
- Vérifiez le dossier spam
- Contrôlez les logs dans la console du navigateur

### 8. Variables envoyées par le code

Le code envoie ces variables exactes :
```javascript
{
  to_email: "email@example.com",
  to_name: "Nom du témoin",
  from_name: "DSONKOUAT Remus Portfolio",
  reply_to: "dsonkouatremus@gmail.com",
  name: "Nom du témoin",
  position: "Poste",
  company: "Entreprise",
  rating: "5",
  message: "Contenu du témoignage",
  verification_link: "https://..."
}
```

## 🚨 Problème : "The recipients address is empty"

Cette erreur indique que le template EmailJS ne reçoit pas correctement l'adresse email du destinataire.

## 🔧 Solution : Configuration correcte du template

### 1. Accédez à votre template EmailJS

1. Connectez-vous à [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Allez dans "Email Templates"
3. Trouvez votre template `template_xfyk2ig`
4. Cliquez sur "Edit"

### 2. Configuration du template

#### **IMPORTANT** : Le template doit contenir ces variables exactes :

```html
To: {{to_email}}
From: {{from_name}}
Reply-To: {{reply_to}}
Subject: Vérification de témoignage - DSONKOUAT Remus

Bonjour {{to_name}},

Vous avez soumis un témoignage sur le portfolio de DSONKOUAT Remus Herlandes.

Détails du témoignage :
- Nom : {{name}}
- Poste : {{position}}
- Entreprise : {{company}}
- Note : {{rating}}/5
- Message : {{message}}

Pour publier votre témoignage, veuillez cliquer sur le lien suivant :
{{verification_link}}

Ce lien expire dans 7 jours.

Si vous n'avez pas soumis ce témoignage, vous pouvez ignorer cet email.

Cordialement,
{{from_name}}
```

### 3. Variables obligatoires

**Variables qui DOIVENT être présentes dans votre template :**
- `{{to_email}}` - **OBLIGATOIRE** pour l'adresse du destinataire
- `{{from_name}}` - Nom de l'expéditeur
- `{{reply_to}}` - Email de réponse
- `{{to_name}}` - Nom du destinataire
- `{{name}}` - Nom de la personne
- `{{position}}` - Poste de la personne
- `{{company}}` - Entreprise
- `{{rating}}` - Note donnée
- `{{message}}` - Contenu du témoignage
- `{{verification_link}}` - Lien de vérification

### 4. Test du template

1. **Dans EmailJS Dashboard** :
   - Allez dans "Email Templates"
   - Trouvez votre template
   - Cliquez sur "Test"
   - Remplissez les variables de test :
     - `to_email`: votre email
     - `to_name`: votre nom
     - `name`: "Test User"
     - `position`: "Test Position"
     - `company`: "Test Company"
     - `rating`: "5"
     - `message`: "Test message"
     - `verification_link`: "https://example.com/test"
   - Cliquez sur "Send Test"

2. **Vérifiez que l'email de test arrive** avec toutes les informations

### 5. Configuration alternative du template

Si le problème persiste, essayez cette configuration simplifiée :

```html
To: {{to_email}}
Subject: Vérification de témoignage

Bonjour {{name}},

Vous avez soumis un témoignage sur le portfolio de DSONKOUAT Remus Herlandes.

Pour publier votre témoignage, cliquez ici : {{verification_link}}

Cordialement,
DSONKOUAT Remus Portfolio
```

### 6. Vérification du service email

1. **Allez dans "Email Services"**
2. **Vérifiez que votre service est actif**
3. **Testez l'envoi d'un email simple** depuis le dashboard
4. **Vérifiez les limites** de votre compte (200 emails/mois gratuit)

### 7. Debugging

Si le problème persiste, vérifiez dans la console du navigateur :

1. **Ouvrez la console** (F12)
2. **Soumettez un témoignage**
3. **Regardez les logs** :
   - Configuration EmailJS
   - Paramètres envoyés
   - Erreurs détaillées

### 8. Solution de contournement

Si EmailJS continue à poser problème, vous pouvez :

1. **Utiliser le mode local** (liens dans la console)
2. **Configurer Formspree** (alternative plus simple)
3. **Créer un backend simple** avec Node.js + Nodemailer

## 📞 Support EmailJS

- **Documentation** : [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- **Support** : support@emailjs.com
- **Forum** : [https://www.emailjs.com/community/](https://www.emailjs.com/community/)

## ✅ Checklist de vérification

- [ ] Template contient `{{to_email}}`
- [ ] Service email est actif
- [ ] Template testé avec succès
- [ ] Limites du compte respectées
- [ ] Variables correctement nommées
- [ ] Pas d'erreurs dans la console 