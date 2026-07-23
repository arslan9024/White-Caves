/**
 * Follow-Up Engine — Automated sequence orchestrator
 *
 * Manages the lifecycle of follow-up sequences:
 *   1. Start a sequence for a lead based on their score tier
 *   2. Execute steps at scheduled times (WhatsApp, email, call)
 *   3. Track delivery status and outcomes
 *   4. Pause / resume / cancel sequences
 *   5. Auto-advance on step completion
 *
 * Integration points:
 *   - Lead Scoring Engine → determines cadence tier
 *   - WhatsApp Meta API → sends WhatsApp messages
 *   - Activity model → logs all follow-up actions
 *   - Scheduler → triggers processScheduledSteps() on interval
 */

import { prisma } from '../../database.js';
import { logger } from '../../utils/logger.js';
import {
  getCadenceForTier,
  resolveTemplate,
  type CadenceTemplate,
  type CadenceStep,
} from './cadenceTemplates.js';
import { createMetaAPIClient } from '../whatsapp/metaAPI.js';
import { normalizePhone, rateLimiter } from '../whatsapp/whatsappUtils.js';

// ─── Types ──────────────────────────────────────────────────────────────

export interface StartSequenceResult {
  sequenceId: string;
  cadenceType: string;
  totalSteps: number;
  firstStepAt: Date;
  leadId: string;
}

export interface StepExecutionResult {
  stepId: string;
  channel: string;
  status: 'sent' | 'failed' | 'skipped';
  message?: string;
  error?: string;
}

export interface SequenceSummary {
  id: string;
  cadenceType: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  startedAt: Date;
  nextStepAt: Date | null;
  completedAt: Date | null;
  steps: Array<{
    stepNumber: number;
    channel: string;
    status: string;
    scheduledAt: Date | null;
    executedAt: Date | null;
    result: string | null;
  }>;
}

export interface ProcessBatchResult {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
  errors: string[];
}

type DynamicCadenceStep = {
  channel?: string;
  templateName?: string;
  description?: string;
  delayMs?: number;
};

type CadenceRuleRecord = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  priority: number;
  leadTiers: string[];
  leadSources: string[];
  dealTypes: string[];
  channelSequence: unknown;
  createdAt: Date;
};

const cadenceRuleModel = prisma as typeof prisma & {
  cadenceRule: {
    findMany: (args: {
      where: { isActive: boolean };
      orderBy: Array<{ priority: 'desc' } | { createdAt: 'desc' }>;
      take: number;
    }) => Promise<CadenceRuleRecord[]>;
  };
};

function normalizeDynamicCadenceSteps(value: unknown): CadenceStep[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((raw, index) => {
      const step = raw as DynamicCadenceStep;
      const channel = step.channel;
      if (
        channel !== 'whatsapp' &&
        channel !== 'email' &&
        channel !== 'call' &&
        channel !== 'sms'
      ) {
        return null;
      }

      return {
        stepNumber: index + 1,
        channel,
        delayMs:
          typeof step.delayMs === 'number' && Number.isFinite(step.delayMs) && step.delayMs >= 0
            ? step.delayMs
            : index === 0
              ? 5 * 60 * 1000
              : 24 * 60 * 60 * 1000,
        templateName:
          typeof step.templateName === 'string' && step.templateName.trim().length > 0
            ? step.templateName.trim()
            : `dynamic_${channel}_${index + 1}`,
        description:
          typeof step.description === 'string' && step.description.trim().length > 0
            ? step.description.trim()
            : `Dynamic cadence ${channel} step ${index + 1}`,
      } satisfies CadenceStep;
    })
    .filter((step): step is CadenceStep => Boolean(step));
}

async function resolveCadenceFromDynamicRules(lead: {
  id: string;
  scoreTier: string | null;
  source: string | null;
  dealType: string | null;
}): Promise<CadenceTemplate | null> {
  const rules = await cadenceRuleModel.cadenceRule.findMany({
    where: { isActive: true },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  });

  for (const rule of rules) {
    const tierMatch =
      rule.leadTiers.length === 0 ||
      (lead.scoreTier ? rule.leadTiers.includes(lead.scoreTier) : false);
    const sourceMatch =
      rule.leadSources.length === 0 ||
      (lead.source ? rule.leadSources.includes(lead.source) : false);
    const dealTypeMatch =
      rule.dealTypes.length === 0 ||
      (lead.dealType ? rule.dealTypes.includes(lead.dealType) : false);

    if (!tierMatch || !sourceMatch || !dealTypeMatch) {
      continue;
    }

    const steps = normalizeDynamicCadenceSteps(rule.channelSequence);
    if (steps.length === 0) {
      continue;
    }

    return {
      cadenceType: `rule:${rule.id}`,
      name: rule.name,
      description: rule.description || `Dynamic cadence rule ${rule.name}`,
      totalSteps: steps.length,
      steps,
      maxDurationDays: 30,
    };
  }

  return null;
}

// ─── Start a sequence ───────────────────────────────────────────────────

/**
 * Start an automated follow-up sequence for a lead.
 *
 * 1. Looks up the lead's score tier
 * 2. Checks for existing active sequences (prevents duplicates)
 * 3. Creates FollowUpSequence + all FollowUpStep records
 * 4. Schedules the first step
 */
export async function startSequence(
  leadId: string,
  options?: { cadenceType?: string; createdById?: string }
): Promise<StartSequenceResult> {
  // 1. Fetch lead
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, name: true, scoreTier: true, status: true, source: true, dealType: true },
  });
  if (!lead) throw new Error(`Lead not found: ${leadId}`);

  // 2. Check for active sequences on this lead
  const existingActive = await prisma.followUpSequence.findFirst({
    where: { leadId, status: { in: ['active', 'paused'] } },
  });
  if (existingActive) {
    throw new Error(
      `Lead ${leadId} already has an active sequence (${existingActive.id}). ` +
        `Cancel or complete it before starting a new one.`
    );
  }

  // 3. Determine cadence
  const dynamicCadence = await resolveCadenceFromDynamicRules({
    id: lead.id,
    scoreTier: lead.scoreTier,
    source: lead.source,
    dealType: lead.dealType,
  });
  const cadenceType =
    options?.cadenceType || dynamicCadence?.cadenceType || lead.scoreTier || 'cold';
  const cadence: CadenceTemplate = options?.cadenceType
    ? getCadenceForTier(options.cadenceType)
    : dynamicCadence || getCadenceForTier(cadenceType);
  const now = new Date();

  // 4. Calculate step schedules (cumulative from now)
  let cumulativeDelay = 0;
  const stepData = cadence.steps.map((step: CadenceStep) => {
    cumulativeDelay += step.delayMs;
    return {
      stepNumber: step.stepNumber,
      channel: step.channel,
      status: 'pending' as const,
      scheduledAt: new Date(now.getTime() + cumulativeDelay),
      templateName: step.templateName,
    };
  });

  // 5. Create sequence + steps in a transaction
  const sequence = await prisma.followUpSequence.create({
    data: {
      cadenceType,
      status: 'active',
      currentStep: 0,
      totalSteps: cadence.totalSteps,
      startedAt: now,
      nextStepAt: stepData[0]?.scheduledAt || null,
      leadId,
      createdById: options?.createdById || null,
      steps: {
        create: stepData,
      },
    },
    include: { steps: true },
  });

  // 6. Log activity
  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'follow_up_started',
      description: `Follow-up sequence started: ${cadence.name} (${cadence.totalSteps} steps)`,
      leadId,
      userId: options?.createdById || null,
      metadata: {
        sequenceId: sequence.id,
        cadenceType,
        totalSteps: cadence.totalSteps,
        firstStepAt: stepData[0]?.scheduledAt?.toISOString(),
      },
    },
  });

  logger.info(`Follow-up sequence started for lead ${leadId}: ${cadence.name}`);

  return {
    sequenceId: sequence.id,
    cadenceType,
    totalSteps: cadence.totalSteps,
    firstStepAt: stepData[0]?.scheduledAt || now,
    leadId,
  };
}

// ─── Process scheduled steps ────────────────────────────────────────────

/**
 * Process all follow-up steps that are due.
 * Called by the scheduler on interval (e.g., every 5 min).
 *
 * 1. Find active sequences where nextStepAt <= now
 * 2. For each, execute the current step
 * 3. Advance the sequence or complete it
 */
export async function processScheduledSteps(): Promise<ProcessBatchResult> {
  const now = new Date();
  const result: ProcessBatchResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // Find all sequences that have a step due
  const dueSequences = await prisma.followUpSequence.findMany({
    where: {
      status: 'active',
      nextStepAt: { lte: now },
    },
    include: {
      steps: { orderBy: { stepNumber: 'asc' } },
      lead: { select: { id: true, name: true, phone: true, email: true, status: true } },
    },
    take: 50, // process max 50 per batch
  });

  for (const sequence of dueSequences) {
    result.processed++;

    try {
      // Find the next pending step
      const nextStep = sequence.steps.find(s => s.status === 'pending');
      if (!nextStep) {
        // No more steps → complete the sequence
        await completeSequence(sequence.id);
        continue;
      }

      // Check if lead is still active (not won/lost)
      if (sequence.lead.status === 'won' || sequence.lead.status === 'lost') {
        await cancelSequence(sequence.id, 'Lead status changed to ' + sequence.lead.status);
        result.skipped++;
        continue;
      }

      // Check for manual agent contact in last 24h (W24-010)
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const manualActivity = await prisma.activity.findFirst({
        where: {
          leadId: sequence.lead.id,
          createdAt: { gte: cutoff },
          type: 'lead',
          action: { in: ['call', 'email', 'visit', 'manual_whatsapp', 'note_added'] },
          userId: { not: null },
        },
      });

      if (manualActivity) {
        await pauseSequence(sequence.id);
        await prisma.activity.create({
          data: {
            type: 'lead',
            action: 'follow_up_autopause',
            description: `Follow-up sequence auto-paused due to manual agent contact (Activity: ${manualActivity.action}) within 24h`,
            leadId: sequence.lead.id,
          },
        });
        result.skipped++;
        continue;
      }

      // Execute the step
      const stepResult = await executeStep(nextStep.id, sequence.lead);
      if (stepResult.status === 'sent') {
        result.sent++;
      } else if (stepResult.status === 'failed') {
        result.failed++;
      } else {
        result.skipped++;
      }

      // Advance sequence
      const remainingSteps = sequence.steps.filter(
        s => s.status === 'pending' && s.stepNumber > nextStep.stepNumber
      );

      if (remainingSteps.length === 0) {
        await completeSequence(sequence.id);
      } else {
        await prisma.followUpSequence.update({
          where: { id: sequence.id },
          data: {
            currentStep: nextStep.stepNumber,
            nextStepAt: remainingSteps[0]?.scheduledAt || null,
          },
        });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      result.errors.push(`Sequence ${sequence.id}: ${msg}`);
      logger.error(`Follow-up step error for sequence ${sequence.id}:`, error);
    }
  }

  if (result.processed > 0) {
    logger.info(
      `Follow-up batch processed: ${result.processed} sequences, ` +
        `${result.sent} sent, ${result.failed} failed, ${result.skipped} skipped`
    );
  }

  return result;
}

// ─── Execute a single step ──────────────────────────────────────────────

/**
 * Execute a specific follow-up step (send message, make call record, etc.)
 */
export async function executeStep(
  stepId: string,
  lead: { id: string; name: string; phone: string | null; email: string | null }
): Promise<StepExecutionResult> {
  const step = await prisma.followUpStep.findUnique({
    where: { id: stepId },
    include: { sequence: true },
  });
  if (!step) throw new Error(`Follow-up step not found: ${stepId}`);

  const now = new Date();

  try {
    // Resolve the message template
    const templateVars: Record<string, string> = {
      name: lead.name || 'there',
      agent: 'White Caves Team',
      property: 'our curated selection',
      company: 'White Caves Real Estate',
      link: 'https://whitecaves.com',
    };
    const resolved = resolveTemplate(step.templateName || '', templateVars);

    // Channel-specific execution
    let status: 'sent' | 'failed' | 'skipped' = 'sent';
    let message = '';
    let errorMessage: string | undefined;

    switch (step.channel) {
      case 'whatsapp': {
        if (!lead.phone) {
          status = 'skipped';
          message = 'No phone number on lead';
          break;
        }
        const normalizedPhone = normalizePhone(lead.phone);
        if (!normalizedPhone) {
          status = 'skipped';
          message = `Invalid phone number: ${lead.phone}`;
          break;
        }

        // Send via Meta Cloud API if configured
        const accessToken = process.env.META_ACCESS_TOKEN;
        const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
        const businessAccountId = process.env.META_BUSINESS_ACCOUNT_ID;

        if (accessToken && phoneNumberId && businessAccountId) {
          try {
            const rateCheck = rateLimiter.canSend(normalizedPhone);
            if (!rateCheck.allowed) {
              status = 'failed';
              errorMessage = `Rate limited — retry after ${rateCheck.retryAfterMs}ms`;
              message = errorMessage;
              break;
            }
            const metaClient = createMetaAPIClient({
              accessToken,
              businessAccountId,
              phoneNumberId,
            });
            const msgBody = resolved?.body || 'Hello from White Caves';
            const waMessageId = await metaClient.sendMessage(normalizedPhone, msgBody);
            message = `WhatsApp sent (${waMessageId})`;
            logger.info(`[FollowUp] WhatsApp sent to ${normalizedPhone}: ${waMessageId}`);
          } catch (sendErr) {
            status = 'failed';
            errorMessage = sendErr instanceof Error ? sendErr.message : 'WhatsApp send failed';
            message = errorMessage;
            logger.error(`[FollowUp] WhatsApp send failed to ${normalizedPhone}:`, sendErr);
          }
        } else {
          // No Meta API configured — log only (dev/staging mode)
          message = resolved?.body || 'WhatsApp message (dev mode — not sent)';
          logger.info(`[FollowUp] WhatsApp (dev) to ${normalizedPhone}: ${step.templateName}`);
        }
        break;
      }

      case 'email': {
        if (!lead.email) {
          status = 'skipped';
          message = 'No email on lead';
          break;
        }
        try {
          const { sendEmailTracked, wrapInBrandedTemplate } = await import('../emailService.js');
          const subject = resolved?.subject || `Follow-up from White Caves — ${step.templateName}`;
          const bodyText =
            resolved?.body || 'Thank you for your interest in White Caves properties.';
          const htmlContent = wrapInBrandedTemplate(`<p>${bodyText}</p>`);

          const emailResult = await sendEmailTracked({
            to: lead.email,
            subject,
            text: bodyText,
            html: htmlContent,
            tags: [{ name: 'follow_up', value: step.templateName || 'generic' }],
          });

          if (emailResult.success) {
            message = `Email sent (${emailResult.messageId || 'ok'})`;
            logger.info(`[FollowUp] Email sent to ${lead.email}: ${step.templateName}`);
          } else {
            status = 'failed';
            errorMessage = emailResult.error || 'Email send failed';
            message = errorMessage;
          }
        } catch (emailErr) {
          status = 'failed';
          errorMessage = emailErr instanceof Error ? emailErr.message : 'Email send failed';
          message = errorMessage;
          logger.error(`[FollowUp] Email send failed to ${lead.email}:`, emailErr);
        }
        break;
      }

      case 'call': {
        if (!lead.phone) {
          status = 'skipped';
          message = 'No phone number on lead';
          break;
        }
        // Calls create a task/reminder — not auto-dialed
        message = resolved?.body || 'Call task created';
        logger.info(`[FollowUp] Call task for ${lead.phone}: ${step.templateName}`);
        break;
      }

      case 'sms': {
        if (!lead.phone) {
          status = 'skipped';
          message = 'No phone number on lead';
          break;
        }
        message = resolved?.body || 'SMS sent';
        logger.info(`[FollowUp] SMS to ${lead.phone}: ${step.templateName}`);
        break;
      }

      default:
        status = 'skipped';
        message = `Unknown channel: ${step.channel}`;
    }

    // Update step record
    await prisma.followUpStep.update({
      where: { id: stepId },
      data: {
        status,
        executedAt: now,
        message: message.substring(0, 500), // cap length
        result: status === 'sent' ? 'delivered' : status === 'skipped' ? 'skipped' : 'failed',
        errorMessage: errorMessage || null,
        metadata: {
          templateResolved: !!resolved,
          channel: step.channel,
          executedAt: now.toISOString(),
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'lead',
        action: `follow_up_${step.channel}`,
        description: `Follow-up step ${step.stepNumber}: ${step.channel} — ${status}`,
        leadId: lead.id,
        metadata: {
          sequenceId: step.sequenceId,
          stepId: step.id,
          stepNumber: step.stepNumber,
          channel: step.channel,
          templateName: step.templateName,
          status,
        },
      },
    });

    // Update lead's lastContact
    if (status === 'sent') {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { lastContact: now },
      });
    }

    return { stepId, channel: step.channel, status, message };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);

    // Mark step as failed
    await prisma.followUpStep.update({
      where: { id: stepId },
      data: {
        status: 'failed',
        executedAt: now,
        errorMessage: errMsg.substring(0, 500),
      },
    });

    logger.error(`Follow-up step ${stepId} failed:`, error);

    return { stepId, channel: step.channel, status: 'failed', error: errMsg };
  }
}

// ─── Sequence lifecycle ─────────────────────────────────────────────────

/** Pause an active sequence */
export async function pauseSequence(sequenceId: string): Promise<void> {
  const sequence = await prisma.followUpSequence.findUnique({ where: { id: sequenceId } });
  if (!sequence) throw new Error(`Sequence not found: ${sequenceId}`);
  if (sequence.status !== 'active') throw new Error(`Cannot pause ${sequence.status} sequence`);

  await prisma.followUpSequence.update({
    where: { id: sequenceId },
    data: { status: 'paused', pausedAt: new Date() },
  });

  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'follow_up_paused',
      description: `Follow-up sequence paused at step ${sequence.currentStep}`,
      leadId: sequence.leadId,
      metadata: { sequenceId },
    },
  });

  logger.info(`Follow-up sequence ${sequenceId} paused`);
}

/** Resume a paused sequence */
export async function resumeSequence(sequenceId: string): Promise<void> {
  const sequence = await prisma.followUpSequence.findUnique({
    where: { id: sequenceId },
    include: { steps: { where: { status: 'pending' }, orderBy: { stepNumber: 'asc' }, take: 1 } },
  });
  if (!sequence) throw new Error(`Sequence not found: ${sequenceId}`);
  if (sequence.status !== 'paused') throw new Error(`Cannot resume ${sequence.status} sequence`);

  const nextPending = sequence.steps[0];
  const now = new Date();

  // Reschedule the next pending step from now (preserving original delays)
  if (nextPending) {
    const cadence = getCadenceForTier(sequence.cadenceType);
    const stepDef = cadence.steps.find(s => s.stepNumber === nextPending.stepNumber);
    const newScheduledAt = new Date(now.getTime() + (stepDef?.delayMs || 3600000));

    await prisma.followUpStep.update({
      where: { id: nextPending.id },
      data: { scheduledAt: newScheduledAt },
    });

    await prisma.followUpSequence.update({
      where: { id: sequenceId },
      data: { status: 'active', pausedAt: null, nextStepAt: newScheduledAt },
    });
  } else {
    await completeSequence(sequenceId);
  }

  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'follow_up_resumed',
      description: `Follow-up sequence resumed`,
      leadId: sequence.leadId,
      metadata: { sequenceId },
    },
  });

  logger.info(`Follow-up sequence ${sequenceId} resumed`);
}

/** Cancel a sequence */
export async function cancelSequence(sequenceId: string, reason?: string): Promise<void> {
  const sequence = await prisma.followUpSequence.findUnique({ where: { id: sequenceId } });
  if (!sequence) throw new Error(`Sequence not found: ${sequenceId}`);
  if (sequence.status === 'completed' || sequence.status === 'cancelled') {
    throw new Error(`Sequence already ${sequence.status}`);
  }

  await prisma.followUpSequence.update({
    where: { id: sequenceId },
    data: { status: 'cancelled', completedAt: new Date() },
  });

  // Cancel all pending steps
  await prisma.followUpStep.updateMany({
    where: { sequenceId, status: 'pending' },
    data: { status: 'skipped' },
  });

  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'follow_up_cancelled',
      description: `Follow-up sequence cancelled${reason ? `: ${reason}` : ''}`,
      leadId: sequence.leadId,
      metadata: { sequenceId, reason },
    },
  });

  logger.info(`Follow-up sequence ${sequenceId} cancelled: ${reason || 'no reason'}`);
}

/** Complete a sequence (all steps done) */
async function completeSequence(sequenceId: string): Promise<void> {
  const sequence = await prisma.followUpSequence.findUnique({ where: { id: sequenceId } });
  if (!sequence) return;

  await prisma.followUpSequence.update({
    where: { id: sequenceId },
    data: {
      status: 'completed',
      completedAt: new Date(),
      nextStepAt: null,
      currentStep: sequence.totalSteps,
    },
  });

  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'follow_up_completed',
      description: `Follow-up sequence completed (${sequence.totalSteps} steps)`,
      leadId: sequence.leadId,
      metadata: { sequenceId, cadenceType: sequence.cadenceType },
    },
  });

  logger.info(`Follow-up sequence ${sequenceId} completed`);
}

// ─── Query helpers ──────────────────────────────────────────────────────

/** Get full sequence summary with steps */
export async function getSequenceSummary(sequenceId: string): Promise<SequenceSummary | null> {
  const sequence = await prisma.followUpSequence.findUnique({
    where: { id: sequenceId },
    include: { steps: { orderBy: { stepNumber: 'asc' } } },
  });
  if (!sequence) return null;

  return {
    id: sequence.id,
    cadenceType: sequence.cadenceType,
    status: sequence.status,
    currentStep: sequence.currentStep,
    totalSteps: sequence.totalSteps,
    startedAt: sequence.startedAt,
    nextStepAt: sequence.nextStepAt,
    completedAt: sequence.completedAt,
    steps: sequence.steps.map(s => ({
      stepNumber: s.stepNumber,
      channel: s.channel,
      status: s.status,
      scheduledAt: s.scheduledAt,
      executedAt: s.executedAt,
      result: s.result,
    })),
  };
}

/** Get all sequences for a specific lead */
export async function getLeadSequences(leadId: string): Promise<SequenceSummary[]> {
  const sequences = await prisma.followUpSequence.findMany({
    where: { leadId },
    include: { steps: { orderBy: { stepNumber: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return sequences.map(seq => ({
    id: seq.id,
    cadenceType: seq.cadenceType,
    status: seq.status,
    currentStep: seq.currentStep,
    totalSteps: seq.totalSteps,
    startedAt: seq.startedAt,
    nextStepAt: seq.nextStepAt,
    completedAt: seq.completedAt,
    steps: seq.steps.map(s => ({
      stepNumber: s.stepNumber,
      channel: s.channel,
      status: s.status,
      scheduledAt: s.scheduledAt,
      executedAt: s.executedAt,
      result: s.result,
    })),
  }));
}

/** Get dashboard stats for all follow-ups */
export async function getFollowUpStats(): Promise<{
  active: number;
  paused: number;
  completed: number;
  cancelled: number;
  totalStepsSent: number;
  totalStepsFailed: number;
}> {
  const [active, paused, completed, cancelled, sentSteps, failedSteps] = await Promise.all([
    prisma.followUpSequence.count({ where: { status: 'active' } }),
    prisma.followUpSequence.count({ where: { status: 'paused' } }),
    prisma.followUpSequence.count({ where: { status: 'completed' } }),
    prisma.followUpSequence.count({ where: { status: 'cancelled' } }),
    prisma.followUpStep.count({ where: { status: 'sent' } }),
    prisma.followUpStep.count({ where: { status: 'failed' } }),
  ]);

  return {
    active,
    paused,
    completed,
    cancelled,
    totalStepsSent: sentSteps,
    totalStepsFailed: failedSteps,
  };
}
