/**
 * SidebarDealsList.tsx
 * White Caves Real Estate LLC - Deals Left Sidebar Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Double-Layer Routing
 */

import React, { FC } from 'react';
import { Handshake, Building, Wallet, Tag, ArrowRight, Plus } from 'lucide-react';
import { CANONICAL_DEALS } from '../../crm/DealManager/DealManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

export interface SidebarDealsListProps {
  filterQuery?: string;
  selectedDealId?: string | null;
  onSelectDeal?: (id: string, title: string) => void;
  onOpenCreate?: () => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarDealsList: FC<SidebarDealsListProps> = ({
  filterQuery = '',
  selectedDealId,
  onSelectDeal,
  onOpenCreate,
  onNavigateToView,
}) => {
  const query = filterQuery.trim().toLowerCase();

  const visibleDeals = CANONICAL_DEALS.filter(deal => {
    if (!query) return true;
    return (
      deal.id.toLowerCase().includes(query) ||
      deal.dealNumber.toLowerCase().includes(query) ||
      deal.title.toLowerCase().includes(query) ||
      deal.propertyCommunity.toLowerCase().includes(query) ||
      deal.agentName.toLowerCase().includes(query) ||
      deal.clientName.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-deals-list">
      {/* ── Level 1 Category Portals ─────────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        <div
          onClick={() => onNavigateToView?.('/dashboard/deals/pipeline')}
          style={{
            fontSize: '0.68rem',
            color: '#C084FC',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(192, 132, 252, 0.08)',
            border: '1px solid rgba(192, 132, 252, 0.2)',
            borderRadius: '6px',
            marginBottom: '4px',
          }}
          data-testid="link-all-deals-pipeline"
        >
          🤝 Open Pipeline Kanban (CRUD) <ArrowRight size={11} />
        </div>
        <div
          onClick={() => onNavigateToView?.('/dashboard/deals/escrow')}
          style={{
            fontSize: '0.68rem',
            color: '#34D399',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
          data-testid="link-deals-escrow"
        >
          🏦 Escrow Trust Ledger & PDC Tracking <ArrowRight size={11} />
        </div>
      </div>

      {/* Header bar with Count and Add Deal action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px 10px 8px',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#C084FC',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Active Pipeline ({visibleDeals.length})
        </span>
        {onOpenCreate && (
          <button
            onClick={onOpenCreate}
            data-testid="sidebar-add-deal-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(192, 132, 252, 0.15)',
              border: '1px solid rgba(192, 132, 252, 0.3)',
              color: '#D8B4FE',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Plus size={12} />
            <span>New Deal</span>
          </button>
        )}
      </div>

      {/* ── Level 2 Sub-Items: Deals with Turing IDs ─────────────────── */}
      {visibleDeals.map(deal => {
        const isSelected = selectedDealId === deal.id;
        return (
          <div
            key={deal.id}
            onClick={() => {
              onSelectDeal?.(deal.id, deal.title);
              onNavigateToView?.(`/dashboard/deals/${deal.id}`);
            }}
            data-testid={`sidebar-deal-${deal.dealNumber}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(192, 132, 252, 0.15)' : '#070D18',
              border: isSelected ? '1px solid #C084FC' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'monospace',
                  color: '#C084FC',
                  background: 'rgba(192, 132, 252, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                {deal.dealNumber}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: deal.status === 'COMPLETED' ? '#10B981' : '#F59E0B',
                }}
              >
                {deal.status}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC' }}>
              {deal.title}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: '#64748B',
              }}
            >
              <span>{deal.propertyCommunity}</span>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>
                AED {(deal.valueAED / 1_000_000).toFixed(2)}M
              </span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarDealsList;
