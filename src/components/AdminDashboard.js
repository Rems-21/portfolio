import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

// Fonction pour récupérer le jeton d'authentification
const getAuthToken = () => localStorage.getItem('authToken');

const STATUS_LABELS = {
  validated: 'Validé',
  refused: 'Refusé',
  pending: 'En attente',
};

const SIDEBAR_SECTIONS = [
  { key: 'stats', label: 'Statistiques', icon: '📊' },
  { key: 'testimonials', label: 'Témoignages', icon: '📝' },
  { key: 'chatbot', label: 'Chatbot', icon: '🤖' },
  { key: 'questions', label: 'Questions', icon: '❓' },
];

const AdminDashboard = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [notif, setNotif] = useState('');
  const [notifType, setNotifType] = useState('success');
  const [loading, setLoading] = useState(true);

  // --- États chatbot ---
  // Supprimer toute la logique et le rendu liés à la Q&A chatbot (qaList, recherche Q&A, édition, ajout, suppression, pagination Q&A, etc.)
  // Supprimer la section/statistiques chatbot et le nombre de visiteurs
  // Garder uniquement la gestion des témoignages (avec pagination), la FAQ IA et l'analyse IA personnalisée
  // Réduire la structure à l'essentiel : une section pour les témoignages paginés, une pour la FAQ IA et l'analyse IA
  const [activeSection, setActiveSection] = useState('testimonials');

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
    // Supprimer la logique et le rendu liés à la Q&A chatbot (qaList, recherche Q&A, édition, ajout, suppression, pagination Q&A, etc.)
    // Supprimer la section/statistiques chatbot et le nombre de visiteurs
    // Garder uniquement la gestion des témoignages (avec pagination), la FAQ IA et l'analyse IA personnalisée
    // Réduire la structure à l'essentiel : une section pour les témoignages paginés, une pour la FAQ IA et l'analyse IA
    // --- fetch stats chatbot ---
    // Supprimer la logique et le rendu liés à la Q&A chatbot (qaList, recherche Q&A, édition, ajout, suppression, pagination Q&A, etc.)
    // Supprimer la section/statistiques chatbot et le nombre de visiteurs
    // Garder uniquement la gestion des témoignages (avec pagination), la FAQ IA et l'analyse IA personnalisée
    // Réduire la structure à l'essentiel : une section pour les témoignages paginés, une pour la FAQ IA et l'analyse IA
    fetchTestimonials();
    fetchStats();
    // Supprimer la logique et le rendu liés à la Q&A chatbot (qaList, recherche Q&A, édition, ajout, suppression, pagination Q&A, etc.)
    // Supprimer la section/statistiques chatbot et le nombre de visiteurs
    // Garder uniquement la gestion des témoignages (avec pagination), la FAQ IA et l'analyse IA personnalisée
    // Réduire la structure à l'essentiel : une section pour les témoignages paginés, une pour la FAQ IA et l'analyse IA
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

  // Supprimer toute la logique et le rendu liés à la Q&A chatbot (qaList, recherche Q&A, édition, ajout, suppression, pagination Q&A, etc.)
  // Supprimer la section/statistiques chatbot et le nombre de visiteurs
  // Garder uniquement la gestion des témoignages (avec pagination), la FAQ IA et l'analyse IA personnalisée
  // Réduire la structure à l'essentiel : une section pour les témoignages paginés, une pour la FAQ IA et l'analyse IA
  // Pagination témoignages
  const [testimonialPage, setTestimonialPage] = useState(1);
  const testimonialsPerPage = 10;
  const paginatedTestimonials = testimonials.slice((testimonialPage-1)*testimonialsPerPage, testimonialPage*testimonialsPerPage);
  const totalTestimonialPages = Math.ceil(testimonials.length / testimonialsPerPage);

  // Supprimer toute la logique et le rendu liés à la Q&A chatbot (qaList, recherche Q&A, édition, ajout, suppression, pagination Q&A, etc.)
  // Supprimer la section/statistiques chatbot et le nombre de visiteurs
  // Garder uniquement la gestion des témoignages (avec pagination), la FAQ IA et l'analyse IA personnalisée
  // Réduire la structure à l'essentiel : une section pour les témoignages paginés, une pour la FAQ IA et l'analyse IA
  const [faqReport, setFaqReport] = useState('');
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState('');

  // --- Section FAQ IA ---
  const handleGenerateFaq = async () => {
    setFaqLoading(true);
    setFaqError('');
    setFaqReport('');
    try {
      const res = await fetch('/api/admin/faq-report', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFaqReport(data.report);
      } else {
        setFaqError(data.error || 'Erreur lors de la génération du rapport FAQ.');
      }
    } catch (e) {
      setFaqError('Erreur réseau.');
    } finally {
      setFaqLoading(false);
    }
  };

  // Supprimer toute la logique et le rendu liés à la Q&A chatbot (qaList, recherche Q&A, édition, ajout, suppression, pagination Q&A, etc.)
  // Supprimer la section/statistiques chatbot et le nombre de visiteurs
  // Garder uniquement la gestion des témoignages (avec pagination), la FAQ IA et l'analyse IA personnalisée
  // Réduire la structure à l'essentiel : une section pour les témoignages paginés, une pour la FAQ IA et l'analyse IA
  // --- Analyse IA personnalisée des questions utilisateurs ---
  const [analyseInput, setAnalyseInput] = useState('');
  const [analyseResult, setAnalyseResult] = useState('');
  const [analyseLoading, setAnalyseLoading] = useState(false);
  const [analyseError, setAnalyseError] = useState('');

  const handleAnalyseQuestions = async () => {
    setAnalyseLoading(true);
    setAnalyseError('');
    setAnalyseResult('');
    try {
      const res = await fetch('/api/admin/analyse-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ analyseQuestion: analyseInput })
      });
      const data = await res.json();
      if (res.ok) {
        setAnalyseResult(data.answer);
      } else {
        setAnalyseError(data.error || "Erreur lors de l'analyse IA.");
      }
    } catch (e) {
      setAnalyseError('Erreur réseau.');
    } finally {
      setAnalyseLoading(false);
    }
  };

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <div className="sidebar-logo">RemusAdmin</div>
        <nav className="sidebar-nav">
          {SIDEBAR_SECTIONS.map(sec => (
            <button
              key={sec.key}
              className={`sidebar-link${activeSection === sec.key ? ' active' : ''}`}
              onClick={() => setActiveSection(sec.key)}
            >
              <span className="sidebar-icon">{sec.icon}</span>
              <span className="sidebar-label">{sec.label}</span>
            </button>
          ))}
        </nav>
        <button className="sidebar-link logout" onClick={() => { localStorage.removeItem('authToken'); window.location.href = '/login'; }}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Déconnexion</span>
        </button>
      </aside>
      <main className="dashboard-main">
        <h1>Tableau de Bord - Administration</h1>
        {notif && (
          <div className={`notif ${notifType}`}>{notif}</div>
        )}
        {activeSection === 'testimonials' && (
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-title"><span className="card-icon">📝</span> Gestion des Témoignages</div>
              <div className="card-content">
                <div className="filters">
                  <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Recherche par nom, email, message..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    {search && <button className="clear-btn" onClick={() => setSearch(' ')} title="Effacer">×</button>}
                  </div>
                  <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">Tous</option>
                    <option value="validated">Validés</option>
                    <option value="pending">En attente</option>
                    <option value="refused">Refusés</option>
                  </select>
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
            </div>
          </div>
        )}
        {activeSection === 'questions' && (
          <div className="dashboard-grid">
            <div className="card faq-card">
              <div className="card-title"><span className="card-icon">🤖</span> FAQ IA des Utilisateurs</div>
              <div className="card-content">
                <button className="faq-generate-btn" onClick={handleGenerateFaq} disabled={faqLoading}>
                  {faqLoading ? 'Analyse en cours...' : 'Générer le rapport FAQ IA'}
                </button>
                {faqError && <div className="faq-error">{faqError}</div>}
                {faqReport && (
                  <div className="faq-report">
                    <pre>{faqReport}</pre>
                  </div>
                )}
                <hr style={{margin:'2em 0'}}/>
                <h3>Analyse IA personnalisée</h3>
                <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
                  <input
                    type="text"
                    value={analyseInput}
                    onChange={e => setAnalyseInput(e.target.value)}
                    placeholder="Ex: Quelles sont les tendances ?"
                    style={{flex:1,padding:8,borderRadius:4,border:'1px solid #ccc'}}
                    disabled={analyseLoading}
                  />
                  <button onClick={handleAnalyseQuestions} disabled={analyseLoading||!analyseInput.trim()} className="faq-generate-btn">
                    {analyseLoading ? 'Analyse...' : 'Analyser'}
                  </button>
                </div>
                {analyseError && <div className="faq-error">{analyseError}</div>}
                {analyseResult && <pre className="faq-report">{analyseResult}</pre>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard; 