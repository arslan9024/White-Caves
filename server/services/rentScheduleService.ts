/**
 * Rent Schedule & Payment Service — Wave 35 (REQ-TENANT-001, REQ-TENANT-002)
 *
 * Handles:
 * 1. Automatic generation of 12-month (or N-installment) rent schedules on lease activation
 * 2. Automatic creation of PDC cheque schedules
 * 3. Rent payment status tracking (pending/paid/overdue/waived)
 * 4. Late fee calculation for overdue rent (Day 15 penalty per RERA standard)
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export interface RentScheduleInput {
  leaseId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  numberOfCheques?: number; // Default: 12
  bankName?: string;
  tenantId?: string;
}

export interface RentScheduleResult {
  leaseId: string;
  rentPaymentsCount: number;
  pdcChequesCount: number;
  totalAnnualRentAED: number;
}

/**
 * Auto-generate rent payment schedule and PDC cheque items for a lease
 */
export async function generateRentSchedule(input: RentScheduleInput): Promise<RentScheduleResult> {
  const {
    leaseId,
    startDate,
    endDate,
    monthlyRent,
    numberOfCheques = 12,
    bankName = 'Emirates NBD',
    tenantId,
  } = input;

  const annualRentAED = monthlyRent * 12;
  const installmentCount = Math.max(1, Math.min(12, numberOfCheques));
  const installmentAmount = Math.round(annualRentAED / installmentCount);
  const intervalMonths = 12 / installmentCount;

  const rentPaymentData = [];
  const pdcScheduleData = [];

  for (let i = 0; i < installmentCount; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + Math.round(intervalMonths * i));

    rentPaymentData.push({
      leaseId,
      installment: i + 1,
      amountAED: installmentAmount,
      dueDate,
      status: 'pending',
      paymentMethod: 'pdc',
    });

    pdcScheduleData.push({
      leaseId,
      tenantId: tenantId || null,
      chequeNumber: `CHQ-${100001 + i}`,
      bankName,
      dueDate,
      amount: installmentAmount,
      amountAED: installmentAmount,
      status: 'pending',
    });
  }

  // Transactionally clear old schedules and insert new ones
  await prisma.$transaction([
    prisma.rentPayment.deleteMany({ where: { leaseId } }),
    prisma.pDCSchedule.deleteMany({ where: { leaseId } }),
    prisma.rentPayment.createMany({ data: rentPaymentData }),
    prisma.pDCSchedule.createMany({ data: pdcScheduleData }),
  ]);

  logger.info('[RentScheduleService] generated schedule', {
    leaseId,
    installments: installmentCount,
    annualRentAED,
  });

  return {
    leaseId,
    rentPaymentsCount: installmentCount,
    pdcChequesCount: installmentCount,
    totalAnnualRentAED: annualRentAED,
  };
}

/**
 * Apply Day 15 late fee penalty (AED 250 fixed or 2% of installment) to overdue rent payments
 */
export async function processOverdueLateFees(): Promise<{ overdueCount: number; updatedIds: string[] }> {
  const now = new Date();
  const day15Threshold = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 days past due

  const overduePayments = await prisma.rentPayment.findMany({
    where: {
      status: 'pending',
      dueDate: { lt: day15Threshold },
    },
  });

  const updatedIds: string[] = [];

  for (const payment of overduePayments) {
    const lateFee = Math.max(250, Math.round(payment.amountAED * 0.02 * 100) / 100);

    await prisma.rentPayment.update({
      where: { id: payment.id },
      data: {
        status: 'overdue',
        lateFeeAED: lateFee,
      },
    });

    updatedIds.push(payment.id);
  }

  logger.info('[RentScheduleService] processed overdue late fees', {
    count: updatedIds.length,
    updatedIds,
  });

  return {
    overdueCount: updatedIds.length,
    updatedIds,
  };
}
