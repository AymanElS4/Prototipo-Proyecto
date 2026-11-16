import React from 'react';
import { PlayerState } from '../../types/player';

interface CharacterProps {
  player: PlayerState;
}

export const Character: React.FC<CharacterProps> = ({ player }) => {
  const { customization, x, y, direction, isMoving } = player;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
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

      {/* Player Sprite */}
      <div 
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: customization.outfitColor,
          border: '3px solid #78350f',
          boxShadow: '0 4px 8px rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          position: 'relative',
          transform: isMoving ? 'scale(1.08)' : 'none',
          transition: 'transform 0.1s ease'
        }}
      >
        <span>🧑🏽</span>

        {/* Hat Accessory */}
        {customization.hat === 'chullo' && (
          <span style={{ position: 'absolute', top: '-14px', fontSize: '20px' }}>🧶</span>
        )}
        {customization.hat === 'sombrero' && (
          <span style={{ position: 'absolute', top: '-14px', fontSize: '20px' }}>👒</span>
        )}
        {customization.hat === 'gorra' && (
          <span style={{ position: 'absolute', top: '-14px', fontSize: '20px' }}>🧢</span>
        )}
        {customization.hat === 'chullo_dorado' && (
          <span style={{ position: 'absolute', top: '-16px', fontSize: '22px' }}>👑</span>
        )}

        {/* Direction dot */}
        <div style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#f59e0b',
          border: '1px solid #ffffff',
          top: direction === 'up' ? '2px' : direction === 'down' ? 'auto' : '19px',
          bottom: direction === 'down' ? '2px' : 'auto',
          left: direction === 'left' ? '2px' : direction === 'right' ? 'auto' : '19px',
          right: direction === 'right' ? '2px' : 'auto'
        }} />
      </div>
    </div>
  );
};
