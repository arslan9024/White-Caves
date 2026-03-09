import React from 'react';
import { Users, CheckCircle, Mail, MessageSquare } from 'lucide-react';

const AssistantsTab = ({ assistants, departments, selectedAssistant, onSelectAssistant }) => {
  return (
    <div className="assistants-view">
      <h3>AI Assistants Registry</h3>
      
      <div className="assistants-grid">
        {assistants.map(assistant => (
          <div
            key={assistant.id}
            className={`assistant-card ${selectedAssistant?.id === assistant.id ? 'selected' : ''}`}
            onClick={() => onSelectAssistant(assistant)}
          >
            <div className="assistant-header">
              <div className="avatar" style={{ background: `hsl(${Math.random() * 360}, 70%, 60%)` }}>
                {assistant.name.charAt(0)}
              </div>
              <div className="assistant-title">
                <h4>{assistant.name}</h4>
                <p className="title">{assistant.title}</p>
              </div>
              <span className={`status-badge status-${assistant.status}`}>
                {assistant.status}
              </span>
            </div>
            <div className="assistant-info">
              <span className="department">{assistant.department}</span>
            </div>
            <div className="assistant-features">
              {assistant.features.slice(0, 2).map((feature, idx) => (
                <div key={idx} className="feature-tag">{feature}</div>
              ))}
              {assistant.features.length > 2 && (
                <div className="feature-tag more">+{assistant.features.length - 2}</div>
              )}
            </div>
            <div className="assistant-connections">
              <span className="connections-label">Connections:</span>
              <span className="connections-count">{assistant.connections.length}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedAssistant && (
        <div className="assistant-details">
          <h4>Details for {selectedAssistant.name}</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Title:</span>
              <span className="value">{selectedAssistant.title}</span>
            </div>
            <div className="detail-item">
              <span className="label">Department:</span>
              <span className="value">{selectedAssistant.department}</span>
            </div>
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className={`value status-${selectedAssistant.status}`}>
                {selectedAssistant.status}
              </span>
            </div>
          </div>
          <div className="features-list">
            <h5>Features:</h5>
            <ul>
              {selectedAssistant.features.map((f, i) => (
                <li key={i}><CheckCircle size={14} /> {f}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantsTab;
