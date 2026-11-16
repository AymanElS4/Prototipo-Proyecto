import React, { useState, useEffect } from 'react';
import { useQuest } from '../../context/QuestContext';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { Mic, Square, Send, CheckCircle2, Volume2, RotateCcw, X, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ListeningSpeakingModal: React.FC = () => {
  const { activeActivityModal, setActiveActivityModal, advanceQuestStep, openDialogue } = useQuest();
  const { showFeedback, addHistoryRecord } = useGame();
  const { addXp, addCoins, unlockBadge } = usePlayer();

  // States: 'idle' | 'listening' | 'stopped' | 'congratulations'
  const [recordingState, setRecordingState] = useState<'idle' | 'listening' | 'stopped' | 'congratulations'>('idle');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const targetPhrase = "Excuse me, I lost my blue backpack.";
  const phraseTranslation = "Disculpe, perdí mi mochila azul.";

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

  // 1. User presses microphone button
  const handleStartRecording = () => {
    setRecordingSeconds(0);
    setRecordingState('listening');
  };

  // 2. User presses stop button
  const handleStopRecording = () => {
    setRecordingState('stopped');
  };

  // 3. User presses send/submit button
  const handleSubmit = () => {
    setRecordingState('congratulations');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    addXp(150);
    addCoins(50);

    unlockBadge({
      id: 'voice_master',
      title: 'Voz del Valle',
      description: 'Completaste con éxito la actividad simulada de Speaking en inglés.',
      icon: '🎙️'
    });

    addHistoryRecord({
      activityType: 'listening_speaking',
      title: 'Speaking & Listening: Asistencia al Turista',
      score: 100,
      maxScore: 100,
      mistakesCount: 0,
      completed: true,
      notes: `Pronunciación simulada perfecta de: "${targetPhrase}".`
    });
  };

  // 4. Continue to finish module
  const handleContinue = () => {
    setActiveActivityModal('none');
    advanceQuestStep();

    showFeedback({
      title: '¡Misión Cumplida con John!',
      message: 'Mr. John está completamente agradecido por tu ayuda. Ahora ve al Centro de Información y habla con Don Mateo para recibir tu Llave Dorada y recompensa final.',
      isSuccess: true,
      onContinue: () => {
        openDialogue('mateo', 'mateo_reward');
      }
    });
  };

  const handleSimulatePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1500);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 165,
      padding: '16px'
    }}>
      <div 
        className="rpg-box"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: '#ffffff',
          textAlign: 'center'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
              Práctica Oral • Speaking & Listening
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>
              Pronunciación Funcional
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

        {/* Phrase Card */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #cbd5e1',
          borderRadius: '10px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
            Frase a pronunciar:
          </span>
          <div style={{
            fontSize: '17px',
            fontWeight: 800,
            color: '#1d4ed8',
            marginTop: '4px',
            marginBottom: '4px'
          }}>
            "{targetPhrase}"
          </div>
          <div style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>
            {phraseTranslation}
          </div>

          {/* Simulated audio listen button */}
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={handleSimulatePlayAudio}
              disabled={isPlayingAudio}
              className="rpg-btn rpg-btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                borderRadius: '6px'
              }}
            >
              <Volume2 size={16} />
              <span>{isPlayingAudio ? 'Reproduciendo audio...' : 'Escuchar audio modelo'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Speaking Flow Area */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          backgroundColor: '#f1f5f9',
          border: '2px dashed #94a3b8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* STATE 1: IDLE */}
          {recordingState === 'idle' && (
            <>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Presiona el botón de micrófono para comenzar a hablar:
              </div>
              <button
                onClick={handleStartRecording}
                className="rpg-btn rpg-btn-green"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}
                title="Comenzar a grabar"
              >
                <Mic size={32} />
              </button>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>
                Toca para Grabar
              </span>
            </>
          )}

          {/* STATE 2: LISTENING (Simbol shown that it is listening + Stop button) */}
          {recordingState === 'listening' && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dc2626',
                fontWeight: 800,
                fontSize: '14px'
              }}>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2626',
                  display: 'inline-block'
                }} />
                <span>Escuchando tu voz... (00:0{recordingSeconds})</span>
              </div>

              {/* 2D voice wave indicator */}
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
                <div style={{ width: '6px', height: '14px', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
                <div style={{ width: '6px', height: '22px', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
                <div style={{ width: '6px', height: '18px', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
                <div style={{ width: '6px', height: '24px', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
                <div style={{ width: '6px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
              </div>

              {/* Stop Button */}
              <button
                onClick={handleStopRecording}
                className="rpg-btn rpg-btn-red"
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  borderRadius: '8px'
                }}
              >
                <Square size={16} fill="white" />
                <span>Parar Grabación</span>
              </button>
            </>
          )}

          {/* STATE 3: STOPPED (Show Send Button) */}
          {recordingState === 'stopped' && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#15803d',
                fontWeight: 800,
                fontSize: '14px'
              }}>
                <CheckCircle2 size={18} />
                <span>Grabación capturada con éxito</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '6px' }}>
                <button
                  onClick={handleStartRecording}
                  className="rpg-btn rpg-btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                >
                  <RotateCcw size={14} />
                  <span>Reintentar</span>
                </button>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  className="rpg-btn rpg-btn-green"
                  style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                >
                  <Send size={16} />
                  <span>Enviar</span>
                </button>
              </div>
            </>
          )}

          {/* STATE 4: CONGRATULATIONS */}
          {recordingState === 'congratulations' && (
            <>
              <div style={{ fontSize: '36px' }}>🎉</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#15803d' }}>
                ¡Felicitaciones!
              </h3>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                ¡Excelente pronunciación! Has articulado la frase con claridad y tono adecuado.
              </p>

              <div style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                color: '#166534',
                fontWeight: 700
              }}>
                ⭐ Precisión: 100% • +150 XP • +50 Intis
              </div>

              <button
                onClick={handleContinue}
                className="rpg-btn rpg-btn-green"
                style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '6px' }}
              >
                <span>Continuar</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
