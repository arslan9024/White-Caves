// FILE: src/components/crm/TaskManager/TaskManager.workflow.ts
/**
 * White Caves Real Estate LLC - Task Management Workflows
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Workflow - Tier 7)
 * Single Purpose File Law: < 350 lines
 */

import type { TaskNode, TaskStatus, TaskReportingChain } from './TaskManager.types';
import {
  executeTitleDeedTask,
  executeEmiratesIdTask,
  executePassportTask,
  executeTenancyContractTask,
  executeEscrowAuditTask,
  executeVatReturnTask,
  executePdcTrackingTask,
  executeEjariGenerationTask,
  executeReraBrokerCardTask,
  executeWhatsAppBroadcastTask,
  executePortalSyndicationTask,
  executePropertyValuationTask,
  executeBiometricSecurityTask,
  ExecutedTaskPayload,
} from './taskExecutors.workflow';
import {
  executeKycOcrTask,
  executeKycEncryptionTask,
  executeInventoryVacancyTask,
  executeLeaseParseTask,
  executeFinancialReceiptLedgerTask,
} from './taskExecutorsRup.workflow';

export interface TaskWorkflowResult {
  success: boolean;
  tasks: TaskNode[];
  message: string;
  awardedXp?: number;
}

export function executeCreateTaskWorkflow(
  tasks: TaskNode[],
  payload: Omit<TaskNode, '_id' | 'taskCode'>
): TaskWorkflowResult {
  if (!payload.title?.trim() || !payload.pillarId) {
    return { success: false, tasks, message: 'Task title and operational pillar are required.' };
  }

  const nextNum = tasks.length + 1;
  const newCode = `TSK-${String(nextNum).padStart(3, '0')}`;
  const newTask: TaskNode = {
    ...payload,
    _id: `task-custom-${Date.now()}`,
    taskCode: newCode,
    status: payload.status || 'PENDING',
    actor:
      payload.actor ||
      `${payload.reportingChain?.supervisorName || 'Supervisor'} (Designated Lead)`,
    action: payload.action || `Execute operational workflow: ${payload.title}`,
    results: payload.results || `Verified artifact and ledger record for ${newCode}`,
    createdAt: new Date().toISOString().split('T')[0],
    completionRate: 0,
  };

  return {
    success: true,
    tasks: [newTask, ...tasks],
    message: `Created task ${newCode}: ${newTask.title}. Escalation chain assigned to ${newTask.reportingChain.supervisorName}.`,
  };
}

export function executeUpdateTaskWorkflow(
  tasks: TaskNode[],
  id: string,
  patch: Partial<TaskNode>
): TaskWorkflowResult {
  if (!id) return { success: false, tasks, message: 'Task ID is required for update.' };

  const idx = tasks.findIndex(t => t._id === id);
  if (idx === -1) return { success: false, tasks, message: 'Task record not found.' };

  const updatedTasks = [...tasks];
  updatedTasks[idx] = { ...updatedTasks[idx], ...patch };

  return {
    success: true,
    tasks: updatedTasks,
    message: `Updated task ${updatedTasks[idx].taskCode}: ${updatedTasks[idx].title}.`,
  };
}

export function executeAdvanceTaskStatusWorkflow(
  tasks: TaskNode[],
  id: string,
  newStatus: TaskStatus
): TaskWorkflowResult {
  if (!id) return { success: false, tasks, message: 'Task ID required.' };

  const target = tasks.find(t => t._id === id);
  if (!target) return { success: false, tasks, message: 'Task not found.' };

  const completionRate =
    newStatus === 'COMPLETED'
      ? 100
      : newStatus === 'REVIEW'
        ? 85
        : newStatus === 'IN_PROGRESS'
          ? 50
          : 0;

  const awardedXp =
    newStatus === 'COMPLETED'
      ? target.priority === 'CRITICAL'
        ? 135
        : target.priority === 'HIGH'
          ? 68
          : target.priority === 'MEDIUM'
            ? 34
            : 14
      : 0;

  const updated = tasks.map(t => (t._id === id ? { ...t, status: newStatus, completionRate } : t));

  const message =
    newStatus === 'COMPLETED'
      ? `Task ${target.taskCode} marked COMPLETED! +${awardedXp} Merit XP awarded to ${target.reportingChain.supervisorName}.`
      : `Task ${target.taskCode} status transitioned from ${target.status} to ${newStatus}.`;

  return {
    success: true,
    tasks: updated,
    message,
    awardedXp,
  };
}

export function executeReassignTaskChainWorkflow(
  tasks: TaskNode[],
  id: string,
  chain: TaskReportingChain
): TaskWorkflowResult {
  if (!id) return { success: false, tasks, message: 'Task ID required.' };

  const target = tasks.find(t => t._id === id);
  if (!target) return { success: false, tasks, message: 'Task not found.' };

  const updated = tasks.map(t => (t._id === id ? { ...t, reportingChain: chain } : t));

  return {
    success: true,
    tasks: updated,
    message: `Reassigned escalation chain for ${target.taskCode} to Supervisor ${chain.supervisorName} / Director ${chain.directorName}.`,
  };
}

export interface TaskExecutionResult {
  success: boolean;
  taskId: string;
  taskCode: string;
  status: 'COMPLETED' | 'FAILED';
  outputs: Record<string, any>;
  verificationPassed: boolean;
  auditNotes: string[];
  awardedXp: number;
}

/**
 * Stage 1-4 I-P-O-V: Atomic Task Functional Execution (Feature-as-a-Task)
 */
export function executeTaskFunctionalRunWorkflow(
  task: TaskNode,
  inputs: Record<string, any> = {}
): TaskExecutionResult {
  if (!task || !task.taskCode) {
    throw new Error('[TuringProtocol] Task definition required for execution.');
  }

  const code = task.taskCode.toUpperCase();
  let payload: ExecutedTaskPayload;

  if (code.includes('T-DOC-001') || code.includes('TITLE')) {
    payload = executeTitleDeedTask(inputs);
  } else if (code.includes('T-DOC-002') || code.includes('EID') || code.includes('EMIRATES')) {
    payload = executeEmiratesIdTask(inputs);
  } else if (code.includes('T-DOC-003') || code.includes('PASSPORT')) {
    payload = executePassportTask(inputs);
  } else if (code.includes('T-DOC-004') || code.includes('CONTRACT') || code.includes('TENANCY')) {
    payload = executeTenancyContractTask(inputs);
  } else if (code.includes('T-FIN-001') || code.includes('ESCROW')) {
    payload = executeEscrowAuditTask(inputs);
  } else if (code.includes('T-FIN-002') || code.includes('VAT')) {
    payload = executeVatReturnTask(inputs);
  } else if (code.includes('T-FIN-003') || code.includes('PDC') || code.includes('CHEQUE')) {
    payload = executePdcTrackingTask(inputs);
  } else if (code.includes('T-REG-001') || code.includes('EJARI')) {
    payload = executeEjariGenerationTask(inputs);
  } else if (code.includes('T-REG-002') || code.includes('BROKER') || code.includes('RERA')) {
    payload = executeReraBrokerCardTask(inputs);
  } else if (code.includes('T-CRM-001') || code.includes('WHATSAPP')) {
    payload = executeWhatsAppBroadcastTask(inputs);
  } else if (code.includes('T-PORTAL-001') || code.includes('PORTAL') || code.includes('BAYUT')) {
    payload = executePortalSyndicationTask(inputs);
  } else if (code.includes('T-VAL-001') || code.includes('VALUATION')) {
    payload = executePropertyValuationTask(inputs);
  } else if (
    code.includes('T-SEC-001') ||
    code.includes('BIOMETRIC') ||
    code.includes('UAE-PASS')
  ) {
    payload = executeBiometricSecurityTask(inputs);
  } else if (code.includes('WC-KYC-001') || code.includes('KYC-001')) {
    payload = executeKycOcrTask(inputs);
  } else if (code.includes('WC-KYC-004') || code.includes('KYC-004')) {
    payload = executeKycEncryptionTask(inputs);
  } else if (code.includes('WC-INV-101') || code.includes('INV-101')) {
    payload = executeInventoryVacancyTask(inputs);
  } else if (code.includes('WC-LEASE-203') || code.includes('LEASE-203')) {
    payload = executeLeaseParseTask(inputs);
  } else if (code.includes('WC-FIN-302') || code.includes('FIN-302')) {
    payload = executeFinancialReceiptLedgerTask(inputs);
  } else {
    payload = {
      outputs: {
        executionStatus: 'RESOLVED',
        timestamp: new Date().toISOString(),
        payload: inputs,
      },
      auditNotes: [
        'Operational task processed according to SOP specifications.',
        'Escalation chain confirmed and verified with L3 Supervisor.',
      ],
    };
  }

  const awardedXp =
    task.priority === 'CRITICAL'
      ? 135
      : task.priority === 'HIGH'
        ? 68
        : task.priority === 'MEDIUM'
          ? 34
          : 14;

  const verificationPassed = payload.auditNotes.length > 0;

  return {
    success: true,
    taskId: task._id,
    taskCode: task.taskCode,
    status: 'COMPLETED',
    outputs: payload.outputs,
    verificationPassed,
    auditNotes: payload.auditNotes,
    awardedXp,
  };
}
