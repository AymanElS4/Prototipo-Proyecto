import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { useQuest } from '../../context/QuestContext';
import { ArrowLeft, Lock, Unlock, CheckCircle2, ChevronRight, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CityNode {
  id: number;
  name: string;
  subtitle: string;
  levelTitle: string;
  xPercent: number; // percentage coordinate on map (0-100)
  yPercent: number; // percentage coordinate on map (0-100)
  buildingImg: string;
  buildingWidth: number;
  description: string;
}

const CITIES: CityNode[] = [
  {
    id: 1,
    name: 'Aeropuerto',
    subtitle: 'Nivel 1: Saludos, Mochila y Speaking',
    levelTitle: 'Nivel 1: Aeropuerto',
    xPercent: 18,
    yPercent: 74,
    buildingImg: '/assets/farm_rpg/sliced/building_1.png',
    buildingWidth: 64,
    description: 'Terminal del aeropuerto. Interactúa con el turista, recupera su mochila en la faja de equipajes y supera las 4 actividades secuenciales.'
  },
  {
    id: 2,
    name: 'Mercado Textil',
    subtitle: 'Nivel 2: Precios y Transacciones',
    levelTitle: 'Nivel 2: Mercado',
    xPercent: 22,
    yPercent: 44,
    buildingImg: '/assets/farm_rpg/sliced/building_2.png',
    buildingWidth: 64,
    description: 'Pabellón artesanal tradicional donde se negocian artesanías en inglés.'
  },
  {
    id: 3,
    name: 'Estación Tren',
    subtitle: 'Nivel 3: Horarios y Boletos',
    levelTitle: 'Nivel 3: Tren Andino',
    xPercent: 48,
    yPercent: 62,
    buildingImg: '/assets/tiny_ranch/sliced/structures/barn_full.png',
    buildingWidth: 52,
    description: 'Andén ferroviario histórico hacia las alturas del valle.'
  },
  {
    id: 4,
    name: 'Casona',
    subtitle: 'Nivel 4: Platos Típicos',
    levelTitle: 'Nivel 4: Casona',
    xPercent: 48,
    yPercent: 32,
    buildingImg: '/assets/farm_rpg/sliced/building_3.png',
    buildingWidth: 60,
    description: 'Restaurante tradicional donde aprenderás expresiones gastronómicas.'
  },
  {
    id: 5,
    name: 'Mirador Cóndor',
    subtitle: 'Nivel 5: Clima y Senderismo',
    levelTitle: 'Nivel 5: Mirador',
    xPercent: 80,
    yPercent: 46,
    buildingImg: '/assets/tiny_ranch/sliced/structures/windmill_full.png',
    buildingWidth: 52,
    description: 'Ruta alta de senderismo, vocabulario de clima y primeros auxilios.'
  },
  {
    id: 6,
    name: 'El Santuario',
    subtitle: 'Nivel 6: Tour Guiado Final',
    levelTitle: 'Nivel 6: Santuario',
    xPercent: 78,
    yPercent: 18,
    buildingImg: '/assets/tiny_ranch/sliced/structures/house_blue_full.png',
    buildingWidth: 54,
    description: 'Templo ancestral donde presentarás tu tour guiado completo en inglés.'
  }
];

export const WorldMap: React.FC = () => {
  const { modules, unlockModule, setScreen, setCurrentModuleId, showFeedback } = useGame();
  const { player, hasItem } = usePlayer();
  const { quest } = useQuest();

  const [selectedCity, setSelectedCity] = useState<CityNode>(CITIES[0]);
  const [showModule2Modal, setShowModule2Modal] = useState(false);

  // Check if player has the golden key from Module 1
  const hasGoldenKey = hasItem('golden_key_module1') || 
                       player.inventory.some(i => i.id.includes('key') || i.id.includes('golden')) ||
                       quest.status === 'completed' ||
                       quest.currentStepIndex >= 4;

  const isModule2Unlocked = modules.find(m => m.id === 2)?.isUnlocked || false;

  const handleCityClick = (city: CityNode) => {
    setSelectedCity(city);

    // If clicking on Level 1, enter directly to Airport!
    if (city.id === 1) {
      setCurrentModuleId(1);
      setScreen('town_map');
      return;
    }

    // If clicking on Level 2
    if (city.id === 2) {
      if (hasGoldenKey) {
        if (!isModule2Unlocked) {
          unlockModule(2);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.5 }
            });
          } catch {}
        }
        setShowModule2Modal(true);
      } else {
        showFeedback({
          title: '¡Inténtalo de nuevo! / Try Again!',
          message: 'Este camino hacia el Mercado está cerrado con un candado sagrado. Para abrirlo, completa las 4 actividades del Nivel 1 en el Aeropuerto.',
          isSuccess: false,
          tip: 'Toca el Nivel 1 (Aeropuerto) y ayuda al turista con su mochila.'
        });
      }
      return;
    }

    // Locked levels (3 to 6)
    showFeedback({
      title: '¡Inténtalo de nuevo! / Try Again!',
      message: `El ${city.levelTitle} está cerrado con candado. Completa los niveles anteriores en orden para desbloquearlo.`,
      isSuccess: false,
      tip: 'Completa el Nivel 1 para avanzar en el Valle.'
    });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      flex: 1,
      minHeight: '100%',
      backgroundColor: '#0f172a',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header Bar exclusivo del Mapa de Niveles (Limpio y alineado) */}
      <div style={{
        padding: '12px 14px',
        backgroundColor: '#1e293b',
        borderBottom: '2px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 30,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Botón Volver con Estilo de Piedra */}
        <button
          onClick={() => setScreen('main_menu')}
          className="stone-btn"
          style={{
            padding: '7px 12px',
            fontSize: '11px',
            borderRadius: '10px'
          }}
        >
          <ArrowLeft size={15} />
          <span>Inicio</span>
        </button>

        {/* Título Central */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '13.5px', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '0.5px' }}>
            MAPA DE NIVELES
          </h2>
          <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>
            Toca el Nivel 1 (Aeropuerto) para jugar
          </span>
        </div>

        {/* Badge Llave Dorada / Estado */}
        <div style={{
          backgroundColor: hasGoldenKey ? '#14532d' : '#0f172a',
          border: hasGoldenKey ? '1.5px solid #22c55e' : '1.5px solid #475569',
          borderRadius: '10px',
          padding: '5px 9px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 800,
          color: hasGoldenKey ? '#86efac' : '#94a3b8'
        }}>
          <span>{hasGoldenKey ? '🗝️' : '🔒'}</span>
          <span>{hasGoldenKey ? 'Llave OK' : 'Bloqueado'}</span>
        </div>
      </div>

      {/* Full Scenic Overworld Map */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#166534',
        backgroundImage: `
          radial-gradient(#14532d 20%, transparent 21%),
          radial-gradient(#0f4223 20%, transparent 21%)
        `,
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px',
        overflow: 'hidden'
      }}>
        {/* Winding stone path SVG connecting cities directly */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2
        }}>
          <path
            d="M 18% 74% Q 12% 58% 22% 44% T 48% 32% T 48% 62% T 80% 46% T 78% 18%"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.9}
          />
          <path
            d="M 18% 74% Q 12% 58% 22% 44% T 48% 32% T 48% 62% T 80% 46% T 78% 18%"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="10"
            strokeDasharray="6 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Natural Farm RPG scenery */}
        <div style={{ position: 'absolute', top: '10%', left: '32%', zIndex: 3, pointerEvents: 'none' }}>
          <img src="/assets/farm_rpg/sliced/tree_spring.png" alt="" style={{ width: '42px', height: '62px', imageRendering: 'pixelated', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.4))' }} />
        </div>
        <div style={{ position: 'absolute', top: '56%', left: '8%', zIndex: 3, pointerEvents: 'none' }}>
          <img src="/assets/farm_rpg/sliced/tree_fall.png" alt="" style={{ width: '38px', height: '58px', imageRendering: 'pixelated', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.4))' }} />
        </div>
        <div style={{ position: 'absolute', top: '78%', left: '46%', zIndex: 3, pointerEvents: 'none' }}>
          <img src="/assets/farm_rpg/sliced/tree_spring.png" alt="" style={{ width: '40px', height: '60px', imageRendering: 'pixelated', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.4))' }} />
        </div>
        <div style={{ position: 'absolute', top: '36%', right: '6%', zIndex: 3, pointerEvents: 'none' }}>
          <img src="/assets/farm_rpg/sliced/tree_fall.png" alt="" style={{ width: '38px', height: '58px', imageRendering: 'pixelated', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.4))' }} />
        </div>

        {/* Animals & Chest */}
        <div style={{ position: 'absolute', top: '82%', left: '34%', zIndex: 3, pointerEvents: 'none' }}>
          <img src="/assets/farm_rpg/sliced/cow.png" alt="" style={{ width: '36px', height: '36px', imageRendering: 'pixelated', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }} />
        </div>
        <div style={{ position: 'absolute', top: '38%', left: '36%', zIndex: 3, pointerEvents: 'none' }}>
          <img src="/assets/farm_rpg/sliced/chick.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated' }} />
        </div>
        <div style={{ position: 'absolute', top: '6%', left: '58%', zIndex: 3, pointerEvents: 'none' }}>
          <img src="/assets/farm_rpg/sliced/chicken.png" alt="" style={{ width: '22px', height: '22px', imageRendering: 'pixelated' }} />
        </div>
        <div style={{ position: 'absolute', top: '68%', right: '22%', zIndex: 3, pointerEvents: 'none' }}>
          <img src="/assets/farm_rpg/sliced/chest_closed.png" alt="" style={{ width: '24px', height: '24px', imageRendering: 'pixelated', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' }} />
        </div>

        {/* Mountain background emojis */}
        <div style={{ position: 'absolute', top: '4%', left: '12%', fontSize: '24px', opacity: 0.8, pointerEvents: 'none' }}>🏔️</div>
        <div style={{ position: 'absolute', top: '16%', right: '32%', fontSize: '26px', opacity: 0.8, pointerEvents: 'none' }}>🏔️</div>

        {/* Pure Pixel Art Level Objects */}
        {CITIES.map((city) => {
          const isSelected = selectedCity.id === city.id;
          const isCity2 = city.id === 2;
          const isUnlocked = city.id === 1 || (isCity2 && isModule2Unlocked);
          const canUnlockNow = isCity2 && !isUnlocked && hasGoldenKey;

          return (
            <div
              key={city.id}
              onClick={() => handleCityClick(city)}
              style={{
                position: 'absolute',
                left: `${city.xPercent}%`,
                top: `${city.yPercent}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: isSelected ? 25 : 15,
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -54%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              {/* Level indicator pill */}
              <div style={{
                backgroundColor: isUnlocked ? '#16a34a' : canUnlockNow ? '#eab308' : '#334155',
                color: '#ffffff',
                border: '1.5px solid #ffffff',
                borderRadius: '10px',
                padding: '2px 7px',
                fontSize: '10px',
                fontWeight: 900,
                marginBottom: '2px',
                boxShadow: isUnlocked ? '0 0 10px rgba(34, 197, 94, 0.6)' : '0 2px 4px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                whiteSpace: 'nowrap'
              }}>
                <Star size={10} fill={isUnlocked ? '#fef08a' : 'none'} />
                <span>Nivel {city.id}</span>
              </div>

              {/* Sprite with Floating lock/unlock */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={city.buildingImg}
                  alt={city.name}
                  style={{
                    width: `${city.buildingWidth}px`,
                    height: 'auto',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    filter: isUnlocked || canUnlockNow 
                      ? 'drop-shadow(0 6px 8px rgba(0,0,0,0.5))' 
                      : 'grayscale(60%) opacity(75%) drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
                  }}
                />

                {/* Floating lock/unlock badge */}
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  backgroundColor: isUnlocked ? '#16a34a' : canUnlockNow ? '#eab308' : '#dc2626',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}>
                  {isUnlocked ? <Unlock size={11} /> : <Lock size={11} />}
                </div>
              </div>

              {/* Level title under sprite */}
              <div style={{
                marginTop: '3px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: isUnlocked ? '#fef3c7' : '#94a3b8',
                border: isUnlocked ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid #475569',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}>
                {city.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Module 2 Modal */}
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
              textAlign: 'center',
              borderRadius: '16px'
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
                padding: '3px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 900,
                textTransform: 'uppercase'
              }}>
                ¡Módulo 2 Desbloqueado!
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1e293b', marginTop: '6px' }}>
                Mercado de Artesanías de Doña Rosa
              </h3>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
              ¡Has usado la <strong>Llave Dorada</strong> con éxito! Las puertas del mercado han quedado abiertas para tus próximas aventuras.
            </p>

            <button
              onClick={() => setShowModule2Modal(false)}
              className="stone-btn stone-btn-green"
              style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            >
              <span>Volver al Mapa del Valle</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
