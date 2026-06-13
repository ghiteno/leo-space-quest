/**
 * Reasoning Exercises — Matrix pattern completion (Raven-style)
 * 
 * Based on CROSS BPA/1: "3 o 5 figure disposte orizzontalmente e verticalmente,
 * uno spazio è lasciato vuoto: bisogna scegliere tra le figure alternative
 * quella adatta a completare l'insieme."
 */

import { seededRandom, shuffleArray } from '../gameEngine.js';

// Shape primitives
const SHAPES = ['●', '■', '▲', '◆', '★', '⬟', '⬢', '◯', '□', '△'];
const COLORS = ['#ff6b6b', '#6c63ff', '#00d4aa', '#ffd700', '#ff9f43', '#54a0ff', '#5f27cd', '#01a3a4'];

// Transformations that can be applied to create patterns
const TRANSFORMS = {
  rotate: (shapes) => [...shapes.slice(1), shapes[0]],
  addOne: (shapes, pool) => [...shapes, pool[shapes.length % pool.length]],
  removeOne: (shapes) => shapes.slice(0, -1),
  mirror: (shapes) => [...shapes].reverse(),
  increment: (n) => n + 1,
  double: (n) => n * 2,
};

/**
 * Generate a reasoning exercise
 * Returns: { grid: string[][], answer: string, options: string[], explanation: string }
 */
export function generateReasoningExercise(seed, difficulty) {
  const rng = seededRandom(seed);
  const complexity = difficulty.reasoning.complexity;
  
  // Choose pattern type based on complexity
  if (complexity <= 2) {
    return generateSimplePattern(rng, difficulty);
  } else if (complexity <= 4) {
    return generateMediumPattern(rng, difficulty);
  } else {
    return generateComplexPattern(rng, difficulty);
  }
}

function generateSimplePattern(rng, difficulty) {
  // Simple: same shape repeats with one property changing
  const baseShape = SHAPES[Math.floor(rng() * 5)];
  const patterns = [
    // Count increases per row
    () => {
      const grid = [
        [baseShape, baseShape + baseShape, baseShape.repeat(3)],
        [baseShape, baseShape + baseShape, baseShape.repeat(3)],
        [baseShape, baseShape + baseShape, '?'],
      ];
      const answer = baseShape.repeat(3);
      const options = generateDistractors(answer, baseShape, rng, difficulty);
      return { grid, answer, options, type: 'count-pattern' };
    },
    // Same shape in each row, different per row
    () => {
      const s1 = SHAPES[Math.floor(rng() * 5)];
      const s2 = SHAPES[Math.floor(rng() * 5 + 5)];
      const s3 = SHAPES[Math.floor(rng() * 4)];
      const grid = [
        [s1, s1, s1],
        [s2, s2, s2],
        [s3, s3, '?'],
      ];
      const answer = s3;
      const options = generateShapeDistractors(answer, rng, difficulty);
      return { grid, answer, options, type: 'row-same' };
    },
    // Diagonal pattern
    () => {
      const s1 = SHAPES[Math.floor(rng() * 3)];
      const s2 = SHAPES[Math.floor(rng() * 3 + 3)];
      const grid = [
        [s1, s2, s2],
        [s2, s1, s2],
        [s2, s2, '?'],
      ];
      const answer = s1;
      const options = generateShapeDistractors(answer, rng, difficulty);
      return { grid, answer, options, type: 'diagonal' };
    },
    // NEW: Column pattern (each column same, rows different)
    () => {
      const s1 = SHAPES[Math.floor(rng() * 3)];
      const s2 = SHAPES[Math.floor(rng() * 3 + 3)];
      const s3 = SHAPES[Math.floor(rng() * 4 + 5)];
      const grid = [
        [s1, s2, s3],
        [s1, s2, s3],
        [s1, s2, '?'],
      ];
      const answer = s3;
      const options = generateShapeDistractors(answer, rng, difficulty);
      return { grid, answer, options, type: 'column-same' };
    },
  ];
  
  const patternFn = patterns[Math.floor(rng() * patterns.length)];
  return patternFn();
}

function generateMediumPattern(rng, difficulty) {
  // Medium: two properties change (shape + count, or rotation)
  const patterns = [
    // Each row has unique shapes, each col has unique shapes (Latin square)
    () => {
      const pool = shuffleArray(SHAPES.slice(0, 6), rng).slice(0, 3);
      const grid = [
        [pool[0], pool[1], pool[2]],
        [pool[1], pool[2], pool[0]],
        [pool[2], pool[0], '?'],
      ];
      const answer = pool[1];
      const options = generateShapeDistractors(answer, rng, difficulty);
      return { grid, answer, options, type: 'latin-square' };
    },
    // Number sequence in grid
    () => {
      const start = Math.floor(rng() * 3) + 1;
      const step = Math.floor(rng() * 2) + 1;
      const nums = [];
      for (let i = 0; i < 9; i++) nums.push(start + i * step);
      const grid = [
        [String(nums[0]), String(nums[1]), String(nums[2])],
        [String(nums[3]), String(nums[4]), String(nums[5])],
        [String(nums[6]), String(nums[7]), '?'],
      ];
      const answer = String(nums[8]);
      const options = [answer];
      while (options.length < 4) {
        const distractor = String(nums[8] + (Math.floor(rng() * 5) - 2) * step);
        if (!options.includes(distractor) && distractor !== answer) {
          options.push(distractor);
        }
      }
      return { grid, answer, options: shuffleArray(options, rng), type: 'number-grid' };
    },
    // Shape + size combination
    () => {
      const shapes = ['●', '■', '▲'];
      const grid = [
        [shapes[0], shapes[1], shapes[2]],
        [shapes[0]+shapes[0], shapes[1]+shapes[1], shapes[2]+shapes[2]],
        [shapes[0].repeat(3), shapes[1].repeat(3), '?'],
      ];
      const answer = shapes[2].repeat(3);
      const options = generateDistractors(answer, shapes[2], rng, difficulty);
      return { grid, answer, options, type: 'shape-growth' };
    },
    // NEW: Row sum pattern (numbers in each row sum to same value)
    () => {
      const total = Math.floor(rng() * 5) + 9; // sum between 9 and 13
      const r1a = Math.floor(rng() * 3) + 1;
      const r1b = Math.floor(rng() * 3) + 2;
      const r1c = total - r1a - r1b;
      const r2a = Math.floor(rng() * 3) + 2;
      const r2b = Math.floor(rng() * 3) + 1;
      const r2c = total - r2a - r2b;
      const r3a = Math.floor(rng() * 3) + 1;
      const r3b = Math.floor(rng() * 4) + 1;
      const r3c = total - r3a - r3b;
      const grid = [
        [String(r1a), String(r1b), String(r1c)],
        [String(r2a), String(r2b), String(r2c)],
        [String(r3a), String(r3b), '?'],
      ];
      const answer = String(r3c);
      const options = [answer];
      while (options.length < 4) {
        const d = String(r3c + Math.floor(rng() * 5) - 2);
        if (!options.includes(d) && d !== answer && parseInt(d) > 0) options.push(d);
      }
      return { grid, answer, options: shuffleArray(options, rng), type: 'row-sum', hint: `Ogni riga somma a ${total}!` };
    },
  ];
  
  const patternFn = patterns[Math.floor(rng() * patterns.length)];
  return patternFn();
}

function generateComplexPattern(rng, difficulty) {
  // Complex: multiple rules operating simultaneously
  const patterns = [
    // XOR-like pattern (shape in cell = combination of row/col rule)
    () => {
      const pool = shuffleArray(SHAPES.slice(0, 4), rng);
      // Each cell = row_shape + col_modifier
      const grid = [
        [pool[0], pool[1], pool[2]],
        [pool[2], pool[0], pool[1]],
        [pool[1], pool[2], '?'],
      ];
      const answer = pool[0];
      const options = generateShapeDistractors(answer, rng, difficulty);
      return { grid, answer, options, type: 'rotation-pattern' };
    },
    // Arithmetic in shapes
    () => {
      const a = Math.floor(rng() * 3) + 1;
      const b = Math.floor(rng() * 3) + 1;
      const op = rng() > 0.5 ? '+' : '×';
      const compute = op === '+' ? (x, y) => x + y : (x, y) => x * y;
      const grid = [
        [String(a), String(b), String(compute(a, b))],
        [String(b), String(a+1), String(compute(b, a+1))],
        [String(a+1), String(b+1), '?'],
      ];
      const answer = String(compute(a+1, b+1));
      const options = [answer];
      for (let i = 0; options.length < 4; i++) {
        const d = String(parseInt(answer) + (Math.floor(rng() * 5) - 2));
        if (!options.includes(d) && d !== answer) options.push(d);
      }
      return { grid, answer, options: shuffleArray(options, rng), type: 'arithmetic-grid' };
    },
    // NEW: Subtraction pattern (each row decreases by rule)
    () => {
      const start = Math.floor(rng() * 3) + 8;
      const sub1 = Math.floor(rng() * 2) + 1;
      const sub2 = Math.floor(rng() * 2) + 2;
      const grid = [
        [String(start), String(start - sub1), String(start - sub1 - sub2)],
        [String(start + 1), String(start + 1 - sub1), String(start + 1 - sub1 - sub2)],
        [String(start + 2), String(start + 2 - sub1), '?'],
      ];
      const answer = String(start + 2 - sub1 - sub2);
      const options = [answer];
      while (options.length < 4) {
        const d = String(parseInt(answer) + Math.floor(rng() * 5) - 2);
        if (!options.includes(d) && d !== answer && parseInt(d) > 0) options.push(d);
      }
      return { grid, answer, options: shuffleArray(options, rng), type: 'subtraction-grid', hint: `Ogni colonna sottrae un valore fisso!` };
    },
    // NEW: Mirror + rotate pattern
    () => {
      const pool = shuffleArray(SHAPES.slice(0, 5), rng);
      // Row 1: A B C, Row 2: C A B, Row 3: B C ?→A
      const grid = [
        [pool[0], pool[1], pool[2]],
        [pool[2], pool[0], pool[1]],
        [pool[1], pool[2], '?'],
      ];
      const answer = pool[0];
      const options = generateShapeDistractors(answer, rng, difficulty);
      return { grid, answer, options, type: 'cyclic-shift' };
    },
  ];
  
  const patternFn = patterns[Math.floor(rng() * patterns.length)];
  return patternFn();
}

function generateDistractors(answer, baseShape, rng, difficulty) {
  const options = [answer];
  const possibleCounts = [1, 2, 3, 4, 5];
  while (options.length < 4) {
    const count = possibleCounts[Math.floor(rng() * possibleCounts.length)];
    const distractor = baseShape.repeat(count);
    if (!options.includes(distractor)) options.push(distractor);
  }
  return shuffleArray(options, rng);
}

function generateShapeDistractors(answer, rng, difficulty) {
  const options = [answer];
  const pool = shuffleArray(SHAPES, rng);
  for (const s of pool) {
    if (options.length >= 4) break;
    if (!options.includes(s)) options.push(s);
  }
  return shuffleArray(options, rng);
}
