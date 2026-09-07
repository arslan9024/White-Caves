/**
 * CRMHubPage.tsx
 *
 * White Caves Real Estate LLC — ERP Core Corporate Schema & Executive Dashboard.
 * Lean Atomic Orchestrator composing Header, Live Ticker, 3-Tile Sidebar, and Viewport Engine.
 */

import React, { FC, memo } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { HubContainer } from './CRMHubPage.styles';
import { useCRMHubPageLogic } from './CRMHubPage.logic';
import ModuleViewport from '../../components/dashboard/viewport/ModuleViewport';
import CommandCenter from '../../components/dashboard/command-center/CommandCenter';

export const CRMHubPage: FC = () => {
  const {
    user,
    activeTab,
    handleTabChange,
  } = useCRMHubPageLogic();

  const serverRole = String(user?.role ?? '').toLowerCase();

  return (
    <PublicLayout hideFooter>
      <HubContainer data-testid="crm-hub-page">
        {activeTab === 'dept_summary' ? (
          <CommandCenter serverRole={serverRole} onNavigateToModule={handleTabChange} />
        ) : (
          <ModuleViewport
            moduleId={activeTab}
            user={user}
            onBackToOverview={() => handleTabChange('dept_summary')}
          />
        )}
      </HubContainer>
    </PublicLayout>
  );
};

export default memo(CRMHubPage);
