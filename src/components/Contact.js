import React from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  const openWhatsApp = (e) => {
    e.preventDefault();
    const phoneNumber = '+237681911029';
    const message = 'Bonjour! Je suis intéressé par vos services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const callPhone = (e) => {
    e.preventDefault();
    const phoneNumber = '+237681911029';
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const contactInfo = [
    {
      type: 'email',
      label: t('contact.email'),
      value: 'email',
      icon: '📧',
      link: 'mailto:dsonkouatremus@gmail.com'
    },
    {
      type: 'whatsapp',
      label: t('contact.whatsapp'),
      value: 'whatsapp',
      icon: '💬',
      action: openWhatsApp
    },
    {
      type: 'phone',
      label: t('contact.phone'),
      value: '+237 681 911 029',
      icon: '📞',
      action: callPhone
    },
    {
      type: 'linkedin',
      label: t('contact.linkedin'),
      value: 'linkedin',
      icon: '💼',
      link: 'https://linkedin.com/in/drremus'
    },
    {
      type: 'github',
      label: t('contact.github'),
      value: 'github',
      icon: '🐙',
      link: 'https://github.com/Rems-21'
    }
  ];

  return (
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
  );
};

export default Contact; 