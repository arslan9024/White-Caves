/**
 * DashboardPage - Main Dashboard with Dual Sidebar Architecture
 * 
 * This page serves as the main hub for all company operations
 * Left Sidebar: Company Departments
 * Center: Dynamic Content Area
 * Right Sidebar: AI Assistants
 */

import React, { useMemo } from 'react';
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
 * Main Dashboard Page Component
 * Renders the professional dual-sidebar layout
 * 
 * @component
 * @returns {React.ReactElement} Dashboard page with dual sidebars
 */
const DashboardPage = () => {
  return (
    <PageContainer>
      <DualSidebarLayout />
    </PageContainer>
  );
};

export default DashboardPage;
