/**
 * CRMHubPage.logic.ts
 * Business logic & state for White Caves ERP Dashboard.
 */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHaptics } from '../../hooks/useHaptics';
import { useCRMHubData } from '../../hooks/crm/useCRMHubData';
import type { SearchableOption } from '../../components/dashboard/common/SearchableSelect';
import {
  MD_SOVEREIGN_EMAILS,
  isMdSovereignEmail,
  resolveIsManagingDirector,
} from './mdDashboardAuth';
import {
  ALL_AI_ASSISTANTS,
  TWELVE_CORPORATE_DEPARTMENTS,
  MD_SUITE_DEPT,
  AI_TEAMS_STRUCTURE,
} from './CRMHubPage.registries';
import type { BuildingTier, AIAssistantOption, AITeamSquad } from './CRMHubPage.registries';

export { MD_SOVEREIGN_EMAILS, isMdSovereignEmail, resolveIsManagingDirector };
export { ALL_AI_ASSISTANTS, TWELVE_CORPORATE_DEPARTMENTS, MD_SUITE_DEPT, AI_TEAMS_STRUCTURE };
export type { BuildingTier, AIAssistantOption, AITeamSquad };

export function useCRMHubPageLogic() {
  const { user } = useCRMHubData();
  const [searchParams, setSearchParams] = useSearchParams();
  const haptics = useHaptics();

  const isManagingDirector = useMemo(
    () => resolveIsManagingDirector(user),
    [user?.email, user?.role]
  );

  const urlTab = searchParams.get('tab');
  const urlTile = searchParams.get('tile') as 'md_office' | 'corporate' | 'ai_command' | null;
  const urlDept = searchParams.get('dept') || searchParams.get('department');
  const urlAi = searchParams.get('ai') || searchParams.get('assistant');

  // Role-based smart default department
  const defaultDeptId = useMemo(() => {
    if (urlDept) return urlDept;
    const role = (user?.role || '').toLowerCase().trim();
    if (role.includes('leasing')) return 'dept-05';
    if (role.includes('sales')) return 'dept-06';
    if (role.includes('finance') || role.includes('account')) return 'dept-08';
    if (role.includes('legal') || role.includes('compliance')) return 'dept-09';
    if (role.includes('hr')) return 'dept-02';
    if (role.includes('marketing')) return 'dept-04';
    return 'dept-07';
  }, [user?.role, urlDept]);

  // Role-based smart default tab
  const defaultTab = useMemo(() => {
    if (urlTab) return urlTab;
    if (isManagingDirector) return 'overview';
    const role = (user?.role || '').toLowerCase().trim();
    if (role.includes('leasing')) return 'daisy';
    if (role.includes('sales')) return 'sophia';
    if (role.includes('finance') || role.includes('account')) return 'theodora';
    if (role.includes('hr')) return 'nancy';
    return 'dept_summary';
  }, [isManagingDirector, user?.role, urlTab]);

  // MD / founder email lands in MD Suite; others land in Corporate
  const [openTopTile, setOpenTopTile] = useState<'md_office' | 'corporate' | 'ai_command' | null>(() => {
    if (urlTile === 'md_office' || urlTile === 'corporate' || urlTile === 'ai_command') return urlTile;
    return isManagingDirector ? 'md_office' : 'corporate';
  });

  const [activeTab, setActiveTab] = useState<string>(
    urlTab || defaultTab
  );

  // Sticky MD landing after auth hydrate
  useEffect(() => {
    if (!isManagingDirector) return;
    if (urlTile) return;
    setOpenTopTile(prev => (prev === null || prev === 'corporate' ? 'md_office' : prev));
  }, [isManagingDirector, urlTile]);

  // Selected Department ID in Tile 2 (defaults according to user's operational role)
  const [selectedDeptId, setSelectedDeptId] = useState<string>(() => defaultDeptId);

  // Selected AI ID in Tile 3
  const [selectedAiId, setSelectedAiId] = useState<string>(() => urlAi || 'nadia');

  // Sync external searchParam changes for dept and ai
  useEffect(() => {
    if (urlDept && urlDept !== selectedDeptId) {
      setSelectedDeptId(urlDept);
    }
  }, [urlDept, selectedDeptId]);

  useEffect(() => {
    if (urlAi && urlAi !== selectedAiId) {
      setSelectedAiId(urlAi);
    }
  }, [urlAi, selectedAiId]);

  // Sidebar & Top Header Collapse States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const [isHenryTenancyModalOpen, setIsHenryTenancyModalOpen] = useState<boolean>(false);

  // Subgroup accordion states
  const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>({
    'dept-07-🏡 Inventory Control Center': true,
  });

  // Selected Department & AI Objects
  const selectedDept = useMemo(() => {
    return TWELVE_CORPORATE_DEPARTMENTS.find(d => d.id === selectedDeptId) || TWELVE_CORPORATE_DEPARTMENTS[5];
  }, [selectedDeptId]);

  const selectedAi = useMemo(() => {
    return ALL_AI_ASSISTANTS.find(a => a.id === selectedAiId) || ALL_AI_ASSISTANTS[0];
  }, [selectedAiId]);

  // Synchronize Tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = useCallback((newTab: string) => {
    haptics.medium();
    const resolvedTab = newTab === 'henry-prepare-tenancy' ? 'henry-tenancy-journey' : newTab;
    setActiveTab(resolvedTab);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', resolvedTab);
      return next;
    });
  }, [haptics, setSearchParams]);

  // Tile 1 click — set tile=md_office in URL when sovereign
  const handleMdTileClick = useCallback(() => {
    haptics.light();
    setOpenTopTile(prev => {
      const nextTile = prev === 'md_office' ? null : 'md_office';
      setSearchParams(current => {
        const nextParams = new URLSearchParams(current);
        if (nextTile) {
          nextParams.set('tile', nextTile);
        } else {
          nextParams.delete('tile');
        }
        return nextParams;
      });
      return nextTile;
    });
    handleTabChange('dept_summary');
  }, [haptics, handleTabChange, setSearchParams]);

  // Tile 2 click
  const handleCorporateTileClick = useCallback(() => {
    haptics.light();
    setOpenTopTile(prev => {
      const nextTile = prev === 'corporate' ? null : 'corporate';
      setSearchParams(current => {
        const nextParams = new URLSearchParams(current);
        if (nextTile) {
          nextParams.set('tile', nextTile);
        } else {
          nextParams.delete('tile');
        }
        return nextParams;
      });
      return nextTile;
    });
    handleTabChange('dept_summary');
  }, [haptics, handleTabChange, setSearchParams]);

  // Tile 3 click
  const handleAiTileClick = useCallback(() => {
    haptics.light();
    setOpenTopTile(prev => {
      const nextTile = prev === 'ai_command' ? null : 'ai_command';
      setSearchParams(current => {
        const nextParams = new URLSearchParams(current);
        if (nextTile) {
          nextParams.set('tile', nextTile);
        } else {
          nextParams.delete('tile');
        }
        return nextParams;
      });
      return nextTile;
    });
    handleTabChange(selectedAiId);
  }, [haptics, handleTabChange, selectedAiId, setSearchParams]);

  // Select Department from dropdown
  const handleSelectDepartment = useCallback((option: SearchableOption) => {
    haptics.light();
    setSelectedDeptId(option.id);
    setOpenTopTile('corporate');
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tile', 'corporate');
      next.set('dept', option.id);
      next.set('tab', 'dept_summary');
      return next;
    });
    handleTabChange('dept_summary');
  }, [haptics, handleTabChange, setSearchParams]);

  // Select AI from dropdown
  const handleSelectAiAssistant = useCallback((option: SearchableOption) => {
    haptics.light();
    setSelectedAiId(option.id);
    setOpenTopTile('ai_command');
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tile', 'ai_command');
      next.set('ai', option.id);
      next.set('tab', option.id);
      return next;
    });
    handleTabChange(option.id);
  }, [haptics, handleTabChange, setSearchParams]);

  // Toggle Subgroups
  const toggleSubGroup = useCallback((subGroupName: string) => {
    haptics.light();
    setOpenSubGroups(prev => ({
      ...prev,
      [subGroupName]: !prev[subGroupName],
    }));
  }, [haptics]);

  // Active Location Tag
  const activeLocationTag = useMemo(() => {
    if (openTopTile === 'md_office') return MD_SUITE_DEPT.locationTag;
    if (openTopTile === 'corporate') return selectedDept.locationTag;
    return `Floor 3 // AI Command Core (${selectedAi.name})`;
  }, [openTopTile, selectedDept, selectedAi]);

  return {
    user,
    isManagingDirector,
    activeTab,
    openTopTile,
    selectedDept,
    selectedDeptId,
    selectedAi,
    selectedAiId,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isHeaderCollapsed,
    setIsHeaderCollapsed,
    isHenryTenancyModalOpen,
    setIsHenryTenancyModalOpen,
    openSubGroups,
    activeLocationTag,
    handleTabChange,
    handleMdTileClick,
    handleCorporateTileClick,
    handleAiTileClick,
    handleSelectDepartment,
    handleSelectAiAssistant,
    toggleSubGroup,
  };
}
