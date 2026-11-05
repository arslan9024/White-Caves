/**
 * White Caves Real Estate LLC - Sovereign Explorer Tree Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { ChevronRight, Crown, Sparkles, Zap, Building2 } from 'lucide-react';
import {
  TreeScrollArea,
  FolderNode,
  FolderHeaderBtn,
  FolderChildrenList,
  TreeLeafItem,
} from './ExecutiveVSCodeSidebar.styles';

interface DepartmentWithSupervisors {
  id: string;
  name: string;
  order?: number;
  supervisors: Array<{
    id: string;
    name: string;
  }>;
}

interface SidebarExplorerTreeProps {
  departments: DepartmentWithSupervisors[];
  expandedFolders: Record<string, boolean>;
  activeItemKey: string;
  toggleFolder: (key: string) => void;
  onLeafClick: (key: string, label: string) => void;
}

export const SidebarExplorerTree: FC<SidebarExplorerTreeProps> = ({
  departments,
  expandedFolders,
  activeItemKey,
  toggleFolder,
  onLeafClick,
}) => {
  return (
    <TreeScrollArea>
      {/* MD Sovereign Founder Section */}
      <FolderNode>
        <FolderHeaderBtn
          $isExpanded={expandedFolders['md-hub']}
          $isSpecial={true}
          onClick={() => toggleFolder('md-hub')}
        >
          <span className="caret">
            <ChevronRight size={13} />
          </span>
          <Crown size={14} color="#EF4444" />
          <span className="label">Managing Director Hub</span>
          <span className="badge">L5</span>
        </FolderHeaderBtn>

        {expandedFolders['md-hub'] && (
          <FolderChildrenList>
            <TreeLeafItem
              $isActive={activeItemKey === 'morning-briefing'}
              onClick={() => onLeafClick('morning-briefing', 'Morning Executive Briefing')}
            >
              <Sparkles size={12} color="#EF4444" />
              <span>Morning Briefing</span>
              <span className="sla-pill">08:00</span>
            </TreeLeafItem>
            <TreeLeafItem
              $isActive={activeItemKey === 'escrow-oversight'}
              onClick={() => onLeafClick('escrow-oversight', 'DLD Escrow Accounts Oversight')}
            >
              <Zap size={12} color="#10B981" />
              <span>Escrow Oversight</span>
              <span className="sla-pill">AED 42M</span>
            </TreeLeafItem>
            <TreeLeafItem
              $isActive={activeItemKey === 'departments-crud'}
              onClick={() => onLeafClick('departments-crud', 'Corporate Departments Management')}
            >
              <Building2 size={12} color="#3B82F6" />
              <span>Departments CRUD</span>
              <span className="sla-pill">12 Depts</span>
            </TreeLeafItem>
          </FolderChildrenList>
        )}
      </FolderNode>

      {/* 12 Corporate Departments Tree */}
      {departments.map((dept, idx) => {
        const folderKey = `dept-${dept.id}`;
        const isExpanded = expandedFolders[folderKey];

        return (
          <FolderNode key={dept.id}>
            <FolderHeaderBtn $isExpanded={isExpanded} onClick={() => toggleFolder(folderKey)}>
              <span className="caret">
                <ChevronRight size={13} />
              </span>
              <span className="label">
                {dept.order || idx + 1}. {dept.name}
              </span>
              <span className="badge">{dept.supervisors.length}</span>
            </FolderHeaderBtn>

            {isExpanded && (
              <FolderChildrenList>
                {dept.supervisors.map(sup => (
                  <TreeLeafItem
                    key={sup.id}
                    $isActive={activeItemKey === sup.id}
                    onClick={() => onLeafClick(sup.id, `${dept.name} · ${sup.name}`)}
                  >
                    <span>🤖</span>
                    <span>{sup.name}</span>
                    <span className="sla-pill">L3</span>
                  </TreeLeafItem>
                ))}
              </FolderChildrenList>
            )}
          </FolderNode>
        );
      })}
    </TreeScrollArea>
  );
};

export default SidebarExplorerTree;
