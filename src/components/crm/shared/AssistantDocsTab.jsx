import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle, Clock, AlertCircle, Calendar,
  ArrowRight, ExternalLink, GitBranch, Zap, Target,
  ChevronDown, ChevronUp, FileText, Layers, Settings
} from 'lucide-react';
import { getAssistantDocs } from '../../../config/assistantDocs';
import './AssistantDocsTab.css';

const AssistantDocsTab = ({ assistantId, assistantName: propName, assistantColor: propColor }) => {
  const [expandedSection, setExpandedSection] = useState('features');
  const docs = getAssistantDocs(assistantId);
  
  const assistantName = propName || docs?.name || assistantId;
  const assistantColor = propColor || docs?.color || '#8B5CF6';

  if (!docs) {
    return (
      <div className="docs-tab-empty">
        <BookOpen size={48} />
        <h3>Documentation Coming Soon</h3>
        <p>Documentation for {assistantName} is being prepared.</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={14} className="status-active" />;
      case 'beta': return <AlertCircle size={14} className="status-beta" />;
      case 'planned': return <Clock size={14} className="status-planned" />;
      default: return <CheckCircle size={14} />;
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="assistant-docs-tab">
      <div className="docs-header" style={{ borderColor: assistantColor }}>
        <div className="docs-title">
          <BookOpen size={24} style={{ color: assistantColor }} />
          <div>
            <h2>{assistantName} Documentation</h2>
            <span className="docs-meta">
              Version {docs.version} • {docs.phase}
            </span>
          </div>
        </div>
      </div>

      <div className="docs-overview">
        <p>{docs.overview}</p>
      </div>

      <div className="docs-sections">
        <div className={`docs-section ${expandedSection === 'features' ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('features')}>
            <div className="section-title">
              <Zap size={18} style={{ color: assistantColor }} />
              <h3>Active Features ({docs.features.length})</h3>
            </div>
            {expandedSection === 'features' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {expandedSection === 'features' && (
            <div className="section-content">
              <div className="features-grid">
                {docs.features.map((feature, idx) => (
                  <div key={idx} className="feature-card">
                    <div className="feature-header">
                      {getStatusIcon(feature.status)}
                      <span className="feature-name">{feature.name}</span>
                      <span className={`feature-status ${feature.status}`}>{feature.status}</span>
                    </div>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`docs-section ${expandedSection === 'roadmap' ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('roadmap')}>
            <div className="section-title">
              <Target size={18} style={{ color: assistantColor }} />
              <h3>Roadmap ({docs.roadmap.length} items)</h3>
            </div>
            {expandedSection === 'roadmap' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {expandedSection === 'roadmap' && (
            <div className="section-content">
              <div className="roadmap-timeline">
                {docs.roadmap.map((item, idx) => (
                  <div key={idx} className="roadmap-item">
                    <div className="roadmap-marker" style={{ background: assistantColor }} />
                    <div className="roadmap-content">
                      <span className="roadmap-quarter">{item.quarter}</span>
                      <span className="roadmap-feature">{item.feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`docs-section ${expandedSection === 'integrations' ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('integrations')}>
            <div className="section-title">
              <GitBranch size={18} style={{ color: assistantColor }} />
              <h3>Integrations ({docs.integrations.length})</h3>
            </div>
            {expandedSection === 'integrations' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {expandedSection === 'integrations' && (
            <div className="section-content">
              <div className="integrations-list">
                {docs.integrations.map((integration, idx) => (
                  <div key={idx} className="integration-badge">
                    <ExternalLink size={12} />
                    {integration}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`docs-section ${expandedSection === 'dataflows' ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('dataflows')}>
            <div className="section-title">
              <Layers size={18} style={{ color: assistantColor }} />
              <h3>Data Flows</h3>
            </div>
            {expandedSection === 'dataflows' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {expandedSection === 'dataflows' && (
            <div className="section-content">
              <div className="dataflows-container">
                <div className="dataflow-group">
                  <h4>Receives Data From</h4>
                  <div className="dataflow-items">
                    {docs.dataFlows.inputs.length > 0 ? (
                      docs.dataFlows.inputs.map((input, idx) => (
                        <span key={idx} className="dataflow-badge input">
                          <ArrowRight size={12} /> {input}
                        </span>
                      ))
                    ) : (
                      <span className="dataflow-empty">No inputs</span>
                    )}
                  </div>
                </div>
                <div className="dataflow-group">
                  <h4>Sends Data To</h4>
                  <div className="dataflow-items">
                    {docs.dataFlows.outputs.length > 0 ? (
                      docs.dataFlows.outputs.map((output, idx) => (
                        <span key={idx} className="dataflow-badge output">
                          {output} <ArrowRight size={12} />
                        </span>
                      ))
                    ) : (
                      <span className="dataflow-empty">No outputs</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistantDocsTab;
