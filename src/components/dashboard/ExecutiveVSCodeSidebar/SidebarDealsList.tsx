/**
 * White Caves Real Estate LLC - Sovereign Deals Pipeline Sidebar List
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Handshake, Building, Wallet, Tag } from 'lucide-react';
import { CANONICAL_DEALS } from '../../crm/DealManager/DealManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

interface SidebarDealsListProps {
  filterQuery?: string;
  selectedDealId?: string | null;
  onSelectDeal?: (id: string, title: string) => void;
  onOpenCreate?: () => void;
}

export const SidebarDealsList: FC<SidebarDealsListProps> = ({
  filterQuery = '',
  selectedDealId,
  onSelectDeal,
  onOpenCreate,
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
              color: '#C084FC',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>+ Deal</span>
          </button>
        )}
      </div>

      {visibleDeals.map(deal => {
        const isSelected = selectedDealId === deal.id;
        const statusColors: Record<string, { bg: string; text: string }> = {
          INQUIRY: { bg: 'rgba(100, 116, 139, 0.15)', text: '#94A3B8' },
          VIEWING: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA' },
          OFFER: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24' },
          CONTRACT: { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC' },
          EJARI_DLD: { bg: 'rgba(236, 72, 153, 0.15)', text: '#F472B6' },
          COMPLETED: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399' },
          CANCELLED: { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171' },
        };
        const statusStyle = statusColors[deal.status] || {
          bg: 'rgba(255,255,255,0.08)',
          text: '#94A3B8',
        };

        return (
          <div
            key={deal._id}
            onClick={() => onSelectDeal?.(deal.id, deal.title)}
            data-testid={`sidebar-deal-${deal.id}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(192, 132, 252, 0.15)' : '#070D18',
              border: `1px solid ${isSelected ? '#C084FC' : 'rgba(255, 255, 255, 0.05)'}`,
              marginBottom: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#C084FC',
                    background: 'rgba(192, 132, 252, 0.2)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {deal.id}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <Tag size={10} />
                  {deal.dealType}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: statusStyle.text,
                  background: statusStyle.bg,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {deal.status.replace('_', ' ')}
              </span>
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                lineHeight: '1.2',
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={deal.title}
            >
              {deal.title}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
              }}
            >
              <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Building size={10} color="#EF4444" />
                {deal.propertyCommunity}
              </span>
              <span
                style={{
                  fontWeight: 800,
                  color: '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Wallet size={10} />
                AED {(deal.commissionAED / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarDealsList;
