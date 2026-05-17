import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * MarketingView Component
 * Displays marketing campaigns, lead generation, and brand management
 * Default service for MARKETING department
 */
interface MarketingViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: Record<string, unknown>;
}

const MarketingView: React.FC<MarketingViewProps> = ({
  serviceName = 'campaigns',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('MARKETING')!;

  const renderContent = (data: Record<string, unknown>) => {
    const getCount = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

    if (!subitemId && serviceName === 'campaign-management') {
      return (
        <>
          <DataCard title="Active Campaigns" subtitle="Current marketing campaigns and performance">
            Campaigns: {JSON.stringify(getCount(data?.campaigns))} items
          </DataCard>
          <DataCard title="Lead Generation" subtitle="Leads by source and channel">
            Leads: {JSON.stringify(getCount(data?.leadGeneration))} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'campaigns') {
      return (
        <DataCard title="Campaigns" subtitle="All marketing campaigns">
          Campaigns: {JSON.stringify(getCount(data?.campaigns))} items
        </DataCard>
      );
    }

    if (subitemId === 'lead-generation') {
      return (
        <DataCard title="Lead Generation" subtitle="Lead sources and performance">
          Leads: {JSON.stringify(getCount(data?.leads))} items
        </DataCard>
      );
    }

    if (subitemId === 'social-media') {
      return (
        <DataCard title="Social Media" subtitle="Social media performance">
          Platforms: {JSON.stringify(getCount(data?.socialMedia))} items
        </DataCard>
      );
    }

    if (subitemId === 'content-calendar') {
      return (
        <DataCard title="Content Calendar" subtitle="Scheduled content publication">
          Content: {JSON.stringify(getCount(data?.contentCalendar))} items
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

export default MarketingView;
