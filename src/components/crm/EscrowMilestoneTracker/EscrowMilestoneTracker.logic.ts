import { useState, useMemo, useCallback } from 'react';
import { EscrowAccountDetails, EscrowMilestone } from './EscrowMilestoneTracker.types';

export const DEFAULT_ESCROW_ACCOUNT: EscrowAccountDetails = {
  projectName: 'White Caves Reserve · Palm Crown Residence',
  projectDldCode: 'DLD-PRJ-2026-9812',
  developerName: 'White Caves Luxury Developments LLC',
  escrowTrusteeBank: 'Emirates NBD Escrow Trustee Division',
  escrowIban: 'AE29 0260 0000 1234 5678 901',
  totalDealValueAED: 18500000,
  escrowRetentionFundPct: 5,
  retentionFundAED: 925000,
  currentBalanceAED: 11100000,
  releasedToDateAED: 7400000,
  complianceRating: 'AAA',
};

export const DEFAULT_MILESTONES: EscrowMilestone[] = [
  {
    id: 'm1',
    milestoneCode: 'DLD-MS-01',
    name: 'Booking & Spa Execution (Deposit)',
    dldThresholdPct: 0,
    actualProgressPct: 100,
    paymentSplitPct: 20,
    disbursementAmountAED: 3700000,
    escrowReleaseStatus: 'cleared',
    inspectionCertificateNo: 'DLD-INSP-2026-01',
    auditSignOffDate: '15 Jan 2026',
    engineerNotes: 'Downpayment and 4% DLD registration fee deposited into verified trustee escrow.',
  },
  {
    id: 'm2',
    milestoneCode: 'DLD-MS-02',
    name: 'Raft Foundation & Substructure Completion',
    dldThresholdPct: 20,
    actualProgressPct: 100,
    paymentSplitPct: 20,
    disbursementAmountAED: 3700000,
    escrowReleaseStatus: 'cleared',
    inspectionCertificateNo: 'DLD-INSP-2026-02',
    auditSignOffDate: '28 Feb 2026',
    engineerNotes: 'Piling and basement structure verified by DLD Technical Audit Bureau.',
  },
  {
    id: 'm3',
    milestoneCode: 'DLD-MS-03',
    name: 'Superstructure (Podium & Core Structure)',
    dldThresholdPct: 50,
    actualProgressPct: 62,
    paymentSplitPct: 20,
    disbursementAmountAED: 3700000,
    escrowReleaseStatus: 'under_audit',
    inspectionCertificateNo: 'DLD-INSP-2026-03-PENDING',
    engineerNotes: 'Floor 18 concrete slab poured. DLD site audit scheduled for milestone release clearance.',
  },
  {
    id: 'm4',
    milestoneCode: 'DLD-MS-04',
    name: 'Facade Glazing & Internal MEP Rough-in',
    dldThresholdPct: 75,
    actualProgressPct: 35,
    paymentSplitPct: 20,
    disbursementAmountAED: 3700000,
    escrowReleaseStatus: 'in_progress',
    engineerNotes: 'Curtain wall installation and air conditioning plant commissioning underway.',
  },
  {
    id: 'm5',
    milestoneCode: 'DLD-MS-05',
    name: 'Building Completion Certificate (BCC) & Handover',
    dldThresholdPct: 100,
    actualProgressPct: 0,
    paymentSplitPct: 20,
    disbursementAmountAED: 3700000,
    escrowReleaseStatus: 'pending',
    engineerNotes: 'Final snagging, civil defense approval, title deed issuance and 5% Law No. 8 retention fund escrow lock.',
  },
];

export function useEscrowMilestoneLogic(
  initialAccount?: EscrowAccountDetails,
  initialMilestones?: EscrowMilestone[],
  onDisburseRequest?: (milestoneId: string, amountAED: number) => void,
  onAuditVerification?: (milestoneId: string) => void
) {
  const account = initialAccount || DEFAULT_ESCROW_ACCOUNT;
  const [milestones, setMilestones] = useState<EscrowMilestone[]>(initialMilestones || DEFAULT_MILESTONES);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    (initialMilestones && initialMilestones[0]?.id) || 'm3'
  );
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const selectedMilestone = useMemo(
    () => milestones.find(m => m.id === selectedMilestoneId) || milestones[0],
    [milestones, selectedMilestoneId]
  );

  const stats = useMemo(() => {
    const totalDisbursed = milestones
      .filter(m => m.escrowReleaseStatus === 'cleared')
      .reduce((sum, m) => sum + m.disbursementAmountAED, 0);

    const pendingAudit = milestones
      .filter(m => m.escrowReleaseStatus === 'under_audit')
      .reduce((sum, m) => sum + m.disbursementAmountAED, 0);

    const completionRatePct = Math.round(
      (milestones.filter(m => m.escrowReleaseStatus === 'cleared').length / milestones.length) * 100
    );

    return { totalDisbursed, pendingAudit, completionRatePct };
  }, [milestones]);

  const handleTriggerAudit = useCallback(
    (milestoneId: string) => {
      setMilestones(prev =>
        prev.map(m => (m.id === milestoneId ? { ...m, escrowReleaseStatus: 'under_audit' } : m))
      );
      setActionAlert(`DLD Law 50/2022 Technical Audit requested for milestone #${milestoneId}.`);
      if (onAuditVerification) onAuditVerification(milestoneId);
    },
    [onAuditVerification]
  );

  const handleApproveDisbursement = useCallback(
    (milestoneId: string) => {
      let releasedAmt = 0;
      setMilestones(prev =>
        prev.map(m => {
          if (m.id === milestoneId) {
            releasedAmt = m.disbursementAmountAED;
            return {
              ...m,
              escrowReleaseStatus: 'cleared',
              auditSignOffDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              inspectionCertificateNo: `DLD-INSP-CLR-${Date.now().toString().slice(-4)}`,
            };
          }
          return m;
        })
      );
      setActionAlert(`Milestone #${milestoneId} cleared for AED ${releasedAmt.toLocaleString()} release from Escrow.`);
      if (onDisburseRequest) onDisburseRequest(milestoneId, releasedAmt);
    },
    [onDisburseRequest]
  );

  return {
    account,
    milestones,
    selectedMilestone,
    setSelectedMilestoneId,
    stats,
    actionAlert,
    setActionAlert,
    handleTriggerAudit,
    handleApproveDisbursement,
  };
}
