import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  return (
    <>
      <Helmet>
        <title>{lang === 'fr' ? 'Contact – Remus Herlandes' : 'Contact – Remus Herlandes'}</title>
        <meta name="description" content={lang === 'fr'
          ? 'Contactez Remus Herlandes pour vos projets de graphisme, développement web, ou toute demande professionnelle.'
          : 'Contact Remus Herlandes for your graphic design, web development, or any professional inquiry.'}
        />
        <meta property="og:title" content={lang === 'fr' ? 'Contact – Remus Herlandes' : 'Contact – Remus Herlandes'} />
        <meta property="og:description" content={lang === 'fr'
          ? 'Contactez Remus Herlandes pour vos projets de graphisme, développement web, ou toute demande professionnelle.'
          : 'Contact Remus Herlandes for your graphic design, web development, or any professional inquiry.'}
        />
      </Helmet>
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">{t('contact.title')}</h2>
          
          <div className="contact-content">
            <div className="contact-description">
              <p>{t('contact.description')}</p>
            </div>
            
            <div className="contact-methods">
              {contactInfo.map((contact) =>
                contact.action ? (
                  <button
                    key={contact.type}
                    onClick={contact.action}
                    className="contact-item"
                  >
                    <span className="contact-icon">{contact.icon}</span>
                    <div className="contact-details">
                      <span className="contact-label">{contact.label}</span>
                      <span className="contact-value">{contact.value}</span>
                    </div>
                  </button>
                ) : (
                  <a
                    key={contact.type}
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-item"
                  >
                    <span className="contact-icon">{contact.icon}</span>
                    <div className="contact-details">
                      <span className="contact-label">{contact.label}</span>
                      <span className="contact-value">{contact.value}</span>
                    </div>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact; 