// FILE: src/components/crm/EmployeeManager/EmployeeManager.fallback.tsx
/**
 * White Caves Real Estate LLC - EmployeeManager Granular Failure Boundary (Tier 8)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { ShieldAlert, RotateCcw, ArrowLeft } from 'lucide-react';

export interface EmployeeManagerFallbackProps {
  error: string;
  errorId?: string;
  onRetry: () => void;
  onNavigateBack?: () => void;
}

export const EmployeeManagerFallback: FC<EmployeeManagerFallbackProps> = ({
  error,
  errorId = 'ERR-EMP-001',
  onRetry,
  onNavigateBack,
}) => {
  return (
    <div
      className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 backdrop-blur shadow-2xl space-y-4 max-w-2xl mx-auto my-8 text-xs font-sans"
      data-testid="employee-manager-fallback"
    >
      <div className="flex items-center justify-between pb-3 border-b border-rose-800/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
              Granular Failure Boundary (Tier 8)
            </span>
            <h3 className="text-base font-bold text-white">Personnel Roster Execution Error</h3>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
          {errorId}
        </span>
      </div>

      <p className="text-rose-300 text-xs leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-rose-900/50 font-mono">
        {error}
      </p>

      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px] space-y-1">
        <span className="font-bold text-slate-300 block">Autopilot Isolation Guarantee:</span>
        <p>
          This failure boundary prevented global dashboard router termination. Sovereign personnel
          records remain secured in local cache.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/20 cursor-pointer"
          data-testid="employee-fallback-retry-btn"
        >
          <RotateCcw size={14} />
          <span>Recover Personnel Workspace</span>
        </button>
        {onNavigateBack && (
          <button
            type="button"
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
            data-testid="employee-fallback-back-btn"
          >
            <ArrowLeft size={14} />
            <span>Return to Pipeline</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagerFallback;
