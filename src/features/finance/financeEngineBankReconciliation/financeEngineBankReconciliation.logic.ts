/**
 * Finance Engine — Bank Reconciliation
 * Parent issue: #1937 (Finance Engine, workstream W56)
 * Child issue: #2429 (implementation of the matching engine)
 *
 * Implements the pure reconciliation engine described in
 * `financeEngineBankReconciliation.contract.md` and the companion SRS/SDD
 * handoff docs (`plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`,
 * `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md`).
 *
 * No I/O, no framework dependencies, no mutation of inputs — safe to unit
 * test in isolation and safe to call repeatedly with identical inputs
 * (idempotent per contract §"Idempotency").
 */

/** ISO 4217 currency code, validated at runtime against /^[A-Z]{3}$/. */
export type CurrencyCode = string;

export interface BankStatementLine {
  readonly id: string;
  /** ISO 8601 date (YYYY-MM-DD) the bank posted the transaction. */
  readonly postedAt: string;
  /** Signed integer amount in minor currency units (e.g. cents). */
  readonly amountMinorUnits: number;
  readonly currency: CurrencyCode;
  readonly description: string;
  readonly externalReference: string | null;
}

export interface LedgerTransaction {
  readonly id: string;
  /** ISO 8601 date (YYYY-MM-DD) the transaction was booked internally. */
  readonly bookedAt: string;
  /** Signed integer amount in minor currency units (e.g. cents). */
  readonly amountMinorUnits: number;
  readonly currency: CurrencyCode;
  readonly memo: string;
  readonly reconciliationStatus: 'unreconciled' | 'matched' | 'disputed';
}

/**
 * `manual` is reserved for operator-confirmed matches and is never produced
 * by the automatic matching engine (contract §"No partial-amount matching").
 */
export type MatchType = 'exact' | 'amount-and-date' | 'manual';

export interface ReconciliationMatch {
  readonly statementLineId: string;
  readonly ledgerTransactionId: string;
  readonly matchType: MatchType;
  /** Value in the closed interval [0, 1]. */
  readonly confidence: number;
}

export type ValidationErrorReason = 'invalid_currency' | 'non_integer_amount';

export interface ValidationError {
  readonly recordId: string;
  readonly recordType: 'statement_line' | 'ledger_transaction';
  readonly reason: ValidationErrorReason;
}

export interface ReconciliationResult {
  readonly matches: readonly ReconciliationMatch[];
  readonly unmatchedStatementLines: readonly BankStatementLine[];
  readonly unmatchedLedgerTransactions: readonly LedgerTransaction[];
  /**
   * Malformed records (invalid currency codes, non-integer amounts) that
   * were excluded from matching. Extends the contract's base result shape
   * so validation failures are surfaced via a signal channel rather than
   * silently dropped (contract §"Error Handling").
   */
  readonly validationErrors: readonly ValidationError[];
}

export interface ReconciliationOptions {
  /** Date tolerance window, in days, for `amount-and-date` matches. Default 3. */
  readonly dateToleranceDays?: number;
}

const DEFAULT_DATE_TOLERANCE_DAYS = 3;
const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

function isValidCurrency(currency: string): boolean {
  return CURRENCY_CODE_PATTERN.test(currency);
}

function isValidAmount(amountMinorUnits: number): boolean {
  return Number.isInteger(amountMinorUnits);
}

function toDayCount(dateIso: string): number {
  const parsed = Date.parse(`${dateIso}T00:00:00Z`);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid ISO date string: "${dateIso}"`);
  }
  return Math.floor(parsed / 86_400_000);
}

function absDateDeltaDays(aDateIso: string, bDateIso: string): number {
  return Math.abs(toDayCount(aDateIso) - toDayCount(bDateIso));
}

interface LedgerCandidate {
  readonly transaction: LedgerTransaction;
  /** Index in the original, full `ledgerTransactions` input array. */
  readonly originalIndex: number;
}

/**
 * Reconciles bank statement lines against internal ledger transactions.
 *
 * Pure function: never mutates `statementLines`, `ledgerTransactions`, or
 * any element within them. Deterministic for a given input and options
 * (contract §"Idempotency", §"No mutation of inputs").
 */
export function reconcile(
  statementLines: readonly BankStatementLine[],
  ledgerTransactions: readonly LedgerTransaction[],
  options: ReconciliationOptions = {}
): ReconciliationResult {
  const dateToleranceDays = options.dateToleranceDays ?? DEFAULT_DATE_TOLERANCE_DAYS;
  if (dateToleranceDays < 0) {
    throw new Error('dateToleranceDays must be a non-negative number');
  }

  const validationErrors: ValidationError[] = [];

  // --- Validation pass: exclude malformed records, never throw, never
  // silently drop the signal (contract §"Error Handling"). ---
  const validStatementLines: BankStatementLine[] = [];
  for (const line of statementLines) {
    if (!isValidCurrency(line.currency)) {
      validationErrors.push({
        recordId: line.id,
        recordType: 'statement_line',
        reason: 'invalid_currency',
      });
      continue;
    }
    if (!isValidAmount(line.amountMinorUnits)) {
      validationErrors.push({
        recordId: line.id,
        recordType: 'statement_line',
        reason: 'non_integer_amount',
      });
      continue;
    }
    validStatementLines.push(line);
  }

  const validLedgerTransactions: LedgerTransaction[] = [];
  for (const transaction of ledgerTransactions) {
    if (!isValidCurrency(transaction.currency)) {
      validationErrors.push({
        recordId: transaction.id,
        recordType: 'ledger_transaction',
        reason: 'invalid_currency',
      });
      continue;
    }
    if (!isValidAmount(transaction.amountMinorUnits)) {
      validationErrors.push({
        recordId: transaction.id,
        recordType: 'ledger_transaction',
        reason: 'non_integer_amount',
      });
      continue;
    }
    validLedgerTransactions.push(transaction);
  }

  // --- Partition ledger candidates by currency, then by amount, so each
  // statement line only ever considers same-currency, same-amount
  // candidates (contract §"Currency isolation"). Original input order is
  // preserved via `originalIndex` for deterministic tie-breaking. ---
  const ledgerByCurrencyAndAmount = new Map<string, Map<number, LedgerCandidate[]>>();
  validLedgerTransactions.forEach((transaction, originalIndex) => {
    let byAmount = ledgerByCurrencyAndAmount.get(transaction.currency);
    if (!byAmount) {
      byAmount = new Map<number, LedgerCandidate[]>();
      ledgerByCurrencyAndAmount.set(transaction.currency, byAmount);
    }
    const bucket = byAmount.get(transaction.amountMinorUnits) ?? [];
    bucket.push({ transaction, originalIndex });
    byAmount.set(transaction.amountMinorUnits, bucket);
  });

  const consumedLedgerIds = new Set<string>();
  const matches: ReconciliationMatch[] = [];
  const unmatchedStatementLines: BankStatementLine[] = [];

  for (const line of validStatementLines) {
    const byAmount = ledgerByCurrencyAndAmount.get(line.currency);
    const candidates = byAmount?.get(line.amountMinorUnits);
    const availableCandidates = (candidates ?? []).filter(
      candidate => !consumedLedgerIds.has(candidate.transaction.id)
    );

    if (availableCandidates.length === 0) {
      unmatchedStatementLines.push(line);
      continue;
    }

    // Prefer the smallest date difference; break ties by lowest original
    // index in the ledger array (SDD §5 step 2c) for deterministic output.
    let best: LedgerCandidate | null = null;
    let bestDelta = Number.POSITIVE_INFINITY;
    for (const candidate of availableCandidates) {
      const delta = absDateDeltaDays(line.postedAt, candidate.transaction.bookedAt);
      if (
        best === null ||
        delta < bestDelta ||
        (delta === bestDelta && candidate.originalIndex < best.originalIndex)
      ) {
        best = candidate;
        bestDelta = delta;
      }
    }

    if (best === null || bestDelta > dateToleranceDays) {
      unmatchedStatementLines.push(line);
      continue;
    }

    const matchType: MatchType = bestDelta === 0 ? 'exact' : 'amount-and-date';
    const confidence = dateToleranceDays === 0 ? 1 : 1 - 0.5 * (bestDelta / dateToleranceDays);

    matches.push({
      statementLineId: line.id,
      ledgerTransactionId: best.transaction.id,
      matchType,
      confidence,
    });
    consumedLedgerIds.add(best.transaction.id);
  }

  const unmatchedLedgerTransactions = validLedgerTransactions.filter(
    transaction => !consumedLedgerIds.has(transaction.id)
  );

  return {
    matches,
    unmatchedStatementLines,
    unmatchedLedgerTransactions,
    validationErrors,
  };
}
