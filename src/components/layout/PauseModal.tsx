import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play, Volume2, VolumeX, Smartphone, Monitor, RotateCcw, Home, X } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';

export const PauseModal: React.FC = () => {
  const { isPauseOpen, setIsPauseOpen, settings, updateSettings, setScreen, resetAllGameProgress } = useGame();

  if (!isPauseOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      padding: '16px'
    }}>
      <div 
        className="rpg-box"
        style={{
          width: '100%',
          maxWidth: '350px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: '#fffbeb'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#78350f', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚙️</span> Menú de Pausa
          </h2>
          <button
            onClick={() => setIsPauseOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#78350f',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Audio Toggle */}
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '2px solid #fde68a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {settings.soundEnabled ? <Volume2 size={18} color="#b45309" /> : <VolumeX size={18} color="#94a3b8" />}
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#78350f' }}>Efectos de Sonido</span>
          </div>
          <button
            onClick={() => {
              sfx.playClick();
              updateSettings({ soundEnabled: !settings.soundEnabled });
            }}
            className={`rpg-btn ${settings.soundEnabled ? 'rpg-btn-green' : 'rpg-btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            {settings.soundEnabled ? 'Activado' : 'Silencio'}
          </button>
        </div>

        {/* Device View Toggle (Phone Frame vs Full Responsive) */}
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '2px solid #fde68a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {settings.phoneFrameView ? <Smartphone size={18} color="#b45309" /> : <Monitor size={18} color="#b45309" />}
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#78350f' }}>Marco de Celular</span>
          </div>
          <button
            onClick={() => {
              sfx.playClick();
              updateSettings({ phoneFrameView: !settings.phoneFrameView });
            }}
            className="rpg-btn"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            {settings.phoneFrameView ? 'Móvil' : 'Pantalla'}
          </button>
        </div>

        {/* Controls Info */}
        <div style={{
          backgroundColor: '#f1f5f9',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          fontSize: '11px',
          color: '#334155',
          lineHeight: '1.4'
        }}>
          <strong>🎮 Controles:</strong>
          <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
            <li>Movimiento: Teclas <strong>WASD</strong>, <strong>Flechas</strong> o <strong>D-Pad táctil</strong></li>
            <li>Interactuar: Tecla <strong>[E]</strong> o tocar botón de acción</li>
            <li>Buscar maleta: Acercarse y pulsar sobre ella</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <button
          onClick={() => {
            sfx.playClick();
            setIsPauseOpen(false);
          }}
          className="rpg-btn rpg-btn-green"
          style={{ width: '100%', padding: '10px', fontSize: '13px' }}
        >
          <Play size={16} />
          <span>Reanudar Juego</span>
        </button>

        <button
          onClick={() => {
            sfx.playClick();
            setIsPauseOpen(false);
            setScreen('main_menu');
          }}
          className="rpg-btn rpg-btn-secondary"
          style={{ width: '100%', padding: '10px', fontSize: '13px' }}
        >
          <Home size={16} />
          <span>Ir al Menú Principal</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('¿Deseas reiniciar todo el progreso del prototipo?')) {
              resetAllGameProgress();
            }
          }}
          className="rpg-btn rpg-btn-red"
          style={{ width: '100%', padding: '8px', fontSize: '11px' }}
        >
          <RotateCcw size={14} />
          <span>Reiniciar Progreso</span>
        </button>
      </div>
    </div>
  );
};
