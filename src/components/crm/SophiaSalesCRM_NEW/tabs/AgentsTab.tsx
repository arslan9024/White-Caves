import React from 'react';
import { Target, DollarSign, TrendingUp } from 'lucide-react';

interface Agent {
  id: string | number;
  avatar: string;
  name: string;
  deals: number;
  value: string | number;
  conversion: number;
}

interface AgentsTabProps {
  agents: Agent[];
}

const AgentsTab: React.FC<AgentsTabProps> = ({ agents }) => {
  return (
    <div className="agents-view">
      <h3>Agent Performance</h3>
      <div className="agent-cards">
        {agents.map((agent: Agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-avatar">{agent.avatar}</div>
            <div className="agent-info">
              <h4>{agent.name}</h4>
              <div className="agent-stats">
                <span><Target size={12} /> {agent.deals} deals</span>
                <span><DollarSign size={12} /> {agent.value}</span>
                <span><TrendingUp size={12} /> {agent.conversion}% conv.</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsTab;
