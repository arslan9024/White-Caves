// src/components/features/InventoryDashboard/InventoryDashboard.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  AlertTriangle,
  Lock,
  CheckCircle2,
  ClipboardList,
  HandshakeIcon,
  KeyRound,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StageSummary {
  stage: string;
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface DocAlertSummary {
  titleDeedMissing: number;
  landlordPassportMissing: number;
  ejariMissing: number;
}

// ─── Styled Components ───────────────────────────────────────────────────────

const DashboardContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  height: 100%;
  overflow-y: auto;

  h1 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: 600;
  }

  h2 {
    color: ${props => props.theme.colors.text};
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  text-align: center;

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    margin: 10px 0;
  }

  .stat-label {
    font-size: 13px;
    color: ${props => props.theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const PipelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
`;

const StageCard = styled.div<{ $color: string }>`
  background: ${props => props.theme.colors.cardBg};
  border: 2px solid ${props => props.$color}44;
  border-radius: 10px;
  padding: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color};
  }

  .stage-icon {
    color: ${props => props.$color};
    margin-bottom: 8px;
  }

  .stage-count {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.$color};
    line-height: 1;
  }

  .stage-label {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin: 4px 0 2px;
  }

  .stage-desc {
    font-size: 11px;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const AlertBanner = styled.div`
  background: #fef3cd;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 24px;
  color: #92400e;
  font-size: 14px;

  .alert-icon {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .alert-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }

  .alert-tag {
    background: #fde68a;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
  }
`;

// ─── Stage Config ─────────────────────────────────────────────────────────────

const STAGES: Omit<StageSummary, 'count'>[] = [
  {
    stage: 'draft_collected',
    label: 'Draft / Collected',
    color: '#6b7280',
    icon: <ClipboardList size={20} />,
    description: 'Newly collected from landlords',
  },
  {
    stage: 'verified_active',
    label: 'Verified / Active',
    color: '#10b981',
    icon: <CheckCircle2 size={20} />,
    description: 'Verified and live on market',
  },
  {
    stage: 'under_offer',
    label: 'Under Offer',
    color: '#f59e0b',
    icon: <Lock size={20} />,
    description: 'Offer received — property locked',
  },
  {
    stage: 'leased_sold',
    label: 'Leased / Sold',
    color: '#3b82f6',
    icon: <HandshakeIcon size={20} />,
    description: 'Deal completed',
  },
  {
    stage: 'handed_over',
    label: 'Handed Over',
    color: '#8b5cf6',
    icon: <KeyRound size={20} />,
    description: 'Keys handed to tenant/buyer',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const InventoryDashboard: React.FC = () => {
  const [stages, setStages] = useState<StageSummary[]>(STAGES.map(s => ({ ...s, count: 0 })));
  const [docAlerts, setDocAlerts] = useState<DocAlertSummary>({
    titleDeedMissing: 0,
    landlordPassportMissing: 0,
    ejariMissing: 0,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch('/api/properties/inventory-stats', {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;

        if (data.stages) {
          setStages(
            STAGES.map(s => ({
              ...s,
              count: (data.stages as Record<string, number>)[s.stage] ?? 0,
            }))
          );
        }
        if (data.docAlerts) setDocAlerts(data.docAlerts);
        if (typeof data.total === 'number') setTotal(data.total);
      } catch {
        // silently ignore – stats are non-critical
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalDocAlerts =
    docAlerts.titleDeedMissing + docAlerts.landlordPassportMissing + docAlerts.ejariMissing;

  const lockedCount = stages.find(s => s.stage === 'under_offer')?.count ?? 0;
  const activeCount = stages.find(s => s.stage === 'verified_active')?.count ?? 0;

  return (
    <DashboardContainer>
      <h1>📊 Inventory Dashboard</h1>

      {/* Summary stats */}
      <StatsGrid>
        <StatCard>
          <div className="stat-label">Total Properties</div>
          <div className="stat-value">{loading ? '—' : total.toLocaleString()}</div>
        </StatCard>

        <StatCard>
          <div className="stat-label">Active Listings</div>
          <div className="stat-value">{loading ? '—' : activeCount.toLocaleString()}</div>
        </StatCard>

        <StatCard>
          <div className="stat-label">🔒 Locked</div>
          <div className="stat-value">{loading ? '—' : lockedCount.toLocaleString()}</div>
        </StatCard>

        <StatCard>
          <div className="stat-label">⚠️ Doc Alerts</div>
          <div className="stat-value">{loading ? '—' : totalDocAlerts.toLocaleString()}</div>
        </StatCard>
      </StatsGrid>

      {/* Document alert banner */}
      {totalDocAlerts > 0 && (
        <AlertBanner>
          <AlertTriangle size={18} className="alert-icon" />
          <div>
            <strong>Missing Document Alerts</strong>
            <div className="alert-items">
              {docAlerts.titleDeedMissing > 0 && (
                <span className="alert-tag">Title Deed: {docAlerts.titleDeedMissing}</span>
              )}
              {docAlerts.landlordPassportMissing > 0 && (
                <span className="alert-tag">
                  Landlord Passport: {docAlerts.landlordPassportMissing}
                </span>
              )}
              {docAlerts.ejariMissing > 0 && (
                <span className="alert-tag">Ejari: {docAlerts.ejariMissing}</span>
              )}
            </div>
          </div>
        </AlertBanner>
      )}

      {/* 5-stage pipeline */}
      <h2>Inventory Pipeline</h2>
      <PipelineGrid>
        {stages.map(stage => (
          <StageCard key={stage.stage} $color={stage.color}>
            <div className="stage-icon">{stage.icon}</div>
            <div className="stage-count">{loading ? '—' : stage.count.toLocaleString()}</div>
            <div className="stage-label">{stage.label}</div>
            <div className="stage-desc">{stage.description}</div>
          </StageCard>
        ))}
      </PipelineGrid>

      <h2>Quick Actions</h2>
      <p>
        Use the sidebar to navigate to Acquisition, Inventory browsing, Data Tools, and Analytics.
        The pipeline above updates in real time from the database.
      </p>
    </DashboardContainer>
  );
};

export default InventoryDashboard;
