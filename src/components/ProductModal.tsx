import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Droplets, Shield } from 'lucide-react';
import { Perfume, PlaqueFinish } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { useTheme } from '../context/ThemeContext';
import { luxuryAudio } from '../utils/audio';

interface ProductModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, size: '50ml' | '100ml', engraving?: string, plaqueFinish?: PlaqueFinish) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
}) => {
  const { isLight } = useTheme();

  if (!perfume) return null;

  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');
  const [plaqueFinish, setPlaqueFinish] = useState<PlaqueFinish>('gold');
  const [engraving, setEngraving] = useState('');
  const [isSpritzing, setIsSpritzing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const price = selectedSize === '100ml' ? perfume.price100ml : perfume.price50ml;

  const handleSpritz = () => {
    luxuryAudio.playSpritz();
    setIsSpritzing(true);
    setTimeout(() => setIsSpritzing(false), 1200);
  };

  const handleAdd = () => {
    luxuryAudio.playChime(784, 0.08);
    onAddToCart(perfume, selectedSize, engraving || undefined, plaqueFinish);
    onClose();
  };

  const plaqueOptions: { id: PlaqueFinish; label: string; color: string }[] = [
    { id: 'gold', label: '24K Gold', color: '#D4AF37' },
    { id: 'palladium', label: 'Palladium', color: '#C0C5D0' },
    { id: 'rose', label: 'Rose Vermeil', color: '#E8A5A5' },
    { id: 'bronze', label: 'Antique Bronze', color: '#A06D46' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] overflow-y-auto border ${
          isLight
            ? 'bg-[#FAF8F5] border-[#E2DDD2] text-[#1E1C18]'
            : 'bg-[#111319] border-white/10 text-[#E8E6E3]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product view"
          className={`absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-full transition-colors cursor-pointer ${
            isLight
              ? 'text-black/50 hover:text-black bg-black/5 hover:bg-black/10'
              : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          
          {/* Left Column: Visual Flacon Showcase */}
          <div
            className={`md:col-span-5 p-6 sm:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r relative ${
              isLight
                ? 'bg-gradient-to-b from-[#F2ECE0] to-[#E8E1D2] border-[#E2DDD2]'
                : 'bg-gradient-to-b from-[#161822] to-[#0D0F14] border-white/10'
            }`}
          >
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
                {perfume.category}
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-[#7D766A]' : 'text-[#87837A]'}`}>
                {perfume.concentration}
              </span>
            </div>

            {/* 3D Flacon with Plaque and Drag Rotation */}
            <div className="my-3 sm:my-6">
              <PerfumeFlacon
                perfume={perfume}
                engraving={engraving}
                plaqueFinish={plaqueFinish}
                size={isMobile ? 'sm' : 'lg'}
                showSpritzEffect={isSpritzing}
                onSpritz={handleSpritz}
                allowDragRotate={true}
              />
            </div>

            {/* Spritz Button */}
            <button
              onClick={handleSpritz}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded transition-all flex items-center gap-2 cursor-pointer border ${
                isLight
                  ? 'bg-white/80 border-[#DDD5C7] text-[#1E1C18] hover:bg-[#C9A96E] hover:text-[#090A0D]'
                  : 'bg-white/[0.06] border-white/10 text-white hover:bg-[#C9A96E] hover:text-[#090A0D]'
              }`}
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
                <h2 className={`text-2xl sm:text-3xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                  {perfume.name}
                </h2>
                <div className="text-xl font-medium text-[#C9A96E] tabular-nums whitespace-nowrap">
                  ${price} USD
                </div>
              </div>

              <p className={`text-xs leading-relaxed font-light ${isLight ? 'text-[#635D52]' : 'text-[#A8A49A]'}`}>
                {perfume.story}
              </p>
            </div>

            {/* Accord Intensity Bars */}
            <div
              className={`space-y-2 p-3 rounded-xl border ${
                isLight
                  ? 'bg-white border-[#E8E2D6]'
                  : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className={`text-[11px] uppercase tracking-wider mb-1 font-medium ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                Olfactory Accords Spectrum
              </div>
              <div className="space-y-1.5">
                {perfume.accords.map((accord, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className={isLight ? 'text-[#1E1C18]' : 'text-[#B0ACA2]'}>{accord.name}</span>
                      <span className={`tabular-nums ${isLight ? 'text-black/50' : 'text-white/50'}`}>{accord.percentage}%</span>
                    </div>
                    <div className={`h-1 rounded-full overflow-hidden ${isLight ? 'bg-black/10' : 'bg-white/10'}`}>
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

            {/* Plaque Finish Switcher */}
            <div className="space-y-1.5">
              <label className={`text-xs uppercase tracking-wider block ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                Plaque Metal Finish:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {plaqueOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      luxuryAudio.playTap();
                      setPlaqueFinish(opt.id);
                    }}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      plaqueFinish === opt.id
                        ? isLight
                          ? 'border-[#C9A96E] bg-[#C9A96E]/15 text-[#1E1C18]'
                          : 'border-[#C9A96E] bg-white/[0.06] text-white'
                        : isLight
                        ? 'border-[#E0D8CB] text-[#6E675B] hover:text-[#1E1C18]'
                        : 'border-white/10 text-[#8C8880] hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full inline-block mb-1" style={{ backgroundColor: opt.color }} />
                    <div className="text-[10px] truncate">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Selection */}
            <div className="space-y-2">
              <label className={`text-xs uppercase tracking-wider block ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                Select Flacon Volume:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    luxuryAudio.playTap();
                    setSelectedSize('50ml');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedSize === '50ml'
                      ? isLight
                        ? 'border-[#C9A96E] bg-[#C9A96E]/12 text-[#1E1C18]'
                        : 'border-[#C9A96E] bg-white/[0.06] text-white'
                      : isLight
                      ? 'border-[#E0D8CB] bg-white text-[#6E675B] hover:text-[#1E1C18]'
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
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedSize === '100ml'
                      ? isLight
                        ? 'border-[#C9A96E] bg-[#C9A96E]/12 text-[#1E1C18]'
                        : 'border-[#C9A96E] bg-white/[0.06] text-white'
                      : isLight
                      ? 'border-[#E0D8CB] bg-white text-[#6E675B] hover:text-[#1E1C18]'
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
                <label htmlFor="modal-monogram-field" className={`uppercase tracking-wider ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                  Bespoke Monogram (Metal Plaque):
                </label>
                <span className="text-[11px] text-[#C9A96E]">Complimentary</span>
              </div>
              <input
                id="modal-monogram-field"
                type="text"
                maxLength={10}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                placeholder="Enter initials (e.g. S · A)"
                className={`w-full rounded px-3 py-2 text-xs uppercase tracking-widest focus:outline-none border ${
                  isLight
                    ? 'bg-white border-[#DDD5C7] text-[#1E1C18] focus:border-[#C9A96E] placeholder:text-[#A69E90]'
                    : 'bg-black/40 border-white/15 text-white focus:border-[#C9A96E] placeholder:text-white/20'
                }`}
              />
            </div>

            {/* Inclusions trust note */}
            <div className={`flex items-center gap-2 text-[11px] ${isLight ? 'text-[#696357]' : 'text-[#8A867E]'}`}>
              <Shield className="w-3.5 h-3.5 text-[#C9A96E] shrink-0" />
              <span>Includes 2 complimentary 2ml test vials & insured worldwide courier.</span>
            </div>

            {/* Purchase CTA */}
            <button
              onClick={handleAdd}
              className="w-full py-3.5 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:opacity-95 shadow-[0_4px_20px_rgba(201,169,110,0.3)] transition-all cursor-pointer"
            >
              Acquire Flacon (${price} USD)
            </button>

          </div>

        </div>

      </motion.div>
    </div>
  );
};
