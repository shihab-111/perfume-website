import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Plus, Gift, Sparkles, Box, ShieldCheck } from 'lucide-react';
import { Perfume } from '../types/perfume';
import { DISCOVERY_COFFRET_PRICE } from '../data/perfumes';
import { luxuryAudio } from '../utils/audio';

interface DiscoveryCoffretBuilderProps {
  perfumes: Perfume[];
  onAddCoffret: (selectedIds: string[], giftMessage?: string) => void;
  atmosphereMode?: 'nuit' | 'jour';
}

export const DiscoveryCoffretBuilder: React.FC<DiscoveryCoffretBuilderProps> = ({
  perfumes,
  onAddCoffret,
  atmosphereMode = 'nuit',
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    perfumes[0].id,
    perfumes[1].id,
    perfumes[2].id,
  ]);
  const [giftNote, setGiftNote] = useState('');
  const [showGiftInput, setShowGiftInput] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(true);

  const isJour = atmosphereMode === 'jour';

  const toggleSelect = (id: string) => {
    luxuryAudio.playTap();
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([selectedIds[0], selectedIds[1], id]);
      }
    }
  };

  const handleAdd = () => {
    luxuryAudio.playChime(880, 0.1);
    onAddCoffret(selectedIds, giftNote || undefined);
  };

  const selectedPerfumes = selectedIds.map(
    (id) => perfumes.find((p) => p.id === id) || perfumes[0]
  );

  return (
    <section id="discovery-set" className="py-24 relative bg-[#090A0E] border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Coffret Visual Presentation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
                The Initiation Ritual
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#F8F6F0]">
                Le Coffret Découverte
              </h2>
              <p className="text-sm text-[#A8A49A] leading-relaxed font-light max-w-lg">
                Curate three 10ml travel flacons presented in a black lacquer jewel box lined with silk velvet.
                Includes an enclosed certificate redeemable for $95 towards your first full 100ml flacon.
              </p>
            </div>

            {/* The 3 Travel Flacons in 3D Velvet Presentation Case */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-[#151722] via-[#0E1017] to-[#0A0C10] border border-white/10 shadow-2xl relative overflow-hidden group">
              
              {/* Box Top Filigree Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 text-[11px] uppercase tracking-[0.2em] text-[#8C8880]">
                <span>L’Atelier Coffret · 3 × 10 ml</span>
                <span className="text-[#C9A96E] font-medium">Bespoke Velvet Inset</span>
              </div>

              {/* 3 Travel Vials with motion hover & liquid level glow */}
              <div className="grid grid-cols-3 gap-5 items-end justify-center py-6">
                {selectedPerfumes.map((p, idx) => (
                  <motion.div
                    key={`${p.id}-${idx}`}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex flex-col items-center space-y-3"
                  >
                    {/* Slender 10ml travel flacon */}
                    <div className="relative w-14 h-40 rounded-lg border border-white/20 bg-white/[0.04] p-1.5 flex flex-col justify-between items-center shadow-2xl overflow-hidden hover:border-[#C9A96E] transition-all hover:-translate-y-2">
                      {/* Gold atomizer cap */}
                      <div className="w-9 h-9 rounded-t bg-gradient-to-r from-[#DFBF82] via-[#FFF2D6] to-[#C49B55] border-b border-black/30 shadow-sm" />
                      
                      {/* Fluid chamber with glowing gradient */}
                      <div
                        className="w-full flex-1 mt-1.5 rounded-sm opacity-90 transition-all shadow-inner"
                        style={{ background: p.accentColor }}
                      />

                      {/* Mini Plaque */}
                      <div className="absolute inset-x-2 top-16 bottom-3 bg-[#0A0B0E]/90 border border-[#C9A96E]/60 rounded-[3px] p-1 flex flex-col items-center justify-center text-center backdrop-blur-xs">
                        <span className="text-[7.5px] text-[#C9A96E] uppercase font-serif font-bold tracking-wider leading-tight">
                          {p.name}
                        </span>
                        <span className="text-[6.5px] text-white/50 tracking-tighter mt-0.5">10 ML</span>
                      </div>
                    </div>

                    <div className="text-center space-y-0.5">
                      <span className="text-xs font-serif text-[#F5F2EB] block truncate max-w-[105px]">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-[#8C8880] block font-mono">Slot {idx + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Voucher guarantee trust note */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#C9A96E]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>100% Purchase Credit Included</span>
                </span>
                <span className="text-white font-medium tabular-nums text-sm">
                  ${DISCOVERY_COFFRET_PRICE} USD
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Flacon Picker */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-1">
              <div className="text-xs text-[#8C8880] uppercase tracking-wider flex justify-between items-center">
                <span>Select 3 Fragrances for your Coffret</span>
                <span className="font-mono text-[#C9A96E]">{selectedIds.length}/3 selected</span>
              </div>
            </div>

            {/* List of 5 signature scents to toggle */}
            <div className="space-y-2.5">
              {perfumes.map((perfume) => {
                const isSelected = selectedIds.includes(perfume.id);
                return (
                  <motion.div
                    key={perfume.id}
                    whileHover={{ x: 4 }}
                    onClick={() => toggleSelect(perfume.id)}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#181A24] border-[#C9A96E] shadow-sm'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-[#C9A96E] border-[#C9A96E] text-[#090A0D]'
                            : 'border-white/20'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base text-[#F8F6F0]">
                            {perfume.name}
                          </span>
                          <span className="text-[10px] text-[#A8A49A] uppercase tracking-wider font-mono">
                            {perfume.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#807D75] truncate mt-0.5">
                          {perfume.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#C9A96E] shrink-0 font-mono">
                      10 ml
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Calligraphy Gift Card */}
            <div className="pt-2">
              {!showGiftInput ? (
                <button
                  onClick={() => setShowGiftInput(true)}
                  className="text-xs text-[#C9A96E] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Add complimentary handwritten calligraphy card message</span>
                </button>
              ) : (
                <div className="space-y-2 p-3 bg-white/[0.03] rounded-lg border border-white/10">
                  <label className="text-xs text-[#B0ACA2] block">
                    Handwritten Calligraphy Card (Complimentary):
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Enter your personal dedication..."
                    className="w-full bg-black/40 border border-white/15 rounded p-2 text-xs text-white placeholder:text-white/20 focus:border-[#C9A96E] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* CTA Add to Bag */}
            <button
              onClick={handleAdd}
              disabled={selectedIds.length !== 3}
              className={`w-full py-3.5 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 ${
                selectedIds.length === 3
                  ? 'bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] hover:opacity-95 shadow-[0_4px_20px_rgba(201,169,110,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Discovery Coffret to Bag (${DISCOVERY_COFFRET_PRICE})</span>
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
