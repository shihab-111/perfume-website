import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    luxuryAudio.playChime(784, 0.08);
    setIsSubscribed(true);
  };

  return (
    <footer className="bg-[#07080B] text-[#9E9A90] border-t border-white/[0.08] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-2xl font-serif tracking-[0.25em] text-[#F8F6F0] block">
              AURELIA
            </span>
            <p className="text-xs text-[#87837A] leading-relaxed max-w-sm">
              Maison de Haute Parfumerie fondée à Grasse.
              Distilling rare botanicals and aged resins into sovereign extrait compositions.
            </p>
            <div className="text-[11px] text-[#C9A96E] font-medium tracking-widest uppercase">
              Paris · Grasse · London · Tokyo
            </div>
          </div>

          {/* Boutique Salons Col */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="text-[#F8F6F0] font-medium tracking-wider uppercase text-[11px] block">
              Private Salons
            </span>
            <div className="space-y-2 text-[#87837A]">
              <div>
                <span className="text-white block font-serif">Paris</span>
                <span>28 Rue Saint-Honoré, 75001</span>
              </div>
              <div>
                <span className="text-white block font-serif">London</span>
                <span>14 Mount Street, Mayfair</span>
              </div>
              <div>
                <span className="text-white block font-serif">Tokyo</span>
                <span>6-10-1 Ginza, Chuo-ku</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <span className="text-[#F8F6F0] font-medium tracking-wider uppercase text-[11px] block">
              Maison
            </span>
            <ul className="space-y-2 text-[#87837A]">
              <li>
                <a href="#creations" className="hover:text-white transition-colors">Les Extraits</a>
              </li>
              <li>
                <a href="#olfactory-pyramid" className="hover:text-white transition-colors">Olfactory Pyramid</a>
              </li>
              <li>
                <a href="#discovery-set" className="hover:text-white transition-colors">Discovery Coffret</a>
              </li>
              <li>
                <a href="#craftsmanship" className="hover:text-white transition-colors">Atelier Grasse</a>
              </li>
            </ul>
          </div>

          {/* Private Allocation Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[#F8F6F0] font-medium tracking-wider uppercase text-[11px] block">
              Private Allocations
            </span>
            <p className="text-xs text-[#87837A] leading-relaxed">
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
                    className="w-full bg-white/[0.04] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder:text-white/25 focus:border-[#C9A96E] focus:outline-none pr-10"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to allocations"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#C9A96E] hover:bg-[#DFC287] text-[#090A0D] rounded flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-2.5 rounded bg-white/[0.04] border border-[#C9A96E]/30 text-xs text-[#C9A96E] flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>Enrolled in the 2026 Private Allocation.</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar: Quiet unboxed metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6862]">
          <div>
            © 2026 AURELIA Haute Parfumerie SAS. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span aria-hidden="true">·</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span aria-hidden="true">·</span>
            <a href="#" className="hover:text-white transition-colors">Sourcing Transparency</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
