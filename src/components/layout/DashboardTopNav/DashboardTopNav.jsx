import React, { useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Building2, Users, UserPlus, FileText, 
  BarChart3, MessageSquare, Settings, Bot, Shield, Wallet,
  Globe, Calendar, Briefcase, Lock, Sparkles
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
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'vault', label: 'Vault', icon: Lock },
  { id: 'features', label: 'Features', icon: Sparkles },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const DashboardTopNav = ({ activeTab, onTabChange, assistantActive, assistantName }) => {
  const tabsRef = useRef(null);

  useEffect(() => {
    if (tabsRef.current && activeTab) {
      const activeButton = tabsRef.current.querySelector('.nav-tab.active');
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <nav className={`dashboard-top-nav ${assistantActive ? 'assistant-mode' : ''}`}>
      <div className="top-nav-container">
        <div className="nav-tabs" ref={tabsRef}>
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
            <span>{assistantName ? `${assistantName} Active` : 'Assistant Mode'}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardTopNav;
