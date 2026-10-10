import React, { useState } from 'react';
import { X, Sparkles, Droplets, Check, Shield, Globe } from 'lucide-react';
import { Perfume } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { luxuryAudio } from '../utils/audio';

interface ProductModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, size: '50ml' | '100ml', engraving?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
}) => {
  if (!perfume) return null;

  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');
  const [engraving, setEngraving] = useState('');
  const [isSpritzing, setIsSpritzing] = useState(false);

  const price = selectedSize === '100ml' ? perfume.price100ml : perfume.price50ml;

  const handleSpritz = () => {
    luxuryAudio.playSpritz();
    setIsSpritzing(true);
    setTimeout(() => setIsSpritzing(false), 1200);
  };

  const handleAdd = () => {
    luxuryAudio.playChime(784, 0.08);
    onAddToCart(perfume, selectedSize, engraving || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111319] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product view"
          className="absolute top-5 right-5 z-20 p-2 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          
          {/* Left Column: Visual Flacon Showcase */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#161822] to-[#0D0F14] p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-white/10 relative">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
                {perfume.category}
              </span>
              <span className="text-xs text-[#87837A] font-mono">
                {perfume.concentration}
              </span>
            </div>

            {/* 3D Flacon */}
            <div className="my-6">
              <PerfumeFlacon
                perfume={perfume}
                engraving={engraving}
                size="lg"
                showSpritzEffect={isSpritzing}
                onSpritz={handleSpritz}
              />
            </div>

            {/* Spritz Button */}
            <button
              onClick={handleSpritz}
              className="px-4 py-2 bg-white/[0.06] hover:bg-[#C9A96E] text-white hover:text-[#090A0D] text-xs uppercase tracking-wider font-medium rounded transition-all flex items-center gap-2"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{isSpritzing ? 'Atomizing Vapor...' : 'Atomize & Spritz'}</span>
            </button>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Header & Story */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-3xl font-serif text-[#F8F6F0]">
                  {perfume.name}
                </h2>
                <div className="text-xl font-medium text-[#C9A96E] tabular-nums whitespace-nowrap">
                  ${price} USD
                </div>
              </div>

              <p className="text-xs text-[#A8A49A] leading-relaxed font-light">
                {perfume.story}
              </p>
            </div>

            {/* Accord Intensity Bars */}
            <div className="space-y-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-[#8C8880] mb-1 font-medium">
                Olfactory Accords Spectrum
              </div>
              <div className="space-y-1.5">
                {perfume.accords.map((accord, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-[#B0ACA2]">
                      <span>{accord.name}</span>
                      <span className="tabular-nums text-white/50">{accord.percentage}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${accord.percentage}%`,
                          backgroundColor: perfume.accentColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Notes Summary */}
            <div className="grid grid-cols-3 gap-2 text-xs border-y border-white/10 py-3">
              <div>
                <span className="text-[10px] text-[#7A766F] uppercase tracking-wider block">Top Notes</span>
                <span className="text-[#E0DCCE] text-xs font-serif mt-0.5 block truncate">
                  {perfume.pyramid.top[0].name}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#7A766F] uppercase tracking-wider block">Heart Notes</span>
                <span className="text-[#E0DCCE] text-xs font-serif mt-0.5 block truncate">
                  {perfume.pyramid.heart[0].name}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#7A766F] uppercase tracking-wider block">Base Notes</span>
                <span className="text-[#E0DCCE] text-xs font-serif mt-0.5 block truncate">
                  {perfume.pyramid.base[0].name}
                </span>
              </div>
            </div>

            {/* Volume Selection */}
            <div className="space-y-2">
              <label className="text-xs text-[#8C8880] uppercase tracking-wider block">
                Select Flacon Volume:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    luxuryAudio.playTap();
                    setSelectedSize('50ml');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedSize === '50ml'
                      ? 'border-[#C9A96E] bg-white/[0.06] text-white'
                      : 'border-white/10 bg-white/[0.02] text-[#8C8880] hover:text-white'
                  }`}
                >
                  <div className="font-serif text-sm">50 ml Standard Flacon</div>
                  <div className="text-xs text-[#C9A96E] tabular-nums mt-0.5">${perfume.price50ml} USD</div>
                </button>
                <button
                  onClick={() => {
                    luxuryAudio.playTap();
                    setSelectedSize('100ml');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedSize === '100ml'
                      ? 'border-[#C9A96E] bg-white/[0.06] text-white'
                      : 'border-white/10 bg-white/[0.02] text-[#8C8880] hover:text-white'
                  }`}
                >
                  <div className="font-serif text-sm">100 ml Grand Flacon</div>
                  <div className="text-xs text-[#C9A96E] tabular-nums mt-0.5">${perfume.price100ml} USD</div>
                </button>
              </div>
            </div>

            {/* Monogram Engraving Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="modal-monogram" className="text-[#8C8880] uppercase tracking-wider">
                  Bespoke Monogram (Gold Plaque):
                </label>
                <span className="text-[11px] text-[#C9A96E]">Complimentary</span>
              </div>
              <input
                id="modal-monogram"
                type="text"
                maxLength={10}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                placeholder="Enter initials (e.g. S · A)"
                className="w-full bg-black/40 border border-white/15 focus:border-[#C9A96E] rounded px-3 py-2 text-xs text-white uppercase tracking-widest placeholder:text-white/20 focus:outline-none"
              />
            </div>

            {/* Inclusions trust note */}
            <div className="flex items-center gap-2 text-[11px] text-[#8A867E]">
              <Shield className="w-3.5 h-3.5 text-[#C9A96E] shrink-0" />
              <span>Includes 2 complimentary 2ml test vials & insured worldwide courier.</span>
            </div>

            {/* Purchase CTA */}
            <button
              onClick={handleAdd}
              className="w-full py-3.5 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:opacity-95 shadow-[0_4px_20px_rgba(201,169,110,0.3)] transition-opacity"
            >
              Acquire Flacon (${price} USD)
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
