import React from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { useQuest } from '../../context/QuestContext';
import { Wifi, WifiOff, Pause, BookOpen, Compass } from 'lucide-react';

export const GameHUD: React.FC = () => {
  const { settings, toggleOnlineMode, setIsPauseOpen, setIsHistoryOpen, screen } = useGame();
  const { player } = usePlayer();
  const { quest } = useQuest();

  if (screen === 'main_menu') return null;

  const currentStep = quest?.steps && quest.steps[quest.currentStepIndex];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '12px 14px',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none'
    }}>
      {/* Top Bar Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        pointerEvents: 'auto'
      }}>
        {/* Player Level & XP */}
        <div 
          className="rpg-box"
          style={{
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#fffbeb',
            borderWidth: '2px'
          }}
        >
          <div style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#78350f'
          }}>
            LV.{player.level}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{
              width: '75px',
              height: '8px',
              backgroundColor: '#cbd5e1',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(100, (player.xp % 300) / 3)}%`,
                height: '100%',
                backgroundColor: '#10b981',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
              {player.xp % 300}/300 XP
            </div>
          </div>
        </div>

        {/* Coins (Intis) */}
        <div 
          className="rpg-box"
          style={{
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderWidth: '2px',
            backgroundColor: '#fffbeb'
          }}
        >
          <span style={{ fontSize: '16px' }}>🪙</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
            {player.coins} Intis
          </span>
        </div>

        {/* Buttons: Online Toggle, Bitácora, Pause */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Simulated Online/Offline Toggle */}
          <button
            onClick={toggleOnlineMode}
            title={settings.isOnlineMode ? 'Modo Online (Conectado)' : 'Modo Offline (Guardado local)'}
            style={{
              padding: '6px 9px',
              borderRadius: '8px',
              border: '2px solid #78350f',
              backgroundColor: settings.isOnlineMode ? '#dcfce7' : '#fed7aa',
              color: settings.isOnlineMode ? '#15803d' : '#9a3412',
              fontSize: '11px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            {settings.isOnlineMode ? (
              <>
                <Wifi size={13} />
                <span>ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span>OFFLINE</span>
              </>
            )}
          </button>

          {/* Bitácora / Logros */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            title="Bitácora y Logros"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '2px solid #78350f',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={16} />
          </button>

          {/* Pause Menu */}
          <button
            onClick={() => setIsPauseOpen(true)}
            title="Pausa y Ajustes"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '2px solid #78350f',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Pause size={16} />
          </button>
        </div>
      </div>

      {/* Quest Objective Tracker Pill */}
      {currentStep && screen === 'town_map' && (
        <div
          className="rpg-box"
          style={{
            pointerEvents: 'auto',
            padding: '8px 12px',
            backgroundColor: '#ffffff',
            borderWidth: '2px',
            borderColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 3px 6px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b45309',
            flexShrink: 0
          }}>
            <Compass size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
              Misión: {quest.title}
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
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
    </div>
  );
};
