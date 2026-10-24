/**
 * CRMHubPage.tsx — ERP Core Executive Dashboard.
 * MD / founder sessions open MD Suite first and show the command strip.
 */

import React, { FC, memo } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { HubContainer, MainLayout } from './CRMHubPage.styles';
import { useCRMHubPageLogic, MD_SUITE_DEPT } from './CRMHubPage.logic';
import DashboardGlobalHeader from '../../components/dashboard/header/DashboardGlobalHeader';
import DashboardLiveTicker from '../../components/dashboard/header/DashboardLiveTicker';
import MDCommandStrip from '../../components/dashboard/header/MDCommandStrip';
import DldMarketNewsFeedStrip from '../../components/crm/DldMarketNewsFeedStrip/DldMarketNewsFeedStrip';
import DashboardSidebar from '../../components/dashboard/sidebar/DashboardSidebar';
import DepartmentOverview from '../../components/dashboard/viewport/DepartmentOverview';
import ModuleViewport from '../../components/dashboard/viewport/ModuleViewport';
import HenryTenancyContractModal from '../../components/crm/HenryDocumentStudio/HenryTenancyContractModal';

export const CRMHubPage: FC = () => {
  const {
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
  } = useCRMHubPageLogic();

  const activeDeptObj = openTopTile === 'md_office' ? MD_SUITE_DEPT : selectedDept;

  return (
    <PublicLayout hideFooter>
      <HubContainer data-testid="crm-hub-page">
        <DashboardGlobalHeader
          isHeaderCollapsed={isHeaderCollapsed}
          onToggleCollapse={setIsHeaderCollapsed}
          openTopTile={openTopTile}
          selectedDept={selectedDept}
          selectedAi={selectedAi}
          activeLocationTag={activeLocationTag}
        />

        {isManagingDirector && (
          <MDCommandStrip
            mdName={user?.name || 'Arslan Malik Bashir Ahmad'}
            mdEmail={user?.email}
            onOpenModule={handleTabChange}
          />
        )}

        <DashboardLiveTicker />

        <DldMarketNewsFeedStrip />

        <MainLayout>
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
            isManagingDirector={isManagingDirector}
            onMdTileClick={handleMdTileClick}
            onCorporateTileClick={handleCorporateTileClick}
            onAiTileClick={handleAiTileClick}
            onSelectDepartment={handleSelectDepartment}
            onSelectAiAssistant={handleSelectAiAssistant}
            onSubItemClick={handleTabChange}
            onToggleSubGroup={toggleSubGroup}
          />

          {activeTab === 'dept_summary' ? (
            <DepartmentOverview department={activeDeptObj} onLaunchSubItem={handleTabChange} />
          ) : (
            <ModuleViewport
              moduleId={activeTab}
              user={user}
              onBackToOverview={() => handleTabChange('dept_summary')}
            />
          )}
        </MainLayout>

        <HenryTenancyContractModal
          isOpen={isHenryTenancyModalOpen}
          onClose={() => setIsHenryTenancyModalOpen(false)}
        />
      </HubContainer>
    </PublicLayout>
  );
};

export default memo(CRMHubPage);
