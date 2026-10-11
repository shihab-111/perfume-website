import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, ShoppingBag, Sun, Moon } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuiz: () => void;
  atmosphereMode: 'nuit' | 'jour';
  onToggleAtmosphere: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenQuiz,
  atmosphereMode,
  onToggleAtmosphere,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const muted = luxuryAudio.toggleMute();
    setIsMuted(muted);
  };

  const isJour = atmosphereMode === 'jour';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled
          ? isJour
            ? 'bg-[#F9F7F2]/90 backdrop-blur-md border-[#E3DEC3]/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
            : 'bg-[#090A0D]/90 backdrop-blur-md border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
          : isJour
          ? 'bg-[#F9F7F2]/60 backdrop-blur-sm border-black/5'
          : 'bg-[#090A0D]/60 backdrop-blur-sm border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Text Element Wordmark */}
        <a
          href="#"
          className={`text-2xl md:text-3xl font-serif tracking-[0.24em] transition-colors whitespace-nowrap shrink-0 ${
            isJour
              ? 'text-[#1E1C18] hover:text-[#9C7A3E]'
              : 'text-[#F5F2EB] hover:text-[#C9A96E]'
          }`}
        >
          AURELIA
        </a>

        {/* Zone 2: 4–5 Concise Single-Line Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
            isJour ? 'text-[#5C574F]' : 'text-[#C2BEB5]'
          }`}
        >
          <a
            href="#creations"
            className="hover:text-[#9C7A3E] dark:hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            Les Créations
          </a>
          <a
            href="#olfactory-pyramid"
            className="hover:text-[#9C7A3E] dark:hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            Olfactory Pyramid
          </a>
          <a
            href="#maceration"
            className="hover:text-[#9C7A3E] dark:hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            90-Day Maceration
          </a>
          <a
            href="#discovery-set"
            className="hover:text-[#9C7A3E] dark:hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            Discovery Coffret
          </a>
          <a
            href="#craftsmanship"
            className="hover:text-[#9C7A3E] dark:hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            Atelier Grasse
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action + Scent Controls */}
        <div className="flex items-center gap-3.5 shrink-0">
          
          {/* Atmosphere Lighting Mode Toggle (Mode Jour vs Mode Nuit) */}
          <button
            onClick={() => {
              luxuryAudio.playTap();
              onToggleAtmosphere();
            }}
            aria-label={`Switch to ${isJour ? 'Midnight Salon (Mode Nuit)' : 'Solstice Light (Mode Jour)'}`}
            title={`Atmosphere: ${isJour ? 'Mode Jour (Solstice)' : 'Mode Nuit (Midnight)'}`}
            className={`p-2 rounded-full transition-colors ${
              isJour
                ? 'text-[#7A7365] hover:text-[#1E1C18] hover:bg-black/5'
                : 'text-[#9E9A90] hover:text-[#C9A96E] hover:bg-white/5'
            }`}
          >
            {isJour ? <Moon className="w-4 h-4 text-[#7A7365]" /> : <Sun className="w-4 h-4 text-[#C9A96E]" />}
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Enable atmosphere audio' : 'Mute atmosphere audio'}
            title={isMuted ? 'Audio Off' : 'Maison Ambient Sound Active'}
            className={`p-2 rounded-full transition-colors ${
              isJour
                ? 'text-[#7A7365] hover:text-[#9C7A3E]'
                : 'text-[#9E9A90] hover:text-[#C9A96E]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C9A96E]" />}
          </button>

          {/* Scent Sommelier Finder Action */}
          <button
            onClick={() => {
              luxuryAudio.playTap();
              onOpenQuiz();
            }}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#090A0D] bg-gradient-to-r from-[#D9BA7C] via-[#EDD6A4] to-[#C9A96E] rounded hover:opacity-95 transition-all whitespace-nowrap shrink-0 shadow-[0_4px_16px_rgba(201,169,110,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Scent Finder
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => {
              luxuryAudio.playTap();
              onOpenCart();
            }}
            aria-label="View shopping bag"
            className={`relative flex items-center gap-2 p-2.5 rounded-full transition-colors ${
              isJour
                ? 'text-[#1E1C18] hover:text-[#9C7A3E]'
                : 'text-[#E8E6E3] hover:text-[#C9A96E]'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#C9A96E] text-[#090A0D] text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-md"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
