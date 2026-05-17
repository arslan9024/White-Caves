import React from 'react';
import { User, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface AgentAssignmentData {
  assignedAgent: string | null;
  setShowAgentAssign: (show: boolean) => void;
  handleAgentAssign: (agentId: string) => void;
}

interface AgentAssignmentTabProps {
  data: AgentAssignmentData;
}

export const AgentAssignmentTab: React.FC<AgentAssignmentTabProps> = ({ data }) => {
  const { assignedAgent, setShowAgentAssign, handleAgentAssign } = data;

  return (
    <div className="agent-assignment-tab">
      <div className="tab-header">
        <h3>Agent Assignment</h3>
        <button className="add-btn">
          <Plus size={18} /> Assign Agent
        </button>
      </div>

      <div className="assignment-cards">
        {assignedAgent ? (
          <div className="agent-card active">
            <div className="agent-avatar">
              <User size={32} />
            </div>
            <div className="agent-details">
              <h4>{assignedAgent || 'Agent Name'}</h4>
              <span className="agent-title">Assigned Agent</span>
              <div className="agent-status">
                <Check size={14} />
                <span>Assigned</span>
              </div>
            </div>
            <button className="remove-btn" title="Remove" aria-label="Remove assigned agent">
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <User size={48} />
            <p>No agent assigned</p>
            <p className="subtext">Click "Assign Agent" to assign a team member</p>
          </div>
        )}
      </div>

      <div className="assignment-settings">
        <h4>Settings</h4>
        <div className="setting-item">
          <input type="checkbox" id="auto-assign" defaultChecked />
          <label htmlFor="auto-assign">Auto-assign conversations based on agent availability</label>
        </div>
        <div className="setting-item">
          <input type="checkbox" id="notify-agent" defaultChecked />
          <label htmlFor="notify-agent">Notify agent of new conversations</label>
        </div>
      </div>
    </div>
  );
};
