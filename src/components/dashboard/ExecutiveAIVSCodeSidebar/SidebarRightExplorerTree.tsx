/**
 * SidebarRightExplorerTree.tsx
 * White Caves Real Estate LLC - Sovereign Right Explorer Tree
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Bhakti 1-12-108 Read-Only Hierarchy Inspector
 */

import React, { FC, useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  CheckSquare,
  Home,
  Handshake,
  Crown,
  Search,
} from 'lucide-react';
import {
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
} from '../../../data/assistants108Registry.data';
import { buildCanonical200Tasks } from '../../crm/TaskManager/TaskManager.data';
import { CANONICAL_RE_PROPERTIES } from '../../crm/REPropertyManager/REPropertyManager.data';
import { CANONICAL_DEALS } from '../../crm/DealManager/DealManager.data';

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 8px 12px 24px 12px;
  gap: 8px;
  background: #070d18;
  color: #e2e8f0;
  font-family:
    'Plus Jakarta Sans',
    -apple-system,
    sans-serif;
`;

const SectionCard = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.6);
  overflow: hidden;
`;

const SectionHeader = styled.button<{ $isExpanded: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${props => (props.$isExpanded ? 'rgba(239, 68, 68, 0.08)' : 'transparent')};
  border: none;
  cursor: pointer;
  color: #f1f5f9;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    font-size: 0.62rem;
    padding: 2px 6px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    color: #94a3b8;
  }
`;

const SectionBody = styled.div`
  padding: 4px 8px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
`;

const SubgroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 600;
  color: #cbd5e1;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    color: #ffffff;
  }
`;

const TreeItemRow = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px 5px 22px;
  border-radius: 4px;
  font-size: 0.7rem;
  color: ${props => (props.$isActive ? '#ef4444' : '#94a3b8')};
  background: ${props => (props.$isActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent')};
  cursor: pointer;
  transition: background 0.12s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f1f5f9;
  }

  .item-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 170px;
  }

  .item-pill {
    font-size: 0.6rem;
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    color: #64748b;
  }
`;

export interface SidebarRightExplorerTreeProps {
  filterQuery?: string;
  onSelectItem?: (key: string, label: string) => void;
}

export const SidebarRightExplorerTree: FC<SidebarRightExplorerTreeProps> = ({
  filterQuery = '',
  onSelectItem,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    depts: true,
    tasks: false,
    properties: false,
    deals: false,
  });

  const [expandedSubgroups, setExpandedSubgroups] = useState<Record<string, boolean>>({
    'sub-dept-0': true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubgroup = (key: string) => {
    setExpandedSubgroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const query = filterQuery.toLowerCase().trim();

  // 1. Departments & Squads Hierarchy
  const departments = useMemo(() => {
    return CORPORATE_DEPARTMENTS_12.map(dept => ({
      ...dept,
      supervisors: SUPERVISORS_108.filter(s => s.departmentId === dept.id),
    }));
  }, []);

  // 2. Tasks Catalog
  const tasks = useMemo(() => buildCanonical200Tasks(), []);

  // 3. Properties grouped by community
  const propertiesByCommunity = useMemo(() => {
    const map: Record<string, typeof CANONICAL_RE_PROPERTIES> = {};
    (CANONICAL_RE_PROPERTIES || []).forEach(prop => {
      const comm = prop.location || 'Dubai Central';
      if (!map[comm]) map[comm] = [];
      map[comm].push(prop);
    });
    return map;
  }, []);

  return (
    <TreeContainer data-testid="right-sidebar-explorer-tree">
      {/* ── Hierarchy 1: 1-12-108 Departments & Squads ── */}
      <SectionCard>
        <SectionHeader $isExpanded={expandedSections.depts} onClick={() => toggleSection('depts')}>
          <div className="title-group">
            <Building2 size={13} color="#EF4444" />
            <span>Departments & Squads</span>
          </div>
          <span className="badge">12 Depts</span>
        </SectionHeader>

        {expandedSections.depts && (
          <SectionBody>
            {departments.slice(0, 6).map((dept, idx) => {
              const subKey = `sub-dept-${idx}`;
              const isSubExpanded = !!expandedSubgroups[subKey];
              return (
                <div key={dept.id}>
                  <SubgroupHeader onClick={() => toggleSubgroup(subKey)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isSubExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      <span>{dept.name}</span>
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#64748B' }}>
                      {dept.supervisors.length}
                    </span>
                  </SubgroupHeader>
                  {isSubExpanded &&
                    dept.supervisors.slice(0, 4).map(sup => (
                      <TreeItemRow
                        key={sup.id}
                        onClick={() =>
                          onSelectItem?.(`emp-${sup.id}`, `${dept.name} · ${sup.name}`)
                        }
                      >
                        <span className="item-title">🤖 {sup.name}</span>
                        <span className="item-pill">L3</span>
                      </TreeItemRow>
                    ))}
                </div>
              );
            })}
          </SectionBody>
        )}
      </SectionCard>

      {/* ── Hierarchy 2: Tasks & Sub-Tasks ── */}
      <SectionCard>
        <SectionHeader $isExpanded={expandedSections.tasks} onClick={() => toggleSection('tasks')}>
          <div className="title-group">
            <CheckSquare size={13} color="#10B981" />
            <span>Tasks & Statutory Workflows</span>
          </div>
          <span className="badge">{tasks.length} Tasks</span>
        </SectionHeader>

        {expandedSections.tasks && (
          <SectionBody>
            {tasks.slice(0, 8).map(task => (
              <TreeItemRow
                key={task._id}
                onClick={() => onSelectItem?.(`task-${task.taskCode}`, task.title)}
              >
                <span className="item-title">{task.title}</span>
                <span className="item-pill">{task.priority}</span>
              </TreeItemRow>
            ))}
          </SectionBody>
        )}
      </SectionCard>

      {/* ── Hierarchy 3: Communities & Units ── */}
      <SectionCard>
        <SectionHeader
          $isExpanded={expandedSections.properties}
          onClick={() => toggleSection('properties')}
        >
          <div className="title-group">
            <Home size={13} color="#8B5CF6" />
            <span>Communities & Properties</span>
          </div>
          <span className="badge">{(CANONICAL_RE_PROPERTIES || []).length} Units</span>
        </SectionHeader>

        {expandedSections.properties && (
          <SectionBody>
            {Object.entries(propertiesByCommunity).map(([comm, props]) => (
              <div key={comm}>
                <SubgroupHeader onClick={() => toggleSubgroup(`comm-${comm}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ChevronRight size={12} />
                    <span>{comm}</span>
                  </div>
                  <span style={{ fontSize: '0.62rem', color: '#64748B' }}>{props.length}</span>
                </SubgroupHeader>
                {props.slice(0, 3).map(p => (
                  <TreeItemRow
                    key={p._id}
                    onClick={() => onSelectItem?.(`prop-${p.repropertyId}`, p.title)}
                  >
                    <span className="item-title">{p.title}</span>
                    <span className="item-pill">{p.propertyType}</span>
                  </TreeItemRow>
                ))}
              </div>
            ))}
          </SectionBody>
        )}
      </SectionCard>

      {/* ── Hierarchy 4: Deals & Pipeline Stages ── */}
      <SectionCard>
        <SectionHeader $isExpanded={expandedSections.deals} onClick={() => toggleSection('deals')}>
          <div className="title-group">
            <Handshake size={13} color="#F59E0B" />
            <span>Deals & Revenue Milestones</span>
          </div>
          <span className="badge">{(CANONICAL_DEALS || []).length} Deals</span>
        </SectionHeader>

        {expandedSections.deals && (
          <SectionBody>
            {(CANONICAL_DEALS || []).slice(0, 6).map(deal => (
              <TreeItemRow
                key={deal._id}
                onClick={() => onSelectItem?.(`deal-${deal.dealNumber}`, deal.title)}
              >
                <span className="item-title">{deal.title}</span>
                <span className="item-pill">{deal.status}</span>
              </TreeItemRow>
            ))}
          </SectionBody>
        )}
      </SectionCard>
    </TreeContainer>
  );
};

export default SidebarRightExplorerTree;
