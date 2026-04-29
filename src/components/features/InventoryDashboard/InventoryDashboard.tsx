// src/components/features/InventoryDashboard/InventoryDashboard.tsx
import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  height: 100%;
  overflow-y: auto;

  h1 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: 600;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  text-align: center;

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    margin: 10px 0;
  }

  .stat-label {
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const InventoryDashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <h1>📊 Inventory Dashboard</h1>

      <StatsGrid>
        <StatCard>
          <div className="stat-label">Total Properties</div>
          <div className="stat-value">1,247</div>
        </StatCard>

        <StatCard>
          <div className="stat-label">Available</div>
          <div className="stat-value">856</div>
        </StatCard>

        <StatCard>
          <div className="stat-label">Occupied</div>
          <div className="stat-value">391</div>
        </StatCard>

        <StatCard>
          <div className="stat-label">Pending</div>
          <div className="stat-value">45</div>
        </StatCard>
      </StatsGrid>

      <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Quick Actions</h2>
      <p>
        Use the sidebar to navigate to different sections of your inventory
        management system. You can search properties, import data, view analytics,
        and manage your preferences from here.
      </p>
    </DashboardContainer>
  );
};

export default InventoryDashboard;
