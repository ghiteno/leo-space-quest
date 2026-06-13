# 📋 Leo's Space Quest — Catalogo Esercizi per Dominio

> Documento di riferimento: tipologie di domande implementate nell'app, organizzate per area del test CROSS (Università Cattolica — BPA/1 + PO-M + PO-I)

---

## 🧩 RAGIONAMENTO (BPA/1 — Matrici figurali)

**Cosa misura:** capacità di comprendere le relazioni tra le diverse parti di un insieme.  
**Formato CROSS:** 3 o 5 figure in griglia, uno spazio vuoto, scegliere tra alternative.  
**Livello Leo (CROSS):** Medio-Basso ⚠️

### Pattern implementati

| # | Tipo | Descrizione | Esempio |
|---|------|-------------|---------|
| 1 | **Riga uguale** | Ogni riga contiene gli stessi 3 simboli in ordine diverso (quadrato latino) | `● ■ ▲` / `■ ▲ ●` / `▲ ● ?` → risposta: `■` |
| 2 | **Conteggio crescente** | Il numero di simboli cresce per colonna | `● ●● ●●●` / `● ●● ●●●` / `● ●● ?` → risposta: `●●●` |
| 3 | **Diagonale** | Un simbolo ricorre solo sulla diagonale | `★ ◆ ◆` / `◆ ★ ◆` / `◆ ◆ ?` → risposta: `★` |
| 4 | **Griglia numerica** | Numeri disposti in griglia con regola aritmetica costante | `2 5 8` / `11 14 17` / `20 23 ?` → risposta: `26` |
| 5 | **Somma righe** | Ogni riga somma allo stesso totale | `4 3 5` / `6 2 4` / `3 5 ?` → risposta: `4` |
| 6 | **Sottrazione per colonna** | La differenza tra righe è costante per colonna | `9 8 7` / `6 5 4` / `3 2 ?` → risposta: `1` |
| 7 | **Shift ciclico** | I simboli ruotano di posizione ad ogni riga (A→B→C→A) | `▲ ■ ●` / `● ▲ ■` / `■ ● ?` → risposta: `▲` |

### Progressione difficoltà
- **Giorni 1-5:** Pattern semplici (riga uguale, conteggio) — griglia 2×2 implicita
- **Giorni 6-14:** Pattern medi (quadrato latino, numeri) — 3×3 con 2 regole
- **Giorni 15+:** Pattern complessi (somma, sottrazione, shift multiplo)

---

## 🔄 CAPACITÀ SPAZIALE (BPA/1 — Orientamento)

**Cosa misura:** capacità di riconoscere i cambiamenti di posizione nello spazio.  
**Formato CROSS:** individuare, tra figure alternative, quelle orientate nello stesso senso della figura evidenziata.  
**Livello Leo (CROSS):** Medio (fascia bassa)

### Pattern implementati

| # | Tipo | Descrizione | Esempio |
|---|------|-------------|---------|
| 1 | **Orientamento semplice** | Trova la freccia/forma nella stessa direzione | Modello: `▲` → opzioni: `▲ ▶ ▼ ◀` → risposta: `▲` |
| 2 | **Angoli** | Triangoli orientati in 4 direzioni | Modello: `◢` → opzioni: `◢ ◣ ◤ ◥` → risposta: `◢` |
| 3 | **Forme a L** | L ruotata in 4 posizioni | Modello: `┘` → opzioni: `┘ └ ┐ ┌` → risposta: `┘` |
| 4 | **Forme a T** | T ruotata in 4 posizioni | Modello: `┴` → opzioni: `┴ ├ ┬ ┤` → risposta: `┴` |

### Progressione difficoltà
- **Giorni 1-7:** Forme singole, 4 opzioni chiare
- **Giorni 8-14:** Figure composite (2 simboli accoppiati), introduzione mirror
- **Giorni 15+:** Griglie 2×2, figure con differenze sottili

---

## 📝 LOGICA VERBALE (BPA/1 — Elementi costitutivi)

**Cosa misura:** capacità di discriminare gli elementi essenziali di un oggetto.  
**Formato CROSS:** individuare, tra una serie di elementi, quelli costitutivi dell'oggetto evidenziato.  
**Livello Leo (CROSS):** Medio (fascia bassa)

### Database oggetti (26 totali)

Categorie: Tecnologia, Trasporti, Natura, Corpo, Scienza, Cultura, Sport, Luoghi.

### Meccanica
- Il bambino deve selezionare N elementi **essenziali** (indispensabili) tra 5-8 opzioni
- Le opzioni mischiano: elementi essenziali + correlati (ma non indispensabili) + estranei
- **Difficoltà crescente:** meno distrattori "ovvi", più distrattori "correlati ma non essenziali"

### Progressione difficoltà
- **Giorni 1-5:** 2 elementi da trovare, distrattori ovvi (ruote per un albero)
- **Giorni 6-14:** 3 elementi, mix di distrattori correlati e lontani
- **Giorni 15+:** 4 elementi, distrattori prevalentemente correlati

---

## 🔢 SEQUENZE E DATI (PO-M — Area "Dati")

**Cosa misura:** saper lavorare con sequenze di figure e numeri, riconoscere pattern.  
**Formato CROSS:** trovare l'elemento successivo in una sequenza logica.  
**Livello Leo (CROSS):** Medio-Basso ⚠️

### Pattern implementati

| # | Tipo | Regola | Esempio |
|---|------|--------|---------|
| 1 | **Aritmetica costante** | +n ad ogni passo | `3 → 7 → 11 → 15 → ?` → risposta: `19` (+4) |
| 2 | **Geometrica** | ×n ad ogni passo | `2 → 4 → 8 → 16 → ?` → risposta: `32` (×2) |
| 3 | **Fibonacci-like** | ogni termine = somma dei 2 precedenti | `1 → 3 → 4 → 7 → 11 → ?` → risposta: `18` |
| 4 | **Pattern di forme** | sequenza ciclica di emoji | `🔴 🔵 🟡 🔴 🔵 ?` → risposta: `🟡` (periodo 3) |
| 5 | **Numeri quadrati** | n² | `1 → 4 → 9 → 16 → ?` → risposta: `25` |
| 6 | **Operazioni alternate** | +a poi ×2 in alternanza | `2 → 5 → 10 → 13 → 26 → ?` → risposta: `29` |
| 7 | **Numeri triangolari** | passo cresce di +1 | `1 → 3 → 6 → 10 → ?` → risposta: `15` |

### Progressione difficoltà
- **Giorni 1-5:** Aritmetica costante (+2, +3, +5) e pattern forme semplici
- **Giorni 6-14:** Geometrica, alternanti, Fibonacci
- **Giorni 15+:** Quadrati, triangolari, operazioni alternate

---

## 📖 ITALIANO / GRAMMATICA (PO-I — Riflessione sulla lingua) ⭐ NUOVO

**Cosa misura:** conoscenza delle regole grammaticali, sintattiche, ortografiche e lessicali.  
**Formato CROSS:** domande a scelta multipla su analisi logica, coniugazioni verbali, connettivi, ortografia, lessico.  
**Target:** 10-11 anni (fine quinta elementare / inizio prima media)

### Tipologie implementate

| # | Tipo | Descrizione | Esempio |
|---|------|-------------|---------|
| A | **Analisi logica** | Identificare soggetto, predicato o complemento | "Il gatto dorme sul divano." → Qual è il SOGGETTO? → `Il gatto` |
| B | **Verbi** | Identificare tempo/modo, coniugare correttamente | "Domani io ___ al parco." → `andrò` / vado / andai / andassi |
| C | **Connettivi** | Scegliere il connettivo corretto tra due frasi | "Ho studiato molto ___ ho preso un bel voto." → `quindi` |
| D | **Ortografia** | Individuare la forma corretta tra opzioni | qual è vs qual'è → `qual è` |
| E | **Sinonimi/Lessico** | Trovare il sinonimo tra 4-5 opzioni | "felice" → `contento` / triste / arrabbiato / stanco |

### Database domande (52 totali)
- **Analisi logica:** 14 domande (soggetto, predicato, complementi oggetto/luogo/tempo/modo/termine/causa/compagnia)
- **Verbi:** 12 domande (presente, passato prossimo, imperfetto, futuro, condizionale, congiuntivo)
- **Connettivi:** 11 domande (quindi, però, perché, inoltre, oppure, tuttavia, ma, se, affinché, sebbene, dato che)
- **Ortografia:** 13 domande (apostrofo, accenti, forme corrette comuni)
- **Sinonimi:** 16 domande (dal concreto all'astratto)

### Progressione difficoltà
| Giorni | Analisi logica | Verbi | Connettivi | Ortografia | Sinonimi |
|--------|---------------|-------|------------|------------|----------|
| **1-10** | Soggetto, predicato, compl. oggetto | Presente, passato prossimo, imperfetto, futuro | quindi, però, perché, inoltre, oppure | Apostrofo base (qual è, un amico) | Parole concrete (felice, grande, veloce) |
| **10+** | Compl. termine, causa, compagnia, modo | Condizionale, congiuntivo | tuttavia, sebbene, affinché, dato che | Forme complesse (ce l'ho, soprattutto) | Parole astratte (ostacolo, indifferente, conseguenza) |

---

## 🔢 MATEMATICA / DATI (PO-M — Area "Dati") ⭐ AGGIORNATO

**Cosa misura:** utilizzo di rappresentazioni per ricavare informazioni, media aritmetica, conversione unità di misura, sequenze, rappresentare relazioni e dati.  
**Formato CROSS:** "comprende prove che valutano l'utilizzo di rappresentazioni per ricavare informazioni, l'uso della nozione di media aritmetica, l'essere in grado di passare da un'entità di misura ad un'altra, saper lavorare con sequenze di figure e numeri, saper rappresentare relazioni e dati."  
**Livello Leo (CROSS):** Medio-Basso ⚠️  
**Target:** 10-11 anni

### Tipologie implementate

| # | Tipo | Descrizione | Esempio |
|---|------|-------------|---------|
| A | **Media aritmetica** | Calcolare la media di un insieme di valori | "Km percorsi in 4 giorni: 5, 7, 3, 9. Media?" → `6` |
| B | **Conversione unità** | Passare da un'unità all'altra | "3 km = quanti m?" → `3000` |
| C | **Lettura tabelle** | Ricavare informazioni da tabelle di dati | "Tabella temperature: quale giorno è il più caldo?" → `Mer` |
| D | **Relazioni tra dati** | Confrontare, ordinare, calcolare differenze | "Base Marte: 45 litri. Base Giove: 32 litri. Differenza?" → `13` |
| E | **Rappresentazioni** | Interpretare grafici a barre (testuali) | "Grafico minerali: quale il più frequente?" → `Ferro` |

### Dettaglio per tipologia

#### A — Media aritmetica
- 3 valori (giorni 1-7), 4 valori (giorni 8-14), 5 valori (giorni 15+)
- Numeri interi con media esatta (niente decimali)
- Distrattori: media ±1, divisione per numero sbagliato, valore mediano
- Contesto spaziale: km percorsi, temperature, punteggi equipaggio

#### B — Conversione unità di misura
| Da | A | Fattore | Quando |
|----|---|---------|--------|
| km | m | ×1000 | Giorni 1+ |
| m | cm | ×100 | Giorni 1+ |
| cm | mm | ×10 | Giorni 1+ |
| kg | g | ×1000 | Giorni 1+ |
| l | ml | ×1000 | Giorni 1+ |
| ore | minuti | ×60 | Giorni 1+ |
| minuti | secondi | ×60 | Giorni 5+ |
| m | km | ÷1000 | Giorni 10+ |
| g | kg | ÷1000 | Giorni 10+ |
| ml | l | ÷1000 | Giorni 10+ |
| cm | m | ÷100 | Giorni 10+ |

Distrattori: ×10 o ÷10 (confusione fattore), valore non convertito, somma

#### C — Lettura tabelle
- Tabelle con 4-5 colonne (giorni, astronauti, rover)
- Domande: valore massimo, minimo, differenza, media, totale
- Generazione procedurale: valori random, domanda random → alta variabilità

#### D — Relazioni tra dati
- Differenze tra valori
- Contare quanti valori superano una soglia
- Trovare doppio/metà
- Ordinare dal più piccolo al più grande (e viceversa)
- Calcolare totali e confrontarli

#### E — Rappresentazioni (grafici)
- Grafici a barre testuali (`█████`) con valori espliciti
- Composizione percentuale (diagrammi a torta descrittivi)
- Domande: valore massimo, differenza, totale, interpretazione frazioni

### Progressione difficoltà

| Giorni | Media | Conversione | Tabelle | Relazioni |
|--------|-------|-------------|---------|-----------|
| 1-7 | 3 valori, numeri piccoli | Solo ×, fattori ×10/100/1000 | Tabelle semplici, 1 domanda | Differenze dirette |
| 8-14 | 4 valori | ×60 (tempo) | Tabelle con media e totale | Soglie, ordinamento |
| 15+ | 5 valori | Conversioni inverse (÷) | Domande composite | Doppio/metà, multi-dato |


## 📊 Mappatura CROSS → App (v3)

| Area CROSS | Livello Leo | Copertura nell'app | N. esercizi/sessione |
|-----------|-------------|-------------------|---------------------|
| Ragionamento (BPA/1) | Medio-Basso | ✅ 7 pattern | 2 |
| Capacità spaziale (BPA/1) | Medio | ✅ 4 pattern | 2 |
| Logica verbale (BPA/1) | Medio | ✅ 26 oggetti | 3 |
| Dati/Sequenze (PO-M) | Medio-Basso | ✅ 7 pattern | 3 |
| **Italiano/Grammatica (PO-I)** | — | ✅ 5 tipologie, 52 domande | **3** |
| **Matematica/Numeri (PO-M)** | Medio-Alto | ✅ 5 tipologie, 51 domande | **3** |
| **Totale** | | | **16/sessione (~18 min)** |

---

## 🎮 Sistema di punteggio

| Azione | XP |
|--------|-----|
| Risposta corretta | +10 |
| Tutte corrette (16/16) | +20 bonus |
| Streak giornaliera | +5 × giorni (max +50) |
| Bonus difficoltà | +2 × giorno |

**Livelli:** ogni livello richiede ~30% di XP in più del precedente.  
**Pianeti sbloccabili:** Mercury (lv1) → Venus (lv3) → Mars (lv5) → Jupiter (lv8) → Saturn (lv12) → Neptune (lv16) → Pluto (lv20)

---

*Documento generato per Leo's Space Quest v3 — Giugno 2026*
