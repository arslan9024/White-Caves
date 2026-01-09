import React from 'react';
import { LayoutDashboard, Bot, BarChart3, FileText } from 'lucide-react';
import './MainGridView.css';

const MainGridView = ({ content, activeAssistant, children }) => {
  const renderPlaceholder = () => {
    if (!activeAssistant) {
      return (
        <div className="main-grid-placeholder">
          <div className="placeholder-icon">
            <Bot size={64} strokeWidth={1} />
          </div>
          <h2>Welcome to AI Command Center</h2>
          <p>Select an AI assistant from the sidebar to get started</p>
          <div className="quick-stats">
            <div className="stat-card">
              <LayoutDashboard size={24} />
              <span className="stat-value">24</span>
              <span className="stat-label">AI Assistants</span>
            </div>
            <div className="stat-card">
              <BarChart3 size={24} />
              <span className="stat-value">10</span>
              <span className="stat-label">Departments</span>
            </div>
            <div className="stat-card">
              <FileText size={24} />
              <span className="stat-value">All</span>
              <span className="stat-label">Online</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="main-grid-content">
        <div className="content-header">
          <div className="assistant-context">
            <div 
              className="context-icon" 
              style={{ background: `${activeAssistant.color}20` }}
            >
              <Bot size={24} style={{ color: activeAssistant.color }} />
            </div>
            <div className="context-info">
              <h1>{activeAssistant.name}</h1>
              <p>{activeAssistant.title}</p>
            </div>
          </div>
        </div>

        <div className="content-body">
          {children || (
            <div className="component-placeholder">
              <div className="placeholder-card">
                <h3>{content?.component || 'Dashboard'}</h3>
                <p>
                  This is where the <strong>{content?.component || 'Dashboard'}</strong> component 
                  for <strong>{activeAssistant.name}</strong> would render.
                </p>
                <div className="capabilities">
                  <h4>Capabilities:</h4>
                  <ul>
                    {activeAssistant.capabilities?.slice(0, 5).map((cap, index) => (
                      <li key={index}>{cap.replace(/_/g, ' ')}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="main-grid-view">
      {renderPlaceholder()}
    </div>
  );
};

export default MainGridView;
