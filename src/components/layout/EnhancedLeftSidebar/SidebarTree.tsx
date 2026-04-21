/**
 * SidebarTree — Hierarchical tree navigation (departments + services)
 *
 * Structure:
 *  - Department (parent, expandable)
 *    - Service 1
 *    - Service 2
 *    - Service N
 *
 * Collapse state persisted to localStorage
 */

import React, { useCallback, useState, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';
import { TreeNode, TreeNodeHeader, TreeNodeChildren } from './styles';

export interface DepartmentTreeNode {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  services: ServiceTreeNode[];
  badge?: number;
  badgeColor?: string;
}

export interface ServiceTreeNode {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface SidebarTreeProps {
  departments: DepartmentTreeNode[];
  selectedDept?: string;
  selectedService?: string;
  onDeptClick?: (deptId: string) => void;
  onServiceClick?: (deptId: string, serviceId: string) => void;
  storageKey?: string;
}

const STORAGE_KEY_PREFIX = 'wc-sidebar-expand-';

const SidebarTree: React.FC<SidebarTreeProps> = ({
  departments,
  selectedDept,
  selectedService,
  onDeptClick,
  onServiceClick,
  storageKey = '__default__',
}) => {
  // Load initial expand state from localStorage
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>(() => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${storageKey}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load sidebar expand state', e);
    }
    // Default: all expanded
    return departments.reduce((acc, dept) => ({ ...acc, [dept.id]: true }), {});
  });

  // Persist expand state to localStorage
  const saveExpandState = useCallback((state: Record<string, boolean>) => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${storageKey}`;
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save sidebar expand state', e);
    }
  }, [storageKey]);

  const toggleDeptExpand = useCallback((deptId: string) => {
    setExpandedDepts(prev => {
      const next = { ...prev, [deptId]: !prev[deptId] };
      saveExpandState(next);
      return next;
    });
  }, [saveExpandState]);

  // Memoize tree render to avoid unnecessary re-renders
  const deptNodes = useMemo(() => {
    return departments.map(dept => {
      const isExpanded = expandedDepts[dept.id] !== false; // default true
      const isActive = selectedDept === dept.id;

      return (
        <TreeNode key={dept.id}>
          <SidebarNavItem
            id={`dept-${dept.id}`}
            icon={dept.icon}
            label={dept.label}
            active={isActive}
            color={dept.color}
            badge={dept.badge}
            badgeColor={dept.badgeColor}
            expandable={true}
            expanded={isExpanded}
            onClick={() => onDeptClick?.(dept.id)}
            onExpand={() => toggleDeptExpand(dept.id)}
          />

          <TreeNodeChildren expanded={isExpanded}>
            {dept.services.map((service, idx) => {
              const isActiveSvc =
                selectedDept === dept.id && selectedService === service.id;

              return (
                <SidebarNavItem
                  key={service.id}
                  id={`service-${dept.id}-${service.id}`}
                  label={service.label}
                  active={isActiveSvc}
                  color={dept.color}
                  depth={1}
                  onClick={() => {
                    onServiceClick?.(dept.id, service.id);
                    service.onClick?.();
                  }}
                />
              );
            })}
          </TreeNodeChildren>
        </TreeNode>
      );
    });
  }, [departments, expandedDepts, selectedDept, selectedService, onDeptClick, onServiceClick, toggleDeptExpand]);

  return <>{deptNodes}</>;
};

export default SidebarTree;
