/**
 * Lead Nurture Engine
 *
 * Automates follow-up sequences for leads based on their last interaction,
 * stage, and intent history. Sequences are processed by a lightweight
 * state-machine: each step advances when the trigger condition is met.
 *
 * Architecture: In-process scheduler (setInterval-based). For production,
 * replace with a Redis-backed job queue (BullMQ) or a cron service.
 *
 * Sequences available:
 *   - new_lead_7day:     7-day nurture for fresh property enquiries
 *   - viewing_follow_up: 48-hour follow-up after a viewing
 *   - offer_rejection:   Re-engagement after an offer is declined
 *   - cold_lead_30day:   Monthly re-engagement for cold pipeline
 *
 * Used by:
 *   - POST /api/nina/lead-nurture (enroll a lead in a sequence)
 *   - GET  /api/nina/lead-nurture/:leadId (current sequence status)
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SequenceName =
  | 'new_lead_7day'
  | 'viewing_follow_up'
  | 'offer_rejection'
  | 'cold_lead_30day';

export type StepActionType = 'whatsapp_template' | 'email' | 'call_task' | 'crm_note';

export interface NurtureStep {
  stepIndex:    number;
  delayHours:   number;          // Hours after previous step (or enrollment)
  actionType:   StepActionType;
  templateKey:  string;          // Template ID or action label
  description:  string;
}

export interface NurtureSequence {
  name:        SequenceName;
  displayName: string;
  description: string;
  steps:       NurtureStep[];
}

export interface EnrolledLead {
  enrollmentId:    string;
  leadId:          string;
  phone:           string;
  sequenceName:    SequenceName;
  currentStep:     number;           // 0-based index into steps[]
  enrolledAt:      Date;
  nextActionAt:    Date;
  completedSteps:  number[];
  paused:          boolean;          // True when agent manually contacts lead
  completed:       boolean;
  lastUpdated:     Date;
}

export interface NurtureEnrollmentResult {
  success:      boolean;
  enrollmentId: string;
  sequenceName: SequenceName;
  totalSteps:   number;
  nextActionAt: string;
}

// ─── Sequence Definitions ─────────────────────────────────────────────────────

export const NURTURE_SEQUENCES: Record<SequenceName, NurtureSequence> = {
  new_lead_7day: {
    name: 'new_lead_7day',
    displayName: 'New Lead 7-Day Nurture',
    description: 'Engage a fresh property enquiry over 7 days with property suggestions and a market report',
    steps: [
      { stepIndex: 0, delayHours: 0,    actionType: 'whatsapp_template', templateKey: 'welcome_new_lead',       description: 'Welcome message + top 3 matching properties' },
      { stepIndex: 1, delayHours: 24,   actionType: 'call_task',         templateKey: 'follow_up_call_day1',    description: 'Agent follow-up call task (Day 1)' },
      { stepIndex: 2, delayHours: 72,   actionType: 'whatsapp_template', templateKey: 'area_market_report',     description: 'Send area market report PDF' },
      { stepIndex: 3, delayHours: 120,  actionType: 'email',             templateKey: 'curated_listings_email', description: 'Curated listings email (Day 5)' },
      { stepIndex: 4, delayHours: 168,  actionType: 'whatsapp_template', templateKey: 'last_chance_viewing',    description: 'Book a viewing (Day 7 — final step)' },
    ],
  },

  viewing_follow_up: {
    name: 'viewing_follow_up',
    displayName: 'Post-Viewing 48-Hour Follow-Up',
    description: 'Quick follow-up sequence after a viewing is completed',
    steps: [
      { stepIndex: 0, delayHours: 0.5,  actionType: 'whatsapp_template', templateKey: 'post_viewing_feedback',  description: 'Request viewing feedback (30 min after)' },
      { stepIndex: 1, delayHours: 24,   actionType: 'call_task',         templateKey: 'decision_call_task',     description: 'Decision call task for agent' },
      { stepIndex: 2, delayHours: 48,   actionType: 'whatsapp_template', templateKey: 'similar_properties',     description: 'Send 3 similar properties if no offer' },
    ],
  },

  offer_rejection: {
    name: 'offer_rejection',
    displayName: 'Offer Rejection Re-Engagement',
    description: 'Re-engage a lead after their offer was not accepted',
    steps: [
      { stepIndex: 0, delayHours: 2,    actionType: 'whatsapp_template', templateKey: 'offer_rejected_empathy', description: 'Empathy message + counter offer tips' },
      { stepIndex: 1, delayHours: 24,   actionType: 'whatsapp_template', templateKey: 'alternative_units',      description: 'Suggest alternative units within budget' },
      { stepIndex: 2, delayHours: 72,   actionType: 'call_task',         templateKey: 'counter_strategy_call',  description: 'Counter-offer strategy call task' },
    ],
  },

  cold_lead_30day: {
    name: 'cold_lead_30day',
    displayName: '30-Day Cold Lead Re-Engagement',
    description: 'Monthly re-engagement for leads that have gone quiet',
    steps: [
      { stepIndex: 0, delayHours: 0,    actionType: 'whatsapp_template', templateKey: 'cold_check_in',          description: 'Friendly check-in: still searching?' },
      { stepIndex: 1, delayHours: 72,   actionType: 'email',             templateKey: 'monthly_market_update',  description: 'Dubai market update email' },
      { stepIndex: 2, delayHours: 168,  actionType: 'crm_note',          templateKey: 'mark_cold_if_no_reply',  description: 'Mark lead as cold if still no reply' },
    ],
  },
};

// ─── In-Memory Store (replace with DB in production) ─────────────────────────

const enrolledLeads = new Map<string, EnrolledLead>();  // key: enrollmentId

// ─── Core Operations ──────────────────────────────────────────────────────────

/**
 * Generate a unique enrollment ID.
 */
function makeEnrollmentId(): string {
  return `nurture-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Enroll a lead in a nurture sequence.
 *
 * If the lead is already enrolled in the same sequence, the existing enrollment
 * is returned (idempotent). If enrolled in a different sequence, the old one is
 * cancelled and the new one starts.
 *
 * @param leadId       - CRM lead ID
 * @param phone        - WhatsApp phone number (E.164 format)
 * @param sequenceName - Which sequence to enroll in
 */
export function enrollLead(
  leadId:       string,
  phone:        string,
  sequenceName: SequenceName
): NurtureEnrollmentResult {
  const sequence = NURTURE_SEQUENCES[sequenceName];
  if (!sequence) {
    throw new Error(`Unknown sequence: ${sequenceName}`);
  }

  // Cancel any existing enrollment for this lead
  for (const [id, enrolled] of enrolledLeads.entries()) {
    if (enrolled.leadId === leadId && !enrolled.completed) {
      enrolledLeads.delete(id);
    }
  }

  const enrollmentId = makeEnrollmentId();
  const now          = new Date();
  const firstDelay   = sequence.steps[0]?.delayHours ?? 0;
  const nextActionAt = new Date(now.getTime() + firstDelay * 3_600_000);

  const enrollment: EnrolledLead = {
    enrollmentId,
    leadId,
    phone,
    sequenceName,
    currentStep:    0,
    enrolledAt:     now,
    nextActionAt,
    completedSteps: [],
    paused:         false,
    completed:      false,
    lastUpdated:    now,
  };

  enrolledLeads.set(enrollmentId, enrollment);

  console.info(
    `[LeadNurture] Enrolled lead ${leadId} in "${sequenceName}". ` +
    `First action at ${nextActionAt.toISOString()}`
  );

  return {
    success:      true,
    enrollmentId,
    sequenceName,
    totalSteps:   sequence.steps.length,
    nextActionAt: nextActionAt.toISOString(),
  };
}

/**
 * Pause a lead's nurture sequence (e.g., agent manually contacts them).
 * Paused sequences do not advance until `resumeLead` is called.
 */
export function pauseLead(enrollmentId: string): boolean {
  const enrollment = enrolledLeads.get(enrollmentId);
  if (!enrollment) return false;
  enrollment.paused    = true;
  enrollment.lastUpdated = new Date();
  console.info(`[LeadNurture] Paused enrollment ${enrollmentId}`);
  return true;
}

/**
 * Resume a paused enrollment. Recalculates nextActionAt from now.
 */
export function resumeLead(enrollmentId: string): boolean {
  const enrollment = enrolledLeads.get(enrollmentId);
  if (!enrollment || !enrollment.paused) return false;
  const sequence   = NURTURE_SEQUENCES[enrollment.sequenceName];
  const step       = sequence.steps[enrollment.currentStep];
  if (!step) return false;
  enrollment.paused      = false;
  enrollment.nextActionAt = new Date(Date.now() + step.delayHours * 3_600_000);
  enrollment.lastUpdated  = new Date();
  return true;
}

/**
 * Get the current enrollment status for a lead.
 */
export function getLeadStatus(leadId: string): EnrolledLead | null {
  for (const enrollment of enrolledLeads.values()) {
    if (enrollment.leadId === leadId && !enrollment.completed) {
      return enrollment;
    }
  }
  return null;
}

/**
 * Advance all due enrollments (call this from a scheduler/cron).
 * Returns the list of actions that should now be executed.
 */
export function processDueSteps(): Array<{ enrollment: EnrolledLead; step: NurtureStep }> {
  const now    = Date.now();
  const due: Array<{ enrollment: EnrolledLead; step: NurtureStep }> = [];

  for (const enrollment of enrolledLeads.values()) {
    if (enrollment.paused || enrollment.completed) continue;
    if (enrollment.nextActionAt.getTime() > now) continue;

    const sequence = NURTURE_SEQUENCES[enrollment.sequenceName];
    const step     = sequence.steps[enrollment.currentStep];
    if (!step) {
      enrollment.completed  = true;
      enrollment.lastUpdated = new Date();
      continue;
    }

    due.push({ enrollment, step });

    // Advance to next step
    enrollment.completedSteps.push(enrollment.currentStep);
    enrollment.currentStep++;
    enrollment.lastUpdated = new Date();

    const nextStep = sequence.steps[enrollment.currentStep];
    if (nextStep) {
      enrollment.nextActionAt = new Date(now + nextStep.delayHours * 3_600_000);
    } else {
      enrollment.completed = true;
      console.info(`[LeadNurture] Sequence "${enrollment.sequenceName}" completed for lead ${enrollment.leadId}`);
    }
  }

  return due;
}

/**
 * Return all sequences (for API documentation / admin UI).
 */
export function getAllSequences(): NurtureSequence[] {
  return Object.values(NURTURE_SEQUENCES);
}

/**
 * Return count of active (non-completed, non-paused) enrollments.
 */
export function getActiveEnrollmentCount(): number {
  let count = 0;
  for (const e of enrolledLeads.values()) {
    if (!e.completed && !e.paused) count++;
  }
  return count;
}
