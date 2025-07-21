import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Realisations = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';

  // État pour gérer la modal d'image
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données des réalisations
  const services = [
    {
      id: 1,
      title: {
        fr: "Développement Web",
        en: "Web Development"
      },
      description: {
        fr: "Création de sites vitrines, e-commerce, applications web sur mesure, optimisation SEO, maintenance.",
        en: "Showcase sites, e-commerce, custom web apps, SEO optimization, maintenance."
      },
      category: {
        fr: "Web",
        en: "Web"
      },
      type: 'web',
      image: "/images/realisations/carte3.jpeg",
      tags: ["Web", "E-commerce", "SEO", "Maintenance"],
      date: "2024"
    },
    {
      id: 2,
      title: {
        fr: "Informatique Industrielle",
        en: "Industrial IT"
      },
      description: {
        fr: "Automatisation, supervision SCADA, IoT, intégration de capteurs/actionneurs, monitoring industriel, programmation d’automates (PLC), réseaux industriels.",
        en: "Automation, SCADA supervision, IoT, sensor/actuator integration, industrial monitoring, PLC programming, industrial networks."
      },
      category: {
        fr: "Industrie",
        en: "Industry"
      },
      type: 'industry',
      image: "/images/realisations/carte5.jpeg",
      tags: ["Automatisation", "SCADA", "IoT", "PLC", "Réseaux"],
      date: "2024"
    },
    {
      id: 3,
      title: {
        fr: "Bureautique",
        en: "Office Automation"
      },
      description: {
        fr: "Création de documents Word, Excel, PowerPoint, automatisation de tâches, gestion de bases de données Access, reporting avancé.",
        en: "Word, Excel, PowerPoint documents, task automation, Access database management, advanced reporting."
      },
      category: {
        fr: "Bureautique",
        en: "Office"
      },
      type: 'office',
      image: "/images/realisations/carte4.jpeg",
      tags: ["Word", "Excel", "PowerPoint", "Access", "Automatisation"],
      date: "2024"
    }
  ];

  // Catégories disponibles
  const categories = [
    { id: 'all', type: 'all', name: { fr: 'Toutes', en: 'All' } },
    { id: 'web', type: 'web', name: { fr: 'Web', en: 'Web' } },
    { id: 'industry', type: 'industry', name: { fr: 'Industrie', en: 'Industry' } },
    { id: 'office', type: 'office', name: { fr: 'Bureautique', en: 'Office' } }
  ];

  // État pour le filtre
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Remplace realisations par services dans le rendu
  const filteredServices = services.filter(service => {
    if (selectedCategory === 'all') return true;
    return service.type === selectedCategory;
  });

  // Ouvrir la modal
  const openModal = (realisation) => {
    setSelectedImage(realisation);
    setIsModalOpen(true);
  };

  // Fermer la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <section id="realisations" className="services-section">
      <div className="container">
        <h2 className="section-title">{t('realisations.title')}</h2>
        <p className="section-subtitle">{t('realisations.subtitle')}</p>
        <div className="services-list">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>{lang === 'fr' ? 'Développement Web' : 'Web Development'}</h3>
            <ul>
              <li>{lang === 'fr' ? 'Création de sites personnels et blogs' : 'Personal websites and blogs'}</li>
              <li>{lang === 'fr' ? 'Sites e-commerce simples' : 'Simple e-commerce sites'}</li>
              <li>{lang === 'fr' ? 'Portfolios en ligne' : 'Online portfolios'}</li>
              <li>{lang === 'fr' ? 'Optimisation SEO de base' : 'Basic SEO optimization'}</li>
              <li>{lang === 'fr' ? 'Assistance à la prise en main d’un site' : 'Website onboarding help'}</li>
              <li>{lang === 'fr' ? 'Formations web pour débutants (en ligne ou à domicile)' : 'Web training for beginners (online or at home)'}</li>
            </ul>
            <button className="service-cta" onClick={() => window.location.href = '#contact'}>
              {lang === 'fr' ? 'Demander un devis ou une formation' : 'Request a quote or training'}
            </button>
          </div>
          <div className="service-card">
            <div className="service-icon">🏭</div>
            <h3>{lang === 'fr' ? 'Informatique & Objets connectés' : 'IT & Connected Devices'}</h3>
            <ul>
              <li>{lang === 'fr' ? 'Installation et configuration de box domotique' : 'Smart home box setup'}</li>
              <li>{lang === 'fr' ? 'Aide à la mise en place de capteurs connectés (alarme, météo, etc.)' : 'Help with connected sensors (alarm, weather, etc.)'}</li>
              <li>{lang === 'fr' ? 'Conseils pour sécuriser son réseau domestique' : 'Home network security advice'}</li>
              <li>{lang === 'fr' ? 'Dépannage informatique à domicile' : 'Home IT troubleshooting'}</li>
              <li>{lang === 'fr' ? 'Initiation à l’IoT pour particuliers' : 'IoT introduction for individuals'}</li>
              <li>{lang === 'fr' ? 'Formations à la domotique et à l’IoT (présentiel ou à domicile)' : 'Smart home & IoT training (in-person or at home)'}</li>
            </ul>
            <button className="service-cta" onClick={() => window.location.href = '#contact'}>
              {lang === 'fr' ? 'Demander un devis ou une formation' : 'Request a quote or training'}
            </button>
          </div>
          <div className="service-card">
            <div className="service-icon">🗂️</div>
            <h3>{lang === 'fr' ? 'Bureautique & Assistance' : 'Office & Assistance'}</h3>
            <ul>
              <li>{lang === 'fr' ? 'Création de CV et lettres de motivation' : 'CV and cover letter creation'}</li>
              <li>{lang === 'fr' ? 'Aide à la rédaction de documents Word, Excel, PowerPoint' : 'Help with Word, Excel, PowerPoint documents'}</li>
              <li>{lang === 'fr' ? 'Numérisation et mise en page de documents' : 'Document scanning and layout'}</li>
              <li>{lang === 'fr' ? 'Automatisation de tâches bureautiques simples' : 'Simple office task automation'}</li>
              <li>{lang === 'fr' ? 'Conseils pour organiser ses fichiers et sauvegardes' : 'Advice for organizing files and backups'}</li>
              <li>{lang === 'fr' ? 'Formations bureautique personnalisées (à domicile ou en ligne)' : 'Personalized office training (at home or online)'}</li>
            </ul>
            <button className="service-cta" onClick={() => window.location.href = '#contact'}>
              {lang === 'fr' ? 'Demander un devis ou une formation' : 'Request a quote or training'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Realisations; 