import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { useQuest } from '../../context/QuestContext';
import { ArrowLeft, Lock, Unlock, CheckCircle2, ChevronRight, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

// ─── TinyRanch Sprite Helper ─────────────────────────────────────────────────
// Tiles are 16×16px. We render them scaled to `size` px.
interface SpriteProps {
  sheet: string;       // path to spritesheet in /assets/tiny_ranch_map/
  col: number;         // 0-based column in the spritesheet
  row: number;         // 0-based row in the spritesheet
  tileSize?: number;   // source tile size in px (default 16)
  size?: number;       // rendered size in px (default 32)
  style?: React.CSSProperties;
  flip?: boolean;      // mirror horizontally
}

// Sheet dimensions map (width × height in px, actual file size)
const SHEET_DIMS: Record<string, [number, number]> = {
  'TinyFarm_Tiles.png':          [80,  48],
  'TinyFarm_MapDecorations.png': [64,  48],
  'TinyFarm_Structures.png':     [64, 128],
  'TinyFarm_Animals.png':        [128, 48],
  'TinyFarm_Items.png':          [56,  32],
  'TinyFarm_Characters.png':     [64,  48],
  'TinyFarm_Crops.png':          [64,  48],
};

const Sprite: React.FC<SpriteProps> = ({
  sheet, col, row, tileSize = 16, size = 32, style, flip = false
}) => {
  const scale = size / tileSize;
  const [sw, sh] = SHEET_DIMS[sheet] ?? [128, 128];
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: `url(/assets/tiny_ranch_map/${sheet})`,
        backgroundRepeat: 'no-repeat',
        // Scale the entire sheet proportionally
        backgroundSize: `${sw * scale}px ${sh * scale}px`,
        imageRendering: 'pixelated',
        transform: flip ? 'scaleX(-1)' : undefined,
        flexShrink: 0,
        // Offset to the correct tile
        backgroundPosition: `-${col * size}px -${row * size}px`,
        ...style,
      }}
    />
  );
};

// (PathDot not used directly — inline decorations below)

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

    if (city.id === 1) {
      setCurrentModuleId(1);
      setScreen('town_map');
      return;
    }

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
      {/* Top Header Bar */}
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

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '13.5px', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '0.5px' }}>
            MAPA DE NIVELES
          </h2>
          <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>
            Toca el Nivel 1 (Aeropuerto) para jugar
          </span>
        </div>

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

        {/* ── CAMINO SECUENCIAL: 1→2→3→4→5→6 ── */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          {/* Borde exterior: marrón oscuro */}
          <line x1="18%" y1="74%" x2="22%" y2="44%" stroke="#5c3a1e" strokeWidth="20" strokeLinecap="round"/>
          <line x1="22%" y1="44%" x2="48%" y2="62%" stroke="#5c3a1e" strokeWidth="20" strokeLinecap="round"/>
          <line x1="48%" y1="62%" x2="48%" y2="32%" stroke="#5c3a1e" strokeWidth="20" strokeLinecap="round"/>
          <line x1="48%" y1="32%" x2="80%" y2="46%" stroke="#5c3a1e" strokeWidth="20" strokeLinecap="round"/>
          <line x1="80%" y1="46%" x2="78%" y2="18%" stroke="#5c3a1e" strokeWidth="20" strokeLinecap="round"/>

          {/* Relleno: tierra beige/sand */}
          <line x1="18%" y1="74%" x2="22%" y2="44%" stroke="#c8a46e" strokeWidth="13" strokeLinecap="round"/>
          <line x1="22%" y1="44%" x2="48%" y2="62%" stroke="#c8a46e" strokeWidth="13" strokeLinecap="round"/>
          <line x1="48%" y1="62%" x2="48%" y2="32%" stroke="#c8a46e" strokeWidth="13" strokeLinecap="round"/>
          <line x1="48%" y1="32%" x2="80%" y2="46%" stroke="#c8a46e" strokeWidth="13" strokeLinecap="round"/>
          <line x1="80%" y1="46%" x2="78%" y2="18%" stroke="#c8a46e" strokeWidth="13" strokeLinecap="round"/>
        </svg>

        {/* ── ÁRBOLES decorativos (MapDecorations: 4col×3row de 16px, sheet 64×48) ── */}
        {/* Solo en zonas que NO tapan el camino ni los niveles */}
        <div style={{ position: 'absolute', top: '8%',  left: '5%',   zIndex: 4, pointerEvents: 'none' }}><Sprite sheet="TinyFarm_MapDecorations.png" col={0} row={0} size={34} /></div>
        <div style={{ position: 'absolute', top: '6%',  left: '32%',  zIndex: 4, pointerEvents: 'none' }}><Sprite sheet="TinyFarm_MapDecorations.png" col={2} row={0} size={32} /></div>
        <div style={{ position: 'absolute', top: '8%',  right: '14%', zIndex: 4, pointerEvents: 'none' }}><Sprite sheet="TinyFarm_MapDecorations.png" col={1} row={0} size={34} /></div>
        <div style={{ position: 'absolute', top: '50%', left: '5%',   zIndex: 4, pointerEvents: 'none' }}><Sprite sheet="TinyFarm_MapDecorations.png" col={3} row={1} size={32} /></div>
        <div style={{ position: 'absolute', top: '55%', right: '5%',  zIndex: 4, pointerEvents: 'none' }}><Sprite sheet="TinyFarm_MapDecorations.png" col={0} row={1} size={34} /></div>
        <div style={{ position: 'absolute', top: '78%', left: '40%',  zIndex: 4, pointerEvents: 'none' }}><Sprite sheet="TinyFarm_MapDecorations.png" col={1} row={2} size={32} /></div>
        <div style={{ position: 'absolute', top: '80%', right: '6%',  zIndex: 4, pointerEvents: 'none' }}><Sprite sheet="TinyFarm_MapDecorations.png" col={2} row={2} size={30} /></div>

        {/* Montañas */}
        <div style={{ position: 'absolute', top: '4%',  left: '12%',  fontSize: '24px', opacity: 0.8, pointerEvents: 'none' }}>🏔️</div>
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
