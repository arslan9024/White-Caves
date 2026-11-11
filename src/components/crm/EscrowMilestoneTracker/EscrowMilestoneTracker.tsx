import React, { FC } from 'react';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BadgeCheck,
  Send,
  FileCheck,
} from 'lucide-react';
import { EscrowMilestoneTrackerProps } from './EscrowMilestoneTracker.types';
import { useEscrowMilestoneLogic } from './EscrowMilestoneTracker.logic';
import {
  EscrowTrackerContainer,
  EscrowHeaderDeck,
  EscrowKpiGrid,
  KpiCard,
  StepperTrack,
  StepNode,
  MilestoneDetailCard,
} from './EscrowMilestoneTracker.styles';

export const EscrowMilestoneTracker: FC<EscrowMilestoneTrackerProps> = ({
  account: initialAccount,
  milestones: initialMilestones,
  onDisburseRequest,
  onAuditVerification,
}) => {
  const {
    account,
    milestones,
    selectedMilestone,
    setSelectedMilestoneId,
    stats,
    actionAlert,
    handleTriggerAudit,
    handleApproveDisbursement,
  } = useEscrowMilestoneLogic(
    initialAccount,
    initialMilestones,
    onDisburseRequest,
    onAuditVerification
  );

  return (
    <EscrowTrackerContainer data-testid="escrow-milestone-tracker">
      {/* 1. Top Header Deck with Project & Compliance Info */}
      <EscrowHeaderDeck>
        <div className="title-group">
          <h3>
            <Building size={18} color="#EF4444" />
            <span>{account.projectName}</span>
          </h3>
          <div className="subtitle">
            DLD Project Code: <strong>{account.projectDldCode}</strong> • Trustee: {account.escrowTrusteeBank}
          </div>
        </div>

        <div className="badges-group">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              color: '#10B981',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: 800,
            }}
          >
            <ShieldCheck size={12} />
            <span>Law No. 8 & 50/2022 Compliant</span>
          </div>

          <div
            style={{
              background: '#EF4444',
              color: '#FFFFFF',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: 800,
            }}
          >
            Escrow Rating: {account.complianceRating}
          </div>
        </div>
      </EscrowHeaderDeck>

      {/* 2. Escrow KPI Deck */}
      <EscrowKpiGrid>
        <KpiCard $accentColor="#3B82F6">
          <div className="label">Total Deal Escrow Fund</div>
          <div className="value">AED {account.totalDealValueAED.toLocaleString()}</div>
          <div className="sub">100% Ring-Fenced Trustee Account</div>
        </KpiCard>

        <KpiCard $accentColor="#10B981">
          <div className="label">Disbursed to Date</div>
          <div className="value" data-testid="kpi-disbursed-amount">AED {stats.totalDisbursed.toLocaleString()}</div>
          <div className="sub">{stats.completionRatePct}% Milestones Cleared</div>
        </KpiCard>

        <KpiCard $accentColor="#F59E0B">
          <div className="label">Pending Audit Clearance</div>
          <div className="value">AED {stats.pendingAudit.toLocaleString()}</div>
          <div className="sub">Subject to Site Inspection</div>
        </KpiCard>

        <KpiCard $accentColor="#EC4899">
          <div className="label">5% Post-Handover Retention</div>
          <div className="value">AED {account.retentionFundAED.toLocaleString()}</div>
          <div className="sub">Law No. 8 (1-Year Warranty Fund)</div>
        </KpiCard>
      </EscrowKpiGrid>

      {/* Alert banner if action triggered */}
      {actionAlert && (
        <div
          data-testid="escrow-action-alert"
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FCA5A5',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <BadgeCheck size={14} color="#EF4444" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* 3. Milestone Disbursement Visual Stepper */}
      <StepperTrack data-testid="escrow-stepper-track">
        {milestones.map((m, idx) => (
          <StepNode
            key={m.id}
            type="button"
            $status={m.escrowReleaseStatus}
            $isSelected={m.id === selectedMilestone.id}
            onClick={() => setSelectedMilestoneId(m.id)}
            data-testid={`step-node-${m.id}`}
          >
            <div className="node-icon-circle">
              {m.escrowReleaseStatus === 'cleared' ? (
                <CheckCircle2 size={18} />
              ) : m.escrowReleaseStatus === 'under_audit' ? (
                <Clock size={18} />
              ) : m.escrowReleaseStatus === 'in_progress' ? (
                <span>{idx + 1}</span>
              ) : (
                <AlertTriangle size={16} />
              )}
            </div>
            <div className="node-label">{m.name.split('(')[0]}</div>
            <div className="node-pct">{m.actualProgressPct}% / {m.dldThresholdPct}% DLD</div>
          </StepNode>
        ))}
      </StepperTrack>

      {/* 4. Selected Milestone Detail Card */}
      {selectedMilestone && (
        <MilestoneDetailCard data-testid="milestone-detail-card">
          <div className="detail-header">
            <div>
              <div className="code-title">
                {selectedMilestone.milestoneCode}: {selectedMilestone.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                Allocated Payment Split: <strong>{selectedMilestone.paymentSplitPct}%</strong> (AED{' '}
                {selectedMilestone.disbursementAmountAED.toLocaleString()})
              </div>
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '4px 8px',
                borderRadius: '4px',
                background:
                  selectedMilestone.escrowReleaseStatus === 'cleared'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : selectedMilestone.escrowReleaseStatus === 'under_audit'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(59, 130, 246, 0.2)',
                color:
                  selectedMilestone.escrowReleaseStatus === 'cleared'
                    ? '#10B981'
                    : selectedMilestone.escrowReleaseStatus === 'under_audit'
                    ? '#F59E0B'
                    : '#3B82F6',
              }}
            >
              Status: {selectedMilestone.escrowReleaseStatus.replace('_', ' ')}
            </div>
          </div>

          <div className="progress-bar-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8' }}>
              <span>DLD Construction Progress Requirement: {selectedMilestone.dldThresholdPct}%</span>
              <span>Audited Actual: <strong>{selectedMilestone.actualProgressPct}%</strong></span>
            </div>
            <div className="bar-bg">
              <div
                className="bar-fill"
                style={{ width: `${Math.min(100, selectedMilestone.actualProgressPct)}%` }}
              />
            </div>
          </div>

          {selectedMilestone.engineerNotes && (
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
              🏗️ Inspector Notes: {selectedMilestone.engineerNotes}
            </div>
          )}

          {selectedMilestone.inspectionCertificateNo && (
            <div style={{ fontSize: '0.7rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileCheck size={12} />
              <span>DLD Inspection Certificate: {selectedMilestone.inspectionCertificateNo}</span>
            </div>
          )}

          <div className="actions-row">
            {selectedMilestone.escrowReleaseStatus !== 'cleared' && (
              <>
                <button
                  type="button"
                  onClick={() => handleTriggerAudit(selectedMilestone.id)}
                  style={{
                    background: '#1E293B',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#F8FAFC',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  data-testid="btn-request-audit"
                >
                  <Send size={12} color="#F59E0B" />
                  <span>Request DLD Site Audit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApproveDisbursement(selectedMilestone.id)}
                  style={{
                    background: '#10B981',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  data-testid="btn-approve-disbursement"
                >
                  <ShieldCheck size={12} />
                  <span>Clear & Disburse AED {selectedMilestone.disbursementAmountAED.toLocaleString()}</span>
                </button>
              </>
            )}
          </div>
        </MilestoneDetailCard>
      )}
    </EscrowTrackerContainer>
  );
};

export default EscrowMilestoneTracker;
