import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from 'emailjs-com';

const Testimonials = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleRating = (r) => {
    setForm({ ...form, rating: r });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.name.trim() || !form.message.trim() || !form.email.trim()) {
      setError(lang === 'fr' ? 'Le nom, l\'email et le témoignage sont obligatoires.' : 'Name, email and testimonial are required.');
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
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (result.success && result.id) {
        emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          {
            to_name: form.name,
            to_email: form.email,
            verification_link: `${window.location.origin}/testimonialConfirmation?id=${result.id}`,
            name: form.name,
            position: form.position,
            company: form.company,
            rating: form.rating,
            message: form.message
          },
          process.env.REACT_APP_EMAILJS_USER_ID
        ).then(() => {
          setSuccess(lang === 'fr' ? 'Témoignage soumis ! Un email de vérification vous a été envoyé.' : 'Testimonial submitted! A verification email has been sent.');
          setForm({ name: '', position: '', company: '', email: '', message: '', rating: 5, agreeToVerification: false });
        }, (emailError) => {
          console.error('EmailJS Error:', emailError);
          setError(lang === 'fr' ? 'Le témoignage est sauvegardé, mais l\'email de vérification n\'a pas pu être envoyé.' : 'Testimonial saved, but the verification email could not be sent.');
        });
      } else {
        setError(result.message || (lang === 'fr' ? 'Une erreur est survenue lors de la soumission.' : 'An error occurred during submission.'));
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setError(lang === 'fr' ? 'Erreur de connexion au serveur.' : 'Server connection error.');
    } finally {
      setIsSubmitting(false);
    }
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
                  </div>
                  <div className="testimonial-rating-section">
                    <span className="testimonial-stars">
                      {[1, 2, 3, 4, 5].map(r => <span key={r} className={r <= testimonial.rating ? 'star active' : 'star'}>★</span>)}
                    </span>
                    {testimonial.verified && <span className="testimonial-verified" title={lang === 'fr' ? 'Vérifié' : 'Verified'}>✓</span>}
                  </div>
                </div>
                <p className="testimonial-message">"{testimonial.message}"</p>
              </div>
            ))
          ) : (
            <p>{lang === 'fr' ? 'Aucun témoignage pour le moment.' : 'No testimonials yet.'}</p>
          )}
        </div>
        <div className="testimonial-form-container">
          <h3 className="testimonial-form-title">{lang === 'fr' ? 'Ajouter un témoignage' : 'Add a testimonial'}</h3>
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
              <input type="text" name="name" placeholder={lang === 'fr' ? 'Votre nom complet *' : 'Your full name *'} value={form.name} onChange={handleChange} maxLength={50} required />
              <input type="text" name="position" placeholder={lang === 'fr' ? 'Votre poste (optionnel)' : 'Your position (optional)'} value={form.position} onChange={handleChange} maxLength={100}/>
            </div>
            <input type="email" name="email" placeholder={lang === 'fr' ? 'Votre adresse email *' : 'Your email address *'} value={form.email} onChange={handleChange} required />
            <textarea name="message" placeholder={lang === 'fr' ? 'Votre témoignage (20-500 caractères) *' : 'Your testimonial (20-500 characters) *'} value={form.message} onChange={handleChange} rows={4} minLength={20} maxLength={500} required />
            <div className="character-count">{form.message.length}/500</div>
            <div className="testimonial-rating">
              <span className="rating-label">{lang === 'fr' ? 'Note :' : 'Rating:'}</span>
              {[1, 2, 3, 4, 5].map(r => <span key={r} className={r <= form.rating ? 'star active' : 'star'} onClick={() => handleRating(r)} role="button">★</span>)}
            </div>
            <div className="verification-agreement">
              <label>
                <input type="checkbox" name="agreeToVerification" checked={form.agreeToVerification} onChange={handleChange} required />
                <span className="checkbox-text">
                  {lang === 'fr' ? 'J\'accepte que mon témoignage soit vérifié par email.' : 'I agree that my testimonial will be verified by email.'}
                </span>
              </label>
            </div>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? (lang === 'fr' ? 'Envoi en cours...' : 'Sending...') : (lang === 'fr' ? 'Envoyer le témoignage' : 'Submit testimonial')}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 