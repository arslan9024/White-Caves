/**
 * SidebarRelationshipsList.tsx
 * White Caves Real Estate LLC - ERMS Left Sidebar Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Double-Layer Routing & Proper Unique IDs
 */

import React, { FC, useState } from 'react';
import { Database, GitFork, ChevronDown, ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { CANONICAL_RELATIONSHIPS } from '../../crm/RelationshipManager/RelationshipManager.data';
import { CANONICAL_ALL_ENTITIES } from '../../crm/RelationshipManager/RelationshipEntities.data';
import { CANONICAL_ERD_RELATIONS } from '../../crm/RelationshipManager/RelationshipErd.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

export interface SidebarRelationshipsListProps {
  filterQuery?: string;
  selectedEntityId?: string | null;
  onSelectChain?: (id: string, name: string) => void;
  onSelectEntity?: (id: string, name: string) => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarRelationshipsList: FC<SidebarRelationshipsListProps> = ({
  filterQuery = '',
  selectedEntityId,
  onSelectChain,
  onSelectEntity,
  onNavigateToView,
}) => {
  const [entitiesOpen, setEntitiesOpen] = useState(true);
  const [relationsOpen, setRelationsOpen] = useState(true);

  const query = filterQuery.trim().toLowerCase();

  const filteredEntities = CANONICAL_ALL_ENTITIES.filter(entity => {
    if (!query) return true;
    return (
      entity.id.toLowerCase().includes(query) ||
      entity.name.toLowerCase().includes(query) ||
      entity.type.toLowerCase().includes(query) ||
      entity.description.toLowerCase().includes(query)
    );
  });

  const filteredChains = CANONICAL_RELATIONSHIPS.filter(chain => {
    if (!query) return true;
    return (
      chain.id.toLowerCase().includes(query) ||
      chain.dealNumber.toLowerCase().includes(query) ||
      chain.name.toLowerCase().includes(query)
    );
  });

  const filteredEdges = CANONICAL_ERD_RELATIONS.filter(rel => {
    if (!query) return true;
    return (
      rel.id.toLowerCase().includes(query) ||
      rel.from.toLowerCase().includes(query) ||
      rel.to.toLowerCase().includes(query) ||
      rel.label.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-relationships-list">
      {/* ── Section 1: Entities Master Registry (CRUD) ───────────────── */}
      <div style={{ marginBottom: '14px' }}>
        <div
          onClick={() => setEntitiesOpen(!entitiesOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',
            cursor: 'pointer',
            borderRadius: '6px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
          data-testid="toggle-entities-folder"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {entitiesOpen ? (
              <ChevronDown size={14} color="#10B981" />
            ) : (
              <ChevronRight size={14} color="#10B981" />
            )}
            <Database size={13} color="#10B981" />
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#34D399',
                textTransform: 'uppercase',
              }}
            >
              Entities Registry
            </span>
          </div>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              color: '#10B981',
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '1px 6px',
              borderRadius: '4px',
            }}
          >
            {filteredEntities.length}
          </span>
        </div>

        {entitiesOpen && (
          <div style={{ paddingLeft: '4px', marginTop: '6px' }}>
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

            {filteredEntities.map(entity => {
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
                    <span
                      style={{ fontSize: '0.60rem', color: '#94A3B8', fontFamily: 'monospace' }}
                    >
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
        )}
      </div>

      {/* ── Section 2: Relational Chains & Direct Edges ─────────────── */}
      <div>
        <div
          onClick={() => setRelationsOpen(!relationsOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',
            cursor: 'pointer',
            borderRadius: '6px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
          }}
          data-testid="toggle-relationships-folder"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {relationsOpen ? (
              <ChevronDown size={14} color="#38BDF8" />
            ) : (
              <ChevronRight size={14} color="#38BDF8" />
            )}
            <GitFork size={13} color="#38BDF8" />
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#38BDF8',
                textTransform: 'uppercase',
              }}
            >
              Relational Edges
            </span>
          </div>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              color: '#38BDF8',
              background: 'rgba(56, 189, 248, 0.2)',
              padding: '1px 6px',
              borderRadius: '4px',
            }}
          >
            {filteredChains.length + filteredEdges.length}
          </span>
        </div>

        {relationsOpen && (
          <div style={{ paddingLeft: '4px', marginTop: '6px' }}>
            <div
              onClick={() => onNavigateToView?.('/dashboard/erms/relationships')}
              style={{
                fontSize: '0.68rem',
                color: '#34D399',
                padding: '4px 8px',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              data-testid="link-all-relationships-matrix"
            >
              🔗 Open Full Relational Matrix <ArrowRight size={11} />
            </div>

            {/* Binary ERD Links */}
            {filteredEdges.map(rel => {
              const isSelected = selectedEntityId === rel.id;
              return (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectChain?.(rel.id, `${rel.from} -> ${rel.to}`);
                    onNavigateToView?.(`/dashboard/erms/relationships/${rel.id}`);
                  }}
                  data-testid={`sidebar-edge-${rel.id}`}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(168, 85, 247, 0.18)' : '#070D18',
                    border: `1px solid ${isSelected ? '#A855F7' : 'rgba(255, 255, 255, 0.05)'}`,
                    marginBottom: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: '#C084FC',
                        fontFamily: 'monospace',
                      }}
                    >
                      {rel.id}
                    </span>
                    <span
                      style={{
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        color: rel.type === 'COMPOSITION' ? '#F59E0B' : '#64748B',
                      }}
                    >
                      {rel.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#E2E8F0' }}>
                    {rel.from} → {rel.to}
                  </div>
                </div>
              );
            })}

            {/* Macro Pipeline Chains */}
            {filteredChains.map(chain => {
              const isSelected = selectedEntityId === chain.id;
              return (
                <div
                  key={chain.id}
                  onClick={() => {
                    onSelectChain?.(chain.id, chain.name);
                    onNavigateToView?.(`/dashboard/erms/relationships/${chain.id}`);
                  }}
                  data-testid={`sidebar-chain-${chain.id}`}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#070D18',
                    border: `1px solid ${isSelected ? '#10B981' : 'rgba(255, 255, 255, 0.05)'}`,
                    marginBottom: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: '#34D399',
                        fontFamily: 'monospace',
                      }}
                    >
                      {chain.id}
                    </span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#34D399' }}>
                      AED {chain.grossRevenueAED.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#CBD5E1',
                      marginTop: '2px',
                    }}
                  >
                    {chain.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SidebarListWrapper>
  );
};

export default SidebarRelationshipsList;
