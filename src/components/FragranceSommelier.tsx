import React, { useState } from 'react';
import { X, ArrowRight, RotateCcw, Check, Sparkles, Droplets } from 'lucide-react';
import { Perfume } from '../types/perfume';
import { SOMMELIER_QUIZ } from '../data/perfumes';
import { PerfumeFlacon } from './PerfumeFlacon';
import { luxuryAudio } from '../utils/audio';

interface FragranceSommelierProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onSelectPerfume: (p: Perfume) => void;
  onQuickAdd: (p: Perfume, size: '50ml' | '100ml') => void;
}

export const FragranceSommelier: React.FC<FragranceSommelierProps> = ({
  isOpen,
  onClose,
  perfumes,
  onSelectPerfume,
  onQuickAdd,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [resultPerfume, setResultPerfume] = useState<Perfume | null>(null);
  const [isSpritzing, setIsSpritzing] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = SOMMELIER_QUIZ[currentStep];

  const handleSelectOption = (scentId: string) => {
    luxuryAudio.playTap();
    const updated = { ...selectedAnswers, [currentStep]: scentId };
    setSelectedAnswers(updated);

    if (currentStep < SOMMELIER_QUIZ.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate match
      calculateResult(updated);
    }
  };

  const calculateResult = (answers: Record<number, string>) => {
    // Count votes for each scentId
    const counts: Record<string, number> = {};
    Object.values(answers).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });

    let bestId = perfumes[0].id;
    let maxCount = -1;
    Object.entries(counts).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestId = id;
      }
    });

    const matched = perfumes.find((p) => p.id === bestId) || perfumes[0];
    setResultPerfume(matched);
    luxuryAudio.playChime(880, 0.1);
  };

  const handleReset = () => {
    luxuryAudio.playTap();
    setCurrentStep(0);
    setSelectedAnswers({});
    setResultPerfume(null);
  };

  const handleSpritz = () => {
    luxuryAudio.playSpritz();
    setIsSpritzing(true);
    setTimeout(() => setIsSpritzing(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#111319] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C9A96E] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Le Sommelier Olfactif</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close scent finder"
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Results Found */}
        {resultPerfume ? (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium">
                Your Bespoke Olfactory Match
              </span>
              <h3 className="text-3xl font-serif text-[#F8F6F0]">
                {resultPerfume.name}
              </h3>
              <p className="text-xs text-[#A8A49A] max-w-md mx-auto leading-relaxed">
                {resultPerfume.story}
              </p>
            </div>

            {/* Visual Flacon Display */}
            <div className="py-2 flex justify-center">
              <PerfumeFlacon
                perfume={resultPerfume}
                size="md"
                showSpritzEffect={isSpritzing}
                onSpritz={handleSpritz}
              />
            </div>

            {/* Key Notes Match Strip */}
            <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl max-w-md mx-auto text-xs text-[#B5B1A8] flex justify-center gap-3">
              <span>{resultPerfume.pyramid.top[0].name}</span>
              <span className="text-white/20">·</span>
              <span>{resultPerfume.pyramid.heart[0].name}</span>
              <span className="text-white/20">·</span>
              <span>{resultPerfume.pyramid.base[0].name}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  luxuryAudio.playChime();
                  onQuickAdd(resultPerfume, '100ml');
                  onClose();
                }}
                className="px-6 py-3 bg-[#C9A96E] hover:bg-[#DFC287] text-[#090A0D] text-xs font-semibold uppercase tracking-[0.18em] rounded transition-all shadow-md"
              >
                Acquire 100ml Flacon (${resultPerfume.price100ml})
              </button>

              <button
                onClick={() => {
                  onSelectPerfume(resultPerfume);
                  onClose();
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-[0.18em] font-medium rounded transition-all"
              >
                Examine Olfactory Pyramid
              </button>

              <button
                onClick={handleReset}
                className="p-3 text-[#8C8880] hover:text-white transition-colors flex items-center justify-center gap-1.5 text-xs"
                title="Restart Quiz"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Question Flow */
          <div className="space-y-6">
            {/* Step Progress indicators */}
            <div className="flex items-center justify-between text-xs text-[#8C8880]">
              <span className="tracking-widest uppercase">
                Step {currentStep + 1} of {SOMMELIER_QUIZ.length}
              </span>
              <div className="flex gap-1.5">
                {SOMMELIER_QUIZ.map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-1 rounded-full transition-colors ${
                      i <= currentStep ? 'bg-[#C9A96E]' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-serif text-[#F8F6F0]">
                {currentQuestion.question}
              </h3>
              <p className="text-xs text-[#9E9A90] font-light">
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option.scentId)}
                  className="w-full text-left p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-[#C9A96E]/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-[#F5F2EB] group-hover:text-[#C9A96E] transition-colors">
                      {option.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#C9A96E] transition-all group-hover:translate-x-1" />
                  </div>
                  <p className="text-xs text-[#87837A] mt-1 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs text-[#8C8880] hover:text-white transition-colors"
                >
                  ← Previous question
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
