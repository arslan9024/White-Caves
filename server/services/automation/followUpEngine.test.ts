/**
 * Follow-Up Engine Tests — P1-007
 *
 * Tests tier-based cadence resolution, dynamic rule matching,
 * and escalation tier logic.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────

const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      lead: {
        findUnique: fn(),
      },
      followUpSequence: {
        findFirst: fn().mockResolvedValue(null),
        create: fn(),
        findUnique: fn(),
        findMany: fn(),
        update: fn(),
      },
      followUpStep: {
        create: fn(),
        findMany: fn(),
        update: fn(),
        count: fn(),
        aggregate: fn(),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1' }),
        count: fn().mockResolvedValue(0),
        findFirst: fn(),
      },
      cadenceRule: {
        findMany: fn().mockResolvedValue([]),
      },
    },
  };
});

vi.mock('../../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock('../whatsapp/metaAPI.js', () => ({
  createMetaAPIClient: vi.fn(() => ({
    sendMessage: vi.fn().mockResolvedValue('wamid-1'),
    sendTemplate: vi.fn().mockResolvedValue('wamid-2'),
  })),
}));
vi.mock('../whatsapp/whatsappUtils.js', () => ({
  normalizePhone: vi.fn((p: string) => p),
  rateLimiter: { canSend: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })) },
}));

import { startSequence, processScheduledSteps } from './followUpEngine.js';
import { getCadenceForTier } from './cadenceTemplates.js';

describe('FollowUpEngine — P1-007 tier matching and cadence depth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.followUpSequence.findFirst.mockResolvedValue(null);
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });
    mockPrisma.cadenceRule.findMany.mockResolvedValue([]);
  });

  // ── Cadence template tier resolution ──────────────────────────────────

  it('getCadenceForTier returns a cadence template for hot tier', () => {
    const cadence = getCadenceForTier('hot');
    expect(cadence).toBeDefined();
    expect(cadence?.totalSteps).toBeGreaterThanOrEqual(1);
    expect(cadence?.steps.length).toBeGreaterThanOrEqual(1);
  });

  it('getCadenceForTier returns a cadence template for warm tier', () => {
    const cadence = getCadenceForTier('warm');
    expect(cadence).toBeDefined();
    expect(cadence?.totalSteps).toBeGreaterThanOrEqual(1);
  });

  it('getCadenceForTier returns a cadence template for cold tier', () => {
    const cadence = getCadenceForTier('cold');
    expect(cadence).toBeDefined();
  });

  it('getCadenceForTier falls back to cold cadence for unknown tier', () => {
    // The implementation always returns cold cadence as a safe fallback — never null.
    const cadence = getCadenceForTier('unknown_tier');
    expect(cadence).toBeDefined();
    expect(cadence.cadenceType).toBe('cold');
  });

  it('hot cadence has shorter first step delay than cold cadence', () => {
    const hot = getCadenceForTier('hot');
    const cold = getCadenceForTier('cold');
    if (hot && cold && hot.steps[0] && cold.steps[0]) {
      expect(hot.steps[0].delayMs).toBeLessThanOrEqual(cold.steps[0].delayMs);
    }
  });

  it('all cadence steps have valid channel types', () => {
    const validChannels = ['whatsapp', 'email', 'call', 'sms'];
    for (const tier of ['hot', 'warm', 'cold']) {
      const cadence = getCadenceForTier(tier);
      if (cadence) {
        for (const step of cadence.steps) {
          expect(validChannels).toContain(step.channel);
        }
      }
    }
  });

  it('cadence steps have sequential step numbers starting at 1', () => {
    const cadence = getCadenceForTier('hot');
    if (cadence) {
      cadence.steps.forEach((step, i) => {
        expect(step.stepNumber).toBe(i + 1);
      });
    }
  });

  // ── Dynamic cadence rule matching ─────────────────────────────────────

  it('uses fallback static cadence when no dynamic rules match', async () => {
    mockPrisma.lead.findUnique.mockResolvedValueOnce({
      id: 'lead-1',
      name: 'Test Lead',
      scoreTier: 'hot',
      status: 'new',
      source: 'website',
      dealType: null,
      phone: '+971500000001',
      email: 'test@wc.ae',
    });

    mockPrisma.followUpSequence.create.mockResolvedValueOnce({
      id: 'seq-1',
      leadId: 'lead-1',
      cadenceType: 'hot',
      status: 'active',
      totalSteps: 3,
      currentStep: 0,
      startedAt: new Date(),
      completedAt: null,
    });

    mockPrisma.followUpStep.create.mockResolvedValue({ id: 'step-1' });

    const result = await startSequence('lead-1');
    expect(result.cadenceType).toBe('hot');
    expect(result.totalSteps).toBeGreaterThanOrEqual(1);
  });

  it('dynamic rule matches lead tier and source when both specified', async () => {
    const hotWebsiteRule = {
      id: 'rule-hot-web',
      name: 'Hot Website Rule',
      description: null,
      isActive: true,
      priority: 10,
      leadTiers: ['hot'],
      leadSources: ['website'],
      dealTypes: [],
      channelSequence: [
        {
          channel: 'whatsapp',
          delayMs: 300000,
          templateName: 'hot_intro',
          description: 'WhatsApp intro',
        },
        {
          channel: 'email',
          delayMs: 3600000,
          templateName: 'follow_email',
          description: 'Email follow',
        },
      ],
      createdAt: new Date(),
    };

    mockPrisma.cadenceRule.findMany.mockResolvedValueOnce([hotWebsiteRule]);
    mockPrisma.lead.findUnique.mockResolvedValueOnce({
      id: 'lead-2',
      name: 'Hot Website Lead',
      scoreTier: 'hot',
      status: 'new',
      source: 'website',
      dealType: null,
      phone: '+971500000002',
      email: 'hot@wc.ae',
    });

    mockPrisma.followUpSequence.create.mockResolvedValueOnce({
      id: 'seq-2',
      leadId: 'lead-2',
      cadenceType: `rule:${hotWebsiteRule.id}`,
      status: 'active',
      totalSteps: 2,
      currentStep: 0,
      startedAt: new Date(),
      completedAt: null,
    });
    mockPrisma.followUpStep.create.mockResolvedValue({ id: 'step-2' });

    const result = await startSequence('lead-2');
    expect(result.cadenceType).toContain('rule:');
    expect(result.totalSteps).toBe(2);
  });

  it('skips rules with empty channelSequence', async () => {
    mockPrisma.cadenceRule.findMany.mockResolvedValueOnce([
      {
        id: 'rule-empty',
        name: 'Empty Rule',
        description: null,
        isActive: true,
        priority: 99,
        leadTiers: [],
        leadSources: [],
        dealTypes: [],
        channelSequence: [], // empty → should be skipped
        createdAt: new Date(),
      },
    ]);

    mockPrisma.lead.findUnique.mockResolvedValueOnce({
      id: 'lead-3',
      name: 'Warm Lead',
      scoreTier: 'warm',
      status: 'new',
      source: 'referral',
      dealType: null,
      phone: '+971500000003',
      email: 'warm@wc.ae',
    });

    mockPrisma.followUpSequence.create.mockResolvedValueOnce({
      id: 'seq-3',
      leadId: 'lead-3',
      cadenceType: 'warm',
      status: 'active',
      totalSteps: 2,
      currentStep: 0,
      startedAt: new Date(),
      completedAt: null,
    });
    mockPrisma.followUpStep.create.mockResolvedValue({ id: 'step-3' });

    const result = await startSequence('lead-3');
    // Should fall back to static 'warm' cadence since rule had empty steps
    expect(result.cadenceType).toBe('warm');
  });

  it('throws when lead already has an active sequence', async () => {
    mockPrisma.lead.findUnique.mockResolvedValueOnce({
      id: 'lead-dup',
      name: 'Dup Lead',
      scoreTier: 'hot',
      status: 'new',
      source: 'direct',
      dealType: null,
    });
    mockPrisma.followUpSequence.findFirst.mockResolvedValueOnce({
      id: 'existing-seq',
      status: 'active',
    });

    await expect(startSequence('lead-dup')).rejects.toThrow(/already has an active sequence/i);
  });

  it('throws when lead is not found', async () => {
    mockPrisma.lead.findUnique.mockResolvedValueOnce(null);
    await expect(startSequence('non-existent')).rejects.toThrow(/lead not found/i);
  });

  describe('W24-010 Auto-Pause Engine', () => {
    it('auto-pauses follow-up when there is manual agent contact in the last 24h', async () => {
      mockPrisma.followUpSequence.findMany.mockResolvedValueOnce([
        {
          id: 'seq-due',
          cadenceType: 'hot',
          status: 'active',
          currentStep: 0,
          totalSteps: 4,
          nextStepAt: new Date(),
          lead: {
            id: 'lead-due',
            name: 'John Doe',
            phone: '+971500000000',
            email: 'john@wc.ae',
            status: 'new',
          },
          steps: [
            {
              id: 'step-due',
              stepNumber: 1,
              channel: 'whatsapp',
              status: 'pending',
              templateName: 'hot_initial_whatsapp',
            },
          ],
        },
      ]);

      // Mock manual agent activity in last 24h
      mockPrisma.activity.findFirst.mockResolvedValueOnce({
        id: 'manual-act',
        action: 'call',
        userId: 'agent-123',
      });

      mockPrisma.followUpSequence.findUnique.mockResolvedValue({
        id: 'seq-due',
        status: 'active',
        leadId: 'lead-due',
      });

      const batchResult = await processScheduledSteps();

      expect(batchResult.processed).toBe(1);
      expect(batchResult.skipped).toBe(1); // paused instead of executing
      expect(mockPrisma.followUpSequence.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'seq-due' },
          data: expect.objectContaining({ status: 'paused' }),
        })
      );
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'follow_up_autopause',
          }),
        })
      );
    });
  });

  describe('W24-011 Seeded Cadence Templates', () => {
    it('seeds new lead 7day nurture template correctly', () => {
      const nurture = getCadenceForTier('new_lead_7day_nurture');
      expect(nurture).toBeDefined();
      expect(nurture.cadenceType).toBe('new_lead_7day_nurture');
      expect(nurture.totalSteps).toBe(3);
      expect(nurture.steps[0]?.channel).toBe('whatsapp');
      expect(nurture.steps[1]?.channel).toBe('email');
      expect(nurture.steps[2]?.channel).toBe('call');
    });

    it('seeds lease renewal 90day template correctly', () => {
      const renewal = getCadenceForTier('lease_renewal_90day');
      expect(renewal).toBeDefined();
      expect(renewal.cadenceType).toBe('lease_renewal_90day');
      expect(renewal.totalSteps).toBe(4);
      expect(renewal.steps[0]?.channel).toBe('email');
      expect(renewal.steps[2]?.channel).toBe('whatsapp');
    });

    it('seeds post viewing 48h template correctly', () => {
      const viewing = getCadenceForTier('post_viewing_48h');
      expect(viewing).toBeDefined();
      expect(viewing.cadenceType).toBe('post_viewing_48h');
      expect(viewing.totalSteps).toBe(2);
      expect(viewing.steps[0]?.channel).toBe('whatsapp');
      expect(viewing.steps[1]?.channel).toBe('email');
    });
  });
});
