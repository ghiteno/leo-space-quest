/**
 * Leo's Space Quest — Game Engine
 * Manages progression, difficulty scaling, and daily seeds
 */

const STORAGE_KEY = 'leo-space-quest-state';

// Day number since epoch — used as seed for daily variation
export function getDayNumber() {
  const now = new Date();
  return Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
}

// Seeded pseudo-random (deterministic per day)
export function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

// Shuffle array with seed
export function shuffleArray(arr, rng) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Load/save state
export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return getDefaultState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function getDefaultState() {
  return {
    playerName: 'Leo',
    level: 1,
    totalXP: 0,
    currentDayNumber: getDayNumber(),
    daysPlayed: 0,
    streak: 0,
    lastPlayedDay: 0,
    completedToday: false,
    // Per-category stats (correct/total)
    stats: {
      reasoning: { correct: 0, total: 0 },
      spatial: { correct: 0, total: 0 },
      verbalLogic: { correct: 0, total: 0 },
      sequences: { correct: 0, total: 0 },
      italiano: { correct: 0, total: 0 },
      matematica: { correct: 0, total: 0 },
    },
    // Unlocked planets
    planetsUnlocked: ['Mercury'],
    badges: [],
  };
}

// Difficulty scales with daysPlayed (0-based)
// Returns a difficulty object with parameters per exercise type
export function getDifficulty(daysPlayed) {
  const d = Math.min(daysPlayed, 60); // cap at 60 days
  
  return {
    // Reasoning matrices: starts 2x2 pattern, goes to 3x3
    reasoning: {
      gridSize: d < 7 ? 2 : 3,
      complexity: Math.min(1 + Math.floor(d / 5), 6), // 1-6 transformations
      distractors: Math.min(3 + Math.floor(d / 10), 6), // number of wrong options
    },
    // Spatial: number of rotations and mirror options
    spatial: {
      rotations: d < 5 ? 2 : d < 15 ? 3 : 4,
      includeMirror: d >= 8,
      shapeComplexity: Math.min(1 + Math.floor(d / 7), 5),
    },
    // Verbal logic: number of elements and distractors
    verbalLogic: {
      elementsToFind: d < 5 ? 2 : d < 15 ? 3 : 4,
      totalOptions: Math.min(5 + Math.floor(d / 10), 8),
      abstractionLevel: Math.min(1 + Math.floor(d / 8), 4),
    },
    // Sequences: length and step complexity
    sequences: {
      sequenceLength: Math.min(4 + Math.floor(d / 8), 7),
      operations: d < 5 ? 1 : d < 15 ? 2 : 3, // number of operations in pattern
      includeGeometric: d >= 10,
    },
    // Italiano: grammar complexity
    italiano: {
      daysPlayed: d,
    },
    // Matematica: number complexity
    matematica: {
      daysPlayed: d,
    },
  };
}

// XP calculation
export function calculateXP(correct, total, streak, difficulty) {
  const baseXP = correct * 10;
  const accuracyBonus = correct === total ? 20 : 0;
  const streakBonus = Math.min(streak * 5, 50);
  const difficultyBonus = Math.floor(difficulty * 2);
  return baseXP + accuracyBonus + streakBonus + difficultyBonus;
}

// Level from XP (each level requires slightly more)
export function getLevel(totalXP) {
  // Level 1: 0-99, Level 2: 100-249, Level 3: 250-449, etc.
  let level = 1;
  let threshold = 100;
  let remaining = totalXP;
  while (remaining >= threshold) {
    remaining -= threshold;
    level++;
    threshold = Math.floor(threshold * 1.3);
  }
  return { level, xpInLevel: remaining, xpForNext: threshold };
}

// Planet progression
const PLANETS = [
  { name: 'Mercury', emoji: '☿️', unlockLevel: 1, color: '#b0b0b0' },
  { name: 'Venus', emoji: '♀️', unlockLevel: 3, color: '#e8a838' },
  { name: 'Mars', emoji: '♂️', unlockLevel: 5, color: '#e04040' },
  { name: 'Jupiter', emoji: '♃', unlockLevel: 8, color: '#d4a574' },
  { name: 'Saturn', emoji: '♄', unlockLevel: 12, color: '#c4a35a' },
  { name: 'Neptune', emoji: '♆', unlockLevel: 16, color: '#4488ff' },
  { name: 'Pluto', emoji: '⯓', unlockLevel: 20, color: '#8866aa' },
];

export function getCurrentPlanet(level) {
  let planet = PLANETS[0];
  for (const p of PLANETS) {
    if (level >= p.unlockLevel) planet = p;
  }
  return planet;
}

export function getNextPlanet(level) {
  for (const p of PLANETS) {
    if (level < p.unlockLevel) return p;
  }
  return null;
}

export { PLANETS };

// Generate session exercises (12 per day)
export function generateSession(state) {
  const dayNum = getDayNumber();
  const rng = seededRandom(dayNum * 7919 + state.daysPlayed * 31);
  const diff = getDifficulty(state.daysPlayed);
  
  // 2 reasoning + 2 spatial + 3 verbal logic + 3 sequences + 3 italiano + 3 matematica = 16
  const exercises = [];
  
  for (let i = 0; i < 2; i++) {
    exercises.push({ type: 'reasoning', index: i, seed: Math.floor(rng() * 100000) });
  }
  for (let i = 0; i < 2; i++) {
    exercises.push({ type: 'spatial', index: i, seed: Math.floor(rng() * 100000) });
  }
  for (let i = 0; i < 3; i++) {
    exercises.push({ type: 'verbalLogic', index: i, seed: Math.floor(rng() * 100000) });
  }
  for (let i = 0; i < 3; i++) {
    exercises.push({ type: 'sequences', index: i, seed: Math.floor(rng() * 100000) });
  }
  for (let i = 0; i < 3; i++) {
    exercises.push({ type: 'italiano', index: i, seed: Math.floor(rng() * 100000) });
  }
  for (let i = 0; i < 3; i++) {
    exercises.push({ type: 'matematica', index: i, seed: Math.floor(rng() * 100000) });
  }
  
  // Shuffle exercise order (but keep groups loosely together for variety)
  return shuffleArray(exercises, rng);
}

// Narrative messages for missions
export function getMissionNarrative(exerciseType, planetName) {
  const narratives = {
    reasoning: [
      `Il computer di bordo ha un glitch! Trova il pattern per ripararlo.`,
      `Un segnale alieno contiene un codice. Decifra la sequenza!`,
      `Lo scudo del razzo ha perso un pezzo. Quale forma manca?`,
    ],
    spatial: [
      `Devi agganciare il modulo spaziale — trova l'orientamento giusto!`,
      `Un asteroide ruota nello spazio. Da che lato lo vedi?`,
      `La mappa stellare è inclinata. Trova la posizione corretta!`,
    ],
    verbalLogic: [
      `Stai esplorando ${planetName}. Cosa serve per la missione?`,
      `Il manuale del razzo è danneggiato. Quali sono le parti essenziali?`,
      `Devi preparare l'equipaggiamento. Cosa è indispensabile?`,
    ],
    sequences: [
      `Il radar rileva un pattern. Qual è il prossimo segnale?`,
      `La rotta di navigazione segue una logica. Dove vai dopo?`,
      `I cristalli energetici seguono una sequenza. Quale viene dopo?`,
    ],
    italiano: [
      `Il diario di bordo ha degli errori! Ripara il testo del capitano.`,
      `Un messaggio alieno è stato tradotto ma ha errori grammaticali. Correggilo!`,
      `Per decifrare il codice segreto, devi conoscere bene la lingua!`,
    ],
    matematica: [
      `Il computer di navigazione ha bisogno di calcoli precisi!`,
      `Per calcolare la rotta serve risolvere questo problema numerico.`,
      `I sensori hanno rilevato dei dati. Analizza i numeri!`,
    ],
  };
  
  const options = narratives[exerciseType] || narratives.reasoning;
  return options[Math.floor(Math.random() * options.length)];
}
