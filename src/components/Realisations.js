import React from 'react';
import { useTranslation } from 'react-i18next';

const Realisations = () => {
  const { t, i18n } = useTranslation();

  return (
    <section id="realisations" className="services-section">
      <div className="container">
        <h2 className="section-title">{t('realisations.title')}</h2>
        <p className="section-subtitle">{t('realisations.subtitle')}</p>
        <div className="services-list">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>{i18n.language === 'fr' ? 'Développement Web' : 'Web Development'}</h3>
            <ul>
              <li>{i18n.language === 'fr' ? 'Création de sites personnels et blogs' : 'Personal websites and blogs'}</li>
              <li>{i18n.language === 'fr' ? 'Sites e-commerce simples' : 'Simple e-commerce sites'}</li>
              <li>{i18n.language === 'fr' ? 'Portfolios en ligne' : 'Online portfolios'}</li>
              <li>{i18n.language === 'fr' ? 'Optimisation SEO de base' : 'Basic SEO optimization'}</li>
              <li>{i18n.language === 'fr' ? 'Assistance à la prise en main d’un site' : 'Website onboarding help'}</li>
              <li>{i18n.language === 'fr' ? 'Formations web pour débutants (en ligne ou à domicile)' : 'Web training for beginners (online or at home)'}</li>
            </ul>
            <button className="service-cta" onClick={() => window.location.href = '#contact'}>
              {i18n.language === 'fr' ? 'Demander un devis ou une formation' : 'Request a quote or training'}
            </button>
          </div>
          <div className="service-card">
            <div className="service-icon">🏭</div>
            <h3>{i18n.language === 'fr' ? 'Informatique & Objets connectés' : 'IT & Connected Devices'}</h3>
            <ul>
              <li>{i18n.language === 'fr' ? 'Installation et configuration de box domotique' : 'Smart home box setup'}</li>
              <li>{i18n.language === 'fr' ? 'Aide à la mise en place de capteurs connectés (alarme, météo, etc.)' : 'Help with connected sensors (alarm, weather, etc.)'}</li>
              <li>{i18n.language === 'fr' ? 'Conseils pour sécuriser son réseau domestique' : 'Home network security advice'}</li>
              <li>{i18n.language === 'fr' ? 'Dépannage informatique à domicile' : 'Home IT troubleshooting'}</li>
              <li>{i18n.language === 'fr' ? 'Initiation à l’IoT pour particuliers' : 'IoT introduction for individuals'}</li>
              <li>{i18n.language === 'fr' ? 'Formations à la domotique et à l’IoT (présentiel ou à domicile)' : 'Smart home & IoT training (in-person or at home)'}</li>
            </ul>
            <button className="service-cta" onClick={() => window.location.href = '#contact'}>
              {i18n.language === 'fr' ? 'Demander un devis ou une formation' : 'Request a quote or training'}
            </button>
          </div>
          <div className="service-card">
            <div className="service-icon">🗂️</div>
            <h3>{i18n.language === 'fr' ? 'Bureautique & Assistance' : 'Office & Assistance'}</h3>
            <ul>
              <li>{i18n.language === 'fr' ? 'Création de CV et lettres de motivation' : 'CV and cover letter creation'}</li>
              <li>{i18n.language === 'fr' ? 'Aide à la rédaction de documents Word, Excel, PowerPoint' : 'Help with Word, Excel, PowerPoint documents'}</li>
              <li>{i18n.language === 'fr' ? 'Numérisation et mise en page de documents' : 'Document scanning and layout'}</li>
              <li>{i18n.language === 'fr' ? 'Automatisation de tâches bureautiques simples' : 'Simple office task automation'}</li>
              <li>{i18n.language === 'fr' ? 'Conseils pour organiser ses fichiers et sauvegardes' : 'Advice for organizing files and backups'}</li>
              <li>{i18n.language === 'fr' ? 'Formations bureautique personnalisées (à domicile ou en ligne)' : 'Personalized office training (at home or online)'}</li>
            </ul>
            <button className="service-cta" onClick={() => window.location.href = '#contact'}>
              {i18n.language === 'fr' ? 'Demander un devis ou une formation' : 'Request a quote or training'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Realisations; 