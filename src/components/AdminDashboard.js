import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AdminDashboard.css';

const SIDEBAR = [
  { key: 'home', label: 'Accueil', icon: '🏠' },
  { key: 'testimonials', label: 'Témoignages', icon: '📝' },
  { key: 'ia', label: 'Analyse IA', icon: '🤖' },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState('');
  const [notifType, setNotifType] = useState('');
  const [testimonialPage, setTestimonialPage] = useState(1);
  const testimonialsPerPage = 8;
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [analyseInput, setAnalyseInput] = useState('');
  const [analyseResult, setAnalyseResult] = useState('');
  const [analyseLoading, setAnalyseLoading] = useState(false);
  const [analyseError, setAnalyseError] = useState('');
  const analyseResultRef = useRef(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  // Auth
  const getAuthToken = () => localStorage.getItem('authToken');
  const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  // Fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }
      const data = await res.json();
      setTestimonials(data);
    } catch {
      setNotif('Erreur lors du chargement des témoignages.');
      setNotifType('error');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  // Refresh testimonials
  const refreshTestimonials = async () => {
    setRefreshing(true);
    await fetchTestimonials();
    setRefreshing(false);
  };

  // Pagination + recherche
  const filteredTestimonials = testimonials.filter(t => {
    const s = search.toLowerCase();
    return (
      t.name?.toLowerCase().includes(s) ||
      t.email?.toLowerCase().includes(s) ||
      t.message?.toLowerCase().includes(s)
    );
  });
  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalTestimonialPages = Math.ceil(sortedTestimonials.length / testimonialsPerPage);
  const paginatedTestimonials = sortedTestimonials.slice((testimonialPage-1)*testimonialsPerPage, testimonialPage*testimonialsPerPage);

  // Actions témoignages
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce témoignage ?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
        setNotif('Témoignage supprimé.');
        setNotifType('success');
      } else {
        setNotif('Erreur lors de la suppression.');
        setNotifType('error');
      }
    } catch {
      setNotif('Erreur réseau.');
      setNotifType('error');
    }
  };
  const handleValidate = async (id) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}/validate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status: 'validated' })
      });
      if (res.ok) {
        setTestimonials(testimonials.map(t => t.id === id ? { ...t, verified: true, status: 'validated' } : t));
        setNotif('Témoignage validé.');
        setNotifType('success');
      } else {
        setNotif('Erreur lors de la validation.');
        setNotifType('error');
      }
    } catch {
      setNotif('Erreur réseau.');
      setNotifType('error');
    }
  };
  const handleRefuse = async (id) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}/validate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status: 'refused' })
      });
      if (res.ok) {
        setTestimonials(testimonials.map(t => t.id === id ? { ...t, verified: false, status: 'refused' } : t));
        setNotif('Témoignage refusé.');
        setNotifType('success');
      } else {
        setNotif('Erreur lors du refus.');
        setNotifType('error');
      }
    } catch {
      setNotif('Erreur réseau.');
      setNotifType('error');
    }
  };

  // Analyse IA
  const iaSuggestions = [
    "Quels sont les sujets les plus fréquents ?",
    "Y a-t-il des tendances dans les questions ?",
    "Quels sont les points à améliorer selon les utilisateurs ?",
    "Quels services intéressent le plus ?",
    "Y a-t-il des retours négatifs à traiter ?"
  ];
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
        setAnalysisHistory(prev => [{ q: analyseInput, a: data.answer, date: new Date() }, ...prev.slice(0, 4)]);
      } else {
        setAnalyseError(data.error || "Erreur lors de l'analyse IA.");
      }
    } catch (e) {
      setAnalyseError('Erreur réseau.');
    } finally {
      setAnalyseLoading(false);
    }
  };
  useEffect(() => {
    if (analyseResult && analyseResultRef.current) {
      analyseResultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analyseResult]);

  // Notifications auto-hide
  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  // Responsive sidebar
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  useEffect(() => {
    const onResize = () => setSidebarOpen(window.innerWidth > 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Render
  return (
    <div className="admin-root">
      <aside className={`admin-sidebar${sidebarOpen ? '' : ' closed'}`}>
        <div className="sidebar-logo">DRH</div>
        <nav>
          {SIDEBAR.map(item => (
            <button
              key={item.key}
              className={`sidebar-link${activeSection === item.key ? ' active' : ''}`}
              onClick={() => setActiveSection(item.key)}
              aria-label={item.label}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="sidebar-link logout" onClick={logout} aria-label="Déconnexion">
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Déconnexion</span>
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={()=>setSidebarOpen(s=>!s)} aria-label="Ouvrir/fermer le menu">☰</button>
          <h1>Bienvenue sur l’administration DRH</h1>
        </header>
        {notif && <div className={`notif ${notifType}`}>{notif}</div>}
        {activeSection === 'home' && (
          <section className="dashboard-home">
            <h2>Tableau de bord</h2>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="card-title">Témoignages</div>
                <div className="card-value">{testimonials.length}</div>
              </div>
              <div className="dashboard-card">
                <div className="card-title">Nouveaux (en attente)</div>
                <div className="card-value">{testimonials.filter(t=>!t.verified && t.status!=='refused').length}</div>
              </div>
              <div className="dashboard-card">
                <div className="card-title">Validés</div>
                <div className="card-value">{testimonials.filter(t=>t.verified).length}</div>
              </div>
              <div className="dashboard-card">
                <div className="card-title">Refusés</div>
                <div className="card-value">{testimonials.filter(t=>t.status==='refused').length}</div>
              </div>
            </div>
          </section>
        )}
        {activeSection === 'testimonials' && (
          <section className="dashboard-testimonials">
            <div className="testimonials-header">
              <h2>Témoignages</h2>
              <button onClick={refreshTestimonials} disabled={refreshing} aria-label="Rafraîchir" className="refresh-btn">{refreshing ? '...' : 'Rafraîchir'}</button>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Recherche par nom, email, message..."
                className="testimonial-search"
                aria-label="Recherche témoignages"
              />
            </div>
            {loading ? <div className="loading">Chargement...</div> : (
              <div className="testimonials-list">
                {paginatedTestimonials.length === 0 ? (
                  <div className="empty">Aucun témoignage trouvé.</div>
                ) : paginatedTestimonials.map(t => (
                  <div key={t.id} className={`testimonial-card-admin ${t.verified ? 'validated' : t.status === 'refused' ? 'refused' : 'pending'}`}>
                    <div className="testimonial-header-admin">
                      <span className="testimonial-name-admin">{t.name}</span>
                      <span className="testimonial-date-admin">{new Date(t.date).toLocaleString()}</span>
                      <span className="testimonial-status-admin">{t.verified ? 'Validé' : t.status === 'refused' ? 'Refusé' : 'En attente'}</span>
                    </div>
                    <div className="testimonial-message-admin">{t.message}</div>
                    <div className="testimonial-actions-admin">
                      {!t.verified && t.status !== 'refused' && <button onClick={()=>handleValidate(t.id)} className="validate-btn">Valider</button>}
                      {!t.verified && t.status !== 'refused' && <button onClick={()=>handleRefuse(t.id)} className="refuse-btn">Refuser</button>}
                      <button onClick={()=>handleDelete(t.id)} className="delete-btn">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {totalTestimonialPages > 1 && (
              <div className="pagination-container">
                <button onClick={() => setTestimonialPage(p => Math.max(1, p-1))} disabled={testimonialPage===1}>Précédent</button>
                <span>{testimonialPage} / {totalTestimonialPages}</span>
                <button onClick={() => setTestimonialPage(p => Math.min(totalTestimonialPages, p+1))} disabled={testimonialPage===totalTestimonialPages}>Suivant</button>
              </div>
            )}
          </section>
        )}
        {activeSection === 'ia' && (
          <section className="dashboard-ia">
            <h2>Analyse IA personnalisée</h2>
            <div className="ia-suggestions">
              {iaSuggestions.map(sugg => (
                <button key={sugg} onClick={()=>setAnalyseInput(sugg)} className="ia-suggestion-btn">{sugg}</button>
              ))}
            </div>
            <div className="ia-analyse-form">
              <input
                type="text"
                value={analyseInput}
                onChange={e => setAnalyseInput(e.target.value)}
                placeholder="Ex: Quelles sont les tendances ?"
                className="ia-analyse-input"
                aria-label="Question d'analyse IA"
                onKeyDown={e => {if(e.key==='Enter') handleAnalyseQuestions();}}
                autoFocus
              />
              <button onClick={handleAnalyseQuestions} disabled={analyseLoading||!analyseInput.trim()} className="ia-analyse-btn">
                {analyseLoading ? 'Analyse...' : 'Analyser'}
              </button>
            </div>
            {analyseError && <div className="notif error" role="alert">{analyseError}</div>}
            {analyseResult && (
              <div ref={analyseResultRef} className="ia-analysis-result">
                <h3>Résultat de l'analyse IA</h3>
                {analyseResult.split('\n').map((line,i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
            {analysisHistory.length > 0 && (
              <div className="ia-analysis-history">
                <h4>Analyses récentes</h4>
                <ul>
                  {analysisHistory.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.q}</strong> <span style={{color:'#888',fontSize:12}}>({item.date.toLocaleString()})</span>
                      <div style={{marginLeft:8}}>{item.a}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard; 