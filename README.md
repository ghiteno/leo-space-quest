# 🚀 Leo's Space Quest

App interattiva di logica e ragionamento per Leo (10 anni), basata sui risultati del test CROSS dell'Università Cattolica.

## Aree di esercizio

| Area | Tipo di esercizio | Ispirato a |
|------|------------------|------------|
| **Ragionamento** | Matrici figurali (trova il pezzo mancante nella griglia) | BPA/1 - Raven's Progressive Matrices |
| **Capacità spaziale** | Rotazione e orientamento di figure | BPA/1 - Orientamento spaziale |
| **Logica verbale** | Identifica elementi essenziali di un oggetto | BPA/1 - Discriminazione elementi costitutivi |
| **Sequenze (Dati)** | Completa sequenze numeriche e figurali | PO-M - Sequenze e pattern |

## Meccaniche di gioco

- 🪐 **Narrativa spaziale**: esplori pianeti risolvendo enigmi
- ⭐ **XP e Livelli**: guadagni XP per ogni risposta corretta + bonus
- 🔥 **Streak giornaliera**: bonus per i giorni consecutivi
- 📈 **Difficoltà progressiva**: ogni giorno gli esercizi sono leggermente più difficili
- 🎯 **12 esercizi/sessione**: ~15 minuti di gioco al giorno
- 🌀 **Esercizi unici ogni giorno**: seed deterministico basato sulla data

## Deploy su Vercel

### Opzione 1: CLI
```bash
npm install
npm run build
npx vercel --prod
```

### Opzione 2: GitHub + Vercel
1. Push questo progetto su un repo GitHub
2. Vai su vercel.com → New Project → Import dal repo
3. Framework: Vite → Deploy

### Opzione 3: Drag & drop
```bash
npm install
npm run build
```
Poi trascina la cartella `dist/` su vercel.com/new

## Sviluppo locale

```bash
npm install
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

## Struttura

```
src/
├── App.jsx              # Componente principale + schermate
├── gameEngine.js        # Progressione, XP, difficoltà, seed
├── exercises/
│   ├── reasoning.js     # Matrici figurali (Raven-style)
│   ├── spatial.js       # Rotazione/orientamento
│   ├── verbalLogic.js   # Elementi essenziali
│   └── sequences.js     # Sequenze numeriche/figurali
├── index.css            # Stili globali (tema spaziale)
└── main.jsx             # Entry point React
```

## Progressione difficoltà

| Giorno | Ragionamento | Spaziale | Logica Verbale | Sequenze |
|--------|-------------|----------|----------------|----------|
| 1-5 | Pattern 2×2 semplici | 4 direzioni base | 2 elementi, distrattori ovvi | +n costante |
| 6-14 | Pattern 3×3, 2 regole | Figure composite | 3 elementi, distrattori misti | Alternanti, geometriche |
| 15-30 | 3×3 complessi, aritmetica | Griglie 2×2 | 4 elementi, distrattori sottili | Fibonacci, acceleranti |
| 30+ | Multi-regola, XOR | Mirror + composite | Astrazione alta | Doppie regole |
