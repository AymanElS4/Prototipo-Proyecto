import React, { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { useQuest } from '../../context/QuestContext';
import { Character } from './Character';
import { NPC } from './NPC';
import { SuitcaseSprite } from './SuitcaseSprite';
import { NPCS_DATA } from '../../data/npcsData';
import { SUITCASES_DATA } from '../../data/suitcasesData';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight as ArrowR, ArrowLeft as ArrowL, MessageCircle, MapPin, Sparkles } from 'lucide-react';

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
    setActiveActivityModal('sentence_matching');
  };

  const triggerActivity4 = () => {
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
      backgroundColor: '#cbd5e1',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header Controls (Positioned cleanly under the HUD Quest tracker) */}
      <div style={{
        position: 'absolute',
        top: '98px',
        left: '10px',
        right: '10px',
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
            padding: '5px 10px',
            color: '#78350f',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <ArrowLeft size={14} />
          <span>Ruta</span>
        </button>

        {/* Location pill */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          color: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '3px 8px',
          fontSize: '10px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <MapPin size={11} color="#f59e0b" />
          <span>San Pedro • Plaza Central</span>
        </div>

        {/* Direct quick activity tester pill */}
        <div style={{
          pointerEvents: 'auto',
          backgroundColor: '#ffffff',
          border: '2px solid #b45309',
          borderRadius: '8px',
          padding: '3px 6px',
          display: 'flex',
          gap: '3px',
          fontSize: '10px',
          fontWeight: 800,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={triggerActivity1}
            title="Abrir Actividad 1: Maleta"
            style={{
              background: '#fef3c7',
              border: '1px solid #d97706',
              borderRadius: '5px',
              padding: '2px 5px',
              cursor: 'pointer',
              color: '#92400e',
              fontSize: '10px',
              fontWeight: 700
            }}
          >
            🎒 1
          </button>
          <button
            onClick={triggerActivity2}
            title="Abrir Actividad 2: Sopa de Letras"
            style={{
              background: '#fef3c7',
              border: '1px solid #d97706',
              borderRadius: '5px',
              padding: '2px 5px',
              cursor: 'pointer',
              color: '#92400e',
              fontSize: '10px',
              fontWeight: 700
            }}
          >
            🔤 2
          </button>
          <button
            onClick={triggerActivity3}
            title="Abrir Actividad 3: Unir con Líneas"
            style={{
              background: '#fef3c7',
              border: '1px solid #d97706',
              borderRadius: '5px',
              padding: '2px 5px',
              cursor: 'pointer',
              color: '#92400e',
              fontSize: '10px',
              fontWeight: 700
            }}
          >
            🔗 3
          </button>
          <button
            onClick={triggerActivity4}
            title="Abrir Actividad 4: Speaking Simulado"
            style={{
              background: '#fef3c7',
              border: '1px solid #d97706',
              borderRadius: '5px',
              padding: '2px 5px',
              cursor: 'pointer',
              color: '#92400e',
              fontSize: '10px',
              fontWeight: 700
            }}
          >
            🎙️ 4
          </button>
          <button
            onClick={triggerReward}
            title="Reclamar Llave y Chullo"
            style={{
              background: '#dcfce7',
              border: '1px solid #16a34a',
              borderRadius: '5px',
              padding: '2px 5px',
              cursor: 'pointer',
              color: '#15803d',
              fontSize: '10px',
              fontWeight: 800
            }}
          >
            🗝️
          </button>
        </div>
      </div>

      {/* Town Map Game Surface (Flat 2D Andean Colonial Plaza) */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        style={{
          width: '100%',
          flex: 1,
          minHeight: '520px',
          position: 'relative',
          backgroundColor: '#e2e8f0',
          overflow: 'hidden',
          cursor: 'crosshair'
        }}
      >
        {/* SVG Defs for 2D Cobblestone Pavers & Ground Textures */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            {/* Cobblestone Pavers Grid Pattern */}
            <pattern id="plazaCobblestone" width="24" height="24" patternUnits="userSpaceOnUse">
              <rect width="24" height="24" fill="#e2e8f0" />
              <rect x="1" y="1" width="10" height="10" rx="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="13" y="1" width="10" height="10" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="1" y="13" width="10" height="10" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="13" y="13" width="10" height="10" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            </pattern>

            {/* Clay Roof Tiles Pattern */}
            <pattern id="roofTiles" width="16" height="10" patternUnits="userSpaceOnUse">
              <rect width="16" height="10" fill="#c2410c" />
              <path d="M 0 10 Q 8 2 16 10" fill="#ea580c" stroke="#9a3412" strokeWidth="1" />
            </pattern>

            {/* Striped Aguayo Fabric Pattern */}
            <pattern id="aguayoStripes" width="24" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="20" fill="#dc2626" />
              <rect x="4" y="0" width="4" height="20" fill="#f59e0b" />
              <rect x="8" y="0" width="4" height="20" fill="#16a34a" />
              <rect x="12" y="0" width="4" height="20" fill="#0284c7" />
              <rect x="16" y="0" width="4" height="20" fill="#7c3aed" />
              <rect x="20" y="0" width="4" height="20" fill="#ea580c" />
            </pattern>
          </defs>
        </svg>

        {/* 1. Ground Layer: Cobblestone Pavers */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#94a3b8 0.75px, transparent 0.75px), radial-gradient(#cbd5e1 0.75px, #f1f5f9 0.75px)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px',
          pointerEvents: 'none'
        }} />

        {/* 2. North Town Backdrop: Colonial Mountain Skyline & Church Facade */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '115px',
          pointerEvents: 'none',
          zIndex: 4
        }}>
          {/* Distant Mountain Peak */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '70px' }} preserveAspectRatio="none" viewBox="0 0 460 70">
            <polygon points="0,50 80,10 160,45 230,15 320,40 400,20 460,50 460,70 0,70" fill="#94a3b8" opacity="0.4" />
            <polygon points="0,58 70,28 140,55 220,30 300,52 380,32 460,55 460,70 0,70" fill="#64748b" opacity="0.3" />
          </svg>

          {/* Colonial Historic Facades Wall */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '48px',
            backgroundColor: '#ffffff',
            borderBottom: '3px solid #78716c',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '0 8px'
          }}>
            {/* West House Gable */}
            <div style={{
              width: '100px',
              height: '38px',
              backgroundColor: '#fef3c7',
              borderTop: '4px solid #b45309',
              borderLeft: '2px solid #d97706',
              borderRight: '2px solid #d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 4px'
            }}>
              <div style={{ width: '14px', height: '18px', backgroundColor: '#78350f', borderRadius: '3px' }} />
              <div style={{ width: '14px', height: '18px', backgroundColor: '#38bdf8', border: '1px solid #78350f', borderRadius: '2px' }} />
            </div>

            {/* Central Church Belfry / Campanario */}
            <div style={{
              position: 'relative',
              top: '-16px',
              width: '90px',
              height: '64px',
              backgroundColor: '#f8fafc',
              border: '2px solid #64748b',
              borderTopLeftRadius: '45px',
              borderTopRightRadius: '45px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: '4px'
            }}>
              <span style={{ fontSize: '11px', color: '#b45309', fontWeight: 900 }}>✝️</span>
              {/* Belfry Window with Bell */}
              <div style={{
                width: '32px',
                height: '30px',
                backgroundColor: '#334155',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                border: '2px solid #94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px'
              }}>
                🔔
              </div>
            </div>

            {/* East Wall Connection to Tourist Office */}
            <div style={{
              width: '110px',
              height: '38px',
              backgroundColor: '#f1f5f9',
              borderTop: '4px solid #b45309',
              borderRight: '2px solid #94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 6px'
            }}>
              <div style={{ width: '16px', height: '18px', backgroundColor: '#38bdf8', border: '1px solid #475569', borderRadius: '2px' }} />
              <div style={{ width: '16px', height: '18px', backgroundColor: '#38bdf8', border: '1px solid #475569', borderRadius: '2px' }} />
            </div>
          </div>
        </div>

        {/* 3. North East: Oficina de Información Turística (Don Mateo) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            openDialogue('mateo');
          }}
          style={{
            position: 'absolute',
            top: '44px',
            right: '12px',
            width: '155px',
            height: '100px',
            backgroundColor: '#ffffff',
            border: '2px solid #064e3b',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            zIndex: 10,
            overflow: 'hidden'
          }}
          title="Toca para hablar con Don Mateo"
        >
          {/* Terracotta Shingle Roof */}
          <div style={{
            height: '24px',
            backgroundColor: '#c2410c',
            borderBottom: '3px solid #9a3412',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fef3c7',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            🏛️ TURISMO SAN PEDRO
          </div>

          {/* Building Facade */}
          <div style={{
            flex: 1,
            backgroundColor: '#f0fdf4',
            padding: '4px 6px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Top Windows & Balcony */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                width: '26px',
                height: '26px',
                backgroundColor: '#38bdf8',
                border: '2px solid #78350f',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                ℹ️
              </div>
              <div style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: 800
              }}>
                DON MATEO
              </div>
              <div style={{
                width: '26px',
                height: '26px',
                backgroundColor: '#38bdf8',
                border: '2px solid #78350f',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px'
              }}>
                🇵🇪
              </div>
            </div>

            {/* Wooden Colonial Double Door */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '36px',
                height: '32px',
                backgroundColor: '#78350f',
                border: '2px solid #451a03',
                borderTopLeftRadius: '6px',
                borderTopRightRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '2px'
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '1px', height: '100%', backgroundColor: '#451a03' }} />
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              </div>
            </div>

            {/* Click to talk badge */}
            <div style={{
              textAlign: 'center',
              fontSize: '8px',
              color: '#065f46',
              fontWeight: 700
            }}>
              👉 Toca para entrar / hablar
            </div>
          </div>
        </div>

        {/* 4. West: Puesto de Artesanías de Doña Rosa */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            openDialogue('rosa');
          }}
          style={{
            position: 'absolute',
            top: '135px',
            left: '10px',
            width: '120px',
            height: '92px',
            backgroundColor: '#fffbeb',
            border: '2px solid #92400e',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            zIndex: 10,
            overflow: 'hidden'
          }}
          title="Toca para hablar con Doña Rosa"
        >
          {/* Traditional Scalloped Aguayo Striped Awning */}
          <div style={{
            height: '26px',
            backgroundImage: 'repeating-linear-gradient(90deg, #dc2626, #dc2626 12px, #f59e0b 12px, #f59e0b 24px, #16a34a 24px, #16a34a 36px, #0284c7 36px, #0284c7 48px)',
            borderBottom: '3px solid #78350f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 800,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
          }}>
            🧶 ARTESANÍAS
          </div>

          {/* Wooden Market Stall Frame */}
          <div style={{
            flex: 1,
            backgroundColor: '#fef3c7',
            padding: '3px 6px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px' }}>🧵</span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#92400e' }}>DOÑA ROSA</span>
              <span style={{ fontSize: '15px' }}>🪡</span>
            </div>

            {/* Counter with Woven Textiles */}
            <div style={{
              height: '24px',
              backgroundColor: '#b45309',
              border: '2px solid #78350f',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 4px',
              fontSize: '12px'
            }}>
              <span>🧣</span>
              <span>🧤</span>
              <span>🧦</span>
            </div>

            <div style={{ textAlign: 'center', fontSize: '8px', color: '#92400e', fontWeight: 700 }}>
              👉 Toca para conversar
            </div>
          </div>
        </div>

        {/* 5. Plaza Landscaped Gardens (4 Symmetrical Green Quadrants with Stone Curbs) */}
        {/* NW Garden Bed (Behind Rosa's stall) */}
        <div style={{
          position: 'absolute',
          top: '232px',
          left: '14px',
          width: '105px',
          height: '60px',
          backgroundColor: '#22c55e',
          border: '3px solid #15803d',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '4px',
          zIndex: 3
        }}>
          <span style={{ fontSize: '14px' }}>🌺</span>
          <span style={{ fontSize: '16px' }}>🌳</span>
          <span style={{ fontSize: '14px' }}>🌼</span>
          <span style={{ fontSize: '14px' }}>🌺</span>
        </div>

        {/* NE Garden Bed (Next to Tourist Office) */}
        <div style={{
          position: 'absolute',
          top: '150px',
          right: '14px',
          width: '110px',
          height: '65px',
          backgroundColor: '#22c55e',
          border: '3px solid #15803d',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '4px',
          zIndex: 3
        }}>
          <span style={{ fontSize: '16px' }}>🌲</span>
          <span style={{ fontSize: '14px' }}>🌸</span>
          <span style={{ fontSize: '14px' }}>🌺</span>
          <span style={{ fontSize: '16px' }}>🌳</span>
        </div>

        {/* SW Garden Bed (Southwest corner) */}
        <div style={{
          position: 'absolute',
          top: '345px',
          left: '16px',
          width: '115px',
          height: '65px',
          backgroundColor: '#22c55e',
          border: '3px solid #15803d',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '4px',
          zIndex: 3
        }}>
          <span style={{ fontSize: '16px' }}>🌴</span>
          <span style={{ fontSize: '14px' }}>🌼</span>
          <span style={{ fontSize: '14px' }}>🌺</span>
          <span style={{ fontSize: '16px' }}>🌲</span>
        </div>

        {/* SE Garden Bed (Southeast corner) */}
        <div style={{
          position: 'absolute',
          top: '345px',
          right: '16px',
          width: '115px',
          height: '65px',
          backgroundColor: '#22c55e',
          border: '3px solid #15803d',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '4px',
          zIndex: 3
        }}>
          <span style={{ fontSize: '16px' }}>🌳</span>
          <span style={{ fontSize: '14px' }}>🌺</span>
          <span style={{ fontSize: '14px' }}>🌼</span>
          <span style={{ fontSize: '16px' }}>🌲</span>
        </div>

        {/* 6. Central Plaza Fountain (Colonial Carved Stone Fountain) */}
        <div style={{
          position: 'absolute',
          top: '225px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          backgroundColor: '#94a3b8',
          border: '4px solid #64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}>
          {/* Inner Cobblestone Rim */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#0284c7',
            border: '4px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Water Ripple Ring */}
            <div style={{
              position: 'absolute',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '2px dashed #38bdf8',
              opacity: 0.8
            }} />
            
            {/* Central Water Spout */}
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              ⛲
            </div>
          </div>
        </div>

        {/* 7. Plaza Streetlamps (Faroles Coloniales) */}
        {/* Lamp NW */}
        <div style={{ position: 'absolute', top: '165px', left: '145px', fontSize: '18px', zIndex: 6 }} title="Farol colonial">
          🏮
        </div>
        {/* Lamp NE */}
        <div style={{ position: 'absolute', top: '165px', right: '140px', fontSize: '18px', zIndex: 6 }} title="Farol colonial">
          🏮
        </div>
        {/* Lamp SW */}
        <div style={{ position: 'absolute', top: '320px', left: '145px', fontSize: '18px', zIndex: 6 }} title="Farol colonial">
          🏮
        </div>
        {/* Lamp SE */}
        <div style={{ position: 'absolute', top: '320px', right: '140px', fontSize: '18px', zIndex: 6 }} title="Farol colonial">
          🏮
        </div>

        {/* 8. Colonial Park Benches (Bancas de madera de la plaza) */}
        <div style={{
          position: 'absolute',
          top: '298px',
          left: '135px',
          backgroundColor: '#78350f',
          border: '2px solid #451a03',
          borderRadius: '4px',
          padding: '2px 8px',
          color: '#fef3c7',
          fontSize: '10px',
          fontWeight: 700,
          zIndex: 6
        }}>
          🪵 Banca
        </div>
        <div style={{
          position: 'absolute',
          top: '298px',
          right: '130px',
          backgroundColor: '#78350f',
          border: '2px solid #451a03',
          borderRadius: '4px',
          padding: '2px 8px',
          color: '#fef3c7',
          fontSize: '10px',
          fontWeight: 700,
          zIndex: 6
        }}>
          🪵 Banca
        </div>

        {/* 9. South Town Portal / Exit towards Valley Route */}
        <div style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid #78350f',
          borderRadius: '12px',
          padding: '2px 10px',
          fontSize: '10px',
          fontWeight: 800,
          color: '#78350f',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          <span>⬇️ Camino a la Ruta del Valle</span>
        </div>

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
