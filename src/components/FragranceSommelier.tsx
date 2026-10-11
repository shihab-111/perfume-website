import React, { useState } from 'react';
import { X, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Perfume } from '../types/perfume';
import { SOMMELIER_QUIZ } from '../data/perfumes';
import { PerfumeFlacon } from './PerfumeFlacon';
import { useTheme } from '../context/ThemeContext';
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
  const { isLight } = useTheme();
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
      calculateResult(updated);
    }
  };

  const calculateResult = (answers: Record<number, string>) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border transition-colors ${
          isLight
            ? 'bg-[#FAF8F5] border-[#E2DDD2] text-[#1E1C18]'
            : 'bg-[#111319] border-white/10 text-[#E8E6E3]'
        }`}
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-4 mb-6 ${isLight ? 'border-[#EAE4D7]' : 'border-white/10'}`}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C9A96E] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Le Sommelier Olfactif</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close scent finder"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isLight
                ? 'text-black/50 hover:text-black hover:bg-black/5'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
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
              <h3 className={`text-3xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                {resultPerfume.name}
              </h3>
              <p className={`text-xs max-w-md mx-auto leading-relaxed ${isLight ? 'text-[#696357]' : 'text-[#A8A49A]'}`}>
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
            <div
              className={`p-3 border rounded-xl max-w-md mx-auto text-xs flex justify-center gap-3 ${
                isLight
                  ? 'bg-white border-[#E8E2D6] text-[#696357]'
                  : 'bg-white/[0.03] border-white/5 text-[#B5B1A8]'
              }`}
            >
              <span>{resultPerfume.pyramid.top[0].name}</span>
              <span className="opacity-30">·</span>
              <span>{resultPerfume.pyramid.heart[0].name}</span>
              <span className="opacity-30">·</span>
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
                className="px-6 py-3 bg-[#C9A96E] hover:bg-[#DFC287] text-[#090A0D] text-xs font-semibold uppercase tracking-[0.18em] rounded transition-all shadow-md cursor-pointer"
              >
                Acquire 100ml Flacon (${resultPerfume.price100ml})
              </button>

              <button
                onClick={() => {
                  onSelectPerfume(resultPerfume);
                  onClose();
                }}
                className={`px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium rounded transition-all cursor-pointer border ${
                  isLight
                    ? 'bg-black/5 hover:bg-black/10 border-[#DDD5C7] text-[#1E1C18]'
                    : 'bg-white/5 hover:bg-white/10 border-transparent text-white'
                }`}
              >
                Examine Olfactory Pyramid
              </button>

              <button
                onClick={handleReset}
                className={`p-3 transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer ${
                  isLight ? 'text-[#7D766A] hover:text-[#1E1C18]' : 'text-[#8C8880] hover:text-white'
                }`}
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
            <div className={`flex items-center justify-between text-xs ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
              <span className="tracking-widest uppercase">
                Step {currentStep + 1} of {SOMMELIER_QUIZ.length}
              </span>
              <div className="flex gap-1.5">
                {SOMMELIER_QUIZ.map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-1 rounded-full transition-colors ${
                      i <= currentStep ? 'bg-[#C9A96E]' : isLight ? 'bg-black/10' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <h3 className={`text-xl sm:text-2xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                {currentQuestion.question}
              </h3>
              <p className={`text-xs font-light ${isLight ? 'text-[#696357]' : 'text-[#9E9A90]'}`}>
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option.scentId)}
                  className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-[#F5EFE4] border-[#E5DFD2] hover:border-[#C9A96E]'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-[#C9A96E]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-serif text-base transition-colors ${
                      isLight ? 'text-[#1E1C18] group-hover:text-[#91723E]' : 'text-[#F5F2EB] group-hover:text-[#C9A96E]'
                    }`}>
                      {option.label}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-[#C9A96E] transition-all group-hover:translate-x-1" />
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-[#6E675B]' : 'text-[#87837A]'}`}>
                    {option.description}
                  </p>
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className={`text-xs transition-colors cursor-pointer ${isLight ? 'text-[#7D766A] hover:text-[#1E1C18]' : 'text-[#8C8880] hover:text-white'}`}
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
