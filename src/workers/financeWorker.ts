/**
 * Dubai Real Estate Finance & Mortgage Web Worker Engine
 * White Caves Real Estate LLC
 * Offloads heavy financial calculations from the main UI thread.
 */

export interface MortgageInput {
  propertyPrice: number;
  downPaymentPercent: number; // e.g. 20 for 20%
  interestRateAnnual: number; // e.g. 4.5 for 4.5%
  loanTenureYears: number; // e.g. 25
  dldFeePercent?: number; // default 4%
  agencyFeePercent?: number; // default 2%
}

export interface MortgageResult {
  loanAmount: number;
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
  upfrontCosts: {
    downPayment: number;
    dldFee: number;
    agencyFee: number;
    totalUpfront: number;
  };
}

export interface ROIInput {
  purchasePrice: number;
  annualRent: number;
  serviceChargesAnnual: number;
  managementFeeAnnual: number;
  capitalAppreciationRateAnnual: number; // e.g. 6 for 6%
  years: number;
}

export interface ROIResult {
  grossYieldPercent: number;
  netYieldPercent: number;
  projectedValue: number;
  totalRentalIncome: number;
  totalNetIncome: number;
  totalROI: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const dldFeePercent = input.dldFeePercent ?? 4;
  const agencyFeePercent = input.agencyFeePercent ?? 2;

  const downPayment = (input.propertyPrice * input.downPaymentPercent) / 100;
  const loanAmount = input.propertyPrice - downPayment;
  const dldFee = (input.propertyPrice * dldFeePercent) / 100;
  const agencyFee = (input.propertyPrice * agencyFeePercent) / 100;
  const totalUpfront = downPayment + dldFee + agencyFee;

  const monthlyRate = input.interestRateAnnual / 100 / 12;
  const totalMonths = input.loanTenureYears * 12;

  let monthlyInstallment = 0;
  if (monthlyRate > 0) {
    monthlyInstallment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    monthlyInstallment = loanAmount / totalMonths;
  }

  const totalRepayment = monthlyInstallment * totalMonths;
  const totalInterest = totalRepayment - loanAmount;

  return {
    loanAmount: Math.round(loanAmount),
    monthlyInstallment: Math.round(monthlyInstallment),
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalRepayment),
    upfrontCosts: {
      downPayment: Math.round(downPayment),
      dldFee: Math.round(dldFee),
      agencyFee: Math.round(agencyFee),
      totalUpfront: Math.round(totalUpfront),
    },
  };
}

export function calculateROI(input: ROIInput): ROIResult {
  const grossYieldPercent = (input.annualRent / input.purchasePrice) * 100;
  const netAnnualRent =
    input.annualRent - input.serviceChargesAnnual - input.managementFeeAnnual;
  const netYieldPercent = (netAnnualRent / input.purchasePrice) * 100;

  const projectedValue =
    input.purchasePrice *
    Math.pow(1 + input.capitalAppreciationRateAnnual / 100, input.years);

  const totalRentalIncome = netAnnualRent * input.years;
  const capitalGain = projectedValue - input.purchasePrice;
  const totalNetIncome = totalRentalIncome + capitalGain;
  const totalROI = (totalNetIncome / input.purchasePrice) * 100;

  return {
    grossYieldPercent: Number(grossYieldPercent.toFixed(2)),
    netYieldPercent: Number(netYieldPercent.toFixed(2)),
    projectedValue: Math.round(projectedValue),
    totalRentalIncome: Math.round(totalRentalIncome),
    totalNetIncome: Math.round(totalNetIncome),
    totalROI: Number(totalROI.toFixed(2)),
  };
}

// Worker message listener if running inside Web Worker context
if (typeof self !== 'undefined' && typeof window === 'undefined') {
  self.onmessage = (e: MessageEvent<{ type: string; payload: MortgageInput | ROIInput; id: string }>) => {
    const { type, payload, id } = e.data;
    try {
      if (type === 'CALCULATE_MORTGAGE') {
        const result = calculateMortgage(payload as MortgageInput);
        self.postMessage({ id, success: true, result });
      } else if (type === 'CALCULATE_ROI') {
        const result = calculateROI(payload as ROIInput);
        self.postMessage({ id, success: true, result });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Calculation error';
      self.postMessage({ id, success: false, error: message });
    }
  };
}
