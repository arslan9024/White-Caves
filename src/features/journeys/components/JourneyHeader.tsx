import React from 'react';
import { JourneyDefinition, JourneySession } from '../../../types/journey';

interface JourneyHeaderProps {
  definition: JourneyDefinition;
  session: JourneySession;
  onSaveAndClose: () => void;
  onJumpToStep: (stepId: string) => void;
}

export const JourneyHeader: React.FC<JourneyHeaderProps> = ({
  definition,
  session,
  onSaveAndClose,
  onJumpToStep
}) => {
  const totalSteps = definition.steps.length;
  const currentStepNum = session.currentStepIndex + 1;
  const activeStep = definition.steps[session.currentStepIndex];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700/60 p-5 rounded-t-2xl text-slate-100">
      {/* Top Bar: Title, Category Badge, Auto-Save & Close */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
            {definition.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-wide">{definition.title}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20 font-medium uppercase tracking-wider">
                {definition.family}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{definition.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto-saved
            </span>
          </div>
          <button
            onClick={onSaveAndClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 rounded-lg transition-all shadow-sm"
          >
            Save & Exit
          </button>
        </div>
      </div>

      {/* Step Sequence Breadcrumbs / Missions */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
        {definition.steps.map((step, idx) => {
          const status = session.stepStatuses[step.id] || 'LOCKED';
          const isCurrent = idx === session.currentStepIndex;
          const isCompleted = status === 'COMPLETED';
          const isBlocked = status === 'BLOCKED';

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => (isCompleted || isCurrent) && onJumpToStep(step.id)}
                disabled={status === 'LOCKED'}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20 scale-105'
                    : isCompleted
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
                    : isBlocked
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900/60'
                    : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 cursor-not-allowed opacity-60'
                }`}
              >
                <span>
                  {isCompleted ? '✓' : isBlocked ? '⚠' : idx + 1}
                </span>
                <span>{step.shortLabel || step.title}</span>
              </button>
              {idx < totalSteps - 1 && (
                <span className="text-slate-600 text-xs select-none">━</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Metric & Readiness Bar */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-300">
            Step {currentStepNum} of {totalSteps} — {activeStep?.title}
          </span>
          {activeStep?.milestoneTag && (
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-medium">
              🎯 {activeStep.milestoneTag}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 min-w-[200px]">
          <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                session.readinessScore >= 90
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : session.readinessScore >= 50
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-400'
              }`}
              style={{ width: `${session.readinessScore}%` }}
            />
          </div>
          <span className="font-bold text-slate-200 min-w-[55px] text-right">
            {session.readinessScore}% Ready
          </span>
        </div>
      </div>
    </div>
  );
};
