import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.parcours': 'Parcours',
      'nav.projects': 'Projets',
      'nav.realisations': 'Réalisations',
      'nav.testimonials': 'Témoignages',
      'nav.contact': 'Contact',
      'nav.language': 'Langue',
      
      // Hero Section
      'hero.title': 'Étudiant en informatique industrielle & Développeur Web Freelance',
      'hero.subtitle': 'Passionné par la création de sites modernes, l’informatique industrielle et l’apprentissage continu.',
      'hero.cta': 'Découvrir mes projets',
      
      // About Section
      'about.title': 'À propos de moi',
      'about.description': "Étudiant en deuxième année d'informatique industrielle à l'université, passionné par le développement web et l'informatique industrielle, je réalise des sites modernes en freelance. J'aime apprendre, relever des défis techniques et aider mes clients à concrétiser leurs projets numériques. L'informatique industrielle me permet de relier le monde physique et le digital, notamment via l'automatisation, les réseaux industriels et les systèmes SCADA.",
      'about.skills.title': 'Compétences',
      'about.skills.webgroup': 'Développement Web',
      'about.skills.industrialgroup': 'Informatique Industrielle',
      'about.skills.web': 'Développement Web',
      'about.skills.frontend': 'Front-end (Django, HTML, CSS, JS)',
      'about.skills.backend': 'Back-end (Node.js, Express)',
      'about.skills.freelance': 'Gestion de projet freelance',
      'about.skills.university': 'Formation universitaire',
      'about.skills.industrial': 'Informatique Industrielle',
      'about.skills.automation': 'Automatisation',
      'about.skills.react': 'React.js',
      'about.skills.node': 'Node.js',
      'about.skills.plc': 'Programmation d’automates (PLC)',
      'about.skills.scada': 'Systèmes SCADA',
      'about.skills.networks': 'Réseaux industriels',
      'about.skills.iot': 'IoT & capteurs',
      
      // Projects Section
      'projects.title': 'Mes Projets',
      'projects.view': 'Voir le projet',
      'projects.source': 'Code source',
      
      // Realisations Section
      'realisations.title': 'Mes Services',
      'realisations.subtitle': 'Découvrez les services que je propose dans le web, l’informatique industrielle et la bureautique.',
      'services.web': 'Développement Web : création de sites vitrines, e-commerce, applications web sur mesure, optimisation SEO, maintenance.',
      'services.industrial': 'Informatique industrielle : automatisation, supervision SCADA, IoT, intégration de capteurs/actionneurs, monitoring industriel.',
      'services.office': 'Bureautique : création de documents Word, Excel, PowerPoint, automatisation de tâches, gestion de bases de données Access.',
      'realisations.view': 'Voir',
      'realisations.categories.all': 'Toutes',
      'realisations.categories.flyers': 'Flyers',
      'realisations.categories.posters': 'Affiches',
      'realisations.categories.brochures': 'Brochures',
      'realisations.categories.banners': 'Bannières',
      'realisations.categories.logos': 'Logos',
      'realisations.categories.packaging': 'Packaging',
      
      // Contact Section
      'contact.title': 'Contact',
      'contact.description': 'Intéressé par une collaboration ? N\'hésitez pas à me contacter.',
      'contact.email': 'Email',
      'contact.whatsapp': 'WhatsApp',
      'contact.phone': 'Téléphone',
      'contact.linkedin': 'LinkedIn',
      'contact.github': 'GitHub',
      
      // Footer
      'footer.rights': 'Tous droits réservés'
    }
  },
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.parcours': 'Parcours',
      'nav.projects': 'Projects',
      'nav.realisations': 'Realisations',
      'nav.testimonials': 'Testimonials',
      'nav.contact': 'Contact',
      'nav.language': 'Language',
      
      // Hero Section
      'hero.title': 'Industrial IT Student & Freelance Web Developer',
      'hero.subtitle': 'Passionate about building modern websites, industrial IT and continuous learning.',
      'hero.cta': 'Discover my projects',
      'hero.profile': "Second-year industrial IT student, freelance web developer and passionate about industrial IT.",
      
      // About Section
      'about.title': 'About Me',
      'about.description': "Second-year industrial IT student at university, passionate about web development and industrial IT, I build modern websites as a freelancer. I love learning, tackling technical challenges, and helping clients bring their digital projects to life. Industrial IT allows me to bridge the physical and digital worlds, especially through automation, industrial networks, and SCADA systems.",
      'about.skills.title': 'Skills',
      'about.skills.webgroup': 'Web Development',
      'about.skills.industrialgroup': 'Industrial IT',
      'about.skills.web': 'Web Development',
      'about.skills.frontend': 'Front-end (React, HTML, CSS, JS)',
      'about.skills.backend': 'Back-end (Node.js, Express)',
      'about.skills.freelance': 'Freelance project management',
      'about.skills.university': 'University education',
      'about.skills.industrial': 'Industrial IT',
      'about.skills.automation': 'Automation',
      'about.skills.react': 'React.js',
      'about.skills.node': 'Node.js',
      'about.skills.plc': 'PLC programming',
      'about.skills.scada': 'SCADA systems',
      'about.skills.networks': 'Industrial networks',
      'about.skills.iot': 'IoT & sensors',
      
      // Projects Section
      'projects.title': 'My Projects',
      'projects.view': 'View project',
      'projects.source': 'Source code',
      
      // Realisations Section
      'realisations.title': 'My Services',
      'realisations.subtitle': 'Discover the services I offer in web, industrial IT and office automation.',
      'services.web': 'Web development: showcase sites, e-commerce, custom web apps, SEO optimization, maintenance.',
      'services.industrial': 'Industrial IT: automation, SCADA supervision, IoT, sensor/actuator integration, industrial monitoring.',
      'services.office': 'Office automation: Word, Excel, PowerPoint documents, task automation, Access database management.',
      'realisations.view': 'View',
      'realisations.categories.all': 'All',
      'realisations.categories.flyers': 'Flyers',
      'realisations.categories.posters': 'Posters',
      'realisations.categories.brochures': 'Brochures',
      'realisations.categories.banners': 'Banners',
      'realisations.categories.logos': 'Logos',
      'realisations.categories.packaging': 'Packaging',
      
      // Contact Section
      'contact.title': 'Contact',
      'contact.description': 'Interested in collaboration? Don\'t hesitate to contact me.',
      'contact.email': 'Email',
      'contact.whatsapp': 'WhatsApp',
      'contact.phone': 'Phone',
      'contact.linkedin': 'LinkedIn',
      'contact.github': 'GitHub',
      
      // Footer
      'footer.rights': 'All rights reserved'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 