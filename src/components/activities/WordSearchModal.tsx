import React, { useState } from 'react';
import { useQuest } from '../../context/QuestContext';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { WORD_SEARCH_GRID, WORD_SEARCH_TARGETS, WORD_COORDINATES } from '../../data/wordSearchData';
import { Check, X, RotateCcw, Volume2 } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';
import { speakEnglish } from '../../utils/speechSynth';
import confetti from 'canvas-confetti';

export const WordSearchModal: React.FC = () => {
  const { activeActivityModal, setActiveActivityModal, advanceQuestStep, openDialogue } = useQuest();
  const { showFeedback, addHistoryRecord } = useGame();
  const { addXp, addCoins, unlockBadge } = usePlayer();

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<[number, number][]>([]);
  const [mistakes, setMistakes] = useState<number>(0);

  if (activeActivityModal !== 'word_search') return null;

  const isCoordSelected = (r: number, c: number) => {
    return selectedCoords.some(([row, col]) => row === r && col === c);
  };

  const isCoordFound = (r: number, c: number) => {
    return foundWords.some(word => {
      const coords = WORD_COORDINATES[word];
      return coords && coords.some(([row, col]) => row === r && col === c);
    });
  };

  const handleCellClick = (r: number, c: number) => {
    try { sfx.playClick(); } catch {}
    const isAlready = isCoordSelected(r, c);
    let nextCoords: [number, number][];

    if (isAlready) {
      nextCoords = selectedCoords.filter(([row, col]) => !(row === r && col === c));
    } else {
      nextCoords = [...selectedCoords, [r, c]];
    }
    setSelectedCoords(nextCoords);

    const formedWord = nextCoords.map(([row, col]) => WORD_SEARCH_GRID[row][col]).join('');

    const matchedTarget = WORD_SEARCH_TARGETS.find(t => 
      !foundWords.includes(t.word) && (t.word === formedWord || t.word === formedWord.split('').reverse().join(''))
    );

    if (matchedTarget) {
      handleWordFound(matchedTarget.word);
    }
  };

  const handleDirectSelect = (word: string) => {
    if (foundWords.includes(word)) return;
    try { sfx.playDialogueBlip(); } catch {}
    const coords = WORD_COORDINATES[word];
    if (coords) {
      setSelectedCoords(coords);
      handleWordFound(word);
    }
  };

  const handleWordFound = (word: string) => {
    try { sfx.playSuccess(); } catch {}
    const updated = [...foundWords, word];
    setFoundWords(updated);
    setSelectedCoords([]);

    speakEnglish(word.toLowerCase());

    if (updated.length === WORD_SEARCH_TARGETS.length) {
      setTimeout(() => {
        handleAllWordsFound();
      }, 600);
    }
  };

  const handleAllWordsFound = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {}

    addXp(120);
    addCoins(50);
    unlockBadge({
      id: 'word_search_master',
      title: 'Maestro de las Letras',
      description: 'Encontraste todas las palabras clave en la libreta de viaje de John.',
      icon: '🔤'
    });

    addHistoryRecord({
      activityType: 'word_search',
      title: 'Sopa de Letras: Vocabulario de Viaje',
      score: 100,
      maxScore: 100,
      mistakesCount: mistakes,
      completed: true,
      notes: 'Dominio de: Backpack, Blue, Circle, Cloudy.'
    });

    setActiveActivityModal('none');
    advanceQuestStep();

    showFeedback({
      title: '¡Sopa de Letras Completada!',
      message: '¡Excelente trabajo! Has identificado las cuatro palabras en inglés con sus respectivos significados visuales.',
      englishPhrase: 'Backpack, Blue, Circle, Cloudy',
      isSuccess: true,
      tip: 'Mr. John está impresionado con tu vocabulario. ¡Habla con Don Mateo para reclamar tu recompensa!',
      onContinue: () => {
        openDialogue('john', 'all_done_john');
      }
    });
  };

  const handleVerifySelection = () => {
    if (selectedCoords.length === 0) return;
    const formed = selectedCoords.map(([r, c]) => WORD_SEARCH_GRID[r][c]).join('');
    const matched = WORD_SEARCH_TARGETS.find(t => 
      !foundWords.includes(t.word) && (t.word === formed || t.word === formed.split('').reverse().join(''))
    );

    if (matched) {
      handleWordFound(matched.word);
    } else {
      try { sfx.playError(); } catch {}
      setMistakes(prev => prev + 1);
      showFeedback({
        title: 'Palabra no identificada',
        message: `Las letras seleccionadas ("${formed}") no corresponden a ninguna de las palabras pendientes de la lista.`,
        isSuccess: false,
        tip: 'Observa bien las tarjetas inferiores. Puedes buscar en horizontal o vertical.'
      });
      setSelectedCoords([]);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 160,
      padding: '14px'
    }}>
      <div 
        className="rpg-box"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: '#fffbeb',
          maxHeight: '94vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
              Libreta de Viajero • Actividad 2
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#78350f' }}>
              Sopa de Letras Turística
            </h2>
          </div>
          <button
            onClick={() => {
              try { sfx.playClick(); } catch {}
              setActiveActivityModal('none');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#78350f',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Target Words with Graphic Objects & Green Checkmarks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {WORD_SEARCH_TARGETS.map(target => {
            const isFound = foundWords.includes(target.word);

            return (
              <div
                key={target.id}
                onClick={() => handleDirectSelect(target.word)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  backgroundColor: isFound ? '#dcfce7' : '#ffffff',
                  border: isFound ? '2px solid #16a34a' : '2px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                }}
              >
                {/* Graphic Icon */}
                <div style={{
                  fontSize: '26px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {target.icon}
                  {/* Green checkmark overlay */}
                  {isFound && (
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white'
                    }}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: isFound ? '#15803d' : '#1e293b',
                    textDecoration: isFound ? 'line-through' : 'none'
                  }}>
                    {target.word}
                  </div>
                  <div style={{ fontSize: '10px', color: isFound ? '#16a34a' : '#64748b' }}>
                    {target.translation}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakEnglish(target.word.toLowerCase());
                  }}
                  title="Escuchar audio"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  <Volume2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Word Search Grid (8x8) - Spacious letter buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '5px',
          backgroundColor: '#fef3c7',
          padding: '10px',
          borderRadius: '12px',
          border: '3px solid #b45309',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {WORD_SEARCH_GRID.map((row, rIdx) => 
            row.map((letter, cIdx) => {
              const selected = isCoordSelected(rIdx, cIdx);
              const found = isCoordFound(rIdx, cIdx);

              let bgColor = '#ffffff';
              let textColor = '#1e293b';
              let borderColor = '#cbd5e1';

              if (found) {
                bgColor = '#bbf7d0';
                textColor = '#14532d';
                borderColor = '#16a34a';
              } else if (selected) {
                bgColor = '#fde047';
                textColor = '#78350f';
                borderColor = '#ca8a04';
              }

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    backgroundColor: bgColor,
                    color: textColor,
                    border: `2px solid ${borderColor}`,
                    fontWeight: 800,
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: selected ? 'scale(1.08)' : 'none',
                    transition: 'all 0.1s ease',
                    boxShadow: '0 2px 3px rgba(0,0,0,0.08)'
                  }}
                >
                  {letter}
                </button>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{
            flex: 1,
            backgroundColor: '#ffffff',
            border: '2px dashed #94a3b8',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#1e293b',
            minHeight: '38px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {selectedCoords.length > 0 ? (
              <span>Selección: {selectedCoords.map(([r, c]) => WORD_SEARCH_GRID[r][c]).join('')}</span>
            ) : (
              <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '12px' }}>
                Toca letras o toca una palabra arriba
              </span>
            )}
          </div>

          <button
            onClick={handleVerifySelection}
            disabled={selectedCoords.length === 0}
            className="rpg-btn rpg-btn-green"
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              opacity: selectedCoords.length === 0 ? 0.5 : 1
            }}
          >
            <Check size={16} />
            <span>Validar</span>
          </button>

          <button
            onClick={() => setSelectedCoords([])}
            disabled={selectedCoords.length === 0}
            className="rpg-btn rpg-btn-secondary"
            style={{ padding: '8px 10px' }}
            title="Limpiar selección"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div style={{
          fontSize: '11px',
          color: '#64748b',
          textAlign: 'center'
        }}>
          Progreso: {foundWords.length} de {WORD_SEARCH_TARGETS.length} palabras encontradas
        </div>
      </div>
    </div>
  );
};
