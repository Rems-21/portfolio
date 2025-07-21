# 🔧 Résolution de l'erreur "The recipients address is empty"

## 🚨 Problème identifié

L'erreur `422 (Unprocessable Content)` avec le message "The recipients address is empty" indique que le template EmailJS ne reçoit pas correctement l'adresse email du destinataire.

## 🔍 Diagnostic

D'après les logs, les paramètres sont bien envoyés :
```javascript
{
  to_email: 'remspc53@gmail.com',
  to_name: 'gojo',
  from_name: 'DSONKOUAT Remus Portfolio',
  reply_to: 'dsonkouatremus@gmail.com',
  name: 'gojo',
  position: 'Test',
  company: 'Test Company',
  rating: '5',
  message: 'Test message',
  verification_link: 'https://...'
}
```

## 🛠️ Solution : Configuration du Template EmailJS

### **Étape 1 : Accéder au Template**

1. Connectez-vous à [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Allez dans **"Email Templates"**
3. Trouvez votre template `template_xfyk2ig`
4. Cliquez sur **"Edit"**

### **Étape 2 : Configurer les champs d'envoi**

#### **IMPORTANT** : Dans la section "Email Settings", configurez :

**Champ "To:"**
```
{{to_email}}
```

**Champ "From:"**
```
{{from_name}}
```

**Champ "Reply-To:"**
```
{{reply_to}}
```

**Champ "Subject:"**
```
Vérification de témoignage - DSONKOUAT Remus
```

### **Étape 3 : Contenu du Template**

#### **Version Texte (Email Content) :**
```
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

#### **Version HTML (Email Content) :**
```html
cliquez sur le bouton ci-dessous :</p>
        
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

### **Étape 4 : Vérifications importantes**

#### **✅ Points à vérifier :**

1. **Champ "To:"** doit contenir exactement `{{to_email}}`
2. **Variables** doivent être entourées de doubles accolades `{{variable}}`
3. **Pas d'espaces** avant ou après les variables
4. **Sauvegardez** le template après modification

#### **❌ Erreurs courantes :**

- `{{ to_email }}` (avec espaces) ❌
- `{to_email}` (accolades simples) ❌
- `to_email` (sans accolades) ❌
- `{{to_email}}` (correct) ✅

### **Étape 5 : Test du Template**

1. **Sauvegardez** le template
2. **Testez** avec le formulaire de témoignage
3. **Vérifiez** l<!DOCTYPE html>
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
        
        <p>Pour vérifier et publier ce témoignage, es logs dans la console
4. **Contrôlez** votre boîte email

## 🔧 Configuration Alternative

Si le problème persiste, essayez cette configuration alternative :

### **Champ "To:"**
```
{{to_email}}
```

### **Champ "From:"**
```
DSONKOUAT Remus Portfolio <dsonkouatremus@gmail.com>
```

### **Champ "Reply-To:"**
```
dsonkouatremus@gmail.com
```

## 📧 Variables disponibles

Le code envoie ces variables exactes :
- `{{to_email}}` - Email du destinataire
- `{{to_name}}` - Nom du destinataire
- `{{from_name}}` - Nom de l'expéditeur
- `{{reply_to}}` - Email de réponse
- `{{name}}` - Nom du témoin
- `{{position}}` - Poste du témoin
- `{{company}}` - Entreprise du témoin
- `{{rating}}` - Note (1-5)
- `{{message}}` - Contenu du témoignage
- `{{verification_link}}` - Lien de vérification

## 🚀 Après la correction

1. **Sauvegardez** le template
2. **Testez** le formulaire
3. **Vérifiez** que l'email arrive
4. **Cliquez** sur le lien de vérification

## 💡 Conseils supplémentaires

- **Vérifiez** que le service Outlook est actif
- **Contrôlez** les permissions d'envoi
- **Testez** avec différents emails
- **Vérifiez** le dossier spam

Le problème devrait être résolu après avoir correctement configuré le champ "To:" avec `{{to_email}}` dans votre template EmailJS. 