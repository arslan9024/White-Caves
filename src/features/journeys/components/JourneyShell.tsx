import React, { useState } from 'react';
import { JourneyDefinition, JourneySession } from '../../../types/journey';
import { JourneyEngineService } from '../../../services/journeys/journeyEngineService';
import { JourneyHeader } from './JourneyHeader';
import { JourneyBlockerBanner } from './JourneyBlockerBanner';
import { StepRenderer } from './StepRenderer';

interface JourneyShellProps {
  definition: JourneyDefinition;
  initialSession?: JourneySession;
  isOpen: boolean;
  onClose: () => void;
  onLaunchJourney?: (journeyId: string) => void;
}

export const JourneyShell: React.FC<JourneyShellProps> = ({
  definition,
  initialSession,
  isOpen,
  onClose,
  onLaunchJourney
}) => {
  const [session, setSession] = useState<JourneySession>(() => {
    return initialSession || JourneyEngineService.createSession(definition);
  });

  if (!isOpen) return null;

  const currentStep = definition.steps[session.currentStepIndex];
  const isFirstStep = session.currentStepIndex === 0;
  const isLastStep = session.currentStepIndex === definition.steps.length - 1;
  const isProcessing = currentStep?.type === 'processing';
  const isResult = currentStep?.type === 'result';

  const handleUpdateData = (patch: Record<string, any>) => {
    const updated = JourneyEngineService.updateSessionData(session, definition, patch);
    setSession(updated);
  };

  const handleNext = () => {
    const { session: updated, blocked } = JourneyEngineService.nextStep(session, definition);
    setSession(updated);
  };

  const handlePrev = () => {
    const updated = JourneyEngineService.prevStep(session, definition);
    setSession(updated);
  };

  const handleJumpToStep = (stepId: string) => {
    const updated = JourneyEngineService.jumpToStep(session, definition, stepId);
    setSession(updated);
  };

  const handleCompleteOutcome = (resultOutcome: any) => {
    const updated = JourneyEngineService.completeJourney(session, resultOutcome);
    setSession(updated);
    // Advance to result step
    const nextIdx = definition.steps.findIndex(s => s.type === 'result');
    if (nextIdx >= 0) {
      setSession(prev => ({ ...prev, currentStepIndex: nextIdx }));
    }
  };

  const handleLaunchNext = (targetJourneyId: string) => {
    if (onLaunchJourney) {
      onLaunchJourney(targetJourneyId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Master Header */}
        <JourneyHeader
          definition={definition}
          session={session}
          onSaveAndClose={onClose}
          onJumpToStep={handleJumpToStep}
        />

        {/* Dynamic Blocker Resolution Banner */}
        <JourneyBlockerBanner
          blockers={session.blockers}
          onResolveBlocker={handleJumpToStep}
        />

        {/* Step Content Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <StepRenderer
            step={currentStep}
            session={session}
            definition={definition}
            onUpdateData={handleUpdateData}
            onNext={handleNext}
            onComplete={handleCompleteOutcome}
            onLaunchNextJourney={handleLaunchNext}
          />
        </div>

        {/* Footer Navigation Bar */}
        {!isProcessing && !isResult && (
          <div className="bg-slate-900/90 border-t border-slate-800 p-4 px-6 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                isFirstStep
                  ? 'opacity-30 border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
              }`}
            >
              ← Previous Step
            </button>

            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {session.blockers.length > 0 ? (
                  <span className="text-amber-400 font-medium">
                    ⚠ {session.blockers.length} item{session.blockers.length > 1 ? 's' : ''} require attention
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">✓ Step validated</span>
                )}
              </span>

              <button
                onClick={handleNext}
                className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all shadow-md flex items-center gap-1.5 ${
                  session.blockers.some(b => b.stepId === currentStep.id && b.severity === 'error')
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:scale-[1.02]'
                }`}
              >
                <span>{currentStep.type === 'smart-review' ? '🚀 Generate Contract' : 'Continue'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {isResult && (
          <div className="bg-slate-900/90 border-t border-slate-800 p-4 px-6 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Outcome recorded to record lifecycle
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md"
            >
              Finish & Close Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
