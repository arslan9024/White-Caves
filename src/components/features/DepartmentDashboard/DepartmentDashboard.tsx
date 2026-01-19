/**
 * DepartmentDashboard Component
 * 
 * Displays department-specific information and features
 * Shows department head, team members, KPIs, and recent activities
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getDepartment } from '../../../config/departmentsRegistry';

const DashboardContainer = styled.div`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
`;

const DeptIcon = styled.div`
  font-size: 48px;
  line-height: 1;
`;

const HeaderText = styled.div`
  flex: 1;
`;

const DeptName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textPrimary || '#1f2937'};
  margin-bottom: 4px;
`;

const DeptTitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const InfoCard = styled.div`
  background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
  border: 1px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
  border-radius: 8px;
  padding: 16px;
`;

const InfoLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  display: block;
  margin-bottom: 8px;
`;

const InfoValue = styled.p`
  font-size: 14px;
  color: ${props => props.theme?.colors?.textPrimary || '#1f2937'};
  margin: 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textPrimary || '#1f2937'};
  margin: 0;
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ServiceTag = styled.li`
  background: ${props => props.theme?.colors?.active || '#eef2ff'};
  color: ${props => props.theme?.colors?.info || '#3b82f6'};
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const CommingSoon = styled.div`
  background: ${props => props.theme?.colors?.active || '#eef2ff'};
  border: 1px dashed ${props => props.theme?.colors?.info || '#3b82f6'};
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  color: ${props => props.theme?.colors?.info || '#3b82f6'};
`;

interface DepartmentDashboardProps {
  departmentId: string;
  context?: Record<string, any>;
  featureId?: string;
}

/**
 * Department Dashboard Component
 * Displays all information for a specific department
 * 
 * @component
 * @param {string} departmentId - ID of the department to display
 * @returns {React.ReactElement}
 */
const DepartmentDashboard: React.FC<DepartmentDashboardProps> = ({ departmentId }) => {
  const department = useMemo(() => {
    return getDepartment(departmentId);
  }, [departmentId]);

  if (!department) {
    return (
      <DashboardContainer>
        <CommingSoon>
          <h2>Department Not Found</h2>
          <p>The department "{departmentId}" could not be found.</p>
        </CommingSoon>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Department Header */}
      <Header>
        <DeptIcon>{department.icon}</DeptIcon>
        <HeaderText>
          <DeptName>{department.name}</DeptName>
          <DeptTitle>{department.fullName}</DeptTitle>
        </HeaderText>
      </Header>

      {/* Department Info Grid */}
      <InfoGrid>
        <InfoCard>
          <InfoLabel>Department Head</InfoLabel>
          <InfoValue>{department.head}</InfoValue>
          <InfoLabel style={{ marginTop: '8px' }}>Title</InfoLabel>
          <InfoValue>{department.headTitle}</InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>Contact Email</InfoLabel>
          <InfoValue>{department.email}</InfoValue>
          <InfoLabel style={{ marginTop: '8px' }}>Extension</InfoLabel>
          <InfoValue>{department.phone}</InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>Organizational Level</InfoLabel>
          <InfoValue>
            {department.hierarchy === 1
              ? '🏛️ Executive (C-Suite)'
              : department.hierarchy === 2
              ? '👔 Director Level'
              : '👨‍💼 Manager Level'}
          </InfoValue>
        </InfoCard>
      </InfoGrid>

      {/* Department Description */}
      <Section>
        <SectionTitle>📋 About This Department</SectionTitle>
        <InfoCard>
          <InfoLabel>Purpose</InfoLabel>
          <InfoValue>{department.purpose}</InfoValue>
          <InfoLabel style={{ marginTop: '12px' }}>Description</InfoLabel>
          <InfoValue>{department.description}</InfoValue>
        </InfoCard>
      </Section>

      {/* Services */}
      {department.services && department.services.length > 0 && (
        <Section>
          <SectionTitle>🔧 Services & Functions</SectionTitle>
          <ServiceList>
            {department.services.map(service => (
              <ServiceTag key={service}>
                {service
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </ServiceTag>
            ))}
          </ServiceList>
        </Section>
      )}

      {/* AI Assistants */}
      {department.aiAssistants && department.aiAssistants.length > 0 && (
        <Section>
          <SectionTitle>🤖 Supporting AI Assistants</SectionTitle>
          <ServiceList>
            {department.aiAssistants.map(aiId => (
              <ServiceTag key={aiId}>
                {aiId.charAt(0).toUpperCase() + aiId.slice(1)}
              </ServiceTag>
            ))}
          </ServiceList>
        </Section>
      )}

      {/* More Features Coming */}
      <CommingSoon>
        <h3>📊 Dashboard Features</h3>
        <p>
          Team members, KPIs, recent activities, and more features coming soon!
        </p>
      </CommingSoon>
    </DashboardContainer>
  );
};

export default DepartmentDashboard;
