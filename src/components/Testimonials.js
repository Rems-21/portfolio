import React, { useState, useEffect } from 'react';
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

  const handleReaction = (testimonialId, sticker) => {
    // La logique des réactions pourrait être déplacée vers le backend à l'avenir
    setTestimonials(prevTestimonials => {
      return prevTestimonials.map(t => {
        if (t.id === testimonialId) {
          const newReactions = { ...t.reactions };
          newReactions[sticker] = (newReactions[sticker] || 0) + 1;
          return { ...t, reactions: newReactions };
        }
        return t;
      });
    });
    setActiveReactionPicker(null);
  };

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <h2 className="section-title">{lang === 'fr' ? 'Témoignages Clients' : 'Client Testimonials'}</h2>
        
        <div className="testimonials-grid">
          {testimonials.length > 0 ? (
            testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
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
            ))
          ) : (
            <p>{lang === 'fr' ? 'Aucun témoignage pour le moment.' : 'No testimonials yet.'}</p>
          )}
        </div>

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
          {success && <div className="testimonial-success">{success}</div>}
          {error && <div className="testimonial-error">{error}</div>}
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
  );
};

export default Testimonials; 