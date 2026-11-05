/**
 * White Caves Real Estate LLC - Task Execution Workbench
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View / Interactive Workbench)
 * Architecture: Pure 4-Stage I-P-O-V (Input -> Process -> Output -> Verify)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  Award,
  Layers,
  Cpu,
} from 'lucide-react';
import type { TaskNode } from './TaskManager.types';
import { executeTaskFunctionalRunWorkflow, TaskExecutionResult } from './TaskManager.workflow';

interface TaskExecutionWorkbenchProps {
  task: TaskNode | null;
  onClose: () => void;
  onComplete: (taskId: string, awardedXp: number) => void;
}

function getDefaultInputsForTask(task: TaskNode | null): Record<string, string> {
  if (!task) return {};
  const c = task.taskCode.toUpperCase();
  if (c.includes('DOC-001') || c.includes('TITLE')) {
    return {
      plotNumber: 'PLT-58204-DH2',
      ownerName: 'White Caves Real Estate Holdings LLC',
      areaSqm: '482.50',
      municipality: 'DAMAC Hills 2 (Akoya Oxygen)',
    };
  }
  if (c.includes('DOC-002') || c.includes('EID')) {
    return {
      idNumber: '784-1988-1234567-1',
      holderName: 'Rashid Bin Dhaen',
      nationality: 'United Arab Emirates',
      dob: '1988-06-14',
    };
  }
  if (c.includes('DOC-003') || c.includes('PASSPORT')) {
    return {
      passportNumber: 'N9824102',
      holderName: 'David Alexander Vance',
      nationality: 'United Kingdom',
      issuingCountry: 'GBR',
    };
  }
  if (c.includes('DOC-004') || c.includes('CONTRACT') || c.includes('EJARI')) {
    return {
      annualRent: '145000',
      cheques: '4',
      tenantName: 'Dr. Julian Thorne',
      securityDeposit: '7250',
    };
  }
  if (c.includes('FIN-001') || c.includes('ESCROW')) {
    return {
      projectCode: 'PRJ-DLD-2026-904',
      escrowBalanceAED: '48500000',
      constructionMilestone: '74.5',
      escrowBank: 'Emirates NBD Trustee Branch',
    };
  }
  if (c.includes('FIN-002') || c.includes('VAT')) {
    return {
      standardRatedSupplies: '3200000',
      inputTaxRecoverable: '42000',
      trnNumber: '100-4820-9182-0003',
      taxPeriod: '2026-Q3',
    };
  }
  if (c.includes('FIN-003') || c.includes('PDC') || c.includes('CHEQUE')) {
    return {
      chequesCount: '4',
      totalAmountAED: '145000',
      drawerBank: 'First Abu Dhabi Bank (FAB)',
    };
  }
  if (c.includes('CRM-001') || c.includes('WHATSAPP')) {
    return {
      recipientPhone: '+971501234567',
      clientName: 'Rashid Al-Maktoum',
      templateName: 'whitecaves_exclusive_luxury_villa_preview',
    };
  }
  if (c.includes('PORTAL-001') || c.includes('PORTAL') || c.includes('BAYUT')) {
    return {
      trakheesiPermit: 'TRAK-7194029-A',
      listingPriceAED: '4200000',
      propertyLocation: 'Palm Jumeirah Signature Villa',
    };
  }
  if (c.includes('VAL-001') || c.includes('VALUATION')) {
    return {
      location: 'Downtown Dubai / Burj Crown',
      areaSqft: '2850',
      ratePerSqft: '1850',
    };
  }
  if (c.includes('SEC-001') || c.includes('BIOMETRIC')) {
    return {
      userEmail: 'managing.director@whitecaves.ae',
      authMethod: 'FIDO2 WebAuthn Biometric Enclave',
    };
  }
  return {
    referenceNumber: `REF-${task.taskCode}`,
    operationalNotes: `Standard processing under ${task.reportingChain.supervisorName}`,
    targetSla: task.defaultSla,
  };
}

export const TaskExecutionWorkbench: FC<TaskExecutionWorkbenchProps> = ({
  task,
  onClose,
  onComplete,
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>(() => getDefaultInputsForTask(task));
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionResult, setExecutionResult] = useState<TaskExecutionResult | null>(null);

  if (!task) return null;

  const handleRunExecution = () => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const res = executeTaskFunctionalRunWorkflow(task, inputs);
        setExecutionResult(res);
      } finally {
        setIsProcessing(false);
      }
    }, 300);
  };

  const handleConfirmCompletion = () => {
    if (!executionResult) return;
    onComplete(task._id, executionResult.awardedXp);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      data-testid="task-execution-workbench"
    >
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {task.taskCode}
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {task.title}
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  L5 Task
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Turing Discrete State Machine • 4-Stage I-P-O-V Functional Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workbench Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500">Authority</span>
              <p className="text-xs font-bold text-emerald-400 mt-0.5">
                {task.statutoryAuthority || 'RERA / DLD'}
              </p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500">SLA Cadence</span>
              <p className="text-xs font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                <Clock size={12} /> {task.defaultSla}
              </p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Supervisor (L3)
              </span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                {task.reportingChain.supervisorName}
              </p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500">Merit Points</span>
              <p className="text-xs font-black text-amber-400 mt-0.5 flex items-center gap-1">
                <Award size={12} /> +{task.priority === 'CRITICAL' ? 135 : 68} XP
              </p>
            </div>
          </div>

          {/* Execution Triad: Actor • Action • Results */}
          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-400 block">
                Designated Actor
              </span>
              <span className="text-slate-200 font-medium">{task.actor}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block">
                Operational Action
              </span>
              <span className="text-slate-300">{task.action}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                Expected Results
              </span>
              <span className="text-slate-400">{task.results}</span>
            </div>
          </div>

          {/* 4-Stage Workflow Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stage 1: Inputs */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-400" />
                  Stage 1: Input Parameters
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Turing Verified</span>
              </div>
              <div className="space-y-2">
                {Object.entries(inputs).map(([k, v]) => (
                  <div key={k} className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-400 font-mono">
                      {k}
                    </label>
                    <input
                      type="text"
                      value={v}
                      onChange={e => setInputs(prev => ({ ...prev, [k]: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleRunExecution}
                disabled={isProcessing}
                className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Cpu size={14} className="animate-spin" />
                    <span>Processing Task State Machine...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Run Task Execution (δ)</span>
                  </>
                )}
              </button>
            </div>

            {/* Stage 3 & 4: Output & Verification */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-400" />
                    Stage 3: Output Artifacts
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {executionResult ? 'COMPLETED' : 'AWAITING RUN'}
                  </span>
                </div>

                {executionResult ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                      {Object.entries(executionResult.outputs).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-500">{k}:</span>
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
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                    Click "Run Task Execution (δ)" to execute this task's atomic workflow.
                  </div>
                )}
              </div>

              {/* Confirm Completion */}
              {executionResult && (
                <button
                  onClick={handleConfirmCompletion}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles size={14} />
                  <span>Confirm Delivery & Award +{executionResult.awardedXp} Merit XP</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
