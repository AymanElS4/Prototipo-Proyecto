import React, { useState, useEffect } from 'react';
import { useQuest } from '../../context/QuestContext';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { Mic, Square, Send, CheckCircle2, Volume2, RotateCcw, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIRPORT_ASSETS } from '../../utils/airportAssets';
import { speakEnglish } from '../../utils/speechSynth';
import { sfx } from '../../utils/audioSynthesis';

export const ListeningSpeakingModal: React.FC = () => {
  const { activeActivityModal, setActiveActivityModal, advanceQuestStep } = useQuest();
  const { addHistoryRecord, setScreen } = useGame();
  const { addXp, addCoins, unlockBadge } = usePlayer();

  // Screen step: 'transition' (Speaking Section) | 'activity'
  const [screenStep, setScreenStep] = useState<'transition' | 'activity'>('transition');

  // States: 'idle' | 'listening' | 'stopped' | 'congratulations'
  const [recordingState, setRecordingState] = useState<'idle' | 'listening' | 'stopped' | 'congratulations'>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const targetPhrase = "Excuse me, I lost my blue backpack with a cross.";
  const phraseTranslation = "Disculpe, perdí mi mochila azul con una cruz.";

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (recordingState === 'listening') {
      timer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [recordingState]);

  if (activeActivityModal !== ('listening_speaking' as any)) {
    return null;
  }

  const handleStartRecording = () => {
    try { sfx.playClick(); } catch {}
    setRecordingSeconds(0);
    setRecordingState('listening');
  };

  const handleStopRecording = () => {
    try { sfx.playClick(); } catch {}
    setRecordingState('stopped');
  };

  const handleSubmit = () => {
    try { sfx.playSuccess(); } catch {}
    setRecordingState('congratulations');

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    addXp(150);
    addCoins(50);

    unlockBadge({
      id: 'voice_master',
      title: 'Airport Voice Master',
      description: 'Completed oral pronunciation speaking in Level 1.',
      icon: '🎙️'
    });

    addHistoryRecord({
      activityType: 'listening_speaking',
      title: 'Speaking Section: Airport Assistance',
      score: 100,
      maxScore: 100,
      mistakesCount: 0,
      completed: true,
      notes: `Pronunciation evaluated: "${targetPhrase}".`
    });
  };

  const handleFinalSuccess = () => {
    setActiveActivityModal('none');
    advanceQuestStep();
    setScreen('world_map');
  };

  // 1. TRANSITION INTERMEDIATE SCREEN
  if (screenStep === 'transition') {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("${AIRPORT_ASSETS.exteriorSvg}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 165,
        padding: '16px'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(4px)'
        }} />

        <div
          className="rpg-box animate-float"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '380px',
            padding: '28px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            backgroundColor: '#fffbeb',
            border: '4px solid #f59e0b',
            boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
            borderRadius: '16px'
          }}
        >
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            border: '4px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dc2626'
          }}>
            <Mic size={42} />
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Activity 4 • Level 1
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#78350f', marginTop: '4px' }}>
              Speaking Section
            </h1>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '8px', lineHeight: '1.5' }}>
              Look at the visual reference of the lost backpack with a cross, listen to the model and practice your pronunciation using the microphone.
            </p>
          </div>

          <button
            onClick={() => {
              try { sfx.playPop(); } catch {}
              setScreenStep('activity');
            }}
            className="rpg-btn rpg-btn-green"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>START / COMENZAR</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // 2. MAIN SPEAKING ACTIVITY SCREEN
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `url("${AIRPORT_ASSETS.exteriorSvg}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 165,
      padding: '12px'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(3px)'
      }} />

      <div 
        className="rpg-box"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '430px',
          maxHeight: '96vh',
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          borderRadius: '16px'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Speaking Section • Oral Practice
            </span>
            <h2 style={{ fontSize: '17px', fontWeight: 900, color: '#1e293b', margin: '2px 0 0' }}>
              Airport Terminal
            </h2>
          </div>
          <button
            onClick={() => setActiveActivityModal('none')}
            style={{
              background: '#f1f5f9',
              border: '2px solid #cbd5e1',
              borderRadius: '8px',
              padding: '4px 8px',
              color: '#64748b',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>

        {/* 2-Panel Layout: Left (Guide instruction) / Right (REFERENCE image: backpack with a cross) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          alignItems: 'stretch'
        }}>
          {/* Panel Izquierdo: Guía Oficial */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '2px solid #bfdbfe',
            borderRadius: '12px',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px' }}>🧑‍🏫</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#1e40af' }}>Guide</div>
                <div style={{ fontSize: '9px', color: '#60a5fa', fontWeight: 800 }}>INSTRUCTION</div>
              </div>
            </div>

            {/* Speech Bubble en Inglés */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '2px solid #93c5fd',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '11px',
              lineHeight: '1.4',
              color: '#1e293b',
              position: 'relative',
              fontWeight: 700
            }}>
              "Look at the visual reference of the backpack and say the phrase aloud to ask for help."
            </div>

            <button
              onClick={() => speakEnglish(targetPhrase)}
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '6px 8px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                borderRadius: '6px',
                border: 'none',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Volume2 size={14} />
              <span>Listen model</span>
            </button>
          </div>

          {/* Panel Derecho: "REFERENCE" con Mochila Azul con Cruz */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '2px solid #cbd5e1',
            borderRadius: '12px',
            padding: '10px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              fontSize: '9px',
              fontWeight: 900,
              backgroundColor: '#e2e8f0',
              padding: '2px 6px',
              borderRadius: '4px',
              color: '#334155'
            }}>
              REFERENCE
            </span>

            {/* Imagen Pixel Art de la Mochila con Cruz */}
            <div style={{
              marginTop: '12px',
              width: '68px',
              height: '68px',
              borderRadius: '12px',
              backgroundColor: '#dbeafe',
              border: '2px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
            }}>
              <img
                src="/assets/backpacks/backpack_blue_cross_128.png"
                alt="Blue backpack with a cross"
                style={{
                  width: '56px',
                  height: '56px',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                }}
              />
            </div>

            <div style={{ fontSize: '11px', fontWeight: 900, color: '#1e293b', marginTop: '6px' }}>
              Lost Luggage
            </div>
            <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 800 }}>
              Blue backpack with cross
            </div>
          </div>
        </div>

        {/* Target Phrase Box */}
        <div style={{
          backgroundColor: '#f1f5f9',
          border: '2px dashed #94a3b8',
          borderRadius: '10px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e40af' }}>
            "{targetPhrase}"
          </div>
        </div>

        {/* Voice Interaction Area */}
        <div style={{
          backgroundColor: '#fafaf9',
          border: '2px solid #e7e5e4',
          borderRadius: '12px',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          {recordingState === 'idle' && (
            <>
              <div style={{ fontSize: '12px', color: '#44403c', fontWeight: 700 }}>
                Press the red microphone button to record your voice:
              </div>

              <button
                onClick={handleStartRecording}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2626',
                  border: '4px solid #b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
                  transition: 'transform 0.1s ease'
                }}
                title="Press to record"
              >
                <Mic size={32} />
              </button>

              <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626' }}>
                RECORD PRONUNCIATION
              </span>
            </>
          )}

          {recordingState === 'listening' && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dc2626',
                fontWeight: 800,
                fontSize: '13px'
              }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2626',
                  animation: 'pulse 1s infinite'
                }} />
                <span>Recording voice... (00:0{recordingSeconds})</span>
              </div>

              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '22px' }}>
                <div style={{ width: '5px', height: '14px', backgroundColor: '#dc2626', borderRadius: '3px' }} />
                <div style={{ width: '5px', height: '22px', backgroundColor: '#dc2626', borderRadius: '3px' }} />
                <div style={{ width: '5px', height: '16px', backgroundColor: '#dc2626', borderRadius: '3px' }} />
                <div style={{ width: '5px', height: '20px', backgroundColor: '#dc2626', borderRadius: '3px' }} />
                <div style={{ width: '5px', height: '12px', backgroundColor: '#dc2626', borderRadius: '3px' }} />
              </div>

              <button
                onClick={handleStopRecording}
                className="rpg-btn rpg-btn-red"
                style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
              >
                <Square size={14} fill="white" />
                <span>Stop Recording</span>
              </button>
            </>
          )}

          {recordingState === 'stopped' && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#15803d',
                fontWeight: 800,
                fontSize: '13px'
              }}>
                <CheckCircle2 size={16} />
                <span>Recording ready for evaluation</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
                <button
                  onClick={handleStartRecording}
                  className="rpg-btn rpg-btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                >
                  <RotateCcw size={14} />
                  <span>Retry</span>
                </button>

                <button
                  onClick={handleSubmit}
                  className="rpg-btn rpg-btn-green"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 800 }}
                >
                  <Send size={15} />
                  <span>Evaluate Voice</span>
                </button>
              </div>
            </>
          )}

          {recordingState === 'congratulations' && (
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '8px'
            }}>
              <div style={{ fontSize: '32px' }}>🎉</div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#15803d' }}>
                ¡BIEN HECHO! / Well done
              </h3>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
                You completed the <strong>Speaking Section</strong> and finished all activities for <strong>Level 1: Airport</strong>.
              </p>

              <div style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '12px',
                color: '#166534',
                fontWeight: 800
              }}>
                ⭐ Level 1 Completed • 3 Stars Earned
              </div>

              <button
                onClick={handleFinalSuccess}
                className="rpg-btn rpg-btn-green"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: 900,
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>CONTINUE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
