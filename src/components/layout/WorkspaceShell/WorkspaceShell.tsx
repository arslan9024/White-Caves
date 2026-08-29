/**
 * WorkspaceShell.tsx — Pure Presentational View (Zero Layout Shift Canvas)
 */

import React, { FC, ReactNode } from 'react';
import {
  WorkspaceCanvas,
  MainContentContainer,
  RedWhiteSkeletonCard,
} from './styles/WorkspaceShell.style';
import { useWorkspaceShellLogic } from './logic/WorkspaceShell.logic';
import { SKELETON_CARD_PRESETS } from './data/WorkspaceShell.data';

interface WorkspaceShellProps {
  children: ReactNode;
  isLoading?: boolean;
  isSidebarCollapsed?: boolean;
}

export const WorkspaceShell: FC<WorkspaceShellProps> = ({
  children,
  isLoading = false,
  isSidebarCollapsed = false,
}) => {
  const { isDark, sidebarWidth, headerHeight, padding } = useWorkspaceShellLogic(isSidebarCollapsed);

  return (
    <WorkspaceCanvas $isDark={isDark} data-testid="zero-layout-shift-canvas">
      <MainContentContainer
        $sidebarWidth={sidebarWidth}
        $headerHeight={headerHeight}
        $padding={padding}
      >
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SKELETON_CARD_PRESETS.filter(p => p.type === 'metric').map(sk => (
                <RedWhiteSkeletonCard key={sk.id} $height={sk.height} $isDark={isDark} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RedWhiteSkeletonCard $height="340px" $isDark={isDark} />
              </div>
              <div>
                <RedWhiteSkeletonCard $height="340px" $isDark={isDark} />
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </MainContentContainer>
    </WorkspaceCanvas>
  );
};

export default WorkspaceShell;
