import React, { useEffect, useRef, useState } from 'react';
import { useQuest } from '../../context/QuestContext';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { BookOpen, Check, X, ArrowRight, Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIRPORT_ASSETS } from '../../utils/airportAssets';
import { speakEnglish } from '../../utils/speechSynth';
import { sfx } from '../../utils/audioSynthesis';

interface TripletTarget {
  id: string;
  familyId: string;
  professionId: string;
  placeId: string;
  sentenceEs: string;
  sentenceEn: string;
  color: string;
}

const TARGET_TRIPLETS: TripletTarget[] = [
  {
    id: 'sentence_1',
    familyId: 'uncle',
    professionId: 'police',
    placeId: 'police_station',
    sentenceEs: 'Mi tío es un policía trabajando en la estación de policía',
    sentenceEn: 'My uncle is a police officer working at the police station',
    color: '#2563eb' // Blue line
  },
  {
    id: 'sentence_2',
    familyId: 'aunt',
    professionId: 'receptionist',
    placeId: 'hotel',
    sentenceEs: 'Mi tía es una recepcionista en un hotel',
    sentenceEn: 'My aunt is a receptionist in a hotel',
    color: '#16a34a' // Green line
  },
  {
    id: 'sentence_3',
    familyId: 'cousin',
    professionId: 'chef',
    placeId: 'restaurant',
    sentenceEs: 'Mi primo es un chef en un restaurante',
    sentenceEn: 'My cousin is a chef in a restaurant',
    color: '#d97706' // Orange line
  }
];

// Column 1: Family
const COL_FAMILY = [
  { id: 'uncle', text: 'my uncle', icon: '👨🏽' },
  { id: 'aunt', text: 'my aunt', icon: '👩🏽' },
  { id: 'cousin', text: 'my cousin', icon: '👦🏽' }
];

// Column 2: Distinctive Professions / Uniforms
const COL_PROFESSIONS = [
  { id: 'chef', text: 'chef (gorro)', icon: '👨‍🍳' },
  { id: 'receptionist', text: 'receptionist (uniforme)', icon: '💁‍♀️' },
  { id: 'police', text: 'police officer (placa)', icon: '👮‍♂️' }
];

// Column 3: Workplaces
const COL_PLACES = [
  { id: 'police_station', text: 'police station', icon: '🚓' },
  { id: 'restaurant', text: 'restaurant', icon: '🍽️' },
  { id: 'hotel', text: 'hotel', icon: '🏨' }
];

type MatchColumn = 0 | 1 | 2;
type MatchOption = { id: string; column: MatchColumn };

const getMatchOptionFromElement = (element: EventTarget | Element | null): MatchOption | null => {
  if (!(element instanceof Element)) return null;

  const option = element.closest<HTMLElement>('[data-match-option]');
  if (!option) return null;

  const rawColumn = option.dataset.matchColumn;
  const column: MatchColumn | null = rawColumn === '0'
    ? 0
    : rawColumn === '1'
      ? 1
      : rawColumn === '2'
        ? 2
        : null;
  const id = option.dataset.matchId;
  if (!id || column === null) return null;

  return { id, column };
};

export const SentenceMatchingModal: React.FC = () => {
  const { activeActivityModal, setActiveActivityModal, advanceQuestStep, openDialogue } = useQuest();
  const { showFeedback, addHistoryRecord } = useGame();
  const { addXp, addCoins, unlockBadge } = usePlayer();

  const [showIntroScreen, setShowIntroScreen] = useState(false);
  const [completedTripletIds, setCompletedTripletIds] = useState<string[]>([]);
  const [activePath, setActivePath] = useState<MatchOption[]>([]);
  const [activePathIsInvalid, setActivePathIsInvalid] = useState(false);
  const [, setLayoutVersion] = useState(0);
  const activePointerId = useRef<number | null>(null);
  const dragPath = useRef<MatchOption[]>([]);
  const dragIsInvalid = useRef(false);
  const matchingGridRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const updateLayout = () => setLayoutVersion(version => version + 1);
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  if (activeActivityModal !== 'sentence_matching') return null;

  const isFamilyCompleted = (id: string) => {
    return completedTripletIds.some(tId => {
      const t = TARGET_TRIPLETS.find(item => item.id === tId);
      return t?.familyId === id;
    });
  };

  const isProfessionCompleted = (id: string) => {
    return completedTripletIds.some(tId => {
      const t = TARGET_TRIPLETS.find(item => item.id === tId);
      return t?.professionId === id;
    });
  };

  const isPlaceCompleted = (id: string) => {
    return completedTripletIds.some(tId => {
      const t = TARGET_TRIPLETS.find(item => item.id === tId);
      return t?.placeId === id;
    });
  };

  const clearActivePath = () => {
    activePointerId.current = null;
    dragPath.current = [];
    dragIsInvalid.current = false;
    setActivePath([]);
    setActivePathIsInvalid(false);
  };

  const isOptionCompleted = ({ id, column }: MatchOption) => {
    if (column === 0) return isFamilyCompleted(id);
    if (column === 1) return isProfessionCompleted(id);
    return isPlaceCompleted(id);
  };

  const updateDragPath = (option: MatchOption | null) => {
    if (!option || dragIsInvalid.current) return;
    if (isOptionCompleted(option)) return;

    const previous = dragPath.current[dragPath.current.length - 1];
    if (!previous || previous.id === option.id) return;
    if (option.column === previous.column) return;
    if (option.column !== previous.column + 1) {
      dragIsInvalid.current = true;
      setActivePathIsInvalid(true);
      return;
    }

    const nextPath = [...dragPath.current, option];
    dragPath.current = nextPath;
    setActivePath(nextPath);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;

    const option = getMatchOptionFromElement(event.target);
    if (option?.column !== 0 || isOptionCompleted(option)) return;

    event.preventDefault();
    activePointerId.current = event.pointerId;
    dragPath.current = [option];
    dragIsInvalid.current = false;
    setActivePath([option]);
    setActivePathIsInvalid(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;

    updateDragPath(getMatchOptionFromElement(
      document.elementFromPoint(event.clientX, event.clientY)
    ));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;

    const releaseOption = getMatchOptionFromElement(
      document.elementFromPoint(event.clientX, event.clientY)
    );
    updateDragPath(releaseOption);
    activePointerId.current = null;

    const lastOption = dragPath.current[dragPath.current.length - 1];
    const finishedOnSameColumn = releaseOption && !isOptionCompleted(releaseOption) && lastOption &&
      releaseOption.column === lastOption.column &&
      !(dragPath.current.length === 3 && releaseOption.id === lastOption.id);
    if (finishedOnSameColumn) dragIsInvalid.current = true;

    if (dragIsInvalid.current) {
      setActivePathIsInvalid(true);
      showFeedback({
        title: '¡Inténtalo de nuevo! / Try Again!',
        message: 'Puedes pasar sobre otros elementos de una columna, pero suelta el dedo en la siguiente columna para continuar la conexión.',
        isSuccess: false,
        tip: 'Sigue el orden: personaje → ocupación → lugar.',
        onRetry: clearActivePath
      });
      return;
    }

    const [family, profession, place] = dragPath.current;
    if (!family || !profession || !place) {
      clearActivePath();
      return;
    }

    validateSelection(family.id, profession.id, place.id);
  };

  const handlePointerCancel = () => clearActivePath();

  const getLinePoints = (options: MatchOption[]) => {
    const grid = matchingGridRef.current;
    if (!grid || options.length < 2) return null;

    const gridRect = grid.getBoundingClientRect();
    const points = options.map(option => {
      const element = optionRefs.current[option.id];
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return `${rect.left + rect.width / 2 - gridRect.left},${rect.top + rect.height / 2 - gridRect.top}`;
    });

    return points.every((point): point is string => point !== null) ? points.join(' ') : null;
  };

  const getOptionText = ({ id, column }: MatchOption) => {
    if (column === 0) return COL_FAMILY.find(item => item.id === id)?.text;
    if (column === 1) return COL_PROFESSIONS.find(item => item.id === id)?.text;
    return COL_PLACES.find(item => item.id === id)?.text;
  };

  const validateSelection = (fam: string, prof: string, place: string) => {
    const matched = TARGET_TRIPLETS.find(t => 
      !completedTripletIds.includes(t.id) &&
      t.familyId === fam && 
      t.professionId === prof && 
      t.placeId === place
    );

    if (matched) {
      try { sfx.playSuccess(); } catch {}
      const updated = [...completedTripletIds, matched.id];
      setCompletedTripletIds(updated);
      clearActivePath();

      speakEnglish(matched.sentenceEn);

      if (updated.length === TARGET_TRIPLETS.length) {
        setTimeout(() => {
          handleAllTripletsCompleted();
        }, 500);
      }
    } else {
      try { sfx.playError(); } catch {}
      const correctForFam = TARGET_TRIPLETS.find(t => t.familyId === fam);
      setActivePathIsInvalid(true);

      showFeedback({
        title: '¡Inténtalo de nuevo! / Try Again!',
        message: `Los elementos conectados no corresponden a la ocupación correcta. Recuerda: "${correctForFam?.sentenceEs}" ("${correctForFam?.sentenceEn}").`,
        isSuccess: false,
        tip: 'Relaciona a cada familiar con su uniforme correspondiente y su lugar de trabajo.',
        onRetry: clearActivePath
      });
    }
  };

  const handleAllTripletsCompleted = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    addXp(140);
    addCoins(50);

    unlockBadge({
      id: 'sentence_connector',
      title: 'Conector de Profesiones',
      description: 'Conectaste exitosamente personaje -> ocupación -> lugar de trabajo.',
      icon: '🔗'
    });

    addHistoryRecord({
      activityType: 'multiple_choice',
      title: 'Unir con Líneas: Ocupaciones y Lugares',
      score: 100,
      maxScore: 100,
      mistakesCount: 0,
      completed: true,
      notes: 'Dominio de oraciones: uncle/police/police station, aunt/receptionist/hotel, cousin/chef/restaurant.'
    });

    advanceQuestStep();

    showFeedback({
      title: '¡BIEN HECHO! / Well done',
      message: '¡Excelente trabajo! Has asociado correctamente los personajes, sus ocupaciones y sus lugares de trabajo mediante las conexiones.',
      englishPhrase: 'My uncle is a police officer at the police station.',
      isSuccess: true,
      tip: 'Ahora pasa a la Actividad 4: Sección de Speaking para practicar tu pronunciación con el micrófono.',
      onContinue: () => {
        setActiveActivityModal('none');
        openDialogue('john', 'matching_done');
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
      {/* Escenario del aeropuerto de fondo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${AIRPORT_ASSETS.interiorSvg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.35) blur(2px)',
        zIndex: 1
      }} />

      {/* Tablero central de 3 columnas */}
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
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(8px)',
          border: '4px solid #0284c7',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
          maxHeight: '94vh',
          overflowY: 'auto'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#0369a1', textTransform: 'uppercase', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
              Actividad 3 • Unir con Líneas
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: '3px 0 0' }}>
              Personajes, Ocupaciones y Lugares
            </h2>
          </div>
          <button
            onClick={() => setActiveActivityModal('none')}
            style={{
              background: '#f1f5f9',
              border: '2px solid #cbd5e1',
              borderRadius: '8px',
              padding: '4px 8px',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Oraciones de referencia */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {TARGET_TRIPLETS.map((item, idx) => {
            const isCompleted = completedTripletIds.includes(item.id);

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: isCompleted ? '#dcfce7' : '#ffffff',
                  border: isCompleted ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: isCompleted ? '#15803d' : '#1e293b',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {idx + 1}. "{item.sentenceEn}"
                  </div>
                </div>

                <button
                  onClick={() => speakEnglish(item.sentenceEn)}
                  title="Escuchar audio"
                  style={{
                    background: '#0284c7',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 6px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '10px',
                    fontWeight: 700
                  }}
                >
                  <Volume2 size={12} />
                  <span>Audio</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* 3 Columns Organized Layout */}
        <div
          ref={matchingGridRef}
          role="group"
          aria-label="Arrastra desde un personaje, pasando por una ocupación, hasta un lugar de trabajo"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          columnGap: '16px',
          position: 'relative',
          touchAction: 'none',
          userSelect: 'none'
        }}>
          {/* COL 1: Personajes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 900, color: '#0369a1', textAlign: 'center', backgroundColor: '#e0f2fe', padding: '3px', borderRadius: '4px' }}>
              COL. 1: PERSONAJE
            </div>
            {COL_FAMILY.map(fam => {
              const isSelected = activePath.some(option => option.id === fam.id);
              const isDone = isFamilyCompleted(fam.id);

              return (
                <button
                  key={fam.id}
                  ref={element => { optionRefs.current[fam.id] = element; }}
                  data-match-option
                  data-match-column={0}
                  data-match-id={fam.id}
                  disabled={isDone}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: isSelected
                      ? `3px solid ${activePathIsInvalid ? '#dc2626' : '#0284c7'}`
                      : isDone ? '2px solid #16a34a' : '2px solid #cbd5e1',
                    backgroundColor: isSelected ? '#e0f2fe' : isDone ? '#dcfce7' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isDone ? 'default' : 'pointer',
                    opacity: isDone ? 0.6 : 1,
                    position: 'relative',
                    zIndex: 4,
                    touchAction: 'none'
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{fam.icon}</span>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#1e293b' }}>
                    {fam.text}
                  </span>
                  {isDone && (
                    <div style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#16a34a', borderRadius: '50%', padding: '1px', color: 'white' }}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* COL 2: Ocupaciones / Uniformes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 900, color: '#0369a1', textAlign: 'center', backgroundColor: '#e0f2fe', padding: '3px', borderRadius: '4px' }}>
              COL. 2: OCUPACIÓN
            </div>
            {COL_PROFESSIONS.map(prof => {
              const isSelected = activePath.some(option => option.id === prof.id);
              const isDone = isProfessionCompleted(prof.id);

              return (
                <button
                  key={prof.id}
                  ref={element => { optionRefs.current[prof.id] = element; }}
                  data-match-option
                  data-match-column={1}
                  data-match-id={prof.id}
                  disabled={isDone}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: isSelected
                      ? `3px solid ${activePathIsInvalid ? '#dc2626' : '#0284c7'}`
                      : isDone ? '2px solid #16a34a' : '2px solid #cbd5e1',
                    backgroundColor: isSelected ? '#e0f2fe' : isDone ? '#dcfce7' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isDone ? 'default' : 'pointer',
                    opacity: isDone ? 0.6 : 1,
                    position: 'relative',
                    zIndex: 4,
                    touchAction: 'none'
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{prof.icon}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#1e293b', textAlign: 'center', lineHeight: 1.1 }}>
                    {prof.text}
                  </span>
                  {isDone && (
                    <div style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#16a34a', borderRadius: '50%', padding: '1px', color: 'white' }}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* COL 3: Lugares de Trabajo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 900, color: '#0369a1', textAlign: 'center', backgroundColor: '#e0f2fe', padding: '3px', borderRadius: '4px' }}>
              COL. 3: LUGAR
            </div>
            {COL_PLACES.map(place => {
              const isSelected = activePath.some(option => option.id === place.id);
              const isDone = isPlaceCompleted(place.id);

              return (
                <button
                  key={place.id}
                  ref={element => { optionRefs.current[place.id] = element; }}
                  data-match-option
                  data-match-column={2}
                  data-match-id={place.id}
                  disabled={isDone}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: isSelected
                      ? `3px solid ${activePathIsInvalid ? '#dc2626' : '#0284c7'}`
                      : isDone ? '2px solid #16a34a' : '2px solid #cbd5e1',
                    backgroundColor: isSelected ? '#e0f2fe' : isDone ? '#dcfce7' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isDone ? 'default' : 'pointer',
                    opacity: isDone ? 0.6 : 1,
                    position: 'relative',
                    zIndex: 4,
                    touchAction: 'none'
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{place.icon}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#1e293b', textAlign: 'center', lineHeight: 1.1 }}>
                    {place.text}
                  </span>
                  {isDone && (
                    <div style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#16a34a', borderRadius: '50%', padding: '1px', color: 'white' }}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <svg
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            {TARGET_TRIPLETS.filter(target => completedTripletIds.includes(target.id)).map(target => {
              const points = getLinePoints([
                { id: target.familyId, column: 0 },
                { id: target.professionId, column: 1 },
                { id: target.placeId, column: 2 }
              ]);
              return points ? (
                <polyline
                  key={target.id}
                  points={points}
                  fill="none"
                  stroke={target.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.72"
                />
              ) : null;
            })}
            {activePath.length > 1 && (() => {
              const points = getLinePoints(activePath);
              return points ? (
                <polyline
                  points={points}
                  fill="none"
                  stroke={activePathIsInvalid ? '#dc2626' : '#475569'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.72"
                />
              ) : null;
            })()}
          </svg>
        </div>

        {/* Resumen de Conexión actual */}
        <div style={{
          backgroundColor: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px'
        }}>
          <div>
            <strong>Arrastra:</strong>{' '}
            <span style={{ color: '#0284c7', fontWeight: 800 }}>
              {activePath.map(option => getOptionText(option)).filter(Boolean).join(' → ') ||
                'personaje → ocupación → lugar (un elemento por columna)'}
            </span>
          </div>

          {activePath.length > 0 && (
            <button
              onClick={clearActivePath}
              style={{
                background: '#e2e8f0',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 6px',
                fontSize: '10px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Reiniciar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
