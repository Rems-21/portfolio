import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// La logique emailjs est maintenant côté backend
// import emailjs from 'emailjs-com';
// import emailConfig from '../emailConfig';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Notification visible et traduite
  const [message, setMessage] = useState({ text: '', type: '' });
  const toastTimeout = useRef(null);

  // Affichage du toast flottant
  const showToast = (text, type = 'info') => {
    setMessage({ text, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    let storedId = localStorage.getItem('userId');
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem('userId', storedId);
    }
  }, []);
  useEffect(() => {
    if (message.text) {
      // Masquer automatiquement après 5 secondes
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

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
      showToast(lang === 'fr' ? 'Le nom, l\'email et le témoignage sont obligatoires.' : 'Name, email and testimonial are required.', 'error');
      return false;
    }

    if (!nameRegex.test(form.name.trim())) {
      showToast(lang === 'fr' ? 'Le nom doit contenir entre 2 et 50 caractères alphabétiques.' : 'Name must contain 2-50 alphabetic characters.', 'error');
      return false;
    }

    if (!emailRegex.test(form.email.trim())) {
      showToast(lang === 'fr' ? 'Veuillez entrer une adresse email valide.' : 'Please enter a valid email address.', 'error');
      return false;
    }

    if (form.message.trim().length < 20 || form.message.trim().length > 500) {
      showToast(lang === 'fr' ? 'Le témoignage doit contenir entre 20 et 500 caractères.' : 'Testimonial must be between 20 and 500 characters.', 'error');
      return false;
    }

    if (!form.agreeToVerification) {
      showToast(lang === 'fr' ? 'Vous devez accepter la vérification de votre témoignage.' : 'You must agree to testimonial verification.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (hasAlreadyCommented(form.email)) {
      showToast(lang === 'fr' ? 'Vous avez déjà soumis un témoignage avec cet email.' : 'You have already submitted a testimonial with this email.', 'error');
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
        showToast(lang === 'fr' 
          ? 'Témoignage soumis ! Un email de vérification vous a été envoyé. Vérifiez vos spams.'
          : 'Testimonial submitted! A verification email has been sent to you. Check your spam folder.', 'success');
      } else {
        showToast(result.message || (lang === 'fr' ? 'Une erreur est survenue.' : 'An error occurred.'), 'error');
      }

    } catch (error) {
      showToast(lang === 'fr' 
        ? 'Erreur de connexion avec le serveur. Veuillez réessayer.' 
        : 'Connection error with the server. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  
  // Grille responsive pour les témoignages
  return (
    <>
      {/* Toast flottant en haut à droite */}
      {message.text && (
        <div className={`testimonial-toast toast-${message.type}`} style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          minWidth: 220,
          maxWidth: 340,
          padding: '14px 24px',
          borderRadius: 8,
          background: message.type==='success' ? '#d1fae5' : message.type==='error' ? '#fee2e2' : '#e0e7ff',
          color: '#223',
          boxShadow: '0 4px 24px #0002',
          fontWeight: 600,
          fontSize: 16,
          transition: 'opacity 0.3s',
          opacity: message.text ? 1 : 0,
          pointerEvents: 'none',
        }}>
          {message.text}
        </div>
      )}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2 className="section-title">{lang === 'fr' ? 'Témoignages Clients' : 'Client Testimonials'}</h2>
          <div className="testimonials-grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            margin: '32px 0',
          }}>
            {testimonials.length > 0 ? (
              testimonials.sort((a, b) => new Date(b.date) - new Date(a.date)).map(testimonial => (
                <div key={testimonial.id} className="testimonial-card" style={{
                  background: '#fff',
                  borderRadius: 14,
                  boxShadow: '0 2px 12px #007bff11',
                  padding: '22px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  borderLeft: '6px solid #e0e7ff',
                  position: 'relative',
                  minWidth: 0,
                  maxWidth: 420,
                  wordBreak: 'break-word',
                }}>
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
                  <p className="testimonial-message" style={{margin:'12px 0',fontSize:16,lineHeight:1.6}}>
                    "{typeof testimonial.message === 'object' ? testimonial.message[lang] : testimonial.message}"
                  </p>
                  {/* Réactions et autres infos si besoin */}
                </div>
              ))
            ) : (
              <p>{lang === 'fr' ? 'Aucun témoignage pour le moment.' : 'No testimonials yet.'}</p>
            )}
          </div>
          {/* Pagination horizontale */}
          {/* The pagination logic is removed as per the edit hint. */}

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