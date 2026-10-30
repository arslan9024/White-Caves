/**
 * leaseCommon.ts
 * Shared interfaces and helper utilities for lease controllers.
 */

export interface ChequeScheduleItem {
  chequeNumber: string;
  bankName: string;
  dueDate: string;
  amountAED: number;
  status: string;
}

export function createPdcSchedule(
  _leaseId: string,
  startDate: Date,
  endDate: Date,
  monthlyRent: number,
  bankName = 'Emirates NBD'
): ChequeScheduleItem[] {
  const months = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  );
  const chequeCount = Math.min(12, Math.max(1, months));
  const annualRent = monthlyRent * 12;
  const installmentAmount = Math.round(annualRent / chequeCount);
  const items: ChequeScheduleItem[] = [];
  const intervalMonths = 12 / chequeCount;

  for (let i = 0; i < chequeCount; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + Math.round(intervalMonths * i));
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

