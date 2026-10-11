import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Perfume, PlaqueFinish } from '../types/perfume';

interface PerfumeFlaconProps {
  perfume: Perfume;
  engraving?: string;
  plaqueFinish?: PlaqueFinish;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpritzEffect?: boolean;
  onSpritz?: () => void;
  interactive?: boolean;
  allowDragRotate?: boolean;
}

export const PerfumeFlacon: React.FC<PerfumeFlaconProps> = ({
  perfume,
  engraving = '',
  plaqueFinish = 'gold',
  size = 'md',
  showSpritzEffect = false,
  onSpritz,
  interactive = true,
  allowDragRotate = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [dragRotX, setDragRotX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setTilt({ x: 0, y: 0 });
      setIsHovered(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!allowDragRotate) return;
    setIsDragging(true);
    startXRef.current = e.clientX - dragRotX;
  };

  const handleWindowMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newRot = (e.clientX - startXRef.current) * 0.45;
    // Clamp to -45 to +45 deg for realistic crystal perspective
    const clamped = Math.max(-40, Math.min(40, newRot));
    setDragRotX(clamped);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!allowDragRotate) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      startXRef.current = e.touches[0].clientX - dragRotX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newRot = (e.touches[0].clientX - startXRef.current) * 0.45;
    const clamped = Math.max(-40, Math.min(40, newRot));
    setDragRotX(clamped);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Dimensions configuration
  const sizeMap = {
    sm: { width: 140, height: 210, viewBox: '0 0 200 300' },
    md: { width: 220, height: 320, viewBox: '0 0 200 300' },
    lg: { width: 300, height: 430, viewBox: '0 0 200 300' },
    hero: { width: 370, height: 510, viewBox: '0 0 200 300' },
  };

  const currentSize = sizeMap[size];

  // Plaque finish gradients and text tones
  const getPlaquePalette = () => {
    switch (plaqueFinish) {
      case 'palladium':
        return {
          id: 'palladiumPlaqueGrad',
          bg: 'url(#palladiumPlaqueGrad)',
          border: '#D0D4DF',
          innerBorder: '#787E8E',
          text: '#14161C',
          subtext: '#434752',
        };
      case 'rose':
        return {
          id: 'rosePlaqueGrad',
          bg: 'url(#rosePlaqueGrad)',
          border: '#E8A5A5',
          innerBorder: '#9E5D5D',
          text: '#291216',
          subtext: '#69363E',
        };
      case 'bronze':
        return {
          id: 'bronzePlaqueGrad',
          bg: 'url(#bronzePlaqueGrad)',
          border: '#B37D56',
          innerBorder: '#694125',
          text: '#211209',
          subtext: '#5E381C',
        };
      case 'gold':
      default:
        return {
          id: 'goldPlateGrad',
          bg: 'url(#goldPlateGrad)',
          border: '#E2BF7D',
          innerBorder: '#6E4D1B',
          text: '#1A1815',
          subtext: '#574322',
        };
    }
  };

  const plaque = getPlaquePalette();

  // Theme palettes for flacon
  const getThemePalette = () => {
    switch (perfume.bottleTheme) {
      case 'obsidian':
        return {
          cap: 'url(#obsidianCapGrad)',
          capAccent: '#C9A96E',
          glassBack: 'rgba(25, 23, 20, 0.94)',
          liquidGrad: 'url(#liquidGradObsidian)',
          glow: 'rgba(201, 169, 110, 0.32)',
        };
      case 'amber':
        return {
          cap: 'url(#goldCapGrad)',
          capAccent: '#F2D396',
          glassBack: 'rgba(32, 24, 15, 0.88)',
          liquidGrad: 'url(#liquidGradAmber)',
          glow: 'rgba(212, 163, 89, 0.35)',
        };
      case 'crystal':
        return {
          cap: 'url(#silverCapGrad)',
          capAccent: '#E8DFF5',
          glassBack: 'rgba(25, 24, 32, 0.85)',
          liquidGrad: 'url(#liquidGradCrystal)',
          glow: 'rgba(157, 142, 168, 0.38)',
        };
      case 'emerald':
        return {
          cap: 'url(#goldCapGrad)',
          capAccent: '#E2F0D9',
          glassBack: 'rgba(15, 30, 22, 0.88)',
          liquidGrad: 'url(#liquidGradEmerald)',
          glow: 'rgba(109, 163, 131, 0.35)',
        };
      case 'garnet':
        return {
          cap: 'url(#bronzeCapGrad)',
          capAccent: '#E8A598',
          glassBack: 'rgba(32, 12, 18, 0.92)',
          liquidGrad: 'url(#liquidGradGarnet)',
          glow: 'rgba(150, 61, 76, 0.4)',
        };
      default:
        return {
          cap: 'url(#goldCapGrad)',
          capAccent: '#C9A96E',
          glassBack: 'rgba(20, 20, 20, 0.9)',
          liquidGrad: 'url(#liquidGradAmber)',
          glow: 'rgba(201, 169, 110, 0.3)',
        };
    }
  };

  const palette = getThemePalette();

  const totalYRotation = tilt.x + dragRotX;
  const totalXRotation = tilt.y;

  return (
    <div
      className="relative flex items-center justify-center select-none group cursor-grab active:cursor-grabbing touch-pan-y"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMoveCapture={handleWindowMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic ambient fragrance aura glow with pulsing breathing */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${palette.glow} 0%, transparent 68%)`,
          opacity: isHovered || showSpritzEffect ? 0.95 : 0.5,
          transform: `scale(${isHovered ? 1.25 : 1})`,
        }}
      />

      {/* Spritz Atomizer Mist Cloud Animation with Motion physics */}
      <AnimatePresence>
        {showSpritzEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1.15, y: -25 }}
            exit={{ opacity: 0, scale: 1.4, y: -50 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-56 pointer-events-none z-30"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Expanding vapor ring 1 */}
              <div className="absolute w-44 h-44 rounded-full bg-gradient-to-t from-white/30 via-[#EAD4AA]/25 to-transparent blur-md animate-ping" />
              {/* Soft vapor cloud */}
              <div className="absolute w-56 h-40 rounded-full bg-radial from-[#FFE8B8]/35 via-transparent to-transparent blur-xl" />
              
              {/* 16 Floating Gold Droplets */}
              {[...Array(16)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
                  animate={{
                    opacity: [0, 0.9, 0],
                    scale: [0.5, 1.2, 0.2],
                    y: -30 - ((i * 11) % 45),
                    x: ((i - 8) * 14) + (Math.sin(i) * 12),
                  }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#FFF2D6] shadow-[0_0_10px_#FFE8B8]"
                  style={{ top: '65%' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The 3D Articulated Crystal Flacon Container */}
      <div
        className="relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateY(${totalYRotation}deg) rotateX(${totalXRotation}deg) translateY(${isHovered ? -5 : 0}px)`,
        }}
        onClick={(e) => {
          if (!isDragging && onSpritz) {
            e.stopPropagation();
            onSpritz();
          }
        }}
      >
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox={currentSize.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_25px_45px_rgba(0,0,0,0.9)] filter transition-all max-w-[82vw] sm:max-w-none h-auto"
          style={{
            maxHeight: size === 'hero' ? 'min(480px, 52vh)' : size === 'lg' ? 'min(380px, 45vh)' : undefined,
          }}
        >
          <defs>
            {/* Cap Shaders */}
            <linearGradient id="goldCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBF82" />
              <stop offset="25%" stopColor="#FFF2D6" />
              <stop offset="50%" stopColor="#C49B55" />
              <stop offset="80%" stopColor="#876121" />
              <stop offset="100%" stopColor="#D9B777" />
            </linearGradient>

            <linearGradient id="obsidianCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B1C20" />
              <stop offset="30%" stopColor="#373942" />
              <stop offset="60%" stopColor="#151619" />
              <stop offset="85%" stopColor="#2E3038" />
              <stop offset="100%" stopColor="#0E0F12" />
            </linearGradient>

            <linearGradient id="silverCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A8ABB5" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#8C909E" />
              <stop offset="90%" stopColor="#D6D8E0" />
              <stop offset="100%" stopColor="#7A7D8A" />
            </linearGradient>

            <linearGradient id="bronzeCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6E3D2C" />
              <stop offset="30%" stopColor="#C9816B" />
              <stop offset="65%" stopColor="#52271A" />
              <stop offset="90%" stopColor="#A8614E" />
              <stop offset="100%" stopColor="#3D1B11" />
            </linearGradient>

            {/* Liquid Shaders */}
            <linearGradient id="liquidGradObsidian" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D69446" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#A35E23" stopOpacity="0.92" />
              <stop offset="85%" stopColor="#4A2609" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#2B1403" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="liquidGradAmber" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5D38B" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#CE9638" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#7A4E12" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#422605" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="liquidGradCrystal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D8C8E6" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#9E87B0" stopOpacity="0.88" />
              <stop offset="85%" stopColor="#554266" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#2A1E36" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="liquidGradEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A2D9B6" stopOpacity="0.75" />
              <stop offset="45%" stopColor="#4B8C67" stopOpacity="0.88" />
              <stop offset="85%" stopColor="#1C4B31" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#0B2617" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="liquidGradGarnet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DE6278" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#A8283E" stopOpacity="0.92" />
              <stop offset="85%" stopColor="#540F1B" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#2E040B" stopOpacity="1" />
            </linearGradient>

            {/* Plaque Multi-Finish Gradients */}
            <linearGradient id="goldPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6CA92" />
              <stop offset="25%" stopColor="#FFF1D1" />
              <stop offset="60%" stopColor="#C9A35E" />
              <stop offset="100%" stopColor="#876527" />
            </linearGradient>

            <linearGradient id="palladiumPlaqueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6E8F0" />
              <stop offset="30%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#BCC1CE" />
              <stop offset="100%" stopColor="#838896" />
            </linearGradient>

            <linearGradient id="rosePlaqueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D0D0" />
              <stop offset="30%" stopColor="#FFF0F0" />
              <stop offset="65%" stopColor="#D49B9B" />
              <stop offset="100%" stopColor="#8C5353" />
            </linearGradient>

            <linearGradient id="bronzePlaqueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D49E77" />
              <stop offset="30%" stopColor="#F5CDB2" />
              <stop offset="65%" stopColor="#A3693F" />
              <stop offset="100%" stopColor="#5E381C" />
            </linearGradient>

            {/* Specular Caustic Reflection */}
            <linearGradient id="glassFacetSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.02" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.0" />
              <stop offset="88%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.55" />
            </linearGradient>

            <linearGradient id="crystalBaseReflection" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* 1. Atomizer Collar Neck */}
          <rect x="88" y="44" width="24" height="14" rx="2" fill="url(#goldCapGrad)" />
          <line x1="88" y1="49" x2="112" y2="49" stroke="#5E4316" strokeWidth="0.8" />
          <line x1="88" y1="53" x2="112" y2="53" stroke="#FFF5D6" strokeWidth="0.6" />

          {/* 2. Heavy Sculptural Cap with Dynamic Glint */}
          <g>
            <ellipse cx="100" cy="46" rx="24" ry="4" fill="rgba(0,0,0,0.45)" />
            <rect
              x="76"
              y="10"
              width="48"
              height="36"
              rx="4"
              fill={palette.cap}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.8"
            />
            {/* Cap top chamfer bevel */}
            <path
              d="M 76 14 Q 100 8 124 14 L 124 10 Q 100 6 76 10 Z"
              fill="rgba(255,255,255,0.4)"
            />
            {/* Fluted cap vertical ridges */}
            <line x1="84" y1="14" x2="84" y2="42" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
            <line x1="92" y1="14" x2="92" y2="42" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
            <line x1="100" y1="14" x2="100" y2="42" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            <line x1="108" y1="14" x2="108" y2="42" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
            <line x1="116" y1="14" x2="116" y2="42" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />

            <rect x="76" y="42" width="48" height="4" fill="url(#goldCapGrad)" />
          </g>

          {/* 3. Heavy Glass Flacon Body Outline */}
          <path
            d="
              M 52 70
              C 52 60, 68 56, 88 56
              L 112 56
              C 132 56, 148 60, 148 70
              L 152 250
              C 152 264, 140 274, 126 274
              L 74 274
              C 60 274, 48 264, 48 250
              Z
            "
            fill={palette.glassBack}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.2"
          />

          {/* 4. Internal Liquid Chamber */}
          <path
            d="
              M 60 84
              C 60 78, 72 75, 88 75
              L 112 75
              C 128 75, 140 78, 140 84
              L 143 234
              C 143 242, 134 248, 122 248
              L 78 248
              C 66 248, 57 242, 57 234
              Z
            "
            fill={palette.liquidGrad}
          />

          {/* Liquid meniscus surface wave reflection */}
          <ellipse cx="100" cy="85" rx="38" ry="4" fill="rgba(255, 255, 255, 0.4)" />
          <ellipse cx="100" cy="85" rx="35" ry="2.5" fill="rgba(255, 235, 180, 0.25)" />

          {/* Atomizer internal immersion siphon glass tube */}
          <line
            x1="99"
            y1="56"
            x2="99"
            y2="242"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.8"
            strokeDasharray="1 1"
          />
          <line
            x1="101"
            y1="56"
            x2="101"
            y2="242"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1"
          />

          {/* 5. Solid Crystal Glass Pedestal Base */}
          <path
            d="
              M 57 248
              L 143 248
              L 147 262
              C 147 270, 136 273, 124 273
              L 76 273
              C 64 273, 53 270, 53 262
              Z
            "
            fill="url(#crystalBaseReflection)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.8"
          />
          <line x1="68" y1="268" x2="132" y2="268" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

          {/* 6. Engraved Brass/Palladium/Rose/Bronze Label Plaque */}
          <g>
            <rect
              x="69"
              y="126"
              width="62"
              height="80"
              rx="2"
              fill="rgba(0, 0, 0, 0.5)"
            />
            <rect
              x="70"
              y="124"
              width="60"
              height="80"
              rx="2"
              fill={plaque.bg}
              stroke={plaque.border}
              strokeWidth="0.8"
            />
            <rect
              x="72"
              y="126"
              width="56"
              height="76"
              rx="1"
              fill="none"
              stroke={plaque.innerBorder}
              strokeWidth="0.5"
            />

            {/* Maison Crest */}
            <text
              x="100"
              y="138"
              textAnchor="middle"
              fill={plaque.text}
              fontSize="6"
              fontFamily="var(--font-serif)"
              fontWeight="600"
              letterSpacing="2"
            >
              AURELIA
            </text>
            <text
              x="100"
              y="144"
              textAnchor="middle"
              fill={plaque.subtext}
              fontSize="3.8"
              fontFamily="var(--font-sans)"
              letterSpacing="1.2"
            >
              HAUTE PARFUMERIE
            </text>

            <line x1="84" y1="148" x2="116" y2="148" stroke={plaque.innerBorder} strokeWidth="0.4" />

            {/* Perfume Name */}
            <text
              x="100"
              y="160"
              textAnchor="middle"
              fill={plaque.text}
              fontSize="6.8"
              fontFamily="var(--font-serif)"
              fontWeight="700"
              letterSpacing="0.6"
            >
              {perfume.name.toUpperCase()}
            </text>

            {/* Concentration & City */}
            <text
              x="100"
              y="169"
              textAnchor="middle"
              fill={plaque.subtext}
              fontSize="3.4"
              fontFamily="var(--font-sans)"
              letterSpacing="0.8"
            >
              {perfume.category.toUpperCase()}
            </text>

            <text
              x="100"
              y="176"
              textAnchor="middle"
              fill={plaque.subtext}
              fontSize="3.2"
              fontFamily="var(--font-serif)"
              fontStyle="italic"
            >
              Paris · Grasse
            </text>

            {/* Monogram Bespoke Engraving Area */}
            {engraving ? (
              <g>
                <rect x="75" y="184" width="50" height="14" rx="1" fill="#14110C" fillOpacity="0.25" />
                <text
                  x="100"
                  y="193"
                  textAnchor="middle"
                  fill={plaque.text}
                  fontSize="4.8"
                  fontFamily="var(--font-serif)"
                  fontWeight="bold"
                  letterSpacing="1.8"
                >
                  {engraving.toUpperCase()}
                </text>
                <text
                  x="100"
                  y="197"
                  textAnchor="middle"
                  fill={plaque.subtext}
                  fontSize="2.4"
                  fontFamily="var(--font-sans)"
                >
                  BESPOKE ATELIER
                </text>
              </g>
            ) : (
              <text
                x="100"
                y="192"
                textAnchor="middle"
                fill={plaque.subtext}
                fontSize="3"
                fontFamily="var(--font-sans)"
                letterSpacing="0.5"
              >
                100 ml 3.4 FL. OZ.
              </text>
            )}
          </g>

          {/* 7. Glass Facet Highlights & Specular Reflections */}
          <path
            d="
              M 54 74
              L 52 248
              C 52 254, 55 258, 60 262
              L 60 80
              Z
            "
            fill="url(#glassFacetSpecular)"
          />

          <path
            d="
              M 146 74
              L 148 248
              C 148 254, 145 258, 140 262
              L 140 80
              Z
            "
            fill="url(#glassFacetSpecular)"
            transform="scale(-1, 1) translate(-200, 0)"
          />

          <path
            d="M 64 78 L 74 246"
            stroke="rgba(255, 255, 255, 0.32)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 136 78 L 126 246"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Interactive Drag & Spritz hint */}
      {interactive && (
        <div
          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium tracking-widest uppercase transition-all duration-300 pointer-events-none flex items-center gap-2 ${
            isHovered || isDragging ? 'opacity-100 translate-y-0 text-[#C9A96E]' : 'opacity-0 translate-y-1 text-slate-500'
          }`}
        >
          <span>{isDragging ? '⇄ Rotating Perspective' : 'Click to Spritz · Drag to Rotate'}</span>
        </div>
      )}
    </div>
  );
};
