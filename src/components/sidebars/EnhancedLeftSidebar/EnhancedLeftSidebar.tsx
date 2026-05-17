import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  setSelectedDepartment,
  setSelectedService,
  setSelectedSubitem,
  setFilteredServices,
  addToSelectionHistory,
  selectSelectedDepartment,
  selectSelectedService,
  selectFilteredServices,
  selectSelectionHistory,
} from '../../../redux/slices/relationalSidebarSlice';
import {
  getDefaultDepartment,
  getAvailableDepartments,
  getAvailableServices,
  getTopServices,
} from '../../../utils/sidebarUtils';

interface DepartmentItem {
  id: string;
  label: string;
}

interface ServiceItem {
  id: string;
  label: string;
  description?: string;
}

/**
 * Enhanced Left Sidebar with Department Dropdown
 * Shows department selector + filtered services below it
 */

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DepartmentSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SelectorLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DepartmentDropdown = styled.select`
  padding: 0.75rem 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  background-color: #ffffff;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  option {
    padding: 0.5rem;
    background-color: #ffffff;
    color: #1f2937;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #f9fafb;
  transition: all 0.2s;

  &:focus-within {
    border-color: #6366f1;
    background-color: #ffffff;
  }
`;

const SearchIcon = styled.span`
  color: #9ca3af;
  font-size: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }
`;

const ServicesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  margin: 1rem 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:first-child {
    margin-top: 0;
  }
`;

const ServiceButton = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid ${props => (props.$selected ? '#6366f1' : '#e5e7eb')};
  border-radius: 6px;
  background-color: ${props => (props.$selected ? '#eef2ff' : '#ffffff')};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: #6366f1;
    background-color: ${props => (props.$selected ? '#eef2ff' : '#f9fafb')};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ServiceName = styled.span<{ $selected: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => (props.$selected ? '#6366f1' : '#1f2937')};
`;

const ServiceDescription = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  color: #9ca3af;
`;

const EmptyStateIcon = styled.span`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;

const LoadingSkeleton = styled.div`
  height: 45px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 6px;
  margin-bottom: 0.5rem;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

/**
 * Enhanced RelationalLeftSidebar Component
 */
const EnhancedLeftSidebar = ({ userPermissions = [] }: { userPermissions?: string[] }) => {
  const dispatch = useDispatch<any>();

  // Redux state
  const selectedDept = useSelector(selectSelectedDepartment);
  const selectedService = useSelector(selectSelectedService);
  const filteredServices = useSelector(selectFilteredServices) as ServiceItem[];
  const selectionHistory = useSelector(selectSelectionHistory) as Array<Record<string, unknown>>;

  // Local state
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allDepts, setAllDepts] = useState<DepartmentItem[]>([]);

  const initializeSidebar = () => {
    setLoading(true);

    // Get available departments for user
    const availableDepts = getAvailableDepartments(userPermissions) as DepartmentItem[];
    setAllDepts(availableDepts);

    // Get default department
    const userRole = userPermissions[0] || 'operations'; // Fallback role
    const defaultDept = getDefaultDepartment(userRole, selectionHistory);

    // Set default department
    if (defaultDept && availableDepts.some((d: DepartmentItem) => d.id === defaultDept)) {
      handleDepartmentChange(defaultDept);
    } else if (availableDepts.length > 0) {
      handleDepartmentChange(availableDepts[0].id);
    }

    setLoading(false);
  };

  // Initialize on mount (after declaration — Rules of Hooks)
  useEffect(() => {
    initializeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions]);

  const handleDepartmentChange = (deptId: string) => {
    dispatch(setSelectedDepartment(deptId));

    // Get available services for this department
    const availableServices = getAvailableServices(deptId, userPermissions) as ServiceItem[];
    dispatch(setFilteredServices(availableServices));

    // Auto-select first service (optional)
    if (availableServices.length > 0) {
      const firstService = availableServices[0].id;
      handleServiceSelect(firstService);
    }

    // Clear search
    setSearchQuery('');
  };

  const handleServiceSelect = (serviceId: string) => {
    if (!selectedDept) return;

    dispatch(setSelectedService(serviceId));
    dispatch(setSelectedSubitem(null)); // Reset subitem when service changes

    // Add to selection history
    dispatch(
      addToSelectionHistory({
        dept: selectedDept,
        service: serviceId,
        subitem: null,
        filters: {},
        scrollPos: 0,
      })
    );

    // Clear search
    setSearchQuery('');
  };

  // Filter services based on search query
  const displayedServices = filteredServices.filter(
    (service: ServiceItem) =>
      service.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get top services for quick access
  const topServices = selectedDept ? getTopServices(selectedDept, selectionHistory, 3) : [];

  return (
    <SidebarContainer>
      <Header>
        <Title>Navigation</Title>
        <DepartmentSelector>
          <SelectorLabel>Department</SelectorLabel>
          <DepartmentDropdown
            value={selectedDept || ''}
            onChange={e => handleDepartmentChange(e.target.value)}
            disabled={loading}
          >
            <option value="">Select Department...</option>
            {allDepts.map((dept: DepartmentItem) => (
              <option key={dept.id} value={dept.id}>
                {dept.label}
              </option>
            ))}
          </DepartmentDropdown>
        </DepartmentSelector>
      </Header>

      <ContentArea>
        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : selectedDept ? (
          <>
            {/* Top Services Section */}
            {topServices.length > 0 && (
              <ServicesSection>
                <SectionTitle>Quick Access</SectionTitle>
                {(topServices as ServiceItem[]).map((service: ServiceItem) => (
                  <ServiceButton
                    key={service.id}
                    $selected={selectedService === service.id}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <ServiceName $selected={selectedService === service.id}>
                      {service.label}
                    </ServiceName>
                    <ServiceDescription>{service.description}</ServiceDescription>
                  </ServiceButton>
                ))}
              </ServicesSection>
            )}

            {/* Search */}
            <ServicesSection style={{ marginTop: '1rem' }}>
              <SearchContainer>
                <SearchIcon>🔍</SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </SearchContainer>
            </ServicesSection>

            {/* All Services Section */}
            {displayedServices.length > 0 && (
              <ServicesSection>
                <SectionTitle>{searchQuery ? 'Search Results' : 'All Services'}</SectionTitle>
                {displayedServices.map((service: ServiceItem) => (
                  <ServiceButton
                    key={service.id}
                    $selected={selectedService === service.id}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <ServiceName $selected={selectedService === service.id}>
                      {service.label}
                    </ServiceName>
                    <ServiceDescription>{service.description}</ServiceDescription>
                  </ServiceButton>
                ))}
              </ServicesSection>
            )}

            {displayedServices.length === 0 && searchQuery && (
              <EmptyState>
                <EmptyStateIcon>🔍</EmptyStateIcon>
                <EmptyStateText>No services match &quot;{searchQuery}&quot;</EmptyStateText>
              </EmptyState>
            )}

            {filteredServices.length === 0 && (
              <EmptyState>
                <EmptyStateIcon>📋</EmptyStateIcon>
                <EmptyStateText>No services available for this department</EmptyStateText>
              </EmptyState>
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon>🔐</EmptyStateIcon>
            <EmptyStateText>
              No departments available. Please check your permissions.
            </EmptyStateText>
          </EmptyState>
        )}
      </ContentArea>
    </SidebarContainer>
  );
};

export default EnhancedLeftSidebar;
