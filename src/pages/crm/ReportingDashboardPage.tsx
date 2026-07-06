/**
 * CRM Reporting Dashboard Page
 * KPI cards, lead source breakdown, property status, commission summary, and export.
 * Business logic extracted to useReportingDashboard hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/reports
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  PageContainer, PageHeader, PageTitle, BackLink,
  ActionBar, FilterSelect,
  PrimaryButton, SecondaryButton,
  LoadingBanner, ErrorBanner, FormInput,
} from './styles/CrmPageStyles';
import { useReportingDashboard } from './hooks/useReportingDashboard';

// ─── Report-Specific Styled Components ──────────────────────────────────

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const KPICard = styled.div<{ $color: string }>`
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.5rem;
  border-top: 4px solid ${props => props.$color};
`;

const KPIValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
`;

const KPILabel = styled.div`
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 1rem;
`;

const BarContainer = styled.div`
  margin-bottom: 0.75rem;
`;

const BarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 0.3rem;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const CommissionRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 0.85rem;

  &:last-child {
    border-bottom: none;
  }
`;

const CommissionLabel = styled.span`
  color: #555;
`;

const CommissionValue = styled.span`
  font-weight: 600;
  color: #1a1a2e;
`;

const ExportBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const DateInput = styled(FormInput)`
  width: 160px;
`;

// ─── Color maps ─────────────────────────────────────────────────────────

const SOURCE_COLORS: Record<string, string> = {
  whatsapp: '#25D366',
  website: '#3B82F6',
  phone: '#8B5CF6',
  referral: '#F59E0B',
  marketing: '#EC4899',
  direct: '#10B981',
};

const STATUS_COLORS: Record<string, string> = {
  available: '#10B981',
  reserved: '#F59E0B',
  sold: '#EF4444',
  rented: '#3B82F6',
  off_market: '#6B7280',
};

// ─── Component ──────────────────────────────────────────────────────────

const ReportingDashboardPage: FC = () => {
  useDocumentTitle('Reporting Dashboard');
  const {
    kpis, leadSourceBreakdown, propertyStatusBreakdown, commissionSummary,
    loading, error,
    dateRange, setDateRange,
    exportFormat, setExportFormat,
    handleExport, retryFetch, goBack,
    formatCurrency,
  } = useReportingDashboard();

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <div>
          <BackLink onClick={goBack}>← Back to CRM Hub</BackLink>
          <PageTitle>📊 Reporting Dashboard</PageTitle>
        </div>
      </PageHeader>

      {/* Loading & Error States */}
      {loading && <LoadingBanner>⏳ Loading reports from server...</LoadingBanner>}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error}</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

      {/* Export & Date Range */}
      <ActionBar>
        <ExportBar>
          <DateInput
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
            placeholder="Start date"
          />
          <span style={{ color: '#888', fontSize: '0.85rem' }}>to</span>
          <DateInput
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
            placeholder="End date"
          />
          <FilterSelect
            value={exportFormat}
            onChange={e => setExportFormat(e.target.value as 'csv' | 'json' | 'excel')}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="excel">Excel</option>
          </FilterSelect>
          <PrimaryButton onClick={handleExport}>
            📥 Export Report
          </PrimaryButton>
        </ExportBar>
      </ActionBar>

      {/* KPI Cards */}
      <KPIGrid>
        <KPICard $color="#3B82F6">
          <KPIValue>{kpis.newLeads ?? 0}</KPIValue>
          <KPILabel>New Leads</KPILabel>
        </KPICard>
        <KPICard $color="#10B981">
          <KPIValue>{kpis.wonDeals ?? 0}</KPIValue>
          <KPILabel>Won Deals</KPILabel>
        </KPICard>
        <KPICard $color="#8B5CF6">
          <KPIValue>{formatCurrency(kpis.revenue)}</KPIValue>
          <KPILabel>Revenue</KPILabel>
        </KPICard>
        <KPICard $color="#F59E0B">
          <KPIValue>{formatCurrency(kpis.avgDealSize)}</KPIValue>
          <KPILabel>Avg Deal Size</KPILabel>
        </KPICard>
      </KPIGrid>

      {/* Breakdowns */}
      <SectionGrid>
        {/* Lead Source Breakdown */}
        <Section>
          <SectionTitle>📈 Lead Source Breakdown</SectionTitle>
          {leadSourceBreakdown.length > 0 ? (
            leadSourceBreakdown.map(({ source, count, percentage }) => (
              <BarContainer key={source}>
                <BarLabel>
                  <span>{source}</span>
                  <span>{count}</span>
                </BarLabel>
                <BarTrack>
                  <BarFill $width={percentage} $color={SOURCE_COLORS[source] || '#3B82F6'} />
                </BarTrack>
              </BarContainer>
            ))
          ) : (
            <div style={{ color: '#888', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
              No lead source data available
            </div>
          )}
        </Section>

        {/* Property Status Breakdown */}
        <Section>
          <SectionTitle>🏠 Property Status Breakdown</SectionTitle>
          {propertyStatusBreakdown.length > 0 ? (
            propertyStatusBreakdown.map(({ status, count, percentage }) => (
              <BarContainer key={status}>
                <BarLabel>
                  <span>{status}</span>
                  <span>{count} ({percentage}%)</span>
                </BarLabel>
                <BarTrack>
                  <BarFill $width={percentage} $color={STATUS_COLORS[status] || '#6B7280'} />
                </BarTrack>
              </BarContainer>
            ))
          ) : (
            <div style={{ color: '#888', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
              No property data available
            </div>
          )}
        </Section>
      </SectionGrid>

      {/* Commission Summary */}
      <Section>
        <SectionTitle>💰 Commission Summary</SectionTitle>
        <CommissionRow>
          <CommissionLabel>Total Commissions</CommissionLabel>
          <CommissionValue>{formatCurrency(commissionSummary.total)}</CommissionValue>
        </CommissionRow>
        <CommissionRow>
          <CommissionLabel>Pending</CommissionLabel>
          <CommissionValue>{formatCurrency(commissionSummary.pending)}</CommissionValue>
        </CommissionRow>
        <CommissionRow>
          <CommissionLabel>Paid</CommissionLabel>
          <CommissionValue>{formatCurrency(commissionSummary.paid)}</CommissionValue>
        </CommissionRow>
      </Section>
    </PageContainer>
  );
};

export default ReportingDashboardPage;
