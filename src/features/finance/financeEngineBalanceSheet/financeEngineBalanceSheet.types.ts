/**
 * financeEngineBalanceSheet.types.ts
 *
 * Type definitions and the strictly-typed public computation contract for
 * the Balance Sheet sub-module of the Finance Engine, as agreed in
 * `financeEngineBalanceSheet.contract.md`.
 *
 * Parent issue: #1943
 * Issue: #2404
 *
 * This module derives a point-in-time balance sheet (assets, liabilities,
 * equity) from a flat list of accounts and exposes a pure,
 * framework-agnostic `buildBalanceSheet` function plus supporting type
 * guards and validation helpers. It has no I/O, no network access, and no
 * persistence — only deterministic computation over caller-supplied data.
 *
 * This module intentionally defines its own account/report shapes rather
 * than importing from `financeEngineBalanceSheet.logic.ts`: the two files
 * are independent public surfaces (mirroring the sibling
 * financeEngine* modules in this directory, e.g. financeEngineQuarterlyVat),
 * so this module can be consumed, tested, and evolved without coupling to
 * the pre-existing line-item-based engine.
 */

/** Top level classification of a balance sheet account. */
export type BalanceSheetAccountCategory = 'asset' | 'liability' | 'equity';

/** A single account contributing to the balance sheet. */
export interface BalanceSheetAccount {
  /** Unique identifier for the account (GL code, account id, etc.). */
  readonly id: string;
  /** Human-readable name, e.g. "Cash and cash equivalents". */
  readonly name: string;
  /** Top level classification. */
  readonly category: BalanceSheetAccountCategory;
  /** Free-form grouping bucket within the category, e.g. "current". */
  readonly subCategory: string;
  /**
   * Account balance in integer minor units (e.g. cents/fils). Must be a
   * finite integer; the engine does not accept floating currency values.
   */
  readonly balance: number;
}

/** Input required to compute a point-in-time balance sheet. */
export interface BalanceSheetInput {
  /** ISO-8601 date string, e.g. "2026-09-06". */
  readonly asOfDate: string;
  /** All accounts contributing to the report. */
  readonly accounts: readonly BalanceSheetAccount[];
}

/** A grouped, totaled section within a top-level category. */
export interface BalanceSheetSection {
  readonly subCategory: string;
  readonly total: number;
  readonly accounts: readonly BalanceSheetAccount[];
}

/** Aggregated totals and section breakdown for one top-level category. */
export interface BalanceSheetCategoryTotals {
  readonly total: number;
  readonly sections: readonly BalanceSheetSection[];
}

/** Fully computed balance sheet report. */
export interface BalanceSheetReport {
  readonly asOfDate: string;
  readonly assets: BalanceSheetCategoryTotals;
  readonly liabilities: BalanceSheetCategoryTotals;
  readonly equity: BalanceSheetCategoryTotals;
  /** True iff assets.total === liabilities.total + equity.total. */
  readonly isBalanced: boolean;
}

const CATEGORIES: readonly BalanceSheetAccountCategory[] = ['asset', 'liability', 'equity'];

/** Matches a strict ISO-8601 calendar date, e.g. "2026-09-06". */
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isFiniteInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value);
}

/**
 * Validates that a string is a strict, calendar-valid ISO-8601 date
 * (YYYY-MM-DD). Rejects malformed strings and out-of-range calendar dates
 * (e.g. "2026-02-30").
 */
export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

/** Type guard for {@link BalanceSheetAccount}. */
export function isBalanceSheetAccount(value: unknown): value is BalanceSheetAccount {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || candidate.id.trim().length === 0) {
    return false;
  }
  if (typeof candidate.name !== 'string' || candidate.name.trim().length === 0) {
    return false;
  }
  if (
    typeof candidate.category !== 'string' ||
    !CATEGORIES.includes(candidate.category as BalanceSheetAccountCategory)
  ) {
    return false;
  }
  if (typeof candidate.subCategory !== 'string' || candidate.subCategory.trim().length === 0) {
    return false;
  }
  if (!isFiniteInteger(candidate.balance)) {
    return false;
  }
  return true;
}

/** Type guard for {@link BalanceSheetInput}. */
export function isBalanceSheetInput(value: unknown): value is BalanceSheetInput {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (!isValidIsoDate(candidate.asOfDate)) {
    return false;
  }
  if (!Array.isArray(candidate.accounts)) {
    return false;
  }
  return candidate.accounts.every(account => isBalanceSheetAccount(account));
}

function sumBalances(accounts: readonly BalanceSheetAccount[]): number {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
}

/**
 * Groups accounts of a single category into sections keyed by
 * `subCategory`, preserving the first-seen order of each subCategory
 * (invariant #5 of the module contract).
 */
function buildSections(accounts: readonly BalanceSheetAccount[]): readonly BalanceSheetSection[] {
  const order: string[] = [];
  const bySubCategory = new Map<string, BalanceSheetAccount[]>();

  for (const account of accounts) {
    let bucket = bySubCategory.get(account.subCategory);
    if (!bucket) {
      bucket = [];
      bySubCategory.set(account.subCategory, bucket);
      order.push(account.subCategory);
    }
    bucket.push(account);
  }

  return order.map(subCategory => {
    const sectionAccounts = bySubCategory.get(subCategory) ?? [];
    return {
      subCategory,
      total: sumBalances(sectionAccounts),
      accounts: sectionAccounts,
    };
  });
}

function buildCategoryTotals(
  accounts: readonly BalanceSheetAccount[],
  category: BalanceSheetAccountCategory
): BalanceSheetCategoryTotals {
  const categoryAccounts = accounts.filter(account => account.category === category);
  return {
    total: sumBalances(categoryAccounts),
    sections: buildSections(categoryAccounts),
  };
}

/**
 * Computes a full {@link BalanceSheetReport} from a {@link BalanceSheetInput}.
 *
 * Throws a descriptive `Error` when:
 * - `asOfDate` is not a valid ISO-8601 calendar date.
 * - Any account has a non-finite or non-integer `balance`.
 * - Any account's `category` is not one of `asset | liability | equity`.
 *
 * An empty `accounts` array produces a report with all totals `0` and
 * `isBalanced: true` (invariant #7).
 */
export function buildBalanceSheet(input: BalanceSheetInput): BalanceSheetReport {
  if (!isValidIsoDate(input.asOfDate)) {
    throw new Error(
      `Invalid BalanceSheetInput: asOfDate "${String(input.asOfDate)}" is not a valid ISO-8601 date.`
    );
  }

  for (const account of input.accounts) {
    if (!CATEGORIES.includes(account.category)) {
      throw new Error(
        `Invalid BalanceSheetInput: account "${account.id}" has invalid category "${String(account.category)}".`
      );
    }
    if (!isFiniteInteger(account.balance)) {
      throw new Error(
        `Invalid BalanceSheetInput: account "${account.id}" has a non-finite or non-integer balance (${account.balance}).`
      );
    }
  }

  const assets = buildCategoryTotals(input.accounts, 'asset');
  const liabilities = buildCategoryTotals(input.accounts, 'liability');
  const equity = buildCategoryTotals(input.accounts, 'equity');

  return {
    asOfDate: input.asOfDate,
    assets,
    liabilities,
    equity,
    isBalanced: assets.total === liabilities.total + equity.total,
  };
}
