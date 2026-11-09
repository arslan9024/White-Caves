/**
 * Off-Plan Escrow Account Validator & Oqood Construction Milestone Engine
 * Domain: Strategic Off-Plan Allocations & RERA Trust Account Law (Domain 2 & 4 / Items #39 & #40)
 * Standard: UAE Law No. (8) of 2007 (Escrow Accounts for Real Estate Development in Dubai)
 */

export interface DeveloperEscrowProject {
  projectId: string;
  projectName: string;
  masterDeveloper: 'EMAAR' | 'DAMAC' | 'NAKHEEL' | 'MERAAS' | 'SOBHA' | 'ELLINGTON';
  escrowAccountNumber: string;
  escrowBankName: string;
  reraProjectRegistrationNumber: string;
  constructionCompletionPercentage: number;
  paymentsCollectedPercentage: number;
  targetHandoverDate: string; // ISO format
  isEscrowActive: boolean;
}

export interface EscrowDisbursementVerification {
  isValidForDeposit: boolean;
  isMilestoneCompliant: boolean;
  constructionLagRiskLevel: 'LOW_RISK' | 'MODERATE_DELAY' | 'CRITICAL_CONSTRUCTION_LAG';
  maxPermissibleCollectionPercentage: number;
  variancePercentage: number;
  statutoryWarning?: string;
}

/**
 * Validates off-plan payments against RERA Law No. (8) of 2007:
 * Developer collections cannot exceed verified on-site construction completion percentage
 * by more than a statutory 20% margin, and all deposits must route to an active RERA trust account.
 */
export function verifyDeveloperEscrowDisbursement(project: DeveloperEscrowProject): EscrowDisbursementVerification {
  const {
    isEscrowActive,
    constructionCompletionPercentage,
    paymentsCollectedPercentage,
    escrowAccountNumber
  } = project;

  if (!isEscrowActive || !escrowAccountNumber) {
    return {
      isValidForDeposit: false,
      isMilestoneCompliant: false,
      constructionLagRiskLevel: 'CRITICAL_CONSTRUCTION_LAG',
      maxPermissibleCollectionPercentage: 0,
      variancePercentage: paymentsCollectedPercentage,
      statutoryWarning: 'Escrow account is inactive or unverified. Under UAE Law No. 8 of 2007, deposits are strictly prohibited.'
    };
  }

  // Statutory maximum collection cap = verified completion + 20% buffer (capped at 100%)
  const maxPermissibleCollectionPercentage = Math.min(100, constructionCompletionPercentage + 20);
  const variance = paymentsCollectedPercentage - constructionCompletionPercentage;

  let riskLevel: EscrowDisbursementVerification['constructionLagRiskLevel'] = 'LOW_RISK';
  let isMilestoneCompliant = true;
  let statutoryWarning: string | undefined;

  if (paymentsCollectedPercentage > maxPermissibleCollectionPercentage) {
    riskLevel = 'CRITICAL_CONSTRUCTION_LAG';
    isMilestoneCompliant = false;
    statutoryWarning = `Developer has collected ${paymentsCollectedPercentage}%, exceeding the statutory limit of ${maxPermissibleCollectionPercentage}% based on ${constructionCompletionPercentage}% physical site completion.`;
  } else if (variance > 10) {
    riskLevel = 'MODERATE_DELAY';
    statutoryWarning = 'Payment milestones are advancing ahead of physical inspection milestones. RERA audit review recommended.';
  }

  return {
    isValidForDeposit: isMilestoneCompliant,
    isMilestoneCompliant,
    constructionLagRiskLevel: riskLevel,
    maxPermissibleCollectionPercentage,
    variancePercentage: Math.max(0, variance),
    statutoryWarning
  };
}
