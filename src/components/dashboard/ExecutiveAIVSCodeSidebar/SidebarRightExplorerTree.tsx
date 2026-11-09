/**
 * SidebarRightExplorerTree.tsx
 * White Caves Real Estate LLC - Sovereign Right Explorer Tree
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Bhakti 1-12-108 Read-Only Hierarchy Inspector
 * Law: AEG-001 (Right-Sidebar Only) & AEG-003/041 (Context Triad)
 */

import React, { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  CheckSquare,
  Home,
  Handshake,
  Search,
} from 'lucide-react';
import { useExplorerTreeData } from './SidebarRightExplorerTree.data';
import {
  TreeContainer,
  SearchBoxContainer,
  SectionCard,
  SectionHeader,
  SectionBody,
  SubgroupHeader,
  TreeItemRow,
} from './SidebarRightExplorerTree.styles';

export interface SidebarRightExplorerTreeProps {
  filterQuery?: string;
  onSelectItem?: (key: string, label: string) => void;
  activeDomain?: string;
  activeEntityId?: string;
}

export const SidebarRightExplorerTree: FC<SidebarRightExplorerTreeProps> = ({
  filterQuery: initialFilter = '',
  onSelectItem,
  activeDomain: propDomain,
  activeEntityId: propEntityId,
}) => {
  let locationPath = '';
  try {
    const loc = useLocation();
    locationPath = loc?.pathname || '';
  } catch {
    if (typeof window !== 'undefined') {
      locationPath = window.location.pathname;
    }
  }

  const [localSearch, setLocalSearch] = useState('');

  const pathParts = locationPath.replace(/^\/dashboard\/?/, '').split('/').filter(Boolean);
  const currentDomain = propDomain || pathParts[0] || 'departments';
  const currentEntityId = propEntityId || pathParts[1] || '';

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    depts: currentDomain === 'departments',
    tasks: currentDomain === 'tasks',
    properties: currentDomain === 'properties' || currentDomain === 'REproperties',
    deals: currentDomain === 'deals',
    employees: currentDomain === 'employees',
  });

  const [expandedSubgroups, setExpandedSubgroups] = useState<Record<string, boolean>>({
    'sub-dept-0': true,
  });

  const toggleSection = (key: string, defaultDomainRoute?: string) => {
    setExpandedSections(prev => {
      const willExpand = !prev[key];
      if (willExpand && defaultDomainRoute && onSelectItem) {
        onSelectItem(`route-${defaultDomainRoute}`, key);
      }
      return { ...prev, [key]: willExpand };
    });
  };

  const toggleSubgroup = (key: string) => {
    setExpandedSubgroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeQuery = (localSearch || initialFilter).toLowerCase().trim();

  const {
    filteredDepartments,
    filteredTasks,
    filteredCommunities,
    filteredDeals,
    filteredEmployees,
  } = useExplorerTreeData(activeQuery);

  return (
    <TreeContainer data-testid="right-sidebar-explorer-tree">
      <SearchBoxContainer>
        <Search size={12} color="#94A3B8" />
        <input
          type="text"
          placeholder="Filter tree (depts, tasks, properties)..."
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          data-testid="right-explorer-search-input"
        />
      </SearchBoxContainer>

      {/* ── Level 1 Major Tile: Departments & Squads ── */}
      <SectionCard data-testid="explorer-section-depts" $isCardSelected={currentDomain === 'departments'}>
        <SectionHeader
          $isExpanded={expandedSections.depts || Boolean(activeQuery)}
          $isCurrentRoute={currentDomain === 'departments' && !currentEntityId}
          onClick={() => toggleSection('depts', '/dashboard/departments')}
          data-testid="explorer-header-depts"
        >
          <div className="title-group">
            <Building2 size={13} color="#EF4444" />
            <span>Departments & Squads</span>
          </div>
          <span className="badge">{filteredDepartments.length} Depts</span>
        </SectionHeader>

        {(expandedSections.depts || Boolean(activeQuery)) && (
          <SectionBody>
            {filteredDepartments.map((dept, idx) => {
              const subKey = `sub-dept-${idx}`;
              const isDeptActive = currentDomain === 'departments' && (currentEntityId === dept.code || currentEntityId === dept.id);
              const isSubExpanded = Boolean(expandedSubgroups[subKey] || activeQuery || isDeptActive);
              return (
                <div key={dept.id}>
                  <SubgroupHeader
                    $isSubActive={isDeptActive}
                    onClick={() => toggleSubgroup(subKey)}
                    data-testid={`explorer-dept-header-${dept.code}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isSubExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      <span
                        onClick={e => {
                          e.stopPropagation();
                          onSelectItem?.(`dept-${dept.code}`, dept.name);
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Open department"
                      >
                        {dept.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#64748B' }}>{dept.supervisors.length}</span>
                  </SubgroupHeader>
                  {isSubExpanded &&
                    dept.supervisors.map(sup => (
                      <TreeItemRow
                        key={sup.id}
                        $isActive={(currentDomain === 'employees' || currentDomain === 'departments') && (currentEntityId === sup.id || currentEntityId === sup.code)}
                        data-testid={`explorer-supervisor-item-${sup.id}`}
                        onClick={() => onSelectItem?.(`emp-${sup.id}`, `${dept.name} · ${sup.name}`)}
                      >
                        <span className="item-title">🤖 {sup.name}</span>
                        <span className="item-pill">{sup.code}</span>
                      </TreeItemRow>
                    ))}
                </div>
              );
            })}
          </SectionBody>
        )}
      </SectionCard>

      {/* ── Level 1 Major Tile: Tasks & Statutory Workflows ── */}
      <SectionCard data-testid="explorer-section-tasks" $isCardSelected={currentDomain === 'tasks'}>
        <SectionHeader
          $isExpanded={expandedSections.tasks || Boolean(activeQuery)}
          $isCurrentRoute={currentDomain === 'tasks' && !currentEntityId}
          onClick={() => toggleSection('tasks', '/dashboard/tasks')}
          data-testid="explorer-header-tasks"
        >
          <div className="title-group">
            <CheckSquare size={13} color="#10B981" />
            <span>Tasks & Statutory Workflows</span>
          </div>
          <span className="badge">{filteredTasks.length} Tasks</span>
        </SectionHeader>

        {(expandedSections.tasks || Boolean(activeQuery)) && (
          <SectionBody>
            {filteredTasks.map(task => (
              <TreeItemRow
                key={task._id}
                $isActive={currentDomain === 'tasks' && (currentEntityId === task.taskCode || currentEntityId === task._id)}
                data-testid={`explorer-task-item-${task.taskCode}`}
                onClick={() => onSelectItem?.(`task-${task.taskCode}`, task.title)}
              >
                <span className="item-title">{task.title}</span>
                <span className="item-pill">{task.priority}</span>
              </TreeItemRow>
            ))}
          </SectionBody>
        )}
      </SectionCard>

      {/* ── Level 1 Major Tile: Communities & Properties ── */}
      <SectionCard
        data-testid="explorer-section-properties"
        $isCardSelected={currentDomain === 'properties' || currentDomain === 'REproperties'}
      >
        <SectionHeader
          $isExpanded={expandedSections.properties || Boolean(activeQuery)}
          $isCurrentRoute={(currentDomain === 'properties' || currentDomain === 'REproperties') && !currentEntityId}
          onClick={() => toggleSection('properties', '/dashboard/REproperties')}
          data-testid="explorer-header-properties"
        >
          <div className="title-group">
            <Home size={13} color="#8B5CF6" />
            <span>Communities & Properties</span>
          </div>
          <span className="badge">
            {Object.values(filteredCommunities).reduce((a, b) => a + b.length, 0)} Units
          </span>
        </SectionHeader>

        {(expandedSections.properties || Boolean(activeQuery)) && (
          <SectionBody>
            {Object.entries(filteredCommunities).map(([comm, props]) => {
              const subKey = `comm-${comm}`;
              const isSubExpanded = Boolean(expandedSubgroups[subKey] || activeQuery);
              return (
                <div key={comm}>
                  <SubgroupHeader onClick={() => toggleSubgroup(subKey)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isSubExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      <span>{comm}</span>
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#64748B' }}>{props.length}</span>
                  </SubgroupHeader>
                  {isSubExpanded &&
                    props.map(p => (
                      <TreeItemRow
                        key={p._id}
                        $isActive={(currentDomain === 'properties' || currentDomain === 'REproperties') && (currentEntityId === p.repropertyId || currentEntityId === p._id)}
                        data-testid={`explorer-property-item-${p.repropertyId}`}
                        onClick={() => onSelectItem?.(`prop-${p.repropertyId}`, p.title)}
                      >
                        <span className="item-title">{p.title}</span>
                        <span className="item-pill">{p.propertyType}</span>
                      </TreeItemRow>
                    ))}
                </div>
              );
            })}
          </SectionBody>
        )}
      </SectionCard>

      {/* ── Level 1 Major Tile: Deals & Revenue Milestones ── */}
      <SectionCard data-testid="explorer-section-deals" $isCardSelected={currentDomain === 'deals'}>
        <SectionHeader
          $isExpanded={expandedSections.deals || Boolean(activeQuery)}
          $isCurrentRoute={currentDomain === 'deals' && !currentEntityId}
          onClick={() => toggleSection('deals', '/dashboard/deals')}
          data-testid="explorer-header-deals"
        >
          <div className="title-group">
            <Handshake size={13} color="#F59E0B" />
            <span>Deals & Revenue Milestones</span>
          </div>
          <span className="badge">{filteredDeals.length} Deals</span>
        </SectionHeader>

        {(expandedSections.deals || Boolean(activeQuery)) && (
          <SectionBody>
            {filteredDeals.map(deal => (
              <TreeItemRow
                key={deal._id}
                $isActive={currentDomain === 'deals' && (currentEntityId === deal.dealNumber || currentEntityId === deal._id)}
                data-testid={`explorer-deal-item-${deal.dealNumber}`}
                onClick={() => onSelectItem?.(`deal-${deal.dealNumber}`, deal.title)}
              >
                <span className="item-title">{deal.title}</span>
                <span className="item-pill">{deal.status}</span>
              </TreeItemRow>
            ))}
          </SectionBody>
        )}
      </SectionCard>

      {/* ── Level 1 Major Tile: Corporate Employees Roster ── */}
      <SectionCard data-testid="explorer-section-employees" $isCardSelected={currentDomain === 'employees'}>
        <SectionHeader
          $isExpanded={expandedSections.employees || Boolean(activeQuery)}
          $isCurrentRoute={currentDomain === 'employees' && !currentEntityId}
          onClick={() => toggleSection('employees', '/dashboard/employees')}
          data-testid="explorer-header-employees"
        >
          <div className="title-group">
            <Users size={13} color="#3B82F6" />
            <span>Corporate Employees</span>
          </div>
          <span className="badge">{filteredEmployees.length} Staff</span>
        </SectionHeader>

        {(expandedSections.employees || Boolean(activeQuery)) && (
          <SectionBody>
            {filteredEmployees.map(emp => (
              <TreeItemRow
                key={emp._id}
                $isActive={currentDomain === 'employees' && (currentEntityId === emp.employeeCode || currentEntityId === emp._id)}
                data-testid={`explorer-employee-item-${emp.employeeCode}`}
                onClick={() => onSelectItem?.(`emp-${emp.employeeCode}`, emp.fullName)}
              >
                <span className="item-title">{emp.fullName}</span>
                <span className="item-pill">{emp.designation}</span>
              </TreeItemRow>
            ))}
          </SectionBody>
        )}
      </SectionCard>
    </TreeContainer>
  );
};

export default SidebarRightExplorerTree;
