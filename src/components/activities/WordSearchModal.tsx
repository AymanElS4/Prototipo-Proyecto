import React, { useRef, useState } from 'react';
import { useQuest } from '../../context/QuestContext';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { WORD_SEARCH_GRID, WORD_SEARCH_TARGETS, WORD_COORDINATES } from '../../data/wordSearchData';
import { Check, RotateCcw, Volume2 } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';
import { speakEnglish } from '../../utils/speechSynth';
import confetti from 'canvas-confetti';
import { AIRPORT_ASSETS } from '../../utils/airportAssets';

type Coordinate = [number, number];

const getCoordinateFromElement = (element: EventTarget | Element | null): Coordinate | null => {
  if (!(element instanceof Element)) return null;

  const cell = element.closest<HTMLElement>('[data-word-cell]');
  if (!cell) return null;

  const row = Number(cell.dataset.row);
  const column = Number(cell.dataset.column);
  return Number.isInteger(row) && Number.isInteger(column) ? [row, column] : null;
};

const createLine = (start: Coordinate, end: Coordinate): Coordinate[] | null => {
  const rowDifference = end[0] - start[0];
  const columnDifference = end[1] - start[1];
  const rowDistance = Math.abs(rowDifference);
  const columnDistance = Math.abs(columnDifference);

  if (rowDifference !== 0 && columnDifference !== 0 && rowDistance !== columnDistance) return null;

  const steps = Math.max(rowDistance, columnDistance);
  const rowStep = Math.sign(rowDifference);
  const columnStep = Math.sign(columnDifference);

  return Array.from({ length: steps + 1 }, (_, index) => [
    start[0] + rowStep * index,
    start[1] + columnStep * index
  ]);
};

export const WordSearchModal: React.FC = () => {
  const { activeActivityModal, setActiveActivityModal, advanceQuestStep, openDialogue } = useQuest();
  const { showFeedback, addHistoryRecord } = useGame();
  const { addXp, addCoins, unlockBadge } = usePlayer();

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<Coordinate[]>([]);
  const [selectionIsIncorrect, setSelectionIsIncorrect] = useState(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const activePointerId = useRef<number | null>(null);
  const selectionStart = useRef<Coordinate | null>(null);

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

  const validateSelection = (coordinates: Coordinate[], invalidDirection = false) => {
    const formed = coordinates.map(([row, column]) => WORD_SEARCH_GRID[row][column]).join('');
    const reversed = formed.split('').reverse().join('');
    const matched = WORD_SEARCH_TARGETS.find(target =>
      !foundWords.includes(target.word) &&
      (target.word === formed || target.word === reversed)
    );

    if (matched && !invalidDirection) {
      handleWordFound(matched.word);
      return;
    }

    setSelectedCoords(coordinates);
    setSelectionIsIncorrect(true);
    setMistakes(previous => previous + 1);
    showFeedback({
      title: '¡Inténtalo de nuevo! / Try Again!',
      message: invalidDirection
        ? 'La selección debe seguir una línea recta para formar una palabra.'
        : `Las letras seleccionadas ("${formed}") no corresponden a ninguna de las palabras pendientes de la lista.`,
      isSuccess: false,
      tip: 'Desliza en línea recta, en horizontal, vertical o diagonal, siguiendo las letras de una palabra.',
      onRetry: () => {
        setSelectedCoords([]);
        setSelectionIsIncorrect(false);
      }
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;

    const coordinate = getCoordinateFromElement(event.target);
    if (!coordinate) return;

    event.preventDefault();
    activePointerId.current = event.pointerId;
    selectionStart.current = coordinate;
    setSelectionIsIncorrect(false);
    setSelectedCoords([coordinate]);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId || !selectionStart.current) return;

    const coordinate = getCoordinateFromElement(
      document.elementFromPoint(event.clientX, event.clientY)
    );
    if (!coordinate) return;

    const line = createLine(selectionStart.current, coordinate);
    if (line) setSelectedCoords(line);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId || !selectionStart.current) return;

    const start = selectionStart.current;
    const coordinate = getCoordinateFromElement(
      document.elementFromPoint(event.clientX, event.clientY)
    );
    activePointerId.current = null;
    selectionStart.current = null;

    if (!coordinate) {
      setSelectedCoords([]);
      setSelectionIsIncorrect(false);
      return;
    }

    const line = createLine(start, coordinate);
    validateSelection(line || selectedCoords, !line);
  };

  const handlePointerCancel = () => {
    activePointerId.current = null;
    selectionStart.current = null;
    setSelectedCoords([]);
    setSelectionIsIncorrect(false);
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    addXp(120);
    addCoins(30);

    unlockBadge({
      id: 'word_sleuth',
      title: 'Detective de Palabras',
      description: 'Encontraste todas las palabras clave del aeropuerto en la sopa de letras.',
      icon: '🔤'
    });

    addHistoryRecord({
      activityType: 'word_search',
      title: 'Sopa de Letras: Vocabulario del Aeropuerto',
      score: 100,
      maxScore: 100,
      mistakesCount: mistakes,
      completed: true,
      notes: `Palabras dominadas: ${WORD_SEARCH_TARGETS.map(t => t.word).join(', ')}`
    });

    advanceQuestStep();

    showFeedback({
      title: '¡BIEN HECHO! / Well done',
      message: '¡Excelente! Has encontrado todas las palabras en la sopa de letras del exterior del aeropuerto.',
      englishPhrase: 'Backpack, Blue, Circle, Cloudy',
      isSuccess: true,
      tip: 'Ahora continúa con la actividad de relacionar columnas para conectar profesiones y lugares de trabajo.',
      onContinue: () => {
        setActiveActivityModal('none');
        openDialogue('john', 'word_search_done');
      }
    });
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 160,
      padding: '14px',
      overflow: 'hidden'
    }}>
      {/* Aeropuerto - Exterior de fondo atenuado */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${AIRPORT_ASSETS.exteriorSvg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.35) blur(2px)',
        zIndex: 1
      }} />

      {/* Tablero central destacado */}
      <div 
        className="rpg-box animate-float"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '430px',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: 'rgba(255, 251, 235, 0.96)',
          backdropFilter: 'blur(8px)',
          border: '4px solid #b45309',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #fde68a',
          paddingBottom: '8px'
        }}>
          <div>
            <span style={{
              fontSize: '10px',
              fontWeight: 900,
              backgroundColor: '#fed7aa',
              color: '#9a3412',
              padding: '2px 8px',
              borderRadius: '8px',
              textTransform: 'uppercase'
            }}>
              Actividad 2 • Aeropuerto Exterior
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#78350f', marginTop: '4px', margin: 0 }}>
              Sopa de Letras (Word Search)
            </h3>
          </div>

          <button
            onClick={() => setActiveActivityModal('none')}
            title="Cerrar"
            style={{
              background: '#fef3c7',
              border: '2px solid #b45309',
              borderRadius: '8px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Word Search Grid (8x8) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '5px',
          backgroundColor: '#fef3c7',
          padding: '10px',
          borderRadius: '12px',
          border: '3px solid #b45309',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          touchAction: 'none',
          userSelect: 'none'
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
                bgColor = selectionIsIncorrect ? '#fecaca' : '#e5e7eb';
                textColor = selectionIsIncorrect ? '#991b1b' : '#374151';
                borderColor = selectionIsIncorrect ? '#dc2626' : '#9ca3af';
              }

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  data-word-cell
                  data-row={rIdx}
                  data-column={cIdx}
                  aria-label={`Fila ${rIdx + 1}, columna ${cIdx + 1}: ${letter}`}
                  type="button"
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

        {/* Action Validation Bar */}
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
            padding: '6px 10px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#1e293b',
            minHeight: '36px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {selectedCoords.length > 0 ? (
              <span>Selección: {selectedCoords.map(([r, c]) => WORD_SEARCH_GRID[r][c]).join('')}</span>
            ) : (
              <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '11px' }}>
                Desliza desde una letra hasta el final de una palabra
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedCoords([]);
              setSelectionIsIncorrect(false);
            }}
            disabled={selectedCoords.length === 0}
            className="rpg-btn rpg-btn-secondary"
            style={{ padding: '6px 8px' }}
            title="Limpiar selección"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Panel Inferior de Progreso (Palabras a encontrar con confirmación) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '6px',
          borderTop: '2px solid #fde68a',
          paddingTop: '8px'
        }}>
          {WORD_SEARCH_TARGETS.map(target => {
            const isFound = foundWords.includes(target.word);

            return (
              <div
                key={target.id}
                style={{
                  padding: '6px 8px',
                  borderRadius: '8px',
                  backgroundColor: isFound ? '#dcfce7' : '#ffffff',
                  border: isFound ? '2px solid #16a34a' : '2px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{
                  fontSize: '22px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {target.icon}
                  {isFound && (
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white'
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: isFound ? '#15803d' : '#1e293b',
                    textDecoration: isFound ? 'line-through' : 'none'
                  }}>
                    {target.word}
                  </div>
                  <div style={{ fontSize: '9px', color: isFound ? '#16a34a' : '#64748b' }}>
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
                  <Volume2 size={14} />
                </button>
              </div>
            );
          })}
        </div>

        <div style={{
          fontSize: '10px',
          color: '#64748b',
          textAlign: 'center'
        }}>
          Progreso: {foundWords.length} de {WORD_SEARCH_TARGETS.length} palabras identificadas
        </div>
      </div>
    </div>
  );
};
