// --- Logique de traitement du langage pour le RemsBot ---

// Liste de mots vides pour chaque langue
const STOPWORDS = {
    fr: ["le", "la", "les", "un", "une", "des", "de", "du", "en", "et", "à", "au", "aux", "pour", "par", "sur", "dans", "avec", "sans", "je", "tu", "il", "elle", "nous", "vous", "ils", "elles", "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "notre", "votre", "leur", "leurs", "ce", "cette", "ces", "qui", "que", "quoi", "dont", "où", "est", "suis", "es", "sont", "être", "avoir", "fait", "fais", "faites", "peux", "puis", "vais", "va", "allons", "allez", "ont", "avez", "as", "aujourd'hui", "demain", "hier", "là", "ici", "ça", "cela", "on", "y", "se", "sa", "ses", "seulement", "aussi", "mais", "ou", "donc", "or", "ni", "car"],
    en: ["the", "a", "an", "and", "or", "but", "if", "then", "so", "for", "to", "of", "in", "on", "at", "by", "with", "without", "is", "are", "am", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "i", "you", "he", "she", "it", "we", "they", "my", "your", "his", "her", "its", "our", "their", "this", "that", "these", "those", "who", "whom", "which", "what", "where", "when", "why", "how", "here", "there", "just", "also", "only", "as", "from", "about", "into", "over", "after", "before", "again", "once"]
};

// --- Synonymes pour chaque langue ---
const SYNONYMS = {
    fr: { dev: "développeur", web: "web", appli: "application", boulot: "travail", pc: "ordinateur", graph: "graphique", info: "informatique", scada: "supervision", auto: "automatisme", automate: "automate", industrie: "industrie", projet: "projets", client: "clients", témoignage: "avis", formation: "formation", livre: "livre", outil: "outil", logiciel: "logiciel", framework: "framework", js: "javascript", node: "node", pao: "pao", adobe: "adobe", office: "office" },
    en: { dev: "developer", web: "web", app: "application", job: "work", pc: "computer", graphic: "graphic", design: "design", it: "computing", automation: "automation", plc: "plc", industry: "industry", project: "projects", client: "clients", testimonial: "review", training: "training", book: "book", tool: "tool", software: "software", framework: "framework", js: "javascript", node: "node", dtp: "dtp", adobe: "adobe", office: "office" }
};

// Fonction de distance de Levenshtein (pour la similarité des mots)
function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}

// Remplacement des synonymes dans la phrase utilisateur
function replaceSynonyms(text, lang, qaDatabase) {
    const synonyms = { ...SYNONYMS[lang] };
    qaDatabase.forEach(qa => {
        if (qa.keywords && qa.keywords[lang]) {
            qa.keywords[lang].forEach(word => {
                if (!synonyms[word]) synonyms[word] = word;
            });
        }
    });
    const words = text.split(/\s+/);
    return words.map(word => synonyms[word] || word).join(' ');
}

// Fonction d'extraction des mots-clés d'une phrase
function extractKeywords(text, lang, qaDatabase) {
    let clean = text.toLowerCase();
    clean = replaceSynonyms(clean, lang, qaDatabase);
    return clean
        .replace(/[^\w\sàâçéèêëîïôûùüÿñæœ'-]/gi, ' ')
        .split(/\s+/)
        .filter(word => word && !STOPWORDS[lang].includes(word));
}

// Fonction principale pour trouver la meilleure réponse
function findBestAnswer(message, lang, qaDatabase) {
    const userKeywords = extractKeywords(message, lang, qaDatabase);
    let best = null;
    let maxMatch = 0;

    for (const qa of qaDatabase) {
        if (!qa.keywords || !qa.keywords[lang]) continue;
        const qaKeywords = qa.keywords[lang];
        const matches = userKeywords.filter(uk =>
            qaKeywords.some(qk => levenshtein(uk, qk) <= (qk.length > 5 ? 2 : 1))
        ).length;
        if (matches > maxMatch) {
            best = qa;
            maxMatch = matches;
        }
    }

    if (best && maxMatch > 0) {
        const possibleAnswers = best.answer[lang];
        return Array.isArray(possibleAnswers) ? possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)] : possibleAnswers;
    }

    // Si aucune correspondance, préparez des suggestions
    const suggestions = qaDatabase
        .map(qa => ({
            question: qa.keywords[lang] ? qa.keywords[lang][0] : '',
            dist: levenshtein(message.toLowerCase(), qa.keywords[lang] ? qa.keywords[lang][0].toLowerCase() : '')
        }))
        .filter(q => q.question)
        .sort((a, b) => a.dist - b.dist)
        .map(q => q.question)
        .slice(0, 3);
    
    return { type: 'suggestions', suggestions, lang };
}

module.exports = { findBestAnswer }; 