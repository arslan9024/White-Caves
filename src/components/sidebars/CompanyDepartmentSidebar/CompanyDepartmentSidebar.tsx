// src/components/sidebars/CompanyDepartmentSidebar/CompanyDepartmentSidebar.tsx
/**
 * Left Sidebar: Company Departments & Management
 * Organizes all 10+ departments hierarchically
 * Provides navigation to department-specific features
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { BaseSidebar, SidebarSection, SidebarItem } from '../../shared/sidebars';
import { useSidebarState } from '../../../hooks/useSidebarState';
import { DEPARTMENTS, getDepartmentsByHierarchy } from '../../../config/departmentsRegistry';

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.sidebarBg};
  border-right: 1px solid ${props => props.theme.colors.border};
`;

const DeptSection = styled.div`
  padding: 0;
`;

const DeptLabel = styled.div`
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 16px;
  margin-bottom: 8px;

  &:first-of-type {
    margin-top: 0;
  }
`;

export interface CompanyDepartmentSidebarProps {
  onFeatureSelect?: (featureId: string, context?: { department: string }) => void;
  activeFeature?: string;
  activeDepartment?: string;
  className?: string;
}

export const CompanyDepartmentSidebar: React.FC<CompanyDepartmentSidebarProps> = ({
  onFeatureSelect,
  activeFeature,
  activeDepartment,
  className,
}) => {
  const { setActiveFeature, expandedSections, toggleSection } = useSidebarState();

  // Organize departments by hierarchy
  const cSuite = useMemo(() => getDepartmentsByHierarchy(1), []);
  const directors = useMemo(() => getDepartmentsByHierarchy(2), []);
  const managers = useMemo(() => getDepartmentsByHierarchy(3), []);

  const handleDepartmentClick = (departmentId: string) => {
    setActiveFeature(`dept-${departmentId}`);
    if (onFeatureSelect) {
      onFeatureSelect(`dept-dashboard`, { department: departmentId });
    }
  };

  const handleServiceClick = (departmentId: string, serviceId: string) => {
    setActiveFeature(`service-${serviceId}`);
    if (onFeatureSelect) {
      onFeatureSelect(serviceId, { department: departmentId });
    }
  };

  return (
    <SidebarContainer className={className}>
      <BaseSidebar title="White Caves" icon="🏢" subtitle="Organization">
        {/* C-SUITE SECTION */}
        {cSuite.length > 0 && (
          <DeptSection>
            <DeptLabel>Executive Level</DeptLabel>
            {cSuite.map(dept => (
              <SidebarSection
                key={dept.id}
                sectionId={dept.id}
                title={dept.name}
                isExpanded={expandedSections.has(dept.id)}
                onToggleExpand={() => toggleSection(dept.id)}
                iconColor={dept.color}
              >
                {/* Department Overview Item */}
                <SidebarItem
                  itemId={`dept-${dept.id}`}
                  label="Dashboard"
                  icon={dept.icon}
                  isActive={activeFeature === `dept-${dept.id}` || activeDepartment === dept.id}
                  onClick={() => handleDepartmentClick(dept.id)}
                  description={`${dept.head} - ${dept.headTitle}`}
                />

                {/* Department Services */}
                {dept.services.map((serviceId, idx) => (
                  <SidebarItem
                    key={serviceId}
                    itemId={`service-${serviceId}`}
                    label={serviceId
                      .split('-')
                      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                    icon={['📊', '📈', '💼', '🔐', '📋'][idx % 5]}
                    isActive={activeFeature === `service-${serviceId}`}
                    onClick={() => handleServiceClick(dept.id, serviceId)}
                  />
                ))}

                {/* Department Team */}
                <SidebarItem
                  itemId={`team-${dept.id}`}
                  label="Team"
                  icon="👥"
                  isActive={activeFeature === `team-${dept.id}`}
                  onClick={() => {
                    setActiveFeature(`team-${dept.id}`);
                    onFeatureSelect?.(`team-directory`, { department: dept.id });
                  }}
                />
              </SidebarSection>
            ))}
          </DeptSection>
        )}

        {/* DIRECTORS SECTION */}
        {directors.length > 0 && (
          <DeptSection>
            <DeptLabel>Operational Units</DeptLabel>
            {directors.map(dept => (
              <SidebarSection
                key={dept.id}
                sectionId={dept.id}
                title={dept.name}
                isExpanded={expandedSections.has(dept.id)}
                onToggleExpand={() => toggleSection(dept.id)}
                iconColor={dept.color}
              >
                <SidebarItem
                  itemId={`dept-${dept.id}`}
                  label="Dashboard"
                  icon={dept.icon}
                  isActive={activeFeature === `dept-${dept.id}` || activeDepartment === dept.id}
                  onClick={() => handleDepartmentClick(dept.id)}
                  description={`${dept.head} - ${dept.headTitle}`}
                />

                {dept.services.slice(0, 3).map(serviceId => (
                  <SidebarItem
                    key={serviceId}
                    itemId={`service-${serviceId}`}
                    label={serviceId
                      .split('-')
                      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                    icon="⚙️"
                    isActive={activeFeature === `service-${serviceId}`}
                    onClick={() => handleServiceClick(dept.id, serviceId)}
                  />
                ))}

                {dept.services.length > 3 && (
                  <SidebarItem
                    itemId={`services-${dept.id}`}
                    label={`+${dept.services.length - 3} More Services`}
                    icon="📋"
                    isActive={false}
                    onClick={() => {
                      setActiveFeature(`services-${dept.id}`);
                      onFeatureSelect?.(`service-list`, { department: dept.id });
                    }}
                  />
                )}

                <SidebarItem
                  itemId={`team-${dept.id}`}
                  label="Team"
                  icon="👥"
                  isActive={activeFeature === `team-${dept.id}`}
                  onClick={() => {
                    setActiveFeature(`team-${dept.id}`);
                    onFeatureSelect?.(`team-directory`, { department: dept.id });
                  }}
                />
              </SidebarSection>
            ))}
          </DeptSection>
        )}

        {/* MANAGERS SECTION */}
        {managers.length > 0 && (
          <DeptSection>
            <DeptLabel>Support Functions</DeptLabel>
            {managers.map(dept => (
              <SidebarSection
                key={dept.id}
                sectionId={dept.id}
                title={dept.name}
                isExpanded={expandedSections.has(dept.id)}
                onToggleExpand={() => toggleSection(dept.id)}
                iconColor={dept.color}
              >
                <SidebarItem
                  itemId={`dept-${dept.id}`}
                  label="Dashboard"
                  icon={dept.icon}
                  isActive={activeFeature === `dept-${dept.id}` || activeDepartment === dept.id}
                  onClick={() => handleDepartmentClick(dept.id)}
                  description={`${dept.head} - ${dept.headTitle}`}
                />

                {dept.services.map(serviceId => (
                  <SidebarItem
                    key={serviceId}
                    itemId={`service-${serviceId}`}
                    label={serviceId
                      .split('-')
                      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                    icon="⚙️"
                    isActive={activeFeature === `service-${serviceId}`}
                    onClick={() => handleServiceClick(dept.id, serviceId)}
                  />
                ))}

                <SidebarItem
                  itemId={`team-${dept.id}`}
                  label="Team"
                  icon="👥"
                  isActive={activeFeature === `team-${dept.id}`}
                  onClick={() => {
                    setActiveFeature(`team-${dept.id}`);
                    onFeatureSelect?.(`team-directory`, { department: dept.id });
                  }}
                />
              </SidebarSection>
            ))}
          </DeptSection>
        )}
      </BaseSidebar>
    </SidebarContainer>
  );
};

export default CompanyDepartmentSidebar;
