/**
 * DashboardPage - Legacy Entry Wrapper (Canonical CRM Shell)
 *
 * NOTE:
 * The canonical dashboard experience is now AppLayout + UnifiedDashboardPage.
 * This page intentionally keeps a compatibility wrapper for older imports.
 */

import React from 'react';
import styled from 'styled-components';
import { DualSidebarLayout } from '../components/layout/DashboardLayout/DualSidebarLayout';

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme?.colors?.background || '#f9fafb'};
  overflow: hidden;
`;

/**
 * Main Dashboard Page Component (compat mode)
 * Renders the canonical CRM shell through DualSidebarLayout compatibility wrapper.
 *
 * @component
 * @returns {React.ReactElement} Dashboard page using canonical CRM shell
 */
const DashboardPage = () => {
  return (
    <PageContainer>
      <DualSidebarLayout />
    </PageContainer>
  );
};

export default DashboardPage;
