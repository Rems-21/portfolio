import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const parcoursData = [
  {
    year: '2021-Aujourd’hui',
    fr: {
      title: 'Développeur Web Freelance',
      desc: 'Projets variés, clients internationaux'
    },
    en: {
      title: 'Freelance Web Developer',
      desc: 'Various projects, international clients'
    }
  },
  {
    year: '2023-Aujourd’hui',
    fr: {
      title: 'Étudiant en Informatique Industrielle',
      desc: 'ENSET, Douala'
    },
    en: {
      title: 'Industrial Computing Student',
      desc: 'ENSET, Douala'
    }
  },
  {
    year: '2024-2025',
    fr: {
      title: 'Chef de projet',
      desc: 'ENSET, Douala'
    },
    en: {
      title: 'Project Manager',
      desc: 'ENSET, Douala'
    }
  },
  {
    year: '2023',
    fr: {
      title: 'BAC C',
      desc: 'Lycée Bilingue de Baleng, Bafoussam'
    },
    en: {
      title: 'BAC C',
      desc: 'GBHS Baleng, Bafoussam'
    }
  },
];

const Parcours = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';

  return (
    <>
      <Helmet>
        <title>{lang === 'fr' ? 'Parcours – Remus Herlandes' : 'Background – Remus Herlandes'}</title>
        <meta name="description" content={lang === 'fr'
          ? 'Découvrez le parcours académique et professionnel de Remus Herlandes.'
          : 'Discover the academic and professional background of Remus Herlandes.'}
        />
        <meta property="og:title" content={lang === 'fr' ? 'Parcours – Remus Herlandes' : 'Background – Remus Herlandes'} />
        <meta property="og:description" content={lang === 'fr'
          ? 'Découvrez le parcours académique et professionnel de Remus Herlandes.'
          : 'Discover the academic and professional background of Remus Herlandes.'}
        />
      </Helmet>
      <section id="parcours" className="parcours">
        <div className="container">
          <h2 className="section-title">{lang === 'fr' ? 'Mon Parcours' : 'My Journey'}</h2>
          <div className="timeline">
            {parcoursData.map((step, idx) => (
              <div className="timeline-item" key={idx}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-year">{step.year}</span>
                  <h3 className="timeline-title">{step[lang].title}</h3>
                  <p className="timeline-desc">{step[lang].desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Parcours; 