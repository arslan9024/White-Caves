/**
 * ToolsDashboard.logic.ts — Hook & Calculation Logic Layer
 */

import { useState, useMemo } from 'react';
import { DEFAULT_TOOL_VALUES } from '../data/ToolsDashboard.data';

export function useToolsDashboardLogic() {
  const [propertyPrice, setPropertyPrice] = useState<number>(DEFAULT_TOOL_VALUES.propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(DEFAULT_TOOL_VALUES.downPaymentPercent);
  const [interestRate, setInterestRate] = useState<number>(DEFAULT_TOOL_VALUES.interestRate);
  const [loanPeriodYears, setLoanPeriodYears] = useState<number>(DEFAULT_TOOL_VALUES.loanPeriodYears);
  const [annualRent, setAnnualRent] = useState<number>(DEFAULT_TOOL_VALUES.annualRent);
  const [serviceCharges, setServiceCharges] = useState<number>(DEFAULT_TOOL_VALUES.serviceCharges);

  // Mortgage calculations
  const mortgageStats = useMemo(() => {
    const loanAmount = propertyPrice * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanPeriodYears * 12;
    const monthlyMortgage =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    return {
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyMortgage),
      downPaymentAmount: Math.round(propertyPrice * (downPaymentPercent / 100)),
    };
  }, [propertyPrice, downPaymentPercent, interestRate, loanPeriodYears]);

  // Rental yield calculations
  const yieldStats = useMemo(() => {
    const grossYield = ((annualRent / propertyPrice) * 100).toFixed(2);
    const netYield = (((annualRent - serviceCharges) / propertyPrice) * 100).toFixed(2);
    return {
      grossYield: parseFloat(grossYield),
      netYield: parseFloat(netYield),
    };
  }, [propertyPrice, annualRent, serviceCharges]);

  // DLD and transaction fees
  const dldFees = useMemo(() => {
    const dldTransferFee = propertyPrice * 0.04;
    const dldAdminFee = 580;
    const trusteeFee = 4200;
    const agencyFee = propertyPrice * 0.02 * 1.05; // 2% + 5% VAT
    const totalFees = dldTransferFee + dldAdminFee + trusteeFee + agencyFee;

    return {
      dldTransferFee: Math.round(dldTransferFee),
      dldAdminFee,
      trusteeFee,
      agencyFee: Math.round(agencyFee),
      totalFees: Math.round(totalFees),
    };
  }, [propertyPrice]);

  return {
    propertyPrice,
    setPropertyPrice,
    downPaymentPercent,
    setDownPaymentPercent,
    interestRate,
    setInterestRate,
    loanPeriodYears,
    setLoanPeriodYears,
    annualRent,
    setAnnualRent,
    serviceCharges,
    setServiceCharges,
    mortgageStats,
    yieldStats,
    dldFees,
  };
}
