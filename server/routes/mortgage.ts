import { Router, type Request, type Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import {
  convert,
  getExchangeRates,
  isSupportedCurrency,
  type SupportedCurrency,
} from '../services/currencyService.js';

const router = Router();

interface MortgageCalculationInput {
  propertyPrice: number;
  downPaymentPct: number;
  interestRatePct: number;
  loanTermYears: number;
  currency?: string;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const calcMortgage = ({
  propertyPrice,
  downPaymentPct,
  interestRatePct,
  loanTermYears,
}: Omit<MortgageCalculationInput, 'currency'>) => {
  const normalizedPrice = Math.max(propertyPrice, 0);
  const normalizedDownPayment = clamp(downPaymentPct, 0, 100);
  const normalizedInterest = Math.max(interestRatePct, 0);
  const normalizedYears = Math.max(loanTermYears, 1);

  const downPaymentAmount = normalizedPrice * (normalizedDownPayment / 100);
  const loanAmount = normalizedPrice - downPaymentAmount;
  const monthlyRate = normalizedInterest / 100 / 12;
  const numberOfPayments = normalizedYears * 12;

  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : loanAmount *
        ((monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1));

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  return {
    propertyPrice: Math.round(normalizedPrice * 100) / 100,
    downPaymentPct: Math.round(normalizedDownPayment * 100) / 100,
    downPaymentAmount: Math.round(downPaymentAmount * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    loanTermYears: normalizedYears,
    interestRatePct: Math.round(normalizedInterest * 100) / 100,
  };
};

/**
 * POST /api/mortgage/calculate
 * Body: { propertyPrice, downPaymentPct, interestRatePct, loanTermYears, currency? }
 */
router.post(
  '/calculate',
  asyncHandler(async (req: Request, res: Response) => {
    // Schema validation enforced for payload
    const body = req.body as Partial<MortgageCalculationInput>;

    if (
      typeof body.propertyPrice !== 'number' ||
      typeof body.downPaymentPct !== 'number' ||
      typeof body.interestRatePct !== 'number' ||
      typeof body.loanTermYears !== 'number'
    ) {
      throw new AppError(
        'propertyPrice, downPaymentPct, interestRatePct, and loanTermYears must be numbers',
        400
      );
    }

    const requestedCurrencyRaw = (body.currency || 'AED').toUpperCase();
    if (!isSupportedCurrency(requestedCurrencyRaw)) {
      throw new AppError('Unsupported currency', 400);
    }
    const requestedCurrency = requestedCurrencyRaw as SupportedCurrency;

    const aedResult = calcMortgage({
      propertyPrice: body.propertyPrice,
      downPaymentPct: body.downPaymentPct,
      interestRatePct: body.interestRatePct,
      loanTermYears: body.loanTermYears,
    });

    const exchange = getExchangeRates();
    const convertedResult =
      requestedCurrency === 'AED'
        ? aedResult
        : {
            propertyPrice: convert(aedResult.propertyPrice, 'AED', requestedCurrency),
            downPaymentAmount: convert(aedResult.downPaymentAmount, 'AED', requestedCurrency),
            loanAmount: convert(aedResult.loanAmount, 'AED', requestedCurrency),
            monthlyPayment: convert(aedResult.monthlyPayment, 'AED', requestedCurrency),
            totalPayment: convert(aedResult.totalPayment, 'AED', requestedCurrency),
            totalInterest: convert(aedResult.totalInterest, 'AED', requestedCurrency),
          };

    res.status(200).json({
      success: true,
      data: {
        currency: requestedCurrency,
        rates: {
          source: exchange.source,
          updatedAt: exchange.updatedAt,
          aedPerRequestedCurrency: exchange.rates[requestedCurrency],
        },
        aed: aedResult,
        converted: convertedResult,
      },
    });
  })
);

export default router;
