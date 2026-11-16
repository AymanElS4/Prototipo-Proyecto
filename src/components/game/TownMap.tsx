import React, { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { useQuest } from '../../context/QuestContext';
import { Character } from './Character';
import { NPC } from './NPC';
import { SuitcaseSprite } from './SuitcaseSprite';
import { NPCS_DATA } from '../../data/npcsData';
import { SUITCASES_DATA } from '../../data/suitcasesData';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight as ArrowR, ArrowLeft as ArrowL, MessageCircle, Sparkles } from 'lucide-react';

export const TownMap: React.FC = () => {
  const { setScreen } = useGame();
  const { player, moveBy, setPosition } = usePlayer();
  const { 
    suitcasesVisible, 
    setSuitcasesVisible,
    openDialogue, 
    activeDialogueNpcId,
    activeActivityModal,
    setActiveActivityModal
  } = useQuest();

  const mapRef = useRef<HTMLDivElement>(null);

  // Check proximity to NPCs for the [HABLAR] button
  const getNearbyNpcId = () => {
    for (const [id, npc] of Object.entries(NPCS_DATA)) {
      const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
      if (dist < 80) return id;
    }
    return null;
  };

  const nearbyNpcId = getNearbyNpcId();

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDialogueNpcId || activeActivityModal !== 'none') return;

      const step = 20;
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          moveBy(0, -step, 'up');
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          moveBy(0, step, 'down');
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          moveBy(-step, 0, 'left');
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          moveBy(step, 0, 'right');
          break;
        case 'e':
          e.preventDefault();
          if (nearbyNpcId) {
            openDialogue(nearbyNpcId);
          } else {
            // Default talk to John if pressed E
            openDialogue('john');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialogueNpcId, activeActivityModal, nearbyNpcId, moveBy, openDialogue]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeDialogueNpcId || activeActivityModal !== 'none') return;
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setPosition(clickX, clickY);
  };

  // Direct shortcuts to test activities directly without friction
  const triggerActivity1 = () => {
    setSuitcasesVisible(true);
    setActiveActivityModal('activity_1_intro');
  };

  const triggerActivity2 = () => {
    setActiveActivityModal('activity_2_intro');
  };

  const triggerActivity3 = () => {
    setActiveActivityModal('listening_speaking' as any);
  };

  const triggerReward = () => {
    openDialogue('mateo', 'mateo_reward');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      flex: 1,
      minHeight: '560px',
      backgroundColor: '#78716c',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header Controls */}
      <div style={{
        position: 'absolute',
        top: '46px',
        left: '12px',
        right: '12px',
        zIndex: 35,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        {/* Back to world map */}
        <button
          onClick={() => setScreen('world_map')}
          style={{
            pointerEvents: 'auto',
            backgroundColor: '#ffffff',
            border: '2px solid #78350f',
            borderRadius: '8px',
            padding: '5px 12px',
            color: '#78350f',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ArrowLeft size={14} />
          <span>Ruta</span>
        </button>

        {/* Direct quick activity tester pill */}
        <div style={{
          pointerEvents: 'auto',
          backgroundColor: '#ffffff',
          border: '2px solid #b45309',
          borderRadius: '8px',
          padding: '4px 8px',
          display: 'flex',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 800
        }}>
          <button
            onClick={triggerActivity1}
            title="Abrir Actividad 1: Maleta"
            style={{
              background: '#fef3c7',
              border: '1px solid #d97706',
              borderRadius: '6px',
              padding: '3px 6px',
              cursor: 'pointer',
              color: '#92400e'
            }}
          >
            🎒 Act. 1
          </button>
          <button
            onClick={triggerActivity2}
            title="Abrir Actividad 2: Sopa de Letras"
            style={{
              background: '#fef3c7',
              border: '1px solid #d97706',
              borderRadius: '6px',
              padding: '3px 6px',
              cursor: 'pointer',
              color: '#92400e'
            }}
          >
            🔤 Act. 2
          </button>
          <button
            onClick={triggerActivity3}
            title="Abrir Actividad 3: Speaking Simulado"
            style={{
              background: '#fef3c7',
              border: '1px solid #d97706',
              borderRadius: '6px',
              padding: '3px 6px',
              cursor: 'pointer',
              color: '#92400e'
            }}
          >
            🎙️ Act. 3
          </button>
          <button
            onClick={triggerReward}
            title="Reclamar Llave y Chullo"
            style={{
              background: '#dcfce7',
              border: '1px solid #16a34a',
              borderRadius: '6px',
              padding: '3px 6px',
              cursor: 'pointer',
              color: '#15803d'
            }}
          >
            🗝️ Llave
          </button>
        </div>
      </div>

      {/* Town Map Game Surface (Flat 2D Cobblestone Ground) */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        style={{
          width: '100%',
          flex: 1,
          minHeight: '520px',
          position: 'relative',
          backgroundColor: '#a8a29e',
          overflow: 'hidden',
          cursor: 'crosshair'
        }}
      >
        {/* Buildings and Town Decor (Flat 2D) */}
        {/* North East: Oficina de Información Turística (Don Mateo) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            openDialogue('mateo');
          }}
          style={{
            position: 'absolute',
            top: '80px',
            right: '16px',
            width: '140px',
            height: '80px',
            backgroundColor: '#047857',
            border: '3px solid #064e3b',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            padding: '6px',
            textAlign: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <span style={{ fontSize: '20px' }}>🏛️</span>
          <span style={{ fontSize: '11px', fontWeight: 800 }}>INFO TURÍSTICA</span>
          <span style={{ fontSize: '9px', opacity: 0.9 }}>Toca para hablar con Mateo</span>
        </div>

        {/* West: Puesto de Artesanías de Doña Rosa */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            openDialogue('rosa');
          }}
          style={{
            position: 'absolute',
            top: '140px',
            left: '12px',
            width: '110px',
            height: '75px',
            backgroundColor: '#d97706',
            border: '3px solid #92400e',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            padding: '6px',
            textAlign: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <span style={{ fontSize: '20px' }}>🧶</span>
          <span style={{ fontSize: '11px', fontWeight: 800 }}>ARTESANÍAS</span>
          <span style={{ fontSize: '9px', opacity: 0.9 }}>Toca para hablar</span>
        </div>

        {/* Plaza Central: Fountain (Flat 2D) */}
        <div style={{
          position: 'absolute',
          top: '230px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          backgroundColor: '#38bdf8',
          border: '4px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          zIndex: 5
        }}>
          ⛲
        </div>

        {/* Trees */}
        <div style={{ position: 'absolute', top: '100px', left: '130px', fontSize: '28px' }}>🌲</div>
        <div style={{ position: 'absolute', top: '340px', left: '20px', fontSize: '28px' }}>🌴</div>
        <div style={{ position: 'absolute', top: '380px', right: '30px', fontSize: '28px' }}>🌳</div>
        <div style={{ position: 'absolute', top: '240px', right: '18px', fontSize: '24px' }}>🌺</div>

        {/* Benches */}
        <div style={{ position: 'absolute', top: '200px', left: '150px', fontSize: '20px' }}>🪵</div>
        <div style={{ position: 'absolute', top: '330px', left: '230px', fontSize: '20px' }}>🪵</div>

        {/* Interactive Suitcases (Visible when activated or testing) */}
        {suitcasesVisible && SUITCASES_DATA.map(suitcase => (
          <SuitcaseSprite key={suitcase.id} suitcase={suitcase} />
        ))}

        {/* NPCs */}
        {Object.values(NPCS_DATA).map(npc => (
          <NPC key={npc.id} npc={npc} isNearby={nearbyNpcId === npc.id} />
        ))}

        {/* Player Character */}
        <Character player={player} />
      </div>

      {/* Mobile Virtual D-Pad & Action Controls Overlay (Flat 2D) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 30
      }}>
        {/* Directional Pad */}
        <div style={{
          pointerEvents: 'auto',
          width: '132px',
          height: '132px',
          position: 'relative'
        }}>
          <button
            onClick={() => moveBy(0, -22, 'up')}
            style={{
              position: 'absolute',
              top: 0,
              left: '44px',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '2px solid #f59e0b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowUp size={22} />
          </button>
          <button
            onClick={() => moveBy(-22, 0, 'left')}
            style={{
              position: 'absolute',
              top: '44px',
              left: 0,
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '2px solid #f59e0b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowL size={22} />
          </button>
          <button
            onClick={() => moveBy(22, 0, 'right')}
            style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '2px solid #f59e0b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowR size={22} />
          </button>
          <button
            onClick={() => moveBy(0, 22, 'down')}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '44px',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '2px solid #f59e0b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowDown size={22} />
          </button>
        </div>

        {/* Action Interact Button (Tapping anywhere opens conversation with nearby NPC or John) */}
        <div style={{ pointerEvents: 'auto' }}>
          <button
            onClick={() => {
              if (nearbyNpcId) {
                openDialogue(nearbyNpcId);
              } else {
                openDialogue('john');
              }
            }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              border: '3px solid #ffffff',
              color: '#78350f',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={22} />
            <span style={{ fontSize: '10px', fontWeight: 800, marginTop: '2px' }}>HABLAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
