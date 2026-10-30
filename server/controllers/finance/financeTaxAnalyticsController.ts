import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { asyncHandler } from '../../middleware/errorHandler.js';

export const getVatReturn = asyncHandler(async (req: Request, res: Response) => {
  const periodStart = req.query.periodStart
    ? new Date(req.query.periodStart as string)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const periodEnd = req.query.periodEnd ? new Date(req.query.periodEnd as string) : new Date();

  const outputVAT = await prisma.invoice.aggregate({
    where: {
      type: 'tax_invoice',
      date: { gte: periodStart, lte: periodEnd },
    },
    _sum: { vatAmount: true, amount: true },
  });

  const standardExpenses = await prisma.expense.aggregate({
    where: {
      status: { in: ['approved', 'processed'] },
      date: { gte: periodStart, lte: periodEnd },
    },
    _sum: { amount: true },
  });

  const totalExpenseAmount = standardExpenses._sum.amount || 0;
  const inputVAT = Number((totalExpenseAmount * 0.05).toFixed(2));
  const outputVatAmount = Number((outputVAT._sum.vatAmount || 0).toFixed(2));

  res.status(200).json({
    success: true,
    data: {
      periodStart,
      periodEnd,
      outputVAT: outputVatAmount,
      inputVAT,
      netVAT: Number((outputVatAmount - inputVAT).toFixed(2)),
      taxableSupplies: outputVAT._sum.amount || 0,
      taxableExpenses: totalExpenseAmount,
    },
  });
});

export const getDirectorsLoanSummary = asyncHandler(async (_req: Request, res: Response) => {
  const directorExpenses = await prisma.expense.findMany({
    where: {
      notes: { contains: 'DIRECTORS_LOAN' },
    },
  });

  const totalAdvances = directorExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const reimbursed = directorExpenses
    .filter(e => e.status === 'reimbursed' || e.status === 'processed')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const outstanding = totalAdvances - reimbursed;

  res.status(200).json({
    success: true,
    data: {
      currency: 'AED',
      totalAdvances,
      reimbursed,
      outstanding,
      transactionCount: directorExpenses.length,
    },
  });
});

export const getCorporateTaxSummary = asyncHandler(async (req: Request, res: Response) => {
  const taxYear = req.query.taxYear ? Number(req.query.taxYear) : new Date().getFullYear();
  const yearStart = new Date(taxYear, 0, 1);
  const yearEnd = new Date(taxYear, 11, 31, 23, 59, 59);

  const [invoices, expenses] = await Promise.all([
    prisma.invoice.aggregate({
      where: {
        status: 'paid',
        date: { gte: yearStart, lte: yearEnd },
      },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: {
        status: { in: ['approved', 'processed'] },
        date: { gte: yearStart, lte: yearEnd },
      },
      _sum: { amount: true },
    }),
  ]);

  const totalRevenue = invoices._sum.amount || 0;
  const deductibleExpenses = expenses._sum.amount || 0;
  const netTaxableProfit = Math.max(0, totalRevenue - deductibleExpenses);

  const CT_RELIEF_THRESHOLD = 375000;
  const taxableBase = Math.max(0, netTaxableProfit - CT_RELIEF_THRESHOLD);
  const estimatedCorporateTax = Number((taxableBase * 0.09).toFixed(2));

  res.status(200).json({
    success: true,
    data: {
      taxYear,
      totalRevenue,
      deductibleExpenses,
      netTaxableProfit,
      smallBusinessReliefThreshold: CT_RELIEF_THRESHOLD,
      taxableAboveThreshold: taxableBase,
      statutoryTaxRate: '9%',
      estimatedCorporateTaxDue: estimatedCorporateTax,
      qualifiesForSmallBusinessRelief: netTaxableProfit <= CT_RELIEF_THRESHOLD,
    },
  });
});
