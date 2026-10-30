/**
 * [Category 4: Processing Engine]
 * White Caves Real Estate - Dubai Tenancy Cheque Schedule & Payment Splitter Engine
 *
 * Implements:
 *   - Parse rent strings to clean numeric values
 *   - Split rent into 1, 2, 4, 6, or 12 cheques with zero-drift rounding
 *   - Calculate staggered installment maturity dates
 *   - Compute 5% (unfurnished) or 10% (furnished) statutory security deposits
 *   - Compute 5% agency commission + 5% UAE VAT breakdown
 */

export interface ChequeScheduleItem {
  index: number;
  date: string;
  amount: number;
  amountFormatted: string;
  memo: string;
}

export interface ChequeScheduleOptions {
  annualRent: string | number;
  chequeCount?: number;
  startDate?: string;
}

export interface SecurityDepositOptions {
  annualRent: string | number;
  isFurnished?: boolean;
}

export interface SecurityDepositResult {
  percentage: number;
  amount: number;
  amountFormatted: string;
}

export interface CommissionBreakdownOptions {
  annualRent: string | number;
  commissionPct?: number;
  vatPct?: number;
}

export interface CommissionBreakdownResult {
  commissionAmount: number;
  vatAmount: number;
  totalDue: number;
  commissionFormatted: string;
  vatFormatted: string;
  totalFormatted: string;
}

/**
 * Cleanly parse any currency string like "35,000.00 AED" into a float.
 */
export const parseCleanAmount = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

/**
 * Format numeric value to standard UAE Dirhams "35,000.00 AED".
 */
export const formatAed = (value: string | number): string => {
  const num = parseCleanAmount(value);
  return (
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' AED'
  );
};

/**
 * Advance a date string by a specified number of months.
 * Supports "DD-MM-YYYY", "DD/MM/YYYY", and "YYYY-MM-DD".
 * Returns in "DD-MM-YYYY" format.
 */
export const addMonthsToDate = (dateStr: string, monthsToAdd: number): string => {
  if (!dateStr) return '';
  let day: number, month: number, year: number;

  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      // DD-MM-YYYY
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    }
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  } else {
    return dateStr;
  }

  const date = new Date(Date.UTC(year, month, day));
  date.setUTCMonth(date.getUTCMonth() + monthsToAdd);

  const resDay = String(date.getUTCDate()).padStart(2, '0');
  const resMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
  const resYear = date.getUTCFullYear();

  return `${resDay}-${resMonth}-${resYear}`;
};

/**
 * Generate a complete schedule of cheques with dates, amounts, and descriptions.
 * Ensures the sum of all cheques equals the annual rent down to the last fil.
 */
export const calculateChequeSchedule = ({
  annualRent,
  chequeCount = 4,
  startDate = '01-10-2026',
}: ChequeScheduleOptions): ChequeScheduleItem[] => {
  const total = parseCleanAmount(annualRent);
  const count = Math.max(1, Math.min(12, parseInt(String(chequeCount), 10) || 4));

  let intervalMonths = 3;
  if (count === 1) intervalMonths = 0;
  else if (count === 2) intervalMonths = 6;
  else if (count === 4) intervalMonths = 3;
  else if (count === 6) intervalMonths = 2;
  else if (count === 12) intervalMonths = 1;
  else intervalMonths = Math.floor(12 / count);

  const rawBase = Math.floor((total / count) * 100) / 100;
  const remainder = Math.round((total - rawBase * count) * 100) / 100;

  const schedule: ChequeScheduleItem[] = [];
  for (let i = 1; i <= count; i++) {
    const monthsOffset = (i - 1) * intervalMonths;
    const chequeDate = addMonthsToDate(startDate, monthsOffset);
    const amount = i === count ? Math.round((rawBase + remainder) * 100) / 100 : rawBase;

    let memo = `${i} of ${count} Installment`;
    if (i === 1) memo = '1st Cheque (Booking / Handover)';
    else if (i === count) memo = `Final (${count}th) Cheque`;

    schedule.push({
      index: i,
      date: chequeDate,
      amount,
      amountFormatted: formatAed(amount),
      memo,
    });
  }

  return schedule;
};

/**
 * Calculate Dubai Security Deposit based on furnishing status.
 * Standard: 5% for unfurnished, 10% for furnished.
 */
export const calculateSecurityDeposit = ({
  annualRent,
  isFurnished = false,
}: SecurityDepositOptions): SecurityDepositResult => {
  const rent = parseCleanAmount(annualRent);
  const percentage = isFurnished ? 10 : 5;
  const amount = Math.round(((rent * percentage) / 100) * 100) / 100;
  return {
    percentage,
    amount,
    amountFormatted: formatAed(amount),
  };
};

/**
 * Calculate Agency Commission (default 5%) and 5% UAE VAT.
 */
export const calculateAgencyCommissionBreakdown = ({
  annualRent,
  commissionPct = 5,
  vatPct = 5,
}: CommissionBreakdownOptions): CommissionBreakdownResult => {
  const rent = parseCleanAmount(annualRent);
  const commissionAmount = Math.round(((rent * commissionPct) / 100) * 100) / 100;
  const vatAmount = Math.round(((commissionAmount * vatPct) / 100) * 100) / 100;
  const totalDue = Math.round((commissionAmount + vatAmount) * 100) / 100;

  return {
    commissionAmount,
    vatAmount,
    totalDue,
    commissionFormatted: formatAed(commissionAmount),
    vatFormatted: formatAed(vatAmount),
    totalFormatted: formatAed(totalDue),
  };
};
