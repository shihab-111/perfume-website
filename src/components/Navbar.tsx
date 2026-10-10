import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShoppingBag } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#090A0D]/90 backdrop-blur-md border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
          : 'bg-[#090A0D]/60 backdrop-blur-sm border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in luxury display serif) */}
        <a
          href="#"
          className="text-2xl md:text-3xl font-serif tracking-[0.22em] text-[#F5F2EB] hover:text-[#C9A96E] transition-colors whitespace-nowrap shrink-0"
        >
          AURELIA
        </a>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-[#C2BEB5]">
          <a
            href="#creations"
            className="hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            Les Créations
          </a>
          <a
            href="#olfactory-pyramid"
            className="hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            Olfactory Pyramid
          </a>
          <a
            href="#discovery-set"
            className="hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            Discovery Coffret
          </a>
          <a
            href="#craftsmanship"
            className="hover:text-[#F5F2EB] transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0"
          >
            Atelier Grasse
          </a>
        </nav>

        {/* Zone 3: 1 primary action + interactive bag / sound controls */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Subtle sound toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Enable atmosphere audio' : 'Mute atmosphere audio'}
            className="p-2 text-[#9E9A90] hover:text-[#C9A96E] transition-colors rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]"
            title={isMuted ? 'Sound Off' : 'Maison Ambient Sound Active'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C9A96E]" />}
          </button>

          {/* Scent Sommelier Finder Action */}
          <button
            onClick={() => {
              luxuryAudio.playTap();
              onOpenQuiz();
            }}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#090A0D] bg-gradient-to-r from-[#D9BA7C] via-[#EDD6A4] to-[#C9A96E] rounded hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 shadow-[0_4px_16px_rgba(201,169,110,0.25)]"
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
            className="relative flex items-center gap-2 p-2.5 text-[#E8E6E3] hover:text-[#C9A96E] transition-colors rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#C9A96E] text-[#090A0D] text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
