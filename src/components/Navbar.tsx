import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShoppingBag, Sun, Moon, Menu, X, Sparkles, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { luxuryAudio } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuiz: () => void;
  onOpenSalonPrive: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenQuiz,
  onOpenSalonPrive,
}) => {
  const { isLight, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { label: 'Les Créations', href: '#creations' },
    { label: 'Flacon 3D', href: '#flacon-3d' },
    { label: 'Olfactory Pyramid', href: '#olfactory-pyramid' },
    { label: '90-Day Maceration', href: '#maceration' },
    { label: 'Discovery Coffret', href: '#discovery-set' },
    { label: 'Atelier Grasse', href: '#craftsmanship' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled || isMobileMenuOpen
            ? isLight
              ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-[#E5DFD3] shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
              : 'bg-[#090A0D]/95 backdrop-blur-md border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
            : isLight
            ? 'bg-[#FAF8F5]/75 backdrop-blur-sm border-black/5'
            : 'bg-[#090A0D]/75 backdrop-blur-sm border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => {
                luxuryAudio.playTap();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-label="Toggle navigation menu"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isLight
                  ? 'border-[#DDD5C7] text-[#1E1C18] hover:bg-black/5'
                  : 'border-white/15 text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Zone 1: Brand Wordmark */}
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

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-6 xl:gap-8 text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
              isLight ? 'text-[#5C574F]' : 'text-[#C2BEB5]'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors relative py-1 hover:border-b border-[#C9A96E] whitespace-nowrap shrink-0 ${
                  isLight ? 'hover:text-[#1E1C18]' : 'hover:text-[#F5F2EB]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action + Theme, Sound & Bag Toggles */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={() => {
                luxuryAudio.playTap();
                toggleTheme();
              }}
              aria-label={isLight ? 'Switch to Midnight Dark Mode' : 'Switch to Solstice White Mode'}
              title={isLight ? 'Mode Jour (White)' : 'Mode Nuit (Dark)'}
              className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
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

            {/* Sound Synthesizer Toggle (Desktop only in header, also in mobile drawer) */}
            <button
              onClick={handleToggleSound}
              aria-label={isMuted ? 'Enable atmosphere audio' : 'Mute atmosphere audio'}
              title={isMuted ? 'Audio Off' : 'Maison Ambient Sound Active'}
              className={`hidden sm:flex p-2 rounded-full transition-colors cursor-pointer ${
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
              className="hidden md:flex px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#090A0D] bg-gradient-to-r from-[#D9BA7C] via-[#EDD6A4] to-[#C9A96E] rounded hover:opacity-95 transition-all whitespace-nowrap shrink-0 shadow-[0_4px_16px_rgba(201,169,110,0.25)] items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scent Finder</span>
            </button>

            {/* Salon Privé (Cloud SQL Collector Vault) Trigger */}
            <button
              onClick={() => {
                luxuryAudio.playTap();
                onOpenSalonPrive();
              }}
              aria-label="Le Salon Privé collector vault"
              title={user ? `Salon Privé: ${user.displayName || user.email}` : 'Sign In to Salon Privé'}
              className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 border ${
                user
                  ? 'border-[#C9A96E]/50 bg-[#C9A96E]/10 text-[#C9A96E]'
                  : isLight
                  ? 'border-transparent text-[#7A7365] hover:text-[#1E1C18] hover:bg-black/5'
                  : 'border-transparent text-[#9E9A90] hover:text-[#C9A96E] hover:bg-white/5'
              }`}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Collector'}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              {user && (
                <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-semibold">
                  Privé
                </span>
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => {
                luxuryAudio.playTap();
                onOpenCart();
              }}
              aria-label="View shopping bag"
              className={`relative flex items-center gap-2 p-2 sm:p-2.5 rounded-full transition-colors cursor-pointer ${
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

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden border-b px-5 py-6 space-y-5 animate-fadeIn shadow-2xl max-h-[85vh] overflow-y-auto ${
              isLight
                ? 'bg-[#FAF8F5] border-[#E5DFD3]'
                : 'bg-[#090A0D] border-white/10'
            }`}
          >
            {/* Prominent Scent Finder Banner in Mobile Drawer */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  luxuryAudio.playTap();
                  onOpenQuiz();
                }}
                className="py-3 px-3 rounded-xl text-[11px] font-semibold uppercase tracking-[0.14em] text-[#090A0D] bg-gradient-to-r from-[#D9BA7C] via-[#EDD6A4] to-[#C9A96E] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scent Finder</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  luxuryAudio.playTap();
                  onOpenSalonPrive();
                }}
                className={`py-3 px-3 rounded-xl text-[11px] font-semibold uppercase tracking-[0.14em] border shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                  isLight
                    ? 'bg-white border-[#C9A96E]/40 text-[#1E1C18]'
                    : 'bg-white/5 border-[#C9A96E]/40 text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Salon Privé</span>
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-[0.2em] font-medium py-2.5 border-b transition-colors flex items-center justify-between ${
                    isLight
                      ? 'border-black/5 text-[#4A443B] hover:text-[#1E1C18]'
                      : 'border-white/5 text-[#C2BEB5] hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[#C9A96E] text-xs">→</span>
                </a>
              ))}
            </div>

            {/* Mobile Controls: Sound + Theme Switches */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleToggleSound();
                }}
                className={`flex-1 py-2.5 px-3 rounded-lg border text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isLight
                    ? 'border-[#DDD5C7] text-[#1E1C18] bg-black/[0.03]'
                    : 'border-white/15 text-white bg-white/5'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C9A96E]" />}
                <span>Sound: {isMuted ? 'Muted' : 'Active'}</span>
              </button>

              <button
                onClick={() => {
                  luxuryAudio.playTap();
                  toggleTheme();
                }}
                className={`flex-1 py-2.5 px-3 rounded-lg border text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isLight
                    ? 'border-[#DDD5C7] text-[#1E1C18] bg-black/[0.03]'
                    : 'border-white/15 text-white bg-white/5'
                }`}
              >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#C9A96E]" />}
                <span>{isLight ? 'Mode Nuit' : 'Mode Jour'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-[#C9A96E]">
              <span>Paris · Grasse · London</span>
              <span className="font-mono">Millésime 2026</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
