import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  const industrialSkills = [
    { key: 'industrial', icon: '🏭' },
    { key: 'automation', icon: '⚙️' },
    { key: 'plc', icon: '🔧' },
    { key: 'scada', icon: '📊' },
    { key: 'networks', icon: '🌐' },
    { key: 'iot', icon: '📡' }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">{t('about.title')}</h2>
        
        <div className="about-content">
          <div className="about-text">
            <p className="about-description">
              {t('about.description')}
            </p>
            <div className="about-code-card">
              <pre className="about-code-block">
                <span className="code-keyword">let</span> Me <span className="code-operator">=</span> <span className="code-brace">&#123;</span>{"\n"}
                <span className="code-property">nom</span><span className="code-operator">:</span> <span className="code-string">"D.Remus"</span>,{"\n"}
                <span className="code-property">statut</span><span className="code-operator">:</span> <span className="code-string">"Étudiant en 2ème année informatique industrielle & freelance web"</span>,{"\n"}
                <span className="code-property">skills</span><span className="code-operator">:</span> [<span className="code-string">"Django"</span>, <span className="code-string">"c/c++/python/crafcet"</span>, <span className="code-string">"HTML/CSS/js/php"</span>, <span className="code-string">"Gestion projet"</span>],{"\n"}
                <span className="code-property">devise</span><span className="code-operator">:</span> <span className="code-string">"Créer, optimiser, sécuriser."</span>{"\n"}
                <span className="code-brace">&#125;;</span>
              </pre>
            </div>
          </div>
          
          <div className="about-skills">
            <h3>{t('about.skills.title')}</h3>
            <div className="skills-group">
              <h4>{t('about.skills.webgroup')}</h4>
              <div className="skills-grid">
                <div className="skill-item"><span className="skill-icon">🎨</span><span className="skill-name">CSS</span></div>
                <div className="skill-item"><span className="skill-icon">🔤</span><span className="skill-name">HTML</span></div>
                <div className="skill-item"><span className="skill-icon">💻</span><span className="skill-name">JavaScript</span></div>
                <div className="skill-item"><span className="skill-icon">🌐</span><span className="skill-name">Django</span></div>
                <div className="skill-item"><span className="skill-icon">🐘</span><span className="skill-name">PHP</span></div>
                <div className="skill-item"><span className="skill-icon">🐍</span><span className="skill-name">Python</span></div>
              </div>
              <h4 style={{marginTop: '1.2rem'}}>{t('about.skills.industrialgroup')}</h4>
              <div className="skills-grid">
                {industrialSkills.map((skill) => (
                  <div key={skill.key} className="skill-item">
                    <span className="skill-icon">{skill.icon}</span>
                    <span className="skill-name">{t(`about.skills.${skill.key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 