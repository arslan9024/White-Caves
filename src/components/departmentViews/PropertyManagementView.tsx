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
  departmentData?: Record<string, unknown>;
}

const PropertyManagementView: React.FC<PropertyManagementViewProps> = ({
  serviceName = 'property-portfolio',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('PROPERTY_MANAGEMENT')!;

  const renderContent = (data: Record<string, unknown>) => {
    const getCount = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

    if (!subitemId && serviceName === 'property-portfolio') {
      return (
        <>
          <DataCard title="Property Portfolio" subtitle="All managed properties">
            Properties: {JSON.stringify(getCount(data?.properties))} items
          </DataCard>
          <DataCard title="Maintenance Schedule" subtitle="Upcoming and in-progress maintenance">
            Maintenance: {JSON.stringify(getCount(data?.maintenance))} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'property-list') {
      return (
        <DataCard title="Property List" subtitle="All managed properties">
          Properties: {JSON.stringify(getCount(data?.properties))} items
        </DataCard>
      );
    }

    if (subitemId === 'tenancy-management') {
      return (
        <DataCard title="Tenancy Management" subtitle="Active tenancies">
          Tenancies: {JSON.stringify(getCount(data?.tenancies))} items
        </DataCard>
      );
    }

    if (subitemId === 'maintenance') {
      return (
        <DataCard title="Maintenance" subtitle="Maintenance tracking and scheduling">
          Maintenance: {JSON.stringify(getCount(data?.maintenance))} items
        </DataCard>
      );
    }

    if (subitemId === 'rent-collection') {
      return (
        <DataCard title="Rent Collection" subtitle="Rental payments tracking">
          Collections: {JSON.stringify(getCount(data?.rentCollection))} items
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
