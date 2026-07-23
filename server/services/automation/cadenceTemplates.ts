/**
 * Cadence Templates — Pre-built follow-up sequences by lead tier
 *
 * Each cadence defines a series of timed steps with channel, delay, and template.
 * Delays are in milliseconds from the PREVIOUS step (not from sequence start).
 *
 * Tier mapping (from Lead Scoring Engine):
 *   hot      → score ≥ 80  → aggressive, multi-channel, fast
 *   warm     → score 60-79 → moderate pace, 2-3 channels
 *   cold     → score < 60  → slow drip, email-first
 *   inactive → score < 30  → re-engagement attempt, then archive
 */

// ─── Types ──────────────────────────────────────────────────────────────

export type Channel = 'whatsapp' | 'email' | 'call' | 'sms';

export interface CadenceStep {
  stepNumber: number;
  channel: Channel;
  delayMs: number; // ms after previous step
  templateName: string; // message template key
  description: string; // human-readable description
  fallbackChannel?: Channel; // if primary fails, try this
}

export interface CadenceTemplate {
  cadenceType: string;
  name: string;
  description: string;
  totalSteps: number;
  steps: CadenceStep[];
  /** Max days before auto-completing this sequence (safety net) */
  maxDurationDays: number;
}

// ─── Time helpers ───────────────────────────────────────────────────────

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// ─── HOT LEAD CADENCE ──────────────────────────────────────────────────
// Score ≥ 80 — High intent, needs fast response
// Total span: ~25 hours

export const HOT_CADENCE: CadenceTemplate = {
  cadenceType: 'hot',
  name: 'Hot Lead — Rapid Engagement',
  description:
    'Aggressive multi-channel follow-up for high-scoring leads. First touch within 5 minutes.',
  totalSteps: 4,
  maxDurationDays: 3,
  steps: [
    {
      stepNumber: 1,
      channel: 'whatsapp',
      delayMs: 5 * MINUTE,
      templateName: 'hot_initial_whatsapp',
      description: 'Immediate WhatsApp — introduce agent, confirm interest',
      fallbackChannel: 'sms',
    },
    {
      stepNumber: 2,
      channel: 'email',
      delayMs: 1 * HOUR,
      templateName: 'hot_property_details_email',
      description: 'Property details email with brochure and pricing',
      fallbackChannel: 'whatsapp',
    },
    {
      stepNumber: 3,
      channel: 'call',
      delayMs: 4 * HOUR,
      templateName: 'hot_call_schedule',
      description: 'Phone call — schedule viewing or discuss needs',
    },
    {
      stepNumber: 4,
      channel: 'whatsapp',
      delayMs: 24 * HOUR,
      templateName: 'hot_followup_whatsapp',
      description: 'Next-day WhatsApp — viewing reminder or re-engagement',
      fallbackChannel: 'email',
    },
  ],
};

// ─── WARM LEAD CADENCE ─────────────────────────────────────────────────
// Score 60-79 — Interested but not urgent
// Total span: ~8 days

export const WARM_CADENCE: CadenceTemplate = {
  cadenceType: 'warm',
  name: 'Warm Lead — Steady Nurture',
  description: 'Balanced follow-up for interested leads. Space out touches to avoid pressure.',
  totalSteps: 4,
  maxDurationDays: 14,
  steps: [
    {
      stepNumber: 1,
      channel: 'whatsapp',
      delayMs: 1 * HOUR,
      templateName: 'warm_initial_whatsapp',
      description: 'WhatsApp introduction — share relevant listings',
      fallbackChannel: 'email',
    },
    {
      stepNumber: 2,
      channel: 'email',
      delayMs: 24 * HOUR,
      templateName: 'warm_market_update_email',
      description: 'Email — market update, matching properties',
    },
    {
      stepNumber: 3,
      channel: 'whatsapp',
      delayMs: 72 * HOUR,
      templateName: 'warm_check_in_whatsapp',
      description: 'WhatsApp check-in — new listings, availability',
      fallbackChannel: 'sms',
    },
    {
      stepNumber: 4,
      channel: 'call',
      delayMs: 7 * DAY,
      templateName: 'warm_call_consultation',
      description: 'Phone call — offer consultation, understand timeline',
    },
  ],
};

// ─── COLD LEAD CADENCE ─────────────────────────────────────────────────
// Score < 60 — Low engagement, needs slow drip
// Total span: ~30 days → ends in archive recommendation

export const COLD_CADENCE: CadenceTemplate = {
  cadenceType: 'cold',
  name: 'Cold Lead — Slow Drip',
  description:
    'Low-frequency follow-up for cold leads. Email-first approach to avoid intrusiveness.',
  totalSteps: 4,
  maxDurationDays: 45,
  steps: [
    {
      stepNumber: 1,
      channel: 'email',
      delayMs: 24 * HOUR,
      templateName: 'cold_initial_email',
      description: 'Email — soft introduction, value proposition',
    },
    {
      stepNumber: 2,
      channel: 'whatsapp',
      delayMs: 7 * DAY,
      templateName: 'cold_value_whatsapp',
      description: 'WhatsApp — market insight, special offer',
      fallbackChannel: 'email',
    },
    {
      stepNumber: 3,
      channel: 'email',
      delayMs: 14 * DAY,
      templateName: 'cold_reengagement_email',
      description: 'Email — re-engagement with new listings or price drops',
    },
    {
      stepNumber: 4,
      channel: 'email',
      delayMs: 30 * DAY,
      templateName: 'cold_archive_email',
      description: 'Final email — archive notice, opt-in to stay subscribed',
    },
  ],
};

// ─── MESSAGE TEMPLATES ─────────────────────────────────────────────────
// Template content for each channel × cadence step
// Variables: {{name}}, {{agent}}, {{property}}, {{company}}, {{link}}

export interface MessageTemplate {
  key: string;
  channel: Channel;
  subject?: string; // email only
  body: string;
  variables: string[];
}

export const MESSAGE_TEMPLATES: Record<string, MessageTemplate> = {
  // ── Hot ──
  hot_initial_whatsapp: {
    key: 'hot_initial_whatsapp',
    channel: 'whatsapp',
    body: "Hi {{name}} 👋 This is {{agent}} from White Caves Real Estate. I saw you're interested in properties — I'd love to help! Are you available for a quick chat today?",
    variables: ['name', 'agent'],
  },
  hot_property_details_email: {
    key: 'hot_property_details_email',
    channel: 'email',
    subject: '{{name}}, here are the properties matching your criteria',
    body: "Dear {{name}},\n\nThank you for your interest in Dubai real estate. Based on your preferences, I've curated a selection of properties I think you'll love.\n\n{{property}}\n\nWould you like to schedule a viewing? I'm available this week.\n\nBest regards,\n{{agent}}\nWhite Caves Real Estate",
    variables: ['name', 'agent', 'property'],
  },
  hot_call_schedule: {
    key: 'hot_call_schedule',
    channel: 'call',
    body: 'Call script: Introduce yourself, confirm property interest, offer to schedule an in-person or virtual viewing. Discuss budget range and preferred areas.',
    variables: ['name', 'agent', 'property'],
  },
  hot_followup_whatsapp: {
    key: 'hot_followup_whatsapp',
    channel: 'whatsapp',
    body: "Hi {{name}}, just following up! Did you get a chance to look at the properties I sent? I have a few more options that just came on the market 🏠 Let me know if you'd like to schedule a viewing.",
    variables: ['name', 'agent'],
  },

  // ── Warm ──
  warm_initial_whatsapp: {
    key: 'warm_initial_whatsapp',
    channel: 'whatsapp',
    body: "Hello {{name}}! I'm {{agent}} from White Caves. I noticed you're exploring the Dubai property market. I'd love to share some listings that match your interests. What areas are you considering?",
    variables: ['name', 'agent'],
  },
  warm_market_update_email: {
    key: 'warm_market_update_email',
    channel: 'email',
    subject: 'Dubai Market Update — New listings for you, {{name}}',
    body: "Dear {{name}},\n\nHere's your weekly Dubai property market update with listings matching your criteria:\n\n{{property}}\n\nPrices have been favorable lately. Would you like to explore any of these?\n\nBest,\n{{agent}}\nWhite Caves Real Estate",
    variables: ['name', 'agent', 'property'],
  },
  warm_check_in_whatsapp: {
    key: 'warm_check_in_whatsapp',
    channel: 'whatsapp',
    body: "Hi {{name}}, hope you're well! Just checking in — any updates on your property search? I have some new listings I think you'll find interesting. Want me to send them over?",
    variables: ['name'],
  },
  warm_call_consultation: {
    key: 'warm_call_consultation',
    channel: 'call',
    body: 'Call script: Offer a free property consultation. Ask about timeline, budget updates, area preferences. Position yourself as a market advisor, not a salesperson.',
    variables: ['name', 'agent'],
  },

  // ── Cold ──
  cold_initial_email: {
    key: 'cold_initial_email',
    channel: 'email',
    subject: "Discover Dubai's best property opportunities, {{name}}",
    body: "Dear {{name}},\n\nI'm {{agent}} from White Caves Real Estate. Whether you're looking to invest or find your dream home, Dubai's market offers exceptional value right now.\n\nI'd love to understand your goals and share relevant opportunities.\n\nNo pressure — just let me know if you'd like to chat.\n\nWarm regards,\n{{agent}}",
    variables: ['name', 'agent'],
  },
  cold_value_whatsapp: {
    key: 'cold_value_whatsapp',
    channel: 'whatsapp',
    body: "Hi {{name}}, quick market insight: Dubai property prices in select areas have grown 15% this year. If you're considering an investment, now might be a good time. Happy to share some options!",
    variables: ['name'],
  },
  cold_reengagement_email: {
    key: 'cold_reengagement_email',
    channel: 'email',
    subject: "New price drops in Dubai — {{name}}, don't miss out",
    body: "Dear {{name}},\n\nSome exciting developments in the Dubai property market:\n\n• Several premium properties have reduced their asking prices\n• New off-plan launches with attractive payment plans\n• Golden Visa eligibility on select properties\n\nWould any of these interest you? I'm here to help whenever you're ready.\n\nBest,\n{{agent}}",
    variables: ['name', 'agent'],
  },
  cold_archive_email: {
    key: 'cold_archive_email',
    channel: 'email',
    subject: 'Still interested in Dubai property, {{name}}?',
    body: "Dear {{name}},\n\nI haven't heard from you in a while and wanted to check if you're still exploring the Dubai property market.\n\nIf your plans have changed, no worries at all! I'll keep your profile on file in case anything interesting comes up.\n\nIf you'd like to stay updated, just reply to this email and I'll keep you in the loop.\n\nAll the best,\n{{agent}}",
    variables: ['name', 'agent'],
  },

  // ── New Lead 7-Day Nurture ──
  new_lead_nurture_d1: {
    key: 'new_lead_nurture_d1',
    channel: 'whatsapp',
    body: 'Hi {{name}} 👋 Thanks for contacting White Caves. We received your request. An expert advisor is looking into properties matching your needs now. Do you prefer WhatsApp or call?',
    variables: ['name'],
  },
  new_lead_nurture_d3: {
    key: 'new_lead_nurture_d3',
    channel: 'email',
    subject: 'Curated properties matching your search',
    body: 'Dear {{name}},\n\nHere are some of our latest exclusive property listings in Dubai. I would love to schedule a private tour for you.\n\nBest,\n{{agent}}',
    variables: ['name', 'agent'],
  },
  new_lead_nurture_d7: {
    key: 'new_lead_nurture_d7',
    channel: 'call',
    body: 'Call script: Check in with new lead on property search progress. Offer free market consultation.',
    variables: ['name'],
  },

  // ── Lease Renewal 90-Day ──
  lease_renewal_90d: {
    key: 'lease_renewal_90d',
    channel: 'email',
    subject: 'Lease Renewal Notice — 90 Days Remaining',
    body: 'Dear {{name}},\n\nYour lease agreement with White Caves expires in 90 days. Please let us know if you wish to renew or vacate.\n\nBest regards,\nWhite Caves Team',
    variables: ['name'],
  },
  lease_renewal_60d: {
    key: 'lease_renewal_60d',
    channel: 'email',
    subject: 'Action Required: Lease Renewal — 60 Days Remaining',
    body: 'Dear {{name}},\n\nThis is a follow-up regarding your upcoming lease expiration in 60 days. We need your formal renewal decision.\n\nBest regards,\nWhite Caves Team',
    variables: ['name'],
  },
  lease_renewal_30d: {
    key: 'lease_renewal_30d',
    channel: 'whatsapp',
    body: 'Hi {{name}}, your lease expires in 30 days. We urgently need your response regarding renewal. Please call us ASAP.',
    variables: ['name'],
  },
  lease_renewal_7d: {
    key: 'lease_renewal_7d',
    channel: 'call',
    body: 'Call script: Final reminder for lease renewal. Urgently confirm decision or prepare move-out inspection.',
    variables: ['name'],
  },

  // ── Post Viewing 48-Hour ──
  post_viewing_30m: {
    key: 'post_viewing_30m',
    channel: 'whatsapp',
    body: 'Hi {{name}}, thanks for viewing the property today! What did you think? Let me know if you would like to make an offer or see more.',
    variables: ['name'],
  },
  post_viewing_48h: {
    key: 'post_viewing_48h',
    channel: 'email',
    subject: 'Feedback on your recent property viewing',
    body: 'Dear {{name}},\n\nThank you for taking the time to view properties with us. I would appreciate any feedback you have. Let me know if you want to proceed with an offer.\n\nBest regards,\n{{agent}}',
    variables: ['name', 'agent'],
  },
};

// ─── NEW CADENCE TEMPLATES ─────────────────────────────────────────────

export const NEW_LEAD_7DAY_NURTURE: CadenceTemplate = {
  cadenceType: 'new_lead_7day_nurture',
  name: 'New Lead 7-Day Nurture',
  description: 'Drip campaign to engage new leads within 7 days',
  totalSteps: 3,
  maxDurationDays: 10,
  steps: [
    {
      stepNumber: 1,
      channel: 'whatsapp',
      delayMs: 1 * DAY,
      templateName: 'new_lead_nurture_d1',
      description: 'Day 1 WhatsApp',
    },
    {
      stepNumber: 2,
      channel: 'email',
      delayMs: 2 * DAY,
      templateName: 'new_lead_nurture_d3',
      description: 'Day 3 Email',
    },
    {
      stepNumber: 3,
      channel: 'call',
      delayMs: 4 * DAY,
      templateName: 'new_lead_nurture_d7',
      description: 'Day 7 Call',
    },
  ],
};

export const LEASE_RENEWAL_90DAY: CadenceTemplate = {
  cadenceType: 'lease_renewal_90day',
  name: 'Lease Renewal 90-Day Notice',
  description: 'Lease renewal tracking sequence (90, 60, 30, 7 days out)',
  totalSteps: 4,
  maxDurationDays: 100,
  steps: [
    {
      stepNumber: 1,
      channel: 'email',
      delayMs: 1 * MINUTE,
      templateName: 'lease_renewal_90d',
      description: '90-day Email notice',
    },
    {
      stepNumber: 2,
      channel: 'email',
      delayMs: 30 * DAY,
      templateName: 'lease_renewal_60d',
      description: '60-day Email notice',
    },
    {
      stepNumber: 3,
      channel: 'whatsapp',
      delayMs: 30 * DAY,
      templateName: 'lease_renewal_30d',
      description: '30-day WhatsApp notice',
    },
    {
      stepNumber: 4,
      channel: 'call',
      delayMs: 23 * DAY,
      templateName: 'lease_renewal_7d',
      description: '7-day Call reminder',
    },
  ],
};

export const POST_VIEWING_48H: CadenceTemplate = {
  cadenceType: 'post_viewing_48h',
  name: 'Post-Viewing 48-Hour Feedback',
  description: 'Request feedback 30 mins and 48 hours after a viewing',
  totalSteps: 2,
  maxDurationDays: 5,
  steps: [
    {
      stepNumber: 1,
      channel: 'whatsapp',
      delayMs: 30 * MINUTE,
      templateName: 'post_viewing_30m',
      description: '30-minute WhatsApp feedback',
    },
    {
      stepNumber: 2,
      channel: 'email',
      delayMs: 2850 * MINUTE,
      templateName: 'post_viewing_48h',
      description: '48-hour Email follow-up',
    },
  ],
};

// ─── Cadence lookup ─────────────────────────────────────────────────────

export const CADENCE_MAP: Record<string, CadenceTemplate> = {
  hot: HOT_CADENCE,
  warm: WARM_CADENCE,
  cold: COLD_CADENCE,
  new_lead_7day_nurture: NEW_LEAD_7DAY_NURTURE,
  lease_renewal_90day: LEASE_RENEWAL_90DAY,
  post_viewing_48h: POST_VIEWING_48H,
};

/**
 * Get the cadence template for a given lead tier.
 * Falls back to cold cadence if tier is unknown.
 */
export function getCadenceForTier(tier: string): CadenceTemplate {
  return CADENCE_MAP[tier] || COLD_CADENCE;
}

/**
 * Resolve template variables for message personalization.
 */
export function resolveTemplate(
  templateKey: string,
  variables: Record<string, string>
): { subject?: string; body: string } | null {
  const template = MESSAGE_TEMPLATES[templateKey];
  if (!template) return null;

  let body = template.body;
  let subject = template.subject;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    body = body.replaceAll(placeholder, value);
    if (subject) {
      subject = subject.replaceAll(placeholder, value);
    }
  }

  return { subject, body };
}
