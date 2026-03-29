import React from 'react';
import { Accessibility, CheckCircle, AlertTriangle } from 'lucide-react';

interface AuditItem {
  category: string;
  status: string;
  score: number;
  issues: number;
}

interface AccessibilityTabProps {
  audit: AuditItem[];
}

const AccessibilityTab: React.FC<AccessibilityTabProps> = ({ audit }) => {
  return (
    <div className="accessibility-view">
      <h3>Accessibility Audit</h3>
      
      <div className="audit-grid">
        {audit.map((item: AuditItem) => (
          <div key={item.category} className={`audit-card status-${item.status}`}>
            <div className="audit-header">
              <div className="audit-title">
                <Accessibility size={16} />
                <span>{item.category}</span>
              </div>
              <span className={`status-badge status-${item.status}`}>
                {item.status}
              </span>
            </div>
            
            <div className="audit-score">
              <div className="score-display">
                <span className="score">{item.score}%</span>
              </div>
              <div className="score-bar">
                <div 
                  className={`bar-fill ${item.status}`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>

            <div className="audit-issues">
              {item.issues > 0 ? (
                <>
                  <AlertTriangle size={14} />
                  <span>{item.issues} issues</span>
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  <span>No issues</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="audit-summary">
        <h4>WCAG 2.1 Compliance</h4>
        <div className="compliance-checklist">
          <div className="checklist-item level-a">
            <CheckCircle size={16} />
            <span>WCAG 2.1 Level A - Compliant</span>
          </div>
          <div className="checklist-item level-aa">
            <CheckCircle size={16} />
            <span>WCAG 2.1 Level AA - Compliant</span>
          </div>
          <div className="checklist-item level-aaa">
            <span>🎯</span>
            <span>WCAG 2.1 Level AAA - In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityTab;
