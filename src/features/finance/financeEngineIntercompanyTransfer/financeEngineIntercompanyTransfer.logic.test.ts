import { describe, expect, it } from 'vitest';

import {
  createAllowAllAuthorizationChecker,
  createDenyListAuthorizationChecker,
  createFixedClock,
  createInMemoryEntityDirectory,
  createInMemoryIdempotencyStore,
  createInMemoryLedgerPoster,
  createIntercompanyTransferEngine,
  createSequentialIdGenerator,
  type IntercompanyTransferEngine,
  type IntercompanyTransferRequest,
  type PostedTransferResult,
} from './financeEngineIntercompanyTransfer.logic';

const HOLDING = 'entity-holding';
const PROJECT_SPV = 'entity-project-spv';

interface Harness {
  engine: IntercompanyTransferEngine;
}

function buildHarness(options?: { deniedRequestedBy?: readonly string[] }): Harness {
  const entityDirectory = createInMemoryEntityDirectory([HOLDING, PROJECT_SPV]);
  const authorizationChecker = options?.deniedRequestedBy
    ? createDenyListAuthorizationChecker(options.deniedRequestedBy)
    : createAllowAllAuthorizationChecker();
  const idempotencyStore = createInMemoryIdempotencyStore();
  const ledgerPoster = createInMemoryLedgerPoster(
    createSequentialIdGenerator('entry'),
    createFixedClock('2026-01-01T00:00:00.000Z')
  );
  const engine = createIntercompanyTransferEngine({
    entityDirectory,
    authorizationChecker,
    idempotencyStore,
    ledgerPoster,
  });
  return { engine };
}

function baseRequest(
  overrides?: Partial<IntercompanyTransferRequest>
): IntercompanyTransferRequest {
  return {
    requestId: 'req-1',
    sourceEntityId: HOLDING,
    destinationEntityId: PROJECT_SPV,
    amountMinorUnits: 10_000,
    currency: 'AED',
    requestedBy: 'treasury-operator-1',
    ...overrides,
  };
}

describe('financeEngineIntercompanyTransfer.logic', () => {
  it('rejects a transfer between the same entity with SAME_ENTITY', () => {
    const { engine } = buildHarness();
    const result = engine.submitTransfer(
      baseRequest({ sourceEntityId: HOLDING, destinationEntityId: HOLDING })
    );
    expect(result).toEqual({ status: 'rejected', requestId: 'req-1', reason: 'SAME_ENTITY' });
  });

  it('rejects a non-positive amount with NON_POSITIVE_AMOUNT', () => {
    const { engine } = buildHarness();
    const zeroResult = engine.submitTransfer(baseRequest({ amountMinorUnits: 0 }));
    const negativeResult = engine.submitTransfer(
      baseRequest({ requestId: 'req-2', amountMinorUnits: -5 })
    );
    const fractionalResult = engine.submitTransfer(
      baseRequest({ requestId: 'req-3', amountMinorUnits: 1.5 })
    );

    expect(zeroResult).toEqual({
      status: 'rejected',
      requestId: 'req-1',
      reason: 'NON_POSITIVE_AMOUNT',
    });
    expect(negativeResult).toEqual({
      status: 'rejected',
      requestId: 'req-2',
      reason: 'NON_POSITIVE_AMOUNT',
    });
    expect(fractionalResult).toEqual({
      status: 'rejected',
      requestId: 'req-3',
      reason: 'NON_POSITIVE_AMOUNT',
    });
  });

  it('rejects an unsupported currency with UNSUPPORTED_CURRENCY', () => {
    const { engine } = buildHarness();
    const result = engine.submitTransfer(baseRequest({ currency: 'XYZ' }));
    expect(result).toEqual({
      status: 'rejected',
      requestId: 'req-1',
      reason: 'UNSUPPORTED_CURRENCY',
    });
  });

  it('rejects an unregistered entity with UNKNOWN_ENTITY', () => {
    const { engine } = buildHarness();
    const unknownSource = engine.submitTransfer(baseRequest({ sourceEntityId: 'entity-ghost' }));
    const unknownDestination = engine.submitTransfer(
      baseRequest({ requestId: 'req-2', destinationEntityId: 'entity-ghost' })
    );
    expect(unknownSource).toEqual({
      status: 'rejected',
      requestId: 'req-1',
      reason: 'UNKNOWN_ENTITY',
    });
    expect(unknownDestination).toEqual({
      status: 'rejected',
      requestId: 'req-2',
      reason: 'UNKNOWN_ENTITY',
    });
  });

  it('rejects an unauthorized caller with INSUFFICIENT_AUTHORIZATION', () => {
    const { engine } = buildHarness({ deniedRequestedBy: ['treasury-operator-1'] });
    const result = engine.submitTransfer(baseRequest());
    expect(result).toEqual({
      status: 'rejected',
      requestId: 'req-1',
      reason: 'INSUFFICIENT_AUTHORIZATION',
    });
  });

  it('evaluates rejection reasons in the fixed order (structural before authorization)', () => {
    const { engine } = buildHarness({ deniedRequestedBy: ['treasury-operator-1'] });
    // Same-entity is a structural error and must win over the caller's lack of authorization.
    const result = engine.submitTransfer(
      baseRequest({ sourceEntityId: HOLDING, destinationEntityId: HOLDING })
    );
    expect(result).toEqual({ status: 'rejected', requestId: 'req-1', reason: 'SAME_ENTITY' });
  });

  it('posts exactly two ledger entries with correct debit/credit direction and shared requestId on success', () => {
    const { engine } = buildHarness();
    const result = engine.submitTransfer(baseRequest());

    expect(result.status).toBe('posted');
    const posted = result as PostedTransferResult;
    expect(posted.debitEntry.direction).toBe('debit');
    expect(posted.debitEntry.entityId).toBe(HOLDING);
    expect(posted.creditEntry.direction).toBe('credit');
    expect(posted.creditEntry.entityId).toBe(PROJECT_SPV);
    expect(posted.debitEntry.amountMinorUnits).toBe(10_000);
    expect(posted.creditEntry.amountMinorUnits).toBe(10_000);
    expect(posted.debitEntry.requestId).toBe('req-1');
    expect(posted.creditEntry.requestId).toBe('req-1');
    expect(posted.debitEntry.id).not.toBe(posted.creditEntry.id);
  });

  it('replays an identical result for a duplicate requestId without creating a second posting', () => {
    const { engine } = buildHarness();
    const first = engine.submitTransfer(baseRequest());
    const second = engine.submitTransfer(baseRequest());

    expect(second).toEqual(first);
    const posted = first as PostedTransferResult;
    // Confirm no second posting occurred: entry ids must be identical across both calls.
    expect((second as PostedTransferResult).debitEntry.id).toBe(posted.debitEntry.id);
    expect((second as PostedTransferResult).creditEntry.id).toBe(posted.creditEntry.id);
  });

  it('produces an equal-and-opposite reversal pair without mutating the original entries', () => {
    const { engine } = buildHarness();
    const original = engine.submitTransfer(baseRequest()) as PostedTransferResult;

    const reversal = engine.reverseTransfer('req-1', 'req-1-reversal');

    expect(reversal.status).toBe('reversed');
    // Equal and opposite: debit hits the original credit side, credit hits the original debit side.
    expect(reversal.debitEntry.entityId).toBe(original.creditEntry.entityId);
    expect(reversal.creditEntry.entityId).toBe(original.debitEntry.entityId);
    expect(reversal.debitEntry.amountMinorUnits).toBe(original.debitEntry.amountMinorUnits);
    expect(reversal.creditEntry.amountMinorUnits).toBe(original.debitEntry.amountMinorUnits);
    expect(reversal.debitEntry.reversalOfRequestId).toBe('req-1');
    expect(reversal.creditEntry.reversalOfRequestId).toBe('req-1');

    // Original entries remain untouched (append-only ledger; no in-place mutation).
    expect(original.debitEntry.entityId).toBe(HOLDING);
    expect(original.creditEntry.entityId).toBe(PROJECT_SPV);
    expect(original.debitEntry.reversalOfRequestId).toBeUndefined();
  });

  it('replays an identical reversal result when the reversal requestId is submitted twice', () => {
    const { engine } = buildHarness();
    engine.submitTransfer(baseRequest());

    const firstReversal = engine.reverseTransfer('req-1', 'req-1-reversal');
    const secondReversal = engine.reverseTransfer('req-1', 'req-1-reversal');

    expect(secondReversal).toEqual(firstReversal);
    expect(secondReversal.debitEntry.id).toBe(firstReversal.debitEntry.id);
    expect(secondReversal.creditEntry.id).toBe(firstReversal.creditEntry.id);
  });

  it('throws when attempting to reverse a requestId that was never posted', () => {
    const { engine } = buildHarness();
    expect(() => engine.reverseTransfer('never-posted', 'reversal-1')).toThrow(
      /no posted transfer found for requestId "never-posted"/
    );
  });

  it('throws when attempting to reverse a rejected (never posted) transfer', () => {
    const { engine } = buildHarness();
    engine.submitTransfer(baseRequest({ sourceEntityId: HOLDING, destinationEntityId: HOLDING }));
    expect(() => engine.reverseTransfer('req-1', 'reversal-1')).toThrow();
  });
});
