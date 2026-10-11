import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Droplets, Eye } from 'lucide-react';
import { PERFUMES } from '../data/perfumes';
import { Perfume } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { luxuryAudio } from '../utils/audio';

interface FlaconCarouselProps {
  onSelectPerfume?: (p: Perfume) => void;
  onQuickAdd?: (p: Perfume, size: '50ml' | '100ml') => void;
}

// 4 Signature Featured Extraits for the 3D Carousel
const CAROUSEL_PERFUMES = [
  {
    perfume: PERFUMES[0], // Oud Céleste
    bg: '#140D07',
    panel: '#28170B',
    ghostText: "L'EXTRAIT",
  },
  {
    perfume: PERFUMES[1], // Santal Mythique
    bg: '#181308',
    panel: '#2B210C',
    ghostText: 'MYTHIQUE',
  },
  {
    perfume: PERFUMES[2], // Iris Impérial
    bg: '#13101A',
    panel: '#231D2D',
    ghostText: 'IMPÉRIAL',
  },
  {
    perfume: PERFUMES[4], // Nuit Vénitienne
    bg: '#190A0F',
    panel: '#30111A',
    ghostText: 'NOCTURNE',
  },
];

type Role = 'center' | 'left' | 'right' | 'back';

export const ToonhubCarousel: React.FC<FlaconCarouselProps> = ({
  onSelectPerfume,
  onQuickAdd,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSpritzing, setIsSpritzing] = useState(false);

  // Update isMobile on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
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

  const activeItem = CAROUSEL_PERFUMES[activeIndex];
  const activePerfume = activeItem.perfume;

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
          transform: `translateX(-50%) scale(${isMobile ? 1.05 : 1.32})`,
          filter: 'none',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '62%' : '84%',
          bottom: isMobile ? '20%' : '4%',
          pointerEvents: 'auto',
        };
      case 'left':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 0.65 : 0.8})`,
          filter: 'blur(3px)',
          opacity: 0.65,
          zIndex: 10,
          left: isMobile ? '16%' : '26%',
          height: isMobile ? '26%' : '42%',
          bottom: isMobile ? '28%' : '14%',
          pointerEvents: 'none',
        };
      case 'right':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 0.65 : 0.8})`,
          filter: 'blur(3px)',
          opacity: 0.65,
          zIndex: 10,
          left: isMobile ? '84%' : '74%',
          height: isMobile ? '26%' : '42%',
          bottom: isMobile ? '28%' : '14%',
          pointerEvents: 'none',
        };
      case 'back':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 0.45 : 0.6})`,
          filter: 'blur(6px)',
          opacity: 0.35,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '20%' : '34%',
          bottom: isMobile ? '34%' : '22%',
          pointerEvents: 'none',
        };
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: activeItem.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        
        {/* 1. Grain overlay with delicate texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.32,
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
            opacity: 0.28,
            zIndex: 1,
          }}
        />

        {/* 2. Giant ghost text in Anton display font */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none transition-all duration-700"
          style={{
            zIndex: 2,
            top: '16%',
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(80px, 25vw, 340px)',
            fontWeight: 900,
            color: 'white',
            opacity: 0.08,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {activeItem.ghostText}
        </div>

        {/* 3. Top-left luxury brand label */}
        <div
          className="absolute top-6 left-4 sm:left-8 flex items-center gap-3"
          style={{ zIndex: 60 }}
        >
          <span className="text-xs font-serif tracking-[0.25em] text-[#C9A96E] font-medium uppercase">
            AURELIA
          </span>
          <span className="text-white/20 text-xs">/</span>
          <span className="text-[11px] font-sans tracking-[0.2em] text-white/70 uppercase">
            3D Flacon Experience
          </span>
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
                    size={isCenter ? 'hero' : 'md'}
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

        {/* 5. Bottom-left text + nav buttons styled in luxury aesthetic */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-16 sm:left-16"
          style={{
            zIndex: 60,
            maxWidth: '360px',
          }}
        >
          {/* Concentration & Category */}
          <div className="flex items-center gap-2 text-[11px] text-[#C9A96E] uppercase tracking-[0.22em] font-medium mb-1">
            <span>{activePerfume.category}</span>
            <span className="text-white/30">·</span>
            <span>{activePerfume.concentration}</span>
          </div>

          {/* Active Perfume Name */}
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F0] mb-2 tracking-wide">
            {activePerfume.name}
          </h2>

          {/* Scent Story Description */}
          <p className="hidden sm:block text-xs sm:text-sm text-[#A8A49A] font-light leading-relaxed mb-5">
            {activePerfume.tagline}. {activePerfume.story}
          </p>

          {/* Circular Navigation Buttons + Spritz action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('prev')}
              aria-label="Previous flacon"
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border border-white/20 hover:border-[#C9A96E] hover:bg-white/[0.08] hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-white/90 hover:text-[#C9A96E]" strokeWidth={1.8} />
            </button>

            <button
              onClick={() => navigate('next')}
              aria-label="Next flacon"
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border border-white/20 hover:border-[#C9A96E] hover:bg-white/[0.08] hover:scale-105 active:scale-95"
            >
              <ArrowRight className="w-5 h-5 text-white/90 hover:text-[#C9A96E]" strokeWidth={1.8} />
            </button>

            {/* Quick Spritz Atomizer CTA */}
            <button
              onClick={handleSpritz}
              className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-[#C9A96E] text-white hover:text-[#090A0D] text-xs uppercase tracking-wider font-medium flex items-center gap-2 transition-all cursor-pointer border border-white/10"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{isSpritzing ? 'Vaporiser...' : 'Spritz'}</span>
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" */}
        <div
          className="absolute bottom-6 right-4 sm:bottom-16 sm:right-16"
          style={{ zIndex: 60 }}
        >
          <button
            onClick={() => {
              if (onSelectPerfume) {
                onSelectPerfume(activePerfume);
              } else {
                const el = document.getElementById('creations');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 text-white/90 hover:text-[#C9A96E] no-underline uppercase transition-all duration-200 group cursor-pointer"
          >
            <div className="text-right">
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: 'clamp(22px, 4vw, 54px)',
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
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/20 group-hover:border-[#C9A96E] flex items-center justify-center transition-all group-hover:scale-105">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#C9A96E] transition-colors" strokeWidth={2} />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
