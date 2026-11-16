import React from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { Play, UserCheck, BookOpen, Settings } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { setScreen, setIsPauseOpen, setIsHistoryOpen } = useGame();
  const { player } = usePlayer();

  // Goes directly to the 6 modules selection screen as requested!
  const handleStartGame = () => {
    setScreen('world_map');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1e1b4b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '36px 20px 24px 20px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Title Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: '16px'
      }}>
        <div style={{ fontSize: '42px', marginBottom: '8px' }}>
          🎒
        </div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 900,
          color: '#fbbf24',
          marginBottom: '8px',
          letterSpacing: '0.5px'
        }}>
          RESCATANDO AL TURISTA
        </h1>
        <div style={{
          backgroundColor: '#312e81',
          padding: '6px 16px',
          borderRadius: '8px',
          border: '1px solid #4338ca',
          fontSize: '13px',
          fontWeight: 600,
          color: '#e0e7ff'
        }}>
          Simulador RPG de Inglés Funcional
        </div>
      </div>

      {/* Player Avatar Preview Card (Flat 2D) */}
      <div 
        className="rpg-box"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#ffffff',
          maxWidth: '360px',
          width: '100%'
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          backgroundColor: player.customization.outfitColor,
          border: '2px solid #78350f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          position: 'relative'
        }}>
          <span>🧑🏽</span>
          {player.customization.hat === 'chullo' && (
            <span style={{ position: 'absolute', top: '-12px', fontSize: '20px' }}>🧶</span>
          )}
          {player.customization.hat === 'sombrero' && (
            <span style={{ position: 'absolute', top: '-12px', fontSize: '20px' }}>👒</span>
          )}
          {player.customization.hat === 'gorra' && (
            <span style={{ position: 'absolute', top: '-12px', fontSize: '20px' }}>🧢</span>
          )}
          {player.customization.hat === 'chullo_dorado' && (
            <span style={{ position: 'absolute', top: '-14px', fontSize: '22px' }}>👑</span>
          )}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
            {player.customization.name}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Nivel {player.level} • {player.coins} Intis
          </div>
        </div>
      </div>

      {/* Menu Actions (Flat 2D buttons) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '340px'
      }}>
        {/* Main Start Button */}
        <button
          onClick={handleStartGame}
          className="rpg-btn rpg-btn-green"
          style={{ width: '100%', fontSize: '16px', padding: '14px' }}
        >
          <Play size={20} />
          <span>INICIAR PARTIDA</span>
        </button>

        {/* Customize Avatar */}
        <button
          onClick={() => setScreen('customizer')}
          className="rpg-btn"
          style={{ width: '100%', fontSize: '14px', padding: '12px' }}
        >
          <UserCheck size={18} />
          <span>Personalizar Avatar</span>
        </button>

        {/* Bitácora & Ajustes */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="rpg-btn rpg-btn-secondary"
            style={{ flex: 1, fontSize: '13px', padding: '10px' }}
          >
            <BookOpen size={16} />
            <span>Bitácora</span>
          </button>

          <button
            onClick={() => setIsPauseOpen(true)}
            className="rpg-btn rpg-btn-secondary"
            style={{ flex: 1, fontSize: '13px', padding: '10px' }}
          >
            <Settings size={16} />
            <span>Ajustes</span>
          </button>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
        Prototipo interactivo • Formato Redmi 15C
      </div>
    </div>
  );
};
