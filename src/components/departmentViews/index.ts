/**
 * Department Views Index
 * Central export point for all department view components
 * Used by DynamicContentRouter for dynamic view rendering
 */

export { default as ExecutiveView } from './ExecutiveView';
export { default as SalesView } from './SalesView';
export { default as OperationsView } from './OperationsView';
export { default as PropertyManagementView } from './PropertyManagementView';
export { default as FinanceView } from './FinanceView';
export { default as ComplianceView } from './ComplianceView';
export { default as AnalyticsView } from './AnalyticsView';
export { default as TechnologyView } from './TechnologyView';
export { default as MarketingView } from './MarketingView';
export { default as HRView } from './HRView';

/**
 * Component Mapping
 * Maps component names from departmentContentMap to actual components
 * Used for dynamic component rendering
 */
export const departmentViewComponents: Record<string, React.ComponentType<any>> = {
  ExecutiveView: require('./ExecutiveView').default,
  SalesView: require('./SalesView').default,
  OperationsView: require('./OperationsView').default,
  PropertyManagementView: require('./PropertyManagementView').default,
  FinanceView: require('./FinanceView').default,
  ComplianceView: require('./ComplianceView').default,
  AnalyticsView: require('./AnalyticsView').default,
  TechnologyView: require('./TechnologyView').default,
  MarketingView: require('./MarketingView').default,
  HRView: require('./HRView').default,
};
