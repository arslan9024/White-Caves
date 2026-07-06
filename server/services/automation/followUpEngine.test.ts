/**
 * P1-007 — Follow-up multi-tier escalation tests
 *
 * Tests for:
 *   1. Cadence tier selection (hot / warm / cold / inactive)
 *   2. Dynamic rule matching (stage-based + source-based conditions)
 *   3. Duplicate-sequence guard
 *   4. Pause / resume / cancel state transitions
 *   5. Template trigger builder (resolveTemplate variable substitution)
 */

import { beforeEach, describe, expect, it, vi, type MockedFunction } from 'vitest';

// ── Hoisted mocks ──────────────────────────────────────────────────────────
const {
  mockLeadFindUnique,
  mockSequenceFindFirst,
  mockSequenceCreate,
  mockSequenceFindUnique,
  mockSequenceUpdate,
  mockSequenceFindMany,
  mockStepFindUnique,
  mockStepUpdate,
  mockStepUpdateMany,
  mockActivityCreate,
  mockLeadUpdate,
} = vi.hoisted(() => ({
  mockLeadFindUnique: vi.fn(),
  mockSequenceFindFirst: vi.fn(),
  mockSequenceCreate: vi.fn(),
  mockSequenceFindUnique: vi.fn(),
  mockSequenceUpdate: vi.fn(),
  mockSequenceFindMany: vi.fn(),
  mockStepFindUnique: vi.fn(),
  mockStepUpdate: vi.fn(),
  mockStepUpdateMany: vi.fn(),
  mockActivityCreate: vi.fn(),
  mockLeadUpdate: vi.fn(),
}));

const mockCadenceRuleFindMany = vi.hoisted(() => vi.fn());

vi.mock('../../database.js', () => ({
  prisma: {
    lead: { findUnique: mockLeadFindUnique, update: mockLeadUpdate },
    followUpSequence: {
      findFirst: mockSequenceFindFirst,
      create: mockSequenceCreate,
      findUnique: mockSequenceFindUnique,
      update: mockSequenceUpdate,
      findMany: mockSequenceFindMany,
    },
    followUpStep: { findUnique: mockStepFindUnique, update: mockStepUpdate, updateMany: mockStepUpdateMany },
    activity: { create: mockActivityCreate },
    // cadenceRule is accessed via "prisma as any" cast in the engine
    cadenceRule: { findMany: mockCadenceRuleFindMany },
  },
}));

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock('../whatsapp/metaAPI.js', () => ({
  createMetaAPIClient: vi.fn(() => ({ sendMessage: vi.fn() })),
}));
vi.mock('../whatsapp/whatsappUtils.js', () => ({
  normalizePhone: vi.fn((p: string) => p),
  rateLimiter: { check: vi.fn().mockResolvedValue(true) },
}));

import {
  startSequence,
  pauseSequence,
  resumeSequence,
  cancelSequence,
} from './followUpEngine.js';
import { getCadenceForTier, resolveTemplate } from './cadenceTemplates.js';

// ── Helpers ────────────────────────────────────────────────────────────────

function makeLead(overrides: Partial<{
  id: string; name: string; scoreTier: string | null;
  status: string; source: string | null; dealType: string | null;
}> = {}) {
  return {
    id: 'lead-001',
    name: 'Test Lead',
    scoreTier: 'cold',
    status: 'new',
    source: null,
    dealType: null,
    ...overrides,
  };
}

function makeSequence(overrides: Partial<{
  id: string; status: string; currentStep: number; totalSteps: number;
  cadenceType: string; leadId: string; nextStepAt: Date | null;
}> = {}) {
  return {
    id: 'seq-001',
    status: 'active',
    currentStep: 0,
    totalSteps: 4,
    cadenceType: 'cold',
    leadId: 'lead-001',
    nextStepAt: new Date(),
    startedAt: new Date(),
    completedAt: null,
    steps: [],
    ...overrides,
  };
}

// ── 1. Cadence tier selection ──────────────────────────────────────────────
describe('Cadence tier selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCadenceRuleFindMany.mockResolvedValue([]); // no dynamic rules → fall back to static tiers
    mockSequenceFindFirst.mockResolvedValue(null);  // no existing active sequence
    mockActivityCreate.mockResolvedValue({});
  });

  it('assigns HOT cadence for a hot-tier lead (4 steps)', async () => {
    const lead = makeLead({ scoreTier: 'hot' });
    mockLeadFindUnique.mockResolvedValue(lead);
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-hot',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001');

    expect(result.cadenceType).toBe('hot');
    expect(result.totalSteps).toBe(4);
  });

  it('assigns WARM cadence for a warm-tier lead', async () => {
    mockLeadFindUnique.mockResolvedValue(makeLead({ scoreTier: 'warm' }));
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-warm',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001');

    expect(result.cadenceType).toBe('warm');
    expect(result.totalSteps).toBe(4);
  });

  it('assigns COLD cadence for a cold-tier lead', async () => {
    mockLeadFindUnique.mockResolvedValue(makeLead({ scoreTier: 'cold' }));
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-cold',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001');

    expect(result.cadenceType).toBe('cold');
  });

  it('falls back to COLD cadence when scoreTier is null', async () => {
    mockLeadFindUnique.mockResolvedValue(makeLead({ scoreTier: null }));
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-null',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001');

    expect(result.cadenceType).toBe('cold');
  });

  it('respects an explicit cadenceType override in options', async () => {
    mockLeadFindUnique.mockResolvedValue(makeLead({ scoreTier: 'cold' }));
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-override',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001', { cadenceType: 'hot' });

    expect(result.cadenceType).toBe('hot');
    expect(result.totalSteps).toBe(4); // hot cadence has 4 steps
  });
});

// ── 2. Dynamic rule matching ───────────────────────────────────────────────
describe('Dynamic rule matching (multi-tier escalation)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSequenceFindFirst.mockResolvedValue(null);
    mockActivityCreate.mockResolvedValue({});
  });

  it('uses a dynamic rule when tier/source/dealType all match', async () => {
    const dynamicRule = {
      id: 'rule-1',
      name: 'WhatsApp-First Premium Rule',
      description: 'For hot leads from portal',
      isActive: true,
      priority: 10,
      leadTiers: ['hot'],
      leadSources: ['portal'],
      dealTypes: [],
      channelSequence: [
        { channel: 'whatsapp', templateName: 'custom_wap_1', delayMs: 300000, description: 'Custom step 1' },
        { channel: 'email', templateName: 'custom_email_1', delayMs: 3600000, description: 'Custom step 2' },
      ],
      createdAt: new Date(),
    };
    mockCadenceRuleFindMany.mockResolvedValue([dynamicRule]);
    mockLeadFindUnique.mockResolvedValue(
      makeLead({ scoreTier: 'hot', source: 'portal', dealType: null })
    );
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-dyn',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001');

    expect(result.cadenceType).toBe(`rule:${dynamicRule.id}`);
    expect(result.totalSteps).toBe(2);
  });

  it('skips a dynamic rule when tier does not match', async () => {
    const dynamicRule = {
      id: 'rule-2',
      name: 'Hot-Only Rule',
      description: null,
      isActive: true,
      priority: 10,
      leadTiers: ['hot'],          // only matches hot
      leadSources: [],
      dealTypes: [],
      channelSequence: [
        { channel: 'whatsapp', templateName: 'hot_wap', delayMs: 300000, description: 'Step 1' },
      ],
      createdAt: new Date(),
    };
    mockCadenceRuleFindMany.mockResolvedValue([dynamicRule]);
    mockLeadFindUnique.mockResolvedValue(
      makeLead({ scoreTier: 'cold', source: null, dealType: null }) // cold → no match
    );
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-fallback',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001');

    // Should fall back to static cold cadence
    expect(result.cadenceType).toBe('cold');
  });

  it('dynamic rule with empty leadTiers matches any tier', async () => {
    const universalRule = {
      id: 'rule-universal',
      name: 'Universal Rule',
      description: null,
      isActive: true,
      priority: 5,
      leadTiers: [],               // empty = match all tiers
      leadSources: [],
      dealTypes: [],
      channelSequence: [
        { channel: 'email', templateName: 'universal_email', delayMs: 1800000, description: 'Universal step' },
      ],
      createdAt: new Date(),
    };
    mockCadenceRuleFindMany.mockResolvedValue([universalRule]);
    mockLeadFindUnique.mockResolvedValue(makeLead({ scoreTier: 'warm' }));
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-universal',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001');

    expect(result.cadenceType).toBe(`rule:${universalRule.id}`);
  });

  it('higher-priority dynamic rule wins over lower-priority one', async () => {
    const rules = [
      {
        id: 'rule-low',
        name: 'Low priority',
        description: null,
        isActive: true,
        priority: 1,
        leadTiers: [],
        leadSources: [],
        dealTypes: [],
        channelSequence: [
          { channel: 'email', templateName: 'low_email', delayMs: 3600000, description: 'Low step' },
        ],
        createdAt: new Date(),
      },
      {
        id: 'rule-high',
        name: 'High priority',
        description: null,
        isActive: true,
        priority: 20,
        leadTiers: [],
        leadSources: [],
        dealTypes: [],
        channelSequence: [
          { channel: 'whatsapp', templateName: 'high_wap', delayMs: 300000, description: 'High step' },
        ],
        createdAt: new Date(),
      },
    ];
    // Engine does findMany with orderBy priority desc — return high-priority first
    mockCadenceRuleFindMany.mockResolvedValue([rules[1], rules[0]]);
    mockLeadFindUnique.mockResolvedValue(makeLead({ scoreTier: 'hot' }));
    mockSequenceCreate.mockImplementation((args: { data: Record<string, unknown> }) => ({
      id: 'seq-high',
      cadenceType: args.data.cadenceType,
      totalSteps: args.data.totalSteps,
      currentStep: 0,
      steps: [],
    }));

    const result = await startSequence('lead-001');

    expect(result.cadenceType).toBe('rule:rule-high');
  });
});

// ── 3. Duplicate-sequence guard ────────────────────────────────────────────
describe('Duplicate-sequence guard', () => {
  it('throws when an active sequence already exists for the lead', async () => {
    vi.clearAllMocks();
    mockCadenceRuleFindMany.mockResolvedValue([]);
    mockLeadFindUnique.mockResolvedValue(makeLead({ scoreTier: 'hot' }));
    mockSequenceFindFirst.mockResolvedValue(makeSequence({ status: 'active' }));

    await expect(startSequence('lead-001')).rejects.toThrow(
      /already has an active sequence/i
    );
    expect(mockSequenceCreate).not.toHaveBeenCalled();
  });

  it('throws when a paused sequence already exists for the lead', async () => {
    vi.clearAllMocks();
    mockCadenceRuleFindMany.mockResolvedValue([]);
    mockLeadFindUnique.mockResolvedValue(makeLead({ scoreTier: 'warm' }));
    mockSequenceFindFirst.mockResolvedValue(makeSequence({ status: 'paused' }));

    await expect(startSequence('lead-001')).rejects.toThrow(
      /already has an active sequence/i
    );
  });

  it('throws when lead does not exist', async () => {
    vi.clearAllMocks();
    mockLeadFindUnique.mockResolvedValue(null);

    await expect(startSequence('lead-missing')).rejects.toThrow(
      /Lead not found/i
    );
  });
});

// ── 4. Pause / resume / cancel state transitions ───────────────────────────
describe('Sequence state transitions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActivityCreate.mockResolvedValue({});
    mockStepUpdate.mockResolvedValue({});
    mockStepUpdateMany.mockResolvedValue({ count: 0 });
  });

  it('pauseSequence calls update with status=paused', async () => {
    mockSequenceFindUnique.mockResolvedValue(makeSequence({ status: 'active' }));
    mockSequenceUpdate.mockResolvedValue({});

    await pauseSequence('seq-001');

    expect(mockSequenceUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'seq-001' },
        data: expect.objectContaining({ status: 'paused' }),
      })
    );
  });

  it('pauseSequence throws when sequence is not active', async () => {
    mockSequenceFindUnique.mockResolvedValue(makeSequence({ status: 'completed' }));

    await expect(pauseSequence('seq-001')).rejects.toThrow(
      /Cannot pause/i
    );
  });

  it('resumeSequence calls update with status=active', async () => {
    const pausedSeq = makeSequence({
      status: 'paused',
      steps: [{ scheduledAt: new Date(), status: 'pending', id: 'step-001' }] as any,
    } as any);
    mockSequenceFindUnique.mockResolvedValue(pausedSeq);
    mockSequenceUpdate.mockResolvedValue({});

    await resumeSequence('seq-001');

    expect(mockSequenceUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'seq-001' },
        data: expect.objectContaining({ status: 'active' }),
      })
    );
  });

  it('resumeSequence throws when sequence is not paused', async () => {
    mockSequenceFindUnique.mockResolvedValue(makeSequence({ status: 'active' }));

    await expect(resumeSequence('seq-001')).rejects.toThrow(
      /Cannot resume/i
    );
  });

  it('cancelSequence calls update with status=cancelled', async () => {
    mockSequenceFindUnique.mockResolvedValue(makeSequence({ status: 'active' }));
    mockSequenceUpdate.mockResolvedValue({});

    await cancelSequence('seq-001', 'test reason');

    expect(mockSequenceUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'seq-001' },
        data: expect.objectContaining({ status: 'cancelled' }),
      })
    );
  });

  it('cancelSequence logs an activity', async () => {
    mockSequenceFindUnique.mockResolvedValue(makeSequence({ status: 'active' }));
    mockSequenceUpdate.mockResolvedValue({});

    await cancelSequence('seq-001', 'manual cancel');

    expect(mockActivityCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'follow_up_cancelled',
        }),
      })
    );
  });
});

// ── 5. Template trigger builder (resolveTemplate) ─────────────────────────
describe('Template trigger builder — resolveTemplate', () => {
  it('substitutes all named variables in a whatsapp body', () => {
    const result = resolveTemplate('hot_initial_whatsapp', {
      name: 'Alice',
      agent: 'Sara',
      property: 'Downtown Apt',
    });
    expect(result).not.toBeNull();
    expect(result!.body).toContain('Alice');
    expect(result!.body).toContain('Sara');
  });

  it('substitutes all named variables in an email body and subject', () => {
    const result = resolveTemplate('warm_market_update_email', {
      name: 'Bob',
      agent: 'Mira',
      property: 'JVC Studio',
    });
    expect(result).not.toBeNull();
    expect(result!.body).toContain('Bob');
    expect(result!.subject).toBeDefined();
    expect(result!.subject).toContain('Bob');
  });

  it('returns null for an unknown template key', () => {
    const result = resolveTemplate('nonexistent_template_xyz', { name: 'X' });
    expect(result).toBeNull();
  });

  it('resolves a cold_initial_email template', () => {
    const result = resolveTemplate('cold_initial_email', { name: 'Carol', agent: 'Emily' });
    expect(result).not.toBeNull();
    expect(result!.body).toContain('Carol');
    expect(result!.body).toContain('Emily');
    expect(result!.subject).toContain('Carol');
  });
});

// ── 6. getCadenceForTier static mappings ──────────────────────────────────
describe('getCadenceForTier static mappings', () => {
  it('returns HOT_CADENCE for "hot"', () => {
    const c = getCadenceForTier('hot');
    expect(c.cadenceType).toBe('hot');
    expect(c.totalSteps).toBeGreaterThanOrEqual(1);
    expect(c.steps[0].channel).toBe('whatsapp');
  });

  it('returns WARM_CADENCE for "warm"', () => {
    const c = getCadenceForTier('warm');
    expect(c.cadenceType).toBe('warm');
  });

  it('returns COLD_CADENCE for "cold"', () => {
    const c = getCadenceForTier('cold');
    expect(c.cadenceType).toBe('cold');
    expect(c.steps[0].channel).toBe('email');
  });

  it('falls back to COLD_CADENCE for an unknown tier', () => {
    const c = getCadenceForTier('unknown_tier');
    expect(c.cadenceType).toBe('cold');
  });

  it('hot cadence first step fires within 10 minutes (5 min delay)', () => {
    const c = getCadenceForTier('hot');
    expect(c.steps[0].delayMs).toBeLessThanOrEqual(10 * 60 * 1000);
  });
});
