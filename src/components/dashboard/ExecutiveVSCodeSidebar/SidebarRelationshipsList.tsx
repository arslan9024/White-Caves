/**
 * White Caves Real Estate LLC - Sovereign Relationships Sidebar List
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Network, Handshake, DollarSign, Award } from 'lucide-react';
import { CANONICAL_RELATIONSHIPS } from '../../crm/RelationshipManager/RelationshipManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

interface SidebarRelationshipsListProps {
  filterQuery?: string;
  selectedEntityId?: string | null;
  onSelectChain?: (id: string, name: string) => void;
}

export const SidebarRelationshipsList: FC<SidebarRelationshipsListProps> = ({
  filterQuery = '',
  selectedEntityId,
  onSelectChain,
}) => {
  const query = filterQuery.trim().toLowerCase();

  const visibleChains = CANONICAL_RELATIONSHIPS.filter(chain => {
    if (!query) return true;
    return (
      chain.id.toLowerCase().includes(query) ||
      chain.dealNumber.toLowerCase().includes(query) ||
      chain.name.toLowerCase().includes(query) ||
      chain.summary.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-relationships-list">
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
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Relational Chains ({visibleChains.length})
        </span>
      </div>

      {visibleChains.map(chain => {
        const isSelected = selectedEntityId === chain.id;

        return (
          <div
            key={chain.id}
            onClick={() => onSelectChain?.(chain.id, chain.name)}
            data-testid={`sidebar-chain-${chain.id}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#070D18',
              border: `1px solid ${isSelected ? '#10B981' : 'rgba(255, 255, 255, 0.05)'}`,
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
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#34D399',
                  background: 'rgba(16, 185, 129, 0.2)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                {chain.id}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#60A5FA',
                }}
              >
                {chain.nodes.length} Nodes · {chain.edges.length} Edges
              </span>
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                lineHeight: '1.2',
                marginBottom: '4px',
              }}
            >
              {chain.name}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
              }}
            >
              <span style={{ color: '#94A3B8' }}>{chain.dealNumber}</span>
              <span style={{ fontWeight: 800, color: '#34D399' }}>
                AED {chain.grossRevenueAED.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarRelationshipsList;
