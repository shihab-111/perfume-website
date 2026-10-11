import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Droplet, Sparkles, Sliders, Shield } from 'lucide-react';
import { Perfume, MacerationStage } from '../types/perfume';
import { PerfumeFlacon } from './PerfumeFlacon';
import { luxuryAudio } from '../utils/audio';

interface MacerationChamberProps {
  perfumes: Perfume[];
}

export const MacerationChamber: React.FC<MacerationChamberProps> = ({ perfumes }) => {
  const [selectedPerfumeId, setSelectedPerfumeId] = useState(perfumes[0].id);
  const [currentStageIndex, setCurrentStageIndex] = useState(3); // Default Day 90 (Finished)

  const selectedPerfume = perfumes.find((p) => p.id === selectedPerfumeId) || perfumes[0];
  const stages: MacerationStage[] = selectedPerfume.macerationStages || [
    {
      day: 0,
      label: 'Day 0: Initial Infusion',
      status: 'Raw Distillation',
      liquidColor: '#E2BD8A',
      liquidOpacity: 0.65,
      description: 'Raw cold extracts in neutral organic grain spirit.',
      accordDominance: 'High volatile citrus & ethanol',
    },
    {
      day: 30,
      label: 'Day 30: Oak Extraction',
      status: 'Wood Tannin Infusion',
      liquidColor: '#C88D4B',
      liquidOpacity: 0.8,
      description: 'Limousin oak casks soften ethanol and release lignin vanillin.',
      accordDominance: 'Aromatic wood & spice',
    },
    {
      day: 60,
      label: 'Day 60: Colloidal Binding',
      status: 'Resin Marriage',
      liquidColor: '#A85E22',
      liquidOpacity: 0.9,
      description: 'Precious animalic and floral absolutes reach suspension equilibrium.',
      accordDominance: 'Velvet floral & balsamic amber',
    },
    {
      day: 90,
      label: 'Day 90: Salon Equilibrium',
      status: 'Master Extrait Ready',
      liquidColor: '#5C2D0A',
      liquidOpacity: 1,
      description: 'Perfection achieved. Sovereign, non-drying 16-hour skin longevity.',
      accordDominance: 'Unbroken harmony of accords',
    },
  ];

  const currentStage = stages[currentStageIndex];

  // Clone perfume with dynamic liquid color corresponding to maceration stage
  const maceratedPerfume: Perfume = {
    ...selectedPerfume,
    liquidColor: currentStage.liquidColor,
  };

  const handleStageChange = (idx: number) => {
    luxuryAudio.playTap();
    setCurrentStageIndex(idx);
  };

  return (
    <section className="py-24 relative bg-[#08090D] border-t border-white/[0.06] overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none opacity-25 transition-all duration-700"
        style={{ background: currentStage.liquidColor }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
              Le Laboratoire de Maceration
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F8F6F0]">
              The 90-Day Oak Maturation
            </h2>
            <p className="text-sm text-[#9E9A90] max-w-xl font-light leading-relaxed">
              Witness how time, charred Limousin French oak, and patience transform volatile botanicals into a sovereign extrait. Scrub through the ninety-day journey below.
            </p>
          </div>

          {/* Perfume Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-lg shrink-0 overflow-x-auto">
            {perfumes.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  luxuryAudio.playTap();
                  setSelectedPerfumeId(p.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  p.id === selectedPerfumeId
                    ? 'bg-[#C9A96E] text-[#090A0D]'
                    : 'text-[#B0ACA2] hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Lab Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#0F1118]/90 border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl backdrop-blur-md">
          
          {/* Left Flacon Visualizer with Liquid Alchemy */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-6 relative">
            <div className="absolute w-72 h-72 rounded-full border border-white/5 animate-halo pointer-events-none" />

            <motion.div
              key={`${selectedPerfume.id}-${currentStageIndex}`}
              initial={{ scale: 0.96, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <PerfumeFlacon
                perfume={maceratedPerfume}
                size="hero"
                interactive={true}
              />
            </motion.div>

            {/* Dynamic Status Tag */}
            <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-[#E8E4DA]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStage.liquidColor }} />
              <span className="font-serif">{currentStage.status}</span>
              <span className="text-white/30">·</span>
              <span className="font-mono text-[#C9A96E] tabular-nums">Day {currentStage.day}</span>
            </div>
          </div>

          {/* Right Column: Interactive Timeline Controls & Chemical Notes */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Interactive Timeline Stepper */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-[#8C8880] uppercase tracking-wider">
                <span>Select Maturation Stage</span>
                <span className="font-mono text-[#C9A96E]">Day {currentStage.day} of 90</span>
              </div>

              {/* Progress Slider Track with 4 Keyframes */}
              <div className="relative pt-2 pb-6">
                <div className="h-1.5 bg-white/10 rounded-full relative">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                      backgroundColor: '#C9A96E',
                    }}
                  />
                </div>

                {/* 4 Clickable Step Nodes */}
                <div className="absolute top-0 inset-x-0 flex justify-between">
                  {stages.map((stage, idx) => (
                    <button
                      key={stage.day}
                      onClick={() => handleStageChange(idx)}
                      className="group flex flex-col items-center focus:outline-none cursor-pointer"
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          idx === currentStageIndex
                            ? 'bg-[#C9A96E] border-[#FFF2D6] scale-125 shadow-[0_0_12px_#C9A96E]'
                            : idx < currentStageIndex
                            ? 'bg-[#C9A96E]/40 border-[#C9A96E]'
                            : 'bg-[#141620] border-white/20 hover:border-white/50'
                        }`}
                      >
                        <span className="text-[9px] font-mono font-bold text-[#090A0D]">
                          {stage.day === 0 ? '0' : stage.day}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] mt-2 whitespace-nowrap transition-colors ${
                          idx === currentStageIndex ? 'text-[#F5F2EB] font-medium' : 'text-[#7A766F]'
                        }`}
                      >
                        Day {stage.day}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage Description Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-xl bg-white/[0.03] border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#C9A96E] font-medium block">
                      Phase {currentStageIndex + 1}
                    </span>
                    <h3 className="text-xl font-serif text-[#F8F6F0]">
                      {currentStage.label}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-[#8C8880] px-2.5 py-1 rounded bg-black/40 border border-white/5">
                    {currentStage.status}
                  </span>
                </div>

                <p className="text-sm text-[#A8A49A] leading-relaxed font-light">
                  {currentStage.description}
                </p>

                {/* Chemical & Olfactory Dynamics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <span className="text-[#87837A] text-[11px] uppercase tracking-wider block">
                      Olfactory Equilibrium
                    </span>
                    <span className="text-[#E0DCCE] font-serif block">
                      {currentStage.accordDominance}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <span className="text-[#87837A] text-[11px] uppercase tracking-wider block">
                      Ethanol Neutralization
                    </span>
                    <span className="text-[#C9A96E] font-mono block">
                      {currentStageIndex === 0 ? '0% (Raw Spirit)' : currentStageIndex === 1 ? '35% (Oak Softened)' : currentStageIndex === 2 ? '78% (Velvet Core)' : '100% (Sublime Esters)'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Savoir-Faire Seal */}
            <div className="flex items-center gap-3 text-xs text-[#8C8880] pt-2">
              <Shield className="w-4 h-4 text-[#C9A96E] shrink-0" />
              <span>Certified under French Haute Parfumerie Charter: strictly aged in French oak without artificial colorants or chemical accelerators.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
