import { useState, useCallback, useMemo } from 'react';
import {
  CORPORATE_DEPARTMENTS_12,
  EXECUTIVE_COMMAND_1,
} from '../../../data/assistants108Registry.data';

export type AIActivityTab =
  | 'ai-command'
  | 'voice-dispatch'
  | 'explorer'
  | 'agent-mesh'
  | 'zoe-chat'
  | 'organogram'
  | 'prompts';

export interface UseExecutiveAIVSCodeSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  initialTab?: AIActivityTab;
}

export function useExecutiveAIVSCodeSidebarLogic(props?: UseExecutiveAIVSCodeSidebarProps) {
  const [activeTab, setActiveTab] = useState<AIActivityTab>(props?.initialTab || 'ai-command');
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const isCollapsed = props?.isCollapsed !== undefined ? props.isCollapsed : internalCollapsed;
  const [width, setWidth] = useState(320);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('linda');
  const [directiveInput, setDirectiveInput] = useState('');

  const toggleCollapse = useCallback(() => {
    if (props?.onToggleCollapse) {
      props.onToggleCollapse();
    } else {
      setInternalCollapsed(prev => !prev);
    }
  }, [props]);

  const handleSelectTab = useCallback(
    (tab: AIActivityTab) => {
      setActiveTab(tab);
      if (props?.onToggleCollapse && isCollapsed) {
        props.onToggleCollapse();
      } else {
        setInternalCollapsed(false);
      }
    },
    [props, isCollapsed]
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
    const lindaAgent = {
      id: 'linda',
      name: 'AI Linda',
      title: 'WhatsApp Bot Operations Center (v2.0)',
      avatar: 'https://ui-avatars.com/api/?name=Linda+Bot&background=25D366&color=fff',
      deptName: 'Multi-Account WhatsApp & Outreach',
      deptCode: 'BOT-LINDA',
      color: '#25D366',
      description:
        'Upgraded WhatsApp Bot Operations Center: 4-Panel Terminal, F1-F35 Catalog, Playbooks P1-P10, and Area Owner Outreach Planner.',
    };
    const maryAgent = {
      id: 'mary',
      name: 'AI Mary',
      title: 'Listing Ingestion & Data Hygiene Specialist (Inventory Master)',
      avatar: 'https://ui-avatars.com/api/?name=Mary+AI&background=3B82F6&color=fff',
      deptName: 'Asset Management & Facilities (DH2 Hub)',
      deptCode: 'AI_MARY',
      color: '#3B82F6',
      description:
        'Master 9,378+ Inventory Grid, DAMAC Hills 2 Cluster Explorer, Landlord Deduplication & Title Deed Harmonizer.',
    };
    const deptManagers = CORPORATE_DEPARTMENTS_12.map(dept => ({
      ...dept.managerAi,
      deptName: dept.name,
      deptCode: dept.code,
      color: dept.color,
      description: dept.description,
    }));
    return [lindaAgent, maryAgent, ...deptManagers];
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
