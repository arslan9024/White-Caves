import { describe, it, expect, beforeEach } from 'vitest';
import { LaneRouter } from './laneRouter.js';

describe('LaneRouter', () => {
  let router: LaneRouter;

  beforeEach(() => {
    router = new LaneRouter();
  });

  // ─── Routing rules ──────────────────────────────────────────────────────

  it('routes to nadia for meta provider hint', () => {
    const result = router.route({ from: '971501111111', providerHint: 'meta' });
    expect(result.lane).toBe('nadia');
    expect(result.handledBy).toBe('nadia');
    expect(result.reason).toBe('meta_provider_hint');
  });

  it('routes to nadia for waba provider hint (alias)', () => {
    const result = router.route({ from: '971501111111', providerHint: 'waba' });
    expect(result.lane).toBe('nadia');
    expect(result.reason).toBe('meta_provider_hint');
  });

  it('routes to linda for localauth provider hint', () => {
    const result = router.route({ from: '971502222222', providerHint: 'localauth' });
    expect(result.lane).toBe('linda');
    expect(result.handledBy).toBe('linda');
    expect(result.reason).toBe('localauth_provider_hint');
  });

  it('routes template messages to nadia regardless of hint', () => {
    const result = router.route({ from: '971503333333', isTemplate: true });
    expect(result.lane).toBe('nadia');
    expect(result.reason).toBe('template_requires_waba');
  });

  it('routes to nadia by default when no hint is provided', () => {
    const result = router.route({ from: '971504444444', body: 'hello' });
    expect(result.lane).toBe('nadia');
    expect(result.reason).toBe('default_waba_lane');
  });

  it('routes duplicate to unknown lane and supervisor', () => {
    const key = 'dup-key-001';
    router.route({ from: '111', dedupeKey: key });
    const result = router.route({ from: '111', dedupeKey: key });
    expect(result.lane).toBe('unknown');
    expect(result.handledBy).toBe('supervisor');
    expect(result.reason).toBe('duplicate_detected');
  });

  // ─── Deduplication ──────────────────────────────────────────────────────

  it('isDuplicate returns false for a new key', () => {
    expect(router.isDuplicate('fresh-key')).toBe(false);
  });

  it('isDuplicate returns true after markProcessed', () => {
    router.markProcessed('my-key');
    expect(router.isDuplicate('my-key')).toBe(true);
  });

  it('isDuplicate returns false after the dedup window expires (manual override)', () => {
    router.markProcessed('old-key');
    // Manually set the cache entry to an old timestamp
    const cache = (router as unknown as { dedupeCache: Map<string, Date> }).dedupeCache;
    cache.set('old-key', new Date(Date.now() - 61_000));
    expect(router.isDuplicate('old-key')).toBe(false);
  });

  it('clearDuplicates removes entries older than threshold', () => {
    router.markProcessed('key1');
    router.markProcessed('key2');
    const cache = (router as unknown as { dedupeCache: Map<string, Date> }).dedupeCache;
    // Age key1
    cache.set('key1', new Date(Date.now() - 61_000));
    const removed = router.clearDuplicates(60_000);
    expect(removed).toBe(1);
    expect(router.isDuplicate('key1')).toBe(false);
    expect(router.isDuplicate('key2')).toBe(true);
  });

  // ─── Provenance ─────────────────────────────────────────────────────────

  it('provenance contains policyVersion', () => {
    const result = router.route({ from: '971500000001' });
    expect(result.provenance.policyVersion).toBeTruthy();
  });

  it('provenance dedupeKey is populated', () => {
    const result = router.route({ from: '111', dedupeKey: 'explicit-key' });
    expect(result.provenance.dedupeKey).toBe('explicit-key');
  });

  it('provenance processedAt is a recent Date', () => {
    const before = Date.now();
    const result = router.route({ from: '222' });
    const after = Date.now();
    expect(result.provenance.processedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.provenance.processedAt.getTime()).toBeLessThanOrEqual(after);
  });

  // ─── Stats ──────────────────────────────────────────────────────────────

  it('getStats returns lane routing counts', () => {
    router.route({ from: 'a', providerHint: 'meta' });
    router.route({ from: 'b', providerHint: 'meta' });
    router.route({ from: 'c', providerHint: 'localauth' });
    const stats = router.getStats();
    expect(stats.nadia).toBe(2);
    expect(stats.linda).toBe(1);
    expect(stats.unknown).toBe(0);
  });

  it('getStats increments unknown for duplicates', () => {
    const key = 'stat-dup';
    router.route({ from: 'x', dedupeKey: key });
    router.route({ from: 'x', dedupeKey: key });
    const stats = router.getStats();
    expect(stats.unknown).toBe(1);
  });
});
