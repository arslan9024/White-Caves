/**
 * White Caves Real Estate LLC - Task Execution Workbench (Modal / Inline View)
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View / Interactive Workbench)
 * Architecture: Pure 4-Stage I-P-O-V (Input -> Process -> Output -> Verify)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import {
  X,
  Play,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  Award,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import type { TaskNode } from './TaskManager.types';
import { executeTaskFunctionalRunWorkflow, TaskExecutionResult } from './TaskManager.workflow';
import { getDefaultInputsForTask } from './taskDefaultInputs.data';
import { StatutoryWizardModal, StatutoryFlowType } from '../StatutoryWizards';
import { RUPUseCaseDossierView } from './RUPUseCaseDossierView';
import { TaskWorkbenchExecutionResults } from './TaskWorkbenchExecutionResults';

export interface TaskExecutionWorkbenchProps {
  task: TaskNode | null;
  onClose: () => void;
  onComplete: (taskId: string, awardedXp: number) => void;
  isInline?: boolean;
}

function getMatchingStatutoryFlow(task: TaskNode | null): StatutoryFlowType | null {
  if (!task) return null;
  const c = `${task.taskCode} ${task.title}`.toUpperCase();
  if (c.includes('EJARI') || c.includes('LEASE')) return 'EJARI_TENANCY_ATTESTATION';
  if (c.includes('FORM A') || c.includes('LISTING')) return 'FORM_A_SELLER_AGREEMENT';
  if (c.includes('FORM B') || c.includes('BUYER')) return 'FORM_B_BUYER_AGREEMENT';
  if (c.includes('FORM F') || c.includes('MOU') || c.includes('SALE')) return 'FORM_F_SALE_MOU';
  if (c.includes('PDC') || c.includes('CHEQUE')) return 'PDC_CHEQUE_REGISTRATION';
  if (c.includes('TITLE') || c.includes('DEED')) return 'TITLE_DEED_VERIFICATION';
  if (c.includes('VAT') || c.includes('TAX') || c.includes('TRN')) return 'FTA_VAT_TAX_INVOICE';
  return null;
}

export const TaskExecutionWorkbench: FC<TaskExecutionWorkbenchProps> = ({
  task,
  onClose,
  onComplete,
  isInline = false,
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>(() => getDefaultInputsForTask(task));
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionResult, setExecutionResult] = useState<TaskExecutionResult | null>(null);
  const [isStatutoryWizardOpen, setIsStatutoryWizardOpen] = useState(false);
  const [activeWorkbenchTab, setActiveWorkbenchTab] = useState<'execution' | 'usecase'>(
    'execution'
  );
  const matchingFlow = getMatchingStatutoryFlow(task);

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

  const cardContent = (
    <>
      {/* Top Inline Back Navigation Banner */}
      {isInline && (
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            data-testid="task-back-btn"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowLeft size={15} />
            <span>← Back to Tasks Catalog</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">Active Task · {task.taskCode}</span>
        </div>
      )}

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
        {!isInline && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Tab Switcher: Execution Engine vs RUP Use Case Dossier */}
      <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveWorkbenchTab('execution')}
          className={`px-3 py-1 rounded-lg font-bold transition-all ${
            activeWorkbenchTab === 'execution'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
          data-testid="tab-execution-engine"
        >
          ⚡ Functional Execution Engine (I-P-O-V)
        </button>
        <button
          type="button"
          onClick={() => setActiveWorkbenchTab('usecase')}
          className={`px-3 py-1 rounded-lg font-bold transition-all ${
            activeWorkbenchTab === 'usecase'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
          data-testid="tab-rup-usecase-dossier"
        >
          📑 RUP Use Case Dossier Specification
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeWorkbenchTab === 'usecase' ? (
          <RUPUseCaseDossierView task={task} />
        ) : (
          <>
            {/* Meta Lineage Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-sky-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">
                    Pillar
                  </span>
                  <span className="text-xs font-bold text-white">
                    {task.pillarName || task.pillarId}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <Layers size={16} className="text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">
                    Category
                  </span>
                  <span className="text-xs font-bold text-white">{task.category}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <Clock size={16} className="text-purple-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">
                    Default SLA
                  </span>
                  <span className="text-xs font-bold text-white">{task.defaultSla || '24h'}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <Award size={16} className="text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">
                    Merit Reward
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    +{task.priority === 'CRITICAL' ? '250' : '100'} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Statutory Wizard Button */}
            {matchingFlow && (
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                    <FileText size={14} />
                    Official Government Statutory Wizard Available
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Execute authenticated DLD/RERA/FTA document workflow and generate attestation
                    token.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStatutoryWizardOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  data-testid="open-statutory-wizard-btn"
                >
                  Launch Official Wizard
                </button>
              </div>
            )}

            {/* 4-Stage Execution Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Stage 1 & 2 */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Stage 1: Input Parameters
                </h3>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  {Object.keys(inputs).map(key => (
                    <div key={key}>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        {key}:
                      </label>
                      <input
                        type="text"
                        value={inputs[key]}
                        onChange={e => setInputs({ ...inputs, [key]: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleRunExecution}
                    disabled={isProcessing}
                    className="w-full mt-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    data-testid="run-task-execution-btn"
                  >
                    <Play size={14} />
                    <span>
                      {isProcessing ? 'Processing Execution Engine...' : 'Run Task Execution (δ)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Stage 3 & 4 */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Stage 3 & 4: Execution Results & Verification
                </h3>
                <TaskWorkbenchExecutionResults executionResult={executionResult} />

                {executionResult && (
                  <button
                    onClick={handleConfirmCompletion}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Confirm Delivery & Award +{executionResult.awardedXp} Merit XP</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {matchingFlow && (
        <StatutoryWizardModal
          isOpen={isStatutoryWizardOpen}
          onClose={() => setIsStatutoryWizardOpen(false)}
          flowType={matchingFlow}
          targetId={task.taskCode}
          targetTitle={task.title}
          onComplete={({ resultToken, formData }) => {
            setInputs(prev => ({ ...prev, ...formData, deliverableResultToken: resultToken }));
            setExecutionResult({
              success: true,
              taskId: task._id,
              taskCode: task.taskCode,
              status: 'COMPLETED',
              awardedXp: task.priority === 'CRITICAL' ? 250 : 100,
              outputs: { deliverableResultToken: resultToken, ...formData },
              verificationPassed: true,
              auditNotes: [
                `Statutory Authority attestation successfully passed for ${resultToken}.`,
                `Attested and signed by ${task.reportingChain?.supervisorName || 'Supervisory Lead'}.`,
              ],
            });
          }}
        />
      )}
    </>
  );

  if (isInline) {
    return (
      <div data-testid="task-detail-main-view" className="w-full pb-6">
        <div
          data-testid="task-execution-workbench"
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      data-testid="task-execution-workbench"
    >
      <div
        data-testid="task-execution-card"
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {cardContent}
      </div>
    </div>
  );
};
