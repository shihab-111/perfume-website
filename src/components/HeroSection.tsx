import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, Droplets } from 'lucide-react';
import { Perfume } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { luxuryAudio } from '../utils/audio';

interface HeroSectionProps {
  heroPerfume: Perfume;
  onSelectPerfume: (p: Perfume) => void;
  onQuickAdd: (p: Perfume, size: '50ml' | '100ml', engraving?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroPerfume,
  onSelectPerfume,
  onQuickAdd,
}) => {
  const [isSpritzing, setIsSpritzing] = useState(false);
  const [monogramText, setMonogramText] = useState('E · V');
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');

  const handleSpritz = () => {
    luxuryAudio.playSpritz();
    setIsSpritzing(true);
    setTimeout(() => {
      setIsSpritzing(false);
    }, 1200);
  };

  const handleQuickBuy = () => {
    luxuryAudio.playChime(784, 0.08);
    onQuickAdd(heroPerfume, selectedSize, monogramText || undefined);
  };

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      {/* Subtle radial ambient spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#C9A96E]/12 via-[#C9A96E]/4 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Editorial Narrative Column */}
          <div className="lg:col-span-6 space-y-7 z-10">
            {/* Quiet unboxed metadata */}
            <div className="flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-[#B89D6B] font-medium">
              <span>Maison de Haute Parfumerie</span>
              <span aria-hidden="true" className="text-white/20">·</span>
              <span>Paris & Grasse</span>
              <span aria-hidden="true" className="text-white/20">·</span>
              <span>Millésime 2026</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-wide text-[#F8F6F0] leading-[1.12] text-balance">
              Where Rare Petals Meet Sacred Woods.
            </h1>

            <p className="text-base sm:text-lg text-[#BDB9AE] font-light leading-relaxed max-w-xl">
              Distilled in Grasse and aged ninety days in French Limousin oak barrels.
              Each hand-blown crystal flacon contains the purest olfactory extraits,
              adorned with bespoke hand-engraved gold plaques.
            </p>

            {/* Scent Accord Preview Bar */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm max-w-xl space-y-2">
              <div className="flex justify-between items-center text-xs text-[#E0DCCE]">
                <span className="font-serif italic text-sm text-[#C9A96E]">Featured Creation: Oud Céleste</span>
                <span className="tabular-nums text-xs text-white/50">32% Pure Extrait</span>
              </div>
              <div className="text-xs text-[#9E9A90] flex flex-wrap items-center gap-2">
                <span>Calabrian Bergamot</span>
                <span className="text-white/20">/</span>
                <span>Grasse Rose de Mai</span>
                <span className="text-white/20">/</span>
                <span>Cambodian Wild Oud</span>
                <span className="text-white/20">/</span>
                <span>Ambergris</span>
              </div>
            </div>

            {/* Interactive Control Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleSpritz}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:brightness-105 active:scale-[0.98] transition-all shadow-[0_8px_25px_rgba(201,169,110,0.3)] cursor-pointer"
              >
                <Droplets className={`w-4 h-4 transition-transform duration-500 ${isSpritzing ? 'animate-bounce text-[#090A0D]' : ''}`} />
                <span>{isSpritzing ? 'Fragrance Released...' : 'Spritz & Experience'}</span>
              </button>

              <button
                onClick={() => onSelectPerfume(heroPerfume)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/20 hover:border-[#C9A96E] text-[#F3EFE6] text-xs uppercase tracking-[0.2em] font-medium rounded hover:bg-white/[0.04] transition-all"
              >
                <span>View Olfactory Notes</span>
                <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
              </button>
            </div>

            {/* Live Monogram Engraver Quick Input */}
            <div className="pt-2 flex items-center gap-3 max-w-md">
              <label htmlFor="monogram" className="text-xs text-[#9E9A90] whitespace-nowrap">
                Personalize Plaque:
              </label>
              <div className="relative flex-1">
                <input
                  id="monogram"
                  type="text"
                  maxLength={10}
                  value={monogramText}
                  onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                  placeholder="E.g. A · K"
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded px-3 py-1.5 text-xs text-[#F5F2EB] uppercase tracking-widest placeholder:text-white/25 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-[#C9A96E] whitespace-nowrap">
                Complimentary
              </span>
            </div>
          </div>

          {/* Right Visual 3D Flacon Column */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            {/* Background Halo Ring */}
            <div className="absolute w-80 h-80 rounded-full border border-[#C9A96E]/20 animate-halo pointer-events-none" />
            <div className="absolute w-[420px] h-[420px] rounded-full border border-white/5 pointer-events-none" />

            {/* The Interactive Perfume Bottle */}
            <div className="relative py-6 z-10">
              <PerfumeFlacon
                perfume={heroPerfume}
                engraving={monogramText}
                size="hero"
                showSpritzEffect={isSpritzing}
                onSpritz={handleSpritz}
              />
            </div>

            {/* Flacon Purchase Strip (Size variant + Immediate bag add) */}
            <div className="w-full max-w-sm mt-4 p-4 rounded-xl bg-[#12141A]/90 border border-white/10 backdrop-blur-md shadow-2xl space-y-3 z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif text-base text-[#F5F2EB]">{heroPerfume.name}</span>
                <span className="text-[#C9A96E] font-medium tabular-nums text-sm">
                  ${selectedSize === '100ml' ? heroPerfume.price100ml : heroPerfume.price50ml} USD
                </span>
              </div>

              {/* Volume selector tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.04] rounded-lg">
                <button
                  onClick={() => {
                    luxuryAudio.playTap();
                    setSelectedSize('50ml');
                  }}
                  className={`py-1.5 text-xs font-medium rounded transition-all ${
                    selectedSize === '50ml'
                      ? 'bg-[#C9A96E] text-[#090A0D] shadow-sm'
                      : 'text-[#B0ACA2] hover:text-white'
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
                      : 'text-[#B0ACA2] hover:text-white'
                  }`}
                >
                  100 ml Grand Flacon
                </button>
              </div>

              <button
                onClick={handleQuickBuy}
                className="w-full py-2.5 bg-white/10 hover:bg-[#C9A96E] text-white hover:text-[#090A0D] text-xs font-medium uppercase tracking-[0.16em] rounded transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve Handcrafted Flacon</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4-Column Luxury Adjacent Trust & Craftsmanship Strip */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/10 text-xs text-[#A8A49A]">
          <div className="space-y-1">
            <span className="font-serif text-sm text-[#F5F2EB] block">Grasse Flora Extraction</span>
            <p className="text-[#87837A] leading-relaxed">Dawn hand-harvested petals cold extracted within two hours.</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-sm text-[#F5F2EB] block">32% Pure Concentration</span>
            <p className="text-[#87837A] leading-relaxed">Highest permissible French extrait for 16-hour sillage.</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-sm text-[#F5F2EB] block">Bespoke Plaque Engraving</span>
            <p className="text-[#87837A] leading-relaxed">Artisanal initials hand-chiseled on each brass plate.</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-sm text-[#F5F2EB] block">Complimentary Vials</span>
            <p className="text-[#87837A] leading-relaxed">Includes two 2ml discovery vials to test before opening.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
