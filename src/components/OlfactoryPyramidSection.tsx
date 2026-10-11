import React, { useState } from 'react';
import { Globe, Droplets } from 'lucide-react';
import { Perfume } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { useTheme } from '../context/ThemeContext';
import { luxuryAudio } from '../utils/audio';

interface OlfactoryPyramidSectionProps {
  perfumes: Perfume[];
  onOpenDetails: (p: Perfume) => void;
}

export const OlfactoryPyramidSection: React.FC<OlfactoryPyramidSectionProps> = ({
  perfumes,
  onOpenDetails,
}) => {
  const { isLight } = useTheme();
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string>(perfumes[0].id);
  const [activeTier, setActiveTier] = useState<'top' | 'heart' | 'base'>('heart');
  const [isSpritzing, setIsSpritzing] = useState(false);

  const selectedPerfume = perfumes.find((p) => p.id === selectedPerfumeId) || perfumes[0];

  const handleSpritz = () => {
    luxuryAudio.playSpritz();
    setIsSpritzing(true);
    setTimeout(() => setIsSpritzing(false), 1200);
  };

  const currentNotes = selectedPerfume.pyramid[activeTier];

  const tierMetadata = {
    top: {
      title: 'Top / Head Notes',
      sub: 'The Fleeting Dawn (0 – 15 Minutes)',
      description: 'The first impression when atomized into the air. Highly volatile molecules that sparkle with luminosity before yielding to the heart.',
      molecule: 'Monoterpenes & C-8/C-12 Aldehydes',
    },
    heart: {
      title: 'Heart / Core Accord',
      sub: 'The Emotional Heart (15 Minutes – 4 Hours)',
      description: 'The soul and true identity of the composition. Complex floral and aromatic absolutes that unfold as skin warmth rises.',
      molecule: 'Damascenone, Orris Lactones & Terpinenes',
    },
    base: {
      title: 'Base / Soul Drydown',
      sub: 'The Eternal Resonance (4 Hours – 24+ Hours)',
      description: 'Heavy, resinous, balsamic and woody fixatives that anchor the perfume to skin and fabric for days.',
      molecule: 'Sesquiterpenes, Ambroxides & Santalols',
    },
  };

  return (
    <section
      id="olfactory-pyramid"
      className={`min-h-screen py-20 sm:py-28 relative border-t transition-colors duration-700 flex flex-col justify-center overflow-hidden ${
        isLight
          ? 'bg-[#FAF7F0] border-[#E8E2D5]'
          : 'bg-[#0C0E14] border-white/[0.06]'
      }`}
    >
      {/* Background ambient light */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: selectedPerfume.accentColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
            The Science of Extraction
          </span>
          <h2
            className={`text-3xl md:text-5xl font-serif ${
              isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'
            }`}
          >
            The Olfactory Pyramid
          </h2>
          <p
            className={`text-sm font-light leading-relaxed ${
              isLight ? 'text-[#635D52]' : 'text-[#A8A49A]'
            }`}
          >
            A perfume is an evolving architectural journey through time. Select a creation and explore how volatile top notes dissolve into an enduring drydown.
          </p>
        </div>

        {/* Perfume Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 sm:mb-12 flex-wrap">
          {perfumes.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                luxuryAudio.playTap();
                setSelectedPerfumeId(p.id);
              }}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium rounded transition-all cursor-pointer ${
                p.id === selectedPerfumeId
                  ? 'bg-[#C9A96E] text-[#090A0D] shadow-md'
                  : isLight
                  ? 'bg-black/[0.04] text-[#696357] hover:text-[#1E1C18] hover:bg-black/[0.08]'
                  : 'bg-white/[0.04] text-[#B0ACA2] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Main Interactive Stage */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center rounded-2xl p-6 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-md border ${
            isLight
              ? 'bg-white/90 border-[#E5DFD2]'
              : 'bg-[#101218]/90 border-white/10'
          }`}
        >
          {/* Left Column: Visual 3-Tier Pyramid Selector */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`text-xs uppercase tracking-[0.2em] mb-2 ${
                isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'
              }`}
            >
              Select Olfactory Phase
            </div>

            {/* Top Tier Button */}
            <button
              onClick={() => {
                luxuryAudio.playTap();
                setActiveTier('top');
              }}
              className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                activeTier === 'top'
                  ? isLight
                    ? 'bg-[#C9A96E]/10 border-[#C9A96E] shadow-sm'
                    : 'bg-white/[0.08] border-[#C9A96E] shadow-[0_0_20px_rgba(201,169,110,0.15)]'
                  : isLight
                  ? 'bg-black/[0.02] border-[#E8E2D6] hover:border-[#D1C9BA]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-serif text-lg ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                  Top Notes (Tête)
                </span>
                <span className="text-[11px] text-[#C9A96E] font-medium tracking-wider uppercase">0 – 15 Min</span>
              </div>
              <div className={`text-xs mt-1 truncate ${isLight ? 'text-[#696357]' : 'text-[#9E9A90]'}`}>
                {selectedPerfume.pyramid.top.map((n) => n.name).join(' · ')}
              </div>
            </button>

            {/* Heart Tier Button */}
            <button
              onClick={() => {
                luxuryAudio.playTap();
                setActiveTier('heart');
              }}
              className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                activeTier === 'heart'
                  ? isLight
                    ? 'bg-[#C9A96E]/10 border-[#C9A96E] shadow-sm'
                    : 'bg-white/[0.08] border-[#C9A96E] shadow-[0_0_20px_rgba(201,169,110,0.15)]'
                  : isLight
                  ? 'bg-black/[0.02] border-[#E8E2D6] hover:border-[#D1C9BA]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-serif text-lg ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                  Heart Notes (Cœur)
                </span>
                <span className="text-[11px] text-[#C9A96E] font-medium tracking-wider uppercase">15 Min – 4 Hours</span>
              </div>
              <div className={`text-xs mt-1 truncate ${isLight ? 'text-[#696357]' : 'text-[#9E9A90]'}`}>
                {selectedPerfume.pyramid.heart.map((n) => n.name).join(' · ')}
              </div>
            </button>

            {/* Base Tier Button */}
            <button
              onClick={() => {
                luxuryAudio.playTap();
                setActiveTier('base');
              }}
              className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                activeTier === 'base'
                  ? isLight
                    ? 'bg-[#C9A96E]/10 border-[#C9A96E] shadow-sm'
                    : 'bg-white/[0.08] border-[#C9A96E] shadow-[0_0_20px_rgba(201,169,110,0.15)]'
                  : isLight
                  ? 'bg-black/[0.02] border-[#E8E2D6] hover:border-[#D1C9BA]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-serif text-lg ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                  Base Notes (Fond)
                </span>
                <span className="text-[11px] text-[#C9A96E] font-medium tracking-wider uppercase">4 – 24+ Hours</span>
              </div>
              <div className={`text-xs mt-1 truncate ${isLight ? 'text-[#696357]' : 'text-[#9E9A90]'}`}>
                {selectedPerfume.pyramid.base.map((n) => n.name).join(' · ')}
              </div>
            </button>

            {/* Longevity & Sillage Metrics */}
            <div className={`grid grid-cols-2 gap-3 pt-3 border-t text-xs ${isLight ? 'border-[#EAE4D7]' : 'border-white/10'}`}>
              <div className={`p-3 rounded-lg space-y-1 ${isLight ? 'bg-black/[0.03]' : 'bg-white/[0.03]'}`}>
                <span className={isLight ? 'text-[#7D766A] block' : 'text-[#87837A] block'}>Skin Longevity</span>
                <span className={`font-medium tabular-nums ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}>
                  {selectedPerfume.longevity}
                </span>
              </div>
              <div className={`p-3 rounded-lg space-y-1 ${isLight ? 'bg-black/[0.03]' : 'bg-white/[0.03]'}`}>
                <span className={isLight ? 'text-[#7D766A] block' : 'text-[#87837A] block'}>Aura Projection</span>
                <span className={`font-medium ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}>
                  {selectedPerfume.sillage}
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: Flacon & Spritz Action */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center py-4">
            <PerfumeFlacon
              perfume={selectedPerfume}
              size="md"
              showSpritzEffect={isSpritzing}
              onSpritz={handleSpritz}
            />
            <button
              onClick={handleSpritz}
              className={`mt-4 px-4 py-2 text-xs uppercase tracking-wider font-medium rounded transition-all flex items-center gap-2 cursor-pointer border ${
                isLight
                  ? 'bg-black/[0.04] border-[#DDD5C7] text-[#1E1C18] hover:bg-[#C9A96E] hover:text-[#090A0D]'
                  : 'bg-white/[0.06] border-white/10 text-white hover:bg-[#C9A96E] hover:text-[#090A0D]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Atomize Layer</span>
            </button>
          </div>

          {/* Right Column: In-Depth Raw Ingredient Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`space-y-1.5 border-b pb-4 ${isLight ? 'border-[#EAE4D7]' : 'border-white/10'}`}>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C9A96E] font-medium">
                {tierMetadata[activeTier].title}
              </span>
              <h3 className={`text-xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                {tierMetadata[activeTier].sub}
              </h3>
              <p className={`text-xs leading-relaxed font-light ${isLight ? 'text-[#635D52]' : 'text-[#A8A49A]'}`}>
                {tierMetadata[activeTier].description}
              </p>
            </div>

            {/* Note Cards */}
            <div className="space-y-3">
              {currentNotes.map((note, index) => (
                <div
                  key={index}
                  className={`p-3.5 rounded-lg border space-y-1.5 transition-colors ${
                    isLight
                      ? 'bg-black/[0.02] border-[#E8E2D6] hover:border-[#C9A96E]'
                      : 'bg-white/[0.03] border-white/5 hover:border-[#C9A96E]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}>
                      {note.name}
                    </span>
                    <span className="text-[11px] text-[#C9A96E] flex items-center gap-1 font-mono">
                      <Globe className="w-3 h-3" />
                      <span>{note.origin}</span>
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-[#635D52]' : 'text-[#8C8880]'}`}>
                    {note.scentCharacter}
                  </p>
                  {(note.temperature || note.volatility) && (
                    <div className="flex items-center gap-2 pt-1 text-[10px]">
                      {note.temperature && (
                        <span
                          className={`px-1.5 py-0.5 rounded border font-mono ${
                            isLight
                              ? 'bg-black/[0.04] border-[#E2DDD2] text-[#6E675B]'
                              : 'bg-white/[0.04] border-white/5 text-[#A8A49A]'
                          }`}
                        >
                          {note.temperature}
                        </span>
                      )}
                      {note.volatility && (
                        <span className="text-[#C9A96E] font-mono">
                          Volatility: {note.volatility}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chemistry & Harvest note */}
            <div className="pt-2">
              <div className={`text-[11px] font-mono ${isLight ? 'text-[#7D766A]' : 'text-[#7A766F]'}`}>
                Molecular Spectrum: {tierMetadata[activeTier].molecule}
              </div>
              <button
                onClick={() => onOpenDetails(selectedPerfume)}
                className="mt-3 text-xs text-[#C9A96E] hover:text-[#91723E] underline underline-offset-4 tracking-wider uppercase font-medium cursor-pointer"
              >
                Full Olfactory Dossier & Order →
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
