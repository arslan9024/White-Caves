// src/components/sidebars/CompanyDepartmentSidebar/CompanyDepartmentSidebar.tsx
/**
 * Left Sidebar: Company Departments & Management
 * Organizes all 10+ departments hierarchically
 * Provides navigation to department-specific features
 *
 * @deprecated Canonical CRM sidebar is `src/components/layout/UnifiedSidebar/UnifiedSidebar.tsx`.
 * Keep this file for compatibility until all legacy imports are retired.
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { BaseSidebar, SidebarSection, SidebarItem } from '../../shared/sidebars';
import { useSidebarState } from '../../../hooks/useSidebarState';
import { getDepartmentsByHierarchy } from '../../../config/departmentsRegistry';

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => String((theme as any)?.colors?.sidebarBg ?? '#1a1a1a')};
  border-right: 1px solid ${({ theme }) => String((theme as any)?.colors?.border ?? '#333')};
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
  color: ${({ theme }) => String((theme as any)?.colors?.textSecondary ?? '#999')};
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
  const { setActive, toggleExpanded, isExpanded } = useSidebarState('company-dept');

  // Organize departments by hierarchy
  const cSuite = useMemo(() => getDepartmentsByHierarchy(1), []);
  const directors = useMemo(() => getDepartmentsByHierarchy(2), []);
  const managers = useMemo(() => getDepartmentsByHierarchy(3), []);

  const handleDepartmentClick = (departmentId: string) => {
    setActive(`dept-${departmentId}`);
    if (onFeatureSelect) {
      onFeatureSelect(`dept-dashboard`, { department: departmentId });
    }
  };

  const handleServiceClick = (departmentId: string, serviceId: string) => {
    setActive(`service-${serviceId}`);
    if (onFeatureSelect) {
      onFeatureSelect(serviceId, { department: departmentId });
    }
  };

  return (
    <SidebarContainer className={className}>
      <BaseSidebar name="company-dept" title="White Caves" icon="🏢" hasSearch={false}>
        {/* C-SUITE SECTION */}
        {cSuite.length > 0 && (
          <DeptSection>
            <DeptLabel>Executive Level</DeptLabel>
            {cSuite.map(dept => (
              <SidebarSection
                key={dept.id}
                id={dept.id}
                title={dept.name}
                sidebarName="company-dept"
                defaultExpanded={isExpanded(dept.id)}
                onToggle={() => toggleExpanded(dept.id)}
              >
                {/* Department Overview Item */}
                <SidebarItem
                  id={`dept-${dept.id}`}
                  label="Dashboard"
                  icon={dept.icon}
                  isSelected={activeFeature === `dept-${dept.id}` || activeDepartment === dept.id}
                  sidebarName="company-dept"
                  onClick={() => handleDepartmentClick(dept.id)}
                />

                {/* Department Services */}
                {dept.services.map((serviceId, idx) => (
                  <SidebarItem
                    key={serviceId}
                    id={`service-${serviceId}`}
                    label={serviceId
                      .split('-')
                      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                    icon={['📊', '📈', '💼', '🔐', '📋'][idx % 5]}
                    isSelected={activeFeature === `service-${serviceId}`}
                    sidebarName="company-dept"
                    onClick={() => handleServiceClick(dept.id, serviceId)}
                  />
                ))}

                {/* Department Team */}
                <SidebarItem
                  id={`team-${dept.id}`}
                  label="Team"
                  icon="👥"
                  isSelected={activeFeature === `team-${dept.id}`}
                  sidebarName="company-dept"
                  onClick={() => {
                    setActive(`team-${dept.id}`);
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
                id={dept.id}
                title={dept.name}
                sidebarName="company-dept"
                defaultExpanded={isExpanded(dept.id)}
                onToggle={() => toggleExpanded(dept.id)}
              >
                <SidebarItem
                  id={`dept-${dept.id}`}
                  label="Dashboard"
                  icon={dept.icon}
                  isSelected={activeFeature === `dept-${dept.id}` || activeDepartment === dept.id}
                  sidebarName="company-dept"
                  onClick={() => handleDepartmentClick(dept.id)}
                />

                {dept.services.slice(0, 3).map(serviceId => (
                  <SidebarItem
                    key={serviceId}
                    id={`service-${serviceId}`}
                    label={serviceId
                      .split('-')
                      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                    icon="⚙️"
                    isSelected={activeFeature === `service-${serviceId}`}
                    sidebarName="company-dept"
                    onClick={() => handleServiceClick(dept.id, serviceId)}
                  />
                ))}

                {dept.services.length > 3 && (
                  <SidebarItem
                    id={`services-${dept.id}`}
                    label={`+${dept.services.length - 3} More Services`}
                    icon="📋"
                    isSelected={false}
                    sidebarName="company-dept"
                    onClick={() => {
                      setActive(`services-${dept.id}`);
                      onFeatureSelect?.(`service-list`, { department: dept.id });
                    }}
                  />
                )}

                <SidebarItem
                  id={`team-${dept.id}`}
                  label="Team"
                  icon="👥"
                  isSelected={activeFeature === `team-${dept.id}`}
                  sidebarName="company-dept"
                  onClick={() => {
                    setActive(`team-${dept.id}`);
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
                id={dept.id}
                title={dept.name}
                sidebarName="company-dept"
                defaultExpanded={isExpanded(dept.id)}
                onToggle={() => toggleExpanded(dept.id)}
              >
                <SidebarItem
                  id={`dept-${dept.id}`}
                  label="Dashboard"
                  icon={dept.icon}
                  isSelected={activeFeature === `dept-${dept.id}` || activeDepartment === dept.id}
                  sidebarName="company-dept"
                  onClick={() => handleDepartmentClick(dept.id)}
                />

                {dept.services.map(serviceId => (
                  <SidebarItem
                    key={serviceId}
                    id={`service-${serviceId}`}
                    label={serviceId
                      .split('-')
                      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                    icon="⚙️"
                    isSelected={activeFeature === `service-${serviceId}`}
                    sidebarName="company-dept"
                    onClick={() => handleServiceClick(dept.id, serviceId)}
                  />
                ))}

                <SidebarItem
                  id={`team-${dept.id}`}
                  label="Team"
                  icon="👥"
                  isSelected={activeFeature === `team-${dept.id}`}
                  sidebarName="company-dept"
                  onClick={() => {
                    setActive(`team-${dept.id}`);
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
