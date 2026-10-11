import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Plus, Droplet } from 'lucide-react';
import { Perfume } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { luxuryAudio } from '../utils/audio';

interface CollectionGridProps {
  perfumes: Perfume[];
  onSelectPerfume: (p: Perfume) => void;
  onQuickAdd: (p: Perfume, size: '50ml' | '100ml') => void;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  perfumes,
  onSelectPerfume,
  onQuickAdd,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'extraits' | 'eaux' | 'woody'>('all');
  const [spritzingId, setSpritzingId] = useState<string | null>(null);

  const filteredPerfumes = perfumes.filter((p) => {
    if (activeFilter === 'extraits') return p.category === 'Extrait de Parfum';
    if (activeFilter === 'eaux') return p.category === 'Eau de Parfum';
    if (activeFilter === 'woody') return p.bottleTheme === 'obsidian' || p.bottleTheme === 'amber';
    return true;
  });

  const handleCardSpritz = (e: React.MouseEvent, perfume: Perfume) => {
    e.stopPropagation();
    luxuryAudio.playSpritz();
    setSpritzingId(perfume.id);
    setTimeout(() => {
      setSpritzingId(null);
    }, 1100);
  };

  return (
    <section id="creations" className="py-24 relative bg-[#090A0D]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
              La Collection Privée
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F8F6F0] tracking-wide">
              The Grand Flacons
            </h2>
            <p className="text-sm text-[#9E9A90] max-w-lg leading-relaxed font-light">
              Formulated in micro-batches with thirty-year vintage oils and cold enfleurage florals.
              Explore our olfactory compositions.
            </p>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-lg shrink-0">
            <button
              onClick={() => {
                luxuryAudio.playTap();
                setActiveFilter('all');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#C9A96E] text-[#090A0D]'
                  : 'text-[#B0ACA2] hover:text-white'
              }`}
            >
              All Flacons
            </button>
            <button
              onClick={() => {
                luxuryAudio.playTap();
                setActiveFilter('extraits');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'extraits'
                  ? 'bg-[#C9A96E] text-[#090A0D]'
                  : 'text-[#B0ACA2] hover:text-white'
              }`}
            >
              Extraits (30%+)
            </button>
            <button
              onClick={() => {
                luxuryAudio.playTap();
                setActiveFilter('eaux');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'eaux'
                  ? 'bg-[#C9A96E] text-[#090A0D]'
                  : 'text-[#B0ACA2] hover:text-white'
              }`}
            >
              Eaux de Parfum
            </button>
            <button
              onClick={() => {
                luxuryAudio.playTap();
                setActiveFilter('woody');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'woody'
                  ? 'bg-[#C9A96E] text-[#090A0D]'
                  : 'text-[#B0ACA2] hover:text-white'
              }`}
            >
              Woody & Amber
            </button>
          </div>
        </div>

        {/* 3-Column Luxury Product Cards Grid with Motion */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredPerfumes.map((perfume) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={perfume.id}
                onClick={() => onSelectPerfume(perfume)}
                className="group relative flex flex-col bg-[#111318] border border-white/[0.08] hover:border-[#C9A96E]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)] cursor-pointer"
              >
                {/* Product Visual Container */}
                <div className="relative h-80 bg-gradient-to-b from-[#161821] to-[#0D0F14] flex items-center justify-center p-6 overflow-hidden">
                  {/* Radial ambient backglow */}
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${perfume.accentColor} 0%, transparent 65%)`,
                    }}
                  />

                  {/* Single subtle text tag at top left */}
                  <div className="absolute top-4 left-4 z-10 text-[11px] font-medium tracking-widest uppercase text-[#9E9A90]">
                    {perfume.category}
                  </div>

                  {/* Quick Spritz Mini Button top right */}
                  <button
                    onClick={(e) => handleCardSpritz(e, perfume)}
                    title="Spritz fragrance note sample"
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-[#C9A96E] text-white/70 hover:text-[#090A0D] flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                  >
                    <Droplet className="w-3.5 h-3.5" />
                  </button>

                  {/* 3D Flacon Render */}
                  <div className="relative transform transition-transform duration-500 group-hover:scale-105">
                    <PerfumeFlacon
                      perfume={perfume}
                      size="md"
                      showSpritzEffect={spritzingId === perfume.id}
                    />
                  </div>

                  {/* Hover Reveal Actions Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#0D0F14] via-[#0D0F14]/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        luxuryAudio.playTap();
                        onSelectPerfume(perfume);
                      }}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] uppercase tracking-wider font-medium rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C9A96E]" />
                      <span>Olfactory Notes</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        luxuryAudio.playChime();
                        onQuickAdd(perfume, '100ml');
                      }}
                      className="py-2 px-3 bg-[#C9A96E] hover:bg-[#DFC287] text-[#090A0D] text-[11px] uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="Quick add 100ml to bag"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bag</span>
                    </button>
                  </div>
                </div>

                {/* Product Info & Clean Metadata */}
                <div className="p-6 flex flex-col justify-between flex-1 border-t border-white/[0.06] space-y-4">
                  <div>
                    {/* Clean unboxed metadata with bullet separators */}
                    <div className="text-[11px] text-[#8C8880] tracking-widest uppercase flex items-center gap-2 mb-1">
                      <span>{perfume.concentration}</span>
                      <span aria-hidden="true">·</span>
                      <span>{perfume.season}</span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-xl font-serif text-[#F8F6F0] group-hover:text-[#C9A96E] transition-colors">
                      {perfume.name}
                    </h3>
                    <p className="text-xs text-[#A09C94] mt-1 line-clamp-1 font-light">
                      {perfume.tagline}
                    </p>
                  </div>

                  {/* Dominant Notes Preview */}
                  <div className="pt-2 border-t border-white/[0.04] text-[11px] text-[#7A766F] flex items-center justify-between">
                    <span className="truncate max-w-[190px]">
                      {perfume.pyramid.top[0].name} · {perfume.pyramid.heart[0].name} · {perfume.pyramid.base[0].name}
                    </span>
                    <span className="text-[#C9A96E] font-medium text-xs tabular-nums whitespace-nowrap">
                      ${perfume.price100ml}
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
