import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { CartItem } from '../types/perfume';
import { COMPLIMENTARY_SAMPLES } from '../data/perfumes';
import { useTheme } from '../context/ThemeContext';
import { luxuryAudio } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenCheckout: (selectedSamples: string[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  const { isLight } = useTheme();
  const [selectedSampleIds, setSelectedSampleIds] = useState<string[]>([
    COMPLIMENTARY_SAMPLES[0].id,
    COMPLIMENTARY_SAMPLES[1].id,
  ]);

  if (!isOpen) return null;

  const toggleSample = (id: string) => {
    luxuryAudio.playTap();
    if (selectedSampleIds.includes(id)) {
      setSelectedSampleIds(selectedSampleIds.filter((s) => s !== id));
    } else {
      if (selectedSampleIds.length < 2) {
        setSelectedSampleIds([...selectedSampleIds, id]);
      } else {
        setSelectedSampleIds([selectedSampleIds[1], id]);
      }
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Background click overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-md h-[100dvh] max-h-[100dvh] flex flex-col justify-between shadow-2xl z-10 overflow-hidden border-l transition-colors duration-300 ${
          isLight
            ? 'bg-[#FAF8F5] border-[#E2DDD2] text-[#1E1C18]'
            : 'bg-[#0F1117] border-white/10 text-[#E8E6E3]'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isLight ? 'border-[#EAE4D7]' : 'border-white/10'}`}>
          <div className="space-y-0.5">
            <h3 className={`font-serif text-xl ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
              Le Panier Privé
            </h3>
            <span className={`text-[11px] uppercase tracking-wider ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
              {items.length} {items.length === 1 ? 'Creation' : 'Creations'} Selected
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close bag"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isLight
                ? 'text-black/50 hover:text-black hover:bg-black/5'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
              <span className={`text-3xl ${isLight ? 'text-black/20' : 'text-white/20'}`}>✦</span>
              <p className={`font-serif text-lg ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}>
                Your salon bag is empty
              </p>
              <p className={`text-xs max-w-xs ${isLight ? 'text-[#696357]' : 'text-[#87837A]'}`}>
                Explore our Haute Parfumerie creations and discover your signature scent.
              </p>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isLight
                        ? 'bg-white border-[#E8E2D6] shadow-xs'
                        : 'bg-white/[0.03] border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#C9A96E] uppercase tracking-wider font-medium">
                          {item.category}
                        </span>
                        <h4 className={`font-serif text-base ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}>
                          {item.name}
                        </h4>
                        <div className={`text-xs ${isLight ? 'text-[#696357]' : 'text-[#87837A]'}`}>
                          {item.size}
                        </div>
                        {item.plaqueFinish && (
                          <div className={`text-[10px] uppercase tracking-wider ${isLight ? 'text-[#7D766A]' : 'text-[#A8A49A]'}`}>
                            Plaque: {item.plaqueFinish === 'gold' ? '24K Gold' : item.plaqueFinish === 'palladium' ? 'Palladium' : item.plaqueFinish === 'rose' ? 'Rose Vermeil' : 'Antique Bronze'}
                          </div>
                        )}
                        {item.engraving && (
                          <div className="text-[11px] text-[#C9A96E] italic mt-0.5">
                            Engraving: &ldquo;{item.engraving}&rdquo;
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className={`text-sm font-medium tabular-nums ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                          ${item.price * item.quantity} USD
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          aria-label="Remove item"
                          className="text-rose-400/80 hover:text-rose-600 p-1 transition-colors mt-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className={`flex items-center justify-between pt-2 border-t ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                      <span className={`text-xs ${isLight ? 'text-[#7D766A]' : 'text-[#7A766F]'}`}>Quantity</span>
                      <div className={`flex items-center gap-2 border rounded px-2 py-0.5 ${isLight ? 'bg-[#F2ECE0] border-[#DDD5C7]' : 'bg-black/40 border-white/10'}`}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="opacity-60 hover:opacity-100 disabled:opacity-20 p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className={`text-xs font-mono px-1.5 tabular-nums ${isLight ? 'text-[#1E1C18]' : 'text-white'}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="opacity-60 hover:opacity-100 p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complimentary Samples Picker */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isLight
                    ? 'bg-gradient-to-b from-[#FAF7F2] to-white border-[#C9A96E]/40'
                    : 'bg-gradient-to-b from-white/[0.04] to-transparent border-[#C9A96E]/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#C9A96E] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Complimentary Discovery Vials (Choose 2)</span>
                  </span>
                  <span className={`text-[11px] tabular-nums ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                    {selectedSampleIds.length}/2
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {COMPLIMENTARY_SAMPLES.map((sample) => {
                    const isSelected = selectedSampleIds.includes(sample.id);
                    return (
                      <button
                        key={sample.id}
                        onClick={() => toggleSample(sample.id)}
                        className={`p-2.5 rounded-lg border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? isLight
                              ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-[#1E1C18]'
                              : 'bg-white/[0.08] border-[#C9A96E] text-white'
                            : isLight
                            ? 'bg-white border-[#E8E2D6] text-[#696357] hover:text-[#1E1C18]'
                            : 'bg-white/[0.02] border-white/5 text-[#8C8880] hover:text-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-serif font-medium">{sample.name}</span>
                          <p className={`text-[10px] ${isLight ? 'text-[#7D766A]' : 'text-[#7A766F]'}`}>{sample.description}</p>
                        </div>
                        <span className="text-[10px] text-[#C9A96E] uppercase font-mono">
                          {isSelected ? 'Selected' : '+ Select'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Subtotal & Action */}
        {items.length > 0 && (
          <div
            className={`p-6 border-t space-y-4 ${
              isLight
                ? 'bg-[#F4EFE6] border-[#E2DDD2]'
                : 'bg-[#0C0E14] border-white/10'
            }`}
          >
            <div className="space-y-1.5 text-xs">
              <div className={`flex justify-between ${isLight ? 'text-[#696357]' : 'text-[#8C8880]'}`}>
                <span>Worldwide Insured Courier</span>
                <span className="text-[#C9A96E] uppercase font-mono text-[11px]">Free</span>
              </div>
              <div className={`flex justify-between text-base font-serif pt-1 ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                <span>Subtotal</span>
                <span className="text-[#C9A96E] font-sans font-medium tabular-nums text-lg">
                  ${subtotal} USD
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                luxuryAudio.playChime(880, 0.1);
                onOpenCheckout(selectedSampleIds);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:opacity-95 shadow-[0_4px_20px_rgba(201,169,110,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className={`flex items-center justify-center gap-1.5 text-[11px] ${isLight ? 'text-[#7D766A]' : 'text-[#7A766F]'}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Complimentary Returns Within 30 Days</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
