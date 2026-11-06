/**
 * White Caves Real Estate LLC - Task Workbench Execution Results
 * Standard: AEGIS Canonical 7-Category Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { TaskExecutionResult } from './TaskManager.workflow';

export interface TaskWorkbenchExecutionResultsProps {
  executionResult: TaskExecutionResult | null;
}

export const TaskWorkbenchExecutionResults: FC<TaskWorkbenchExecutionResultsProps> = ({
  executionResult,
}) => {
  if (!executionResult) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
        Click "Run Task Execution (δ)" to execute this task's atomic workflow.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stage 3: Output Key-Value Table */}
      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 font-mono text-[11px]">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Cpu size={12} className="text-sky-400" />
          <span>Stage 3: Generated Outputs & Artifacts</span>
        </div>
        {Object.entries(executionResult.outputs).map(([k, v]) => (
          <div
            key={k}
            className="flex justify-between items-center py-0.5 border-b border-slate-800/40"
          >
            <span className="text-slate-400">{k}:</span>
            <span className="text-emerald-300 font-semibold truncate max-w-[200px]">
              {typeof v === 'boolean' ? (v ? 'YES' : 'NO') : String(v)}
            </span>
          </div>
        ))}
      </div>

      {/* Stage 4: Verification Checklist */}
      <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-1">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck size={12} />
          Stage 4: Verification & Audit
        </span>
        {executionResult.auditNotes.map((note, i) => (
          <p key={i} className="text-[11px] text-slate-300 flex items-start gap-1">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>{note}</span>
          </p>
        ))}
      </div>
    </div>
  );
};
