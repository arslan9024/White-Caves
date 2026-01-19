import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  setSelectedDepartment,
  setSelectedService,
  setFilteredServices,
  selectSelectedDepartment,
  selectSelectedService,
  selectFilteredServices,
} from '../../../redux/slices/relationalSidebarSlice';
import { fetchDepartments } from '../../../store/thunks/relationalSidebarThunks';
import {
  filterServicesByAssistant,
  DEPARTMENTS,
  filterAssistantsByService,
} from '../../../utils/relationalSidebarUtils';
import { BaseSidebar, SidebarSection, SidebarItem } from '../../shared/sidebars';

// Styled Components
const LeftSidebarContainer = styled.div`
  width: 280px;
  height: 100%;
  background: ${(props) => props.theme.colors.sidebar.background || '#1a1a1a'};
  border-right: 1px solid ${(props) => props.theme.colors.border || '#333'};
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
    background: ${(props) => props.theme.colors.scrollbar || '#555'};
    border-radius: 4px;

    &:hover {
      background: ${(props) => props.theme.colors.scrollbarHover || '#777'};
    }
  }
`;

const DepartmentHeader = styled.div`
  padding: 12px 16px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => props.theme.colors.textSecondary || '#999'};
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }
`;

const ServiceItem = styled(SidebarItem)`
  padding-left: 32px;
  font-size: 13px;

  &.active {
    background-color: ${(props) => props.theme.colors.sidebar.activeBackground || '#2a2a2a'};
    border-left: 3px solid ${(props) => props.theme.colors.primary || '#007bff'};
  }
`;

const NoServicesMessage = styled.div`
  padding: 12px 32px;
  font-size: 12px;
  color: ${(props) => props.theme.colors.textSecondary || '#999'};
  font-style: italic;
`;

// Loading skeleton component
const SkeletonItem = styled.div`
  height: 40px;
  background: linear-gradient(90deg, #2a2a2a 25%, #1f1f1f 50%, #2a2a2a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 8px;
  border-radius: 4px;
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
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
const RelationalLeftSidebar = ({ userPermissions = {} }: { userPermissions?: Record<string, boolean> }): JSX.Element => {
  const dispatch = useDispatch();
  const selectedDepartment = useSelector(selectSelectedDepartment) as string | null;
  const selectedService = useSelector(selectSelectedService) as string | null;
  const filteredServices = useSelector(selectFilteredServices) as Array<any>;
  
  // Redux selectors for loading/error states
  const departmentsLoading = useSelector((state: any) => state.relationalSidebar?.departmentLoading || false) as boolean;
  const departmentsError = useSelector((state: any) => state.relationalSidebar?.departmentError || null) as string | null;
  const departments = useSelector((state: any) => state.relationalSidebar?.departments || []) as string[];

  // Fetch departments on mount
  useEffect(() => {
    try {
      console.debug('[RelationalLeftSidebar] Mounting - fetching departments...');
      dispatch(fetchDepartments());
    } catch (error) {
      console.error('[RelationalLeftSidebar] Error fetching departments:', error);
    }
  }, [dispatch]);

  // Set default department when departments load
  useEffect(() => {
    if (!selectedDepartment && departments.length > 0) {
      console.debug('[RelationalLeftSidebar] Setting default department:', departments[0]);
      dispatch(setSelectedDepartment(departments[0]));
    }
  }, [departments, selectedDepartment, dispatch]);

  // Handle department selection
  const handleDepartmentSelect = (departmentId: string): void => {
    try {
      dispatch(setSelectedDepartment(departmentId));
      dispatch(setSelectedService(null)); // Reset service selection
      // Note: Filtering assistants happens in RelationalRightSidebar
    } catch (error) {
      console.error('Error selecting department:', error);
    }
  };

  // Handle service selection
  const handleServiceSelect = (serviceId: string): void => {
    try {
      dispatch(setSelectedService(serviceId));
      // Assistants will be filtered by the right sidebar based on this service
    } catch (error) {
      console.error('Error selecting service:', error);
    }
  };

  // Get services for selected department
  const getDepartmentServices = (departmentId: string): Array<any> => {
    try {
      // This would normally come from your API/database
      // For now, we'll use a mapping from ASSISTANTS that works in this department
      const assistantsInDept = filterServicesByAssistant;
      // In a real app, fetch from API: /api/departments/{departmentId}/services
      return [];
    } catch (error) {
      console.error('Error getting department services:', error);
      return [];
    }
  };

  // Handle retry on error
  const handleRetry = (): void => {
    console.debug('[RelationalLeftSidebar] Retrying department fetch...');
    dispatch(fetchDepartments());
  };

  return (
    <LeftSidebarContainer>
      <BaseSidebar
        title="Organization"
        subtitle="Departments & Services"
        isCollapsible={true}
      >
        {/* Loading State */}
        {departmentsLoading && (
          <div>
            {[1, 2, 3].map((i) => (
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
                  isActive={selectedDepartment === dept}
                  onClick={() => handleDepartmentSelect(dept)}
                  icon="Building2"
                  hasSubItems={true}
                />

                {selectedDepartment === dept && (filteredServices as any[]).length > 0 && (
                  <SidebarSection>
                    {(filteredServices as any[]).map((service: any) => (
                      <ServiceItem
                        key={`service-${service.id}`}
                        id={`service-${service.id}`}
                        label={service.label}
                        isActive={selectedService === service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        icon={service.icon}
                      />
                    ))}
                  </SidebarSection>
                )}

                {selectedDepartment === dept && (filteredServices as any[]).length === 0 && (
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
