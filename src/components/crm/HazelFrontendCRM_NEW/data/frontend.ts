export interface ComponentEntry {
  name: string;
  category: string;
  usage: number;
  status: string;
  a11y: string;
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, string>;
  spacing: string[];
  radius: string[];
}

export interface PerformanceMetric {
  metric: string;
  value: number | string;
  target: number | string;
  trend: string;
}

export interface AccessibilityAuditEntry {
  category: string;
  score: number;
  issues: number;
  status: string;
}

export const COMPONENT_LIBRARY: ComponentEntry[] = [
  { name: 'StatCard', category: 'Data Display', usage: 47, status: 'stable', a11y: 'AAA' },
  { name: 'AIAssistantCard', category: 'AI Components', usage: 12, status: 'stable', a11y: 'AAA' },
  { name: 'KPIWidget', category: 'Analytics', usage: 23, status: 'stable', a11y: 'AA' },
  { name: 'DataGridView', category: 'Data Display', usage: 15, status: 'stable', a11y: 'AAA' },
  { name: 'ActivityTimeline', category: 'Timeline', usage: 8, status: 'stable', a11y: 'AA' },
  { name: 'NotificationBadge', category: 'Alerts', usage: 34, status: 'stable', a11y: 'AAA' },
  { name: 'ExecutiveKPIWidget', category: 'Analytics', usage: 6, status: 'new', a11y: 'AAA' },
  { name: 'GlobalAlertStream', category: 'Alerts', usage: 4, status: 'new', a11y: 'AA' }
];

export const DESIGN_TOKENS: DesignTokens = {
  colors: { primary: '#D32F2F', secondary: '#1A1A2E', accent: '#43E97B', surface: '#16213E' },
  typography: { heading: 'Montserrat', body: 'Open Sans', mono: 'JetBrains Mono' },
  spacing: ['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px'],
  radius: ['4px', '8px', '12px', '16px', '24px', '9999px']
};

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  { metric: 'Lighthouse Score', value: 94, target: 95, trend: 'up' },
  { metric: 'First Contentful Paint', value: '1.2s', target: '1.0s', trend: 'stable' },
  { metric: 'Time to Interactive', value: '2.1s', target: '2.0s', trend: 'up' },
  { metric: 'Cumulative Layout Shift', value: 0.02, target: 0.1, trend: 'stable' },
  { metric: 'Bundle Size', value: '7.9 MB', target: '6.0 MB', trend: 'down' }
];

export const ACCESSIBILITY_AUDIT: AccessibilityAuditEntry[] = [
  { category: 'Color Contrast', score: 98, issues: 2, status: 'pass' },
  { category: 'Keyboard Navigation', score: 100, issues: 0, status: 'pass' },
  { category: 'ARIA Labels', score: 95, issues: 5, status: 'pass' },
  { category: 'Focus Management', score: 92, issues: 4, status: 'warning' },
  { category: 'Semantic HTML', score: 97, issues: 3, status: 'pass' }
];
