import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

// Fonction pour récupérer le jeton d'authentification
const getAuthToken = () => localStorage.getItem('authToken');

const STATUS_LABELS = {
  validated: 'Validé',
  refused: 'Refusé',
  pending: 'En attente',
};

const AdminDashboard = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [notif, setNotif] = useState('');
  const [notifType, setNotifType] = useState('success');
  const [loading, setLoading] = useState(true);

  // --- États chatbot ---
  const [qaList, setQaList] = useState([]);
  const [qaSearch, setQaSearch] = useState('');
  const [qaEditIndex, setQaEditIndex] = useState(null);
  const [qaEdit, setQaEdit] = useState({ keywords_fr: '', keywords_en: '', answer_fr: '', answer_en: '' });
  const [questions, setQuestions] = useState([]);
  const [chatbotStats, setChatbotStats] = useState(null);

  // --- Gestion avancée des témoignages ---
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/testimonials', {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        setTestimonials(data);
      } catch (e) {
        setNotif('Erreur lors du chargement des témoignages.');
        setNotifType('error');
      } finally {
        setLoading(false);
      }
    };
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/testimonials/stats', {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch {}
    };
    // --- fetch Q&A ---
    const fetchQa = async () => {
      try {
        const res = await fetch('/api/admin/chatbot-qa', {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        if (res.ok) setQaList(await res.json());
      } catch {}
    };
    // --- fetch questions utilisateurs ---
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/chatbot-questions', {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        if (res.ok) setQuestions(await res.json());
      } catch {}
    };
    // --- fetch stats chatbot ---
    const fetchChatbotStats = async () => {
      try {
        const res = await fetch('/api/admin/chatbot/stats', {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        if (res.ok) setChatbotStats(await res.json());
      } catch {}
    };
    fetchTestimonials();
    fetchStats();
    fetchQa();
    fetchQuestions();
    fetchChatbotStats();
  }, []);

  const handleAction = async (id, action) => {
    setNotif('');
    if (action === 'delete') {
      if (!window.confirm('Supprimer ce témoignage ?')) return;
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        const result = await res.json();
        if (res.ok) {
          setTestimonials(testimonials.filter(t => t.id !== id));
          setNotif('Témoignage supprimé.');
          setNotifType('success');
        } else {
          setNotif(result.message || 'Erreur lors de la suppression.');
          setNotifType('error');
        }
      } catch {
        setNotif('Erreur réseau.');
        setNotifType('error');
      }
    } else {
      // Valider ou refuser
      const status = action === 'validate' ? 'validated' : 'refused';
      try {
        const res = await fetch(`/api/admin/testimonials/${id}/validate`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ status })
        });
        const result = await res.json();
        if (res.ok) {
          setTestimonials(testimonials.map(t => t.id === id ? { ...t, verified: status === 'validated', status } : t));
          setNotif(status === 'validated' ? 'Témoignage validé.' : 'Témoignage refusé.');
          setNotifType('success');
        } else {
          setNotif(result.message || 'Erreur lors de la mise à jour.');
          setNotifType('error');
        }
      } catch {
        setNotif('Erreur réseau.');
        setNotifType('error');
      }
    }
  };

  // --- Actions Q&A ---
  const handleQaDelete = async (index) => {
    if (!window.confirm('Supprimer cette Q&A ?')) return;
    try {
      const res = await fetch(`/api/admin/chatbot-qa/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) {
        setQaList(qaList.filter((_, i) => i !== index));
        setNotif('Q&A supprimée.'); setNotifType('success');
      } else {
        setNotif('Erreur lors de la suppression.'); setNotifType('error');
      }
    } catch { setNotif('Erreur réseau.'); setNotifType('error'); }
  };
  const handleQaEdit = (index) => {
    setQaEditIndex(index);
    const qa = qaList[index];
    setQaEdit({
      keywords_fr: qa.keywords.fr?.join(', ') || '',
      keywords_en: qa.keywords.en?.join(', ') || '',
      answer_fr: Array.isArray(qa.answer.fr) ? qa.answer.fr.join(' | ') : qa.answer.fr || '',
      answer_en: Array.isArray(qa.answer.en) ? qa.answer.en.join(' | ') : qa.answer.en || '',
    });
  };
  const handleQaEditSave = async () => {
    const payload = {
      keywords: {
        fr: qaEdit.keywords_fr.split(',').map(k => k.trim()).filter(k => k),
        en: qaEdit.keywords_en.split(',').map(k => k.trim()).filter(k => k)
      },
      answer: {
        fr: qaEdit.answer_fr.split('|').map(a => a.trim()).filter(a => a),
        en: qaEdit.answer_en.split('|').map(a => a.trim()).filter(a => a)
      }
    };
    try {
      const res = await fetch(`/api/admin/chatbot-qa/${qaEditIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newQaList = [...qaList];
        newQaList[qaEditIndex] = payload;
        setQaList(newQaList);
        setNotif('Q&A modifiée.'); setNotifType('success');
        setQaEditIndex(null);
      } else {
        setNotif('Erreur lors de la modification.'); setNotifType('error');
      }
    } catch { setNotif('Erreur réseau.'); setNotifType('error'); }
  };
  // --- Recherche Q&A ---
  const filteredQa = qaList.filter(qa => {
    const s = qaSearch.toLowerCase();
    return (
      qa.keywords.fr?.join(', ').toLowerCase().includes(s) ||
      qa.keywords.en?.join(', ').toLowerCase().includes(s) ||
      qa.answer.fr?.join(' | ').toLowerCase().includes(s) ||
      qa.answer.en?.join(' | ').toLowerCase().includes(s)
    );
  });
  // --- Associer une question utilisateur à une Q&A ---
  const handleTeachResponse = (questionText) => {
    setQaEditIndex('new');
    setQaEdit({ keywords_fr: questionText, keywords_en: questionText, answer_fr: '', answer_en: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleQaNewSave = async () => {
    const payload = {
      keywords: {
        fr: qaEdit.keywords_fr.split(',').map(k => k.trim()).filter(k => k),
        en: qaEdit.keywords_en.split(',').map(k => k.trim()).filter(k => k)
      },
      answer: {
        fr: qaEdit.answer_fr.split('|').map(a => a.trim()).filter(a => a),
        en: qaEdit.answer_en.split('|').map(a => a.trim()).filter(a => a)
      }
    };
    try {
      const res = await fetch('/api/chatbot-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setQaList([...qaList, payload]);
        setNotif('Nouvelle Q&A ajoutée.'); setNotifType('success');
        setQaEditIndex(null);
      } else {
        setNotif('Erreur lors de l’ajout.'); setNotifType('error');
      }
    } catch { setNotif('Erreur réseau.'); setNotifType('error'); }
  };

  // Filtres et recherche
  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'validated') return t.verified;
    if (filter === 'refused') return t.status === 'refused';
    if (filter === 'pending') return !t.verified && t.status !== 'refused';
    return true;
  }).filter(t => {
    const s = search.toLowerCase();
    return (
      t.name?.toLowerCase().includes(s) ||
      t.email?.toLowerCase().includes(s) ||
      t.message?.toLowerCase().includes(s)
    );
  });

  // Pagination témoignages
  const [testimonialPage, setTestimonialPage] = useState(1);
  const testimonialsPerPage = 10;
  const paginatedTestimonials = filteredTestimonials.slice((testimonialPage-1)*testimonialsPerPage, testimonialPage*testimonialsPerPage);
  const totalTestimonialPages = Math.ceil(filteredTestimonials.length / testimonialsPerPage);

  // Pagination Q&A
  const [qaPage, setQaPage] = useState(1);
  const qaPerPage = 10;
  const paginatedQa = filteredQa.slice((qaPage-1)*qaPerPage, qaPage*qaPerPage);
  const totalQaPages = Math.ceil(filteredQa.length / qaPerPage);

  return (
    <div className="admin-dashboard">
      <h1>Tableau de Bord - Témoignages</h1>
      {notif && (
        <div className={`notif ${notifType}`}>{notif}</div>
      )}
      <div className="dashboard-section">
        <h2>Statistiques</h2>
        {stats ? (
          <ul className="stats-list">
            <li>Total : {stats.total}</li>
            <li>Validés : {stats.validated}</li>
            <li>Refusés : {stats.refused}</li>
            <li>En attente : {stats.pending}</li>
          </ul>
        ) : <p>Chargement...</p>}
      </div>
      <div className="dashboard-section">
        <h2>Gestion des Témoignages</h2>
        <div className="filters">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="validated">Validés</option>
            <option value="pending">En attente</option>
            <option value="refused">Refusés</option>
          </select>
          <input
            type="text"
            placeholder="Recherche par nom, email, message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? <p>Chargement...</p> : (
          <>
          <table className="testimonials-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTestimonials.length === 0 ? (
                <tr><td colSpan={6}>Aucun témoignage trouvé.</td></tr>
              ) : paginatedTestimonials.map(t => (
                <tr key={t.id} className={t.verified ? 'validated' : t.status === 'refused' ? 'refused' : 'pending'}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.date ? new Date(t.date).toLocaleDateString() : ''}</td>
                  <td>{t.verified ? STATUS_LABELS.validated : t.status === 'refused' ? STATUS_LABELS.refused : STATUS_LABELS.pending}</td>
                  <td style={{maxWidth: 200, whiteSpace: 'pre-line'}}>{t.message}</td>
                  <td>
                    {!t.verified && t.status !== 'refused' && (
                      <button onClick={() => handleAction(t.id, 'validate')}>Valider</button>
                    )}
                    {t.status !== 'refused' && t.verified !== true && (
                      <button onClick={() => handleAction(t.id, 'refuse')}>Refuser</button>
                    )}
                    <button onClick={() => handleAction(t.id, 'delete')} className="danger">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setTestimonialPage(p => Math.max(1, p-1))} disabled={testimonialPage === 1}>Précédent</button>
            <span>Page {testimonialPage} / {totalTestimonialPages}</span>
            <button onClick={() => setTestimonialPage(p => Math.min(totalTestimonialPages, p+1))} disabled={testimonialPage === totalTestimonialPages}>Suivant</button>
          </div>
          </>
        )}
      </div>
      {/* ... Section chatbot existante ... */}
      <div className="dashboard-section">
        <h2>Base de connaissances du Chatbot</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Recherche Q&A par mot-clé..."
            value={qaSearch}
            onChange={e => setQaSearch(e.target.value)}
          />
        </div>
        <table className="qa-table">
          <thead>
            <tr>
              <th>Mots-clés (FR)</th>
              <th>Mots-clés (EN)</th>
              <th>Réponses (FR)</th>
              <th>Réponses (EN)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQa.length === 0 ? (
              <tr><td colSpan={5}>Aucune Q&A trouvée.</td></tr>
            ) : paginatedQa.map((qa, i) => {
              const realIndex = (qaPage-1)*qaPerPage + i;
              return (
                <tr key={realIndex}>
                  <td>{qa.keywords.fr?.join(', ')}</td>
                  <td>{qa.keywords.en?.join(', ')}</td>
                  <td>{Array.isArray(qa.answer.fr) ? qa.answer.fr.join(' | ') : qa.answer.fr}</td>
                  <td>{Array.isArray(qa.answer.en) ? qa.answer.en.join(' | ') : qa.answer.en}</td>
                  <td>
                    <button onClick={() => handleQaEdit(realIndex)}>Éditer</button>
                    <button onClick={() => handleQaDelete(realIndex)} className="danger">Supprimer</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => setQaPage(p => Math.max(1, p-1))} disabled={qaPage === 1}>Précédent</button>
          <span>Page {qaPage} / {totalQaPages}</span>
          <button onClick={() => setQaPage(p => Math.min(totalQaPages, p+1))} disabled={qaPage === totalQaPages}>Suivant</button>
        </div>
        {/* Formulaire édition/ajout Q&A */}
        {qaEditIndex !== null && (
          <div className="qa-edit-form">
            <h3>{qaEditIndex === 'new' ? 'Nouvelle Q&A' : 'Éditer Q&A'}</h3>
            <input type="text" placeholder="Mots-clés FR" value={qaEdit.keywords_fr} onChange={e => setQaEdit({ ...qaEdit, keywords_fr: e.target.value })} />
            <input type="text" placeholder="Mots-clés EN" value={qaEdit.keywords_en} onChange={e => setQaEdit({ ...qaEdit, keywords_en: e.target.value })} />
            <textarea placeholder="Réponses FR (séparées par |)" value={qaEdit.answer_fr} onChange={e => setQaEdit({ ...qaEdit, answer_fr: e.target.value })} />
            <textarea placeholder="Réponses EN (séparées par |)" value={qaEdit.answer_en} onChange={e => setQaEdit({ ...qaEdit, answer_en: e.target.value })} />
            <button onClick={qaEditIndex === 'new' ? handleQaNewSave : handleQaEditSave} className="primary">Enregistrer</button>
            <button onClick={() => setQaEditIndex(null)}>Annuler</button>
          </div>
        )}
      </div>
      <div className="dashboard-section">
        <h2>Questions des Utilisateurs</h2>
        <p>Voici les dernières questions posées par les visiteurs. Cliquez sur une question pour l'utiliser comme base pour une nouvelle Q&A.</p>
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
      <div className="dashboard-section">
        <h2>Statistiques Chatbot</h2>
        {chatbotStats ? (
          <ul className="stats-list">
            <li>Nombre total de questions posées : {chatbotStats.total}</li>
          </ul>
        ) : <p>Chargement...</p>}
      </div>
    </div>
  );
};

export default AdminDashboard; 