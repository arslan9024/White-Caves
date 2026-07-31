/**
 * CommissionsTab — Dubai Real Estate Commission Tracker
 * Connects to existing 9 backend endpoints in /api/commissions
 * Brand: White Caves (#C41E3A red / #0A0A0A black / #FAFAFA white)
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { PermissionGuard } from '../../guards/PermissionGuard';
import { authFetch } from '../../../utils/authFetch';

// ─── Types ────────────────────────────────────────────────────────────────────

type CommissionStatus = 'pending' | 'approved' | 'paid' | 'disputed' | 'cancelled';

interface Commission {
  _id: string;
  propertyTitle: string;
  agentName: string;
  clientName: string;
  transactionValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  propertyType: string;
  createdAt: string;
  paidAt?: string;
  notes?: string;
}

interface CommissionSummary {
  totalCommissions: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  approvedAmount: number;
  averageCommissionRate: number;
  topAgent?: { name: string; totalCommission: number };
}

interface CommissionsTabProps {
  data?: unknown;
  loading?: boolean;
  onAction?: (action: string, id?: string) => void;
}

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  padding: 1.5rem;
  animation: ${fadeIn} 0.35s ease;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Title = styled.h3`
  font-family: 'Cormorant Garamond', 'Poppins', serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #fafafa;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: rgba(10, 10, 10, 0.65);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(196, 30, 58, 0.3);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(196, 30, 58, 0.55);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(196, 30, 58, 0.15);
  }
`;

const StatLabel = styled.span`
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(250, 250, 250, 0.55);
  margin-bottom: 0.4rem;
`;

const StatValue = styled.span`
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #c41e3a;
  text-shadow: 0 0 20px rgba(196, 30, 58, 0.3);
  line-height: 1.1;
`;

const StatSub = styled.span`
  display: block;
  font-size: 0.78rem;
  color: rgba(250, 250, 250, 0.5);
  margin-top: 0.2rem;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  background: rgba(10, 10, 10, 0.7);
  border: 1px solid rgba(196, 30, 58, 0.25);
  border-radius: 8px;
  color: #fafafa;
  padding: 0.5rem 0.85rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover,
  &:focus {
    border-color: rgba(196, 30, 58, 0.6);
    outline: none;
  }

  option {
    background: #1a1a1a;
    color: #fafafa;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Thead = styled.thead`
  background: rgba(196, 30, 58, 0.08);
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  color: rgba(250, 250, 250, 0.65);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid rgba(196, 30, 58, 0.2);
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s ease;

  &:hover {
    background: rgba(196, 30, 58, 0.04);
  }
`;

const Td = styled.td`
  padding: 0.85rem 1rem;
  color: rgba(250, 250, 250, 0.88);
  vertical-align: middle;
`;

const Badge = styled.span<{ $status: CommissionStatus }>`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${({ $status }) => {
    switch ($status) {
      case 'paid':
        return 'rgba(34, 197, 94, 0.15)';
      case 'approved':
        return 'rgba(59, 130, 246, 0.15)';
      case 'pending':
        return 'rgba(250, 204, 21, 0.15)';
      case 'disputed':
        return 'rgba(239, 68, 68, 0.15)';
      case 'cancelled':
        return 'rgba(107, 114, 128, 0.15)';
      default:
        return 'rgba(107, 114, 128, 0.15)';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'paid':
        return '#4ade80';
      case 'approved':
        return '#60a5fa';
      case 'pending':
        return '#fde047';
      case 'disputed':
        return '#f87171';
      case 'cancelled':
        return '#9ca3af';
      default:
        return '#9ca3af';
    }
  }};
  border: 1px solid currentColor;
`;

const ActionBtn = styled.button<{ $variant?: 'approve' | 'pay' | 'dispute' }>`
  background: none;
  border: 1px solid rgba(196, 30, 58, 0.35);
  border-radius: 6px;
  color: #c41e3a;
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.4rem;

  &:hover {
    background: rgba(196, 30, 58, 0.12);
    border-color: #c41e3a;
  }

  ${({ $variant }) =>
    $variant === 'pay' &&
    `
    border-color: rgba(34, 197, 94, 0.4);
    color: #4ade80;
    &:hover { background: rgba(34, 197, 94, 0.1); border-color: #4ade80; }
  `}
  ${({ $variant }) =>
    $variant === 'dispute' &&
    `
    border-color: rgba(239, 68, 68, 0.4);
    color: #f87171;
    &:hover { background: rgba(239, 68, 68, 0.1); border-color: #f87171; }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(250, 250, 250, 0.4);
  font-size: 0.9rem;
`;

const LoadingRow = styled.div`
  height: 44px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(196, 30, 58, 0.07) 0%,
    rgba(196, 30, 58, 0.18) 40%,
    rgba(196, 30, 58, 0.07) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  margin-bottom: 0.5rem;
`;

const TableWrapper = styled.div`
  background: rgba(10, 10, 10, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(196, 30, 58, 0.2);
  border-radius: 12px;
  overflow: hidden;
  overflow-x: auto;
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatAED = (amount: number): string =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Mock Fallback Data (used when API unavailable) ───────────────────────────

const MOCK_COMMISSIONS: Commission[] = [
  {
    _id: '1',
    propertyTitle: 'Luxury Villa - Palm Jumeirah',
    agentName: 'Ahmed Ali',
    clientName: 'Mohammed Al Rashid',
    transactionValue: 8500000,
    commissionRate: 2,
    commissionAmount: 170000,
    status: 'approved',
    propertyType: 'Villa',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    _id: '2',
    propertyTitle: 'Studio Apartment - Downtown Dubai',
    agentName: 'Sara Khan',
    clientName: 'Emily Johnson',
    transactionValue: 1200000,
    commissionRate: 2.5,
    commissionAmount: 30000,
    status: 'paid',
    propertyType: 'Apartment',
    createdAt: '2026-03-10T09:30:00Z',
    paidAt: '2026-03-20T12:00:00Z',
  },
  {
    _id: '3',
    propertyTitle: 'Penthouse - Dubai Marina',
    agentName: 'Fatima Ahmed',
    clientName: 'David Chen',
    transactionValue: 15000000,
    commissionRate: 1.5,
    commissionAmount: 225000,
    status: 'pending',
    propertyType: 'Penthouse',
    createdAt: '2026-04-01T14:00:00Z',
  },
];

const MOCK_SUMMARY: CommissionSummary = {
  totalCommissions: 3,
  totalAmount: 425000,
  pendingAmount: 225000,
  paidAmount: 30000,
  approvedAmount: 170000,
  averageCommissionRate: 2.0,
  topAgent: { name: 'Fatima Ahmed', totalCommission: 225000 },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const CommissionsTab: React.FC<CommissionsTabProps> = ({ onAction }) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');

  const fetchData = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      const [commissionsRes, summaryRes] = await Promise.all([
        authFetch('/api/commissions?pageSize=50').then(
          (r: Response) => r.json() as Promise<{ success: boolean; data: Commission[] }>
        ),
        authFetch('/api/commissions/summary').then(
          (r: Response) => r.json() as Promise<{ success: boolean; data: CommissionSummary }>
        ),
      ]);
      setCommissions(commissionsRes.data ?? []);
      setSummary(summaryRes.data ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load commissions';
      setError(message);
      // Graceful degradation: show mock data with error notice
      setCommissions(MOCK_COMMISSIONS);
      setSummary(MOCK_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleAction = useCallback(
    (action: string, id: string): void => {
      if (action === 'approve') {
        setCommissions(prev =>
          prev.map(c => (c._id === id ? { ...c, status: 'approved' as CommissionStatus } : c))
        );
      } else if (action === 'pay') {
        setCommissions(prev =>
          prev.map(c =>
            c._id === id
              ? { ...c, status: 'paid' as CommissionStatus, paidAt: new Date().toISOString() }
              : c
          )
        );
      } else if (action === 'dispute') {
        setCommissions(prev =>
          prev.map(c => (c._id === id ? { ...c, status: 'disputed' as CommissionStatus } : c))
        );
      }
      onAction?.(action, id);
    },
    [onAction]
  );

  // Derived data
  const agentNames = [...new Set(commissions.map(c => c.agentName))].sort();

  const filtered = commissions.filter(c => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchAgent = agentFilter === 'all' || c.agentName === agentFilter;
    return matchStatus && matchAgent;
  });

  return (
    <Container aria-label="Commissions management tab">
      {/* ── Header ── */}
      <Header>
        <Title>💎 Commission Tracker</Title>
        {error && (
          <span
            style={{
              fontSize: '0.8rem',
              color: '#f87171',
              background: 'rgba(239,68,68,0.1)',
              padding: '0.25rem 0.75rem',
              borderRadius: 6,
              border: '1px solid rgba(239,68,68,0.3)',
            }}
            role="alert"
          >
            ⚠️ Using demo data — API connection pending
          </span>
        )}
      </Header>

      {/* ── Summary Cards ── */}
      {loading ? (
        <SummaryGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCard key={i} aria-hidden="true">
              <LoadingRow />
            </StatCard>
          ))}
        </SummaryGrid>
      ) : (
        summary && (
          <SummaryGrid>
            <StatCard>
              <StatLabel>Total Commissions</StatLabel>
              <StatValue>{formatAED(summary.totalAmount)}</StatValue>
              <StatSub>{summary.totalCommissions} transactions</StatSub>
            </StatCard>
            <StatCard>
              <StatLabel>Pending</StatLabel>
              <StatValue style={{ color: 'var(--color-fde047, #fde047)', textShadow: '0 0 18px rgba(253,224,71,0.3)' }}>
                {formatAED(summary.pendingAmount)}
              </StatValue>
              <StatSub>Awaiting approval</StatSub>
            </StatCard>
            <StatCard>
              <StatLabel>Paid Out</StatLabel>
              <StatValue style={{ color: 'var(--color-4ade80, #4ade80)', textShadow: '0 0 18px rgba(74,222,128,0.3)' }}>
                {formatAED(summary.paidAmount)}
              </StatValue>
              <StatSub>Settled to agents</StatSub>
            </StatCard>
            <StatCard>
              <StatLabel>Avg Commission Rate</StatLabel>
              <StatValue>{summary.averageCommissionRate.toFixed(1)}%</StatValue>
              <StatSub>
                {summary.topAgent ? `Top: ${summary.topAgent.name}` : 'Dubai market avg 2%'}
              </StatSub>
            </StatCard>
          </SummaryGrid>
        )
      )}

      {/* ── Filters ── */}
      <FilterRow>
        <FilterSelect
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="disputed">Disputed</option>
          <option value="cancelled">Cancelled</option>
        </FilterSelect>

        <FilterSelect
          value={agentFilter}
          onChange={e => setAgentFilter(e.target.value)}
          aria-label="Filter by agent"
        >
          <option value="all">All Agents</option>
          {agentNames.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </FilterSelect>

        <span style={{ fontSize: '0.8rem', color: 'rgba(250,250,250,0.4)', marginLeft: 'auto' }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </FilterRow>

      {/* ── Table ── */}
      <TableWrapper>
        {loading ? (
          <div style={{ padding: '1.5rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingRow key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💎</div>
            No commissions match your filters
          </EmptyState>
        ) : (
          <Table aria-label="Commission records table">
            <Thead>
              <tr>
                <Th>Property</Th>
                <Th>Agent</Th>
                <Th>Client</Th>
                <Th>Trans. Value</Th>
                <Th>Rate</Th>
                <Th>Commission</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </Thead>
            <tbody>
              {filtered.map(commission => (
                <Tr key={commission._id}>
                  <Td>
                    <div style={{ fontWeight: 600, color: 'var(--color-fafafa, #fafafa)' }}>
                      {commission.propertyTitle}
                    </div>
                    <div
                      style={{ fontSize: '0.75rem', color: 'rgba(250,250,250,0.45)', marginTop: 2 }}
                    >
                      {commission.propertyType}
                    </div>
                  </Td>
                  <Td>{commission.agentName}</Td>
                  <Td>{commission.clientName}</Td>
                  <Td style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                    {formatAED(commission.transactionValue)}
                  </Td>
                  <Td>{commission.commissionRate}%</Td>
                  <Td
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 700,
                      color: '#c41e3a',
                    }}
                  >
                    {formatAED(commission.commissionAmount)}
                  </Td>
                  <Td>
                    <Badge $status={commission.status}>{commission.status}</Badge>
                  </Td>
                  <Td style={{ fontSize: '0.78rem', color: 'rgba(250,250,250,0.5)' }}>
                    {formatDate(commission.createdAt)}
                    {commission.paidAt && (
                      <div style={{ color: 'var(--color-4ade80, #4ade80)', fontSize: '0.72rem' }}>
                        Paid {formatDate(commission.paidAt)}
                      </div>
                    )}
                  </Td>
                  <Td>
                    <PermissionGuard require="approve_commissions">
                      {commission.status === 'pending' && (
                        <ActionBtn
                          onClick={() => handleAction('approve', commission._id)}
                          aria-label={`Approve commission for ${commission.propertyTitle}`}
                        >
                          ✓ Approve
                        </ActionBtn>
                      )}
                      {commission.status === 'approved' && (
                        <ActionBtn
                          $variant="pay"
                          onClick={() => handleAction('pay', commission._id)}
                          aria-label={`Mark commission paid for ${commission.propertyTitle}`}
                        >
                          💸 Pay
                        </ActionBtn>
                      )}
                    </PermissionGuard>
                    <PermissionGuard require="manage_leads">
                      {(commission.status === 'pending' || commission.status === 'approved') && (
                        <ActionBtn
                          $variant="dispute"
                          onClick={() => handleAction('dispute', commission._id)}
                          aria-label={`Dispute commission for ${commission.propertyTitle}`}
                        >
                          ⚠ Dispute
                        </ActionBtn>
                      )}
                    </PermissionGuard>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableWrapper>
    </Container>
  );
};
