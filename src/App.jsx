import React, { useState, useEffect, useCallback } from 'react';
import { 
  loadState, saveState, getDayNumber, generateSession, 
  getDifficulty, calculateXP, getLevel, getCurrentPlanet, 
  getNextPlanet, getMissionNarrative, PLANETS 
} from './gameEngine.js';
import { generateReasoningExercise } from './exercises/reasoning.js';
import { generateSpatialExercise } from './exercises/spatial.js';
import { generateVerbalLogicExercise } from './exercises/verbalLogic.js';
import { generateSequenceExercise } from './exercises/sequences.js';

// Stars background
function Stars() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: `${1 + Math.random() * 2}px`,
  }));
  
  return (
    <div className="stars">
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          left: s.left, top: s.top,
          animationDelay: s.delay,
          width: s.size, height: s.size,
        }} />
      ))}
    </div>
  );
}

// Header with XP and streak
function GameHeader({ state }) {
  const { level, xpInLevel, xpForNext } = getLevel(state.totalXP);
  const planet = getCurrentPlanet(level);
  
  return (
    <div style={{ width: '100%', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--accent-gold)' }}>
              Livello {level}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Pianeta: {planet.name} {planet.emoji}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, color: 'var(--accent-gold)', fontWeight: 700 }}>
            {state.totalXP} XP
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            🔥 {state.streak} giorni
          </div>
        </div>
      </div>
      <div className="xp-bar">
        <div className="xp-fill" style={{ width: `${(xpInLevel / xpForNext) * 100}%` }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
        {xpInLevel}/{xpForNext} XP per il prossimo livello
      </div>
    </div>
  );
}

// Welcome / Start screen
function WelcomeScreen({ state, onStart, onStats }) {
  const { level } = getLevel(state.totalXP);
  const planet = getCurrentPlanet(level);
  const nextPlanet = getNextPlanet(level);
  
  return (
    <div className="card animate-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🚀</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8, color: 'var(--accent-primary)' }}>
        Space Quest
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
        Missione giornaliera su {planet.name} {planet.emoji}
      </p>
      
      {state.streak > 0 && (
        <div style={{ 
          background: 'rgba(255, 215, 0, 0.1)', 
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 'var(--radius-sm)', 
          padding: '12px 16px', 
          marginBottom: 16 
        }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 600, marginLeft: 8 }}>
            {state.streak} giorni consecutivi!
          </span>
        </div>
      )}
      
      {nextPlanet && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
          Prossimo pianeta: {nextPlanet.name} {nextPlanet.emoji} (livello {nextPlanet.unlockLevel})
        </p>
      )}
      
      <button className="btn-primary" onClick={onStart} style={{ width: '100%', fontSize: 18 }}>
        🛸 Inizia la Missione
      </button>
      
      <button className="btn-primary" onClick={onStats} style={{ 
        width: '100%', fontSize: 16, marginTop: 12,
        background: 'linear-gradient(135deg, #00d4aa, #00b894)',
        boxShadow: '0 4px 16px rgba(0,212,170,0.3)',
      }}>📊 Statistiche</button>
      
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        <StatBox label="Missioni" value={state.daysPlayed} emoji="📋" />
        <StatBox label="Livello" value={getLevel(state.totalXP).level} emoji="⭐" />
        <StatBox label="XP Totali" value={state.totalXP} emoji="💎" />
        <StatBox label="Streak" value={state.streak} emoji="🔥" />
      </div>
    </div>
  );
}

function StatBox({ label, value, emoji }) {
  return (
    <div style={{ 
      background: 'var(--bg-card-hover)', 
      borderRadius: 'var(--radius-sm)', 
      padding: '10px 8px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 18 }}>{emoji}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

// Already completed today screen
function CompletedScreen({ state }) {
  const { level } = getLevel(state.totalXP);
  const planet = getCurrentPlanet(level);
  
  return (
    <div className="card animate-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent-secondary)', marginBottom: 12 }}>
        Missione completata!
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
        Hai già completato la missione di oggi su {planet.name} {planet.emoji}.<br/>
        Torna domani per una nuova sfida!
      </p>
      <div style={{ 
        background: 'rgba(0, 212, 170, 0.1)', 
        border: '1px solid rgba(0, 212, 170, 0.3)',
        borderRadius: 'var(--radius-sm)', 
        padding: 16, 
        marginBottom: 16 
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-secondary)' }}>
          🔥 {state.streak} giorni di fila
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        <StatBox label="Livello" value={level} emoji="⭐" />
        <StatBox label="XP Totali" value={state.totalXP} emoji="💎" />
      </div>
    </div>
  );
}

// Exercise renderer
function ExerciseView({ exercise, difficulty, onAnswer, questionNumber, totalQuestions }) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [revealed, setRevealed] = useState(false);
  
  const planet = getCurrentPlanet(getLevel(0).level);
  const narrative = getMissionNarrative(exercise.type, 'questo pianeta');
  
  // Generate exercise data based on type
  const exerciseData = React.useMemo(() => {
    switch (exercise.type) {
      case 'reasoning':
        return generateReasoningExercise(exercise.seed, difficulty);
      case 'spatial':
        return generateSpatialExercise(exercise.seed, difficulty);
      case 'verbalLogic':
        return generateVerbalLogicExercise(exercise.seed, difficulty);
      case 'sequences':
        return generateSequenceExercise(exercise.seed, difficulty);
      default:
        return null;
    }
  }, [exercise.seed, exercise.type, difficulty]);
  
  if (!exerciseData) return null;
  
  const handleSelect = (option) => {
    if (revealed) return;
    
    if (exercise.type === 'verbalLogic') {
      // Multi-select for verbal logic
      const newSelected = selectedAnswers.includes(option)
        ? selectedAnswers.filter(a => a !== option)
        : [...selectedAnswers, option];
      setSelectedAnswers(newSelected);
      
      // Auto-submit when enough selected
      if (newSelected.length === exerciseData.numToSelect) {
        const isCorrect = newSelected.every(a => exerciseData.correctAnswers.includes(a));
        setFeedback(isCorrect ? 'correct' : 'wrong');
        setRevealed(true);
        setTimeout(() => onAnswer(isCorrect), 1500);
      }
    } else {
      // Single select for other types
      setSelectedAnswers([option]);
      const isCorrect = option === (exerciseData.answer || exerciseData.answer);
      setFeedback(isCorrect ? 'correct' : 'wrong');
      setRevealed(true);
      setTimeout(() => onAnswer(isCorrect), 1200);
    }
  };
  
  const getTypeLabel = (type) => {
    switch(type) {
      case 'reasoning': return '🧩 Ragionamento';
      case 'spatial': return '🔄 Spazio';
      case 'verbalLogic': return '📝 Logica Verbale';
      case 'sequences': return '🔢 Sequenze';
      default: return '❓';
    }
  };
  
  return (
    <div className="animate-in" style={{ width: '100%' }}>
      {/* Progress */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>{getTypeLabel(exercise.type)}</span>
          <span>{questionNumber}/{totalQuestions}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} />
        </div>
      </div>
      
      {/* Narrative */}
      <div style={{ 
        background: 'rgba(108, 99, 255, 0.08)', 
        borderRadius: 'var(--radius-sm)', 
        padding: '10px 14px', 
        marginBottom: 16,
        fontSize: 13,
        color: 'var(--text-secondary)',
        fontStyle: 'italic',
      }}>
        💬 {narrative}
      </div>
      
      {/* Exercise content */}
      <div className="card">
        {exercise.type === 'reasoning' && <ReasoningDisplay data={exerciseData} />}
        {exercise.type === 'spatial' && <SpatialDisplay data={exerciseData} />}
        {exercise.type === 'verbalLogic' && <VerbalLogicDisplay data={exerciseData} />}
        {exercise.type === 'sequences' && <SequenceDisplay data={exerciseData} />}
        
        {/* Options */}
        <div className="options-grid" style={
          exercise.type === 'verbalLogic' ? { gridTemplateColumns: '1fr' } : {}
        }>
          {(exerciseData.options || []).map((option, i) => {
            let className = 'option-btn';
            if (revealed && exercise.type !== 'verbalLogic') {
              if (option === exerciseData.answer) className += ' correct';
              else if (selectedAnswers.includes(option)) className += ' wrong';
            }
            if (revealed && exercise.type === 'verbalLogic') {
              if (exerciseData.correctAnswers.includes(option)) className += ' correct';
              else if (selectedAnswers.includes(option) && !exerciseData.correctAnswers.includes(option)) className += ' wrong';
            }
            if (!revealed && selectedAnswers.includes(option)) {
              className += ' selected';
            }
            
            return (
              <button 
                key={i} 
                className={className}
                onClick={() => handleSelect(option)}
                disabled={revealed}
                style={selectedAnswers.includes(option) && !revealed ? { borderColor: 'var(--accent-primary)', background: 'rgba(108,99,255,0.15)' } : {}}
              >
                {option}
              </button>
            );
          })}
        </div>
        
        {/* Feedback */}
        {feedback && (
          <div style={{ 
            marginTop: 16, 
            textAlign: 'center', 
            fontSize: 14,
            color: feedback === 'correct' ? 'var(--accent-secondary)' : 'var(--accent-warning)',
            fontWeight: 600,
          }}>
            {feedback === 'correct' ? '✅ Corretto! +10 XP' : '❌ Non esatto'}
            {feedback === 'wrong' && exerciseData.hint && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 400 }}>
                💡 {exerciseData.hint}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Display components for each exercise type
function ReasoningDisplay({ data }) {
  if (!data.grid) return null;
  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12, textAlign: 'center' }}>
        Quale elemento completa la griglia?
      </p>
      <div className="matrix-grid">
        {data.grid.flat().map((cell, i) => (
          <div key={i} className={`matrix-cell ${cell === '?' ? 'empty' : ''}`}>
            {cell !== '?' && <span style={{ fontSize: cell.length > 3 ? 14 : 20 }}>{cell}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SpatialDisplay({ data }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
        {data.targetLabel}
      </p>
      <div className="spatial-display">
        <div className="spatial-figure" style={{ fontSize: data.target.length > 4 ? 18 : 32 }}>
          {data.target}
        </div>
      </div>
    </div>
  );
}

function VerbalLogicDisplay({ data }) {
  return (
    <div>
      <p style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 8, fontWeight: 600, textAlign: 'center' }}>
        {data.object}
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, textAlign: 'center' }}>
        {data.instruction}
      </p>
    </div>
  );
}

function SequenceDisplay({ data }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
        {data.question}
      </p>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 8, 
        flexWrap: 'wrap',
        marginBottom: 12,
      }}>
        {data.sequence.map((item, i) => (
          <React.Fragment key={i}>
            <span style={{ 
              background: 'var(--bg-card-hover)', 
              borderRadius: 8, 
              padding: '8px 12px',
              fontSize: 18,
              fontWeight: 700,
              border: '1px solid var(--border)',
            }}>
              {item}
            </span>
            {i < data.sequence.length - 1 && (
              <span style={{ color: 'var(--text-muted)' }}>→</span>
            )}
          </React.Fragment>
        ))}
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <span style={{ 
          background: 'transparent', 
          borderRadius: 8, 
          padding: '8px 12px',
          fontSize: 18,
          fontWeight: 700,
          border: '2px dashed var(--accent-primary)',
          color: 'var(--accent-primary)',
        }}>
          ?
        </span>
      </div>
    </div>
  );
}

// Results screen
function ResultsScreen({ results, state, onFinish }) {
  const correct = results.filter(r => r).length;
  const total = results.length;
  const percentage = Math.round((correct / total) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { emoji: '🏆', text: 'Eccezionale!', color: 'var(--accent-gold)' };
    if (percentage >= 70) return { emoji: '⭐', text: 'Ottimo lavoro!', color: 'var(--accent-secondary)' };
    if (percentage >= 50) return { emoji: '👍', text: 'Buon inizio!', color: 'var(--accent-primary)' };
    return { emoji: '💪', text: 'Continua così!', color: 'var(--text-secondary)' };
  };
  
  const grade = getGrade();
  const xpEarned = calculateXP(correct, total, state.streak, state.daysPlayed);
  
  return (
    <div className="card animate-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>{grade.emoji}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: grade.color, marginBottom: 8 }}>
        {grade.text}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        Missione completata: {correct}/{total} risposte corrette
      </p>
      
      {/* Score breakdown */}
      <div style={{ 
        background: 'var(--bg-card-hover)', 
        borderRadius: 'var(--radius-sm)', 
        padding: 16, 
        marginBottom: 20,
        textAlign: 'left',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Risposte corrette</span>
          <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>+{correct * 10} XP</span>
        </div>
        {correct === total && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Bonus perfezione! 🎯</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>+20 XP</span>
          </div>
        )}
        {state.streak > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Bonus streak 🔥</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>+{Math.min(state.streak * 5, 50)} XP</span>
          </div>
        )}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Totale</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>+{xpEarned} XP</span>
        </div>
      </div>
      
      <button className="btn-primary" onClick={() => onFinish(xpEarned)} style={{ width: '100%' }}>
        🏠 Torna alla Base
      </button>
    </div>
  );
}

// Stats screen - detailed per-area statistics
function StatsScreen({ state, onBack }) {
  const areas = [
    { key: 'reasoning', label: '🧩 Ragionamento', color: '#6c63ff' },
    { key: 'spatial', label: '🔄 Spazio', color: '#00d4aa' },
    { key: 'verbalLogic', label: '📝 Logica Verbale', color: '#ffd700' },
    { key: 'sequences', label: '🔢 Sequenze', color: '#ff6b6b' },
  ];
  
  const stats = state.stats || { reasoning:{correct:0,total:0}, spatial:{correct:0,total:0}, verbalLogic:{correct:0,total:0}, sequences:{correct:0,total:0} };
  
  // Find weakest area
  let weakest = null;
  let lowestPct = 101;
  areas.forEach(a => {
    const s = stats[a.key];
    if (s && s.total > 0) {
      const pct = Math.round((s.correct / s.total) * 100);
      if (pct < lowestPct) { lowestPct = pct; weakest = a; }
    }
  });
  
  const totalExercises = areas.reduce((sum, a) => sum + (stats[a.key]?.total || 0), 0);
  
  return (
    <div className="card animate-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent-primary)', marginBottom: 4 }}>
        Statistiche
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
        {totalExercises > 0 ? `Hai completato ${totalExercises} esercizi in totale!` : 'Completa qualche missione per vedere le statistiche!'}
      </p>
      
      {/* Bar chart */}
      <div style={{ marginBottom: 24 }}>
        {areas.map(a => {
          const s = stats[a.key];
          const total = s?.total || 0;
          const correct = s?.correct || 0;
          const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
          return (
            <div key={a.key} style={{ marginBottom: 14, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-primary)' }}>{a.label}</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {total > 0 ? `${pct}% (${correct}/${total})` : '—'}
                </span>
              </div>
              <div style={{ width: '100%', height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ 
                  width: `${pct}%`, height: '100%', borderRadius: 6,
                  background: `linear-gradient(90deg, ${a.color}, ${a.color}cc)`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Weak area encouragement */}
      {weakest && lowestPct < 80 && (
        <div style={{ 
          background: 'rgba(108, 99, 255, 0.08)', 
          border: '1px solid rgba(108, 99, 255, 0.2)',
          borderRadius: 'var(--radius-sm)', 
          padding: 14, 
          marginBottom: 16,
          textAlign: 'left',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            💡 Suggerimento
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            La tua area più debole è <strong style={{color: weakest.color}}>{weakest.label}</strong> ({lowestPct}%).
            {lowestPct < 50 
              ? " Non mollare! Ogni missione ti fa migliorare 🚀" 
              : " Sei sulla buona strada! Continua ad allenarti 💪"}
          </div>
        </div>
      )}
      
      {totalExercises > 0 && lowestPct >= 80 && (
        <div style={{ 
          background: 'rgba(0, 212, 170, 0.1)', 
          border: '1px solid rgba(0, 212, 170, 0.3)',
          borderRadius: 'var(--radius-sm)', 
          padding: 14, 
          marginBottom: 16 
        }}>
          <div style={{ fontSize: 14, color: 'var(--accent-secondary)', fontWeight: 600 }}>
            🌟 Fantastico! Sei forte in tutte le aree!
          </div>
        </div>
      )}
      
      <button className="btn-primary" onClick={onBack} style={{ width: '100%' }}>
        ⬅️ Torna alla Base
      </button>
    </div>
  );
}

// Main App
export default function App() {
  const [state, setState] = useState(loadState);
  const [screen, setScreen] = useState('welcome'); // welcome | playing | results | completed | stats
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [results, setResults] = useState([]);
  
  // Check if today is a new day
  useEffect(() => {
    const today = getDayNumber();
    if (state.currentDayNumber !== today) {
      // New day!
      const newState = {
        ...state,
        currentDayNumber: today,
        completedToday: false,
        // Update streak
        streak: state.lastPlayedDay === today - 1 ? state.streak : 
                (state.lastPlayedDay === today ? state.streak : 0),
      };
      setState(newState);
      saveState(newState);
    } else if (state.completedToday) {
      setScreen('completed');
    }
  }, []);
  
  const startMission = () => {
    const session = generateSession(state);
    setExercises(session);
    setCurrentExercise(0);
    setResults([]);
    setScreen('playing');
  };
  
  const handleAnswer = (isCorrect) => {
    const newResults = [...results, isCorrect];
    setResults(newResults);
    
    if (currentExercise + 1 >= exercises.length) {
      setScreen('results');
    } else {
      setCurrentExercise(currentExercise + 1);
    }
  };
  
  const finishMission = (xpEarned) => {
    const today = getDayNumber();
    const newState = {
      ...state,
      totalXP: state.totalXP + xpEarned,
      daysPlayed: state.daysPlayed + 1,
      completedToday: true,
      lastPlayedDay: today,
      streak: (state.lastPlayedDay === today - 1 || state.lastPlayedDay === today) 
        ? state.streak + 1 : 1,
    };
    
    // Update per-category stats
    exercises.forEach((ex, i) => {
      if (newState.stats[ex.type]) {
        newState.stats[ex.type].total++;
        if (results[i]) newState.stats[ex.type].correct++;
      }
    });
    
    setState(newState);
    saveState(newState);
    setScreen('completed');
  };
  
  const difficulty = getDifficulty(state.daysPlayed);
  
  return (
    <>
      <Stars />
      <GameHeader state={state} />
      
      {screen === 'welcome' && (
        <WelcomeScreen state={state} onStart={startMission} onStats={() => setScreen('stats')} />
      )}
      
      {screen === 'stats' && (
        <StatsScreen state={state} onBack={() => setScreen('welcome')} />
      )}
      
      {screen === 'completed' && (
        <CompletedScreen state={state} />
      )}
      
      {screen === 'playing' && exercises[currentExercise] && (
        <ExerciseView
          key={`${currentExercise}-${exercises[currentExercise].seed}`}
          exercise={exercises[currentExercise]}
          difficulty={difficulty}
          onAnswer={handleAnswer}
          questionNumber={currentExercise + 1}
          totalQuestions={exercises.length}
        />
      )}
      
      {screen === 'results' && (
        <ResultsScreen results={results} state={state} onFinish={finishMission} />
      )}
    </>
  );
}
