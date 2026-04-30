// @ts-nocheck
import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * PropertyManagementView Component
 * Displays property portfolio, maintenance, tenancy, and occupancy metrics
 * Default service for PROPERTY_MANAGEMENT department
 */
interface PropertyManagementViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: any;
}

const PropertyManagementView: React.FC<PropertyManagementViewProps> = ({ 
  serviceName = 'property-portfolio', 
  subitemId,
  departmentData 
}) => {
  const config = getDepartmentConfig('PROPERTY_MANAGEMENT')!;

  const renderContent = (data: any) => {
    if (!subitemId && serviceName === 'property-portfolio') {
      return (
        <>
          <DataCard 
            title="Property Portfolio"
            subtitle="All managed properties"
          >
            Properties: {JSON.stringify(data?.properties?.length || 0)} items
          </DataCard>
          <DataCard 
            title="Maintenance Schedule"
            subtitle="Upcoming and in-progress maintenance"
          >
            Maintenance: {JSON.stringify(data?.maintenance?.length || 0)} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'property-list') {
      return (
        <DataCard title="Property List" subtitle="All managed properties">
          Properties: {JSON.stringify(data?.properties?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'tenancy-management') {
      return (
        <DataCard title="Tenancy Management" subtitle="Active tenancies">
          Tenancies: {JSON.stringify(data?.tenancies?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'maintenance') {
      return (
        <DataCard title="Maintenance" subtitle="Maintenance tracking and scheduling">
          Maintenance: {JSON.stringify(data?.maintenance?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'rent-collection') {
      return (
        <DataCard title="Rent Collection" subtitle="Rental payments tracking">
          Collections: {JSON.stringify(data?.rentCollection?.length || 0)} items
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

export default PropertyManagementView;

