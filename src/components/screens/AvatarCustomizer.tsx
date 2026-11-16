import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { ArrowLeft, Check, Sparkles, Lock } from 'lucide-react';
import { PlayerCustomization } from '../../types/player';
import { sfx } from '../../utils/audioSynthesis';

export const AvatarCustomizer: React.FC = () => {
  const { setScreen } = useGame();
  const { player, updateCustomization, hasItem } = usePlayer();
  const [name, setName] = useState(player.customization.name);

  const skinTones = [
    { label: 'Claro', value: '#ffd7ba' },
    { label: 'Trigueño', value: '#e8ac7c' },
    { label: 'Andino', value: '#c68642' },
    { label: 'Moreno', value: '#8d5524' }
  ];

  const outfitColors = [
    { label: 'Rojo Andino', value: '#b91c1c' },
    { label: 'Azul Lago', value: '#1d4ed8' },
    { label: 'Verde Valle', value: '#15803d' },
    { label: 'Dorado Sol', value: '#b45309' },
    { label: 'Morado Fiesta', value: '#6b21a8' }
  ];

  const hats: { id: PlayerCustomization['hat']; name: string; icon: string; locked?: boolean }[] = [
    { id: 'none', name: 'Sin gorro', icon: '❌' },
    { id: 'chullo', name: 'Chullo Andino', icon: '🧶' },
    { id: 'sombrero', name: 'Sombrero de Paja', icon: '👒' },
    { id: 'gorra', name: 'Gorra de Guía', icon: '🧢' },
    { 
      id: 'chullo_dorado', 
      name: 'Chullo Dorado', 
      icon: '👑', 
      locked: !hasItem('chullo_dorado') && player.customization.hat !== 'chullo_dorado'
    }
  ];

  const handleSave = () => {
    sfx.playSuccess();
    updateCustomization({ name: name.trim() || 'Guía Inti' });
    setScreen('main_menu');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#fef3c7',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '3px solid #b45309',
        backgroundColor: '#fffbeb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => {
            sfx.playClick();
            setScreen('main_menu');
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#78350f',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 700,
            fontSize: '13px'
          }}
        >
          <ArrowLeft size={18} />
          <span>Volver</span>
        </button>

        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#78350f' }}>
          Personalizar Avatar
        </h2>

        <div style={{ width: '24px' }} />
      </div>

      {/* Body with Preview & Options */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Live Preview Box */}
        <div 
          className="rpg-box"
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Avatar Character Sprite */}
          <div 
            className="animate-float"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '20px',
              backgroundColor: player.customization.outfitColor,
              border: '4px solid #78350f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              position: 'relative',
              boxShadow: '0 8px 12px rgba(0,0,0,0.15)'
            }}
          >
            <span>🧑🏽</span>
            {player.customization.hat === 'chullo' && (
              <span style={{ position: 'absolute', top: '-16px', fontSize: '32px' }}>🧶</span>
            )}
            {player.customization.hat === 'sombrero' && (
              <span style={{ position: 'absolute', top: '-16px', fontSize: '32px' }}>👒</span>
            )}
            {player.customization.hat === 'gorra' && (
              <span style={{ position: 'absolute', top: '-16px', fontSize: '32px' }}>🧢</span>
            )}
            {player.customization.hat === 'chullo_dorado' && (
              <span style={{ position: 'absolute', top: '-16px', fontSize: '34px' }}>👑</span>
            )}
          </div>

          <div style={{ marginTop: '12px', width: '100%', maxWidth: '240px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
              Nombre del Guía:
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ingresa tu nombre..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid #b45309',
                backgroundColor: '#fffbeb',
                fontWeight: 700,
                color: '#78350f',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Color de Vestimenta */}
        <div className="rpg-box" style={{ padding: '12px 14px' }}>
          <label style={{ fontSize: '12px', fontWeight: 800, color: '#78350f', display: 'block', marginBottom: '8px' }}>
            Poncho / Vestimenta Andina:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {outfitColors.map(color => (
              <button
                key={color.value}
                onClick={() => updateCustomization({ outfitColor: color.value })}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: color.value,
                  border: player.customization.outfitColor === color.value ? '4px solid #f59e0b' : '2px solid #ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
                title={color.label}
              >
                {player.customization.outfitColor === color.value && <Check size={18} />}
              </button>
            ))}
          </div>
        </div>

        {/* Sombreros y Accesorios */}
        <div className="rpg-box" style={{ padding: '12px 14px' }}>
          <label style={{ fontSize: '12px', fontWeight: 800, color: '#78350f', display: 'block', marginBottom: '8px' }}>
            Accesorio y Gorro:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {hats.map(hat => (
              <button
                key={hat.id}
                disabled={hat.locked}
                onClick={() => {
                  if (!hat.locked) {
                    updateCustomization({ hat: hat.id });
                  }
                }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: player.customization.hat === hat.id ? '2px solid #b45309' : '1px solid #cbd5e1',
                  backgroundColor: player.customization.hat === hat.id ? '#fef3c7' : '#ffffff',
                  opacity: hat.locked ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: hat.locked ? 'not-allowed' : 'pointer'
                }}
              >
                <span style={{ fontSize: '20px' }}>{hat.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{hat.name}</div>
                  {hat.locked && (
                    <div style={{ fontSize: '9px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Lock size={10} />
                      <span>Recompensa M1</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#fffbeb',
        borderTop: '2px solid #fde68a'
      }}>
        <button
          onClick={handleSave}
          className="rpg-btn rpg-btn-green"
          style={{ width: '100%', padding: '12px', fontSize: '13px' }}
        >
          <Sparkles size={16} />
          <span>Guardar y Confirmar</span>
        </button>
      </div>
    </div>
  );
};
