/**
 * Verbal Logic Exercises — Essential element identification
 * 
 * Based on CROSS BPA/1: "valuta la capacità di discriminare gli elementi essenziali
 * di un determinato oggetto. Richiede di individuare, tra una serie di elementi,
 * quelli costitutivi dell'oggetto evidenziato."
 */

import { seededRandom, shuffleArray } from '../gameEngine.js';

// Database of objects and their essential/non-essential elements
// Structure: { object, essential: [...], related: [...], unrelated: [...] }
const OBJECT_DATABASE = [
  // --- ORIGINAL ---
  {
    object: '🚀 Razzo spaziale',
    essential: ['motore', 'carburante', 'scudo termico', 'cabina di pilotaggio'],
    related: ['astronauta', 'rampa di lancio', 'tuta spaziale', 'antenna'],
    unrelated: ['ruote', 'binari', 'ancora', 'pedali', 'timone'],
  },
  {
    object: '📚 Libro',
    essential: ['pagine', 'copertina', 'testo', 'titolo'],
    related: ['scaffale', 'biblioteca', 'segnalibro', 'autore'],
    unrelated: ['motore', 'ruote', 'finestre', 'radici', 'ali'],
  },
  {
    object: '🏠 Casa',
    essential: ['muri', 'tetto', 'fondamenta', 'porta'],
    related: ['giardino', 'garage', 'cancello', 'balcone'],
    unrelated: ['ali', 'pinne', 'radici', 'motore', 'timone'],
  },
  {
    object: '🌳 Albero',
    essential: ['radici', 'tronco', 'rami', 'foglie'],
    related: ['frutti', 'fiori', 'ombra', 'nido'],
    unrelated: ['ruote', 'finestre', 'motore', 'timone', 'pagine'],
  },
  {
    object: '🚗 Automobile',
    essential: ['motore', 'ruote', 'volante', 'freni'],
    related: ['fari', 'specchietti', 'radio', 'tergicristalli'],
    unrelated: ['ali', 'vele', 'rami', 'pagine', 'radici'],
  },
  {
    object: '⛵ Barca a vela',
    essential: ['scafo', 'vela', 'albero', 'timone'],
    related: ['ancora', 'bussola', 'salvagente', 'oblò'],
    unrelated: ['ruote', 'pedali', 'binari', 'radici', 'foglie'],
  },
  {
    object: '🎸 Chitarra',
    essential: ['corde', 'manico', 'cassa armonica', 'tastiera'],
    related: ['plettro', 'custodia', 'amplificatore', 'accordatore'],
    unrelated: ['ruote', 'ali', 'radici', 'motore', 'timone'],
  },
  {
    object: '👁️ Occhio',
    essential: ['pupilla', 'retina', 'cornea', 'iride'],
    related: ['ciglia', 'sopracciglia', 'lacrime', 'occhiali'],
    unrelated: ['ruote', 'pagine', 'radici', 'motore', 'vele'],
  },
  {
    object: '🏫 Scuola',
    essential: ['aule', 'insegnanti', 'studenti', 'lavagna'],
    related: ['palestra', 'mensa', 'cortile', 'biblioteca'],
    unrelated: ['binari', 'vele', 'radici', 'ali', 'timone'],
  },
  {
    object: '🖥️ Computer',
    essential: ['processore', 'memoria', 'schermo', 'tastiera'],
    related: ['mouse', 'casse', 'webcam', 'stampante'],
    unrelated: ['vele', 'radici', 'pedali', 'timone', 'rami'],
  },
  {
    object: '🌍 Pianeta Terra',
    essential: ['atmosfera', 'crosta', 'nucleo', 'acqua'],
    related: ['luna', 'montagne', 'oceani', 'vulcani'],
    unrelated: ['motore', 'ruote', 'pagine', 'corde', 'tastiera'],
  },
  {
    object: '🦁 Leone',
    essential: ['zampe', 'criniera', 'artigli', 'denti'],
    related: ['savana', 'branco', 'tana', 'prede'],
    unrelated: ['ali', 'pinne', 'ruote', 'radici', 'vele'],
  },
  {
    object: '✈️ Aeroplano',
    essential: ['ali', 'motori', 'fusoliera', 'coda'],
    related: ['pilota', 'pista', 'carrello', 'finestrini'],
    unrelated: ['radici', 'vele', 'pedali', 'criniera', 'rami'],
  },
  {
    object: '🎬 Film',
    essential: ['immagini', 'trama', 'attori', 'regia'],
    related: ['musica', 'effetti speciali', 'cinema', 'popcorn'],
    unrelated: ['ruote', 'radici', 'timone', 'motore', 'scafo'],
  },
  {
    object: '🏥 Ospedale',
    essential: ['medici', 'pazienti', 'sale operatorie', 'farmaci'],
    related: ['ambulanza', 'infermieri', 'reception', 'parcheggio'],
    unrelated: ['vele', 'binari', 'criniera', 'corde', 'rami'],
  },
  {
    object: '⚽ Partita di calcio',
    essential: ['pallone', 'giocatori', 'campo', 'porte'],
    related: ['arbitro', 'tifosi', 'panchina', 'tabellone'],
    unrelated: ['vele', 'radici', 'pagine', 'motore', 'corde'],
  },
  {
    object: '🌊 Oceano',
    essential: ['acqua salata', 'correnti', 'profondità', 'fondali'],
    related: ['pesci', 'onde', 'spiaggia', 'coralli'],
    unrelated: ['ruote', 'pagine', 'binari', 'tastiera', 'criniera'],
  },
  {
    object: '🎂 Torta',
    essential: ['farina', 'uova', 'zucchero', 'cottura'],
    related: ['candeline', 'crema', 'decorazioni', 'piatto'],
    unrelated: ['motore', 'radici', 'ali', 'timone', 'binari'],
  },
  // --- NEW: Nature ---
  {
    object: '🌋 Vulcano',
    essential: ['magma', 'cratere', 'lava', 'camino vulcanico'],
    related: ['cenere', 'terremoti', 'isola', 'fumarole'],
    unrelated: ['ruote', 'pagine', 'corde', 'tastiera', 'pedali'],
  },
  {
    object: '🦋 Farfalla',
    essential: ['ali', 'antenne', 'proboscide', 'addome'],
    related: ['fiori', 'bozzolo', 'bruco', 'polline'],
    unrelated: ['ruote', 'motore', 'timone', 'binari', 'pagine'],
  },
  // --- NEW: Technology ---
  {
    object: '📱 Smartphone',
    essential: ['schermo touch', 'batteria', 'processore', 'antenna'],
    related: ['custodia', 'caricatore', 'auricolari', 'app'],
    unrelated: ['vele', 'radici', 'rami', 'pedali', 'timone'],
  },
  {
    object: '🤖 Robot',
    essential: ['sensori', 'attuatori', 'processore', 'energia'],
    related: ['braccio meccanico', 'cavi', 'programmazione', 'ruote'],
    unrelated: ['foglie', 'criniera', 'vele', 'pagine', 'radici'],
  },
  // --- NEW: Sports ---
  {
    object: '🏀 Pallacanestro',
    essential: ['pallone', 'canestro', 'campo', 'giocatori'],
    related: ['tabellone', 'arbitro', 'divisa', 'cronometro'],
    unrelated: ['vele', 'radici', 'motore', 'pagine', 'timone'],
  },
  {
    object: '🏊 Nuoto',
    essential: ['acqua', 'piscina', 'costume', 'corsie'],
    related: ['occhialini', 'cuffia', 'trampolino', 'cronometro'],
    unrelated: ['ruote', 'binari', 'foglie', 'corde', 'tastiera'],
  },
  // --- NEW: Art ---
  {
    object: '🎨 Quadro',
    essential: ['tela', 'colori', 'pennello', 'cornice'],
    related: ['cavalletto', 'museo', 'artista', 'vernice'],
    unrelated: ['motore', 'radici', 'timone', 'binari', 'pedali'],
  },
  {
    object: '🎭 Teatro',
    essential: ['palcoscenico', 'attori', 'copione', 'pubblico'],
    related: ['costumi', 'luci', 'sipario', 'regista'],
    unrelated: ['ruote', 'radici', 'motore', 'vele', 'pedali'],
  },
  // --- NEW: Science ---
  {
    object: '🔬 Microscopio',
    essential: ['lenti', 'oculare', 'obiettivo', 'piattaforma'],
    related: ['vetrino', 'laboratorio', 'colorante', 'campione'],
    unrelated: ['ruote', 'vele', 'radici', 'criniera', 'pagine'],
  },
  {
    object: '⚡ Circuito elettrico',
    essential: ['batteria', 'fili conduttori', 'interruttore', 'lampadina'],
    related: ['resistenza', 'voltmetro', 'saldatore', 'presa'],
    unrelated: ['foglie', 'vele', 'radici', 'criniera', 'rami'],
  },
  // --- NEW: Body ---
  {
    object: '❤️ Cuore',
    essential: ['ventricoli', 'atri', 'valvole', 'arterie'],
    related: ['sangue', 'battito', 'petto', 'vene'],
    unrelated: ['ruote', 'pagine', 'motore', 'binari', 'tastiera'],
  },
  {
    object: '🧠 Cervello',
    essential: ['neuroni', 'emisferi', 'corteccia', 'sinapsi'],
    related: ['cranio', 'pensiero', 'memoria', 'sogni'],
    unrelated: ['ruote', 'vele', 'radici', 'motore', 'corde'],
  },
  // --- NEW: Geography ---
  {
    object: '🏔️ Montagna',
    essential: ['vetta', 'versanti', 'roccia', 'altitudine'],
    related: ['neve', 'sentieri', 'rifugio', 'animali'],
    unrelated: ['motore', 'pagine', 'corde', 'tastiera', 'timone'],
  },
  {
    object: '🏝️ Isola',
    essential: ['terra', 'acqua circostante', 'costa', 'superficie'],
    related: ['spiaggia', 'palme', 'porto', 'faro'],
    unrelated: ['binari', 'motore', 'tastiera', 'pedali', 'criniera'],
  },
];

/**
 * Generate a verbal logic exercise
 */
export function generateVerbalLogicExercise(seed, difficulty) {
  const rng = seededRandom(seed);
  const { elementsToFind, totalOptions, abstractionLevel } = difficulty.verbalLogic;
  
  // Pick an object
  const objIdx = Math.floor(rng() * OBJECT_DATABASE.length);
  const obj = OBJECT_DATABASE[objIdx];
  
  // Select essential elements to include as correct answers
  const essentialPool = shuffleArray([...obj.essential], rng);
  const correctElements = essentialPool.slice(0, elementsToFind);
  
  // Select distractors
  const distractorPool = [
    ...shuffleArray([...obj.related], rng),
    ...shuffleArray([...obj.unrelated], rng),
  ];
  
  const numDistractors = totalOptions - elementsToFind;
  
  // Mix related and unrelated based on abstraction level
  let distractors;
  if (abstractionLevel <= 1) {
    // Easy: mostly unrelated distractors (obvious wrong answers)
    distractors = shuffleArray([...obj.unrelated], rng).slice(0, numDistractors);
  } else if (abstractionLevel <= 2) {
    // Medium: mix of related and unrelated
    distractors = distractorPool.slice(0, numDistractors);
  } else {
    // Hard: mostly related distractors (harder to discriminate essential vs nice-to-have)
    distractors = shuffleArray([...obj.related, ...obj.unrelated.slice(0, 1)], rng).slice(0, numDistractors);
  }
  
  const allOptions = shuffleArray([...correctElements, ...distractors], rng);
  
  return {
    object: obj.object,
    question: `Quali sono gli elementi ESSENZIALI (indispensabili) di: ${obj.object}?`,
    instruction: `Seleziona ${elementsToFind} elementi che sono INDISPENSABILI:`,
    options: allOptions,
    correctAnswers: correctElements,
    numToSelect: elementsToFind,
    type: 'essential-elements',
  };
}
