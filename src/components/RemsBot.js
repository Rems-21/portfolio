import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Le RemsBot est maintenant beaucoup plus simple !

const RemsBot = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language === 'fr' ? 'fr' : 'en');
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour ! Je suis RemsBot 🤖. Pose-moi une question !", lang: 'fr' }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState(false); // Restauré pour l'effet de survol
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Animation CSS (pulsation bouton + ouverture chat)
  useEffect(() => {
    if (!document.getElementById('remsbot-anim')) {
      const style = document.createElement('style');
      style.id = 'remsbot-anim';
      style.innerHTML = `
      @keyframes remsbotOpen {0%{transform:scale(0.7);opacity:0;}100%{transform:scale(1);opacity:1;}}
      @keyframes remsbotPulse {
        0% { box-shadow: 0 0 0 0 #3b82f655; }
        70% { box-shadow: 0 0 0 16px #3b82f600; }
        100% { box-shadow: 0 0 0 0 #3b82f600; }
      }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Synchroniser la langue du bot avec celle du site
  useEffect(() => {
    const newLang = i18n.language === 'fr' ? 'fr' : 'en';
    setLang(newLang);
    setMessages([
      { from: "bot", text: newLang === 'fr' ? "Bonjour ! Je suis RemsBot 🤖. Pose-moi une question !" : "Hello! I'm RemsBot 🤖. Ask me anything!", lang: newLang }
    ]);
    setInput("");
  }, [i18n.language]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { from: "user", text: userMessage, lang }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot-qa');
      const data = await response.json();
      
      const botResponse = data.answer;
      if (typeof botResponse === 'string') {
        setMessages(prev => [...prev, { from: "bot", text: botResponse, lang }]);
      } else { // C'est un objet de suggestions
        setMessages(prev => [...prev, { from: "bot", ...botResponse }]);
      }
    } catch (error) {
      console.error("Erreur de communication avec le chatbot:", error);
      setMessages(prev => [...prev, { from: "bot", text: "Désolé, une erreur est survenue.", lang }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Restauré pour le bouton de changement de langue
  const handleSwitchLang = () => {
    const newLang = lang === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };
  
  // Couleurs dark
  const mainBlue = '#007bff';
  const darkBg = '#101828';
  const darkBot = '#1a2236';
  const lightBlue = '#e3eaff';
  const white = '#fff';
  const borderRadius = 28;
  const chatShadow = '0 8px 32px #0008';

  // Bouton flottant animé
  const widgetBtnStyle = {
    position: 'fixed',
    right: 24,
    bottom: 24,
    zIndex: 1001,
    background: mainBlue,
    color: white,     
    border: `2.5px solid ${mainBlue}`,
    borderRadius: '50%',
    width: 64,
    height: 64,
    boxShadow: '0 4px 24px #007bff44',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    fontWeight: 700,
    outline: 'none',
    animation: 'remsbotPulse 1.6s infinite',
  };
  const widgetBtnHover = {
    background: '#2563eb',
    color: white,
    border: `2.5px solid #2563eb`,
  };

  // Fenêtre du chat
  const chatBoxStyle = {
    position: 'fixed',
    right: 24,
    bottom: 100,
    zIndex: 1002,
    width: 'min(95vw, 380px)',
    maxWidth: 420,
    minHeight: 420,
    maxHeight: '80vh',
    borderRadius: borderRadius,
    boxShadow: chatShadow,
    background: darkBg,
    fontFamily: 'Segoe UI, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    border: `1.5px solid #223`,
    overflow: 'hidden',
    animation: open ? 'remsbotOpen 0.25s cubic-bezier(.4,2,.6,1)' : undefined,
  };

  // Responsive : centré sur mobile et plein écran
  const isMobile = window.innerWidth < 600;
  if (isMobile) {
    chatBoxStyle.right = 0;
    chatBoxStyle.left = 0;
    chatBoxStyle.top = 0;
    chatBoxStyle.bottom = 0;
    chatBoxStyle.width = '100vw';
    chatBoxStyle.maxWidth = '100vw';
    chatBoxStyle.height = '100vh';
    chatBoxStyle.borderRadius = 0;
    chatBoxStyle.zIndex = 9999;
    chatBoxStyle.minHeight = 0;
    chatBoxStyle.padding = 0;
  }
  // Agrandir le bouton flottant sur mobile
  if (isMobile) {
    widgetBtnStyle.width = 60;
    widgetBtnStyle.height = 60;
    widgetBtnStyle.fontSize = 28;
    widgetBtnStyle.right = 10;
    widgetBtnStyle.bottom = 10;
    widgetBtnStyle.zIndex = 9999;
  }

  // Styles adaptés pour mobile
  const mobileFont = isMobile ? 13 : 15;
  const mobileHeaderFont = isMobile ? 15 : 18;
  const mobilePadding = isMobile ? '8px 4px' : '18px 12px 8px 12px';
  const mobileInputPadding = isMobile ? '7px 10px' : '10px 14px';
  const mobileBtnSize = isMobile ? 32 : 40;
  const mobileGap = isMobile ? 5 : 10;

  return (
    <>
      {/* Bouton flottant animé */}
      {!open && (
        <button
          style={hover ? { ...widgetBtnStyle, ...widgetBtnHover } : widgetBtnStyle}
          onClick={() => setOpen(true)}
          aria-label={lang === 'fr' ? "Ouvrir RemsBot" : "Open RemsBot"}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <span style={{fontSize: isMobile ? 24 : 30}}>🤖</span>
        </button>
      )}
      {/* Fenêtre de chat flottante */}
      {open && (
        <div style={chatBoxStyle}>
          {/* En-tête */}
          <div style={{
            background: mainBlue,
            color: white,
            padding: isMobile ? '8px 0' : '13px 0',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: mobileHeaderFont,
            letterSpacing: 1,
            boxShadow: '0 2px 8px #007bff33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: mobileGap,
            position: 'relative',
            borderBottom: `1.5px solid #223`,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          }}>
            <span style={{fontSize: isMobile ? 18 : 22, marginLeft: isMobile ? 6 : 12, marginRight: isMobile ? 3 : 6}}>🤖</span> RemsBot
            <button onClick={handleSwitchLang} aria-label="Switch language" style={{
              position: 'absolute',
              left: isMobile ? 8 : 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: white,
              fontSize: isMobile ? 13 : 16,
              cursor: 'pointer',
              opacity: 0.8,
              fontWeight: 600
            }}>{lang === 'fr' ? 'EN' : 'FR'}</button>
            <button onClick={() => setOpen(false)} aria-label="Fermer" style={{
              position: 'absolute',
              right: isMobile ? 8 : 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: white,
              fontSize: isMobile ? 18 : 22,
              cursor: 'pointer',
              opacity: 0.7,
            }}>×</button>
          </div>
          {/* Texte d'information */}
          <div style={{
            background: '#e3eaff',
            color: '#223',
            fontSize: isMobile ? 11.5 : 13.5,
            padding: isMobile ? '5px 8px' : '8px 18px',
            textAlign: 'center',
            borderBottom: '1px solid #c7d2fe',
            fontStyle: 'italic',
            letterSpacing: 0.1,
          }}>
            {lang === 'fr'
              ? "Chaque question est traitée séparément. Les réponses ne tiennent pas compte des questions précédentes."
              : "Each question is handled independently. Answers do not take previous questions into account."}
          </div>
          {/* Messages */}
          <div style={{
            flex: 1,
            padding: mobilePadding,
            overflowY: 'auto',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            gap: mobileGap,
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.from === 'bot' ? 'flex-start' : 'flex-end',
                }}
              >
                {msg.type === 'suggestions' ? (
                  <div style={{
                    background: '#f1f5ff',
                    color: '#223',
                    border: '1.5px solid #b6c6e6',
                    borderRadius: 12,
                    padding: isMobile ? '8px 10px' : '13px 18px',
                    fontSize: mobileFont,
                    boxShadow: '0 2px 8px #b6c6e633',
                    margin: '0 0 0 2px',
                    maxWidth: '90%',
                    fontWeight: 500,
                  }}>
                    <div style={{fontWeight: 600, marginBottom: 4}}>
                      {msg.lang === 'fr' ? "Je n'ai pas compris. Essayez une de ces questions :" : "I didn't understand. Try one of these questions:"}
                    </div>
                    <ul style={{paddingLeft: 12, margin: 0}}>
                      {msg.suggestions && msg.suggestions.map((sugg, idx) => (
                        <li key={idx} style={{marginBottom: 2, cursor: 'pointer', textDecoration: 'underline', color: '#2563eb', fontSize: mobileFont}}
                            onClick={() => setInput(sugg)}>{sugg}</li>
                      ))}
                    </ul>
                  </div>
                ) :
                  <span style={{
                    background: msg.from === 'bot' ? darkBot : mainBlue,
                    color: msg.from === 'bot' ? lightBlue : white,
                    borderRadius: msg.from === 'bot' ? '14px 14px 14px 6px' : '14px 14px 6px 14px',
                    padding: isMobile ? '7px 10px' : '11px 18px',
                    fontSize: mobileFont,
                    maxWidth: '90%',
                    boxShadow: msg.from === 'bot' ? '0 2px 8px #10182888' : '0 2px 8px #007bff33',
                    margin: msg.from === 'bot' ? '0 0 0 2px' : '0 2px 0 0',
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    backgroundImage: 'none',
                    transition: 'background 0.2s',
                    fontWeight: 500,
                  }}>{msg.text}</span>
                }
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Saisie */}
          <div style={{
            display: 'flex',
            borderTop: `1.5px solid #223`,
            padding: isMobile ? 6 : 10,
            background: darkBot,
            alignItems: 'center',
            gap: mobileGap,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={lang === 'fr' ? "Écris ta question ici..." : "Type your question here..."}
              style={{
                flex: 1,
                border: `1.5px solid ${mainBlue}`,
                outline: 'none',
                fontSize: mobileFont,
                background: darkBg,
                borderRadius: 12,
                padding: mobileInputPadding,
                boxShadow: '0 1.5px 4px #10182844',
                color: lightBlue,
                transition: 'box-shadow 0.2s',
                fontWeight: 500,
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              style={{
                background: mainBlue,
                color: white,
                border: 'none',
                borderRadius: '50%',
                width: mobileBtnSize,
                height: mobileBtnSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? 15 : 20,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #007bff33',
                transition: 'background 0.2s',
              }}
              aria-label={lang === 'fr' ? "Envoyer" : "Send"}
              disabled={isLoading}
            >
              <svg width={isMobile ? 16 : 22} height={isMobile ? 16 : 22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RemsBot; 