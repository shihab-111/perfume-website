import React, { useState } from 'react';
import { Perfume } from '../types/perfume';

interface PerfumeFlaconProps {
  perfume: Perfume;
  engraving?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpritzEffect?: boolean;
  onSpritz?: () => void;
  interactive?: boolean;
}

export const PerfumeFlacon: React.FC<PerfumeFlaconProps> = ({
  perfume,
  engraving = '',
  size = 'md',
  showSpritzEffect = false,
  onSpritz,
  interactive = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Dimensions configuration based on size
  const sizeMap = {
    sm: { width: 140, height: 210, viewBox: '0 0 200 300' },
    md: { width: 220, height: 320, viewBox: '0 0 200 300' },
    lg: { width: 300, height: 430, viewBox: '0 0 200 300' },
    hero: { width: 360, height: 500, viewBox: '0 0 200 300' },
  };

  const currentSize = sizeMap[size];

  // Theme palettes for flacon
  const getThemePalette = () => {
    switch (perfume.bottleTheme) {
      case 'obsidian':
        return {
          cap: 'url(#obsidianCapGrad)',
          capAccent: '#C9A96E',
          glassBack: 'rgba(25, 23, 20, 0.92)',
          liquidGrad: 'url(#liquidGradObsidian)',
          plaqueBg: 'url(#goldPlateGrad)',
          plaqueText: '#1A1815',
          glow: 'rgba(201, 169, 110, 0.28)',
        };
      case 'amber':
        return {
          cap: 'url(#goldCapGrad)',
          capAccent: '#F2D396',
          glassBack: 'rgba(32, 24, 15, 0.85)',
          liquidGrad: 'url(#liquidGradAmber)',
          plaqueBg: 'url(#goldPlateGrad)',
          plaqueText: '#261C0E',
          glow: 'rgba(212, 163, 89, 0.32)',
        };
      case 'crystal':
        return {
          cap: 'url(#silverCapGrad)',
          capAccent: '#E8DFF5',
          glassBack: 'rgba(25, 24, 32, 0.82)',
          liquidGrad: 'url(#liquidGradCrystal)',
          plaqueBg: 'url(#silverPlateGrad)',
          plaqueText: '#18141F',
          glow: 'rgba(157, 142, 168, 0.35)',
        };
      case 'emerald':
        return {
          cap: 'url(#goldCapGrad)',
          capAccent: '#E2F0D9',
          glassBack: 'rgba(15, 30, 22, 0.85)',
          liquidGrad: 'url(#liquidGradEmerald)',
          plaqueBg: 'url(#goldPlateGrad)',
          plaqueText: '#102218',
          glow: 'rgba(109, 163, 131, 0.32)',
        };
      case 'garnet':
        return {
          cap: 'url(#bronzeCapGrad)',
          capAccent: '#E8A598',
          glassBack: 'rgba(32, 12, 18, 0.90)',
          liquidGrad: 'url(#liquidGradGarnet)',
          plaqueBg: 'url(#goldPlateGrad)',
          plaqueText: '#25080E',
          glow: 'rgba(150, 61, 76, 0.36)',
        };
      default:
        return {
          cap: 'url(#goldCapGrad)',
          capAccent: '#C9A96E',
          glassBack: 'rgba(20, 20, 20, 0.9)',
          liquidGrad: 'url(#liquidGradAmber)',
          plaqueBg: 'url(#goldPlateGrad)',
          plaqueText: '#1A1815',
          glow: 'rgba(201, 169, 110, 0.3)',
        };
    }
  };

  const palette = getThemePalette();

  return (
    <div
      className="relative flex items-center justify-center select-none cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onSpritz}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Dynamic ambient fragrance aura glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`,
          opacity: isHovered || showSpritzEffect ? 0.9 : 0.45,
          transform: `scale(${isHovered ? 1.2 : 1})`,
        }}
      />

      {/* Spritz Atomizer Mist Cloud Animation */}
      {showSpritzEffect && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-48 pointer-events-none z-20">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Animated mist puff waves */}
            <div className="absolute w-36 h-36 rounded-full bg-gradient-to-t from-white/30 via-[#EAD4AA]/25 to-transparent blur-md animate-ping" />
            <div className="absolute w-48 h-32 rounded-full bg-radial from-[#F5DEB3]/30 via-transparent to-transparent blur-xl animate-pulse" />
            {/* Golden micro-droplets */}
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#FFE8B8] shadow-[0_0_8px_#FFE8B8]"
                style={{
                  top: `${20 + (i % 4) * 18}%`,
                  left: `${30 + ((i * 7) % 45)}%`,
                  opacity: 0.85,
                  transform: `translateY(-${(i + 1) * 6}px) scale(${0.8 + (i % 3) * 0.4})`,
                  transition: 'all 0.5s ease-out',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* The 3D Articulated Crystal Flacon Container */}
      <div
        className="relative transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(${isHovered ? -4 : 0}px)`,
        }}
      >
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox={currentSize.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter"
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

            {/* Metal Plaque Gradients */}
            <linearGradient id="goldPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6CA92" />
              <stop offset="25%" stopColor="#FFF1D1" />
              <stop offset="60%" stopColor="#C9A35E" />
              <stop offset="100%" stopColor="#876527" />
            </linearGradient>

            <linearGradient id="silverPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E4EB" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#B3B7C4" />
              <stop offset="100%" stopColor="#848999" />
            </linearGradient>

            {/* Glass Highlights */}
            <linearGradient id="glassFacetSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="12%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.02" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.0" />
              <stop offset="90%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="crystalBaseReflection" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* 1. Atomizer Collar Neck */}
          <rect x="88" y="44" width="24" height="14" rx="2" fill="url(#goldCapGrad)" />
          {/* Collar ring ridges */}
          <line x1="88" y1="49" x2="112" y2="49" stroke="#5E4316" strokeWidth="0.8" />
          <line x1="88" y1="53" x2="112" y2="53" stroke="#FFF5D6" strokeWidth="0.6" />

          {/* 2. Heavy Sculptural Cap */}
          <g>
            {/* Cap shadow on collar */}
            <ellipse cx="100" cy="46" rx="24" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Main cylindrical cap body */}
            <rect
              x="76"
              y="10"
              width="48"
              height="36"
              rx="4"
              fill={palette.cap}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.8"
            />
            {/* Cap top chamfer bevel */}
            <path
              d="M 76 14 Q 100 8 124 14 L 124 10 Q 100 6 76 10 Z"
              fill="rgba(255,255,255,0.35)"
            />
            {/* Cap fluted vertical texture */}
            <line x1="84" y1="14" x2="84" y2="42" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
            <line x1="92" y1="14" x2="92" y2="42" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
            <line x1="100" y1="14" x2="100" y2="42" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="108" y1="14" x2="108" y2="42" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
            <line x1="116" y1="14" x2="116" y2="42" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />

            {/* Cap gold filigree ring at base */}
            <rect x="76" y="42" width="48" height="4" fill="url(#goldCapGrad)" />
          </g>

          {/* 3. Heavy Glass Flacon Body Outline */}
          {/* Main outer crystal silhouette: tapered rectangular luxury bottle with thick pedestal */}
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
            stroke="rgba(255, 255, 255, 0.22)"
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
          <ellipse cx="100" cy="85" rx="38" ry="4" fill="rgba(255, 255, 255, 0.35)" />
          <ellipse cx="100" cy="85" rx="35" ry="2.5" fill="rgba(255, 235, 180, 0.2)" />

          {/* Atomizer internal immersion siphon glass tube */}
          <line
            x1="99"
            y1="56"
            x2="99"
            y2="242"
            stroke="rgba(255, 255, 255, 0.32)"
            strokeWidth="1.8"
            strokeDasharray="1 1"
          />
          <line
            x1="101"
            y1="56"
            x2="101"
            y2="242"
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth="1"
          />

          {/* 5. Thick Heavy Crystal Glass Base (Solid 26mm glass pedestal illusion) */}
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
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="0.8"
          />

          {/* Base bottom bevel cut */}
          <line x1="68" y1="268" x2="132" y2="268" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />

          {/* 6. Engraved Brass/Gold Label Plaque */}
          <g>
            {/* Plaque shadow */}
            <rect
              x="69"
              y="126"
              width="62"
              height="80"
              rx="2"
              fill="rgba(0, 0, 0, 0.45)"
            />
            {/* Plaque plate */}
            <rect
              x="70"
              y="124"
              width="60"
              height="80"
              rx="2"
              fill={palette.plaqueBg}
              stroke="#D4AF37"
              strokeWidth="0.8"
            />
            {/* Fine plaque hairline border */}
            <rect
              x="72"
              y="126"
              width="56"
              height="76"
              rx="1"
              fill="none"
              stroke="#6E4D1B"
              strokeWidth="0.5"
            />

            {/* Maison Crest Monogram */}
            <text
              x="100"
              y="138"
              textAnchor="middle"
              fill={palette.plaqueText}
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
              fill="#574322"
              fontSize="3.8"
              fontFamily="var(--font-sans)"
              letterSpacing="1.2"
            >
              HAUTE PARFUMERIE
            </text>

            <line x1="84" y1="148" x2="116" y2="148" stroke="#876527" strokeWidth="0.4" />

            {/* Perfume Name */}
            <text
              x="100"
              y="160"
              textAnchor="middle"
              fill={palette.plaqueText}
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
              fill="#523F1F"
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
              fill="#523F1F"
              fontSize="3.2"
              fontFamily="var(--font-serif)"
              fontStyle="italic"
            >
              Paris · Grasse
            </text>

            {/* Monogram Bespoke Engraving Area */}
            {engraving ? (
              <g>
                <rect x="75" y="184" width="50" height="14" rx="1" fill="#14110C" fillOpacity="0.2" />
                <text
                  x="100"
                  y="193"
                  textAnchor="middle"
                  fill="#2A1E0D"
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
                  fill="#785B28"
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
                fill="#735A2B"
                fontSize="3"
                fontFamily="var(--font-sans)"
                letterSpacing="0.5"
              >
                100 ml 3.4 FL. OZ.
              </text>
            )}
          </g>

          {/* 7. Glass Facet Highlights & Specular Reflections (Brings Crystal to life) */}
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

          {/* Diagonal Glass Sheen Stroke */}
          <path
            d="M 64 78 L 74 246"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 68 84 L 76 220"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="0.8"
          />

          <path
            d="M 136 78 L 126 246"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Interactive Micro-CTA hint on hover */}
      {interactive && (
        <div
          className={`absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium tracking-widest uppercase transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-100 translate-y-0 text-[#C9A96E]' : 'opacity-0 translate-y-1 text-slate-500'
          }`}
        >
          {showSpritzEffect ? '✦ Olfactory Release ✦' : 'Click Flacon to Spritz'}
        </div>
      )}
    </div>
  );
};
