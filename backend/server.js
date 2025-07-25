const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { kv } = require('@vercel/kv'); // Importation de Vercel KV

const app = express();
const PORT = process.env.PORT || 8080;

// Les noms de fichiers ne servent plus qu'à l'initialisation
const path = require('path');
const fs = require('fs');
const INITIAL_TESTIMONIALS_FILE = path.join(__dirname, 'testimonials.json');
const INITIAL_QA_DATABASE_FILE = path.join(__dirname, 'qa-database.json');


// --- Configuration CORS ---
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', `https://${process.env.VERCEL_URL}`],
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());

// --- Middleware de vérification du jeton JWT ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (token == null) return res.sendStatus(401); // Pas de jeton

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Jeton invalide
        req.user = user;
        next(); // Passe à la route protégée
    });
};

// --- Route de connexion pour l'admin ---
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    // Pour une config simple, on compare directement le mot de passe du .env
    // Pour une meilleure sécurité, on devrait le hacher avec bcrypt
    if (password === process.env.ADMIN_PASSWORD) {
        const accessToken = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ accessToken });
    } else {
        res.status(401).json({ error: 'Mot de passe incorrect.' });
    }
});


// --- ROUTE SPECIALE D'INITIALISATION ---
// Appelle cette route UNE SEULE FOIS pour charger les données des fichiers JSON dans Vercel KV
app.post('/api/setup-initial-data', async (req, res) => {
  try {
    const testimonialsData = JSON.parse(fs.readFileSync(INITIAL_TESTIMONIALS_FILE, 'utf-8'));
    const qaData = JSON.parse(fs.readFileSync(INITIAL_QA_DATABASE_FILE, 'utf-8'));

    // On utilise un pipeline pour plus d'efficacité
    const pipeline = kv.pipeline();
    pipeline.set('testimonials', testimonialsData);
    pipeline.set('qa_database', qaData);
    pipeline.set('chatbot_questions', []); // Initialise une liste vide pour les questions
    await pipeline.exec();

    res.status(200).json({ success: true, message: 'Données initiales chargées avec succès dans Vercel KV.' });
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de l'initialisation." });
  }
});


// --- Routes d'administration protégées ---

// --- Suppression des routes liées à la base de connaissance Q&A et à la gestion admin des Q&A/questions posées ---
// Les routes suivantes sont supprimées :
// - /api/chatbot-qa
// - /api/admin/chatbot-qa
// - /api/chatbot-questions
// - /api/admin/chatbot-qa/:index
// - /api/admin/chatbot/stats
// Toute référence à qa_database et chatbot_questions dans Vercel KV est supprimée.

// --- GESTION AVANCÉE DES TÉMOIGNAGES (ADMIN) ---

// Récupérer tous les témoignages (protégé)
app.get('/api/admin/testimonials', authenticateToken, async (req, res) => {
  try {
    const testimonials = await kv.get('testimonials') || [];
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Valider ou refuser un témoignage (protégé)
app.put('/api/admin/testimonials/:id/validate', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status: 'validated' | 'refused' | 'pending'
  try {
    const testimonials = await kv.get('testimonials') || [];
    const idx = testimonials.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Témoignage introuvable.' });
    if (status === 'validated') testimonials[idx].verified = true;
    else if (status === 'refused') testimonials[idx].verified = false;
    testimonials[idx].status = status;
    await kv.set('testimonials', testimonials);
    res.json({ success: true, message: 'Statut du témoignage mis à jour.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Supprimer un témoignage (protégé)
app.delete('/api/admin/testimonials/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    let testimonials = await kv.get('testimonials') || [];
    const idx = testimonials.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Témoignage introuvable.' });
    testimonials.splice(idx, 1);
    await kv.set('testimonials', testimonials);
    res.json({ success: true, message: 'Témoignage supprimé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Statistiques sur les témoignages (protégé)
app.get('/api/admin/testimonials/stats', authenticateToken, async (req, res) => {
  try {
    const testimonials = await kv.get('testimonials') || [];
    const total = testimonials.length;
    const validated = testimonials.filter(t => t.verified).length;
    const refused = testimonials.filter(t => t.status === 'refused').length;
    const pending = testimonials.filter(t => !t.verified && t.status !== 'refused').length;
    // Stats par mois
    const byMonth = {};
    testimonials.forEach(t => {
      const month = t.date ? t.date.slice(0,7) : 'unknown';
      byMonth[month] = (byMonth[month] || 0) + 1;
    });
    res.json({ total, validated, refused, pending, byMonth });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.send('Backend for portfolio is running!');
});

// --- Routes publiques ---

// Récupérer tous les témoignages validés
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await kv.get('testimonials') || [];
    const verified = testimonials.filter(t => t.verified);
    res.json(verified);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Soumettre un nouveau témoignage et envoyer un email de vérification
app.post('/api/testimonials', async (req, res) => {
  const { name, position, company, rating, message, email } = req.body;
  if (!name || !message || !email) {
    return res.status(400).json({ error: 'Nom, message et email sont obligatoires.' });
  }

  // Vérification anti-doublon côté backend
  const testimonials = await kv.get('testimonials') || [];
  if (testimonials.some(t => t.email && t.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Un témoignage avec cet email existe déjà.' });
  }

  const newTestimonial = {
    id: uuidv4(), name, position, company, rating, message, email,
    verified: false, date: new Date().toISOString(),
    reactions: {} // Ajout du champ reactions
  };

  try {
    testimonials.push(newTestimonial);
    await kv.set('testimonials', testimonials);

    // --- Logique d'envoi d'email ---
    const verificationLink = `https://${process.env.VERCEL_URL}/api/testimonials/verify/${newTestimonial.id}`;
    
    const emailData = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_USER_ID,
      accessToken: process.env.EMAILJS_PRIVATE_KEY, // Utilisation de la clé privée pour l'API REST
      template_params: {
        to_name: name,
        to_email: email, // Assure-toi que ton template a une variable pour l'email du destinataire
        from_name: 'DSONKOUAT Remus Herlandes',
        verification_link: verificationLink,
        // Ajoute d'autres variables si ton template en a besoin
        name,
        position,
        company,
        rating,
        message,
      }
    };

    try {
      await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData);
      res.status(201).json({ success: true, message: 'Témoignage soumis. Un email de vérification a été envoyé.' });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError.response ? emailError.response.data : emailError.message);
      // Même si l'email échoue, le témoignage est sauvegardé.
      res.status(500).json({ success: false, message: "Le témoignage a été sauvegardé, mais l'envoi de l'email de vérification a échoué." });
    }

  } catch (error) {
    console.error("Erreur KV ou EmailJS:", error);
    res.status(500).json({ success: false, message: "Erreur lors de la sauvegarde ou de l'envoi de l'email." });
  }
});

// Vérifier un témoignage (validation par lien)
app.get('/api/testimonials/verify/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const testimonials = await kv.get('testimonials') || [];
    const idx = testimonials.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).send('<h1>Témoignage introuvable</h1>');
    
    testimonials[idx].verified = true;
    await kv.set('testimonials', testimonials);

    res.redirect(`https://${process.env.VERCEL_URL}/testimonialConfirmation`);
  } catch (error) {
    res.status(500).send('<h1>Erreur serveur</h1>');
  }
});

// --- Nouvelle route pour interroger le chatbot ---
app.post('/api/ask-chatbot', async (req, res) => {
  const { question, lang, userId } = req.body;
  if (!question) return res.status(400).json({ error: 'Question requise.' });

  // Enregistrer la question pour analyse future
  try {
    const userQuestions = await kv.get('user_questions') || [];
    userQuestions.push({
      question: question.trim(),
      timestamp: new Date().toISOString(),
      userId: userId || null
    });
    await kv.set('user_questions', userQuestions);
  } catch (e) {
    console.error('Erreur lors de la sauvegarde de la question utilisateur:', e);
  }

  try {
    // NOUVEAU PROMPT POUR GEMINI
    const chatbotPrompt = `IMPORTANT : Tu ne dois JAMAIS faire référence à un autre Remus que le propriétaire de ce site (DSONKOUAT Remus Herlandes, designer graphique, développeur web, informaticien industriel et expert en automatisme basé à Douala, Cameroun). Ignore toute question sur d'autres Remus, y compris le Remus de la mythologie ou tout autre Remus célèbre ou fictif. Si la question ne concerne pas le propriétaire de ce site, ses activités, ses services, ses compétences, ou le contenu de ce site, refuse poliment de répondre et invite à poser une question sur ces sujets. N'utilise jamais d'informations sur d'autres Remus, même si l'utilisateur insiste ou reformule.

Tu es RemsBot, l’assistant IA officiel (et un peu rigolo) du portfolio de Remus, propriétaire de ce site.

Tes super-pouvoirs :
- Répondre avec humour et clarté aux questions sur le parcours, les compétences, les projets, les services et l’expérience de Remus (le propriétaire de ce site).
- Expliquer de façon simple et amusante les domaines dans lesquels Remus réalise ses projets.
- Aider les visiteurs à comprendre le contenu du site, à naviguer, ou à contacter Remus, toujours avec une touche de bonne humeur.
- Fournir des réponses claires, concises, professionnelles, mais toujours avec une pointe d’humour ou une blague légère.
- T’exprimer dans la langue de la question (français ou anglais).
- Utilise uniquement les informations ci-dessus pour répondre. Si la question ne concerne pas Remus (le propriétaire de ce site), son portfolio, ses services, ses domaines d’expertise ou le contenu du site, NE RÉPONDS PAS à la question. Dis poliment que tu ne peux répondre que sur Remus (le propriétaire de ce site) ou son site, et invite à poser une question sur ces sujets.

Exemples :
Q : Que fait Remus ?
R : Remus réalise des projets en design graphique, développement web, automatisme industriel, impression, personnalisation d’objets (tasses, mugs, etc.), agrandissement photo et infographie en général.

Q : Où se trouve Remus ?
R : Remus est basé à Douala, la capitale économique du Cameroun.

Q : Quels langages maîtrise Remus ?
R : Remus maîtrise JavaScript, Python, C/C++, et un peu de Bash.

Q : Quels sont les services proposés par Remus ?
R : Remus propose la création de sites web, le design graphique, l’automatisation industrielle, l’impression, la personnalisation d’objets, l’agrandissement photo, etc.

Q : Peux-tu me parler du Remus de la mythologie ?
R : Désolé, je ne peux répondre qu’aux questions concernant Remus, le propriétaire de ce site, ses services ou ses domaines d’expertise. Pose-moi une question sur Remus (le propriétaire de ce site) ou son portfolio !

Q : Quel est le taux de satisfaction client de Remus ?
R : Le taux de satisfaction client de Remus est supérieur à 95 %.
`;
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: chatbotPrompt + "\nQ: " + question }] }]
      }
    );
    const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas compris.";
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de l'appel à Gemini." });
  }
});

// --- Route admin pour générer un rapport IA des questions fréquentes ---
app.post('/api/admin/faq-report', authenticateToken, async (req, res) => {
  try {
    const userQuestions = await kv.get('user_questions') || [];
    if (userQuestions.length === 0) {
      return res.json({ report: "Aucune question utilisateur enregistrée." });
    }
    // Construit un prompt pour Gemini
    const prompt = `Voici une liste de questions posées par les utilisateurs :\n${userQuestions.map(q => '- ' + q.question).join('\n')}\n\nAnalyse ces questions et génère un rapport synthétique des questions les plus fréquentes, sous forme de FAQ concise (max 10 questions/réponses).`;
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const report = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Aucun rapport généré.";
    res.json({ report });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la génération du rapport FAQ IA." });
  }
});

// --- Nouvelle route admin pour analyse IA personnalisée des questions utilisateurs ---
app.post('/api/admin/analyse-questions', authenticateToken, async (req, res) => {
  try {
    const { analyseQuestion } = req.body;
    if (!analyseQuestion || typeof analyseQuestion !== 'string' || analyseQuestion.trim().length < 5) {
      return res.status(400).json({ error: "Question d'analyse requise (au moins 5 caractères)." });
    }
    const userQuestions = await kv.get('user_questions') || [];
    if (userQuestions.length === 0) {
      return res.json({ answer: "Aucune question utilisateur enregistrée." });
    }
    // Prompt pour Gemini : historique caché + question d'analyse
    const prompt = `Voici l'historique des questions posées par les utilisateurs de ce site :\n${userQuestions.map(q => '- ' + q.question).join('\n')}\n\n${analyseQuestion.trim()}\n\nRéponds de façon synthétique, claire et professionnelle, sans afficher la liste brute des questions.`;
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune analyse générée.";
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de l'analyse IA des questions utilisateurs." });
  }
});

// Ajoute la route PATCH pour les réactions sur un témoignage
app.patch('/api/testimonials/:id/react', async (req, res) => {
  const { id } = req.params;
  const { sticker, userId } = req.body;
  if (!sticker || !userId) {
    return res.status(400).json({ message: 'Sticker et userId requis.' });
  }
  const allowedStickers = ['👍', '❤️', '🎉', '🚀', '🤔'];
  if (!allowedStickers.includes(sticker)) {
    return res.status(400).json({ message: 'Sticker non autorisé.' });
  }
  const testimonials = await kv.get('testimonials') || [];
  const idx = testimonials.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Témoignage introuvable.' });
  // Initialiser la structure des réactions si absente
  if (!testimonials[idx].reactions) testimonials[idx].reactions = {};
  if (!testimonials[idx].reactionUsers) testimonials[idx].reactionUsers = {};
  // Empêcher plusieurs réactions par le même userId pour le même sticker
  if (!testimonials[idx].reactionUsers[sticker]) testimonials[idx].reactionUsers[sticker] = [];
  if (testimonials[idx].reactionUsers[sticker].includes(userId)) {
    return res.status(403).json({ message: 'Vous avez déjà réagi avec ce sticker.' });
  }
  // Ajoute l'userId à la liste des utilisateurs ayant réagi pour ce sticker
  testimonials[idx].reactionUsers[sticker].push(userId);
  // Incrémente le compteur de réactions
  testimonials[idx].reactions[sticker] = (testimonials[idx].reactions[sticker] || 0) + 1;
  await kv.set('testimonials', testimonials);
  res.json({ reactions: testimonials[idx].reactions });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
