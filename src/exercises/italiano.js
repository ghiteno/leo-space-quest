/**
 * Italiano / Grammatica Exercises — Riflessione sulla lingua
 * 
 * Target: 10-11 anni (fine quinta elementare / inizio prima media)
 * Based on CROSS PO-I: Riflessione sulla lingua (grammar, syntax, verbs,
 * connectives, pronouns, orthography, logical analysis)
 * 
 * Types:
 * A) Analisi logica — identify subject/predicate/complement
 * B) Verbi — tense/mood identification, conjugation
 * C) Connettivi — choose correct connective
 * D) Ortografia — spot correctly spelled word
 * E) Sinonimi/Lessico — find synonym among options
 */

import { seededRandom, shuffleArray } from '../gameEngine.js';

// === DATABASE: ANALISI LOGICA ===
const ANALISI_LOGICA = [
  // Simple (days 1-10)
  { frase: "Il gatto dorme sul divano.", domanda: "Qual è il SOGGETTO?", answer: "Il gatto", options: ["Il gatto", "dorme", "sul divano", "il divano"], hint: "Il soggetto è chi compie l'azione." },
  { frase: "Marco mangia una mela.", domanda: "Qual è il PREDICATO?", answer: "mangia", options: ["Marco", "mangia", "una mela", "mela"], hint: "Il predicato è l'azione." },
  { frase: "La maestra spiega la lezione.", domanda: "Qual è il COMPLEMENTO OGGETTO?", answer: "la lezione", options: ["La maestra", "spiega", "la lezione", "la"], hint: "Il complemento oggetto risponde a: che cosa?" },
  { frase: "I bambini giocano nel parco.", domanda: "Qual è il SOGGETTO?", answer: "I bambini", options: ["I bambini", "giocano", "nel parco", "il parco"], hint: "Chi compie l'azione?" },
  { frase: "Il treno parte dalla stazione.", domanda: "Qual è il COMPLEMENTO DI LUOGO?", answer: "dalla stazione", options: ["Il treno", "parte", "dalla stazione", "dalla"], hint: "Il complemento di luogo risponde a: da dove?" },
  { frase: "Lucia legge un libro interessante.", domanda: "Qual è il PREDICATO?", answer: "legge", options: ["Lucia", "legge", "un libro", "interessante"], hint: "Il predicato indica l'azione." },
  { frase: "Mia sorella studia matematica.", domanda: "Qual è il SOGGETTO?", answer: "Mia sorella", options: ["Mia sorella", "studia", "matematica", "mia"], hint: "Il soggetto è chi compie l'azione." },
  { frase: "Il cane abbaia forte.", domanda: "Qual è il COMPLEMENTO DI MODO?", answer: "forte", options: ["Il cane", "abbaia", "forte", "il"], hint: "Il complemento di modo risponde a: come?" },
  // Medium (days 5-15)
  { frase: "Ieri ho regalato un libro a Giovanni.", domanda: "Qual è il COMPLEMENTO DI TERMINE?", answer: "a Giovanni", options: ["Ieri", "un libro", "a Giovanni", "ho regalato"], hint: "Il complemento di termine risponde a: a chi?" },
  { frase: "La nonna prepara la cena in cucina.", domanda: "Qual è il COMPLEMENTO DI LUOGO?", answer: "in cucina", options: ["La nonna", "la cena", "in cucina", "prepara"], hint: "Dove avviene l'azione?" },
  { frase: "Durante l'estate, i ragazzi vanno al mare.", domanda: "Qual è il COMPLEMENTO DI TEMPO?", answer: "Durante l'estate", options: ["Durante l'estate", "i ragazzi", "vanno", "al mare"], hint: "Quando avviene l'azione?" },
  { frase: "Il professore corregge i compiti con attenzione.", domanda: "Qual è il COMPLEMENTO DI MODO?", answer: "con attenzione", options: ["Il professore", "corregge", "i compiti", "con attenzione"], hint: "Come viene svolta l'azione?" },
  // Complex (days 10+)
  { frase: "Per la pioggia, la partita è stata rinviata.", domanda: "Qual è il COMPLEMENTO DI CAUSA?", answer: "Per la pioggia", options: ["Per la pioggia", "la partita", "è stata rinviata", "rinviata"], hint: "Il complemento di causa risponde a: perché?" },
  { frase: "Marco studia con i suoi compagni in biblioteca.", domanda: "Qual è il COMPLEMENTO DI COMPAGNIA?", answer: "con i suoi compagni", options: ["Marco", "studia", "con i suoi compagni", "in biblioteca"], hint: "Con chi viene svolta l'azione?" },
];

// === DATABASE: VERBI ===
const VERBI = [
  // Simple tense identification (days 1-10)
  { frase: "Io mangio la pasta.", domanda: "In che tempo è il verbo 'mangio'?", answer: "Presente indicativo", options: ["Presente indicativo", "Passato prossimo", "Imperfetto", "Futuro"], hint: "L'azione avviene adesso." },
  { frase: "Ieri sono andato al cinema.", domanda: "In che tempo è il verbo?", answer: "Passato prossimo", options: ["Presente", "Passato prossimo", "Imperfetto", "Futuro"], hint: "L'azione è avvenuta e conclusa." },
  { frase: "Da bambino giocavo sempre a calcio.", domanda: "In che tempo è il verbo 'giocavo'?", answer: "Imperfetto", options: ["Presente", "Passato prossimo", "Imperfetto", "Passato remoto"], hint: "Un'azione abituale nel passato." },
  { frase: "Domani andremo in montagna.", domanda: "In che tempo è il verbo 'andremo'?", answer: "Futuro semplice", options: ["Presente", "Passato prossimo", "Futuro semplice", "Condizionale"], hint: "L'azione avverrà dopo." },
  // Conjugation (fill in the blank)
  { frase: "Domani io ___ al parco.", domanda: "Completa con il verbo corretto:", answer: "andrò", options: ["andrò", "vado", "andai", "andassi"], hint: "Serve il futuro semplice, prima persona." },
  { frase: "Se potessi, ___ in vacanza.", domanda: "Completa con il verbo corretto:", answer: "andrei", options: ["andrei", "vado", "andrò", "andavo"], hint: "Serve il condizionale." },
  { frase: "Ieri Maria ___ un bel voto.", domanda: "Completa con il verbo corretto:", answer: "ha preso", options: ["ha preso", "prende", "prenderà", "prendeva"], hint: "Azione conclusa ieri → passato prossimo." },
  { frase: "Quando ero piccolo, ___ molto.", domanda: "Completa con il verbo corretto:", answer: "dormivo", options: ["dormivo", "dormo", "dormii", "dormirò"], hint: "Azione abituale nel passato → imperfetto." },
  { frase: "Se ___ bel tempo, usciamo.", domanda: "Completa con il verbo corretto:", answer: "fa", options: ["fa", "farà", "faceva", "facesse"], hint: "Periodo ipotetico della realtà → presente." },
  { frase: "L'anno prossimo ___ la prima media.", domanda: "Completa con il verbo corretto:", answer: "frequenterò", options: ["frequenterò", "frequento", "frequentavo", "frequentai"], hint: "L'anno prossimo → futuro semplice." },
  // Complex (days 10+)
  { frase: "Vorrei che tu ___ più attento.", domanda: "Completa con il verbo corretto:", answer: "fossi", options: ["fossi", "sei", "eri", "sarai"], hint: "Dopo 'vorrei che' serve il congiuntivo." },
  { frase: "Penso che Maria ___ simpatica.", domanda: "Completa con il verbo corretto:", answer: "sia", options: ["sia", "è", "era", "sarà"], hint: "Dopo 'penso che' serve il congiuntivo." },
];

// === DATABASE: CONNETTIVI ===
const CONNETTIVI = [
  // Simple (days 1-10)
  { frase1: "Ho studiato molto", frase2: "ho preso un bel voto.", answer: "quindi", options: ["quindi", "però", "sebbene", "oppure"], hint: "'Quindi' indica una conseguenza." },
  { frase1: "Piove forte", frase2: "esco lo stesso.", answer: "però", options: ["quindi", "però", "perché", "inoltre"], hint: "'Però' introduce un contrasto." },
  { frase1: "Studio tanto", frase2: "voglio essere promosso.", answer: "perché", options: ["perché", "però", "quindi", "inoltre"], hint: "'Perché' spiega il motivo." },
  { frase1: "Mi piace leggere", frase2: "mi piace disegnare.", answer: "e inoltre", options: ["e inoltre", "però", "quindi", "perché"], hint: "'Inoltre' aggiunge un'informazione." },
  { frase1: "Puoi venire a casa mia", frase2: "possiamo andare al parco.", answer: "oppure", options: ["oppure", "quindi", "perché", "inoltre"], hint: "'Oppure' offre un'alternativa." },
  // Medium (days 5-15)
  { frase1: "Non ho fame", frase2: "mangerò un po' di frutta.", answer: "tuttavia", options: ["tuttavia", "perché", "quindi", "oppure"], hint: "'Tuttavia' indica una concessione/contrasto." },
  { frase1: "Il cielo era coperto", frase2: "non ha piovuto.", answer: "ma", options: ["ma", "quindi", "perché", "anche"], hint: "'Ma' introduce una contrapposizione." },
  { frase1: "Devi allenarti", frase2: "vuoi migliorare.", answer: "se", options: ["se", "perché", "quindi", "ma"], hint: "'Se' introduce una condizione." },
  { frase1: "Studio ogni giorno", frase2: "possa migliorare.", answer: "affinché", options: ["affinché", "perché (causa)", "tuttavia", "dunque"], hint: "'Affinché' indica lo scopo." },
  // Complex (days 10+)
  { frase1: "___ fosse stanco", frase2: "ha continuato a giocare.", answer: "Sebbene", options: ["Sebbene", "Perché", "Quindi", "Dato che"], hint: "'Sebbene' introduce una concessione (nonostante)." },
  { frase1: "___ piove", frase2: "restiamo a casa.", answer: "Dato che", options: ["Dato che", "Sebbene", "Affinché", "Tuttavia"], hint: "'Dato che' introduce una causa/premessa." },
  { frase1: "Non solo è bravo in italiano", frase2: "eccelle anche in matematica.", answer: "ma", options: ["ma", "perché", "sebbene", "oppure"], hint: "'Non solo... ma anche' è una correlazione." },
];

// === DATABASE: ORTOGRAFIA ===
const ORTOGRAFIA = [
  // Common errors for 10-11 year olds
  { domanda: "Quale forma è corretta?", answer: "qual è", options: ["qual è", "qual'è"], hint: "'Qual' non ha bisogno dell'apostrofo." },
  { domanda: "Quale forma è corretta?", answer: "un amico", options: ["un amico", "un'amico"], hint: "'Un' davanti a maschile non ha apostrofo." },
  { domanda: "Quale forma è corretta?", answer: "un'amica", options: ["un'amica", "un amica"], hint: "'Un'' davanti a femminile ha l'apostrofo." },
  { domanda: "Quale forma è corretta?", answer: "c'è", options: ["c'è", "ce"], hint: "'C'è' = ci è (con apostrofo)." },
  { domanda: "Quale forma è corretta?", answer: "ce ne sono", options: ["ce ne sono", "c'è ne sono", "cene sono"], hint: "'Ce ne' (senza apostrofo) quando significa 'di queste'." },
  { domanda: "Quale frase è scritta correttamente?", answer: "L'ho visto ieri.", options: ["L'ho visto ieri.", "Lo visto ieri.", "Lho visto ieri."], hint: "'L'ho' = lo + ho." },
  { domanda: "Quale forma è corretta?", answer: "lì", options: ["lì", "li"], hint: "'Lì' con accento indica un luogo." },
  { domanda: "Quale forma è corretta per indicare un luogo?", answer: "là", options: ["là", "la"], hint: "'Là' con accento indica un luogo." },
  { domanda: "Quale forma è corretta?", answer: "perché", options: ["perché", "percè", "per che"], hint: "'Perché' si scrive tutto attaccato con accento acuto." },
  { domanda: "Quale forma è corretta?", answer: "se stesso", options: ["se stesso", "sé stesso", "sestesso"], hint: "'Se stesso' (senza accento) secondo la norma più comune." },
  { domanda: "Quale forma è corretta?", answer: "d'accordo", options: ["d'accordo", "daccordo", "d' accordo"], hint: "'D'accordo' con apostrofo attaccato." },
  { domanda: "Quale forma è corretta?", answer: "soprattutto", options: ["soprattutto", "sopratutto", "sopra tutto"], hint: "'Soprattutto' con doppia T." },
  { domanda: "Quale frase è scritta correttamente?", answer: "Ce l'ho fatta!", options: ["Ce l'ho fatta!", "C'è l'ho fatta!", "Ce lo fatta!"], hint: "Ce l'ho = ce + l'ho." },
  { domanda: "Quale forma è corretta?", answer: "accelerare", options: ["accelerare", "accellerare", "acellerare"], hint: "Si scrive con una sola L." },
];

// === DATABASE: SINONIMI/LESSICO ===
const SINONIMI = [
  // Simpler words (days 1-10)
  { parola: "felice", answer: "contento", options: ["contento", "triste", "arrabbiato", "stanco"], hint: "Sinonimo = stessa idea." },
  { parola: "grande", answer: "enorme", options: ["enorme", "piccolo", "stretto", "leggero"], hint: "Cerca una parola con significato simile." },
  { parola: "veloce", answer: "rapido", options: ["rapido", "lento", "pesante", "largo"], hint: "Quale parola ha lo stesso significato?" },
  { parola: "parlare", answer: "dire", options: ["dire", "tacere", "scrivere", "correre"], hint: "Che verbo è simile a 'parlare'?" },
  { parola: "bello", answer: "splendido", options: ["splendido", "brutto", "alto", "scuro"], hint: "'Bello' è simile a...?" },
  { parola: "paura", answer: "timore", options: ["timore", "coraggio", "gioia", "noia"], hint: "Sinonimo di 'paura'." },
  { parola: "iniziare", answer: "cominciare", options: ["cominciare", "finire", "dormire", "perdere"], hint: "Che verbo significa la stessa cosa?" },
  { parola: "casa", answer: "abitazione", options: ["abitazione", "strada", "scuola", "giardino"], hint: "Un altro modo per dire 'casa'." },
  // Medium (days 5-15)
  { parola: "coraggioso", answer: "valoroso", options: ["valoroso", "pauroso", "prudente", "pigro"], hint: "Chi è coraggioso è anche...?" },
  { parola: "furbo", answer: "astuto", options: ["astuto", "stupido", "onesto", "gentile"], hint: "Sinonimo di 'furbo'." },
  { parola: "sbaglio", answer: "errore", options: ["errore", "successo", "risultato", "compito"], hint: "Come si dice 'sbaglio' in altro modo?" },
  { parola: "aiutare", answer: "soccorrere", options: ["soccorrere", "abbandonare", "ignorare", "disturbare"], hint: "Verbo simile ad 'aiutare'." },
  // Complex / abstract (days 10+)
  { parola: "ostacolo", answer: "impedimento", options: ["impedimento", "aiuto", "vantaggio", "soluzione"], hint: "Un sinonimo più formale." },
  { parola: "indifferente", answer: "apatico", options: ["apatico", "appassionato", "curioso", "attento"], hint: "Chi è indifferente non prova emozioni." },
  { parola: "conseguenza", answer: "effetto", options: ["effetto", "causa", "inizio", "dubbio"], hint: "La conseguenza è l'... di qualcosa." },
  { parola: "prudente", answer: "cauto", options: ["cauto", "impulsivo", "coraggioso", "distratto"], hint: "Chi è prudente è anche...?" },
];

/**
 * Generate an Italian grammar exercise
 * @param {number} seed - Random seed
 * @param {object} difficulty - Difficulty object from gameEngine
 * @returns {object} Exercise data
 */
export function generateItalianoExercise(seed, difficulty) {
  const rng = seededRandom(seed);
  const daysPlayed = difficulty.italiano ? difficulty.italiano.daysPlayed || 0 : 0;
  
  // Choose exercise type: weighted by difficulty
  // A=analisi, B=verbi, C=connettivi, D=ortografia, E=sinonimi
  const typeRoll = rng();
  let type;
  if (typeRoll < 0.22) type = 'analisi';
  else if (typeRoll < 0.44) type = 'verbi';
  else if (typeRoll < 0.62) type = 'connettivi';
  else if (typeRoll < 0.80) type = 'ortografia';
  else type = 'sinonimi';
  
  switch (type) {
    case 'analisi': return generateAnalisiLogica(rng, daysPlayed);
    case 'verbi': return generateVerbi(rng, daysPlayed);
    case 'connettivi': return generateConnettivi(rng, daysPlayed);
    case 'ortografia': return generateOrtografia(rng, daysPlayed);
    case 'sinonimi': return generateSinonimi(rng, daysPlayed);
    default: return generateAnalisiLogica(rng, daysPlayed);
  }
}

function generateAnalisiLogica(rng, daysPlayed) {
  // Filter by difficulty
  const pool = daysPlayed < 10 
    ? ANALISI_LOGICA.slice(0, 8) 
    : ANALISI_LOGICA;
  const item = pool[Math.floor(rng() * pool.length)];
  
  return {
    subtype: 'analisi',
    question: item.frase,
    instruction: item.domanda,
    answer: item.answer,
    options: shuffleArray([...item.options], rng),
    hint: item.hint,
  };
}

function generateVerbi(rng, daysPlayed) {
  const pool = daysPlayed < 10
    ? VERBI.slice(0, 8)
    : VERBI;
  const item = pool[Math.floor(rng() * pool.length)];
  
  return {
    subtype: 'verbi',
    question: item.frase,
    instruction: item.domanda,
    answer: item.answer,
    options: shuffleArray([...item.options], rng),
    hint: item.hint,
  };
}

function generateConnettivi(rng, daysPlayed) {
  const pool = daysPlayed < 10
    ? CONNETTIVI.slice(0, 5)
    : CONNETTIVI;
  const item = pool[Math.floor(rng() * pool.length)];
  
  return {
    subtype: 'connettivi',
    question: `"${item.frase1} ___ ${item.frase2}"`,
    instruction: "Scegli il connettivo corretto:",
    answer: item.answer,
    options: shuffleArray([...item.options], rng),
    hint: item.hint,
  };
}

function generateOrtografia(rng, daysPlayed) {
  const pool = daysPlayed < 10
    ? ORTOGRAFIA.slice(0, 7)
    : ORTOGRAFIA;
  const item = pool[Math.floor(rng() * pool.length)];
  
  return {
    subtype: 'ortografia',
    question: item.domanda,
    instruction: "Scegli la forma corretta:",
    answer: item.answer,
    options: shuffleArray([...item.options], rng),
    hint: item.hint,
  };
}

function generateSinonimi(rng, daysPlayed) {
  const pool = daysPlayed < 10
    ? SINONIMI.slice(0, 8)
    : SINONIMI;
  const item = pool[Math.floor(rng() * pool.length)];
  
  return {
    subtype: 'sinonimi',
    question: `"${item.parola}"`,
    instruction: "Trova il SINONIMO:",
    answer: item.answer,
    options: shuffleArray([...item.options], rng),
    hint: item.hint,
  };
}
