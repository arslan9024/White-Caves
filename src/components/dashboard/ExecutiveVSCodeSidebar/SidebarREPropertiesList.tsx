/**
 * SidebarREPropertiesList.tsx
 * White Caves Real Estate LLC - Real Estate Properties Left Sidebar Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Double-Layer Routing
 */

import React, { FC } from 'react';
import { Home, Building2, MapPin, Tag, ArrowRight, Plus } from 'lucide-react';
import { CANONICAL_RE_PROPERTIES } from '../../crm/REPropertyManager/REPropertyManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

export interface SidebarREPropertiesListProps {
  filterQuery?: string;
  selectedPropertyId?: string | null;
  onSelectProperty?: (id: string, title: string) => void;
  onOpenCreate?: () => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarREPropertiesList: FC<SidebarREPropertiesListProps> = ({
  filterQuery = '',
  selectedPropertyId,
  onSelectProperty,
  onOpenCreate,
  onNavigateToView,
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
      {/* ── Level 1 Category Portals ─────────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        <div
          onClick={() => onNavigateToView?.('/dashboard/REproperties/inventory')}
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
          data-testid="link-all-props-inventory"
        >
          🏢 Open Inventory Grid (CRUD) <ArrowRight size={11} />
        </div>
        <div
          onClick={() => onNavigateToView?.('/dashboard/REproperties/clusters')}
          style={{
            fontSize: '0.68rem',
            color: '#38BDF8',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
          data-testid="link-props-clusters"
        >
          📍 Prime Dubai Clusters <ArrowRight size={11} />
        </div>
      </div>

      {/* Header bar with Count and Add Property action */}
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
            <Plus size={12} />
            <span>List Unit</span>
          </button>
        )}
      </div>

      {/* ── Level 2 Sub-Items: Properties with Turing IDs ─────────────── */}
      {visibleProperties.map(prop => {
        const propId = prop.repropertyId || prop._id;
        const isSelected = selectedPropertyId === propId || selectedPropertyId === prop._id;
        return (
          <div
            key={propId}
            onClick={() => {
              onSelectProperty?.(propId, prop.title);
              onNavigateToView?.(`/dashboard/REproperties/${propId}`);
            }}
            data-testid={`sidebar-prop-${propId}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(139, 92, 246, 0.15)' : '#070D18',
              border: isSelected ? '1px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.05)',
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
                {propId}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: prop.status === 'AVAILABLE' ? '#10B981' : '#F59E0B',
                }}
              >
                {prop.status}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC' }}>
              {prop.title}
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={11} /> {prop.location}
              </span>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>
                AED {(prop.priceAED / 1_000_000).toFixed(2)}M
              </span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarREPropertiesList;
