/**
 * Sequences Exercises — Number/figure pattern completion
 * 
 * Based on CROSS PO-M "Dati": "saper lavorare con sequenze di figure e numeri,
 * saper rappresentare relazioni e dati"
 * 
 * Also covers numerical reasoning from "Problemi aritmetici"
 */

import { seededRandom, shuffleArray } from '../gameEngine.js';

/**
 * Generate a sequence exercise
 */
export function generateSequenceExercise(seed, difficulty) {
  const rng = seededRandom(seed);
  const { sequenceLength, operations, includeGeometric } = difficulty.sequences;
  
  // Choose type based on difficulty
  const typeRoll = rng();
  if (operations <= 1) {
    return typeRoll < 0.5 
      ? generateArithmeticSequence(rng, sequenceLength)
      : generateShapeSequence(rng, sequenceLength);
  } else if (operations <= 2) {
    if (typeRoll < 0.25) return generateArithmeticSequence(rng, sequenceLength);
    if (typeRoll < 0.5) return generateAlternatingSequence(rng, sequenceLength);
    if (typeRoll < 0.75) return generateSquareNumbers(rng, sequenceLength);
    return generateShapeSequence(rng, sequenceLength);
  } else {
    if (typeRoll < 0.15) return generateDoubleRuleSequence(rng, sequenceLength);
    if (typeRoll < 0.30) return generateFibonacciLike(rng, sequenceLength);
    if (typeRoll < 0.45) return generateAlternatingSequence(rng, sequenceLength);
    if (typeRoll < 0.60) return generateSquareNumbers(rng, sequenceLength);
    if (typeRoll < 0.75) return generateAlternatingOperations(rng, sequenceLength);
    if (typeRoll < 0.90) return generateTriangularNumbers(rng, sequenceLength);
    return includeGeometric ? generateGeometricSequence(rng, sequenceLength) : generateAlternatingOperations(rng, sequenceLength);
  }
}

function generateArithmeticSequence(rng, length) {
  // Simple: add a constant
  const start = Math.floor(rng() * 10) + 1;
  const step = Math.floor(rng() * 5) + 1;
  
  const sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push(start + i * step);
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  // Generate distractors
  const options = [answer];
  const possibleWrong = [answer + step, answer - step, answer + 1, answer - 1, answer * 2, answer + step * 2];
  for (const w of shuffleArray(possibleWrong, rng)) {
    if (!options.includes(w) && w > 0 && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) {
    options.push(answer + Math.floor(rng() * 10) - 5);
  }
  
  return {
    sequence: displayed.map(String),
    answer: String(answer),
    options: shuffleArray(options.map(String), rng),
    hint: `La regola è: +${step}`,
    type: 'arithmetic',
    question: 'Quale numero viene dopo?',
  };
}

function generateGeometricSequence(rng, length) {
  // Multiply by a constant
  const start = Math.floor(rng() * 3) + 1;
  const ratio = Math.floor(rng() * 2) + 2; // ×2 or ×3
  
  const sequence = [];
  let current = start;
  for (let i = 0; i < length; i++) {
    sequence.push(current);
    current *= ratio;
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  const options = [answer];
  const possibleWrong = [answer + ratio, answer - ratio, answer / ratio, answer * ratio, answer + 1, displayed[displayed.length-1] + (displayed[displayed.length-1] - displayed[displayed.length-2])];
  for (const w of shuffleArray(possibleWrong.filter(x => x > 0 && Number.isInteger(x)), rng)) {
    if (!options.includes(w) && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) {
    options.push(Math.floor(answer * (0.5 + rng())));
  }
  
  return {
    sequence: displayed.map(String),
    answer: String(answer),
    options: shuffleArray([...new Set(options)].slice(0, 4).map(String), rng),
    hint: `La regola è: ×${ratio}`,
    type: 'geometric',
    question: 'Quale numero viene dopo?',
  };
}

function generateAlternatingSequence(rng, length) {
  // Two interleaved sequences
  const start1 = Math.floor(rng() * 5) + 1;
  const start2 = Math.floor(rng() * 5) + 10;
  const step1 = Math.floor(rng() * 3) + 1;
  const step2 = Math.floor(rng() * 3) + 1;
  
  const sequence = [];
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      sequence.push(start1 + Math.floor(i / 2) * step1);
    } else {
      sequence.push(start2 + Math.floor(i / 2) * step2);
    }
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  const options = [answer];
  const possibleWrong = [answer + step1, answer + step2, answer - step1, answer + 1, answer * 2];
  for (const w of shuffleArray(possibleWrong, rng)) {
    if (!options.includes(w) && w > 0 && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) {
    options.push(answer + Math.floor(rng() * 8) - 4);
  }
  
  return {
    sequence: displayed.map(String),
    answer: String(answer),
    options: shuffleArray(options.map(String), rng),
    hint: `Ci sono due sequenze alternate!`,
    type: 'alternating',
    question: 'Quale numero viene dopo?',
  };
}

function generateDoubleRuleSequence(rng, length) {
  // Each term = previous + increasing step
  const start = Math.floor(rng() * 5) + 1;
  const baseStep = Math.floor(rng() * 2) + 1;
  
  const sequence = [start];
  let step = baseStep;
  for (let i = 1; i < length; i++) {
    sequence.push(sequence[i-1] + step);
    step += baseStep;
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  const options = [answer];
  const lastDiff = sequence[length-2] - sequence[length-3];
  const possibleWrong = [
    displayed[displayed.length-1] + lastDiff, // if they just repeat the last diff
    answer + baseStep,
    answer - baseStep,
    answer + 1,
  ];
  for (const w of possibleWrong) {
    if (!options.includes(w) && w > 0 && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) {
    options.push(answer + Math.floor(rng() * 6) - 3);
  }
  
  return {
    sequence: displayed.map(String),
    answer: String(answer),
    options: shuffleArray(options.map(String), rng),
    hint: `Il passo aumenta ogni volta di ${baseStep}!`,
    type: 'accelerating',
    question: 'Quale numero viene dopo?',
  };
}

function generateFibonacciLike(rng, length) {
  // Each term = sum of two previous
  const a = Math.floor(rng() * 3) + 1;
  const b = Math.floor(rng() * 3) + 1;
  
  const sequence = [a, b];
  for (let i = 2; i < length; i++) {
    sequence.push(sequence[i-1] + sequence[i-2]);
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  const options = [answer];
  const possibleWrong = [
    answer + 1, answer - 1,
    displayed[displayed.length-1] * 2,
    displayed[displayed.length-1] + displayed[displayed.length-2] + 1,
  ];
  for (const w of possibleWrong) {
    if (!options.includes(w) && w > 0 && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) {
    options.push(answer + Math.floor(rng() * 6) - 3);
  }
  
  return {
    sequence: displayed.map(String),
    answer: String(answer),
    options: shuffleArray(options.map(String), rng),
    hint: `Ogni numero è la somma dei due precedenti!`,
    type: 'fibonacci',
    question: 'Quale numero viene dopo?',
  };
}

// NEW: Square numbers sequence (1, 4, 9, 16, 25...)
function generateSquareNumbers(rng, length) {
  const offset = Math.floor(rng() * 3); // start from 1², 2², or 3²
  const sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push((i + 1 + offset) * (i + 1 + offset));
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  const options = [answer];
  const n = length + offset;
  const possibleWrong = [
    answer + 1, answer - 1,
    (n + 1) * (n + 1), // next square
    n * n - 1,
    displayed[displayed.length-1] + (displayed[displayed.length-1] - displayed[displayed.length-2]),
  ];
  for (const w of possibleWrong) {
    if (!options.includes(w) && w > 0 && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) {
    options.push(answer + Math.floor(rng() * 8) - 4);
  }
  
  return {
    sequence: displayed.map(String),
    answer: String(answer),
    options: shuffleArray(options.map(String), rng),
    hint: `Sono numeri quadrati! (1×1, 2×2, 3×3...)`,
    type: 'squares',
    question: 'Quale numero viene dopo?',
  };
}

// NEW: Alternating operations (+a, ×b, +a, ×b...)
function generateAlternatingOperations(rng, length) {
  const start = Math.floor(rng() * 3) + 1;
  const addVal = Math.floor(rng() * 3) + 1;
  const mulVal = 2;
  
  const sequence = [start];
  for (let i = 1; i < length; i++) {
    if (i % 2 === 1) {
      sequence.push(sequence[i-1] + addVal);
    } else {
      sequence.push(sequence[i-1] * mulVal);
    }
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  const options = [answer];
  const possibleWrong = [
    answer + addVal,
    answer * mulVal,
    answer + 1,
    answer - addVal,
    displayed[displayed.length-1] + addVal,
    displayed[displayed.length-1] * mulVal,
  ];
  for (const w of shuffleArray(possibleWrong, rng)) {
    if (!options.includes(w) && w > 0 && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) {
    options.push(answer + Math.floor(rng() * 6) - 3);
  }
  
  return {
    sequence: displayed.map(String),
    answer: String(answer),
    options: shuffleArray(options.map(String), rng),
    hint: `Si alternano due operazioni: +${addVal} e ×${mulVal}!`,
    type: 'alternating-ops',
    question: 'Quale numero viene dopo?',
  };
}

// NEW: Triangular numbers (1, 3, 6, 10, 15, 21...)
function generateTriangularNumbers(rng, length) {
  const offset = Math.floor(rng() * 2); // optional offset
  const sequence = [];
  for (let i = 0; i < length; i++) {
    const n = i + 1 + offset;
    sequence.push((n * (n + 1)) / 2);
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  const options = [answer];
  const possibleWrong = [
    answer + 1,
    answer - 1,
    displayed[displayed.length-1] + (displayed[displayed.length-1] - displayed[displayed.length-2]),
    answer + length + offset + 1,
    answer + 2,
  ];
  for (const w of possibleWrong) {
    if (!options.includes(w) && w > 0 && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) {
    options.push(answer + Math.floor(rng() * 6) - 3);
  }
  
  return {
    sequence: displayed.map(String),
    answer: String(answer),
    options: shuffleArray(options.map(String), rng),
    hint: `Sono numeri triangolari! Il passo aumenta di 1 ogni volta.`,
    type: 'triangular',
    question: 'Quale numero viene dopo?',
  };
}

function generateShapeSequence(rng, length) {
  // Shape-based sequence (emoji patterns)
  const shapes = ['🔴', '🔵', '🟡', '🟢', '🟣', '⭐', '💎', '🔶'];
  const pool = shuffleArray(shapes, rng).slice(0, 3);
  
  // Pattern repeats with period 2 or 3
  const period = Math.floor(rng() * 2) + 2;
  const pattern = pool.slice(0, period);
  
  const sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push(pattern[i % period]);
  }
  
  const answer = sequence[length - 1];
  const displayed = sequence.slice(0, -1);
  
  const options = shuffleArray([...pool, shapes[Math.floor(rng() * shapes.length)]], rng).slice(0, 4);
  if (!options.includes(answer)) {
    options[Math.floor(rng() * 4)] = answer;
  }
  
  return {
    sequence: displayed,
    answer,
    options: shuffleArray(options, rng),
    hint: `Il pattern si ripete ogni ${period} elementi!`,
    type: 'shape-pattern',
    question: 'Quale forma viene dopo?',
  };
}
