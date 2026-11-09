// FILE: src/components/crm/DldEscrowCalculator/DldEscrowCalculator.logic.ts
/**
 * White Caves Real Estate LLC - DLD & Sovereign Escrow Underwriting Logic
 * Standard: UAE DLD Executive Regulations & Decree 50/2022
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo } from 'react';
import type { EscrowCalculationInput, EscrowCalculationResult } from './DldEscrowCalculator.types';

export const DEFAULT_ESCROW_INPUT: EscrowCalculationInput = {
  propertyPrice: 3500000,
  category: 'READY_RESIDENTIAL',
  buyerType: 'INDIVIDUAL_RESIDENT',
  hasMortgage: false,
  mortgageAmount: 2800000,
  commissionPercentage: 2.0,
  developerEscrowAcc: 'AE03-DLD-ESCROW-0094821',
};

export function calculateDldEscrow(input: EscrowCalculationInput): EscrowCalculationResult {
  const price = Math.max(0, Number(input.propertyPrice) || 0);
  
  // 1. DLD Statutory Transfer Fee: 4.0%
  const dldTransferFee = Math.round(price * 0.04);
  
  // 2. DLD Title Deed Admin Fee
  // Off-plan uses Oqood admin fee (AED 1,000), Ready uses Title Deed fee (AED 580)
  const dldAdminFee = input.category === 'OFF_PLAN' ? 1000 : 580;

  // 3. Real Estate Registration Trustee Fee (Law 7 of 2006)
  // AED 4,000 + 5% VAT if >= AED 500,000; AED 2,000 + 5% VAT if < AED 500,000
  const trusteeBase = price >= 500000 ? 4000 : 2000;
  const trusteeFee = Math.round(trusteeBase * 1.05);

  // 4. Mortgage Registration Fee (0.25% of mortgage loan + AED 290 admin)
  let mortgageRegistrationFee = 0;
  let mortgageAdminFee = 0;
  if (input.hasMortgage && input.mortgageAmount > 0) {
    mortgageRegistrationFee = Math.round(input.mortgageAmount * 0.0025);
    mortgageAdminFee = 290;
  }

  // 5. Agency Commission (default 2%) & 5% UAE FTA VAT
  const commPct = Math.max(0, Number(input.commissionPercentage) || 0) / 100;
  const agencyCommission = Math.round(price * commPct);
  const vatOnCommission = Math.round(agencyCommission * 0.05);

  // 6. Corporate Tax Reserve (9% on net brokerage gross margin, Dept 06 compliant)
  const corporateTaxReserve = Math.round(agencyCommission * 0.09);

  // Totals
  const totalGovFees = dldTransferFee + dldAdminFee + trusteeFee + mortgageRegistrationFee + mortgageAdminFee;
  const totalClosingCosts = totalGovFees + agencyCommission + vatOnCommission;
  const totalFundRequired = price + totalClosingCosts;

  return {
    propertyPrice: price,
    dldTransferFee,
    dldAdminFee,
    trusteeFee,
    mortgageRegistrationFee,
    mortgageAdminFee,
    agencyCommission,
    vatOnCommission,
    corporateTaxReserve,
    totalGovFees,
    totalClosingCosts,
    totalFundRequired,
    escrowAccountNumber: input.developerEscrowAcc || 'AE03-DLD-ESCROW-0094821',
    breakdown: [
      {
        key: 'dld-transfer',
        label: 'DLD Transfer Fee (Dubai Land Department)',
        amount: dldTransferFee,
        percentage: 4.0,
        recipient: 'Dubai Land Department (DLD)',
        isMandatory: true,
        description: 'Statutory 4% transfer fee payable upon title deed transfer.',
      },
      {
        key: 'dld-admin',
        label: input.category === 'OFF_PLAN' ? 'Oqood Registration Issuance' : 'DLD Title Deed Knowledge & Admin Fee',
        amount: dldAdminFee,
        recipient: 'Dubai Land Department (DLD)',
        isMandatory: true,
        description: 'Statutory government fee for processing registration certificate.',
      },
      {
        key: 'trustee',
        label: 'Registration Trustee Fee (incl. 5% VAT)',
        amount: trusteeFee,
        recipient: 'DLD Authorized Trustee Office',
        isMandatory: true,
        description: 'Authorized Registration Trustee transaction processing fee.',
      },
      ...(input.hasMortgage
        ? [
            {
              key: 'mortgage-reg',
              label: 'Mortgage Registration Fee (0.25%)',
              amount: mortgageRegistrationFee,
              percentage: 0.25,
              recipient: 'Dubai Land Department (DLD)',
              isMandatory: true,
              description: '0.25% statutory charge on total financed mortgage principal.',
            },
            {
              key: 'mortgage-admin',
              label: 'Mortgage Knowledge & Innovation Admin Fee',
              amount: mortgageAdminFee,
              recipient: 'Dubai Land Department (DLD)',
              isMandatory: true,
              description: 'Statutory administration fee for mortgage deed registration.',
            },
          ]
        : []),
      {
        key: 'agency-comm',
        label: `Brokerage Professional Fee (${input.commissionPercentage}%)`,
        amount: agencyCommission,
        percentage: input.commissionPercentage,
        recipient: 'White Caves Real Estate LLC',
        isMandatory: true,
        description: 'Professional luxury advisory, negotiation, and conveyancing split.',
      },
      {
        key: 'vat-comm',
        label: 'UAE FTA VAT on Brokerage Commission (5%)',
        amount: vatOnCommission,
        percentage: 5.0,
        recipient: 'Federal Tax Authority (FTA)',
        isMandatory: true,
        description: 'Statutory 5% Value Added Tax on professional brokerage services.',
      },
      {
        key: 'corp-tax-reserve',
        label: 'Corporate Tax Statutory Reserve (9% Internal Provision)',
        amount: corporateTaxReserve,
        percentage: 9.0,
        recipient: 'White Caves Tax Escrow Reserve',
        isMandatory: false,
        description: 'UAE Federal Decree-Law No. 47 of 2022 internal corporate tax withholding.',
      },
    ],
  };
}

export function useDldEscrowCalculator(initialInput?: Partial<EscrowCalculationInput>) {
  const [input, setInput] = useState<EscrowCalculationInput>({
    ...DEFAULT_ESCROW_INPUT,
    ...initialInput,
  });

  const [activeTab, setActiveTab] = useState<'calculator' | 'escrow-flow' | 'simulation'>('calculator');

  const updateField = <K extends keyof EscrowCalculationInput>(field: K, val: EscrowCalculationInput[K]) => {
    setInput(prev => ({ ...prev, [field]: val }));
  };

  const results = useMemo(() => calculateDldEscrow(input), [input]);

  const formattedResults = useMemo(() => {
    return {
      priceStr: `AED ${results.propertyPrice.toLocaleString()}`,
      dldFeeStr: `AED ${results.dldTransferFee.toLocaleString()}`,
      trusteeStr: `AED ${results.trusteeFee.toLocaleString()}`,
      commissionStr: `AED ${results.agencyCommission.toLocaleString()}`,
      totalGovStr: `AED ${results.totalGovFees.toLocaleString()}`,
      totalClosingStr: `AED ${results.totalClosingCosts.toLocaleString()}`,
      totalFundStr: `AED ${results.totalFundRequired.toLocaleString()}`,
    };
  }, [results]);

  return {
    input,
    updateField,
    results,
    formattedResults,
    activeTab,
    setActiveTab,
  };
}
