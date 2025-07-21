import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

// Fonction pour récupérer le jeton d'authentification
const getAuthToken = () => localStorage.getItem('authToken');

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [newQA, setNewQA] = useState({
    keywords_fr: '',
    keywords_en: '',
    answer_fr: '',
    answer_en: ''
  });
  const [message, setMessage] = useState('');

  // Charger les questions des utilisateurs avec le jeton
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/chatbot-questions', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        if (response.status === 401 || response.status === 403) {
          // Gérer la déconnexion si le jeton est invalide
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          return;
        }
        const data = await response.json();
        if (response.ok) {
          setQuestions(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQA(prev => ({ ...prev, [name]: value }));
  };

  // Gérer la soumission d'une nouvelle réponse
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const payload = {
      keywords: {
        fr: newQA.keywords_fr.split(',').map(k => k.trim()).filter(k => k),
        en: newQA.keywords_en.split(',').map(k => k.trim()).filter(k => k)
      },
      answer: {
        fr: newQA.answer_fr.split('|').map(a => a.trim()).filter(a => a),
        en: newQA.answer_en.split('|').map(a => a.trim()).filter(a => a)
      }
    };

    if (payload.keywords.fr.length === 0 || payload.keywords.en.length === 0 || payload.answer.fr.length === 0 || payload.answer.en.length === 0) {
      setMessage('Erreur: Tous les champs doivent être remplis.');
      return;
    }

    try {
      const response = await fetch('/api/chatbot-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Nouvelle connaissance ajoutée avec succès !');
        setNewQA({ keywords_fr: '', keywords_en: '', answer_fr: '', answer_en: '' });
      } else {
        setMessage(`Erreur: ${result.message}`);
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur.');
    }
  };
  
  // Associer une question non répondue au formulaire
  const handleTeachResponse = (questionText) => {
    setNewQA(prev => ({ ...prev, keywords_fr: questionText, keywords_en: questionText }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="admin-dashboard">
      <h1>Tableau de Bord - RemsBot</h1>

      <div className="dashboard-section">
        <h2>Enrichir le Chatbot</h2>
        <p>Ajoutez une nouvelle paire question/réponse. Séparez les mots-clés par des virgules (,) et les variantes de réponses par des barres verticales (|).</p>
        
        {message && <div className={`message ${message.startsWith('Erreur') ? 'error' : 'success'}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="qa-form">
          <div className="form-group">
            <label>Mots-clés (FR)</label>
            <input type="text" name="keywords_fr" value={newQA.keywords_fr} onChange={handleInputChange} placeholder="ex: salut, bonjour, coucou" required />
          </div>
          <div className="form-group">
            <label>Mots-clés (EN)</label>
            <input type="text" name="keywords_en" value={newQA.keywords_en} onChange={handleInputChange} placeholder="ex: hello, hi, greetings" required />
          </div>
          <div className="form-group">
            <label>Réponses (FR)</label>
            <textarea name="answer_fr" value={newQA.answer_fr} onChange={handleInputChange} placeholder="ex: Salut !|Bonjour, comment puis-je aider ?" required />
          </div>
          <div className="form-group">
            <label>Réponses (EN)</label>
            <textarea name="answer_en" value={newQA.answer_en} onChange={handleInputChange} placeholder="ex: Hello!|Hi, how can I help?" required />
          </div>
          <button type="submit" className="submit-btn">Ajouter la Connaissance</button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Questions des Utilisateurs</h2>
        <p>Voici les dernières questions posées par les visiteurs. Cliquez sur une question pour l'utiliser comme base pour une nouvelle réponse.</p>
        <ul className="questions-list">
          {questions.length > 0 ? (
            questions.map(q => (
              <li key={q.id} onClick={() => handleTeachResponse(q.question)}>
                <span className="question-text">{q.question}</span>
                <span className="question-date">{new Date(q.timestamp).toLocaleString()}</span>
              </li>
            ))
          ) : (
            <p>Aucune question d'utilisateur pour le moment.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard; 