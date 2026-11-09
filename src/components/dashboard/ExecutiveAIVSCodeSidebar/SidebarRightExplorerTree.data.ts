/**
 * SidebarRightExplorerTree.data.ts
 * White Caves Real Estate LLC - Data Providers for Sovereign Right Explorer Tree
 * Standard: AEGIS Single Purpose File Law (< 350 lines)
 * Optimization: Tier-0 In-Memory Hash Cache Integration (DOM-07)
 */

import { useMemo } from 'react';
import {
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
} from '../../../data/assistants108Registry.data';
import { buildCanonical200Tasks } from '../../crm/TaskManager/TaskManager.data';
import { CANONICAL_RE_PROPERTIES } from '../../crm/REPropertyManager/REPropertyManager.data';
import { CANONICAL_DEALS } from '../../crm/DealManager/DealManager.data';
import { CANONICAL_EMPLOYEES } from '../../crm/EmployeeManager/EmployeeManager.data';
import { tierZeroCache } from '../../../utils/tierZeroCache';

export function useExplorerTreeData(activeQuery: string) {
  // 1. Departments & Squads (Master Workforce Grid)
  const departments = useMemo(() => {
    const cached = tierZeroCache.get<typeof CORPORATE_DEPARTMENTS_12>('dept_master_grid');
    if (cached) return cached;

    const list = CORPORATE_DEPARTMENTS_12.map(dept => ({
      ...dept,
      supervisors: SUPERVISORS_108.filter(s => s.departmentId === dept.id),
    }));
    tierZeroCache.set('dept_master_grid', list, 300_000);
    return list;
  }, []);

  const filteredDepartments = useMemo(() => {
    if (!activeQuery) return departments;
    const cacheKey = `filtered_depts_${activeQuery}`;
    const cached = tierZeroCache.get<typeof departments>(cacheKey);
    if (cached) return cached;

    const filtered = departments
      .map(dept => {
        const deptMatches =
          dept.name?.toLowerCase().includes(activeQuery) ||
          dept.code?.toLowerCase().includes(activeQuery) ||
          dept.managerAi?.name?.toLowerCase().includes(activeQuery) ||
          dept.managerAi?.title?.toLowerCase().includes(activeQuery);
        const matchedSupervisors = dept.supervisors.filter(
          s =>
            s.name?.toLowerCase().includes(activeQuery) ||
            s.code?.toLowerCase().includes(activeQuery) ||
            s.specialty?.toLowerCase().includes(activeQuery) ||
            s.title?.toLowerCase().includes(activeQuery)
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

    tierZeroCache.set(cacheKey, filtered, 10_000);
    return filtered;
  }, [departments, activeQuery]);

  // 2. Tasks Catalog
  const allTasks = useMemo(() => {
    const cached = tierZeroCache.get<ReturnType<typeof buildCanonical200Tasks>>('tasks_catalog');
    if (cached) return cached;

    const list = buildCanonical200Tasks();
    tierZeroCache.set('tasks_catalog', list, 300_000);
    return list;
  }, []);

  const filteredTasks = useMemo(() => {
    if (!activeQuery) return allTasks.slice(0, 8);
    const cacheKey = `filtered_tasks_${activeQuery}`;
    const cached = tierZeroCache.get<typeof allTasks>(cacheKey);
    if (cached) return cached;

    const filtered = allTasks
      .filter(
        t =>
          t.title?.toLowerCase().includes(activeQuery) ||
          t.taskCode?.toLowerCase().includes(activeQuery) ||
          t.priority?.toLowerCase().includes(activeQuery)
      )
      .slice(0, 15);

    tierZeroCache.set(cacheKey, filtered, 10_000);
    return filtered;
  }, [allTasks, activeQuery]);

  // 3. Properties grouped by community
  const propertiesByCommunity = useMemo(() => {
    const cached = tierZeroCache.get<Record<string, typeof CANONICAL_RE_PROPERTIES>>('props_by_community');
    if (cached) return cached;

    const map: Record<string, typeof CANONICAL_RE_PROPERTIES> = {};
    (CANONICAL_RE_PROPERTIES || []).forEach(prop => {
      const comm = prop.location || 'Dubai Central';
      if (!map[comm]) map[comm] = [];
      map[comm].push(prop);
    });
    tierZeroCache.set('props_by_community', map, 300_000);
    return map;
  }, []);

  const filteredCommunities = useMemo(() => {
    if (!activeQuery) return propertiesByCommunity;
    const cacheKey = `filtered_comm_${activeQuery}`;
    const cached = tierZeroCache.get<Record<string, typeof CANONICAL_RE_PROPERTIES>>(cacheKey);
    if (cached) return cached;

    const filtered: Record<string, typeof CANONICAL_RE_PROPERTIES> = {};
    for (const [comm, props] of Object.entries(propertiesByCommunity)) {
      const commMatches = comm.toLowerCase().includes(activeQuery);
      const matchedProps = props.filter(
        p =>
          p.title?.toLowerCase().includes(activeQuery) ||
          p.repropertyId?.toLowerCase().includes(activeQuery) ||
          p.propertyType?.toLowerCase().includes(activeQuery)
      );
      if (commMatches) {
        filtered[comm] = props;
      } else if (matchedProps.length > 0) {
        filtered[comm] = matchedProps;
      }
    }

    tierZeroCache.set(cacheKey, filtered, 10_000);
    return filtered;
  }, [propertiesByCommunity, activeQuery]);

  // 4. Deals & Pipeline Stages
  const filteredDeals = useMemo(() => {
    const deals = CANONICAL_DEALS || [];
    if (!activeQuery) return deals.slice(0, 8);
    const cacheKey = `filtered_deals_${activeQuery}`;
    const cached = tierZeroCache.get<typeof deals>(cacheKey);
    if (cached) return cached;

    const filtered = deals
      .filter(
        d =>
          d.title?.toLowerCase().includes(activeQuery) ||
          d.dealNumber?.toLowerCase().includes(activeQuery) ||
          d.status?.toLowerCase().includes(activeQuery)
      )
      .slice(0, 15);

    tierZeroCache.set(cacheKey, filtered, 10_000);
    return filtered;
  }, [activeQuery]);

  // 5. Corporate Employees Roster
  const filteredEmployees = useMemo(() => {
    const emps = CANONICAL_EMPLOYEES || [];
    if (!activeQuery) return emps.slice(0, 8);
    const cacheKey = `filtered_emps_${activeQuery}`;
    const cached = tierZeroCache.get<typeof emps>(cacheKey);
    if (cached) return cached;

    const filtered = emps
      .filter(
        e =>
          e.fullName?.toLowerCase().includes(activeQuery) ||
          e.employeeCode?.toLowerCase().includes(activeQuery) ||
          e.designation?.toLowerCase().includes(activeQuery) ||
          e.departmentName?.toLowerCase().includes(activeQuery)
      )
      .slice(0, 15);

    tierZeroCache.set(cacheKey, filtered, 10_000);
    return filtered;
  }, [activeQuery]);

  return {
    filteredDepartments,
    filteredTasks,
    filteredCommunities,
    filteredDeals,
    filteredEmployees,
  };
}
