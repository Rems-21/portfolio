import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// La logique emailjs est maintenant côté backend
// import emailjs from 'emailjs-com';
// import emailConfig from '../emailConfig';

const availableStickers = ['👍', '❤️', '🎉', '🚀', '🤔'];

const Testimonials = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    position: '',
    company: '', 
    email: '',
    message: '', 
    rating: 5,
    agreeToVerification: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReactionPicker, setActiveReactionPicker] = useState(null);
  // Notification visible et traduite
  const [reactionError, setReactionError] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const messageTimeout = useRef(null);

  useEffect(() => {
    let storedId = localStorage.getItem('userId');
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem('userId', storedId);
    }
    setUserId(storedId);
  }, []);
  useEffect(() => {
    if (success) {
      // Masquer automatiquement après 5 secondes
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Charger les témoignages vérifiés depuis le backend au montage
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        if (response.ok) {
          setTestimonials(data);
        } else {
          console.error("Erreur lors de la récupération des témoignages:", data.error);
        }
      } catch (err) {
        console.error("Erreur de connexion au backend:", err);
      }
    };

    fetchTestimonials();
  }, []);

  // Empêche l'ajout de plusieurs témoignages par la même adresse email
  const hasAlreadyCommented = (email) => {
    return testimonials.some(testimonial => testimonial.email && testimonial.email.toLowerCase() === email.toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleRating = (r) => {
    setForm({ ...form, rating: r });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
    
    if (!form.name.trim() || !form.message.trim() || !form.email.trim()) {
      setError(lang === 'fr' ? 'Le nom, l\'email et le témoignage sont obligatoires.' : 'Name, email and testimonial are required.');
      return false;
    }

    if (!nameRegex.test(form.name.trim())) {
      setError(lang === 'fr' ? 'Le nom doit contenir entre 2 et 50 caractères alphabétiques.' : 'Name must contain 2-50 alphabetic characters.');
      return false;
    }

    if (!emailRegex.test(form.email.trim())) {
      setError(lang === 'fr' ? 'Veuillez entrer une adresse email valide.' : 'Please enter a valid email address.');
      return false;
    }

    if (form.message.trim().length < 20 || form.message.trim().length > 500) {
      setError(lang === 'fr' ? 'Le témoignage doit contenir entre 20 et 500 caractères.' : 'Testimonial must be between 20 and 500 characters.');
      return false;
    }

    if (!form.agreeToVerification) {
      setError(lang === 'fr' ? 'Vous devez accepter la vérification de votre témoignage.' : 'You must agree to testimonial verification.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    if (hasAlreadyCommented(form.email)) {
      setError(lang === 'fr' ? 'Vous avez déjà soumis un témoignage avec cet email.' : 'You have already submitted a testimonial with this email.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setForm({ 
          name: '', 
          position: '', 
          company: '', 
          email: '',
          message: '', 
          rating: 5,
          agreeToVerification: false
        });
          setSuccess(lang === 'fr' 
          ? 'Témoignage soumis ! Un email de vérification vous a été envoyé. Vérifiez vos spams.'
          : 'Testimonial submitted! A verification email has been sent to you. Check your spam folder.'
          );
      } else {
        setError(result.message || (lang === 'fr' ? 'Une erreur est survenue.' : 'An error occurred.'));
      }

    } catch (error) {
      setError(lang === 'fr' 
        ? 'Erreur de connexion avec le serveur. Veuillez réessayer.' 
        : 'Connection error with the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (testimonialId, sticker) => {
    setReactionError('');
    if (!userId) {
      setReactionError(lang === 'fr' ? 'Identifiant utilisateur manquant.' : 'Missing user ID.');
      return;
    }
    try {
      const response = await fetch(`/api/testimonials/${testimonialId}/react`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sticker, userId })
      });
      const data = await response.json();
      if (response.ok) {
        setTestimonials(prev => prev.map(t =>
          t.id === testimonialId ? { ...t, reactions: data.reactions } : t
        ));
        // showToast(lang === 'fr' ? 'Réaction ajoutée !' : 'Reaction added!', 'success');
      } else {
        setReactionError(data.message || (lang === 'fr' ? 'Erreur lors de la réaction.' : 'Reaction error.'));
        // showToast(data.message || (lang === 'fr' ? 'Erreur lors de la réaction.' : 'Reaction error.'), 'error');
      }
    } catch (err) {
      setReactionError(lang === 'fr' ? 'Erreur de connexion.' : 'Connection error.');
      // showToast(lang === 'fr' ? 'Erreur de connexion.' : 'Connection error.', 'error');
    }
    setActiveReactionPicker(null);
  };
  
  // Carousel horizontal
  const testimonialsPerPage = 4;
  const [testimonialPage, setTestimonialPage] = useState(1);
  const totalTestimonialPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const sortedTestimonials = [...testimonials].sort((a, b) => new Date(b.date) - new Date(a.date));
  const paginatedTestimonials = sortedTestimonials.slice((testimonialPage-1)*testimonialsPerPage, testimonialPage*testimonialsPerPage);
  const carouselRef = useRef(null);

  // Scroll horizontal lors du changement de page
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: (testimonialPage-1) * carouselRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [testimonialPage]);

  return (
    <>
      {/* Bulle de notification fixe en haut de la page */}
      {message.text && (
        <div className={`testimonial-notification ${message.type}`} style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:message.type==='error'?'#fee2e2':'#d1fae5',color:'#223',padding:'14px 24px',borderRadius:0,textAlign:'center',fontWeight:600,boxShadow:'0 2px 8px #0002'}}>
          {message.text}
        </div>
      )}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2 className="section-title">{lang === 'fr' ? 'Témoignages Clients' : 'Client Testimonials'}</h2>
          {/* Carousel horizontal */}
          <div style={{overflowX:'auto',overflowY:'hidden',whiteSpace:'nowrap',scrollBehavior:'smooth'}} ref={carouselRef} className="testimonials-carousel">
            {paginatedTestimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card" style={{display:'inline-block',verticalAlign:'top',width:'min(320px,90vw)',marginRight:18}}>
                <div className="testimonial-header">
                  <div className="testimonial-author">
                    <span className="testimonial-name">{testimonial.name}</span>
                    <span className="testimonial-position">{testimonial.position || (lang === 'fr' ? 'Particulier' : 'Individual')}</span>
                    {testimonial.company && <span className="testimonial-company">{testimonial.company}</span>}
                    <span className="testimonial-date">{new Date(testimonial.date).getFullYear()}</span>
                  </div>
                  <div className="testimonial-rating-section">
                    <span className="testimonial-stars">
                      {[1,2,3,4,5].map((r) => (
                        <span key={r} className={r <= testimonial.rating ? 'star active' : 'star'}>★</span>
                      ))}
                    </span>
                    {testimonial.verified && (
                      <span 
                        className="testimonial-verified" 
                        title={lang === 'fr' ? 'Vérifié' : 'Verified'}
                        style={{ color: 'var(--gold)' }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </div>
                <p className="testimonial-message">
                  "{typeof testimonial.message === 'object' ? testimonial.message[lang] : testimonial.message}"
                </p>
                {/* La logique des réactions reste côté client pour le moment */}
                <div className="testimonial-reactions">
                  <div className="reactions-display">
                    {testimonial.reactions && Object.entries(testimonial.reactions).map(([sticker, count]) => (
                      <span key={sticker} className="reaction-chip">
                        {sticker} {count}
                      </span>
                    ))}
                  </div>
                  <div className="reaction-picker-container">
                    <button 
                      className="add-reaction-btn" 
                      onClick={() => setActiveReactionPicker(activeReactionPicker === testimonial.id ? null : testimonial.id)}
                    >
                      +
                    </button>
                    {activeReactionPicker === testimonial.id && (
                      <div className="reaction-picker">
                        {availableStickers.map(sticker => (
                          <button key={sticker} onClick={() => handleReaction(testimonial.id, sticker)}>
                            {sticker}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination horizontale */}
          {totalTestimonialPages > 1 && (
            <div className="pagination-container" style={{display:'flex',justifyContent:'center',alignItems:'center',gap:12,margin:'24px 0'}}>
              <button onClick={() => setTestimonialPage(p=>Math.max(1,p-1))} disabled={testimonialPage===1} style={{width:40,height:40,borderRadius:'50%',border:'none',background:'#e0e7ff',color:'#007bff',fontWeight:700,fontSize:18,cursor:'pointer',boxShadow:'0 2px 8px #007bff22',transition:'background 0.2s',outline:'none'}}>‹</button>
              <span style={{fontSize:18,fontWeight:600,color:'#007bff'}}>{testimonialPage} / {totalTestimonialPages}</span>
              <button onClick={() => setTestimonialPage(p=>Math.min(totalTestimonialPages,p+1))} disabled={testimonialPage===totalTestimonialPages} style={{width:40,height:40,borderRadius:'50%',border:'none',background:'#e0e7ff',color:'#007bff',fontWeight:700,fontSize:18,cursor:'pointer',boxShadow:'0 2px 8px #007bff22',transition:'background 0.2s',outline:'none'}}>›</button>
            </div>
          )}

          <div className="testimonial-form-container">
            <h3 className="testimonial-form-title">
              {lang === 'fr' ? 'Ajouter un témoignage' : 'Add a testimonial'}
            </h3>
            <div className="verification-notice">
              <p>{lang === 'fr' 
                ? 'Pour assurer la véracité des témoignages, nous envoyons un email de vérification à chaque soumission.' 
                : 'To ensure testimonial authenticity, we send a verification email for each submission.'
              }</p>
            </div>
            {error && <div className="testimonial-error">{error}</div>}
            {reactionError && <div className="testimonial-error">{reactionError}</div>}
            <form className="testimonial-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder={lang === 'fr' ? 'Votre nom complet *' : 'Your full name *'}
                  value={form.name}
                  onChange={handleChange}
                  className="testimonial-input"
                  maxLength={50}
                  required
                />
                <input
                  type="text"
                  name="position"
                  placeholder={lang === 'fr' ? 'Votre poste (optionnel)' : 'Your position (optional)'}
                  value={form.position}
                  onChange={handleChange}
                  className="testimonial-input"
                  maxLength={100}
                />
              </div>
              <input
                type="text"
                name="company"
                placeholder={lang === 'fr' ? 'Nom de l\'entreprise (optionnel)' : 'Company name (optional)'}
                value={form.company}
                onChange={handleChange}
                className="testimonial-input"
                maxLength={100}
              />
              <input
                type="email"
                name="email"
                placeholder={lang === 'fr' ? 'Votre adresse email *' : 'Your email address *'}
                value={form.email}
                onChange={handleChange}
                className="testimonial-input"
                required
              />
              <textarea
                name="message"
                placeholder={lang === 'fr' ? 'Votre témoignage (20-500 caractères) *' : 'Your testimonial (20-500 characters) *'}
                value={form.message}
                onChange={handleChange}
                className="testimonial-textarea"
                rows={4}
                minLength={20}
                maxLength={500}
                required
              />
              <div className="character-count">
                {form.message.length}/500
              </div>
              <div className="testimonial-rating">
                <span className="rating-label">{lang === 'fr' ? 'Note :' : 'Rating:'}</span>
                {[1,2,3,4,5].map((r) => (
                  <span
                    key={r}
                    className={r <= form.rating ? 'star active' : 'star'}
                    onClick={() => handleRating(r)}
                    role="button"
                    tabIndex={0}
                    aria-label={lang === 'fr' ? `${r} étoile(s)` : `${r} star(s)`}
                  >★</span>
                ))}
              </div>
              <div className="verification-agreement">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToVerification"
                    checked={form.agreeToVerification}
                    onChange={handleChange}
                    className="verification-checkbox"
                    required
                  />
                  <span className="checkbox-text">
                    {lang === 'fr' 
                      ? 'J\'accepte que mon témoignage soit vérifié par email.'
                      : 'I agree that my testimonial will be verified by email.'
                    }
                  </span>
                </label>
              </div>
              <button 
                type="submit" 
                className="testimonial-submit"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (lang === 'fr' ? 'Envoi en cours...' : 'Sending...')
                  : (lang === 'fr' ? 'Envoyer le témoignage' : 'Submit testimonial')
                }
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials; 