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

  // Si on a les données, on affiche le détail, sinon un message générique
  const hasData = testimonialData.id && testimonialData.name && testimonialData.message;

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-success">
          <div className="success-icon">✅</div>
          <h2>{lang === 'fr' ? 'Témoignage vérifié !' : 'Testimonial Verified!'}</h2>
          <p>{lang === 'fr'
            ? 'Votre témoignage a bien été vérifié et sera affiché prochainement.'
            : 'Your testimonial has been successfully verified and will be displayed soon.'}
          </p>

          {hasData && (
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
          )}

          <div className="confirmation-actions">
            <button onClick={handleViewTestimonials} className="confirmation-btn primary">
              {lang === 'fr' ? 'Voir les témoignages' : 'View Testimonials'}
            </button>
            <button onClick={handleReturnHome} className="confirmation-btn secondary">
              {lang === 'fr' ? "Retour à l'accueil" : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialConfirmation; 