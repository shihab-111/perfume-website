import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Droplets, RotateCcw } from 'lucide-react';
import { Perfume, PlaqueFinish } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { luxuryAudio } from '../utils/audio';

interface HeroSectionProps {
  heroPerfume: Perfume;
  onSelectPerfume: (p: Perfume) => void;
  onQuickAdd: (p: Perfume, size: '50ml' | '100ml', engraving?: string, plaqueFinish?: PlaqueFinish) => void;
  atmosphereMode: 'nuit' | 'jour';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroPerfume,
  onSelectPerfume,
  onQuickAdd,
  atmosphereMode,
}) => {
  const [isSpritzing, setIsSpritzing] = useState(false);
  const [monogramText, setMonogramText] = useState('E · V');
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');
  const [plaqueFinish, setPlaqueFinish] = useState<PlaqueFinish>('gold');

  const isJour = atmosphereMode === 'jour';

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
    <section className="relative min-h-[94vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      {/* Dynamic radial ambient spotlight */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-25"
        style={{
          background: isJour
            ? 'radial-gradient(circle, #DFBF82 0%, transparent 70%)'
            : 'radial-gradient(circle, #C9A96E 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Editorial Narrative Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-7 z-10"
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
                isJour ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'
              }`}
            >
              Where Rare Petals Meet Sacred Woods.
            </h1>

            <p
              className={`text-base sm:text-lg font-light leading-relaxed max-w-xl transition-colors ${
                isJour ? 'text-[#5C574F]' : 'text-[#BDB9AE]'
              }`}
            >
              Distilled in Grasse and aged ninety days in French Limousin oak barrels.
              Each hand-blown crystal flacon contains the purest olfactory extraits,
              adorned with bespoke hand-engraved metal plaques.
            </p>

            {/* Scent Accord Preview Bar */}
            <div
              className={`p-4 rounded-xl border backdrop-blur-sm max-w-xl space-y-2 transition-colors ${
                isJour
                  ? 'bg-black/[0.03] border-black/10'
                  : 'bg-white/[0.03] border-white/10'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif italic text-sm text-[#C9A96E]">
                  Featured Creation: {heroPerfume.name}
                </span>
                <span className="tabular-nums text-xs opacity-60">32% Pure Extrait</span>
              </div>
              <div className="text-xs opacity-80 flex flex-wrap items-center gap-2">
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
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleSpritz}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:brightness-105 active:scale-[0.98] transition-all shadow-[0_8px_25px_rgba(201,169,110,0.3)] cursor-pointer"
              >
                <Droplets className={`w-4 h-4 transition-transform duration-500 ${isSpritzing ? 'animate-bounce' : ''}`} />
                <span>{isSpritzing ? 'Fragrance Released...' : 'Spritz & Experience'}</span>
              </button>

              <button
                onClick={() => onSelectPerfume(heroPerfume)}
                className={`inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border text-xs uppercase tracking-[0.2em] font-medium rounded transition-all ${
                  isJour
                    ? 'border-black/20 text-[#1E1C18] hover:border-[#C9A96E] hover:bg-black/[0.03]'
                    : 'border-white/20 text-[#F3EFE6] hover:border-[#C9A96E] hover:bg-white/[0.04]'
                }`}
              >
                <span>View Olfactory Notes</span>
                <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
              </button>
            </div>

            {/* Live Customizer: Metal Finishes + Monogram */}
            <div className="pt-2 space-y-3 max-w-lg">
              <div className="flex items-center gap-3">
                <span className="text-xs opacity-75 whitespace-nowrap">Plaque Finish:</span>
                <div className="flex items-center gap-2">
                  {plaqueFinishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        luxuryAudio.playTap();
                        setPlaqueFinish(f.id);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border flex items-center gap-1.5 transition-all ${
                        plaqueFinish === f.id
                          ? 'border-[#C9A96E] bg-white/[0.08] text-white shadow-sm'
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
                <label htmlFor="hero-monogram" className="text-xs opacity-75 whitespace-nowrap">
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
                    className={`w-full rounded px-3 py-1.5 text-xs uppercase tracking-widest placeholder:opacity-40 focus:outline-none border ${
                      isJour
                        ? 'bg-black/[0.04] border-black/15 text-[#1E1C18] focus:border-[#C9A96E]'
                        : 'bg-white/[0.04] border-white/15 text-[#F5F2EB] focus:border-[#C9A96E]'
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
            className="lg:col-span-6 flex flex-col items-center justify-center relative"
          >
            {/* Background Halo Ring */}
            <div className="absolute w-80 h-80 rounded-full border border-[#C9A96E]/20 animate-halo pointer-events-none" />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-white/5 pointer-events-none" />

            {/* The Interactive Perfume Bottle with Drag Rotation & Selected Plaque */}
            <div className="relative py-6 z-10">
              <PerfumeFlacon
                perfume={heroPerfume}
                engraving={monogramText}
                plaqueFinish={plaqueFinish}
                size="hero"
                showSpritzEffect={isSpritzing}
                onSpritz={handleSpritz}
                allowDragRotate={true}
              />
            </div>

            {/* Flacon Purchase Strip (Size variant + Immediate bag add) */}
            <div
              className={`w-full max-w-sm mt-4 p-4 rounded-xl border backdrop-blur-md shadow-2xl space-y-3 z-10 transition-colors ${
                isJour
                  ? 'bg-[#F4F1EA]/95 border-black/10'
                  : 'bg-[#12141A]/90 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-serif text-base ${isJour ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}
                >
                  {heroPerfume.name}
                </span>
                <span className="text-[#C9A96E] font-medium tabular-nums text-sm">
                  ${selectedSize === '100ml' ? heroPerfume.price100ml : heroPerfume.price50ml} USD
                </span>
              </div>

              {/* Volume selector tabs */}
              <div
                className={`grid grid-cols-2 gap-2 p-1 rounded-lg ${
                  isJour ? 'bg-black/[0.04]' : 'bg-white/[0.04]'
                }`}
              >
                <button
                  onClick={() => {
                    luxuryAudio.playTap();
                    setSelectedSize('50ml');
                  }}
                  className={`py-1.5 text-xs font-medium rounded transition-all ${
                    selectedSize === '50ml'
                      ? 'bg-[#C9A96E] text-[#090A0D] shadow-sm'
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
                  className={`py-1.5 text-xs font-medium rounded transition-all ${
                    selectedSize === '100ml'
                      ? 'bg-[#C9A96E] text-[#090A0D] shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  100 ml Grand Flacon
                </button>
              </div>

              <button
                onClick={handleQuickBuy}
                className="w-full py-2.5 bg-white/10 hover:bg-[#C9A96E] text-white hover:text-[#090A0D] text-xs font-medium uppercase tracking-[0.16em] rounded transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve Handcrafted Flacon</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Terroir Botannicals Ticker */}
      <div className="w-full mt-12 py-3 border-y border-white/10 overflow-hidden bg-black/20 text-[11px] uppercase tracking-[0.25em] text-[#C9A96E]/80 whitespace-nowrap">
        <div className="inline-block animate-marquee">
          <span>Pursat Wild Agarwood 18yr</span>
          <span className="mx-6 text-white/20">✦</span>
          <span>Grasse Rose de Mai Centifolia</span>
          <span className="mx-6 text-white/20">✦</span>
          <span>Florentine Iris Pallida 6yr</span>
          <span className="mx-6 text-white/20">✦</span>
          <span>Kashmir Saffron Threads</span>
          <span className="mx-6 text-white/20">✦</span>
          <span>Atlantic Grey Ambergris</span>
          <span className="mx-6 text-white/20">✦</span>
          <span>Bourbon Solera Cognac Barrels</span>
          <span className="mx-6 text-white/20">✦</span>
        </div>
      </div>
    </section>
  );
};
