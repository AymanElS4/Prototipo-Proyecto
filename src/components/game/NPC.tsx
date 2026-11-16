import React from 'react';
import { NPCData } from '../../types/dialogue';
import { useQuest } from '../../context/QuestContext';
import { sfx } from '../../utils/audioSynthesis';

interface NPCProps {
  npc: NPCData;
  isNearby: boolean;
}

export const NPC: React.FC<NPCProps> = ({ npc, isNearby }) => {
  const { openDialogue } = useQuest();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { sfx.playClick(); } catch {}
    openDialogue(npc.id);
  };

  return (
    <div
      onClick={handleClick}
      title={`Hablar con ${npc.name}`}
      style={{
        position: 'absolute',
        left: `${npc.x}px`,
        top: `${npc.y}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 20
      }}
    >
      {/* Interaction prompt floating above */}
      {isNearby && (
        <div 
          className="animate-float"
          style={{
            backgroundColor: '#f59e0b',
            color: '#78350f',
            border: '2px solid #ffffff',
            borderRadius: '12px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 800,
            boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
            marginBottom: '4px',
            whiteSpace: 'nowrap'
          }}
        >
          [E] Toca para hablar
        </div>
      )}

      {/* NPC Sprite Avatar */}
      <div 
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: npc.color,
          border: '3px solid #ffffff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px'
        }}
      >
        <span>{npc.avatarIcon}</span>
      </div>

      {/* Name Label */}
      <div style={{
        marginTop: '3px',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        color: '#ffffff',
        padding: '2px 8px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        {npc.name.split(' ')[0]}
      </div>
    </div>
  );
};
