/**
 * White Caves Real Estate LLC - Sovereign Real Estate Inventory Sidebar List
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Home, Building2, MapPin, Tag } from 'lucide-react';
import { CANONICAL_RE_PROPERTIES } from '../../crm/REPropertyManager/REPropertyManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

interface SidebarREPropertiesListProps {
  filterQuery?: string;
  selectedPropertyId?: string | null;
  onSelectProperty?: (id: string, title: string) => void;
  onOpenCreate?: () => void;
}

export const SidebarREPropertiesList: FC<SidebarREPropertiesListProps> = ({
  filterQuery = '',
  selectedPropertyId,
  onSelectProperty,
  onOpenCreate,
}) => {
  const query = filterQuery.trim().toLowerCase();

  const visibleProperties = CANONICAL_RE_PROPERTIES.filter(prop => {
    if (!query) return true;
    const propId = prop.repropertyId || prop._id;
    return (
      propId.toLowerCase().includes(query) ||
      prop.title.toLowerCase().includes(query) ||
      prop.location.toLowerCase().includes(query) ||
      prop.propertyType.toLowerCase().includes(query) ||
      prop.trakheesiPermit.toLowerCase().includes(query) ||
      prop.status.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-reproperties-list">
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
            color: '#8B5CF6',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Active Inventory ({visibleProperties.length})
        </span>
        {onOpenCreate && (
          <button
            onClick={onOpenCreate}
            data-testid="sidebar-add-property-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#A78BFA',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>+ Unit</span>
          </button>
        )}
      </div>

      {visibleProperties.map(prop => {
        const propId = prop.repropertyId || prop._id;
        const isSelected = selectedPropertyId === propId;
        const statusColors: Record<string, { bg: string; text: string }> = {
          AVAILABLE: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399' },
          UNDER_OFFER: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24' },
          RESERVED: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA' },
          SOLD: { bg: 'rgba(139, 92, 246, 0.15)', text: '#C084FC' },
          LEASED: { bg: 'rgba(236, 72, 153, 0.15)', text: '#F472B6' },
          OFF_MARKET: { bg: 'rgba(100, 116, 139, 0.15)', text: '#94A3B8' },
        };
        const statusStyle = statusColors[prop.status] || {
          bg: 'rgba(255,255,255,0.08)',
          text: '#94A3B8',
        };

        return (
          <div
            key={prop._id}
            onClick={() => onSelectProperty?.(propId, prop.title)}
            data-testid={`sidebar-prop-${propId}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(139, 92, 246, 0.15)' : '#070D18',
              border: `1px solid ${isSelected ? '#8B5CF6' : 'rgba(255, 255, 255, 0.05)'}`,
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
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {propId}
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
                  {prop.purpose}
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
                {prop.status.replace('_', ' ')}
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
              title={prop.title}
            >
              {prop.title}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
              }}
            >
              <span
                style={{
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <MapPin size={10} color="#EF4444" />
                {prop.location}
              </span>
              <span style={{ fontWeight: 800, color: '#38BDF8' }}>
                AED {(prop.priceAED / 1_000_000).toFixed(1)}M
              </span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarREPropertiesList;
