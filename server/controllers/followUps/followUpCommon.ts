/**
 * Follow-Up Common Types & Normalization Utilities
 */

import { AppError } from '../../middleware/errorHandler.js';

export type CadenceRulePayload = {
  name?: unknown;
  description?: unknown;
  isActive?: unknown;
  priority?: unknown;
  leadTiers?: unknown;
  leadSources?: unknown;
  dealTypes?: unknown;
  channelSequence?: unknown;
  quietHoursStart?: unknown;
  quietHoursEnd?: unknown;
  dailyCapPerLead?: unknown;
  cooldownHours?: unknown;
};

export type RuleChannel = 'whatsapp' | 'email' | 'call' | 'sms';

export type NormalizedRuleStep = {
  channel: RuleChannel;
  delayMs: number;
  templateName: string;
  description: string;
};

export function normalizeDelayMs(value: {
  delayMs?: unknown;
  delayHours?: unknown;
  delayMinutes?: unknown;
}): number {
  if (typeof value.delayMs === 'number' && Number.isFinite(value.delayMs) && value.delayMs >= 0) {
    return Math.trunc(value.delayMs);
  }

  if (
    typeof value.delayHours === 'number' &&
    Number.isFinite(value.delayHours) &&
    value.delayHours >= 0
  ) {
    return Math.trunc(value.delayHours * 60 * 60 * 1000);
  }

  if (
    typeof value.delayMinutes === 'number' &&
    Number.isFinite(value.delayMinutes) &&
    value.delayMinutes >= 0
  ) {
    return Math.trunc(value.delayMinutes * 60 * 1000);
  }

  return 0;
}

export function normalizeChannelSequence(value: unknown): NormalizedRuleStep[] {
  if (!Array.isArray(value)) return [];

  const normalized = value
    .map((item, index) => {
      const step = item as {
        channel?: unknown;
        delayMs?: unknown;
        delayHours?: unknown;
        delayMinutes?: unknown;
        templateName?: unknown;
        description?: unknown;
      };

      const channelRaw = typeof step.channel === 'string' ? step.channel.trim().toLowerCase() : '';
      const isValidChannel =
        channelRaw === 'whatsapp' ||
        channelRaw === 'email' ||
        channelRaw === 'call' ||
        channelRaw === 'sms';

      if (!isValidChannel) {
        return null;
      }

      const channel = channelRaw as RuleChannel;
      const delayMs = normalizeDelayMs(step);

      return {
        channel,
        delayMs,
        templateName:
          typeof step.templateName === 'string' && step.templateName.trim().length > 0
            ? step.templateName.trim()
            : `rule_${channel}_${index + 1}`,
        description:
          typeof step.description === 'string' && step.description.trim().length > 0
            ? step.description.trim()
            : `Rule step ${index + 1}`,
      } satisfies NormalizedRuleStep;
    })
    .filter((step): step is NormalizedRuleStep => Boolean(step));

  return normalized;
}

export function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === 'string')
    .map(v => v.trim())
    .filter(Boolean);
}

export function normalizeRulePayload(body: CadenceRulePayload) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) {
    throw new AppError('name is required', 400);
  }

  const channelSequence = normalizeChannelSequence(body.channelSequence);
  if (channelSequence.length === 0) {
    throw new AppError('channelSequence is required and must be a non-empty array', 400);
  }

  return {
    name,
    description: typeof body.description === 'string' ? body.description.trim() || null : null,
    isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
    priority:
      typeof body.priority === 'number' && Number.isFinite(body.priority)
        ? Math.max(0, Math.trunc(body.priority))
        : 0,
    leadTiers: normalizeStringArray(body.leadTiers),
    leadSources: normalizeStringArray(body.leadSources),
    dealTypes: normalizeStringArray(body.dealTypes),
    channelSequence,
    quietHoursStart:
      typeof body.quietHoursStart === 'string' ? body.quietHoursStart.trim() || null : null,
    quietHoursEnd:
      typeof body.quietHoursEnd === 'string' ? body.quietHoursEnd.trim() || null : null,
    dailyCapPerLead:
      typeof body.dailyCapPerLead === 'number' && Number.isFinite(body.dailyCapPerLead)
        ? Math.max(1, Math.trunc(body.dailyCapPerLead))
        : 3,
    cooldownHours:
      typeof body.cooldownHours === 'number' && Number.isFinite(body.cooldownHours)
        ? Math.max(0, Math.trunc(body.cooldownHours))
        : 24,
  };
}

export function formatDelay(ms: number): string {
  const minutes = ms / 60000;
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours} hours`;
  const days = hours / 24;
  return `${days} days`;
}

