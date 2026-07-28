/**
 * PDC Schedule Generator — White Caves Real Estate LLC
 * ─────────────────────────────────────────────────────
 * Generates post‑dated cheque schedules for tenant lease intake.
 * Implements the cheque installment logic from:
 *   business_docs/09_crm_features/leasing-intake-forms.md §3
 */

export interface ChequeScheduleItem {
  chequeNumber: string;
  bankName: string;
  dueDate: string; // ISO date string (YYYY‑MM‑DD)
  amountAED: number;
  status: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';
}

type ChequeCount = 1 | 2 | 4 | 6 | 12;

/**
 * Generates a PDC schedule for a lease.
 * @param annualRentAED  Total annual rent in AED
 * @param chequeCount    Number of PDC installments (1|2|4|6|12)
 * @param startDate      Lease start date (ISO string or Date)
 * @param bankName       Optional bank name (defaults to "Emirates NBD")
 */
export function generatePdcSchedule(
  annualRentAED: number,
  chequeCount: ChequeCount,
  startDate: string | Date,
  bankName = 'Emirates NBD'
): ChequeScheduleItem[] {
  const installmentAmount = Math.round(annualRentAED / chequeCount);
  const items: ChequeScheduleItem[] = [];
  const start = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);
  const intervalMonths = 12 / chequeCount;

  for (let i = 0; i < chequeCount; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(start.getMonth() + Math.round(intervalMonths * i));
    items.push({
      chequeNumber: `CHQ-${100001 + i}`,
      bankName,
      dueDate: dueDate.toISOString().split('T')[0],
      amountAED: installmentAmount,
      status: 'Pending',
    });
  }
  return items;
}

/**
 * Creates a full PDC schedule for a lease using monthly rent.
 * @param leaseId        Identifier of the lease (for future linking).
 * @param startDate      Lease start date.
 * @param endDate        Lease end date.
 * @param monthlyRent    Monthly rent amount in AED.
 * @param bankName       Optional bank name (defaults to 'Emirates NBD').
 */
export function createPdcSchedule(
  leaseId: string,
  startDate: Date,
  endDate: Date,
  monthlyRent: number,
  bankName = 'Emirates NBD'
): ChequeScheduleItem[] {
  // Calculate lease duration in months (rounded up).
  const months = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
  // Determine cheque count – default to monthly installments.
  const chequeCount = Math.min(12, Math.max(1, months)) as any; // cast to any for simplicity
  const annualRent = monthlyRent * 12;
  // Reuse existing generatePdcSchedule utility.
  const schedule = generatePdcSchedule(annualRent, chequeCount as any, startDate, bankName);
  // Attach leaseId to each schedule item (optional, not part of original type).
  // Here we simply return the schedule; linking can be handled elsewhere.
  return schedule;
}


/**
 * Maps a cheque count to a human‑readable payment‑frequency label.
 */
export function chequeCountToFrequencyLabel(count: ChequeCount): string {
  const map: Record<ChequeCount, string> = {
    1: 'Annual (1 cheque)',
    2: 'Bi‑annual (2 cheques)',
    4: 'Quarterly (4 cheques)',
    6: 'Bi‑monthly (6 cheques)',
    12: 'Monthly (12 cheques)',
  };
  return map[count];
}
