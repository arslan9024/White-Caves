// src/components/layout/DashboardLayout/DualSidebarLayout.tsx
/**
 * DualSidebarLayout (Compatibility Wrapper)
 *
 * Why this exists:
 * - Older routes/pages still import DualSidebarLayout
 * - Canonical CRM shell is now AppLayout + UnifiedDashboardPage
 *
 * This wrapper removes duplicate sidebar/navbar implementations while preserving
 * backwards compatibility for any legacy imports.
 */

import React from 'react';
import AppLayout from '../AppLayout';
import UnifiedDashboardPage from '../../../pages/UnifiedDashboardPage';

export interface DualSidebarLayoutProps {
  className?: string;
}

export const DualSidebarLayout: React.FC<DualSidebarLayoutProps> = ({ className }) => {
  return (
    <div className={className} data-testid="dual-sidebar-compat-wrapper">
      <AppLayout>
        <UnifiedDashboardPage />
      </AppLayout>
    </div>
  );
};

export default DualSidebarLayout;
