/**
 * EscrowMilestoneTracker.types.ts
 * Types for UAE Law No. 8 of 2007 & Law 50/2022 DLD Escrow Milestone Disbursement Stepper
 * Architecture: AEGIS Single Purpose File Law (< 350 lines)
 * Law: AEG-001–009, Context Triad, Statutory DLD Escrow Governance
 */

export type MilestoneStatus = 'cleared' | 'under_audit' | 'in_progress' | 'pending';

export interface EscrowMilestone {
  id: string;
  milestoneCode: string;
  name: string;
  dldThresholdPct: number;
  actualProgressPct: number;
  paymentSplitPct: number;
  disbursementAmountAED: number;
  escrowReleaseStatus: MilestoneStatus;
  inspectionCertificateNo?: string;
  auditSignOffDate?: string;
  engineerNotes?: string;
}

export interface EscrowAccountDetails {
  projectName: string;
  projectDldCode: string;
  developerName: string;
  escrowTrusteeBank: string;
  escrowIban: string;
  totalDealValueAED: number;
  escrowRetentionFundPct: number; // typically 5% retention post-handover under Law No. 8
  retentionFundAED: number;
  currentBalanceAED: number;
  releasedToDateAED: number;
  complianceRating: 'AAA' | 'AA' | 'A';
}

export interface EscrowMilestoneTrackerProps {
  account?: EscrowAccountDetails;
  milestones?: EscrowMilestone[];
  onDisburseRequest?: (milestoneId: string, amountAED: number) => void;
  onAuditVerification?: (milestoneId: string) => void;
}
