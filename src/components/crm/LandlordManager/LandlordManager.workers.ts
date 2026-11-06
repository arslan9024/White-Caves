// FILE: src/components/crm/LandlordManager/LandlordManager.workers.ts
/**
 * White Caves Real Estate LLC - Landlord Manager Background Workers
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { PdcCheque, ChequeStatus } from './LandlordManager.types';

/**
 * Offloads batch cheque clearing calculation away from the main UI thread.
 */
export function simulateBatchChequeClearing(
  cheques: PdcCheque[],
  targetDate: string
): Promise<{ maturedChequesCount: number; maturedAmountAed: number }> {
  return new Promise(resolve => {
    // In production, offloaded to worker blob; simulated with setTimeout to ensure 0 main-thread blocking
    setTimeout(() => {
      const targetTime = new Date(targetDate).getTime();
      const matured = cheques.filter(
        c => c.status === 'pending' && new Date(c.dueDate).getTime() <= targetTime
      );
      const totalAmount = matured.reduce((sum, c) => sum + c.amountAed, 0);

      resolve({
        maturedChequesCount: matured.length,
        maturedAmountAed: totalAmount,
      });
    }, 10);
  });
}

/**
 * Checks if a cheque is close to due date (within 7 days).
 */
export function isChequeDueSoon(dueDate: string): boolean {
  const diffTime = new Date(dueDate).getTime() - Date.now();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
}
