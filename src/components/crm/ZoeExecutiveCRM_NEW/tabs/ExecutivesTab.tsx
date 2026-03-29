import React from 'react';
import { Phone, Mail, Video, MessageCircle, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Executive {
  id: string | number;
  name: string;
  role: string;
  avatar: string;
  status: string;
}

interface ExecutivesTabProps {
  executives: Executive[];
}

const ExecutivesTab = ({ executives }: ExecutivesTabProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} className="status-available" />;
      case 'in_meeting': return <Clock size={16} className="status-in-meeting" />;
      case 'busy': return <AlertCircle size={16} className="status-busy" />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'available': return '#10B981';
      case 'in_meeting': return '#F59E0B';
      case 'busy': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="executives-view">
      <h3>Executive Team</h3>
      <div className="executives-grid">
        {executives.map(executive => (
          <div key={executive.id} className="executive-card">
            <div className="executive-avatar">{executive.avatar}</div>
            <div className="executive-info">
              <h4>{executive.name}</h4>
              <p>{executive.role}</p>
              <div className="executive-status">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(executive.status) }}
                >
                  {getStatusIcon(executive.status)}
                  {executive.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="executive-actions">
              <button title="Call"><Phone size={16} /></button>
              <button title="Email"><Mail size={16} /></button>
              <button title="Video Call"><Video size={16} /></button>
              <button title="Message"><MessageCircle size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutivesTab;
