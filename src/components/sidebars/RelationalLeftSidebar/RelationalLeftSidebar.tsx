import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  setSelectedDepartment,
  setSelectedService,
  selectSelectedDepartment,
  selectSelectedService,
  selectFilteredServices,
} from '../../../redux/slices/relationalSidebarSlice';
import { fetchDepartments } from '../../../store/thunks/relationalSidebarThunks';

import { BaseSidebar, SidebarSection, SidebarItem } from '../../shared/sidebars';

// Styled Components
const LeftSidebarContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props: { theme?: { colors?: { sidebarBg?: string } } }) =>
    props.theme?.colors?.sidebarBg || '#1a1a1a'};
  border-right: 1px solid
    ${(props: { theme?: { colors?: { border?: string } } }) =>
      props.theme?.colors?.border || '#333'};
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props: { theme?: { colors?: { scrollbar?: string } } }) =>
      props.theme?.colors?.scrollbar || '#555'};
    border-radius: 4px;

    &:hover {
      background: ${(props: { theme?: { colors?: { scrollbarHover?: string } } }) =>
        props.theme?.colors?.scrollbarHover || '#777'};
    }
  }
`;

const NoServicesMessage = styled.div`
  padding: 12px 32px;
  font-size: 12px;
  color: ${(props: { theme?: { colors?: { textSecondary?: string } } }) =>
    props.theme?.colors?.textSecondary || '#999'};
  font-style: italic;
`;

// Loading skeleton component
const SkeletonItem = styled.div`
  height: 40px;
  background: linear-gradient(90deg, #2a2a2a 25%, #1f1f1f 50%, #2a2a2a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin: 8px 16px;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// Error state component
const ErrorContainer = styled.div`
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  margin: 12px 16px;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-bottom: 12px;
  word-break: break-word;
`;

const RetryButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #dc2626;
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

/**
 * RelationalLeftSidebar Component
 * Displays departments and their associated services
 * Filters services based on selected department
 * Filters assistants on right sidebar based on selected service
 *
 * Redux Integration: Uses fetchDepartments thunk to load data from API
 */
const RelationalLeftSidebar = ({
  userPermissions: _userPermissions = {},
}: {
  userPermissions?: Record<string, boolean>;
}): JSX.Element => {
  const dispatch = useDispatch<any>();
  const selectedDepartment = useSelector(selectSelectedDepartment) as string | null;
  const selectedService = useSelector(selectSelectedService) as string | null;
  const filteredServices = useSelector(selectFilteredServices) as Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;

  // Redux selectors for loading/error states
  const departmentsLoading = useSelector(
    (state: { relationalSidebar?: { departmentLoading?: boolean } }) =>
      state.relationalSidebar?.departmentLoading ?? false
  );
  const departmentsError = useSelector(
    (state: { relationalSidebar?: { departmentError?: string | null } }) =>
      state.relationalSidebar?.departmentError ?? null
  );
  const departments = useSelector(
    (state: { relationalSidebar?: { departments?: string[] } }) =>
      state.relationalSidebar?.departments ?? []
  );

  // Fetch departments on mount
  useEffect(() => {
    try {
      console.warn('[RelationalLeftSidebar] Mounting - fetching departments...');
      dispatch(fetchDepartments());
    } catch (error) {
      console.error('[RelationalLeftSidebar] Error fetching departments:', error);
    }
  }, [dispatch]);

  // Set default department when departments load
  useEffect(() => {
    if (!selectedDepartment && departments.length > 0) {
      console.warn('[RelationalLeftSidebar] Setting default department:', departments[0]);
      dispatch(setSelectedDepartment(departments[0]));
    }
  }, [departments, selectedDepartment, dispatch]);

  // Handle department selection
  const handleDepartmentSelect = (departmentId: string): void => {
    try {
      console.warn('[RelationalLeftSidebar] Selected department:', departmentId);
      dispatch(setSelectedDepartment(departmentId));
      dispatch(setSelectedService(null)); // Reset service selection
    } catch (error) {
      console.error('Error selecting department:', error);
    }
  };

  // Handle service selection
  const handleServiceSelect = (serviceId: string): void => {
    try {
      console.warn('[RelationalLeftSidebar] Selected service:', serviceId);
      dispatch(setSelectedService(serviceId));
    } catch (error) {
      console.error('Error selecting service:', error);
    }
  };

  // Handle retry on error
  const handleRetry = (): void => {
    console.warn('[RelationalLeftSidebar] Retrying department fetch...');
    dispatch(fetchDepartments());
  };

  return (
    <LeftSidebarContainer>
      <BaseSidebar name="relational-left-sidebar" title="Organization" icon="🏢" position="left">
        {/* Loading State */}
        {departmentsLoading && (
          <div>
            {[1, 2, 3].map(i => (
              <SkeletonItem key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* Error State */}
        {departmentsError && !departmentsLoading && (
          <ErrorContainer>
            <ErrorText>Failed to load departments: {departmentsError}</ErrorText>
            <RetryButton onClick={handleRetry}>Retry</RetryButton>
          </ErrorContainer>
        )}

        {/* Departments List */}
        {!departmentsLoading && !departmentsError && departments.length > 0 && (
          <div>
            {departments.map((dept: string) => (
              <div key={dept}>
                <SidebarItem
                  id={`dept-${dept}`}
                  label={dept}
                  isSelected={selectedDepartment === dept}
                  onClick={() => handleDepartmentSelect(dept)}
                  icon="🏢"
                  sidebarName="relational-left-sidebar"
                />

                {selectedDepartment === dept && filteredServices.length > 0 && (
                  <SidebarSection
                    id={`services-${dept}`}
                    title="Services"
                    sidebarName="relational-left-sidebar"
                  >
                    {filteredServices.map(service => (
                      <SidebarItem
                        key={`service-${service.id}`}
                        id={`service-${service.id}`}
                        label={service.label}
                        isSelected={selectedService === service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        icon={service.icon || '📋'}
                        sidebarName="relational-left-sidebar"
                      />
                    ))}
                  </SidebarSection>
                )}

                {selectedDepartment === dept && filteredServices.length === 0 && (
                  <NoServicesMessage>No services available</NoServicesMessage>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Departments Message */}
        {!departmentsLoading && !departmentsError && departments.length === 0 && (
          <NoServicesMessage>No departments available</NoServicesMessage>
        )}
      </BaseSidebar>
    </LeftSidebarContainer>
  );
};

export default RelationalLeftSidebar;
