/**
 * CRMHubPage.tsx
 *
 * White Caves Real Estate LLC — ERP Core Corporate Schema & Executive Dashboard.
 * Lean Atomic Orchestrator composing Header, Live Ticker, 3-Tile Sidebar, and Viewport Engine.
 */

import React, { FC, memo } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import {
  HubContainer,
  MainLayout,
} from './CRMHubPage.styles';
import {
  useCRMHubPageLogic,
  MD_SUITE_DEPT,
} from './CRMHubPage.logic';
import DashboardGlobalHeader from '../../components/dashboard/header/DashboardGlobalHeader';
import DashboardLiveTicker from '../../components/dashboard/header/DashboardLiveTicker';
import DashboardSidebar from '../../components/dashboard/sidebar/DashboardSidebar';
import DepartmentOverview from '../../components/dashboard/viewport/DepartmentOverview';
import ModuleViewport from '../../components/dashboard/viewport/ModuleViewport';
import HenryTenancyContractModal from '../../components/crm/HenryDocumentStudio/HenryTenancyContractModal';

export const CRMHubPage: FC = () => {
  const {
    user,
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
  } = useCRMHubPageLogic();

  // Active department object for the overview viewport (either MD Suite or Corporate Dept)
  const activeDeptObj = openTopTile === 'md_office' ? MD_SUITE_DEPT : selectedDept;

  return (
    <PublicLayout hideFooter>
      <HubContainer data-testid="crm-hub-page">
        {/* COLLAPSIBLE GLOBAL SYSTEM HEADER BANNER */}
        <DashboardGlobalHeader
          isHeaderCollapsed={isHeaderCollapsed}
          onToggleCollapse={setIsHeaderCollapsed}
          openTopTile={openTopTile}
          selectedDept={selectedDept}
          selectedAi={selectedAi}
          activeLocationTag={activeLocationTag}
        />

        {/* LIVE EXECUTIVE FINANCIAL & OPERATIONS TICKER */}
        <DashboardLiveTicker />

        {/* MAIN DASHBOARD LAYOUT: SIDEBAR + VIEWPORT */}
        <MainLayout>
          {/* HIGH-FIDELITY 3-TILE ACCORDION SIDEBAR */}
          <DashboardSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
            openTopTile={openTopTile}
            activeTab={activeTab}
            selectedDept={selectedDept}
            selectedDeptId={selectedDeptId}
            selectedAi={selectedAi}
            selectedAiId={selectedAiId}
            openSubGroups={openSubGroups}
            onMdTileClick={handleMdTileClick}
            onCorporateTileClick={handleCorporateTileClick}
            onAiTileClick={handleAiTileClick}
            onSelectDepartment={handleSelectDepartment}
            onSelectAiAssistant={handleSelectAiAssistant}
            onSubItemClick={handleTabChange}
            onToggleSubGroup={toggleSubGroup}
          />

          {/* DYNAMIC VIEWPORT (Department Overview vs CRM/AI Module View) */}
          {activeTab === 'dept_summary' ? (
            <DepartmentOverview
              department={activeDeptObj}
              onLaunchSubItem={handleTabChange}
            />
          ) : (
            <ModuleViewport
              moduleId={activeTab}
              user={user}
              onBackToOverview={() => handleTabChange('dept_summary')}
            />
          )}
        </MainLayout>

        {/* 3.19.1 PREPARE NEW TENANCY CONTRACT (DLD OFFICIAL FORM WIZARD) */}
        <HenryTenancyContractModal
          isOpen={isHenryTenancyModalOpen}
          onClose={() => setIsHenryTenancyModalOpen(false)}
        />
      </HubContainer>
    </PublicLayout>
  );
};

export default memo(CRMHubPage);
