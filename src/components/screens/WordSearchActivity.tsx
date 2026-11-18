import React, { useRef, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { WORD_COORDINATES, WORD_SEARCH_GRID, WORD_SEARCH_TARGETS } from '../../data/wordSearchData';

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

export const WordSearchActivity: React.FC = () => {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<Coordinate[]>([]);
  const [message, setMessage] = useState('Desliza sobre las letras para encontrar las palabras.');
  const activePointerId = useRef<number | null>(null);
  const selectionStart = useRef<Coordinate | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const isCoordFound = (row: number, column: number) =>
    foundWords.some(word =>
      WORD_COORDINATES[word]?.some(([foundRow, foundColumn]) => foundRow === row && foundColumn === column)
    );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;

    const coordinate = getCoordinateFromElement(event.target);
    if (!coordinate) return;

    event.preventDefault();
    activePointerId.current = event.pointerId;
    selectionStart.current = coordinate;
    setSelectedCoords([coordinate]);
    setMessage('Sigue en línea recta: horizontal, vertical o diagonal.');
    gridRef.current?.setPointerCapture(event.pointerId);
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

    const coordinate = getCoordinateFromElement(
      document.elementFromPoint(event.clientX, event.clientY)
    );
    const line = coordinate ? createLine(selectionStart.current, coordinate) : null;
    activePointerId.current = null;
    selectionStart.current = null;

    if (!line) return;

    setSelectedCoords(line);
    const selectedWord = line.map(([row, column]) => WORD_SEARCH_GRID[row][column]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    const matchedTarget = WORD_SEARCH_TARGETS.find(
      target => !foundWords.includes(target.word) &&
        (target.word === selectedWord || target.word === reversedWord)
    );

    if (matchedTarget) {
      setFoundWords(words => words.includes(matchedTarget.word) ? words : [...words, matchedTarget.word]);
      setSelectedCoords([]);
      setMessage(`¡Encontraste ${matchedTarget.word}! ${matchedTarget.translation}.`);
    } else {
      setMessage('Esa selección no coincide. Prueba otra línea.');
    }
  };

  const handlePointerCancel = () => {
    activePointerId.current = null;
    selectionStart.current = null;
    setSelectedCoords([]);
  };

  const clearSelection = () => {
    setSelectedCoords([]);
    setMessage('Desliza sobre las letras para encontrar las palabras.');
  };

  const isComplete = foundWords.length === WORD_SEARCH_TARGETS.length;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: 0,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 14px',
      color: '#ffffff',
      backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.48), rgba(15, 23, 42, 0.72)), url(/assets/menu_theme/main_bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <main style={{
        width: '100%',
        maxWidth: '420px',
        minHeight: 0,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto'
      }}>
        <header style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '999px',
            background: '#fef3c7',
            color: '#92400e',
            fontSize: '10px',
            fontWeight: 900,
            letterSpacing: '1px'
          }}>
            ACTIVIDAD DE VOCABULARIO
          </div>
          <h1 style={{ marginTop: '5px', fontSize: '22px', color: '#fef3c7' }}>
            Sopa de letras
          </h1>
          <p style={{ marginTop: '3px', fontSize: '12px', color: '#e2e8f0' }}>
            Encuentra las palabras en inglés deslizando sobre el tablero.
          </p>
        </header>

        <section
          aria-label="Diálogo con las palabras que debes encontrar"
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            padding: '12px',
            border: '2px solid #b45309',
            borderRadius: '14px',
            background: 'rgba(255, 251, 235, 0.97)',
            color: '#422006',
            boxShadow: '0 5px 12px rgba(0,0,0,0.28)'
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '27px', lineHeight: 1 }}>🧑🏽</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 800, lineHeight: 1.4 }}>
              ¡Ayúdame a encontrar estas palabras!
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px', marginTop: '8px' }}>
              {WORD_SEARCH_TARGETS.map(target => (
                <div key={target.id} style={{
                  padding: '6px 8px',
                  borderRadius: '8px',
                  background: '#fff7ed',
                  border: '1px solid #fed7aa'
                }}>
                  <div style={{ color: '#9a3412', fontSize: '11px', fontWeight: 900 }}>
                    {target.icon} {target.word}
                  </div>
                  <div style={{ marginTop: '2px', color: '#57534e', fontSize: '9px', lineHeight: 1.3 }}>
                    {target.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div
          ref={gridRef}
          role="group"
          aria-label="Tablero de letras. Arrastra para seleccionar una palabra."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${WORD_SEARCH_GRID[0].length}, minmax(0, 1fr))`,
            gap: '4px',
            width: '100%',
            aspectRatio: '1',
            padding: '8px',
            border: '4px solid #92400e',
            borderRadius: '15px',
            background: '#fef3c7',
            boxShadow: '0 8px 18px rgba(0,0,0,0.35), inset 0 2px 4px rgba(120,53,15,0.2)',
            touchAction: 'none'
          }}
        >
          {WORD_SEARCH_GRID.map((row, rowIndex) =>
            row.map((letter, columnIndex) => {
              const isSelected = selectedCoords.some(
                ([selectedRow, selectedColumn]) => selectedRow === rowIndex && selectedColumn === columnIndex
              );
              const isFound = isCoordFound(rowIndex, columnIndex);

              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  data-word-cell
                  data-row={rowIndex}
                  data-column={columnIndex}
                  aria-label={`Fila ${rowIndex + 1}, columna ${columnIndex + 1}: ${letter}`}
                  style={{
                    minWidth: 0,
                    minHeight: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '7px',
                    border: `2px solid ${isFound ? '#16a34a' : isSelected ? '#ca8a04' : '#d6d3d1'}`,
                    background: isFound ? '#86efac' : isSelected ? '#fde047' : '#ffffff',
                    color: isFound ? '#14532d' : isSelected ? '#713f12' : '#1e293b',
                    fontSize: 'clamp(14px, 5vw, 23px)',
                    fontWeight: 900,
                    lineHeight: 1,
                    userSelect: 'none',
                    boxShadow: '0 2px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>

        <section
          aria-label="Progreso de palabras encontradas"
          style={{
            padding: '10px',
            border: '2px solid #5a5245',
            borderRadius: '12px',
            background: 'rgba(255, 251, 235, 0.96)',
            color: '#292524'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ color: '#78350f', fontSize: '13px' }}>Palabras encontradas</h2>
            <span style={{ color: '#78350f', fontSize: '11px', fontWeight: 900 }}>
              {foundWords.length}/{WORD_SEARCH_TARGETS.length}
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '6px',
            marginTop: '8px'
          }}>
            {WORD_SEARCH_TARGETS.map(target => {
              const isFound = foundWords.includes(target.word);
              return (
                <div key={target.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  border: `1px solid ${isFound ? '#16a34a' : '#d6d3d1'}`,
                  background: isFound ? '#dcfce7' : '#ffffff',
                  color: isFound ? '#166534' : '#64748b',
                  fontSize: '10px',
                  fontWeight: 800
                }}>
                  {isFound ? <Check size={14} aria-hidden="true" /> : <span aria-hidden="true">○</span>}
                  <span>{isFound ? `${target.word} · ${target.translation}` : 'Por encontrar'}</span>
                </div>
              );
            })}
          </div>
          <div aria-live="polite" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            minHeight: '30px',
            marginTop: '7px'
          }}>
            <p style={{ color: isComplete ? '#15803d' : '#57534e', fontSize: '10px', fontWeight: 700 }}>
              {isComplete ? '¡Excelente! Encontraste todas las palabras.' : message}
            </p>
            {selectedCoords.length > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                aria-label="Limpiar selección"
                title="Limpiar selección"
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  border: '1px solid #a8a29e',
                  borderRadius: '7px',
                  background: '#ffffff',
                  color: '#57534e',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
