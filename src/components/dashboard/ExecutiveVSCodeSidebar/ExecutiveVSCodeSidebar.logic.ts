import { useState, useCallback, useMemo } from 'react';
import {
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
} from '../../../data/assistants108Registry.data';

export type ActivityTab =
  | 'departments'
  | 'employees'
  | 'tasks'
  | 'leaderboard'
  | 'REproperties'
  | 'deals'
  | 'customers'
  | 'documents'
  | 'relationships'
  | 'erms'
  | 'roles'
  | 'profile'
  | 'audit'
  | 'settings';

export interface UseExecutiveVSCodeSidebarProps {
  activeTab?: ActivityTab;
  onSelectTab?: (tab: ActivityTab) => void;
}

export function useExecutiveVSCodeSidebarLogic(props?: UseExecutiveVSCodeSidebarProps) {
  const [internalTab, setInternalTab] = useState<ActivityTab>('departments');
  const activeTab = props?.activeTab !== undefined ? props.activeTab : internalTab;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(280);
  const [filterQuery, setFilterQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'md-hub': true,
    'dept-luxury_sales': false,
    'dept-residential_leasing': false,
  });
  const [activeItemKey, setActiveItemKey] = useState<string>('departments-hub');

  const toggleFolder = useCallback((folderKey: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey],
    }));
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const handleSelectTab = useCallback(
    (tab: ActivityTab) => {
      if (activeTab === tab && !isCollapsed) {
        setIsCollapsed(true);
      } else {
        setInternalTab(tab);
        props?.onSelectTab?.(tab);
        setIsCollapsed(false);
      }
    },
    [activeTab, isCollapsed, props]
  );

  // Resize handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = moveEvent.clientX;
      if (newWidth >= 220 && newWidth <= 480) {
        setWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  // Departments hierarchy
  const departments = useMemo(() => {
    return CORPORATE_DEPARTMENTS_12.map(dept => {
      const supervisors = SUPERVISORS_108.filter(s => s.departmentId === dept.id);
      return {
        ...dept,
        supervisors,
      };
    });
  }, []);

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    if (!filterQuery.trim()) return departments;
    const query = filterQuery.toLowerCase();
    return departments.filter(
      d =>
        d.name.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query) ||
        (d.managerAi?.name || '').toLowerCase().includes(query)
    );
  }, [departments, filterQuery]);

  return {
    activeTab,
    isCollapsed,
    width,
    filterQuery,
    setFilterQuery,
    expandedFolders,
    activeItemKey,
    setActiveItemKey,
    toggleFolder,
    toggleCollapse,
    handleSelectTab,
    handleMouseDown,
    departments: filteredDepartments,
  };
}
