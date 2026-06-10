import React, { useState, useMemo } from 'react';
import {
  Palette, Layout, Smartphone, Monitor, Eye, Zap,
  Box, Layers, Code, Accessibility, Sun, Moon,
  BarChart3, TrendingUp, CheckCircle, AlertTriangle,
  RefreshCw, Package, FileCode, Cpu, Settings
} from 'lucide-react';
import { AssistantDocsTab } from './shared';
import './AssistantDashboard.css';

const COMPONENT_LIBRARY = [
  { name: 'StatCard', category: 'Data Display', usage: 47, status: 'stable', a11y: 'AAA' },
  { name: 'AIAssistantCard', category: 'AI Components', usage: 12, status: 'stable', a11y: 'AAA' },
  { name: 'KPIWidget', category: 'Analytics', usage: 23, status: 'stable', a11y: 'AA' },
  { name: 'DataGridView', category: 'Data Display', usage: 15, status: 'stable', a11y: 'AAA' },
  { name: 'ActivityTimeline', category: 'Timeline', usage: 8, status: 'stable', a11y: 'AA' },
  { name: 'NotificationBadge', category: 'Alerts', usage: 34, status: 'stable', a11y: 'AAA' },
  { name: 'ExecutiveKPIWidget', category: 'Analytics', usage: 6, status: 'new', a11y: 'AAA' },
  { name: 'GlobalAlertStream', category: 'Alerts', usage: 4, status: 'new', a11y: 'AA' }
];

const DESIGN_TOKENS = {
  colors: { primary: '#D32F2F', secondary: '#1A1A2E', accent: '#43E97B', surface: '#16213E' },
  typography: { heading: 'Montserrat', body: 'Open Sans', mono: 'JetBrains Mono' },
  spacing: ['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px'],
  radius: ['4px', '8px', '12px', '16px', '24px', '9999px']
};

const PERFORMANCE_METRICS = [
  { metric: 'Lighthouse Score', value: 94, target: 95, trend: 'up' },
  { metric: 'First Contentful Paint', value: '1.2s', target: '1.0s', trend: 'stable' },
  { metric: 'Time to Interactive', value: '2.1s', target: '2.0s', trend: 'up' },
  { metric: 'Cumulative Layout Shift', value: 0.02, target: 0.1, trend: 'stable' },
  { metric: 'Bundle Size', value: '7.9 MB', target: '6.0 MB', trend: 'down' }
];

const ACCESSIBILITY_AUDIT = [
  { category: 'Color Contrast', score: 98, issues: 2, status: 'pass' },
  { category: 'Keyboard Navigation', score: 100, issues: 0, status: 'pass' },
  { category: 'ARIA Labels', score: 95, issues: 5, status: 'pass' },
  { category: 'Focus Management', score: 92, issues: 4, status: 'warning' },
  { category: 'Semantic HTML', score: 97, issues: 3, status: 'pass' }
];

const HazelFrontendCRM = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [themeMode, setThemeMode] = useState('dark');

  const componentStats = useMemo(() => ({
    total: COMPONENT_LIBRARY.length,
    stable: COMPONENT_LIBRARY.filter(c => c.status === 'stable').length,
    new: COMPONENT_LIBRARY.filter(c => c.status === 'new').length,
    totalUsage: COMPONENT_LIBRARY.reduce((sum, c) => sum + c.usage, 0)
  }), []);

  return (
    <div className="assistant-dashboard hazel">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)' }}>
          <Palette size={28} />
        </div>
        <div className="assistant-info">
          <h2>Hazel - Elite Frontend Engineer</h2>
          <p>Design system, component library, and UI performance optimization</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card highlight">
          <div className="stat-icon" style={{ background: 'rgba(244, 114, 182, 0.2)', color: '#F472B6' }}>
            <Package size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{componentStats.total}</span>
            <span className="stat-label">Components</span>
          </div>
          <span className="stat-change positive">+{componentStats.new} new</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}>
            <Accessibility size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">98%</span>
            <span className="stat-label">A11y Score</span>
          </div>
          <span className="stat-change positive">AAA</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.2)', color: '#FB923C' }}>
            <Zap size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">94</span>
            <span className="stat-label">Lighthouse</span>
          </div>
          <span className="stat-change positive">+2</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Box size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{componentStats.totalUsage}</span>
            <span className="stat-label">Usages</span>
          </div>
        </div>
      </div>

      <div className="assistant-tabs">
        {['overview', 'components', 'design-system', 'performance', 'accessibility', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <BarChart3 size={14} />}
            {tab === 'components' && <Package size={14} />}
            {tab === 'design-system' && <Palette size={14} />}
            {tab === 'performance' && <Zap size={14} />}
            {tab === 'accessibility' && <Accessibility size={14} />}
            {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="overview-section">
              <h3><Package size={16} /> Component Library Status</h3>
              <div className="status-grid">
                <div className="status-item success">
                  <CheckCircle size={16} />
                  <span>{componentStats.stable} Stable</span>
                </div>
                <div className="status-item info">
                  <TrendingUp size={16} />
                  <span>{componentStats.new} New</span>
                </div>
              </div>
            </div>
            <div className="overview-section">
              <h3><Zap size={16} /> Performance Summary</h3>
              <div className="metrics-list">
                {PERFORMANCE_METRICS.slice(0, 3).map(m => (
                  <div key={m.metric} className="metric-row">
                    <span className="metric-name">{m.metric}</span>
                    <span className={`metric-value ${m.trend}`}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="components-view">
            <div className="components-header">
              <h3>Component Library</h3>
              <button className="add-btn"><Package size={14} /> Add Component</button>
            </div>
            <div className="components-grid">
              {COMPONENT_LIBRARY.map(component => (
                <div key={component.name} className={`component-card ${component.status}`}>
                  <div className="component-header">
                    <FileCode size={18} />
                    <span className="component-name">{component.name}</span>
                    <span className={`status-badge ${component.status}`}>{component.status}</span>
                  </div>
                  <div className="component-meta">
                    <span className="category">{component.category}</span>
                    <span className="usage">{component.usage} usages</span>
                    <span className={`a11y-badge ${component.a11y.toLowerCase()}`}>{component.a11y}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'design-system' && (
          <div className="design-system-view">
            <div className="token-section">
              <h3><Palette size={16} /> Color Tokens</h3>
              <div className="color-tokens">
                {Object.entries(DESIGN_TOKENS.colors).map(([name, value]) => (
                  <div key={name} className="color-token">
                    <div className="color-swatch" style={{ background: value }}></div>
                    <span className="token-name">{name}</span>
                    <span className="token-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="token-section">
              <h3><Code size={16} /> Typography</h3>
              <div className="typography-tokens">
                {Object.entries(DESIGN_TOKENS.typography).map(([role, font]) => (
                  <div key={role} className="typography-token">
                    <span className="token-name">{role}</span>
                    <span className="token-value" style={{ fontFamily: font }}>{font}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="theme-toggle">
              <h3><Sun size={16} /> Theme Mode</h3>
              <div className="toggle-buttons">
                <button className={themeMode === 'light' ? 'active' : ''} onClick={() => setThemeMode('light')}>
                  <Sun size={14} /> Light
                </button>
                <button className={themeMode === 'dark' ? 'active' : ''} onClick={() => setThemeMode('dark')}>
                  <Moon size={14} /> Dark
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-view">
            <h3><BarChart3 size={16} /> Performance Metrics</h3>
            <div className="performance-grid">
              {PERFORMANCE_METRICS.map(metric => (
                <div key={metric.metric} className="performance-card">
                  <div className="perf-header">
                    <span className="perf-name">{metric.metric}</span>
                    <span className={`trend-indicator ${metric.trend}`}>
                      {metric.trend === 'up' && <TrendingUp size={14} />}
                      {metric.trend === 'down' && <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />}
                      {metric.trend === 'stable' && <span>—</span>}
                    </span>
                  </div>
                  <div className="perf-value">{metric.value}</div>
                  <div className="perf-target">Target: {metric.target}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="accessibility-view">
            <h3><Accessibility size={16} /> Accessibility Audit</h3>
            <div className="audit-grid">
              {ACCESSIBILITY_AUDIT.map(audit => (
                <div key={audit.category} className={`audit-card ${audit.status}`}>
                  <div className="audit-header">
                    <span className="audit-category">{audit.category}</span>
                    <span className={`audit-status ${audit.status}`}>
                      {audit.status === 'pass' && <CheckCircle size={16} />}
                      {audit.status === 'warning' && <AlertTriangle size={16} />}
                    </span>
                  </div>
                  <div className="audit-score">{audit.score}%</div>
                  <div className="audit-issues">{audit.issues} issues</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && <AssistantDocsTab assistantId="hazel" />}
      </div>
    </div>
  );
};

export default HazelFrontendCRM;
