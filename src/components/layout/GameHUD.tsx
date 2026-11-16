import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { useQuest } from '../../context/QuestContext';
import { Wifi, WifiOff, Pause, BookOpen, Compass, Layers, CheckCircle2, ChevronDown, Volume2, VolumeX, ArrowLeft, RotateCcw } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';

export const GameHUD: React.FC = () => {
  const { settings, toggleOnlineMode, updateSettings, setIsPauseOpen, setIsHistoryOpen, screen, setScreen } = useGame();
  const { player } = usePlayer();
  const { quest, setActiveActivityModal, setSuitcasesVisible, restartLevelOne } = useQuest();
  const [isActivitiesMenuOpen, setIsActivitiesMenuOpen] = useState(false);

  // Hide the global game HUD in Main Menu, World Map AND in Avatar Customizer
  // to prevent HUD statistics and top bars from colliding with customizer buttons
  if (screen === 'main_menu' || screen === 'world_map' || screen === 'customizer') return null;

  const currentStep = quest?.steps && quest.steps[quest.currentStepIndex];

  const handleSelectActivity = (actIndex: number) => {
    try { sfx.playPop(); } catch {}
    setIsActivitiesMenuOpen(false);

    switch (actIndex) {
      case 1:
        setSuitcasesVisible(true);
        setActiveActivityModal('activity_1_intro');
        break;
      case 2:
        setActiveActivityModal('activity_2_intro');
        break;
      case 3:
        setActiveActivityModal('sentence_matching');
        break;
      case 4:
        setActiveActivityModal('listening_speaking' as any);
        break;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '8px 10px',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      pointerEvents: 'none'
    }}>
      {/* Top Bar Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        pointerEvents: 'auto',
        gap: '4px'
      }}>
        {/* Player Level & XP */}
        <div 
          className="rpg-box"
          style={{
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#fffbeb',
            borderWidth: '2px'
          }}
        >
          <div style={{
            fontSize: '11px',
            fontWeight: 900,
            color: '#78350f'
          }}>
            LV.{player.level}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <div style={{
              width: '52px',
              height: '5px',
              backgroundColor: '#cbd5e1',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(100, (player.xp % 300) / 3)}%`,
                height: '100%',
                backgroundColor: '#10b981',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 800 }}>
              {player.xp % 300}/300 XP
            </div>
          </div>
        </div>

        {/* Coins (Intis) */}
        <div 
          className="rpg-box"
          style={{
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderWidth: '2px',
            backgroundColor: '#fffbeb'
          }}
        >
          <span style={{ fontSize: '13px' }}>🪙</span>
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#92400e' }}>
            {player.coins} Intis
          </span>
        </div>

        {/* Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={toggleOnlineMode}
            title={settings.isOnlineMode ? 'Modo Online' : 'Modo Offline'}
            style={{
              padding: '4px 6px',
              borderRadius: '6px',
              border: '2px solid #78350f',
              backgroundColor: settings.isOnlineMode ? '#dcfce7' : '#fed7aa',
              color: settings.isOnlineMode ? '#15803d' : '#9a3412',
              fontSize: '9px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              cursor: 'pointer'
            }}
          >
            {settings.isOnlineMode ? (
              <>
                <Wifi size={11} />
                <span>ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff size={11} />
                <span>OFFLINE</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            title="Bitácora y Logros"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '2px solid #78350f',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={14} />
          </button>

          <button
            onClick={() => {
              const nextVal = !settings.soundEnabled;
              sfx.setEnabled(nextVal);
              sfx.playPop();
              updateSettings({ soundEnabled: nextVal });
            }}
            title={settings.soundEnabled ? 'Sonido Activado' : 'Sonido Silenciado'}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '2px solid #78350f',
              backgroundColor: settings.soundEnabled ? '#dcfce7' : '#fee2e2',
              color: settings.soundEnabled ? '#15803d' : '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {settings.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Menú de Actividades (Solo dentro del nivel) */}
          {screen === 'town_map' && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  try { sfx.playPop(); } catch {}
                  setIsActivitiesMenuOpen(prev => !prev);
                }}
                title="Menú de Actividades del Nivel"
                style={{
                  padding: '4px 7px',
                  borderRadius: '6px',
                  border: '2px solid #78350f',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '10px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                <Layers size={12} />
                <span>ACT.</span>
                <ChevronDown size={10} />
              </button>

              {isActivitiesMenuOpen && (
                <div 
                  className="rpg-box animate-float"
                  style={{
                    position: 'absolute',
                    top: '32px',
                    right: 0,
                    width: '230px',
                    backgroundColor: '#ffffff',
                    border: '3px solid #78350f',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    zIndex: 100,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#b45309', padding: '2px 4px', textTransform: 'uppercase' }}>
                    Nivel 1: Aeropuerto • Actividades
                  </div>

                  <button
                    onClick={() => handleSelectActivity(1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: quest.currentStepIndex >= 0 ? '#eff6ff' : '#ffffff',
                      color: '#1e293b',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>🎒</span>
                    <div style={{ flex: 1 }}>
                      <div>Actividad 1: Mochila</div>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>Aeropuerto - Interior</div>
                    </div>
                    {quest.currentStepIndex > 1 && <CheckCircle2 size={14} color="#16a34a" />}
                  </button>

                  <button
                    onClick={() => handleSelectActivity(2)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: quest.currentStepIndex >= 2 ? '#eff6ff' : '#ffffff',
                      color: '#1e293b',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>🔤</span>
                    <div style={{ flex: 1 }}>
                      <div>Actividad 2: Sopa de Letras</div>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>Aeropuerto - Exterior Atenuado</div>
                    </div>
                    {quest.currentStepIndex > 2 && <CheckCircle2 size={14} color="#16a34a" />}
                  </button>

                  <button
                    onClick={() => handleSelectActivity(3)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: quest.currentStepIndex >= 3 ? '#eff6ff' : '#ffffff',
                      color: '#1e293b',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>🔗</span>
                    <div style={{ flex: 1 }}>
                      <div>Actividad 3: Unir con Líneas</div>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>3 Columnas: Familia & Trabajo</div>
                    </div>
                    {quest.currentStepIndex > 3 && <CheckCircle2 size={14} color="#16a34a" />}
                  </button>

                  <button
                    onClick={() => handleSelectActivity(4)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: quest.currentStepIndex >= 4 ? '#eff6ff' : '#ffffff',
                      color: '#1e293b',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>🎙️</span>
                    <div style={{ flex: 1 }}>
                      <div>Actividad 4: Speaking</div>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>Expresión Oral & Micrófono</div>
                    </div>
                    {quest.isComplete && <CheckCircle2 size={14} color="#16a34a" />}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              try { sfx.playPop(); } catch {}
              setIsPauseOpen(true);
            }}
            title="Pausa y Ajustes"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '2px solid #78350f',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Pause size={14} />
          </button>
        </div>
      </div>

      {/* Línea 2: Controles dentro de nivel */}
      {screen === 'town_map' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setScreen('world_map')}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              border: '1.5px solid #38bdf8',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}
          >
            <ArrowLeft size={12} />
            <span>Mapa</span>
          </button>

          {currentStep && (
            <div
              className="rpg-box"
              style={{
                flex: 1,
                minWidth: 0,
                padding: '4px 8px',
                backgroundColor: '#ffffff',
                borderWidth: '1.5px',
                borderColor: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }}
            >
              <Compass size={13} color="#b45309" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {currentStep.instruction}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar el Nivel 1 para jugarlo desde el inicio?')) {
                restartLevelOne();
              }
            }}
            title="Reiniciar Nivel 1"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              border: '1.5px solid #f59e0b',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#fef3c7',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}
          >
            <RotateCcw size={11} />
            <span>Reiniciar</span>
          </button>
        </div>
      )}
    </div>
  );
};
