import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronRight, Home } from 'lucide-react';
import './CentralPane.css';

/**
 * CentralPane Component
 * 
 * Dynamic content display system supporting multiple view types:
 * - Dashboard View (KPIs, metrics, widgets)
 * - List View (Data tables with pagination)
 * - Detail View (Full object specifications)
 * - Form View (Create/Edit forms)
 * - Analytics View (Charts and reports)
 * - Media View (Gallery, virtual tours)
 * 
 * Updates dynamically based on left sidebar selection
 */

export default function CentralPane({ view, object, children }) {
  const selectedObject = useSelector(state => state.navigation?.selectedObject);
  const currentView = view || 'dashboard';
  
  const getViewComponent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'list':
        return <ListView />;
      case 'detail':
        return <DetailView object={selectedObject} />;
      case 'form':
        return <FormView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'media':
        return <MediaView />;
      default:
        return <DefaultView />;
    }
  };
  
  return (
    <div className="central-pane-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <Home size={16} />
          <span>Dashboard</span>
        </a>
        {selectedObject && (
          <>
            <ChevronRight size={16} />
            <span className="breadcrumb-current">{selectedObject.label}</span>
          </>
        )}
      </div>
      
      {/* Content Area */}
      <div className="pane-content">
        {children || getViewComponent()}
      </div>
    </div>
  );
}

/**
 * DashboardView
 * Displays KPIs, metrics, quick stats, and key performance indicators
 */
function DashboardView() {
  const stats = useSelector(state => state.dashboard?.stats || []);
  
  return (
    <div className="dashboard-view">
      <div className="view-header">
        <h1>Dashboard</h1>
        <p className="view-subtitle">Real-time overview of your real estate operations</p>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">1,247</div>
          <div className="stat-label">Active Listings</div>
          <div className="stat-change positive">+12% this month</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">$45.2M</div>
          <div className="stat-label">Portfolio Value</div>
          <div className="stat-change positive">+8% YoY</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">342</div>
          <div className="stat-label">Active Leads</div>
          <div className="stat-change">+24 this week</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">87%</div>
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-change positive">+3% vs last month</div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Monthly Revenue Trend</h3>
          <div className="chart-placeholder">
            <p>Chart visualization goes here</p>
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Lead Source Distribution</h3>
          <div className="chart-placeholder">
            <p>Chart visualization goes here</p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <p className="activity-title">New lead created</p>
              <p className="activity-time">2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p className="activity-title">Transaction completed</p>
              <p className="activity-time">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ListView
 * Displays filterable, sortable data tables
 */
function ListView() {
  return (
    <div className="list-view">
      <div className="view-header">
        <h1>List View</h1>
      </div>
      <div className="list-placeholder">
        <p>List of items will be displayed here with sorting and filtering</p>
      </div>
    </div>
  );
}

/**
 * DetailView
 * Displays full object specifications and properties
 */
function DetailView({ object }) {
  if (!object) {
    return (
      <div className="detail-view">
        <div className="empty-state">
          <p>Select an object from the sidebar to view details</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="detail-view">
      <div className="view-header">
        <div className="detail-icon">{object.icon}</div>
        <div className="detail-title-block">
          <h1>{object.label}</h1>
          <p className="detail-type">{object.type}</p>
        </div>
      </div>
      
      <div className="detail-content">
        <div className="detail-section">
          <h3>Object Information</h3>
          <dl>
            <dt>ID</dt>
            <dd>{object.id}</dd>
            <dt>Type</dt>
            <dd>{object.type}</dd>
            <dt>Created</dt>
            <dd>January 14, 2026</dd>
            <dt>Status</dt>
            <dd><span className="badge active">Active</span></dd>
          </dl>
        </div>
        
        <div className="detail-section">
          <h3>Relationships</h3>
          <p className="placeholder-text">Related objects and connections will appear here</p>
        </div>
        
        <div className="detail-section">
          <h3>Activity Timeline</h3>
          <div className="timeline">
            <div className="timeline-item">
              <span className="timeline-dot"></span>
              <p>Object created</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * FormView
 * Create/Edit forms with validation
 */
function FormView() {
  return (
    <div className="form-view">
      <div className="view-header">
        <h1>Create/Edit Form</h1>
      </div>
      <div className="form-placeholder">
        <p>Form fields will be rendered here based on object schema</p>
      </div>
    </div>
  );
}

/**
 * AnalyticsView
 * Advanced analytics, reports, and visualizations
 */
function AnalyticsView() {
  return (
    <div className="analytics-view">
      <div className="view-header">
        <h1>Analytics & Reports</h1>
      </div>
      <div className="analytics-placeholder">
        <p>Advanced analytics and reporting features</p>
      </div>
    </div>
  );
}

/**
 * MediaView
 * Gallery, virtual tours, and multimedia content
 */
function MediaView() {
  return (
    <div className="media-view">
      <div className="view-header">
        <h1>Media Gallery</h1>
      </div>
      <div className="media-placeholder">
        <p>Images, videos, and virtual tours will be displayed here</p>
      </div>
    </div>
  );
}

/**
 * DefaultView
 * Fallback view
 */
function DefaultView() {
  return (
    <div className="default-view">
      <div className="welcome-section">
        <h1>Welcome to White Caves</h1>
        <p>Select an object from the left sidebar to get started</p>
      </div>
    </div>
  );
}
