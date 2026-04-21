/**
 * DepartmentContentPanel - Dynamic content for selected department
 *
 * Features:
 * - Department-specific metrics and analytics
 * - Service-level drill-down content
 * - Quick action buttons
 * - Department overview cards
 * - Responsive grid layout
 * - Dark mode support
 */

import React, { lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Briefcase } from 'lucide-react';
import { selectService } from '../../../store/slices/sidebarSlice';
import useActionHandler from '../../../hooks/useActionHandler';
import Skeleton from '../../ui/Skeleton/Skeleton';

// Lazy-load charts to keep them out of the critical app-core bundle
const MetricsChart = lazy(() => import('../../charts/MetricsChart'));
const TrendChart = lazy(() => import('../../charts/TrendChart'));
const DistributionChart = lazy(() => import('../../charts/DistributionChart'));
const EnhancedStatCard = lazy(() => import('../../charts/EnhancedStatCard'));
import '../../charts/charts.css';
import type { RootState } from '../../../store/store';
import * as S from './styles';
import { DEPARTMENT_CONTENT } from './departmentData';

const MetricsLoadingSkeleton: React.FC = () => (
  <S.LoadingSection role="status" aria-live="polite" data-testid="metrics-loading-skeleton">
    <S.MetricsGrid>
      {Array.from({ length: 4 }).map((_, idx) => (
        <Skeleton
          key={`metric-skeleton-${idx}`}
          variant="card"
          height={120}
          borderRadius="10px"
          aria-label="Loading metric card"
        />
      ))}
    </S.MetricsGrid>
  </S.LoadingSection>
);

const AnalyticsLoadingSkeleton: React.FC = () => (
  <S.LoadingSection role="status" aria-live="polite" data-testid="analytics-loading-skeleton">
    <S.AnalyticsSection>
      {Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton
          key={`analytics-skeleton-${idx}`}
          variant="card"
          height={350}
          borderRadius="12px"
          aria-label="Loading analytics chart"
        />
      ))}
    </S.AnalyticsSection>
  </S.LoadingSection>
);

const DepartmentContentPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { handleAction } = useActionHandler();
  const selectedDepartment = useSelector((state: RootState) => state.sidebar?.selectedDepartment) as string | null;
  const selectedService = useSelector((state: RootState) => state.sidebar?.selectedService) as string | null;

  // Get content for selected department
  const deptContent = selectedDepartment 
    ? DEPARTMENT_CONTENT[selectedDepartment] 
    : null;

  const serviceContent = deptContent && selectedService
    ? deptContent.services[selectedService]
    : null;
  const serviceNotFound = Boolean(deptContent && selectedService && !serviceContent);

  // Handle service card click
  const handleServiceCardClick = (serviceName: string) => {
    if (selectedDepartment) {
      dispatch(selectService({ 
        department: selectedDepartment, 
        service: serviceName 
      }));
    }
  };

  // Handle quick action clicks with new navigation system
  const handleActionClick = (actionLabel: string) => {
    if (selectedDepartment) {
      handleAction(actionLabel, selectedDepartment, selectedService || '');
    }
  };

  if (!deptContent) {
    return (
      <S.DepartmentPanel className="empty">
        <S.EmptyState>
          <S.EmptyStateIcon as={Briefcase} size={64} />
          <S.EmptyStateHeading>Select a Department</S.EmptyStateHeading>
          <S.EmptyStateText>Choose a department from the left sidebar to view content and manage operations</S.EmptyStateText>
        </S.EmptyState>
      </S.DepartmentPanel>
    );
  }

    if (serviceNotFound) {
      return (
        <S.DepartmentPanel className="empty">
          <S.EmptyState>
            <S.EmptyStateIcon as={Briefcase} size={56} />
            <S.EmptyStateHeading>Service Not Found</S.EmptyStateHeading>
            <S.EmptyStateText>
              The selected service is no longer available in {deptContent.name}. Please choose another service from the left sidebar.
            </S.EmptyStateText>
          </S.EmptyState>
        </S.DepartmentPanel>
      );
    }

  return (
    <S.DepartmentPanel>
      {/* Header */}
      <S.ContentHeader 
        style={{ background: deptContent.bgGradient }}
      >
        <S.HeaderContent>
            <S.ContentBreadcrumbs aria-label="Center content breadcrumb">
              <S.BreadcrumbItem>{deptContent.name}</S.BreadcrumbItem>
              <S.BreadcrumbSeparator aria-hidden="true">/</S.BreadcrumbSeparator>
              <S.BreadcrumbItem $isCurrent={true}>{selectedService || 'Overview'}</S.BreadcrumbItem>
            </S.ContentBreadcrumbs>
          <S.HeaderTitle>{deptContent.name}</S.HeaderTitle>
          <S.HeaderDescription>{deptContent.description}</S.HeaderDescription>
        </S.HeaderContent>
      </S.ContentHeader>

      {/* Main Content */}
      <S.ContentBody>
        {/* Service-Specific Content */}
        {serviceContent ? (
          <S.ServiceContent>
            <S.ServiceHeader>
              <S.ServiceTitle>{selectedService}</S.ServiceTitle>
              <S.ServiceDescription>{serviceContent.description}</S.ServiceDescription>
            </S.ServiceHeader>

            {/* Service Stats */}
            <S.StatsGrid $isServiceStats={true}>
              {serviceContent.stats.map((stat) => (
                <S.StatCard key={stat.label}>
                  <S.StatLabel>{stat.label}</S.StatLabel>
                  <S.StatValue>{stat.value}</S.StatValue>
                </S.StatCard>
              ))}
            </S.StatsGrid>

            {/* Service Actions */}
            <S.ActionsSection>
              <S.ActionsSectionHeading>Quick Actions</S.ActionsSectionHeading>
              <S.ActionsGrid>
                {serviceContent.actions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <S.ActionButton 
                      key={action.label} 
                      onClick={() => handleActionClick(action.label)}
                      title={`${action.label} - ${selectedService}`}
                    >
                      <IconComponent size={20} />
                      <span>{action.label}</span>
                    </S.ActionButton>
                  );
                })}
              </S.ActionsGrid>
            </S.ActionsSection>
          </S.ServiceContent>
        ) : (
          <>
            {/* Department Overview */}
            <S.OverviewSection>
              <S.OverviewHeading>Department Overview</S.OverviewHeading>
              <S.OverviewText>
                Select a service from the left sidebar to view detailed information and manage operations.
              </S.OverviewText>
            </S.OverviewSection>

            {/* Department Metrics */}
            <S.MetricsSection>
              <S.MetricsSectionHeading>Key Metrics</S.MetricsSectionHeading>
              <Suspense fallback={<MetricsLoadingSkeleton />}>
                <S.MetricsGrid>
                  {deptContent.metrics.map((metric) => (
                    <EnhancedStatCard
                      key={metric.label}
                      label={metric.label}
                      value={metric.value}
                      change={metric.change}
                      trend={metric.trend}
                      color={deptContent.color}
                      backgroundColor={deptContent.bgGradient}
                      sparklineData={[35, 42, 38, 51, 48, 60]}
                    />
                  ))}
                </S.MetricsGrid>
              </Suspense>
            </S.MetricsSection>

            {/* Analytics Charts */}
            <Suspense fallback={<AnalyticsLoadingSkeleton />}>
              <S.AnalyticsSection>
                <MetricsChart 
                  data={deptContent.metrics}
                  title={`${deptContent.name} Metrics Overview`}
                  color={deptContent.color}
                  height={350}
                />
                
                <TrendChart
                  data={[
                    { name: 'Week 1', value: 35, target: 40 },
                    { name: 'Week 2', value: 42, target: 40 },
                    { name: 'Week 3', value: 38, target: 40 },
                    { name: 'Week 4', value: 51, target: 40 },
                    { name: 'Week 5', value: 48, target: 40 },
                    { name: 'Week 6', value: 60, target: 40 }
                  ]}
                  title={`${deptContent.name} Trend Analysis`}
                  color={deptContent.color}
                  height={350}
                />
                
                <DistributionChart
                  data={Object.entries(deptContent.services).slice(0, 5).map(([name]) => ({
                    name,
                    value: Math.floor(Math.random() * 40) + 15
                  }))}
                  title={`${deptContent.name} Service Distribution`}
                  height={350}
                />
              </S.AnalyticsSection>
            </Suspense>

            {/* Available Services */}
            <S.ServicesSection>
              <S.ServicesSectionHeading>Available Services</S.ServicesSectionHeading>
              <S.ServicesGrid>
                {Object.entries(deptContent.services).map(([name, service]) => (
                  <S.ServiceCard 
                    key={name} 
                    onClick={() => handleServiceCardClick(name)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleServiceCardClick(name);
                      }
                    }}
                  >
                    <S.ServiceCardTitle>{name}</S.ServiceCardTitle>
                    <S.ServiceCardDescription>{service.description}</S.ServiceCardDescription>
                    <S.ServiceCardAction 
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleServiceCardClick(name);
                      }}
                    >
                      View Service →
                    </S.ServiceCardAction>
                  </S.ServiceCard>
                ))}
              </S.ServicesGrid>
            </S.ServicesSection>
          </>
        )}
      </S.ContentBody>
    </S.DepartmentPanel>
  );
};

export default DepartmentContentPanel;
