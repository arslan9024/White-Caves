import React, { FC, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { RoleTab } from '../../config/ROLE_TAB_MAPPING';

interface DashboardWorkspaceTabsProps {
  roleSubNavItemsCount: number;
  subNav: ReactNode;
  selectedCRMModuleLabel?: string;
  showModuleToolbar: boolean;
  contentKey: string;
  isLoading: boolean;
  content: ReactNode;
  loadingFallback: ReactNode;
  prefersReducedMotion: boolean;
  onBackFromCRM: () => void;
  activeTab?: RoleTab;
}

const DashboardWorkspaceTabs: FC<DashboardWorkspaceTabsProps> = ({
  roleSubNavItemsCount,
  subNav,
  selectedCRMModuleLabel,
  showModuleToolbar,
  contentKey,
  isLoading,
  content,
  loadingFallback,
  prefersReducedMotion,
  onBackFromCRM,
}) => {
  return (
    <>
      {roleSubNavItemsCount > 0 && <div className="dashboard-subnav-panel">{subNav}</div>}

      <div className="dashboard-content-frame">
        {showModuleToolbar && (
          <div className="dashboard-module-toolbar">
            <button className="crm-back-button" onClick={onBackFromCRM}>
              ← Back to dashboard
            </button>
            <span className="dashboard-module-toolbar__label">{selectedCRMModuleLabel}</span>
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={contentKey}
            className="unified-dashboard-content"
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    y: 12,
                  }
            }
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
          >
            {isLoading ? loadingFallback : content}
          </motion.section>
        </AnimatePresence>
      </div>
    </>
  );
};

export default DashboardWorkspaceTabs;
