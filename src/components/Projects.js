import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const projects = [
  {
    id: 1,
    title: {
      fr: "Maison intelligente connectée",
      en: "Smart Home Automation"
    },
    description: {
      fr: "Conception et réalisation d'une maison intelligente pilotable via smartphone (éclairage, sécurité, capteurs, etc.)",
      en: "Design and implementation of a smart home controllable via smartphone (lighting, security, sensors, etc.)"
    },
    technologies: ['IoT', 'React Native', 'Node.js'],
    image: '🏠'
  },
  {
    id: 2,
    title: {
      fr: "Couveuse connectée",
      en: "Connected Incubator"
    },
    description: {
      fr: "Couveuse intelligente avec contrôle à distance et monitoring des paramètres vitaux.",
      en: "Smart incubator with remote control and vital parameters monitoring."
    },
    technologies: ['IoT', 'Arduino', 'Web App'],
    image: '🍼'
  },
  {
    id: 3,
    title: {
      fr: "Serre agricole automatisée",
      en: "Automated Greenhouse"
    },
    description: {
      fr: "Serre connectée pour le contrôle de l'humidité, température et arrosage.",
      en: "Connected greenhouse for humidity, temperature and irrigation control."
    },
    technologies: ['IoT', 'Raspberry Pi', 'Sensors'],
    image: '🌱'
  },
  {
    id: 4,
    title: {
      fr: "Site e-commerce",
      en: "E-commerce Website"
    },
    description: {
      fr: "Développement d'un site e-commerce moderne avec gestion de catalogue, panier et paiement en ligne.",
      en: "Development of a modern e-commerce website with catalog, cart and online payment management."
    },
    technologies: ['React', 'Node.js', 'Stripe'],
    image: '🛒'
  },
  {
    id: 5,
    title: {
      fr: "Application de gestion de stock",
      en: "Stock Management App"
    },
    description: {
      fr: "Application web pour la gestion des stocks, alertes de seuil et reporting.",
      en: "Web app for stock management, threshold alerts and reporting."
    },
    technologies: ['React', 'Express', 'MongoDB'],
    image: '📦'
  },
  {
    id: 6,
    title: {
      fr: "Système de monitoring industriel",
      en: "Industrial Monitoring System"
    },
    description: {
      fr: "Développement d'un système de monitoring industriel pour la supervision en temps réel.",
      en: "Development of an industrial monitoring system for real-time supervision."
    },
    technologies: ['React', 'Node.js', 'WebSocket'],
    image: '🏭'
  },
  {
    id: 7,
    title: {
      fr: "Autres projets",
      en: "Other projects"
    },
    description: {
      fr: "Participation à divers projets : sites vitrines, automatisation, outils métiers, etc.",
      en: "Participation in various projects: showcase websites, automation, business tools, etc."
    },
    technologies: ['Web', 'IoT', 'Automatisation'],
    image: '✨'
  },
];

const Projects = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (prev === projects.length - 1) {
        return prev - 1;
      }
      return prev + 1;
    });
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return prev + 1;
      }
      return prev - 1;
    });
  };

  return (
    <>
      <Helmet>
        <title>{lang === 'fr' ? 'Projets – Remus Herlandes' : 'Projects – Remus Herlandes'}</title>
        <meta name="description" content={lang === 'fr'
          ? 'Découvrez les projets réalisés par Remus Herlandes : web, graphisme, IA, automation, etc.'
          : 'Discover projects by Remus Herlandes: web, graphic design, AI, automation, and more.'}
        />
        <meta property="og:title" content={lang === 'fr' ? 'Projets – Remus Herlandes' : 'Projects – Remus Herlandes'} />
        <meta property="og:description" content={lang === 'fr'
          ? 'Découvrez les projets réalisés par Remus Herlandes : web, graphisme, IA, automation, etc.'
          : 'Discover projects by Remus Herlandes: web, graphic design, AI, automation, and more.'}
        />
      </Helmet>
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">{t('projects.title')}</h2>
          <div className="projects-slider">
            <button 
              className="slider-arrow left" 
              onClick={goToPrev}
              aria-label="Précédent"
            >
              &#8592;
            </button>
            
            <div className="projects-container">
              {projects.map((project, idx) => {
                const distance = Math.abs(idx - currentIndex);
                const isActive = idx === currentIndex;
                const isVisible = distance <= 1;
                
                return (
                  <div 
                    key={project.id}
                    className={`project-card ${isActive ? 'active' : ''}`}
                    style={{
                      transform: `translateX(${(idx - currentIndex) * 100}%)`,
                      opacity: isVisible ? (isActive ? 1 : 0.6) : 0,
                      zIndex: isActive ? 10 : 5,
                      filter: isActive ? 'none' : 'blur(1px) grayscale(40%)'
                    }}
                  >
                    <div className="project-image">
                      <span className="project-icon">{project.image}</span>
                    </div>
                    <div className="project-content">
                      <h3 className="project-title">
                        {project.title[lang]}
                      </h3>
                      <p className="project-description">
                        {project.description[lang]}
                      </p>
                      <div className="project-technologies">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      <button 
                        className="project-detail-btn"
                        onClick={() => window.open('https://github.com/Rems-21', '_blank')}
                      >
                        {lang === 'fr' ? 'Détails sur GitHub' : 'Details on GitHub'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button 
              className="slider-arrow right" 
              onClick={goToNext}
              aria-label="Suivant"
            >
              &#8594;
            </button>
          </div>
          
          <div className="projects-progress-bar-wrapper">
            <div
              className="projects-progress-bar"
              style={{ width: `${((currentIndex + 1) / projects.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;