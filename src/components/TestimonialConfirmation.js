import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';

const TestimonialConfirmation = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Récupérer les paramètres de l'URL
  const testimonialData = {
    id: searchParams.get('id'),
    name: searchParams.get('name'),
    position: searchParams.get('position'),
    company: searchParams.get('company'),
    rating: searchParams.get('rating'),
    message: searchParams.get('message')
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleViewTestimonials = () => {
    navigate('/#testimonials');
  };

  // Vérifier si tous les paramètres sont présents
  const isValidData = testimonialData.id && testimonialData.name && testimonialData.message;

  if (!isValidData) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-error">
            <div className="error-icon">⚠️</div>
            <h2>{lang === 'fr' ? 'Données manquantes' : 'Missing Data'}</h2>
            <p>{lang === 'fr' ? 'Les informations du témoignage sont incomplètes.' : 'The testimonial information is incomplete.'}</p>
            <button onClick={handleReturnHome} className="confirmation-btn">
              {lang === 'fr' ? 'Retour à l\'accueil' : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-success">
          <div className="success-icon">✅</div>
          <h2>{lang === 'fr' ? 'Témoignage vérifié !' : 'Testimonial Verified!'}</h2>
          <p>{lang === 'fr' ? 'Votre témoignage a été vérifié avec succès.' : 'Your testimonial has been successfully verified.'}</p>
          
          <div className="testimonial-summary">
            <div className="testimonial-info">
              <h3>{testimonialData.name}</h3>
              <p>{testimonialData.position} - {testimonialData.company}</p>
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={`star ${index < parseInt(testimonialData.rating) ? 'active' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="testimonial-message">
              <p>"{testimonialData.message}"</p>
            </div>
          </div>

          <div className="confirmation-actions">
            <button onClick={handleViewTestimonials} className="confirmation-btn primary">
              {lang === 'fr' ? 'Voir les témoignages' : 'View Testimonials'}
            </button>
            <button onClick={handleReturnHome} className="confirmation-btn secondary">
              {lang === 'fr' ? 'Retour à l\'accueil' : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialConfirmation; 