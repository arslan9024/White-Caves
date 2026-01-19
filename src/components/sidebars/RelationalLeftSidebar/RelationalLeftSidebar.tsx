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
} from '../../redux/slices/relationalSidebarSlice';
import {
  filterServicesByAssistant,
  DEPARTMENTS,
  filterAssistantsByService,
} from '../../utils/relationalSidebarUtils';
import { BaseSidebar, SidebarSection, SidebarItem } from '../sidebars/shared';

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

/**
 * RelationalLeftSidebar Component
 * Displays departments and their associated services
 * Filters services based on selected department
 * Filters assistants on right sidebar based on selected service
 */
const RelationalLeftSidebar = ({ userPermissions = {} }) => {
  const dispatch = useDispatch();
  const selectedDepartment = useSelector(selectSelectedDepartment);
  const selectedService = useSelector(selectSelectedService);
  const filteredServices = useSelector(selectFilteredServices);

  // Initialize: Set default department on mount
  useEffect(() => {
    if (!selectedDepartment && DEPARTMENTS.length > 0) {
      dispatch(setSelectedDepartment(DEPARTMENTS[0]));
    }
  }, []);

  // Handle department selection
  const handleDepartmentSelect = (departmentId) => {
    try {
      dispatch(setSelectedDepartment(departmentId));
      dispatch(setSelectedService(null)); // Reset service selection
      // Note: Filtering assistants happens in RelationalRightSidebar
    } catch (error) {
      console.error('Error selecting department:', error);
    }
  };

  // Handle service selection
  const handleServiceSelect = (serviceId) => {
    try {
      dispatch(setSelectedService(serviceId));
      // Assistants will be filtered by the right sidebar based on this service
    } catch (error) {
      console.error('Error selecting service:', error);
    }
  };

  // Get services for selected department
  const getDepartmentServices = (departmentId) => {
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

  return (
    <LeftSidebarContainer>
      <BaseSidebar
        title="Organization"
        subtitle="Departments & Services"
        isCollapsible={true}
      >
        {DEPARTMENTS.map((dept) => (
          <div key={dept}>
            <SidebarItem
              id={`dept-${dept}`}
              label={dept}
              isActive={selectedDepartment === dept}
              onClick={() => handleDepartmentSelect(dept)}
              icon="Building2"
              hasSubItems={true}
            />

            {selectedDepartment === dept && filteredServices.length > 0 && (
              <SidebarSection>
                {filteredServices.map((service) => (
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

            {selectedDepartment === dept && filteredServices.length === 0 && (
              <NoServicesMessage>No services available</NoServicesMessage>
            )}
          </div>
        ))}
      </BaseSidebar>
    </LeftSidebarContainer>
  );
};

export default RelationalLeftSidebar;
