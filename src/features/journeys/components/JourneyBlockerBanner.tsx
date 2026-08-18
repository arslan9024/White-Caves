import React from 'react';
import { BlockerIssue } from '../../../types/journey';

interface JourneyBlockerBannerProps {
  blockers: BlockerIssue[];
  onResolveBlocker: (stepId: string) => void;
}

export const JourneyBlockerBanner: React.FC<JourneyBlockerBannerProps> = ({
  blockers,
  onResolveBlocker
}) => {
  if (!blockers || blockers.length === 0) return null;

  const errorBlockers = blockers.filter(b => b.severity === 'error');
  const warningBlockers = blockers.filter(b => b.severity === 'warning');

  return (
    <div className="mx-6 mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-rose-950/70 border border-amber-500/40 shadow-lg animate-fadeIn text-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg font-bold">
            ⚠
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-300">
              Why am I blocked?
            </h4>
            <p className="text-xs text-slate-300">
              {errorBlockers.length > 0 
                ? `${errorBlockers.length} mandatory item${errorBlockers.length > 1 ? 's' : ''} require attention before you can advance.`
                : `${warningBlockers.length} advisory item${warningBlockers.length > 1 ? 's' : ''} recommended for completeness.`}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          {blockers.length} {blockers.length === 1 ? 'Item' : 'Items'} Pending
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {blockers.map((issue) => (
          <div
            key={issue.id}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-amber-500/40 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <span className={`w-2 h-2 rounded-full ${issue.severity === 'error' ? 'bg-rose-500' : 'bg-amber-400'}`}></span>
              <div>
                <div className="text-xs font-semibold text-slate-200">{issue.title}</div>
                <div className="text-[11px] text-slate-400">{issue.description}</div>
              </div>
            </div>

            <button
              onClick={() => onResolveBlocker(issue.stepId)}
              className="px-3 py-1 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-all shadow-sm flex items-center gap-1"
            >
              <span>{issue.actionLabel}</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
