/**
 * SidebarRightExplorerTree.tsx
 * White Caves Real Estate LLC - Sovereign Right Explorer Tree
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Bhakti 1-12-108 Read-Only Hierarchy Inspector
 * Law: AEG-001 (Right-Sidebar Only) & AEG-003/041 (Context Triad)
 */

import React, { FC, useState, useMemo } from 'react';
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
import {
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
} from '../../../data/assistants108Registry.data';
import { buildCanonical200Tasks } from '../../crm/TaskManager/TaskManager.data';
import { CANONICAL_RE_PROPERTIES } from '../../crm/REPropertyManager/REPropertyManager.data';
import { CANONICAL_DEALS } from '../../crm/DealManager/DealManager.data';
import { CANONICAL_EMPLOYEES } from '../../crm/EmployeeManager/EmployeeManager.data';
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
}

export const SidebarRightExplorerTree: FC<SidebarRightExplorerTreeProps> = ({
  filterQuery: initialFilter = '',
  onSelectItem,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    depts: true,
    tasks: false,
    properties: false,
    deals: false,
    employees: false,
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

  const activeQuery = (localSearch || initialFilter).toLowerCase().trim();

  // 1. Departments & Squads (Master Workforce Grid)
  const departments = useMemo(() => {
    return CORPORATE_DEPARTMENTS_12.map(dept => ({
      ...dept,
      supervisors: SUPERVISORS_108.filter(s => s.departmentId === dept.id),
    }));
  }, []);

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    if (!activeQuery) return departments;
    return departments
      .map(dept => {
        const deptMatches =
          dept.name.toLowerCase().includes(activeQuery) ||
          dept.code.toLowerCase().includes(activeQuery) ||
          dept.manager.toLowerCase().includes(activeQuery);
        const matchedSupervisors = dept.supervisors.filter(
          s =>
            s.name.toLowerCase().includes(activeQuery) ||
            s.code.toLowerCase().includes(activeQuery) ||
            s.specialty.toLowerCase().includes(activeQuery)
        );
        if (deptMatches || matchedSupervisors.length > 0) {
          return {
            ...dept,
            supervisors: deptMatches ? dept.supervisors : matchedSupervisors,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof departments;
  }, [departments, activeQuery]);

  // 2. Tasks Catalog
  const allTasks = useMemo(() => buildCanonical200Tasks(), []);
  const filteredTasks = useMemo(() => {
    if (!activeQuery) return allTasks.slice(0, 8);
    return allTasks
      .filter(
        t =>
          t.title.toLowerCase().includes(activeQuery) ||
          t.taskCode.toLowerCase().includes(activeQuery) ||
          t.priority.toLowerCase().includes(activeQuery)
      )
      .slice(0, 15);
  }, [allTasks, activeQuery]);

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

  const filteredCommunities = useMemo(() => {
    if (!activeQuery) return propertiesByCommunity;
    const filtered: Record<string, typeof CANONICAL_RE_PROPERTIES> = {};
    for (const [comm, props] of Object.entries(propertiesByCommunity)) {
      const commMatches = comm.toLowerCase().includes(activeQuery);
      const matchedProps = props.filter(
        p =>
          p.title.toLowerCase().includes(activeQuery) ||
          p.repropertyId.toLowerCase().includes(activeQuery) ||
          p.propertyType.toLowerCase().includes(activeQuery)
      );
      if (commMatches) {
        filtered[comm] = props;
      } else if (matchedProps.length > 0) {
        filtered[comm] = matchedProps;
      }
    }
    return filtered;
  }, [propertiesByCommunity, activeQuery]);

  // 4. Deals & Pipeline Stages
  const filteredDeals = useMemo(() => {
    const deals = CANONICAL_DEALS || [];
    if (!activeQuery) return deals.slice(0, 8);
    return deals
      .filter(
        d =>
          d.title.toLowerCase().includes(activeQuery) ||
          d.dealNumber.toLowerCase().includes(activeQuery) ||
          d.status.toLowerCase().includes(activeQuery)
      )
      .slice(0, 15);
  }, [activeQuery]);

  // 5. Corporate Employees Roster
  const filteredEmployees = useMemo(() => {
    const emps = CANONICAL_EMPLOYEES || [];
    if (!activeQuery) return emps.slice(0, 8);
    return emps
      .filter(
        e =>
          e.fullName.toLowerCase().includes(activeQuery) ||
          e.employeeCode.toLowerCase().includes(activeQuery) ||
          e.designation.toLowerCase().includes(activeQuery) ||
          e.departmentName.toLowerCase().includes(activeQuery)
      )
      .slice(0, 15);
  }, [activeQuery]);

  return (
    <TreeContainer data-testid="right-sidebar-explorer-tree">
      {/* ── Real-Time Tree Filter Input ── */}
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

      {/* ── Hierarchy 1: 1-12-108 Departments & Squads ── */}
      <SectionCard data-testid="explorer-section-depts">
        <SectionHeader
          $isExpanded={expandedSections.depts || Boolean(activeQuery)}
          onClick={() => toggleSection('depts')}
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
              const isSubExpanded = Boolean(expandedSubgroups[subKey] || activeQuery);
              return (
                <div key={dept.id}>
                  <SubgroupHeader
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
                    <span style={{ fontSize: '0.62rem', color: '#64748B' }}>
                      {dept.supervisors.length}
                    </span>
                  </SubgroupHeader>
                  {isSubExpanded &&
                    dept.supervisors.map(sup => (
                      <TreeItemRow
                        key={sup.id}
                        data-testid={`explorer-supervisor-item-${sup.id}`}
                        onClick={() =>
                          onSelectItem?.(`emp-${sup.id}`, `${dept.name} · ${sup.name}`)
                        }
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

      {/* ── Hierarchy 2: Tasks & Statutory Workflows ── */}
      <SectionCard data-testid="explorer-section-tasks">
        <SectionHeader
          $isExpanded={expandedSections.tasks || Boolean(activeQuery)}
          onClick={() => toggleSection('tasks')}
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

      {/* ── Hierarchy 3: Communities & Properties ── */}
      <SectionCard data-testid="explorer-section-properties">
        <SectionHeader
          $isExpanded={expandedSections.properties || Boolean(activeQuery)}
          onClick={() => toggleSection('properties')}
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

      {/* ── Hierarchy 4: Deals & Revenue Milestones ── */}
      <SectionCard data-testid="explorer-section-deals">
        <SectionHeader
          $isExpanded={expandedSections.deals || Boolean(activeQuery)}
          onClick={() => toggleSection('deals')}
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

      {/* ── Hierarchy 5: Corporate Employees Roster ── */}
      <SectionCard data-testid="explorer-section-employees">
        <SectionHeader
          $isExpanded={expandedSections.employees || Boolean(activeQuery)}
          onClick={() => toggleSection('employees')}
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
