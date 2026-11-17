import React from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { Play, UserCheck, BookOpen, Settings, Volume2, VolumeX } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';

export const MainMenu: React.FC = () => {
  const { setScreen, setIsPauseOpen, setIsHistoryOpen, settings, updateSettings } = useGame();
  const { player } = usePlayer();

  const handleStartGame = () => {
    try { sfx.playClick(); } catch {}
    const hasCustomizedAvatar = localStorage.getItem('rpg_avatar_customized') === 'true';
    setScreen(hasCustomizedAvatar ? 'world_map' : 'customizer');
  };

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    sfx.setEnabled(nextVal);
    sfx.playPop();
    updateSettings({ soundEnabled: nextVal });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: 'url(/assets/menu_theme/main_bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '30px 20px 24px 20px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Sombra de viñeta inferior para destacar botones de piedra */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '42%',
        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      {/* Espacio superior para que respete el logotipo impreso en la imagen */}
      <div style={{ height: '34%' }} />

      {/* Tarjeta de Perfil del Jugador con Estilo Placa de Piedra */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          background: 'linear-gradient(180deg, rgba(235, 230, 219, 0.95) 0%, rgba(196, 189, 174, 0.95) 100%)',
          border: '3px solid #5a5245',
          borderBottom: '5px solid #3c362c',
          borderRadius: '16px',
          boxShadow: '0 8px 18px rgba(0, 0, 0, 0.55)',
          maxWidth: '340px',
          width: '100%'
        }}
      >
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '12px',
          backgroundColor: player.customization.outfitColor,
          border: '3px solid #3c362c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <span>🧑🏽</span>
          {player.customization.hat === 'chullo' && (
            <span style={{ position: 'absolute', top: '-12px', fontSize: '18px' }}>🧶</span>
          )}
          {player.customization.hat === 'sombrero' && (
            <span style={{ position: 'absolute', top: '-12px', fontSize: '18px' }}>👒</span>
          )}
          {player.customization.hat === 'gorra' && (
            <span style={{ position: 'absolute', top: '-12px', fontSize: '18px' }}>🧢</span>
          )}
          {player.customization.hat === 'chullo_dorado' && (
            <span style={{ position: 'absolute', top: '-14px', fontSize: '20px' }}>👑</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: 900, color: '#2b261f', letterSpacing: '0.4px' }}>
            {player.customization.name}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#5a5245', marginTop: '2px' }}>
            Nivel {player.level} • {player.coins} Intis
          </div>
        </div>
      </div>

      {/* Botonera Principal con Estilo de Piedra Tallada */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '340px'
      }}>
        {/* Botón Principal de Gran Placa de Piedra: INICIAR PARTIDA */}
        <button
          onClick={handleStartGame}
          className="stone-btn stone-btn-green"
          style={{
            width: '100%',
            fontSize: '17px',
            padding: '16px',
            borderRadius: '16px',
            letterSpacing: '1px'
          }}
        >
          <Play size={22} fill="white" />
          <span>INICIAR PARTIDA</span>
        </button>

        {/* Botón de Piedra: Personalizar Avatar */}
        <button
          onClick={() => {
            try { sfx.playClick(); } catch {}
            setScreen('customizer');
          }}
          className="stone-btn"
          style={{
            width: '100%',
            fontSize: '14px',
            padding: '12px'
          }}
        >
          <UserCheck size={18} />
          <span>Personalizar Avatar</span>
        </button>

        {/* Fila Inferior de Botones de Piedra: Bitácora, Sonido y Ajustes */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Bitácora */}
          <button
            onClick={() => {
              try { sfx.playClick(); } catch {}
              setIsHistoryOpen(true);
            }}
            className="stone-btn"
            style={{ flex: 1, fontSize: '12px', padding: '12px 8px' }}
          >
            <BookOpen size={16} />
            <span>Bitácora</span>
          </button>

          {/* Botón Circular de Piedra: Sonido */}
          <button
            onClick={handleToggleSound}
            className="stone-btn stone-btn-round"
            title={settings.soundEnabled ? 'Sonido Activado' : 'Sonido Desactivado'}
            style={{
              backgroundColor: settings.soundEnabled ? '#dfdacd' : '#fee2e2'
            }}
          >
            {settings.soundEnabled ? <Volume2 size={22} color="#2b261f" /> : <VolumeX size={22} color="#dc2626" />}
          </button>

          {/* Botón Circular de Piedra: Ajustes */}
          <button
            onClick={() => {
              try { sfx.playClick(); } catch {}
              setIsPauseOpen(true);
            }}
            className="stone-btn stone-btn-round"
            title="Ajustes de Juego"
          >
            <Settings size={22} color="#2b261f" />
          </button>
        </div>
      </div>
    </div>
  );
};
