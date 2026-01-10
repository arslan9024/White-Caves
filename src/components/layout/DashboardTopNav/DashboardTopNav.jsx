import React from 'react';
import { 
  LayoutDashboard, Building2, Users, UserPlus, FileText, 
  BarChart3, MessageSquare, Settings, Bot, Shield
} from 'lucide-react';
import './DashboardTopNav.css';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'leads', label: 'Leads', icon: UserPlus },
  { id: 'contracts', label: 'Contracts', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'users', label: 'Users', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const DashboardTopNav = ({ activeTab, onTabChange, assistantActive }) => {
  return (
    <nav className={`dashboard-top-nav ${assistantActive ? 'assistant-mode' : ''}`}>
      <div className="top-nav-container">
        <div className="nav-tabs">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        {assistantActive && (
          <div className="assistant-indicator">
            <Bot size={14} />
            <span>Assistant Mode</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardTopNav;
