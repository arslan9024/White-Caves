import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FileText, Activity, Shield, FolderOpen, Layers, PlayCircle,
  RefreshCw, Download, CheckCircle, AlertCircle, Clock, Cpu,
  Code, Database, Server, Zap, TrendingUp, BarChart2
} from 'lucide-react';
import {
  fetchProviders,
  fetchAnalysis,
  fetchAnalysisSummary,
  generateSRS,
  fetchSRSDocuments,
  generateAudit,
  fetchActionCatalog,
  fetchComponentCompletion,
  selectProviders,
  selectAnalysis,
  selectSRS,
  selectAudit,
  selectActions,
  selectComponents,
  selectUI,
  setActiveTab,
  setSRSConfig
} from '../../store/slices/auroraSlice';
import './AuroraAnalysisDashboard.css';

const AuroraAnalysisDashboard = () => {
  const dispatch = useDispatch();
  const providers = useSelector(selectProviders);
  const analysis = useSelector(selectAnalysis);
  const srs = useSelector(selectSRS);
  const audit = useSelector(selectAudit);
  const actions = useSelector(selectActions);
  const components = useSelector(selectComponents);
  const ui = useSelector(selectUI);

  useEffect(() => {
    dispatch(fetchProviders());
    dispatch(fetchAnalysisSummary());
    dispatch(fetchSRSDocuments());
  }, [dispatch]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'audit', label: 'System Audit', icon: Shield },
    { id: 'srs', label: 'SRS Generator', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'components', label: 'Component Tracker', icon: Layers },
    { id: 'actions', label: 'Actions Demo', icon: PlayCircle }
  ];

  const handleTabChange = (tabId) => {
    dispatch(setActiveTab(tabId));
    
    if (tabId === 'components' && components.list.length === 0) {
      dispatch(fetchComponentCompletion());
    }
    if (tabId === 'actions' && actions.catalog.length === 0) {
      dispatch(fetchActionCatalog());
    }
  };

  const renderTabContent = () => {
    switch (ui.activeTab) {
      case 'overview':
        return <OverviewTab analysis={analysis} providers={providers} dispatch={dispatch} />;
      case 'audit':
        return <AuditTab audit={audit} analysis={analysis} dispatch={dispatch} />;
      case 'srs':
        return <SRSGeneratorTab srs={srs} ui={ui} providers={providers} dispatch={dispatch} />;
      case 'documents':
        return <DocumentsTab srs={srs} dispatch={dispatch} />;
      case 'components':
        return <ComponentTrackerTab components={components} dispatch={dispatch} />;
      case 'actions':
        return <ActionsDemoTab actions={actions} dispatch={dispatch} />;
      default:
        return <OverviewTab analysis={analysis} providers={providers} dispatch={dispatch} />;
    }
  };

  return (
    <div className="aurora-analysis-dashboard">
      <div className="aurora-header">
        <div className="aurora-title">
          <Cpu className="aurora-icon" />
          <div>
            <h1>Aurora Self-Analysis & SRS Generator</h1>
            <p>AI-powered code analysis, documentation, and system insights</p>
          </div>
        </div>
        <div className="aurora-providers">
          {providers.available.map(p => (
            <div key={p.id} className="provider-badge" title={p.description}>
              <CheckCircle size={12} />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="aurora-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`aurora-tab ${ui.activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="aurora-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

const OverviewTab = ({ analysis, providers, dispatch }) => {
  const summary = analysis.summary || {};
  
  const handleRefresh = () => {
    dispatch(fetchAnalysis({ refresh: true }));
  };

  return (
    <div className="overview-tab">
      <div className="overview-header">
        <h2>System Overview</h2>
        <button className="btn-refresh" onClick={handleRefresh} disabled={analysis.loading}>
          <RefreshCw size={16} className={analysis.loading ? 'spinning' : ''} />
          {analysis.loading ? 'Analyzing...' : 'Refresh Analysis'}
        </button>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Total Files"
          value={summary.totalFiles || 0}
          icon={Code}
          color="#3B82F6"
        />
        <MetricCard
          title="Total Lines"
          value={(summary.totalLines || 0).toLocaleString()}
          icon={FileText}
          color="#10B981"
        />
        <MetricCard
          title="Components"
          value={summary.components || 0}
          icon={Layers}
          color="#8B5CF6"
        />
        <MetricCard
          title="Routes"
          value={summary.routes || 0}
          icon={Server}
          color="#F59E0B"
        />
        <MetricCard
          title="Models"
          value={summary.models || 0}
          icon={Database}
          color="#EF4444"
        />
        <MetricCard
          title="Services"
          value={summary.services || 0}
          icon={Zap}
          color="#06B6D4"
        />
        <MetricCard
          title="Redux Slices"
          value={summary.reduxSlices || 0}
          icon={Layers}
          color="#EC4899"
        />
        <MetricCard
          title="Completion Score"
          value={`${summary.completionScore || 0}%`}
          icon={TrendingUp}
          color={summary.completionScore >= 80 ? '#10B981' : summary.completionScore >= 50 ? '#F59E0B' : '#EF4444'}
        />
      </div>

      <div className="overview-sections">
        <div className="section">
          <h3>AI Providers Status</h3>
          <div className="providers-list">
            {providers.list.map(p => (
              <div key={p.id} className={`provider-item ${p.available ? 'available' : 'unavailable'}`}>
                <div className="provider-info">
                  {p.available ? <CheckCircle size={16} color="#10B981" /> : <AlertCircle size={16} color="#EF4444" />}
                  <span className="provider-name">{p.name}</span>
                  <span className="provider-model">{p.model}</span>
                </div>
                <div className="provider-stats">
                  <span className="stat success">{p.stats?.success || 0} success</span>
                  <span className="stat failure">{p.stats?.failure || 0} failed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Code Quality Indicators</h3>
          <div className="quality-indicators">
            <div className="indicator">
              <span className="label">TODO Comments</span>
              <span className="value warning">{summary.todos || 0}</span>
            </div>
            <div className="indicator">
              <span className="label">Event Handlers</span>
              <span className="value">{summary.eventHandlers || 0}</span>
            </div>
            <div className="indicator">
              <span className="label">Last Analysis</span>
              <span className="value">{summary.timestamp ? new Date(summary.timestamp).toLocaleTimeString() : 'Never'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditTab = ({ audit, analysis, dispatch }) => {
  const handleRunAudit = () => {
    dispatch(generateAudit());
  };

  return (
    <div className="audit-tab">
      <div className="audit-header">
        <h2>System Audit</h2>
        <button 
          className="btn-run-audit" 
          onClick={handleRunAudit}
          disabled={audit.generating}
        >
          <Shield size={16} />
          {audit.generating ? 'Generating Audit...' : 'Run Full Audit'}
        </button>
      </div>

      {audit.generating && (
        <div className="audit-progress">
          <div className="progress-spinner"></div>
          <p>AI is analyzing your codebase. This may take a minute...</p>
        </div>
      )}

      {audit.report && (
        <div className="audit-report">
          <div className="report-meta">
            <span><Clock size={14} /> Generated by {audit.provider}</span>
            <span><BarChart2 size={14} /> Score: {audit.analysisData?.completionScore}%</span>
          </div>
          <div className="report-content">
            <pre>{audit.report}</pre>
          </div>
        </div>
      )}

      {!audit.report && !audit.generating && (
        <div className="audit-empty">
          <Shield size={48} />
          <h3>No Audit Generated Yet</h3>
          <p>Click "Run Full Audit" to generate a comprehensive analysis of your codebase.</p>
        </div>
      )}
    </div>
  );
};

const SRSGeneratorTab = ({ srs, ui, providers, dispatch }) => {
  const config = ui.srsConfig;

  const handleConfigChange = (key, value) => {
    dispatch(setSRSConfig({ [key]: value }));
  };

  const handleGenerate = () => {
    dispatch(generateSRS(config));
  };

  return (
    <div className="srs-tab">
      <div className="srs-header">
        <h2>SRS Document Generator</h2>
        <button 
          className="btn-generate-srs"
          onClick={handleGenerate}
          disabled={srs.generating}
        >
          <FileText size={16} />
          {srs.generating ? `Generating... ${srs.generationProgress}%` : 'Generate SRS'}
        </button>
      </div>

      <div className="srs-config">
        <div className="config-section">
          <h3>Document Configuration</h3>
          
          <div className="config-group">
            <label>Detail Level</label>
            <select 
              value={config.detailLevel}
              onChange={(e) => handleConfigChange('detailLevel', e.target.value)}
            >
              <option value="executive">Executive Summary</option>
              <option value="standard">Standard Detail</option>
              <option value="detailed">Detailed Technical</option>
              <option value="comprehensive">Comprehensive (All Details)</option>
            </select>
          </div>

          <div className="config-group">
            <label>Output Format</label>
            <select 
              value={config.format}
              onChange={(e) => handleConfigChange('format', e.target.value)}
            >
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
            </select>
          </div>

          <div className="config-group">
            <label>Preferred AI Provider</label>
            <select 
              value={config.preferredProvider || ''}
              onChange={(e) => handleConfigChange('preferredProvider', e.target.value || null)}
            >
              <option value="">Auto (Best Available)</option>
              {providers.available.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.model}</option>
              ))}
            </select>
          </div>

          <div className="config-checkboxes">
            <label>
              <input 
                type="checkbox" 
                checked={config.includeDiagrams}
                onChange={(e) => handleConfigChange('includeDiagrams', e.target.checked)}
              />
              Include Architecture Diagrams
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={config.includeCompliance}
                onChange={(e) => handleConfigChange('includeCompliance', e.target.checked)}
              />
              Include Compliance Sections
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={config.includeArabic}
                onChange={(e) => handleConfigChange('includeArabic', e.target.checked)}
              />
              Include Arabic Translation
            </label>
          </div>
        </div>

        <div className="config-section">
          <h3>Quick Templates</h3>
          <div className="template-buttons">
            <button onClick={() => dispatch(generateSRS({ ...config, detailLevel: 'executive' }))}>
              Executive Summary
            </button>
            <button onClick={() => dispatch(generateSRS({ ...config, detailLevel: 'detailed' }))}>
              Technical Spec
            </button>
            <button onClick={() => dispatch(generateSRS({ ...config, includeCompliance: true }))}>
              Compliance Report
            </button>
          </div>
        </div>
      </div>

      {srs.generating && (
        <div className="srs-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${srs.generationProgress}%` }}></div>
          </div>
          <p>Generating SRS document using AI ensemble...</p>
        </div>
      )}

      {srs.currentDocument && !srs.generating && (
        <div className="srs-preview">
          <div className="preview-header">
            <h3>{srs.currentDocument.title}</h3>
            <span className="version">v{srs.currentDocument.version}</span>
          </div>
          <div className="preview-content">
            <pre>{srs.currentDocument.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentsTab = ({ srs, dispatch }) => {
  useEffect(() => {
    if (srs.documents.length === 0) {
      dispatch(fetchSRSDocuments());
    }
  }, [dispatch, srs.documents.length]);

  return (
    <div className="documents-tab">
      <div className="documents-header">
        <h2>Generated Documents</h2>
        <span className="doc-count">{srs.documents.length} documents</span>
      </div>

      {srs.documents.length === 0 ? (
        <div className="documents-empty">
          <FolderOpen size={48} />
          <h3>No Documents Yet</h3>
          <p>Generate your first SRS document using the SRS Generator tab.</p>
        </div>
      ) : (
        <div className="documents-list">
          {srs.documents.map(doc => (
            <div key={doc.documentId} className="document-card">
              <div className="doc-icon">
                <FileText size={24} />
              </div>
              <div className="doc-info">
                <h4>{doc.title}</h4>
                <div className="doc-meta">
                  <span className="version">v{doc.versionString}</span>
                  <span className="status">{doc.status}</span>
                  <span className="date">{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="doc-stats">
                  <span>{doc.analysisSnapshot?.components || 0} components</span>
                  <span>{doc.analysisSnapshot?.totalFiles || 0} files</span>
                  <span>Score: {doc.analysisSnapshot?.completionScore || 0}%</span>
                </div>
              </div>
              <div className="doc-actions">
                <button className="btn-view">View</button>
                <button className="btn-download"><Download size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ComponentTrackerTab = ({ components, dispatch }) => {
  const handleScan = () => {
    dispatch(fetchComponentCompletion());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return '#10B981';
      case 'partial': return '#F59E0B';
      case 'under-construction': return '#3B82F6';
      case 'empty': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="components-tab">
      <div className="components-header">
        <h2>Component Completion Tracker</h2>
        <button className="btn-scan" onClick={handleScan} disabled={components.loading}>
          <RefreshCw size={16} className={components.loading ? 'spinning' : ''} />
          {components.loading ? 'Scanning...' : 'Scan Components'}
        </button>
      </div>

      {Object.keys(components.summary).length > 0 && (
        <div className="completion-summary">
          {Object.entries(components.summary).map(([status, data]) => (
            <div key={status} className="summary-card" style={{ borderColor: getStatusColor(status) }}>
              <span className="status-label">{status.replace('-', ' ')}</span>
              <span className="status-count">{data.count}</span>
              <span className="status-avg">Avg: {data.avgScore}%</span>
            </div>
          ))}
        </div>
      )}

      {components.list.length > 0 && (
        <div className="components-list">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Path</th>
                <th>Score</th>
                <th>Status</th>
                <th>Handlers</th>
                <th>Issues</th>
              </tr>
            </thead>
            <tbody>
              {components.list.map((comp, idx) => (
                <tr key={idx}>
                  <td className="comp-name">{comp.name}</td>
                  <td className="comp-path">{comp.path}</td>
                  <td>
                    <span className="score" style={{ color: getStatusColor(comp.status) }}>
                      {comp.score}%
                    </span>
                  </td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(comp.status) }}>
                      {comp.status}
                    </span>
                  </td>
                  <td>{comp.handlers}</td>
                  <td>
                    {comp.hasPlaceholders && <span className="issue">Placeholders</span>}
                    {comp.hasMockData && <span className="issue">Mock Data</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {components.list.length === 0 && !components.loading && (
        <div className="components-empty">
          <Layers size={48} />
          <h3>No Component Data</h3>
          <p>Click "Scan Components" to analyze your project's component completion status.</p>
        </div>
      )}
    </div>
  );
};

const ActionsDemoTab = ({ actions, dispatch }) => {
  useEffect(() => {
    if (actions.catalog.length === 0) {
      dispatch(fetchActionCatalog());
    }
  }, [dispatch, actions.catalog.length]);

  return (
    <div className="actions-tab">
      <div className="actions-header">
        <h2>Actions & Events Demo</h2>
        <div className="actions-stats">
          <span>{actions.summary.totalActions || 0} total actions</span>
          <span className="success">{actions.summary.implemented || 0} implemented</span>
          <span className="warning">{actions.summary.placeholders || 0} placeholders</span>
        </div>
      </div>

      {actions.summary.byType && (
        <div className="actions-by-type">
          {Object.entries(actions.summary.byType).map(([type, count]) => (
            <div key={type} className="type-badge">
              <span className="type-name">{type}</span>
              <span className="type-count">{count}</span>
            </div>
          ))}
        </div>
      )}

      <div className="actions-catalog">
        {actions.catalog.map((comp, idx) => (
          <div key={idx} className="action-component">
            <div className="comp-header">
              <Code size={16} />
              <span className="comp-name">{comp.component}</span>
              <span className="comp-type">{comp.type}</span>
              <span className="action-count">{comp.actions.length} actions</span>
            </div>
            <div className="comp-actions">
              {comp.actions.map((action, aIdx) => (
                <div key={aIdx} className={`action-item ${action.status}`}>
                  <span className="action-type">{action.type}</span>
                  <span className="action-handler">{action.handler.substring(0, 50)}</span>
                  <span className={`action-status ${action.status}`}>{action.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {actions.catalog.length === 0 && !actions.loading && (
        <div className="actions-empty">
          <PlayCircle size={48} />
          <h3>No Actions Scanned</h3>
          <p>Event handlers and actions will appear here after analysis.</p>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="metric-card" style={{ borderColor: color }}>
    <div className="metric-icon" style={{ backgroundColor: `${color}20`, color }}>
      <Icon size={20} />
    </div>
    <div className="metric-content">
      <span className="metric-value">{value}</span>
      <span className="metric-title">{title}</span>
    </div>
  </div>
);

export default AuroraAnalysisDashboard;
