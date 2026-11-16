import React, { useState } from 'react';
import { useQuest } from '../../context/QuestContext';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { BookOpen, Check, X, ArrowRight, Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

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

// Column 2: Professions (shuffled as requested)
const COL_PROFESSIONS = [
  { id: 'chef', text: 'chef', icon: '👨‍🍳' },
  { id: 'receptionist', text: 'receptionist', icon: '💁‍♀️' },
  { id: 'police', text: 'police officer', icon: '👮‍♂️' }
];

// Column 3: Places (shuffled as requested)
const COL_PLACES = [
  { id: 'police_station', text: 'police station', icon: '🚓' },
  { id: 'restaurant', text: 'restaurant', icon: '🍽️' },
  { id: 'hotel', text: 'hotel', icon: '🏨' }
];

export const SentenceMatchingModal: React.FC = () => {
  const { activeActivityModal, setActiveActivityModal, advanceQuestStep, openDialogue } = useQuest();
  const { showFeedback, addHistoryRecord } = useGame();
  const { addXp, addCoins, unlockBadge } = usePlayer();

  // Screen 1: Intro ("Vocabulario y Grammar") | Screen 2: Activity
  const [showIntroScreen, setShowIntroScreen] = useState(true);

  // Completed matched triplet IDs
  const [completedTripletIds, setCompletedTripletIds] = useState<string[]>([]);

  // Current selections
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  // Simulated audio playing
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);

  if (activeActivityModal !== 'sentence_matching') return null;

  // Simulate audio playback without freezing browser
  const handleSimulateAudio = (index: number) => {
    setActiveAudioIndex(index);
    setTimeout(() => {
      setActiveAudioIndex(null);
    }, 1200);
  };

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

  // Click on Column 1 item
  const handleSelectFamily = (id: string) => {
    if (isFamilyCompleted(id)) return;
    setSelectedFamily(id);
  };

  // Click on Column 2 item
  const handleSelectProfession = (id: string) => {
    if (isProfessionCompleted(id)) return;
    if (!selectedFamily) {
      showFeedback({
        title: 'Selecciona en orden',
        message: 'Primero selecciona un miembro de la familia en la Columna 1 (my uncle, my aunt o my cousin).',
        isSuccess: false,
        tip: 'Sigue el orden de la oración: Sujeto ➡️ Profesión ➡️ Lugar.'
      });
      return;
    }
    setSelectedProfession(id);
  };

  // Click on Column 3 item -> triggers validation!
  const handleSelectPlace = (id: string) => {
    if (isPlaceCompleted(id)) return;
    if (!selectedFamily || !selectedProfession) {
      showFeedback({
        title: 'Selecciona en orden',
        message: 'Debes seleccionar primero el familiar (Col. 1) y luego su profesión (Col. 2) antes de elegir el lugar.',
        isSuccess: false,
        tip: 'Ejemplo: my uncle ➡️ police officer ➡️ police station.'
      });
      return;
    }

    setSelectedPlace(id);

    // Validate triplet
    validateSelection(selectedFamily, selectedProfession, id);
  };

  const validateSelection = (fam: string, prof: string, place: string) => {
    // Check if matches any target triplet
    const matched = TARGET_TRIPLETS.find(t => 
      !completedTripletIds.includes(t.id) &&
      t.familyId === fam && 
      t.professionId === prof && 
      t.placeId === place
    );

    if (matched) {
      // CORRECT!
      const updated = [...completedTripletIds, matched.id];
      setCompletedTripletIds(updated);
      setSelectedFamily(null);
      setSelectedProfession(null);
      setSelectedPlace(null);

      if (updated.length === TARGET_TRIPLETS.length) {
        // All 3 sentences matched!
        setTimeout(() => {
          handleAllTripletsCompleted();
        }, 500);
      }
    } else {
      // INCORRECT!
      const correctForFam = TARGET_TRIPLETS.find(t => t.familyId === fam);
      setSelectedFamily(null);
      setSelectedProfession(null);
      setSelectedPlace(null);

      showFeedback({
        title: 'Asociación Incorrecta',
        message: `Los elementos seleccionados no coinciden con las oraciones. Recuerda: "${correctForFam?.sentenceEs}" ("${correctForFam?.sentenceEn}").`,
        isSuccess: false,
        tip: 'Lee atentamente las 3 oraciones en la parte superior para saber qué profesión y lugar corresponden a cada familiar.'
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
      title: 'Conector del Pueblo',
      description: 'Uniste con éxito todas las oraciones de familia, profesiones y lugares.',
      icon: '🔗'
    });

    addHistoryRecord({
      activityType: 'multiple_choice',
      title: 'Unir con Líneas: Familia y Ocupaciones',
      score: 100,
      maxScore: 100,
      mistakesCount: 0,
      completed: true,
      notes: 'Dominio de oraciones: uncle/police, aunt/receptionist, cousin/chef.'
    });

    setActiveActivityModal('none');
    advanceQuestStep();

    showFeedback({
      title: '¡Actividad 3 Completada!',
      message: '¡Excelente trabajo uniendo las oraciones! Has demostrado dominio de vocabulario y estructura gramatical de profesiones y lugares.',
      englishPhrase: 'My uncle is a police officer at the police station.',
      isSuccess: true,
      tip: 'Ahora habla con Mr. John para realizar la Actividad 4: Práctica oral con el micrófono.',
      onContinue: () => {
        openDialogue('john', 'after_matching_john');
      }
    });
  };

  // SCREEN 1: INTRO SCREEN ("Vocabulario y Grammar")
  if (showIntroScreen) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 160,
        padding: '16px'
      }}>
        <div 
          className="rpg-box animate-float"
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '22px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: '#ffffff',
            textAlign: 'center'
          }}
        >
          {/* Header Icon */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              border: '3px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b45309'
            }}>
              <BookOpen size={30} />
            </div>
          </div>

          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#b45309',
              backgroundColor: '#fde68a',
              padding: '3px 12px',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              Actividad 3: Asociación de Oraciones
            </span>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#1e293b', marginTop: '6px' }}>
              Vocabulario y Grammar
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '3px', lineHeight: '1.4' }}>
              Aprenderás a estructurar oraciones asociando familiares, profesiones y lugares de trabajo en inglés.
            </p>
          </div>

          {/* Key Grammar Rule */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '2px solid #bfdbfe',
            borderRadius: '10px',
            padding: '12px',
            textAlign: 'left',
            fontSize: '12px',
            color: '#1e40af',
            lineHeight: '1.5'
          }}>
            📘 <strong>Regla Gramatical:</strong>
            <div style={{ marginTop: '4px', color: '#1e3a8a' }}>
              <strong>Sujeto</strong> + <strong>Verbo To Be (is)</strong> + <strong>Profesión (a/an)</strong> + <strong>Lugar (in/at)</strong>
            </div>
            <div style={{ marginTop: '2px', fontSize: '11px', fontStyle: 'italic', color: '#3b82f6' }}>
              "My uncle is a police officer working at the police station."
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#334155',
            lineHeight: '1.45',
            textAlign: 'left'
          }}>
            💡 <strong>Cómo realizar la actividad:</strong>
            <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
              <li>Leerás o escucharás tres oraciones clave.</li>
              <li>Abajo verás 9 botones en 3 columnas.</li>
              <li><strong>Unirás con líneas</strong> seleccionando en orden: un familiar (Col. 1), su profesión (Col. 2) y su lugar de trabajo (Col. 3).</li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowIntroScreen(false)}
            className="rpg-btn rpg-btn-green"
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
          >
            <Sparkles size={18} />
            <span>¡Comenzar Actividad 3!</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 2: THE 3-COLUMN CONNECTING LINES ACTIVITY
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.94)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 160,
      padding: '12px'
    }}>
      <div 
        className="rpg-box"
        style={{
          width: '100%',
          maxWidth: '420px',
          maxHeight: '96vh',
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
              Actividad 3 • Unir con Líneas
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
              Familia, Profesiones y Lugares
            </h2>
          </div>
          <button
            onClick={() => setActiveActivityModal('none')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#78350f',
              cursor: 'pointer'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* 3 Reference Sentences Area */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '10px',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>
            📖 Escucha o lee las 3 oraciones modelo:
          </div>

          {TARGET_TRIPLETS.map((item, idx) => {
            const isCompleted = completedTripletIds.includes(item.id);

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: isCompleted ? '#dcfce7' : '#ffffff',
                  border: isCompleted ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isCompleted ? '#15803d' : '#1e293b',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {idx + 1}. "{item.sentenceEs}"
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic' }}>
                    "{item.sentenceEn}"
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isCompleted && <CheckCircle2 size={16} color="#16a34a" />}
                  <button
                    onClick={() => handleSimulateAudio(idx)}
                    title="Escuchar oración"
                    style={{
                      background: activeAudioIndex === idx ? '#10b981' : '#3b82f6',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 6px',
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
                    <span>{activeAudioIndex === idx ? '...' : 'Audio'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instruction pill */}
        <div style={{
          backgroundColor: '#eff6ff',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#1e40af',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          👇 Toca en orden: <strong>1 Familiar</strong> ➡️ <strong>1 Profesión</strong> ➡️ <strong>1 Lugar</strong>
        </div>

        {/* 9 Buttons Distributed in 3 Columns with Visual Connecting Simulation */}
        <div style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '4px 0'
        }}>
          {/* COLUMN 1: Family */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textAlign: 'center' }}>
              COLUMNA 1: FAMILIA
            </div>
            {COL_FAMILY.map(fam => {
              const isSelected = selectedFamily === fam.id;
              const isDone = isFamilyCompleted(fam.id);

              return (
                <button
                  key={fam.id}
                  disabled={isDone}
                  onClick={() => handleSelectFamily(fam.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: isSelected ? '3px solid #2563eb' : isDone ? '2px solid #16a34a' : '2px solid #b45309',
                    backgroundColor: isSelected ? '#dbeafe' : isDone ? '#dcfce7' : '#fffbeb',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isDone ? 'default' : 'pointer',
                    opacity: isDone ? 0.6 : 1,
                    position: 'relative'
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{fam.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#1e293b' }}>
                    {fam.text}
                  </span>
                  {isDone && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: '#16a34a',
                      borderRadius: '50%',
                      padding: '1px',
                      color: 'white'
                    }}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* COLUMN 2: Professions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textAlign: 'center' }}>
              COLUMNA 2: PROFESIÓN
            </div>
            {COL_PROFESSIONS.map(prof => {
              const isSelected = selectedProfession === prof.id;
              const isDone = isProfessionCompleted(prof.id);

              return (
                <button
                  key={prof.id}
                  disabled={isDone}
                  onClick={() => handleSelectProfession(prof.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: isSelected ? '3px solid #2563eb' : isDone ? '2px solid #16a34a' : '2px solid #b45309',
                    backgroundColor: isSelected ? '#dbeafe' : isDone ? '#dcfce7' : '#fffbeb',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isDone ? 'default' : 'pointer',
                    opacity: isDone ? 0.6 : 1,
                    position: 'relative'
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{prof.icon}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#1e293b', textAlign: 'center', lineHeight: 1.1 }}>
                    {prof.text}
                  </span>
                  {isDone && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: '#16a34a',
                      borderRadius: '50%',
                      padding: '1px',
                      color: 'white'
                    }}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* COLUMN 3: Places */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textAlign: 'center' }}>
              COLUMNA 3: LUGAR
            </div>
            {COL_PLACES.map(place => {
              const isSelected = selectedPlace === place.id;
              const isDone = isPlaceCompleted(place.id);

              return (
                <button
                  key={place.id}
                  disabled={isDone}
                  onClick={() => handleSelectPlace(place.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: isSelected ? '3px solid #2563eb' : isDone ? '2px solid #16a34a' : '2px solid #b45309',
                    backgroundColor: isSelected ? '#dbeafe' : isDone ? '#dcfce7' : '#fffbeb',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isDone ? 'default' : 'pointer',
                    opacity: isDone ? 0.6 : 1,
                    position: 'relative'
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{place.icon}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#1e293b', textAlign: 'center', lineHeight: 1.1 }}>
                    {place.text}
                  </span>
                  {isDone && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: '#16a34a',
                      borderRadius: '50%',
                      padding: '1px',
                      color: 'white'
                    }}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Connection Summary Pill */}
        <div style={{
          backgroundColor: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px'
        }}>
          <div>
            <strong>Línea actual:</strong>{' '}
            <span style={{ color: '#2563eb', fontWeight: 700 }}>
              {selectedFamily ? COL_FAMILY.find(f => f.id === selectedFamily)?.text : '...'}
            </span>
            {' ➡️ '}
            <span style={{ color: '#2563eb', fontWeight: 700 }}>
              {selectedProfession ? COL_PROFESSIONS.find(p => p.id === selectedProfession)?.text : '...'}
            </span>
            {' ➡️ '}
            <span style={{ color: '#2563eb', fontWeight: 700 }}>
              {selectedPlace ? COL_PLACES.find(p => p.id === selectedPlace)?.text : '...'}
            </span>
          </div>

          {(selectedFamily || selectedProfession) && (
            <button
              onClick={() => {
                setSelectedFamily(null);
                setSelectedProfession(null);
                setSelectedPlace(null);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '10px',
                fontWeight: 700
              }}
            >
              <RotateCcw size={12} />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Footer Progress */}
        <div style={{
          fontSize: '11px',
          color: '#64748b',
          textAlign: 'center',
          fontWeight: 600
        }}>
          Oraciones completadas: {completedTripletIds.length} de {TARGET_TRIPLETS.length}
        </div>
      </div>
    </div>
  );
};
