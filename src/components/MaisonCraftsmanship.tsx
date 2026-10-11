import React from 'react';
import { Award, Compass, Feather } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const MaisonCraftsmanship: React.FC = () => {
  const { isLight } = useTheme();

  return (
    <section
      id="craftsmanship"
      className={`min-h-screen py-20 sm:py-28 relative border-t transition-colors duration-700 flex flex-col justify-center overflow-hidden ${
        isLight
          ? 'bg-[#F6F3EB] border-[#E8E2D5]'
          : 'bg-[#0B0C11] border-white/[0.06]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        
        {/* Section Lead */}
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
            L’Héritage & Savoir-Faire
          </span>
          <h2
            className={`text-3xl md:text-5xl font-serif leading-tight ${
              isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'
            }`}
          >
            The Philosophy of Slow Extraction.
          </h2>
          <p
            className={`text-base font-light leading-relaxed ${
              isLight ? 'text-[#635D52]' : 'text-[#9E9A90]'
            }`}
          >
            In an era of industrial acceleration, our atelier in Grasse champions patience.
            True olfactory luxury cannot be rushed: it requires seasonal moon cycles, cold enfleurage,
            and seasoned French Limousin oak.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-16">
          
          <div
            className={`p-6 sm:p-8 rounded-2xl border space-y-4 transition-colors ${
              isLight
                ? 'bg-white border-[#E5DFD2] hover:border-[#C9A96E]'
                : 'bg-white/[0.02] border-white/5 hover:border-[#C9A96E]/30'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 flex items-center justify-center text-[#C9A96E]">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}>
              Dawn Flower Harvest
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#696357]' : 'text-[#8C8880]'}`}>
              Between 5:00 AM and 8:00 AM, the volatile jasmine and May rose blossoms hold maximum moisture.
              Every petal is hand-plucked by multi-generational harvesters and transported immediately to copper stills.
            </p>
            <div className="text-[11px] text-[#C9A96E] font-mono tracking-wider pt-2">
              TERROIR: GRASSE, FRANCE
            </div>
          </div>

          <div
            className={`p-6 sm:p-8 rounded-2xl border space-y-4 transition-colors ${
              isLight
                ? 'bg-white border-[#E5DFD2] hover:border-[#C9A96E]'
                : 'bg-white/[0.02] border-white/5 hover:border-[#C9A96E]/30'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 flex items-center justify-center text-[#C9A96E]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}>
              Limousin Oak Maceration
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#696357]' : 'text-[#8C8880]'}`}>
              While conventional commercial fragrances macerate in stainless steel for only 14 days,
              our extraits mature for ninety full days in toasted Limousin oak barrels, eliminating ethanol sharpness.
            </p>
            <div className="text-[11px] text-[#C9A96E] font-mono tracking-wider pt-2">
              MATURATION: 90 DAYS / BARREL
            </div>
          </div>

          <div
            className={`p-6 sm:p-8 rounded-2xl border space-y-4 transition-colors ${
              isLight
                ? 'bg-white border-[#E5DFD2] hover:border-[#C9A96E]'
                : 'bg-white/[0.02] border-white/5 hover:border-[#C9A96E]/30'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 flex items-center justify-center text-[#C9A96E]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F5F2EB]'}`}>
              Artisanal Crystal & Brass
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#696357]' : 'text-[#8C8880]'}`}>
              Each flacon features a heavyweight 26mm crystal base and solid brass stopper.
              Our atelier chisels custom family monograms directly onto the golden front crest before wax sealing.
            </p>
            <div className="text-[11px] text-[#C9A96E] font-mono tracking-wider pt-2">
              FINISH: HAND-POLISHED BRASS
            </div>
          </div>

        </div>

        {/* Master Perfumer Editorial Quote Card */}
        <div
          className={`p-6 sm:p-10 md:p-12 rounded-2xl border relative overflow-hidden ${
            isLight
              ? 'bg-gradient-to-r from-[#FAF8F5] via-[#F1EADF] to-[#FAF8F5] border-[#E0D8CA]'
              : 'bg-gradient-to-r from-[#141620] via-[#111319] to-[#141620] border-white/10'
          }`}
        >
          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <span className="text-2xl text-[#C9A96E] font-serif">“</span>
            <blockquote
              className={`text-lg md:text-xl font-serif italic leading-relaxed ${
                isLight ? 'text-[#1E1C18]' : 'text-[#EAE6DD]'
              }`}
            >
              A bespoke fragrance is not merely an accessory; it is invisible architecture.
              It arrives moments before you enter a salon and whispers long after you have departed.
            </blockquote>
            <div className="pt-2">
              <cite className="not-italic text-xs tracking-[0.2em] uppercase text-[#C9A96E] font-medium block">
                Henri de Saint-Claire
              </cite>
              <span className={`text-[11px] ${isLight ? 'text-[#7D766A]' : 'text-[#807D75]'}`}>
                Master Nose & Creative Director, Grasse Atelier
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
