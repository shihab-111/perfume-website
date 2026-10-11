import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { luxuryAudio } from '../utils/audio';

export const Footer: React.FC = () => {
  const { isLight } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    luxuryAudio.playChime(784, 0.08);
    setIsSubscribed(true);
  };

  return (
    <footer
      className={`border-t pt-16 pb-12 transition-colors duration-700 ${
        isLight
          ? 'bg-[#EFEAE0] text-[#6B655B] border-[#DDD5C6]'
          : 'bg-[#07080B] text-[#9E9A90] border-white/[0.08]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-16 border-b ${isLight ? 'border-[#DDD5C6]' : 'border-white/[0.06]'}`}>
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <span
              className={`text-2xl font-serif tracking-[0.25em] block ${
                isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'
              }`}
            >
              AURELIA
            </span>
            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-[#696357]' : 'text-[#87837A]'}`}>
              Maison de Haute Parfumerie fondée à Grasse.
              Distilling rare botanicals and aged resins into sovereign extrait compositions.
            </p>
            <div className="text-[11px] text-[#C9A96E] font-medium tracking-widest uppercase">
              Paris · Grasse · London · Tokyo
            </div>
          </div>

          {/* Boutique Salons Col */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className={`font-medium tracking-wider uppercase text-[11px] block ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
              Private Salons
            </span>
            <div className={`space-y-2 ${isLight ? 'text-[#696357]' : 'text-[#87837A]'}`}>
              <div>
                <span className={`block font-serif ${isLight ? 'text-[#1E1C18]' : 'text-white'}`}>Paris</span>
                <span>28 Rue Saint-Honoré, 75001</span>
              </div>
              <div>
                <span className={`block font-serif ${isLight ? 'text-[#1E1C18]' : 'text-white'}`}>London</span>
                <span>14 Mount Street, Mayfair</span>
              </div>
              <div>
                <span className={`block font-serif ${isLight ? 'text-[#1E1C18]' : 'text-white'}`}>Tokyo</span>
                <span>6-10-1 Ginza, Chuo-ku</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <span className={`font-medium tracking-wider uppercase text-[11px] block ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
              Maison
            </span>
            <ul className={`space-y-2 ${isLight ? 'text-[#696357]' : 'text-[#87837A]'}`}>
              <li>
                <a href="#creations" className={`transition-colors ${isLight ? 'hover:text-[#1E1C18]' : 'hover:text-white'}`}>Les Extraits</a>
              </li>
              <li>
                <a href="#flacon-3d" className={`transition-colors ${isLight ? 'hover:text-[#1E1C18]' : 'hover:text-white'}`}>Flacon 3D</a>
              </li>
              <li>
                <a href="#olfactory-pyramid" className={`transition-colors ${isLight ? 'hover:text-[#1E1C18]' : 'hover:text-white'}`}>Olfactory Pyramid</a>
              </li>
              <li>
                <a href="#discovery-set" className={`transition-colors ${isLight ? 'hover:text-[#1E1C18]' : 'hover:text-white'}`}>Discovery Coffret</a>
              </li>
              <li>
                <a href="#craftsmanship" className={`transition-colors ${isLight ? 'hover:text-[#1E1C18]' : 'hover:text-white'}`}>Atelier Grasse</a>
              </li>
            </ul>
          </div>

          {/* Private Allocation Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <span className={`font-medium tracking-wider uppercase text-[11px] block ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
              Private Allocations
            </span>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#696357]' : 'text-[#87837A]'}`}>
              Receive confidential invitations to single-cask millésimes and private salon gatherings.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full rounded px-3 py-2 text-xs focus:border-[#C9A96E] focus:outline-none pr-10 border ${
                      isLight
                        ? 'bg-white border-[#DDD5C6] text-[#1E1C18] placeholder:text-[#A69E90]'
                        : 'bg-white/[0.04] border-white/10 text-white placeholder:text-white/25'
                    }`}
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to allocations"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#C9A96E] hover:bg-[#DFC287] text-[#090A0D] rounded flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div
                className={`p-2.5 rounded border text-xs flex items-center gap-2 ${
                  isLight
                    ? 'bg-white border-[#C9A96E]/40 text-[#91723E]'
                    : 'bg-white/[0.04] border-[#C9A96E]/30 text-[#C9A96E]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enrolled in the 2026 Private Allocation.</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar: Quiet unboxed metadata */}
        <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${isLight ? 'text-[#7D766A]' : 'text-[#6B6862]'}`}>
          <div>
            © 2026 AURELIA Haute Parfumerie SAS. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className={`transition-colors ${isLight ? 'hover:text-[#1E1C18]' : 'hover:text-white'}`}>Privacy Policy</a>
            <span aria-hidden="true">·</span>
            <a href="#" className={`transition-colors ${isLight ? 'hover:text-[#1E1C18]' : 'hover:text-white'}`}>Terms of Service</a>
            <span aria-hidden="true">·</span>
            <a href="#" className={`transition-colors ${isLight ? 'hover:text-[#1E1C18]' : 'hover:text-white'}`}>Sourcing Transparency</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
