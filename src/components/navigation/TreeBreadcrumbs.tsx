/**
 * TreeBreadcrumbs.tsx
 * White Caves Real Estate LLC — AEGIS V5.0
 * 
 * Jack Sparrow Navigation Protocol (JSP-NAV-001)
 * Dynamic Hierarchical Breadcrumb Navigation Lineage
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTreeNavigation } from '../../context/TreeNavigationContext';

export interface TreeBreadcrumbsProps {
  className?: string;
}

export const TreeBreadcrumbs: React.FC<TreeBreadcrumbsProps> = ({ className = '' }) => {
  const { breadcrumbs, navigateTo } = useTreeNavigation();

  return (
    <nav aria-label="Hierarchy Breadcrumb" className={`flex items-center space-x-1.5 rtl:space-x-reverse text-xs ${className}`}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isLeaf = crumb.level === 'leafTask';

        return (
          <React.Fragment key={crumb.id}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 rtl:rotate-180 flex-shrink-0" />
            )}
            <button
              type="button"
              onClick={() => {
                if (!isLast) {
                  navigateTo({
                    floor: crumb.floor,
                    deptCode: crumb.deptCode,
                    groupId: crumb.groupId,
                    entityId: crumb.entityId,
                    leafTaskId: crumb.leafTaskId
                  });
                }
              }}
              disabled={isLast}
              className={`flex items-center py-1 px-1.5 rounded transition-colors duration-150 ${
                isLast
                  ? isLeaf
                    ? 'text-[#D4AF37] font-semibold bg-amber-950/20 cursor-default'
                    : 'text-white font-medium cursor-default'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer'
              }`}
              aria-current={isLast ? 'location' : undefined}
            >
              <span className="truncate max-w-[140px]">{crumb.label}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default TreeBreadcrumbs;
