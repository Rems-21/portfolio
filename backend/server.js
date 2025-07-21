const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findBestAnswer } = require('./chatbot-logic');
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

// Ajouter une nouvelle paire Q&A (protégée)
app.post('/api/chatbot-qa', authenticateToken, async (req, res) => {
  const { keywords, answer } = req.body;
  if (!keywords || !answer) {
    return res.status(400).json({ error: 'Format de données invalide.' });
  }

  try {
    const newQA = { keywords, answer };
    const qaData = await kv.get('qa_database') || [];
    qaData.push(newQA);
    await kv.set('qa_database', qaData);
    res.status(201).json({ success: true, message: 'Connaissance ajoutée au chatbot.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Récupérer toutes les questions posées par les utilisateurs (protégée)
app.get('/api/chatbot-questions', authenticateToken, async (req, res) => {
  try {
    const questions = await kv.get('chatbot_questions') || [];
    res.json(questions.reverse());
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

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

// --- GESTION AVANCÉE DU CHATBOT (ADMIN) ---

// Récupérer toutes les Q&A (protégé)
app.get('/api/admin/chatbot-qa', authenticateToken, async (req, res) => {
  try {
    const qaData = await kv.get('qa_database') || [];
    res.json(qaData);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Modifier une Q&A (protégé)
app.put('/api/admin/chatbot-qa/:index', authenticateToken, async (req, res) => {
  const { index } = req.params;
  const { keywords, answer } = req.body;
  try {
    const qaData = await kv.get('qa_database') || [];
    if (!qaData[index]) return res.status(404).json({ success: false, message: 'Q&A introuvable.' });
    qaData[index] = { keywords, answer };
    await kv.set('qa_database', qaData);
    res.json({ success: true, message: 'Q&A modifiée.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Supprimer une Q&A (protégé)
app.delete('/api/admin/chatbot-qa/:index', authenticateToken, async (req, res) => {
  const { index } = req.params;
  try {
    const qaData = await kv.get('qa_database') || [];
    if (!qaData[index]) return res.status(404).json({ success: false, message: 'Q&A introuvable.' });
    qaData.splice(index, 1);
    await kv.set('qa_database', qaData);
    res.json({ success: true, message: 'Q&A supprimée.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Statistiques d'utilisation du chatbot (protégé)
app.get('/api/admin/chatbot/stats', authenticateToken, async (req, res) => {
  try {
    const questions = await kv.get('chatbot_questions') || [];
    const total = questions.length;
    // Taux de suggestions (non compris)
    // On suppose que findBestAnswer renvoie un objet {type: 'suggestions', ...} si non compris
    // Ici, on ne stocke pas la réponse, donc on ne peut pas calculer le taux exact sans adaptation
    res.json({ total });
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
    verified: false, date: new Date().toISOString()
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
  const { question, lang } = req.body;
  if (!question || !lang) {
    return res.status(400).json({ error: 'Question et langue requises.' });
  }
  
  try {
    const qaDatabase = await kv.get('qa_database') || [];
    const answer = findBestAnswer(question, lang, qaDatabase);

    // Sauvegarder la question de l'utilisateur
    const newQuestion = { id: uuidv4(), question: question.trim(), timestamp: new Date().toISOString() };
    const questions = await kv.get('chatbot_questions') || [];
    questions.push(newQuestion);
    await kv.set('chatbot_questions', questions);

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 