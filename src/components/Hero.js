import React from 'react';
import { useTranslation } from 'react-i18next';
import avatar from '../assets/avatar2.jpg';

const Hero = () => {
  const { t } = useTranslation();

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero hero-pro wow-fade">
      <div className="hero-pro-container hero-pro-normal">
        <div className="hero-pro-photo-wrap">
          <img src={avatar} alt="Mon portrait" className="hero-pro-photo" />
          <div className="hero-photo-overlay"></div>
          <h2 className="hero-name-desktop">D.Remus</h2>
        </div>
        <div className="hero-pro-text">
          <h1 className="hero-title">{t('hero.title')}</h1>
          <h2 className="hero-name-mobile">D. Remus</h2>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <button onClick={scrollToProjects} className="hero-cta">
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 