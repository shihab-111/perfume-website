import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Droplets } from 'lucide-react';
import { Perfume, PlaqueFinish } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { useTheme } from '../context/ThemeContext';
import { useBrand } from '../context/BrandContext';
import { luxuryAudio } from '../utils/audio';

interface HeroSectionProps {
  heroPerfume: Perfume;
  onSelectPerfume: (p: Perfume) => void;
  onQuickAdd: (p: Perfume, size: '50ml' | '100ml', engraving?: string, plaqueFinish?: PlaqueFinish) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroPerfume,
  onSelectPerfume,
  onQuickAdd,
}) => {
  const { isLight } = useTheme();
  const { brandSettings, formatPrice } = useBrand();
  const [isSpritzing, setIsSpritzing] = useState(false);
  const [monogramText, setMonogramText] = useState('E · V');
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');
  const [plaqueFinish, setPlaqueFinish] = useState<PlaqueFinish>('gold');
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSpritz = () => {
    luxuryAudio.playSpritz();
    setIsSpritzing(true);
    setTimeout(() => {
      setIsSpritzing(false);
    }, 1200);
  };

  const handleQuickBuy = () => {
    luxuryAudio.playChime(784, 0.08);
    onQuickAdd(heroPerfume, selectedSize, monogramText || undefined, plaqueFinish);
  };

  const plaqueFinishes: { id: PlaqueFinish; label: string; color: string }[] = [
    { id: 'gold', label: '24K Gold', color: '#D4AF37' },
    { id: 'palladium', label: 'Palladium', color: '#C0C5D0' },
    { id: 'rose', label: 'Rose Vermeil', color: '#E8A5A5' },
    { id: 'bronze', label: 'Antique Bronze', color: '#A06D46' },
  ];

  return (
    <section className="relative min-h-screen pt-24 sm:pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      {/* Dynamic radial ambient spotlight */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-25"
        style={{
          background: isLight
            ? 'radial-gradient(circle, #DFBF82 0%, transparent 70%)'
            : 'radial-gradient(circle, #C9A96E 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Editorial Narrative Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6 sm:space-y-7 z-10"
          >
            {/* Quiet unboxed metadata */}
            <div className="flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-[#B89D6B] font-medium">
              <span>Maison de Haute Parfumerie</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>Paris & Grasse</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>Millésime 2026</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-wide leading-[1.12] text-balance transition-colors ${
                isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'
              }`}
            >
              {brandSettings.heroHeadline || 'Where Rare Petals Meet Sacred Woods.'}
            </h1>

            <p
              className={`text-base sm:text-lg font-light leading-relaxed max-w-xl transition-colors ${
                isLight ? 'text-[#5C574F]' : 'text-[#BDB9AE]'
              }`}
            >
              {brandSettings.heroSubheadline ||
                'Distilled in Grasse and aged ninety days in French Limousin oak barrels. Each hand-blown crystal flacon contains the purest olfactory extraits, adorned with bespoke hand-engraved metal plaques.'}
            </p>

            {/* Scent Accord Preview Bar */}
            <div
              className={`p-4 rounded-xl border backdrop-blur-sm max-w-xl space-y-2 transition-colors ${
                isLight
                  ? 'bg-white/80 border-[#E8E2D5] shadow-xs'
                  : 'bg-white/[0.03] border-white/10'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif italic text-sm text-[#C9A96E]">
                  Featured Creation: {heroPerfume.name}
                </span>
                <span className={`tabular-nums text-xs ${isLight ? 'text-[#7A7365]' : 'text-white/50'}`}>
                  32% Pure Extrait
                </span>
              </div>
              <div className={`text-xs flex flex-wrap items-center gap-2 ${isLight ? 'text-[#615C53]' : 'text-white/70'}`}>
                <span>Calabrian Bergamot</span>
                <span className="opacity-30">/</span>
                <span>Grasse Rose de Mai</span>
                <span className="opacity-30">/</span>
                <span>Cambodian Wild Oud</span>
                <span className="opacity-30">/</span>
                <span>Ambergris</span>
              </div>
            </div>

            {/* Interactive Control Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <button
                onClick={handleSpritz}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:brightness-105 active:scale-[0.98] transition-all shadow-[0_8px_25px_rgba(201,169,110,0.3)] cursor-pointer"
              >
                <Droplets className={`w-4 h-4 transition-transform duration-500 ${isSpritzing ? 'animate-bounce' : ''}`} />
                <span>{isSpritzing ? 'Fragrance Released...' : 'Spritz & Experience'}</span>
              </button>

              <button
                onClick={() => onSelectPerfume(heroPerfume)}
                className={`inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border text-xs uppercase tracking-[0.2em] font-medium rounded transition-all cursor-pointer ${
                  isLight
                    ? 'border-[#D1C9BA] text-[#1E1C18] hover:border-[#C9A96E] hover:bg-black/[0.03]'
                    : 'border-white/20 text-[#F3EFE6] hover:border-[#C9A96E] hover:bg-white/[0.04]'
                }`}
              >
                <span>View Olfactory Notes</span>
                <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
              </button>
            </div>

            {/* Live Customizer: Metal Finishes + Monogram */}
            <div className="pt-2 space-y-3 max-w-lg">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className={`text-xs whitespace-nowrap ${isLight ? 'text-[#6E675B]' : 'text-white/75'}`}>
                  Plaque Finish:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {plaqueFinishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        luxuryAudio.playTap();
                        setPlaqueFinish(f.id);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                        plaqueFinish === f.id
                          ? isLight
                            ? 'border-[#C9A96E] bg-[#C9A96E]/15 text-[#1E1C18] shadow-xs'
                            : 'border-[#C9A96E] bg-white/[0.08] text-white shadow-xs'
                          : isLight
                          ? 'border-[#E0D9CC] text-[#7A7365] hover:text-[#1E1C18]'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="hero-monogram" className={`text-xs whitespace-nowrap ${isLight ? 'text-[#6E675B]' : 'text-white/75'}`}>
                  Personalize Plaque:
                </label>
                <div className="relative flex-1">
                  <input
                    id="hero-monogram"
                    type="text"
                    maxLength={10}
                    value={monogramText}
                    onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                    placeholder="E.g. A · K"
                    className={`w-full rounded px-3 py-1.5 text-xs uppercase tracking-widest focus:outline-none border ${
                      isLight
                        ? 'bg-white border-[#DDD6C8] text-[#1E1C18] focus:border-[#C9A96E] placeholder:text-[#A8A092]'
                        : 'bg-white/[0.04] border-white/15 text-[#F5F2EB] focus:border-[#C9A96E] placeholder:text-white/30'
                    }`}
                  />
                </div>
                <span className="text-[11px] text-[#C9A96E] whitespace-nowrap font-medium">
                  Complimentary
                </span>
              </div>
            </div>

          </motion.div>

          {/* Right Visual 3D Flacon Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-center justify-center relative py-4"
          >
            {/* Background Halo Ring */}
            <div className="absolute w-80 h-80 rounded-full border border-[#C9A96E]/20 animate-halo pointer-events-none" />
            <div className={`absolute w-[440px] h-[440px] rounded-full border pointer-events-none ${isLight ? 'border-black/5' : 'border-white/5'}`} />

            {/* The Interactive Perfume Bottle with Drag Rotation & Selected Plaque */}
            <div className="relative py-4 z-10">
              <PerfumeFlacon
                perfume={heroPerfume}
                engraving={monogramText}
                plaqueFinish={plaqueFinish}
                size={isMobile ? 'md' : 'hero'}
                showSpritzEffect={isSpritzing}
                onSpritz={handleSpritz}
                allowDragRotate={true}
              />
            </div>

            {/* Flacon Purchase Strip (Size variant + Immediate bag add) */}
            <div
              className={`w-full max-w-sm mt-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl space-y-3 z-10 transition-colors ${
                isLight
                  ? 'bg-white/95 border-[#E2DBCF]'
                  : 'bg-[#12141A]/90 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-serif text-base ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}
                >
                  {heroPerfume.name}
                </span>
                <span className="text-[#C9A96E] font-medium tabular-nums text-sm">
                  {formatPrice(selectedSize === '100ml' ? heroPerfume.price100ml : heroPerfume.price50ml)}
                </span>
              </div>

              {/* Volume selector tabs */}
              <div
                className={`grid grid-cols-2 gap-2 p-1 rounded-lg ${
                  isLight ? 'bg-black/[0.04]' : 'bg-white/[0.04]'
                }`}
              >
                <button
                  onClick={() => {
                    luxuryAudio.playTap();
                    setSelectedSize('50ml');
                  }}
                  className={`py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                    selectedSize === '50ml'
                      ? 'bg-[#C9A96E] text-[#090A0D] shadow-xs'
                      : isLight
                      ? 'text-[#6E675B] hover:text-[#1E1C18]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  50 ml Flacon
                </button>
                <button
                  onClick={() => {
                    luxuryAudio.playTap();
                    setSelectedSize('100ml');
                  }}
                  className={`py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                    selectedSize === '100ml'
                      ? 'bg-[#C9A96E] text-[#090A0D] shadow-xs'
                      : isLight
                      ? 'text-[#6E675B] hover:text-[#1E1C18]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  100 ml Grand Flacon
                </button>
              </div>

              <button
                onClick={handleQuickBuy}
                className="w-full py-2.5 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs font-medium uppercase tracking-[0.16em] rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-105 active:scale-[0.99]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve Handcrafted Flacon</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Terroir Botanicals Ticker */}
      <div
        className={`w-full mt-10 py-3 border-y overflow-hidden text-[11px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors ${
          isLight
            ? 'bg-black/[0.02] border-[#E8E2D5] text-[#91723E]'
            : 'bg-black/20 border-white/10 text-[#C9A96E]/80'
        }`}
      >
        <div className="inline-block animate-marquee">
          <span>Pursat Wild Agarwood 18yr</span>
          <span className="mx-6 opacity-30">✦</span>
          <span>Grasse Rose de Mai Centifolia</span>
          <span className="mx-6 opacity-30">✦</span>
          <span>Florentine Iris Pallida 6yr</span>
          <span className="mx-6 opacity-30">✦</span>
          <span>Kashmir Saffron Threads</span>
          <span className="mx-6 opacity-30">✦</span>
          <span>Atlantic Grey Ambergris</span>
          <span className="mx-6 opacity-30">✦</span>
          <span>Bourbon Solera Cognac Barrels</span>
          <span className="mx-6 opacity-30">✦</span>
        </div>
      </div>
    </section>
  );
};
