/**
 * SidebarErmsEntitiesSubList.tsx
 * White Caves Real Estate LLC - Entities Hierarchy Sub-Tree in Left Sidebar
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { ArrowRight } from 'lucide-react';
import type { EntityNode } from '../../crm/RelationshipManager/RelationshipManager.types';

export interface SidebarErmsEntitiesSubListProps {
  entities: EntityNode[];
  selectedEntityId?: string | null;
  onSelectEntity?: (id: string, name: string) => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarErmsEntitiesSubList: FC<SidebarErmsEntitiesSubListProps> = ({
  entities,
  selectedEntityId,
  onSelectEntity,
  onNavigateToView,
}) => {
  return (
    <div
      style={{ paddingLeft: '4px', marginTop: '6px' }}
      data-testid="sidebar-erms-entities-sublist"
    >
      <div
        onClick={() => onNavigateToView?.('/dashboard/erms/entities')}
        style={{
          fontSize: '0.68rem',
          color: '#60A5FA',
          padding: '4px 8px',
          cursor: 'pointer',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
        data-testid="link-all-entities-hub"
      >
        📑 Open All Entities Hub (CRUD) <ArrowRight size={11} />
      </div>

      {entities.map(entity => {
        const isSelected = selectedEntityId === entity.id;
        return (
          <div
            key={entity.id}
            onClick={() => {
              onSelectEntity?.(entity.id, entity.name);
              onNavigateToView?.(`/dashboard/erms/entities/${entity.id}`);
            }}
            data-testid={`sidebar-entity-${entity.id}`}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              background: isSelected ? 'rgba(56, 189, 248, 0.18)' : '#070D18',
              border: `1px solid ${isSelected ? '#38BDF8' : 'rgba(255, 255, 255, 0.05)'}`,
              marginBottom: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginRight: '6px',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: isSelected ? '#FFFFFF' : '#E2E8F0',
                }}
              >
                {entity.name}
              </div>
              <span style={{ fontSize: '0.60rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                {entity.id}
              </span>
            </div>
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '3px',
                background: 'rgba(255,255,255,0.06)',
                color: '#94A3B8',
              }}
            >
              {entity.type}
            </span>
          </div>
        );
      })}
    </div>
  );
};
