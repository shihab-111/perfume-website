import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Droplets } from 'lucide-react';
import { PERFUMES } from '../data/perfumes';
import { Perfume } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { useTheme } from '../context/ThemeContext';
import { useBrand } from '../context/BrandContext';
import { luxuryAudio } from '../utils/audio';

interface FlaconCarouselProps {
  onSelectPerfume?: (p: Perfume) => void;
  onQuickAdd?: (p: Perfume, size: '50ml' | '100ml') => void;
}

// 4 Signature Featured Extraits for the 3D Carousel
const CAROUSEL_PERFUMES = [
  {
    perfume: PERFUMES[0], // Oud Céleste
    bgDark: '#140D07',
    bgLight: '#F5ECE1',
    panel: '#28170B',
    ghostText: "L'EXTRAIT",
  },
  {
    perfume: PERFUMES[1], // Santal Mythique
    bgDark: '#181308',
    bgLight: '#F9F1DF',
    panel: '#2B210C',
    ghostText: 'MYTHIQUE',
  },
  {
    perfume: PERFUMES[2], // Iris Impérial
    bgDark: '#13101A',
    bgLight: '#F1ECF7',
    panel: '#231D2D',
    ghostText: 'IMPÉRIAL',
  },
  {
    perfume: PERFUMES[4], // Nuit Vénitienne
    bgDark: '#190A0F',
    bgLight: '#F7E7EB',
    panel: '#30111A',
    ghostText: 'NOCTURNE',
  },
];

type Role = 'center' | 'left' | 'right' | 'back';

export const ToonhubCarousel: React.FC<FlaconCarouselProps> = ({
  onSelectPerfume,
}) => {
  const { isLight } = useTheme();
  const { brandSettings } = useBrand();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSpritzing, setIsSpritzing] = useState(false);
  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  // Update isMobile on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      luxuryAudio.playTap();
      setActiveIndex((prev) => (direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4));
      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Detect horizontal swipe if deltaX > 35px and more horizontal than vertical
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const activeItem = CAROUSEL_PERFUMES[activeIndex];
  const activePerfume = activeItem.perfume;
  const currentBg = isLight ? activeItem.bgLight : activeItem.bgDark;

  const handleSpritz = () => {
    luxuryAudio.playSpritz();
    setIsSpritzing(true);
    setTimeout(() => {
      setIsSpritzing(false);
    }, 1200);
  };

  const getRole = (index: number): Role => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const getRoleStyles = (role: Role): React.CSSProperties => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 0.92 : 1.32})`,
          filter: 'none',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '48%' : '80%',
          bottom: isMobile ? '36%' : '6%',
          pointerEvents: 'auto',
        };
      case 'left':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 0.5 : 0.8})`,
          filter: 'blur(3px)',
          opacity: isMobile ? 0.45 : 0.65,
          zIndex: 10,
          left: isMobile ? '12%' : '26%',
          height: isMobile ? '22%' : '42%',
          bottom: isMobile ? '42%' : '14%',
          pointerEvents: 'auto',
          cursor: 'pointer',
        };
      case 'right':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 0.5 : 0.8})`,
          filter: 'blur(3px)',
          opacity: isMobile ? 0.45 : 0.65,
          zIndex: 10,
          left: isMobile ? '88%' : '74%',
          height: isMobile ? '22%' : '42%',
          bottom: isMobile ? '42%' : '14%',
          pointerEvents: 'auto',
          cursor: 'pointer',
        };
      case 'back':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 0.35 : 0.6})`,
          filter: 'blur(6px)',
          opacity: 0.25,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '16%' : '34%',
          bottom: isMobile ? '48%' : '22%',
          pointerEvents: 'none',
        };
    }
  };

  return (
    <div
      id="flacon-3d"
      className="relative w-full overflow-hidden min-h-screen flex items-center justify-center transition-colors duration-700"
      style={{
        backgroundColor: currentBg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[100svh] min-h-[580px] md:min-h-[640px] md:max-h-[1000px] overflow-hidden flex flex-col justify-between"
      >
        
        {/* 1. Grain overlay with delicate texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: isLight ? 0.22 : 0.32,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Ambient radial glow mapped to active perfume accent color */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${activePerfume.accentColor} 0%, transparent 68%)`,
            opacity: isLight ? 0.2 : 0.28,
            zIndex: 1,
          }}
        />

        {/* 2. Giant ghost text in Anton display font */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none transition-all duration-700"
          style={{
            zIndex: 2,
            top: isMobile ? '11%' : '16%',
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(54px, 20vw, 340px)',
            fontWeight: 900,
            color: isLight ? '#1E1C18' : 'white',
            opacity: isLight ? 0.05 : 0.08,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {activeItem.ghostText}
        </div>

        {/* 3. Top luxury brand label */}
        <div
          className="relative pt-4 sm:pt-8 px-4 sm:px-8 flex items-center justify-between"
          style={{ zIndex: 60 }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xs font-serif tracking-[0.25em] text-[#C9A96E] font-medium uppercase">
              {brandSettings.brandName || 'AURELIA'}
            </span>
            <span className="opacity-30 text-xs">/</span>
            <span className={`text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase ${isLight ? 'text-[#696357]' : 'text-white/70'}`}>
              3D Flacon Experience
            </span>
          </div>

          {/* Quick step counter & swipe tip */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-[#C9A96E]/70 font-mono">
              Swipe or Click
            </span>
            <div className="text-[11px] font-mono tracking-widest text-[#C9A96E]">
              0{activeIndex + 1} / 04
            </div>
          </div>
        </div>

        {/* 4. Carousel with 3D Perfume Flacons */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {CAROUSEL_PERFUMES.map((item, index) => {
            const role = getRole(index);
            const roleStyles = getRoleStyles(role);
            const isCenter = role === 'center';

            return (
              <div
                key={item.perfume.id}
                onClick={() => {
                  if (!isCenter) {
                    if (role === 'left') navigate('prev');
                    if (role === 'right') navigate('next');
                  }
                }}
                title={!isCenter ? `Switch to ${item.perfume.name}` : undefined}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, filter, opacity',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  ...roleStyles,
                }}
              >
                <div className="w-full h-full flex items-end justify-center pb-2">
                  <PerfumeFlacon
                    perfume={item.perfume}
                    size={isCenter ? (isMobile ? 'md' : 'hero') : 'sm'}
                    showSpritzEffect={isCenter && isSpritzing}
                    onSpritz={isCenter ? handleSpritz : undefined}
                    interactive={isCenter}
                    allowDragRotate={isCenter}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Responsive Bottom Section (Adaptive Layout for Desktop vs Mobile) */}
        <div className="relative pb-4 sm:pb-12 px-3 sm:px-12 w-full" style={{ zIndex: 60 }}>
          
          {/* Mobile Clean Card (Guarantees zero overlap with the flacon & full light/dark support!) */}
          <div
            className={`md:hidden w-full rounded-2xl p-3.5 sm:p-4 backdrop-blur-md border shadow-xl space-y-2.5 transition-colors ${
              isLight
                ? 'bg-white/95 border-[#E2DDD2] text-[#1E1C18] shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
                : 'bg-[#10121A]/90 border-white/15 text-[#F8F6F0] shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
            }`}
          >
            {/* Header: Title + Price */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#C9A96E] font-medium block">
                  {activePerfume.category} · {activePerfume.concentration}
                </span>
                <h3 className={`font-serif text-lg tracking-wide ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                  {activePerfume.name}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#C9A96E] font-semibold">
                ${activePerfume.price100ml} USD
              </span>
            </div>

            {/* Note story visible on mobile */}
            <p className={`text-[11px] leading-relaxed line-clamp-2 font-light ${isLight ? 'text-[#635D52]' : 'text-[#A8A49A]'}`}>
              {activePerfume.tagline}. {activePerfume.story}
            </p>

            {/* Controls Row: Arrows + Spritz + Discover It */}
            <div className={`flex items-center justify-between gap-1.5 pt-2 border-t ${isLight ? 'border-[#EAE4D7]' : 'border-white/10'}`}>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate('prev')}
                  aria-label="Previous flacon"
                  className={`w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-colors ${
                    isLight
                      ? 'border-[#D9D2C5] bg-black/[0.03] text-[#1E1C18] hover:border-[#C9A96E]'
                      : 'border-white/20 bg-white/5 text-white hover:border-[#C9A96E]'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('next')}
                  aria-label="Next flacon"
                  className={`w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-colors ${
                    isLight
                      ? 'border-[#D9D2C5] bg-black/[0.03] text-[#1E1C18] hover:border-[#C9A96E]'
                      : 'border-white/20 bg-white/5 text-white hover:border-[#C9A96E]'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSpritz}
                  className={`px-2.5 py-1.5 rounded-full text-[10px] font-medium flex items-center gap-1 border cursor-pointer transition-colors ${
                    isLight
                      ? 'bg-black/[0.04] hover:bg-[#C9A96E] hover:text-[#090A0D] border-[#DDD5C7] text-[#1E1C18]'
                      : 'bg-white/10 hover:bg-[#C9A96E] hover:text-[#090A0D] border-white/20 text-white'
                  }`}
                >
                  <Droplets className="w-3 h-3 text-[#C9A96E]" />
                  <span>{isSpritzing ? 'Vaporizing...' : 'Spritz'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (onSelectPerfume) {
                    onSelectPerfume(activePerfume);
                  } else {
                    const el = document.getElementById('creations');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-3 py-1.5 bg-[#C9A96E] hover:bg-[#DFC287] text-[#090A0D] rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-sm shrink-0"
              >
                <span>Discover</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Desktop Spacious Split View */}
          <div className="hidden md:flex items-end justify-between w-full">
            {/* Bottom-left text + nav buttons */}
            <div style={{ maxWidth: '380px' }} className="space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-[#C9A96E] uppercase tracking-[0.22em] font-medium">
                <span>{activePerfume.category}</span>
                <span className="opacity-30">·</span>
                <span>{activePerfume.concentration}</span>
              </div>

              <h2 className={`font-serif text-3xl tracking-wide ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                {activePerfume.name}
              </h2>

              <p className={`text-xs sm:text-sm font-light leading-relaxed ${isLight ? 'text-[#615B52]' : 'text-[#A8A49A]'}`}>
                {activePerfume.tagline}. {activePerfume.story}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('prev')}
                  aria-label="Previous flacon"
                  className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border hover:border-[#C9A96E] hover:scale-105 active:scale-95 ${
                    isLight
                      ? 'border-[#D9D2C5] bg-white/60 hover:bg-white text-[#1E1C18]'
                      : 'border-white/20 bg-white/[0.04] hover:bg-white/[0.08] text-white'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5 hover:text-[#C9A96E]" strokeWidth={1.8} />
                </button>

                <button
                  onClick={() => navigate('next')}
                  aria-label="Next flacon"
                  className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border hover:border-[#C9A96E] hover:scale-105 active:scale-95 ${
                    isLight
                      ? 'border-[#D9D2C5] bg-white/60 hover:bg-white text-[#1E1C18]'
                      : 'border-white/20 bg-white/[0.04] hover:bg-white/[0.08] text-white'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 hover:text-[#C9A96E]" strokeWidth={1.8} />
                </button>

                <button
                  onClick={handleSpritz}
                  className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium flex items-center gap-2 transition-all cursor-pointer border shadow-xs ${
                    isLight
                      ? 'bg-white/80 border-[#D9D2C5] text-[#1E1C18] hover:bg-[#C9A96E] hover:text-[#090A0D]'
                      : 'bg-white/[0.06] border-white/10 text-white hover:bg-[#C9A96E] hover:text-[#090A0D]'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{isSpritzing ? 'Vaporiser...' : 'Spritz'}</span>
                </button>
              </div>
            </div>

            {/* Bottom-right link "DISCOVER IT" */}
            <div>
              <button
                onClick={() => {
                  if (onSelectPerfume) {
                    onSelectPerfume(activePerfume);
                  } else {
                    const el = document.getElementById('creations');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`flex items-center gap-3 no-underline uppercase transition-all duration-200 group cursor-pointer ${
                  isLight ? 'text-[#1E1C18] hover:text-[#91723E]' : 'text-white/90 hover:text-[#C9A96E]'
                }`}
              >
                <div className="text-right">
                  <span
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 'clamp(28px, 4vw, 54px)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                    className="block group-hover:tracking-normal transition-all"
                  >
                    DISCOVER IT
                  </span>
                  <span className="text-[11px] font-sans tracking-[0.2em] text-[#C9A96E] block mt-1">
                    ${activePerfume.price100ml} USD · 100 ML
                  </span>
                </div>
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center transition-all group-hover:scale-105 ${
                    isLight ? 'border-black/20 group-hover:border-[#C9A96E]' : 'border-white/20 group-hover:border-[#C9A96E]'
                  }`}
                >
                  <ArrowRight
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                      isLight ? 'text-[#1E1C18] group-hover:text-[#91723E]' : 'text-white group-hover:text-[#C9A96E]'
                    }`}
                    strokeWidth={2}
                  />
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
