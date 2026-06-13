/**
 * Matematica Exercises — Area "DATI" (PO-M CROSS)
 * 
 * Based on CROSS PO-M: "comprende prove che valutano l'utilizzo di rappresentazioni
 * per ricavare informazioni, l'uso della nozione di media aritmetica, l'essere in grado
 * di passare da un'entità di misura ad un'altra, saper lavorare con sequenze di figure
 * e numeri, saper rappresentare relazioni e dati."
 * 
 * Types:
 * A) Media aritmetica — calcolare la media di un insieme di valori
 * B) Conversione unità di misura — km↔m, kg↔g, l↔ml, ore↔minuti, cm↔mm
 * C) Lettura tabelle — interpretare dati da una tabella e rispondere a domande
 * D) Relazioni tra dati — confrontare, ordinare, trovare massimo/minimo/differenza
 * E) Rappresentazioni — interpretare grafici a barre (testuale) e diagrammi
 */

import { seededRandom, shuffleArray } from '../gameEngine.js';

/**
 * Generate a matematica exercise
 */
export function generateMatematicaExercise(seed, difficulty) {
  const rng = seededRandom(seed);
  const day = difficulty.matematica?.day || 0;
  
  const typeRoll = rng();
  if (typeRoll < 0.2) return genMedia(rng, day);
  if (typeRoll < 0.4) return genConversione(rng, day);
  if (typeRoll < 0.6) return genTabella(rng, day);
  if (typeRoll < 0.8) return genRelazioni(rng, day);
  return genRappresentazioni(rng, day);
}

// === A) MEDIA ARITMETICA ===
function genMedia(rng, day) {
  // Number of values increases with difficulty
  const count = day < 7 ? 3 : day < 15 ? 4 : 5;
  
  // Generate numbers that produce a clean average
  const avg = Math.floor(rng() * 8) + 3; // average between 3-10
  const values = [];
  let sum = 0;
  
  for (let i = 0; i < count - 1; i++) {
    const offset = Math.floor(rng() * 5) - 2; // -2 to +2
    values.push(avg + offset);
    sum += avg + offset;
  }
  // Last value ensures exact average
  const lastVal = avg * count - sum;
  values.push(lastVal);
  
  // Shuffle values so it's not obvious
  const displayed = shuffleArray(values, rng);
  const answer = String(avg);
  
  const options = [answer];
  // Common errors: sum instead of average, off-by-one, median confusion
  const distractors = [
    String(avg + 1),
    String(avg - 1),
    String(Math.floor(sum / (count - 1))), // dividing by wrong number
    String(displayed[Math.floor(count / 2)]), // picking middle value (median confusion)
  ];
  
  for (const d of distractors) {
    if (!options.includes(d) && parseInt(d) > 0) options.push(d);
    if (options.length >= 4) break;
  }
  while (options.length < 4) options.push(String(avg + Math.floor(rng() * 4) + 2));
  
  const context = day < 10 
    ? `In ${count} giorni di viaggio spaziale hai percorso: ${displayed.join(', ')} km al giorno.`
    : `Le temperature registrate sulla base lunare sono state: ${displayed.join('°, ')}°.`;
  
  return {
    type: 'matematica',
    subtype: 'media',
    question: `${context}\nQual è la media?`,
    answer,
    options: shuffleArray(options.slice(0, 4), rng),
    hint: `Media = somma di tutti i valori ÷ numero dei valori (${sum}÷${count})`,
  };
}

// === B) CONVERSIONE UNITÀ DI MISURA ===
function genConversione(rng, day) {
  const conversions = [
    // [from, to, factor, category]
    { from: 'km', to: 'm', factor: 1000, cat: 'lunghezza' },
    { from: 'm', to: 'cm', factor: 100, cat: 'lunghezza' },
    { from: 'cm', to: 'mm', factor: 10, cat: 'lunghezza' },
    { from: 'kg', to: 'g', factor: 1000, cat: 'peso' },
    { from: 'g', to: 'mg', factor: 1000, cat: 'peso' },
    { from: 'l', to: 'ml', factor: 1000, cat: 'capacità' },
    { from: 'ore', to: 'minuti', factor: 60, cat: 'tempo' },
    { from: 'minuti', to: 'secondi', factor: 60, cat: 'tempo' },
    { from: 'm', to: 'km', factor: 0.001, cat: 'lunghezza' },
    { from: 'g', to: 'kg', factor: 0.001, cat: 'peso' },
    { from: 'ml', to: 'l', factor: 0.001, cat: 'capacità' },
    { from: 'cm', to: 'm', factor: 0.01, cat: 'lunghezza' },
  ];
  
  // Simple conversions first (multiply), inverse later (divide)
  const pool = day < 10 
    ? conversions.filter(c => c.factor >= 1) 
    : conversions;
  
  const conv = pool[Math.floor(rng() * pool.length)];
  
  let value, correctAnswer;
  if (conv.factor >= 1) {
    // Multiplying: use small numbers
    value = Math.floor(rng() * 5) + 1; // 1-5
    correctAnswer = value * conv.factor;
  } else {
    // Dividing: use numbers that divide cleanly
    const divisor = Math.round(1 / conv.factor);
    value = divisor * (Math.floor(rng() * 4) + 1); // e.g. 1000, 2000, 3000, 4000
    correctAnswer = value * conv.factor;
  }
  
  const answer = String(correctAnswer);
  const options = [answer];
  
  // Common errors
  const wrongOpts = [
    String(correctAnswer * 10),
    String(correctAnswer / 10),
    String(value), // forgetting to convert
    String(correctAnswer + value),
  ];
  for (const w of wrongOpts) {
    if (!options.includes(w) && parseFloat(w) > 0 && w !== answer) options.push(w);
    if (options.length >= 4) break;
  }
  while (options.length < 4) options.push(String(correctAnswer + Math.floor(rng() * 100)));
  
  const contexts = [
    `Il razzo deve percorrere ${value} ${conv.from}. A quanti ${conv.to} corrispondono?`,
    `La riserva di carburante è ${value} ${conv.from}. Quanti ${conv.to} sono?`,
    `La distanza dal pianeta è ${value} ${conv.from}. Convertila in ${conv.to}.`,
  ];
  
  return {
    type: 'matematica',
    subtype: 'conversione',
    question: contexts[Math.floor(rng() * contexts.length)],
    answer,
    options: shuffleArray(options.slice(0, 4), rng),
    hint: `1 ${conv.from} = ${conv.factor >= 1 ? conv.factor : '1/' + Math.round(1/conv.factor)} ${conv.to}`,
  };
}

// === C) LETTURA TABELLE ===
function genTabella(rng, day) {
  const scenarios = [
    () => {
      // Temperature per day
      const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'];
      const temps = days.map(() => Math.floor(rng() * 15) + 10); // 10-24
      const maxIdx = temps.indexOf(Math.max(...temps));
      const minIdx = temps.indexOf(Math.min(...temps));
      const questions = [
        { q: 'Qual è il giorno più caldo?', a: days[maxIdx], opts: shuffleArray([...days], rng).slice(0, 4) },
        { q: 'Qual è il giorno più freddo?', a: days[minIdx], opts: shuffleArray([...days], rng).slice(0, 4) },
        { q: `Quanti gradi ci sono di differenza tra ${days[maxIdx]} e ${days[minIdx]}?`, 
          a: String(temps[maxIdx] - temps[minIdx]),
          opts: shuffleArray([String(temps[maxIdx] - temps[minIdx]), String(temps[maxIdx] - temps[minIdx] + 1), String(temps[maxIdx] - temps[minIdx] - 1), String(Math.floor((temps[maxIdx] + temps[minIdx]) / 2))], rng) },
      ];
      const qIdx = Math.floor(rng() * questions.length);
      const chosen = questions[qIdx];
      if (!chosen.opts.includes(chosen.a)) chosen.opts[0] = chosen.a;
      
      const table = `| Giorno | ${days.join(' | ')} |\n| Temperatura | ${temps.map(t => t + '°').join(' | ')} |`;
      return {
        question: `Stazione meteo della base spaziale:\n\n${table}\n\n${chosen.q}`,
        answer: chosen.a,
        options: shuffleArray(chosen.opts.slice(0, 4), rng),
        hint: 'Leggi attentamente i valori nella tabella!',
      };
    },
    () => {
      // Scores/points of astronauts
      const names = ['Aria', 'Marco', 'Luna', 'Kai', 'Stella'];
      const picked = shuffleArray(names, rng).slice(0, 4);
      const scores = picked.map(() => Math.floor(rng() * 30) + 50); // 50-79
      const total = scores.reduce((a, b) => a + b, 0);
      const avg = Math.floor(total / scores.length);
      const maxIdx = scores.indexOf(Math.max(...scores));
      
      const questions = [
        { q: 'Chi ha il punteggio più alto?', a: picked[maxIdx], opts: shuffleArray([...picked], rng) },
        { q: `Qual è la media dei punteggi?`, a: String(avg), 
          opts: shuffleArray([String(avg), String(avg + 2), String(avg - 1), String(Math.max(...scores))], rng) },
        { q: `Qual è la differenza tra il punteggio più alto e il più basso?`,
          a: String(Math.max(...scores) - Math.min(...scores)),
          opts: shuffleArray([String(Math.max(...scores) - Math.min(...scores)), String(Math.max(...scores) - Math.min(...scores) + 2), String(avg), String(Math.min(...scores))], rng) },
      ];
      const qIdx = Math.floor(rng() * questions.length);
      const chosen = questions[qIdx];
      if (!chosen.opts.includes(chosen.a)) chosen.opts[0] = chosen.a;
      
      const table = picked.map((n, i) => `${n}: ${scores[i]} punti`).join(' | ');
      return {
        question: `Punteggi dell'equipaggio nel test di simulazione:\n${table}\n\n${chosen.q}`,
        answer: chosen.a,
        options: shuffleArray(chosen.opts.slice(0, 4), rng),
        hint: 'Confronta i valori e calcola con attenzione!',
      };
    },
    () => {
      // Distance traveled per day
      const days = ['Giorno 1', 'Giorno 2', 'Giorno 3', 'Giorno 4'];
      const dists = days.map(() => (Math.floor(rng() * 8) + 2) * 10); // 20-90, multiples of 10
      const total = dists.reduce((a, b) => a + b, 0);
      
      const questions = [
        { q: 'Quanti km in totale?', a: String(total), 
          opts: shuffleArray([String(total), String(total + 10), String(total - 10), String(Math.floor(total / 2))], rng) },
        { q: 'In quale giorno si è percorso di più?', a: days[dists.indexOf(Math.max(...dists))],
          opts: shuffleArray([...days], rng) },
        { q: 'Qual è la media giornaliera?', a: String(Math.floor(total / 4)),
          opts: shuffleArray([String(Math.floor(total / 4)), String(Math.floor(total / 3)), String(Math.max(...dists)), String(Math.min(...dists))], rng) },
      ];
      const qIdx = Math.floor(rng() * questions.length);
      const chosen = questions[qIdx];
      if (!chosen.opts.includes(chosen.a)) chosen.opts[0] = chosen.a;
      
      const table = days.map((d, i) => `${d}: ${dists[i]} km`).join(' | ');
      return {
        question: `Distanze percorse dal rover:\n${table}\n\n${chosen.q}`,
        answer: chosen.a,
        options: shuffleArray(chosen.opts.slice(0, 4), rng),
        hint: 'Somma, confronta o dividi secondo la domanda!',
      };
    },
  ];
  
  const scenario = scenarios[Math.floor(rng() * scenarios.length)]();
  return { type: 'matematica', subtype: 'tabella', ...scenario };
}

// === D) RELAZIONI TRA DATI ===
function genRelazioni(rng, day) {
  const exercises = [
    () => {
      // Ordering values
      const values = Array.from({length: 4}, () => Math.floor(rng() * 50) + 10);
      const sorted = [...values].sort((a, b) => a - b);
      const question = rng() > 0.5 ? 'dal più piccolo al più grande' : 'dal più grande al più piccolo';
      const answer = question.includes('piccolo al più grande') 
        ? sorted.join(' < ') 
        : [...sorted].reverse().join(' > ');
      const wrong1 = shuffleArray(values, rng).join(question.includes('piccolo') ? ' < ' : ' > ');
      const wrong2 = (question.includes('piccolo') ? [...sorted].reverse() : sorted).join(question.includes('piccolo') ? ' < ' : ' > ');
      const wrong3 = shuffleArray(values, rng).join(question.includes('piccolo') ? ' < ' : ' > ');
      
      const opts = [answer, wrong1, wrong2, wrong3].filter((v, i, a) => a.indexOf(v) === i);
      while (opts.length < 4) opts.push(shuffleArray(values, rng).join(' < '));
      
      return {
        question: `Ordina questi valori ${question}:\n${values.join(', ')}`,
        answer,
        options: shuffleArray(opts.slice(0, 4), rng),
        hint: 'Confronta i numeri uno per volta!',
      };
    },
    () => {
      // Difference/comparison
      const a = Math.floor(rng() * 40) + 20;
      const b = Math.floor(rng() * 40) + 20;
      const diff = Math.abs(a - b);
      const greater = a > b ? 'Marte' : 'Giove';
      
      return {
        question: `La base su Marte produce ${a} litri di ossigeno al giorno.\nLa base su Giove ne produce ${b}.\nQuanti litri di differenza ci sono?`,
        answer: String(diff),
        options: shuffleArray([String(diff), String(diff + 2), String(a + b), String(Math.max(a, b))], rng),
        hint: `Differenza = il più grande meno il più piccolo (${Math.max(a,b)} - ${Math.min(a,b)})`,
      };
    },
    () => {
      // Double/half relationships
      const base = Math.floor(rng() * 10) + 5;
      const items = [
        { name: 'Alfa', val: base },
        { name: 'Beta', val: base * 2 },
        { name: 'Gamma', val: base * 3 },
        { name: 'Delta', val: base * 4 },
      ];
      const picked = shuffleArray(items, rng).slice(0, 3);
      
      const q = rng() > 0.5
        ? `Quale valore è il doppio di ${picked[0].name} (${picked[0].val})?`
        : `Quale valore è la metà di ${picked[2].name} (${picked[2].val})?`;
      
      const correctVal = rng() > 0.5 ? picked[0].val * 2 : Math.floor(picked[2].val / 2);
      
      return {
        question: `Carburante consumato dalle navi:\n${picked.map(p => `${p.name}: ${p.val} unità`).join(' | ')}\n\n${q}`,
        answer: String(correctVal),
        options: shuffleArray([String(correctVal), String(correctVal + base), String(correctVal - base), String(base)], rng),
        hint: 'Doppio = ×2, Metà = ÷2',
      };
    },
    () => {
      // Who has more/less with conditions
      const crew = ['Aria', 'Marco', 'Luna', 'Kai'];
      const vals = crew.map(() => Math.floor(rng() * 20) + 5);
      const threshold = Math.floor(rng() * 10) + 10;
      const above = crew.filter((_, i) => vals[i] > threshold);
      const count = above.length;
      
      return {
        question: `Campioni raccolti dall'equipaggio:\n${crew.map((c, i) => `${c}: ${vals[i]}`).join(' | ')}\n\nQuanti hanno raccolto più di ${threshold} campioni?`,
        answer: String(count),
        options: shuffleArray([String(count), String(count + 1), String(count - 1 < 0 ? count + 2 : count - 1), String(crew.length)], rng),
        hint: `Conta quanti valori sono maggiori di ${threshold}`,
      };
    },
  ];
  
  const exercise = exercises[Math.floor(rng() * exercises.length)]();
  return { type: 'matematica', subtype: 'relazioni', ...exercise };
}

// === E) RAPPRESENTAZIONI (grafici testuali) ===
function genRappresentazioni(rng, day) {
  const exercises = [
    () => {
      // Bar chart (text-based)
      const items = ['🔴', '🔵', '🟡', '🟢'];
      const labels = ['Ferro', 'Rame', 'Oro', 'Argento'];
      const values = items.map(() => Math.floor(rng() * 8) + 2);
      
      const chart = labels.map((l, i) => `${l}: ${'█'.repeat(values[i])} (${values[i]})`).join('\n');
      
      const total = values.reduce((a, b) => a + b, 0);
      const maxIdx = values.indexOf(Math.max(...values));
      const minIdx = values.indexOf(Math.min(...values));
      
      const questions = [
        { q: 'Quale minerale è stato trovato di più?', a: labels[maxIdx], opts: shuffleArray([...labels], rng) },
        { q: 'Quale minerale è stato trovato di meno?', a: labels[minIdx], opts: shuffleArray([...labels], rng) },
        { q: 'Quanti minerali in totale?', a: String(total), 
          opts: shuffleArray([String(total), String(total + 2), String(total - 1), String(Math.max(...values) * 4)], rng) },
        { q: `Quanti minerali in più ha ${labels[maxIdx]} rispetto a ${labels[minIdx]}?`,
          a: String(values[maxIdx] - values[minIdx]),
          opts: shuffleArray([String(values[maxIdx] - values[minIdx]), String(values[maxIdx]), String(values[minIdx]), String(values[maxIdx] + values[minIdx])], rng) },
      ];
      
      const qIdx = Math.floor(rng() * questions.length);
      const chosen = questions[qIdx];
      if (!chosen.opts.includes(chosen.a)) chosen.opts[0] = chosen.a;
      
      return {
        question: `Minerali trovati sulla luna di Giove:\n\n${chart}\n\n${chosen.q}`,
        answer: chosen.a,
        options: shuffleArray(chosen.opts.slice(0, 4), rng),
        hint: 'Leggi i valori dal grafico e confrontali!',
      };
    },
    () => {
      // Pie chart interpretation (fractions)
      const parts = [
        { name: 'Ossigeno', pct: 40 },
        { name: 'Azoto', pct: 30 },
        { name: 'CO2', pct: 20 },
        { name: 'Altro', pct: 10 },
      ];
      
      const questions = [
        { q: 'Qual è il gas più presente?', a: 'Ossigeno', opts: shuffleArray(parts.map(p => p.name), rng) },
        { q: 'Quanto fanno Ossigeno + Azoto insieme?', a: '70%', opts: shuffleArray(['70%', '60%', '80%', '50%'], rng) },
        { q: 'Quale gas occupa esattamente un quinto (1/5)?', a: 'CO2', opts: shuffleArray(parts.map(p => p.name), rng) },
      ];
      
      const qIdx = Math.floor(rng() * questions.length);
      const chosen = questions[qIdx];
      if (!chosen.opts.includes(chosen.a)) chosen.opts[0] = chosen.a;
      
      const chart = parts.map(p => `${p.name}: ${p.pct}%`).join(' | ');
      return {
        question: `Composizione dell'atmosfera della stazione:\n${chart}\n\n${chosen.q}`,
        answer: chosen.a,
        options: shuffleArray(chosen.opts.slice(0, 4), rng),
        hint: 'Leggi le percentuali e ragiona!',
      };
    },
  ];
  
  const exercise = exercises[Math.floor(rng() * exercises.length)]();
  return { type: 'matematica', subtype: 'rappresentazioni', ...exercise };
}
