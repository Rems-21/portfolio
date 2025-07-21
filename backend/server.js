const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios'); // Ajout d'axios
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findBestAnswer } = require('./chatbot-logic'); // Importe le cerveau du chatbot

const app = express();
const PORT = process.env.PORT || 8080;
const TESTIMONIALS_FILE = './testimonials.json';
const CHATBOT_QUESTIONS_FILE = './chatbot-questions.json'; // Nouveau fichier
const QA_DATABASE_FILE = './qa-database.json'; // Nouvelle base de données

// Configuration EmailJS depuis .env
const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID, EMAILJS_PRIVATE_KEY } = process.env;

// --- Configuration CORS améliorée ---
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Autorise les deux origines
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Helper pour lire/écrire les témoignages
function readTestimonials() {
  if (!fs.existsSync(TESTIMONIALS_FILE)) return [];
  const data = fs.readFileSync(TESTIMONIALS_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeTestimonials(testimonials) {
  fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(testimonials, null, 2));
}

// (Nouvelles fonctions pour les questions du chatbot)
function readChatbotQuestions() {
  if (!fs.existsSync(CHATBOT_QUESTIONS_FILE)) return [];
  const data = fs.readFileSync(CHATBOT_QUESTIONS_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeChatbotQuestions(questions) {
  fs.writeFileSync(CHATBOT_QUESTIONS_FILE, JSON.stringify(questions, null, 2));
}

// (Nouvelles fonctions pour la base de connaissances Q&A)
function readQADatabase() {
  if (!fs.existsSync(QA_DATABASE_FILE)) return [];
  const data = fs.readFileSync(QA_DATABASE_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeQADatabase(qaData) {
  fs.writeFileSync(QA_DATABASE_FILE, JSON.stringify(qaData, null, 2));
}

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


// --- Routes d'administration protégées ---
// (On ajoute le middleware 'authenticateToken' avant chaque route à protéger)

// Ajouter une nouvelle paire Q&A (protégée)
app.post('/api/chatbot-qa', authenticateToken, (req, res) => {
  const { keywords, answer } = req.body;
  if (!keywords || !answer || !keywords.fr || !keywords.en || !answer.fr || !answer.en) {
    return res.status(400).json({ error: 'Format de données invalide.' });
  }

  const newQA = { keywords, answer };
  const qaData = readQADatabase();
  qaData.push(newQA);
  writeQADatabase(qaData);

  res.status(201).json({ success: true, message: 'Connaissance ajoutée au chatbot.' });
});

// Récupérer toutes les questions posées par les utilisateurs (protégée)
app.get('/api/chatbot-questions', authenticateToken, (req, res) => {
  const questions = readChatbotQuestions();
  res.json(questions.reverse()); // Les plus récentes en premier
});

// Route de test
app.get('/', (req, res) => {
  res.send('Backend for portfolio is running!');
});

// Récupérer tous les témoignages validés
app.get('/api/testimonials', (req, res) => {
  const testimonials = readTestimonials();
  const verified = testimonials.filter(t => t.verified);
  res.json(verified);
});

// Soumettre un nouveau témoignage et envoyer un email de vérification
app.post('/api/testimonials', async (req, res) => {
  const { name, position, company, rating, message, email } = req.body; // Ajout de l'email
  if (!name || !message || !email) {
    return res.status(400).json({ error: 'Nom, message et email sont obligatoires.' });
  }

  const newTestimonial = {
    id: uuidv4(),
    name,
    position,
    company,
    rating,
    message,
    email,
    verified: false,
    date: new Date().toISOString()
  };

  const testimonials = readTestimonials();
  testimonials.push(newTestimonial);
  writeTestimonials(testimonials);

  // --- Logique d'envoi d'email ---
  const verificationLink = `http://localhost:3000/verify-testimonial/${newTestimonial.id}`;
  
  const emailData = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_USER_ID,
    accessToken: EMAILJS_PRIVATE_KEY, // Utilisation de la clé privée pour l'API REST
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
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error.response ? error.response.data : error.message);
    // Même si l'email échoue, le témoignage est sauvegardé.
    res.status(500).json({ success: false, message: "Le témoignage a été sauvegardé, mais l'envoi de l'email de vérification a échoué." });
  }
});

// Vérifier un témoignage (validation par lien)
app.get('/api/testimonials/verify/:id', (req, res) => {
  const { id } = req.params;
  const testimonials = readTestimonials();
  const idx = testimonials.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).send('<h1>Erreur</h1><p>Témoignage introuvable ou déjà vérifié.</p>');
  }
  if (testimonials[idx].verified) {
    return res.send('<h1>Info</h1><p>Ce témoignage a déjà été vérifié.</p>');
  }
  testimonials[idx].verified = true;
  writeTestimonials(testimonials);
  // Redirige vers une page de succès sur ton site
  res.redirect('http://localhost:3000/testimonialConfirmation');
});

// --- Nouvelle route pour les questions du Chatbot ---
app.post('/api/chatbot-questions', (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'La question est invalide.' });
  }

  const newQuestion = {
    id: uuidv4(),
    question: question.trim(),
    timestamp: new Date().toISOString(),
  };

  const questions = readChatbotQuestions();
  questions.push(newQuestion);
  writeChatbotQuestions(questions);

  res.status(201).json({ success: true, message: 'Question enregistrée.' });
});

// --- Nouvelle route pour interroger le chatbot ---
app.post('/api/ask-chatbot', (req, res) => {
  const { question, lang } = req.body;
  if (!question || !lang) {
    return res.status(400).json({ error: 'La question et la langue sont requises.' });
  }
  
  const qaDatabase = readQADatabase();
  const answer = findBestAnswer(question, lang, qaDatabase);

  // Sauvegarder la question de l'utilisateur (comme avant)
  const newQuestion = {
    id: uuidv4(),
    question: question.trim(),
    timestamp: new Date().toISOString(),
  };
  const questions = readChatbotQuestions();
  questions.push(newQuestion);
  writeChatbotQuestions(questions);

  res.json({ answer });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 