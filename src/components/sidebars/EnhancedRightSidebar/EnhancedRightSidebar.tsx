import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  setSelectedAssistant,
  setSelectedService,
  setSelectedSubitem,
  setFilteredAssistants,
  addToSelectionHistory,
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedSubitem,
  selectSelectedAssistant,
  selectFilteredAssistants,
} from '../../../redux/slices/relationalSidebarSlice';
import { getDepartmentById } from '../../../config/departmentContentMap';
import { getAvailableServices, getAvailableSubitems } from '../../../utils/sidebarUtils';
import { filterAssistantsByDepartment } from '../../../utils/relationalSidebarUtils';

interface AssistantItem {
  id: string;
  name: string;
  role?: string;
}

interface Subitem {
  id: string;
  label: string;
}

interface ServiceItem {
  id: string;
  label: string;
  subitems?: Subitem[];
}

/**
 * Enhanced Right Sidebar with Services & Subitems
 * Shows AI assistants filtered by department + their services with subitems
 */

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f9fafb;
  border-left: 1px solid #e5e7eb;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;
`;

const Title = styled.h2`
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DepartmentBadge = styled.div`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background-color: #eef2ff;
  color: #6366f1;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

const AssistantsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:first-child {
    margin-top: 0;
  }
`;

const AssistantCard = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem;
  border: 1px solid ${props => (props.$selected ? '#6366f1' : '#e5e7eb')};
  border-radius: 6px;
  background-color: ${props => (props.$selected ? '#eef2ff' : '#ffffff')};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const AssistantName = styled.span<{ $selected: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => (props.$selected ? '#6366f1' : '#1f2937')};
`;

const AssistantRole = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const ServicesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-top: 1rem;
`;

const ServiceHeader = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    color: #6366f1;
  }
`;

const ServiceName = styled.span<{ $active: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => (props.$active ? '#6366f1' : '#1f2937')};
`;

const ExpandIcon = styled.span<{ $expanded: boolean }>`
  font-size: 0.75rem;
  transition: transform 0.2s;
  transform: ${props => (props.$expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const SubitemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.5rem 0 0 1rem;
  border-left: 2px solid #e5e7eb;
  margin-top: 0.5rem;
`;

const SubitemButton = styled.button<{ $selected: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => (props.$selected ? '#dbeafe' : 'transparent')};
  color: ${props => (props.$selected ? '#0284c7' : '#6b7280')};
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  &:active {
    transform: scale(0.98);
  }
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
  height: 60px;
  background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 6px;
  margin-bottom: 0.75rem;

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
 * Enhanced RelationalRightSidebar Component
 */
const EnhancedRightSidebar = ({ userPermissions = [] }: { userPermissions?: string[] }) => {
  const dispatch = useDispatch<any>();

  // Redux state
  const selectedDept = useSelector(selectSelectedDepartment);
  const selectedService = useSelector(selectSelectedService);
  const selectedSubitem = useSelector(selectSelectedSubitem);
  const selectedAssistant = useSelector(selectSelectedAssistant);
  const filteredAssistants = useSelector(selectFilteredAssistants) as AssistantItem[];

  // Local state
  const [loading, setLoading] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [availableServices, setAvailableServices] = useState<ServiceItem[]>([]);

  const updateAssistantsAndServices = async () => {
    setLoading(true);

    try {
      // Get assistants for this department
      const assistants = filterAssistantsByDepartment(
        selectedDept,
        userPermissions
      ) as AssistantItem[];
      dispatch(setFilteredAssistants(assistants));

      // Get available services for department
      const services = getAvailableServices(selectedDept, userPermissions) as ServiceItem[];
      setAvailableServices(services);

      // Auto-expand first service
      if (services.length > 0) {
        setExpandedServices({ [services[0].id]: true });
      }
    } catch (error) {
      console.error('Error updating assistants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update when department changes
  useEffect(() => {
    if (selectedDept) {
      void updateAssistantsAndServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDept, userPermissions]);

  const handleSubitemSelect = (serviceId: string, subitemId: string) => {
    if (!selectedDept) return;

    dispatch(setSelectedService(serviceId));
    dispatch(setSelectedSubitem(subitemId));

    // Add to selection history
    dispatch(
      addToSelectionHistory({
        dept: selectedDept,
        service: serviceId,
        subitem: subitemId,
        filters: {},
        scrollPos: 0,
      })
    );
  };

  const toggleServiceExpand = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      // eslint-disable-next-line security/detect-object-injection
      [serviceId]: !prev[serviceId],
    }));
  };

  return (
    <SidebarContainer>
      <Header>
        <Title>Assistants & Services</Title>
        {selectedDept && (
          <DepartmentBadge>
            {getDepartmentById(selectedDept)?.label || selectedDept}
          </DepartmentBadge>
        )}
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
            {/* Assistants Section */}
            {filteredAssistants.length > 0 && (
              <AssistantsSection>
                <SectionTitle>Team</SectionTitle>
                {filteredAssistants.map(assistant => (
                  <AssistantCard
                    key={assistant.id}
                    $selected={selectedAssistant === assistant.id}
                    onClick={() => dispatch(setSelectedAssistant(assistant.id))}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <AssistantName $selected={selectedAssistant === assistant.id}>
                        {assistant.name}
                      </AssistantName>
                    </div>
                    <AssistantRole>{assistant.role}</AssistantRole>
                  </AssistantCard>
                ))}
              </AssistantsSection>
            )}

            {/* Services & Subitems Section */}
            {availableServices.length > 0 && (
              <ServicesSection>
                <SectionTitle>Services</SectionTitle>
                {availableServices.map(service => (
                  <div key={service.id}>
                    <ServiceHeader onClick={() => toggleServiceExpand(service.id)}>
                      <ServiceName $active={selectedService === service.id}>
                        {service.label}
                      </ServiceName>
                      <ExpandIcon $expanded={expandedServices[service.id]}>▼</ExpandIcon>
                    </ServiceHeader>

                    {expandedServices[service.id] && service.subitems && (
                      <SubitemsList>
                        {service.subitems
                          .filter(subitem =>
                            getAvailableSubitems(selectedDept, service.id, userPermissions).find(
                              (s: { id: string }) => s.id === subitem.id
                            )
                          )
                          .map(subitem => (
                            <SubitemButton
                              key={subitem.id}
                              $selected={
                                selectedService === service.id && selectedSubitem === subitem.id
                              }
                              onClick={() => handleSubitemSelect(service.id, subitem.id)}
                            >
                              {subitem.label}
                            </SubitemButton>
                          ))}
                      </SubitemsList>
                    )}
                  </div>
                ))}
              </ServicesSection>
            )}

            {filteredAssistants.length === 0 && availableServices.length === 0 && (
              <EmptyState>
                <EmptyStateIcon>📭</EmptyStateIcon>
                <EmptyStateText>No assistants or services available</EmptyStateText>
              </EmptyState>
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon>👈</EmptyStateIcon>
            <EmptyStateText>Select a department from the left sidebar</EmptyStateText>
          </EmptyState>
        )}
      </ContentArea>
    </SidebarContainer>
  );
};

export default EnhancedRightSidebar;
