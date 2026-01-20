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
}

const MarketingView: React.FC<MarketingViewProps> = ({ serviceName = 'campaign-management', subitemId }) => {
  const config = getDepartmentConfig('MARKETING')!;

  const renderContent = (data: any) => {
    if (!subitemId && serviceName === 'campaign-management') {
      return (
        <>
          <DataCard 
            title="Active Campaigns"
            subtitle="Current marketing campaigns and performance"
          >
            Campaigns: {JSON.stringify(data?.campaigns?.length || 0)} items
          </DataCard>
          <DataCard 
            title="Lead Generation"
            subtitle="Leads by source and channel"
          >
            Leads: {JSON.stringify(data?.leadGeneration?.length || 0)} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'campaigns') {
      return (
        <DataCard title="Campaigns" subtitle="All marketing campaigns">
          Campaigns: {JSON.stringify(data?.campaigns?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'lead-generation') {
      return (
        <DataCard title="Lead Generation" subtitle="Lead sources and performance">
          Leads: {JSON.stringify(data?.leads?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'social-media') {
      return (
        <DataCard title="Social Media" subtitle="Social media performance">
          Platforms: {JSON.stringify(data?.socialMedia?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'content-calendar') {
      return (
        <DataCard title="Content Calendar" subtitle="Scheduled content publication">
          Content: {JSON.stringify(data?.contentCalendar?.length || 0)} items
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
      contentRenderer={renderContent}
    />
  );
};

export default MarketingView;
