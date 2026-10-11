import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShoppingBag, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { luxuryAudio } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuiz: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenQuiz,
}) => {
  const { isLight, toggleTheme } = useTheme();
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled
          ? isLight
            ? 'bg-[#FAF8F5]/90 backdrop-blur-md border-[#E5DFD3] shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
            : 'bg-[#090A0D]/90 backdrop-blur-md border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
          : isLight
          ? 'bg-[#FAF8F5]/60 backdrop-blur-sm border-black/5'
          : 'bg-[#090A0D]/60 backdrop-blur-sm border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6 sm:gap-8">
        
        {/* Zone 1: Single Text Element Wordmark */}
        <a
          href="#"
          className={`text-2xl md:text-3xl font-serif tracking-[0.24em] transition-colors whitespace-nowrap shrink-0 ${
            isLight
              ? 'text-[#1E1C18] hover:text-[#9C7A3E]'
              : 'text-[#F5F2EB] hover:text-[#C9A96E]'
          }`}
        >
          AURELIA
        </a>

        {/* Zone 2: 4–5 Concise Single-Line Navigation Links */}
        <nav
          className={`hidden lg:flex items-center gap-7 xl:gap-8 text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
            isLight ? 'text-[#5C574F]' : 'text-[#C2BEB5]'
          }`}
        >
          <a
            href="#creations"
            className={`transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0 ${
              isLight ? 'hover:text-[#1E1C18]' : 'hover:text-[#F5F2EB]'
            }`}
          >
            Les Créations
          </a>
          <a
            href="#flacon-3d"
            className={`transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0 ${
              isLight ? 'hover:text-[#1E1C18]' : 'hover:text-[#F5F2EB]'
            }`}
          >
            Flacon 3D
          </a>
          <a
            href="#olfactory-pyramid"
            className={`transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0 ${
              isLight ? 'hover:text-[#1E1C18]' : 'hover:text-[#F5F2EB]'
            }`}
          >
            Olfactory Pyramid
          </a>
          <a
            href="#maceration"
            className={`transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0 ${
              isLight ? 'hover:text-[#1E1C18]' : 'hover:text-[#F5F2EB]'
            }`}
          >
            90-Day Maceration
          </a>
          <a
            href="#discovery-set"
            className={`transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0 ${
              isLight ? 'hover:text-[#1E1C18]' : 'hover:text-[#F5F2EB]'
            }`}
          >
            Discovery Coffret
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action + Theme & Audio Toggles */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={() => {
              luxuryAudio.playTap();
              toggleTheme();
            }}
            aria-label={isLight ? 'Switch to Midnight Dark Mode' : 'Switch to Solstice White Mode'}
            title={isLight ? 'Mode Jour (White)' : 'Mode Nuit (Dark)'}
            className={`p-2 rounded-full transition-all duration-300 ${
              isLight
                ? 'text-[#7A7365] hover:text-[#1E1C18] hover:bg-black/5'
                : 'text-[#9E9A90] hover:text-[#C9A96E] hover:bg-white/5'
            }`}
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-[#7A7365]" />
            ) : (
              <Sun className="w-4 h-4 text-[#C9A96E]" />
            )}
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Enable atmosphere audio' : 'Mute atmosphere audio'}
            title={isMuted ? 'Audio Off' : 'Maison Ambient Sound Active'}
            className={`p-2 rounded-full transition-colors ${
              isLight
                ? 'text-[#7A7365] hover:text-[#9C7A3E] hover:bg-black/5'
                : 'text-[#9E9A90] hover:text-[#C9A96E] hover:bg-white/5'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#C9A96E]" />
            )}
          </button>

          {/* Scent Sommelier Finder Action */}
          <button
            onClick={() => {
              luxuryAudio.playTap();
              onOpenQuiz();
            }}
            className="hidden sm:inline-flex px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-[#090A0D] bg-gradient-to-r from-[#D9BA7C] via-[#EDD6A4] to-[#C9A96E] rounded hover:opacity-95 transition-all whitespace-nowrap shrink-0 shadow-[0_4px_16px_rgba(201,169,110,0.25)] hover:scale-[1.02] active:scale-[0.98]"
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
            className={`relative flex items-center gap-2 p-2 sm:p-2.5 rounded-full transition-colors ${
              isLight
                ? 'text-[#1E1C18] hover:text-[#9C7A3E] hover:bg-black/5'
                : 'text-[#E8E6E3] hover:text-[#C9A96E] hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#C9A96E] text-[#090A0D] text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
