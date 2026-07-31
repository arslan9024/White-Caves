import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * SalesView Component
 * Displays lead pipeline, active deals, client journey, and contracts
 * Default service for SALES department
 * Refactored to use BaseDepartmentView to eliminate code duplication
 */
interface SalesViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: Record<string, unknown>;
}

const SalesView: React.FC<SalesViewProps> = ({
  serviceName = 'lead-pipeline',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('SALES')!;

  // Render main content based on serviceName and subitemId
  const renderContent = (data: Record<string, unknown>) => {
    const getCount = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

    if (!subitemId && serviceName === 'lead-pipeline') {
      return (
        <>
          {/* Pipeline Board */}
          <DataCard
            title="Sales Pipeline Board"
            subtitle="Kanban view of all leads and deals (DAMAC Hills & Dubailand)"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                padding: '0.5rem 0',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                }}
              >
                <small style={{ color: 'var(--color-888, #888)' }}>New Inquiries</small>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--white, #fff)' }}>142 Leads</div>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                }}
              >
                <small style={{ color: 'var(--color-888, #888)' }}>Viewing Scheduled</small>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-60a5fa, #60a5fa)' }}>
                  48 Viewings
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                }}
              >
                <small style={{ color: 'var(--color-888, #888)' }}>Negotiation (MOU/Form F)</small>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-c9a84c, #c9a84c)' }}>
                  18 Deals
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                }}
              >
                <small style={{ color: 'var(--color-888, #888)' }}>Closing & DLD Oqood</small>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-4ade80, #4ade80)' }}>
                  12 Closed
                </div>
              </div>
            </div>
          </DataCard>

          {/* Active Deals */}
          <DataCard
            title="Active Deals"
            subtitle="In-progress luxury villa & apartment transactions"
          >
            <div
              style={{
                padding: '0.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  paddingBottom: '0.4rem',
                }}
              >
                <span>DAMAC Hills 2 — 5 BR Vardon Villa (Form F Signed)</span>
                <strong style={{ color: 'var(--color-c9a84c, #c9a84c)' }}>AED 3,850,000</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  paddingBottom: '0.4rem',
                }}
              >
                <span>Dubailand — 3 BR Townhouse (Deposit Received)</span>
                <strong style={{ color: 'var(--color-c9a84c, #c9a84c)' }}>AED 2,400,000</strong>
              </div>
            </div>
          </DataCard>
        </>
      );
    }

    if (subitemId === 'pipeline-board') {
      return (
        <DataCard title="Pipeline Board" subtitle="Kanban view">
          Board data...
        </DataCard>
      );
    }

    if (subitemId === 'active-deals') {
      return (
        <DataCard title="Active Deals" subtitle="All active sales deals">
          Deals data...
        </DataCard>
      );
    }

    if (subitemId === 'client-journey') {
      return (
        <DataCard title="Client Journey" subtitle="Track clients through sales funnel">
          Journey data...
        </DataCard>
      );
    }

    if (subitemId === 'sales-contracts') {
      return (
        <DataCard title="Contracts" subtitle="Sales agreements and contracts">
          Contracts data...
        </DataCard>
      );
    }

    return null;
  };

  return (
    <BaseDepartmentView
      config={config}
      serviceName={serviceName}
      subitemId={subitemId}
      departmentData={departmentData}
      contentRenderer={renderContent}
    />
  );
};

export default SalesView;
