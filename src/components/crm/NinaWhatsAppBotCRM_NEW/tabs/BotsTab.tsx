import React from 'react';
import { Plus, Trash2, Power, Activity, MoreVertical, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Bot {
  id: string | number;
  name: string;
  number: string;
  status: string;
  messagesProcessed: number;
  responseRate: number;
  avgResponseTime: string;
  uptime: string;
  features: string[];
}

interface BotsData {
  filteredBots: Bot[];
  selectedBot: Bot | null;
  setSelectedBot: (bot: Bot | null) => void;
  handleAddBot: () => void;
  handleDeleteBot: (id: string | number) => void;
  handleToggleBotStatus: (id: string | number) => void;
  getStatusColor: (status: string) => string;
}

interface BotsTabProps {
  data: BotsData;
}

export const BotsTab: React.FC<BotsTabProps> = ({ data }) => {
  const { filteredBots, selectedBot, setSelectedBot, handleAddBot, handleDeleteBot, handleToggleBotStatus, getStatusColor } = data;

  return (
    <div className="bots-tab">
      <div className="tab-header">
        <h3>WhatsApp Bot Sessions</h3>
        <button className="add-btn" onClick={handleAddBot}>
          <Plus size={18} /> Add Bot
        </button>
      </div>

      <div className="bots-grid">
        {filteredBots.map((bot: Bot) => (
          <div key={bot.id} className={`bot-card ${selectedBot?.id === bot.id ? 'selected' : ''}`}>
            <div className="bot-header">
              <h4>{bot.name}</h4>
              <div className="bot-actions">
                <button className="action-btn" title="More options">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="bot-status">
              <span className="status-badge" style={{ backgroundColor: getStatusColor(bot.status) }}>
                <span className="dot"></span>
                {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
              </span>
              <span className="bot-number">{bot.number}</span>
            </div>

            <div className="bot-metrics">
              <div className="metric">
                <span className="label">Messages</span>
                <span className="value">{bot.messagesProcessed}</span>
              </div>
              <div className="metric">
                <span className="label">Response Rate</span>
                <span className="value">{bot.responseRate}%</span>
              </div>
              <div className="metric">
                <span className="label">Avg Response</span>
                <span className="value">{bot.avgResponseTime}</span>
              </div>
              <div className="metric">
                <span className="label">Uptime</span>
                <span className="value">{bot.uptime}</span>
              </div>
            </div>

            <div className="bot-features">
              {bot.features.map((feature: string) => (
                <span key={feature} className="feature-tag">{feature}</span>
              ))}
            </div>

            <div className="bot-actions-row">
              <button
                className="action-btn toggle"
                onClick={() => handleToggleBotStatus(bot.id)}
                title={bot.status === 'connected' ? 'Disconnect' : 'Connect'}
              >
                <Power size={16} />
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleDeleteBot(bot.id)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
