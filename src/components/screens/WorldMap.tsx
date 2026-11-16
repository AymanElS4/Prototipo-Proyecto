import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { useQuest } from '../../context/QuestContext';
import { ArrowLeft, Lock, Unlock, Key, ArrowUp, ArrowDown, ArrowRight as ArrowR, ArrowLeft as ArrowL, Play, Sparkles, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CityNode {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  x: number;
  y: number;
  color: string;
  description: string;
}

const CITIES: CityNode[] = [
  {
    id: 1,
    name: 'San Pedro de las Nubes',
    subtitle: 'Módulo 1: Objetos perdidos y saludos',
    icon: '🏛️',
    x: 80,
    y: 430,
    color: '#15803d',
    description: 'Pueblo colonial andino. Ayuda a Mr. John a encontrar su maleta azul con círculo.'
  },
  {
    id: 2,
    name: 'Mercado de Artesanías',
    subtitle: 'Módulo 2: Precios y transacciones',
    icon: '🧶',
    x: 100,
    y: 260,
    color: '#b45309',
    description: 'Pabellón textil tradicional. Desbloquéalo usando la Llave Dorada de San Pedro.'
  },
  {
    id: 3,
    name: 'Estación del Tren Andino',
    subtitle: 'Módulo 3: Horarios y boletos',
    icon: '🚂',
    x: 320,
    y: 350,
    color: '#475569',
    description: 'Andén ferroviario hacia las alturas del valle.'
  },
  {
    id: 4,
    name: 'Casona Gastronómica',
    subtitle: 'Módulo 4: Platos típicos y pedidos',
    icon: '🍲',
    x: 230,
    y: 190,
    color: '#475569',
    description: 'Restaurante tradicional andino.'
  },
  {
    id: 5,
    name: 'Mirador del Cóndor',
    subtitle: 'Módulo 5: Clima y montaña',
    icon: '🏔️',
    x: 90,
    y: 80,
    color: '#475569',
    description: 'Ruta alta de senderismo y primeros auxilios.'
  },
  {
    id: 6,
    name: 'El Gran Santuario',
    subtitle: 'Módulo 6: Tour guiado final',
    icon: '👑',
    x: 320,
    y: 70,
    color: '#475569',
    description: 'Templo ancestral y certificación oficial de guía.'
  }
];

export const WorldMap: React.FC = () => {
  const { modules, unlockModule, setScreen, setCurrentModuleId, showFeedback } = useGame();
  const { player, hasItem } = usePlayer();
  const { quest } = useQuest();

  // Local avatar position on the 2D Overworld Map (starts near City 1: San Pedro)
  const [playerPos, setPlayerPos] = useState({ x: 130, y: 440 });
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [isMoving, setIsMoving] = useState(false);
  const [showModule2Modal, setShowModule2Modal] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);

  // Check if player has the golden key from Module 1
  const hasGoldenKey = hasItem('golden_key_module1') || 
                       player.inventory.some(i => i.id.includes('key') || i.id.includes('golden')) ||
                       quest.status === 'completed' ||
                       quest.currentStepIndex >= 4;

  const isModule2Unlocked = modules.find(m => m.id === 2)?.isUnlocked || false;

  // Check proximity to cities
  const getNearbyCity = () => {
    for (const city of CITIES) {
      const dist = Math.hypot(playerPos.x - city.x, playerPos.y - city.y);
      if (dist < 65) return city;
    }
    return null;
  };

  const nearbyCity = getNearbyCity();

  // Move player on the 2D world map
  const movePlayer = (dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => {
    setDirection(dir);
    setIsMoving(true);
    setPlayerPos(prev => {
      const nextX = Math.max(24, Math.min(410, prev.x + dx));
      const nextY = Math.max(30, Math.min(520, prev.y + dy));
      return { x: nextX, y: nextY };
    });
    setTimeout(() => setIsMoving(false), 120);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showModule2Modal) return;

      const step = 20;
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          movePlayer(0, -step, 'up');
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          movePlayer(0, step, 'down');
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          movePlayer(-step, 0, 'left');
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          movePlayer(step, 0, 'right');
          break;
        case 'e':
          e.preventDefault();
          if (nearbyCity) {
            handleInteractWithCity(nearbyCity);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, nearbyCity, showModule2Modal, hasGoldenKey, isModule2Unlocked]);

  // Click on map to move player there
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showModule2Modal) return;
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setPlayerPos({ x: Math.round(clickX), y: Math.round(clickY) });
  };

  // Interaction logic for cities on the Overworld Map
  const handleInteractWithCity = (city: CityNode) => {
    if (city.id === 1) {
      // Module 1 is fully interactive! Enters the town map
      setCurrentModuleId(1);
      setScreen('town_map');
      return;
    }

    if (city.id === 2) {
      // Module 2 logic:
      // If player has the key, it unlocks!
      if (hasGoldenKey) {
        if (!isModule2Unlocked) {
          // Unlock Module 2 with celebration!
          unlockModule(2);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.5 }
            });
          } catch {}
        }
        // Show partial interaction modal for Module 2
        setShowModule2Modal(true);
      } else {
        // Does not have the key -> Keep locked with padlock feedback
        showFeedback({
          title: 'Módulo 2 Bloqueado 🔒',
          message: 'Este camino hacia el Mercado de Artesanías está cerrado con un candado sagrado. Para abrirlo, debes completar todas las actividades del Módulo 1 y recibir la Llave Dorada de manos de Don Mateo.',
          isSuccess: false,
          tip: 'Ve a San Pedro de las Nubes (Módulo 1) y ayuda a Mr. John a encontrar su maleta.'
        });
      }
      return;
    }

    // Modules 3 to 6 are locked and not interactive as instructed
    showFeedback({
      title: `${city.name} Bloqueado 🔒`,
      message: `El ${city.subtitle.split(':')[0]} está cerrado con candado. Primero debes completar y desbloquear los módulos anteriores en orden.`,
      isSuccess: false,
      tip: 'Completa el Módulo 1 para obtener la Llave del Valle.'
    });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      flex: 1,
      minHeight: '560px',
      backgroundColor: '#064e3b',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header Bar */}
      <div style={{
        padding: '12px 14px',
        backgroundColor: '#065f46',
        borderBottom: '2px solid #047857',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 30
      }}>
        <button
          onClick={() => setScreen('main_menu')}
          style={{
            backgroundColor: '#047857',
            border: '1px solid #10b981',
            borderRadius: '6px',
            color: '#ffffff',
            padding: '5px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 800,
            fontSize: '12px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Inicio</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
            Mapa del Valle Andino
          </h2>
          <span style={{ fontSize: '10px', color: '#a7f3d0' }}>
            Explora caminando y toca las ciudades
          </span>
        </div>

        {/* Golden Key Status Badge */}
        <div style={{
          backgroundColor: hasGoldenKey ? '#dcfce7' : '#334155',
          border: hasGoldenKey ? '1px solid #16a34a' : '1px solid #64748b',
          borderRadius: '8px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 800,
          color: hasGoldenKey ? '#15803d' : '#cbd5e1'
        }}>
          <span>🗝️</span>
          <span>{hasGoldenKey ? 'Llave OK' : 'Sin Llave'}</span>
        </div>
      </div>

      {/* Explorable 2D Overworld Landscape Canvas */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        style={{
          flex: 1,
          width: '100%',
          minHeight: '520px',
          position: 'relative',
          backgroundColor: '#15803d', // Andean grass green
          backgroundImage: `
            radial-gradient(#166534 15%, transparent 16%),
            radial-gradient(#14532d 15%, transparent 16%)
          `,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
          overflow: 'hidden',
          cursor: 'crosshair'
        }}
      >
        {/* Winding Stone Road SVG connecting the 6 cities */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2
        }}>
          {/* Path: City 1 -> City 2 -> City 4 -> City 3 -> City 6 -> City 5 */}
          <path
            d="M 80 430 Q 60 340 100 260 T 230 190 T 320 350 T 320 70 T 90 80"
            fill="none"
            stroke="#d4d4d8"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 80 430 Q 60 340 100 260 T 230 190 T 320 350 T 320 70 T 90 80"
            fill="none"
            stroke="#78716c"
            strokeWidth="14"
            strokeDasharray="8 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Andean Scenery (Mountains, Trees, Llamas) */}
        <div style={{ position: 'absolute', top: '10px', left: '170px', fontSize: '24px' }}>🏔️</div>
        <div style={{ position: 'absolute', top: '140px', left: '30px', fontSize: '20px' }}>🌲</div>
        <div style={{ position: 'absolute', top: '350px', left: '180px', fontSize: '20px' }}>🦙</div>
        <div style={{ position: 'absolute', top: '240px', right: '40px', fontSize: '20px' }}>🌲</div>
        <div style={{ position: 'absolute', top: '480px', right: '80px', fontSize: '20px' }}>🌾</div>

        {/* 6 Cities Landmarks */}
        {CITIES.map((city) => {
          const isCity2 = city.id === 2;
          const isUnlocked = city.id === 1 || (isCity2 && isModule2Unlocked);
          const isNear = nearbyCity?.id === city.id;

          return (
            <div
              key={city.id}
              onClick={(e) => {
                e.stopPropagation();
                handleInteractWithCity(city);
              }}
              title={`Ciudad: ${city.name}`}
              style={{
                position: 'absolute',
                left: `${city.x}px`,
                top: `${city.y}px`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              {/* Floating Interaction Prompt when player is close */}
              {isNear && (
                <div style={{
                  backgroundColor: isUnlocked ? '#16a34a' : (isCity2 && hasGoldenKey ? '#f59e0b' : '#dc2626'),
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: '10px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {city.id === 1 && <span>[E] Entrar a San Pedro</span>}
                  {isCity2 && !isUnlocked && hasGoldenKey && <span>[E] ¡Usar Llave Dorada! 🗝️</span>}
                  {isCity2 && isUnlocked && <span>[E] Explorar Mercado</span>}
                  {isCity2 && !isUnlocked && !hasGoldenKey && <span>🔒 Requiere Llave</span>}
                  {city.id > 2 && <span>🔒 Bloqueado</span>}
                </div>
              )}

              {/* 2D City Landmark Building Card */}
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '14px',
                backgroundColor: isUnlocked ? '#ffffff' : '#1e293b',
                border: isUnlocked ? '3px solid #16a34a' : '3px solid #64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{ fontSize: '32px' }}>{city.icon}</span>

                {/* Padlock Icon (Shown if locked, absent if unlocked) */}
                {!isUnlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#dc2626',
                    border: '2px solid #ffffff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Lock size={13} />
                  </div>
                )}

                {/* Unlocked green badge if unlocked */}
                {isUnlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#16a34a',
                    border: '2px solid #ffffff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Unlock size={13} />
                  </div>
                )}
              </div>

              {/* City Label */}
              <div style={{
                marginTop: '4px',
                backgroundColor: 'rgba(15, 23, 42, 0.88)',
                color: isUnlocked ? '#fef3c7' : '#94a3b8',
                border: isUnlocked ? '1px solid #f59e0b' : '1px solid #475569',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}>
                Módulo {city.id}: {city.name.split(' ')[0]}
              </div>
            </div>
          );
        })}

        {/* Player Character Sprite Walking on the Overworld Map */}
        <div
          style={{
            position: 'absolute',
            left: `${playerPos.x}px`,
            top: `${playerPos.y}px`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 25,
            transition: 'left 0.1s linear, top 0.1s linear',
            pointerEvents: 'none'
          }}
        >
          {/* Player Name */}
          <div style={{
            backgroundColor: '#0f172a',
            color: '#fef3c7',
            padding: '1px 6px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 800,
            marginBottom: '2px',
            border: '1px solid #f59e0b'
          }}>
            {player.customization.name}
          </div>

          {/* Sprite Body */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: player.customization.outfitColor,
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            position: 'relative',
            transform: isMoving ? 'scale(1.1)' : 'none'
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

            {/* Direction dot */}
            <div style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              top: direction === 'up' ? '2px' : direction === 'down' ? 'auto' : '18px',
              bottom: direction === 'down' ? '2px' : 'auto',
              left: direction === 'left' ? '2px' : direction === 'right' ? 'auto' : '18px',
              right: direction === 'right' ? '2px' : 'auto'
            }} />
          </div>
        </div>
      </div>

      {/* Mobile Virtual D-Pad & Action Controls Overlay (Overworld) */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '14px',
        right: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 35
      }}>
        {/* Directional Pad */}
        <div style={{
          pointerEvents: 'auto',
          width: '126px',
          height: '126px',
          position: 'relative'
        }}>
          <button
            onClick={() => movePlayer(0, -24, 'up')}
            style={{
              position: 'absolute',
              top: 0,
              left: '42px',
              width: '42px',
              height: '42px',
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
            <ArrowUp size={20} />
          </button>
          <button
            onClick={() => movePlayer(-24, 0, 'left')}
            style={{
              position: 'absolute',
              top: '42px',
              left: 0,
              width: '42px',
              height: '42px',
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
            <ArrowL size={20} />
          </button>
          <button
            onClick={() => movePlayer(24, 0, 'right')}
            style={{
              position: 'absolute',
              top: '42px',
              right: 0,
              width: '42px',
              height: '42px',
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
            <ArrowR size={20} />
          </button>
          <button
            onClick={() => movePlayer(0, 24, 'down')}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '42px',
              width: '42px',
              height: '42px',
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
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Action Button: Enters or Interacts with City */}
        <div style={{ pointerEvents: 'auto' }}>
          <button
            onClick={() => {
              if (nearbyCity) {
                handleInteractWithCity(nearbyCity);
              } else {
                // If not near any city, interact with City 1 by default
                handleInteractWithCity(CITIES[0]);
              }
            }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: nearbyCity ? '#16a34a' : '#f59e0b',
              border: '3px solid #ffffff',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Play size={20} />
            <span style={{ fontSize: '9px', fontWeight: 800, marginTop: '2px' }}>
              {nearbyCity?.id === 1 ? 'ENTRAR' : 'EXPLORAR'}
            </span>
          </button>
        </div>
      </div>

      {/* Module 2 Partial Interaction Modal */}
      {showModule2Modal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
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
              maxWidth: '380px',
              padding: '20px',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                border: '3px solid #16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                🧶
              </div>
            </div>

            <div>
              <span style={{
                backgroundColor: '#dcfce7',
                color: '#15803d',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                ¡Módulo 2 Desbloqueado!
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '6px' }}>
                Mercado de Artesanías de Doña Rosa
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.45' }}>
              ¡Has usado la <strong>Llave Dorada de San Pedro</strong> con éxito! El candado ha sido abierto.
            </p>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '12px',
              color: '#334155',
              textAlign: 'left'
            }}>
              🧑🏽‍🌾 <strong>Don Fernando (Guardián del Mercado):</strong>
              <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                "Allillanchu, joven guía. Al completar el Módulo 1 has probado tu valor. En esta próxima aventura aprenderás a negociar artesanías en inglés: <em>'How much is it?'</em>, números y colores de lana de alpaca."
              </div>
            </div>

            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '11px',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={16} />
              <span>Interacción parcial de prueba completada para el Módulo 2.</span>
            </div>

            <button
              onClick={() => setShowModule2Modal(false)}
              className="rpg-btn rpg-btn-green"
              style={{ width: '100%', padding: '10px', fontSize: '13px' }}
            >
              <span>Volver al Mapa del Valle</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
