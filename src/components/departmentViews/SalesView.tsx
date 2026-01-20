import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * SalesView Component
 * Displays lead pipeline, active deals, client journey, and contracts
 * Default service for SALES department
 * Refactored to use BaseDepartmentView to eliminate code duplication
 */
interface SalesViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: any;
}

const SalesView: React.FC<SalesViewProps> = ({ serviceName = 'lead-pipeline', subitemId, departmentData }) => {
  const config = getDepartmentConfig('SALES')!;

  // Render main content based on serviceName and subitemId
  const renderContent = (data: any) => {
    if (!subitemId && serviceName === 'lead-pipeline') {
      return (
        <>
          {/* Pipeline Board */}
          <DataCard 
            title="Sales Pipeline Board"
            subtitle="Kanban view of all leads and deals"
          >
            {/* TODO: Implement pipeline board content */}
            Pipeline: {JSON.stringify(data?.pipelineBoard?.length || 0)} items
          </DataCard>

          {/* Active Deals */}
          <DataCard 
            title="Active Deals"
            subtitle="In-progress deals and negotiations"
          >
            {/* TODO: Implement active deals content */}
            Deals: {JSON.stringify(data?.activeDeals?.length || 0)} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'pipeline-board') {
      return (
        <DataCard title="Pipeline Board" subtitle="Kanban view">
          Board data...
        </DataCard>
      );
    }

    if (subitemId === 'active-deals') {
      return (
        <DataCard title="Active Deals" subtitle="All active sales deals">
          Deals data...
        </DataCard>
      );
    }

    if (subitemId === 'client-journey') {
      return (
        <DataCard title="Client Journey" subtitle="Track clients through sales funnel">
          Journey data...
        </DataCard>
      );
    }

    if (subitemId === 'sales-contracts') {
      return (
        <DataCard title="Contracts" subtitle="Sales agreements and contracts">
          Contracts data...
        </DataCard>
      );
    }

    return null;
  };

  return (
    <BaseDepartmentView
      config={config}
      serviceName={serviceName}
      subitemId={subitemId}
      departmentData={departmentData}
      contentRenderer={renderContent}
    />
  );
};

export default SalesView;
