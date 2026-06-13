/**
 * Spatial Exercises — Rotation and orientation recognition
 * 
 * Based on CROSS BPA/1: "valuta la capacità di riconoscere i cambiamenti di posizione
 * di un elemento nello spazio. Richiede di individuare, tra le figure alternative,
 * quelle orientate nello stesso senso della figura evidenziata."
 */

import { seededRandom, shuffleArray } from '../gameEngine.js';

// SVG-based shapes that can be rotated
// Each shape is defined as a set of points or a description
const ARROW_SHAPES = [
  { name: 'arrow', path: '↑', rotations: ['↑', '→', '↓', '←'] },
  { name: 'diagonal', path: '↗', rotations: ['↗', '↘', '↙', '↖'] },
];

// L-shaped figures with clear orientation
const L_SHAPES = ['┘', '└', '┐', '┌']; // 4 rotations of L
const T_SHAPES = ['┴', '├', '┬', '┤']; // 4 rotations of T
const ARROW_SET = ['▲', '▶', '▼', '◀']; // 4 rotations of triangle
const COMPLEX_ARROWS = ['⬆️', '➡️', '⬇️', '⬅️'];

// For SVG-based exercises, we use CSS transforms
// These shapes are represented as Unicode + rotation degrees
const SHAPE_SETS = [
  { base: '🔑', rotations: [0, 90, 180, 270] },
  { base: '✈️', rotations: [0, 90, 180, 270] },
  { base: '🏠', rotations: [0, 90, 180, 270] },
  { base: '⚡', rotations: [0, 90, 180, 270] },
  { base: '🔧', rotations: [0, 90, 180, 270] },
];

// Abstract geometric shapes (better for spatial reasoning)
const GEO_SHAPES = [
  // Each is [symbol, array of 4 rotated versions as unicode]
  { symbols: ['◢', '◣', '◤', '◥'], name: 'triangle-corner' },
  { symbols: ARROW_SET, name: 'arrow-triangle' },
  { symbols: L_SHAPES, name: 'L-shape' },
  { symbols: T_SHAPES, name: 'T-shape' },
];

/**
 * Generate a spatial exercise
 */
export function generateSpatialExercise(seed, difficulty) {
  const rng = seededRandom(seed);
  const { rotations, includeMirror, shapeComplexity } = difficulty.spatial;
  
  if (shapeComplexity <= 2) {
    return generateSimpleSpatial(rng, difficulty);
  } else if (shapeComplexity <= 3) {
    return generateMediumSpatial(rng, difficulty);
  } else {
    return generateComplexSpatial(rng, difficulty);
  }
}

function generateSimpleSpatial(rng, difficulty) {
  // Simple: find the arrow/shape pointing the same direction
  const shapeSet = GEO_SHAPES[Math.floor(rng() * GEO_SHAPES.length)];
  const targetIdx = Math.floor(rng() * 4);
  const target = shapeSet.symbols[targetIdx];
  
  // Generate options: one correct (same orientation) + distractors (different orientations)
  const correctAnswer = target;
  const options = [correctAnswer];
  
  // Add wrong orientations
  for (let i = 0; i < 4; i++) {
    if (i !== targetIdx && options.length < 4) {
      options.push(shapeSet.symbols[i]);
    }
  }
  
  return {
    target,
    targetLabel: `Trova la figura orientata come questa:`,
    answer: correctAnswer,
    options: shuffleArray(options, rng),
    type: 'match-orientation',
    shapeSetName: shapeSet.name,
  };
}

function generateMediumSpatial(rng, difficulty) {
  // Medium: composite shapes (two symbols together), find same orientation
  const set1 = GEO_SHAPES[Math.floor(rng() * GEO_SHAPES.length)];
  const set2 = GEO_SHAPES[Math.floor(rng() * GEO_SHAPES.length)];
  
  const targetIdx = Math.floor(rng() * 4);
  const target = set1.symbols[targetIdx] + set2.symbols[targetIdx];
  
  const options = [target];
  for (let i = 0; i < 4; i++) {
    if (i !== targetIdx && options.length < 4) {
      // Mix orientations
      const opt = set1.symbols[i] + set2.symbols[(i + 1) % 4];
      if (!options.includes(opt)) options.push(opt);
    }
  }
  // Fill remaining if needed
  while (options.length < 4) {
    const i = Math.floor(rng() * 4);
    const j = Math.floor(rng() * 4);
    const opt = set1.symbols[i] + set2.symbols[j];
    if (!options.includes(opt)) options.push(opt);
  }
  
  return {
    target,
    targetLabel: `Questa coppia di figure ha un orientamento preciso. Quale combinazione è orientata allo stesso modo?`,
    answer: target,
    options: shuffleArray(options, rng),
    type: 'composite-orientation',
    shapeSetName: `${set1.name}+${set2.name}`,
  };
}

function generateComplexSpatial(rng, difficulty) {
  // Complex: pattern of 4 shapes in a 2x2 grid, find the rotated version
  const set = GEO_SHAPES[Math.floor(rng() * GEO_SHAPES.length)];
  
  // Create a 2x2 pattern
  const pattern = [
    Math.floor(rng() * 4),
    Math.floor(rng() * 4),
    Math.floor(rng() * 4),
    Math.floor(rng() * 4),
  ];
  
  const target = pattern.map(i => set.symbols[i]).join(' ');
  
  // Correct answer: same pattern
  const answer = target;
  
  // Wrong answers: patterns with one element rotated differently
  const options = [answer];
  for (let attempt = 0; attempt < 10 && options.length < 4; attempt++) {
    const wrongPattern = [...pattern];
    const changeIdx = Math.floor(rng() * 4);
    wrongPattern[changeIdx] = (wrongPattern[changeIdx] + 1 + Math.floor(rng() * 3)) % 4;
    const opt = wrongPattern.map(i => set.symbols[i]).join(' ');
    if (!options.includes(opt)) options.push(opt);
  }
  
  while (options.length < 4) {
    const randomPattern = [0,1,2,3].map(() => Math.floor(rng() * 4));
    const opt = randomPattern.map(i => set.symbols[i]).join(' ');
    if (!options.includes(opt)) options.push(opt);
  }
  
  return {
    target,
    targetLabel: `Osserva questa configurazione. Quale è identica?`,
    answer,
    options: shuffleArray(options, rng),
    type: 'grid-match',
    shapeSetName: set.name,
  };
}
