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

import React, { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { FocusProps } from '../../../hooks/navigation/useKeyboardNavigation';
import SidebarNavItem from './SidebarNavItem';
import { TreeNode, TreeNodeChildren } from './styles';

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
  expandedDepts: Record<string, boolean>;
  onToggleDept: (deptId: string, shouldExpand?: boolean) => void;
  getFocusProps?: (itemId: string) => FocusProps | undefined;
  onItemKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

const SidebarTree: React.FC<SidebarTreeProps> = ({
  departments,
  selectedDept,
  selectedService,
  onDeptClick,
  onServiceClick,
  expandedDepts,
  onToggleDept,
  getFocusProps,
  onItemKeyDown,
}) => {
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
            onExpand={(shouldExpand) => onToggleDept(dept.id, shouldExpand)}
            onKeyDown={onItemKeyDown}
            focusProps={getFocusProps?.(`dept-${dept.id}`)}
            buttonRole="treeitem"
            ariaLevel={1}
            ariaExpanded={isExpanded}
            ariaSelected={isActive}
            ariaControls={`dept-group-${dept.id}`}
          />

          <TreeNodeChildren $expanded={isExpanded} id={`dept-group-${dept.id}`} role="group">
            {dept.services.map((service) => {
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
                  onKeyDown={onItemKeyDown}
                  focusProps={getFocusProps?.(`service-${dept.id}-${service.id}`)}
                  buttonRole="treeitem"
                  ariaLevel={2}
                  ariaSelected={isActiveSvc}
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
  }, [departments, expandedDepts, selectedDept, selectedService, onDeptClick, onServiceClick, onToggleDept, getFocusProps, onItemKeyDown]);

  return <div role="tree" aria-label="Company departments tree">{deptNodes}</div>;
};

export default SidebarTree;
