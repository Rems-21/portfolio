import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Hamburger à gauche */}
        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        {/* Logo centré sur mobile */}
        <div className="nav-logo">
          <span>DRH</span>
        </div>
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home" className="nav-link" onClick={(e) => handleNavClick(e, 'home')}>
            {t('nav.home')}
          </a>
          <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>
            {t('nav.about')}
          </a>
          <a href="#parcours" className="nav-link" onClick={(e) => handleNavClick(e, 'parcours')}>
            {t('nav.parcours')}
          </a>
          <a href="#projects" className="nav-link" onClick={(e) => handleNavClick(e, 'projects')}>
            {t('nav.projects')}
          </a>
          <a href="#realisations" className="nav-link" onClick={(e) => handleNavClick(e, 'realisations')}>
            {i18n.language === 'fr' ? 'Services' : 'Services'}
          </a>
          <a href="#testimonials" className="nav-link" onClick={(e) => handleNavClick(e, 'testimonials')}>
            {t('nav.testimonials')}
          </a>
          <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, 'contact')}>
            {t('nav.contact')}
          </a>
        </div>
        {/* Bouton de langue à droite */}
        <button onClick={toggleLanguage} className="nav-language">
          {i18n.language === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 