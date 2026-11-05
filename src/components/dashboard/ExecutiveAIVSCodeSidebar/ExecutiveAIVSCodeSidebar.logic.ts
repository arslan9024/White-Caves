import { useState, useCallback, useMemo } from 'react';
import {
  CORPORATE_DEPARTMENTS_12,
  EXECUTIVE_COMMAND_1,
} from '../../../data/assistants108Registry.data';

export type AIActivityTab = 'zoe-chat' | 'agent-mesh' | 'organogram' | 'prompts';

export function useExecutiveAIVSCodeSidebarLogic() {
  const [activeTab, setActiveTab] = useState<AIActivityTab>('agent-mesh');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(320);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('mgr_clara');
  const [directiveInput, setDirectiveInput] = useState('');

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const handleSelectTab = useCallback(
    (tab: AIActivityTab) => {
      if (activeTab === tab && !isCollapsed) {
        setIsCollapsed(true);
      } else {
        setActiveTab(tab);
        setIsCollapsed(false);
      }
    },
    [activeTab, isCollapsed]
  );

  // Drag-to-resize from the left edge of the right sidebar
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = width;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = startX - moveEvent.clientX;
        const newWidth = startWidth + delta;
        if (newWidth >= 240 && newWidth <= 520) {
          setWidth(newWidth);
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [width]
  );

  const managerAgents = useMemo(() => {
    return CORPORATE_DEPARTMENTS_12.map(dept => ({
      ...dept.managerAi,
      deptName: dept.name,
      deptCode: dept.code,
      color: dept.color,
      description: dept.description,
    }));
  }, []);

  const filteredManagers = useMemo(() => {
    if (!searchQuery.trim()) return managerAgents;
    const q = searchQuery.toLowerCase();
    return managerAgents.filter(
      a =>
        a.name.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.deptName.toLowerCase().includes(q) ||
        a.deptCode.toLowerCase().includes(q)
    );
  }, [managerAgents, searchQuery]);

  return {
    activeTab,
    isCollapsed,
    width,
    searchQuery,
    setSearchQuery,
    selectedAgentId,
    setSelectedAgentId,
    directiveInput,
    setDirectiveInput,
    toggleCollapse,
    handleSelectTab,
    handleMouseDown,
    zoe: EXECUTIVE_COMMAND_1.executiveAi,
    managers: filteredManagers,
  };
}
