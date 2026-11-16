import React from 'react';
import { PlayerState } from '../../types/player';
import { MODERN_ASSETS } from '../../utils/modernAssets';
import { PixelImage } from '../ui/PixelImage';

interface CharacterProps {
  player: PlayerState;
}

export const Character: React.FC<CharacterProps> = ({ player }) => {
  const { customization, x, y, direction, isMoving } = player;

  // Select sprite according to movement direction
  const getCharacterSprite = () => {
    switch (direction) {
      case 'up': return MODERN_ASSETS.characters.heroBack;
      case 'left': return MODERN_ASSETS.characters.heroLeft;
      case 'right': return MODERN_ASSETS.characters.heroRight;
      case 'down':
      default:
        return MODERN_ASSETS.characters.hero;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 25,
        transition: 'left 0.08s linear, top 0.08s linear',
        pointerEvents: 'none'
      }}
    >
      {/* Player Name Tag */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        color: '#fef3c7',
        border: '1px solid #f59e0b',
        padding: '2px 8px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 800,
        marginBottom: '4px',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        {customization.name}
      </div>

      {/* Player Sprite directly in world (Proportionate to 16-32px buildings) */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transform: isMoving ? 'scale(1.08)' : 'none',
          transition: 'transform 0.08s ease',
          filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.4))'
        }}
      >
        <PixelImage src={getCharacterSprite()} alt="Player" width={22} height={44} />

        {/* Hat Accessory */}
        {customization.hat === 'chullo' && (
          <span style={{ position: 'absolute', top: '-10px', fontSize: '15px' }}>🧶</span>
        )}
        {customization.hat === 'sombrero' && (
          <span style={{ position: 'absolute', top: '-10px', fontSize: '15px' }}>👒</span>
        )}
        {customization.hat === 'gorra' && (
          <span style={{ position: 'absolute', top: '-10px', fontSize: '15px' }}>🧢</span>
        )}
        {customization.hat === 'chullo_dorado' && (
          <span style={{ position: 'absolute', top: '-12px', fontSize: '15px' }}>👑</span>
        )}
      </div>
    </div>
  );
};
