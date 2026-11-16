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
    { en: 'Backpack', es: 'Backpack', icon: '🎒' },
    { en: 'Blue', es: 'Blue', icon: '🔵' },
    { en: 'Cross', es: 'Cross (+)', icon: '➕' },
    { en: 'Luggage', es: 'Luggage', icon: '🛄' }
  ] : [
    { en: 'Backpack', es: 'Backpack', icon: '🎒' },
    { en: 'Blue', es: 'Blue', icon: '🔵' },
    { en: 'Cross', es: 'Cross', icon: '➕' },
    { en: 'Cloudy', es: 'Cloudy', icon: '☁️' }
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
            textTransform: 'uppercase',
            backgroundColor: '#fde68a',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            {isActivity1 ? 'Activity 1 • Vocabulary' : 'Activity 2 • Vocabulary'}
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
            {isActivity1 ? 'Airport Luggage Keywords' : 'Word Search Vocabulary'}
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {isActivity1 
              ? 'Listen to the key words and pay attention to colors and emblems.'
              : 'Find these terms in the airport word search grid.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {vocabWords.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #fef3c7',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                  {item.en}
                </span>
              </div>

              <button
                onClick={() => speakEnglish(item.en.toLowerCase())}
                style={{
                  background: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#b45309',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <Volume2 size={14} />
                <span>Audio</span>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="rpg-btn rpg-btn-green"
          style={{ width: '100%', fontSize: '14px', padding: '12px', marginTop: '6px' }}
        >
          <span>CONTINUE</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
