import React from 'react';
import { useQuest } from '../../context/QuestContext';
import { BookOpen, Sparkles, ArrowRight, Volume2 } from 'lucide-react';
import { speakEnglish } from '../../utils/speechSynth';
import { sfx } from '../../utils/audioSynthesis';

export const ActivityIntroModal: React.FC = () => {
  const { activeActivityModal, setActiveActivityModal, openDialogue } = useQuest();

  if (activeActivityModal !== 'activity_1_intro' && activeActivityModal !== 'activity_2_intro') {
    return null;
  }

  const isActivity1 = activeActivityModal === 'activity_1_intro';

  const vocabWords = isActivity1 ? [
    { en: 'Backpack', es: 'Mochila / Maleta de viaje', icon: '🎒' },
    { en: 'Blue', es: 'Color Azul', icon: '🔵' },
    { en: 'Circle', es: 'Círculo (figura redonda)', icon: '⭕' },
    { en: 'Lost', es: 'Extraviado / Perdido', icon: '❓' }
  ] : [
    { en: 'Backpack', es: 'Mochila', icon: '🎒' },
    { en: 'Blue', es: 'Azul', icon: '🔵' },
    { en: 'Circle', es: 'Círculo', icon: '⭕' },
    { en: 'Cloudy', es: 'Nublado (clima)', icon: '☁️' }
  ];

  const handleStart = () => {
    try { sfx.playSuccess(); } catch {}
    if (isActivity1) {
      setActiveActivityModal('none');
      openDialogue('john', 'describe_bag');
    } else {
      setActiveActivityModal('word_search');
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
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
          backgroundColor: '#fffbeb',
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
            <BookOpen size={32} />
          </div>
        </div>

        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#b45309',
            backgroundColor: '#fde68a',
            padding: '4px 12px',
            borderRadius: '12px',
            textTransform: 'uppercase'
          }}>
            {isActivity1 ? 'Actividad 1: Búsqueda y Comprensión' : 'Actividad 2: Reconocimiento Léxico'}
          </span>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#78350f', marginTop: '6px' }}>
            Aprenderás Vocabulario
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
            {isActivity1 
              ? 'Términos para describir y localizar pertenencias perdidas:' 
              : 'Identifica las siguientes palabras en la libreta del viajero:'}
          </p>
        </div>

        {/* Word Cards with Audio Listen Button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          textAlign: 'left'
        }}>
          {vocabWords.map(item => (
            <div
              key={item.en}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: '#ffffff',
                border: '2px solid #fde68a',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                    {item.en}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {item.es}
                  </div>
                </div>
              </div>

              <button
                onClick={() => speakEnglish(item.en)}
                title="Escuchar pronunciación"
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <Volume2 size={15} />
                <span>Audio</span>
              </button>
            </div>
          ))}
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
          💡 <strong>Cómo realizar la actividad:</strong> {isActivity1
            ? 'Tras esta pantalla, el turista te describirá su maleta exacta. Luego camina por el pueblo y pulsa sobre la maleta que tenga el color y la forma correcta.'
            : 'Encuentra las 4 palabras en la cuadrícula de letras. Si tocas una palabra correcta, aparecerá un visto verde en su ilustración.'}
        </div>

        {/* Action Button */}
        <button
          onClick={handleStart}
          className="rpg-btn rpg-btn-green"
          style={{ width: '100%', padding: '12px', fontSize: '14px' }}
        >
          <Sparkles size={18} />
          <span>{isActivity1 ? '¡Entendido, escuchar a John!' : '¡Comenzar Sopa de Letras!'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
