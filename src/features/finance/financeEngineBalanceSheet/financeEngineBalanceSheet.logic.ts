/**
 * financeEngineBalanceSheet.logic.ts
 *
 * Pure, framework-agnostic business logic for building and validating a
 * Balance Sheet report from a flat list of ledger-style line items.
 *
 * Parent issue: #1943
 * Issue: #2405
 *
 * Design notes:
 * - The engine accepts `BalanceSheetLineItem[]` (category + amount) rather than
 *   a pre-shaped tree, so callers (API layer, reports, tests) can feed raw
 *   accounting data without knowing about the internal grouping structure.
 * - All monetary math is done with integers (minor units / cents) to avoid
 *   floating point drift. Callers are expected to supply amounts already
 *   converted to minor units (e.g. AED fils or cents).
 * - `computeBalanceSheet` never throws for malformed accounting data (e.g. an
 *   unbalanced sheet); instead it returns a result object with `isBalanced`
 *   and `balanceDifference` so callers can decide how to react. Structural
 *   input validation (e.g. bad category, NaN amounts) does throw, since that
 *   indicates a programming/data-integrity error rather than a business
 *   condition.
 */

/** High level classification of a balance sheet line item. */
export type BalanceSheetCategory = 'asset' | 'liability' | 'equity';

/** Sub-classification used for standard current/non-current grouping. */
export type BalanceSheetSubCategory = 'current' | 'nonCurrent';

/** A single raw balance sheet entry supplied by the caller. */
export interface BalanceSheetLineItem {
  /** Unique identifier for the line item (account id, GL code, etc.). */
  readonly id: string;
  /** Human readable label, e.g. "Cash and cash equivalents". */
  readonly label: string;
  /** Top level classification. */
  readonly category: BalanceSheetCategory;
  /** Current vs non-current bucket within the category. */
  readonly subCategory: BalanceSheetSubCategory;
  /**
   * Amount in integer minor units (e.g. cents/fils). Positive amounts
   * increase the balance of the item; the engine does not flip signs.
   */
  readonly amountMinorUnits: number;
}

/** A grouped, totaled section of the balance sheet (e.g. "Current Assets"). */
export interface BalanceSheetGroup {
  readonly subCategory: BalanceSheetSubCategory;
  readonly items: readonly BalanceSheetLineItem[];
  readonly totalMinorUnits: number;
}

/** A top level section of the balance sheet (Assets, Liabilities, Equity). */
export interface BalanceSheetSection {
  readonly category: BalanceSheetCategory;
  readonly groups: readonly BalanceSheetGroup[];
  readonly totalMinorUnits: number;
}

/** Fully computed balance sheet report. */
export interface BalanceSheetReport {
  readonly asOf: string;
  readonly assets: BalanceSheetSection;
  readonly liabilities: BalanceSheetSection;
  readonly equity: BalanceSheetSection;
  readonly totalAssetsMinorUnits: number;
  readonly totalLiabilitiesAndEquityMinorUnits: number;
  readonly isBalanced: boolean;
  /**
   * assets - (liabilities + equity), in minor units. Zero when balanced.
   * Useful for surfacing "off by X" diagnostics to the caller.
   */
  readonly balanceDifferenceMinorUnits: number;
}

const CATEGORIES: readonly BalanceSheetCategory[] = ['asset', 'liability', 'equity'];
const SUB_CATEGORIES: readonly BalanceSheetSubCategory[] = ['current', 'nonCurrent'];

/** Thrown when the supplied line items are structurally invalid. */
export class BalanceSheetValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BalanceSheetValidationError';
  }
}

function isFiniteInteger(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value);
}

/**
 * Validates a single line item's structural correctness. Throws
 * BalanceSheetValidationError on any violation.
 */
export function validateLineItem(item: BalanceSheetLineItem): void {
  if (!item.id || item.id.trim().length === 0) {
    throw new BalanceSheetValidationError('Line item is missing a non-empty id.');
  }
  if (!item.label || item.label.trim().length === 0) {
    throw new BalanceSheetValidationError(`Line item "${item.id}" is missing a non-empty label.`);
  }
  if (!CATEGORIES.includes(item.category)) {
    throw new BalanceSheetValidationError(
      `Line item "${item.id}" has invalid category "${String(item.category)}".`
    );
  }
  if (!SUB_CATEGORIES.includes(item.subCategory)) {
    throw new BalanceSheetValidationError(
      `Line item "${item.id}" has invalid subCategory "${String(item.subCategory)}".`
    );
  }
  if (!isFiniteInteger(item.amountMinorUnits)) {
    throw new BalanceSheetValidationError(
      `Line item "${item.id}" has a non-integer or non-finite amountMinorUnits (${item.amountMinorUnits}).`
    );
  }
}

/** Validates a full list of line items, including duplicate id detection. */
export function validateLineItems(items: readonly BalanceSheetLineItem[]): void {
  const seenIds = new Set<string>();
  for (const item of items) {
    validateLineItem(item);
    if (seenIds.has(item.id)) {
      throw new BalanceSheetValidationError(`Duplicate line item id detected: "${item.id}".`);
    }
    seenIds.add(item.id);
  }
}

function sumAmounts(items: readonly BalanceSheetLineItem[]): number {
  return items.reduce((sum, item) => sum + item.amountMinorUnits, 0);
}

function buildGroup(
  subCategory: BalanceSheetSubCategory,
  items: readonly BalanceSheetLineItem[]
): BalanceSheetGroup {
  return {
    subCategory,
    items,
    totalMinorUnits: sumAmounts(items),
  };
}

function buildSection(
  category: BalanceSheetCategory,
  items: readonly BalanceSheetLineItem[]
): BalanceSheetSection {
  const categoryItems = items.filter(item => item.category === category);
  const groups = SUB_CATEGORIES.map(subCategory =>
    buildGroup(
      subCategory,
      categoryItems.filter(item => item.subCategory === subCategory)
    )
  ).filter(group => group.items.length > 0);

  return {
    category,
    groups,
    totalMinorUnits: sumAmounts(categoryItems),
  };
}

/**
 * Computes a full BalanceSheetReport from a flat list of line items.
 *
 * Throws BalanceSheetValidationError if any item is structurally invalid
 * (bad category/subCategory, non-integer amount, missing id/label, or
 * duplicate ids). Does NOT throw when assets != liabilities + equity;
 * instead the returned report's `isBalanced` / `balanceDifferenceMinorUnits`
 * fields communicate that condition to the caller.
 */
export function computeBalanceSheet(
  items: readonly BalanceSheetLineItem[],
  asOf: string
): BalanceSheetReport {
  if (!asOf || asOf.trim().length === 0) {
    throw new BalanceSheetValidationError('asOf date is required.');
  }
  validateLineItems(items);

  const assets = buildSection('asset', items);
  const liabilities = buildSection('liability', items);
  const equity = buildSection('equity', items);

  const totalAssetsMinorUnits = assets.totalMinorUnits;
  const totalLiabilitiesAndEquityMinorUnits = liabilities.totalMinorUnits + equity.totalMinorUnits;
  const balanceDifferenceMinorUnits = totalAssetsMinorUnits - totalLiabilitiesAndEquityMinorUnits;

  return {
    asOf,
    assets,
    liabilities,
    equity,
    totalAssetsMinorUnits,
    totalLiabilitiesAndEquityMinorUnits,
    isBalanced: balanceDifferenceMinorUnits === 0,
    balanceDifferenceMinorUnits,
  };
}

/**
 * Formats a minor-units integer amount as a decimal string with two
 * fraction digits (e.g. 123456 -> "1234.56"). Does not apply currency
 * symbols/locale formatting; that is a presentation-layer concern.
 */
export function formatMinorUnits(amountMinorUnits: number): string {
  if (!isFiniteInteger(amountMinorUnits)) {
    throw new BalanceSheetValidationError(
      `Cannot format non-integer amountMinorUnits value: ${amountMinorUnits}.`
    );
  }
  const sign = amountMinorUnits < 0 ? '-' : '';
  const absolute = Math.abs(amountMinorUnits);
  const whole = Math.floor(absolute / 100);
  const fraction = absolute % 100;
  return `${sign}${whole}.${fraction.toString().padStart(2, '0')}`;
}
