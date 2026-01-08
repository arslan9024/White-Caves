import React from 'react';
import './EmptyState.css';

const ROLE_ILLUSTRATIONS = {
  buyer: { emoji: '🏠', color: '#3b82f6' },
  seller: { emoji: '💰', color: '#10b981' },
  landlord: { emoji: '🏢', color: '#8b5cf6' },
  tenant: { emoji: '🔑', color: '#06b6d4' },
  'leasing-agent': { emoji: '📋', color: '#f59e0b' },
  'secondary-sales-agent': { emoji: '📊', color: '#ef4444' },
  owner: { emoji: '👑', color: '#ffd700' },
  default: { emoji: '📁', color: '#6b7280' },
};

const DEFAULT_MESSAGES = {
  properties: {
    title: 'No Properties Yet',
    description: 'Start by adding your first property to your portfolio.',
    action: 'Add Property',
  },
  appointments: {
    title: 'No Appointments',
    description: 'Schedule your first appointment to get started.',
    action: 'Schedule Appointment',
  },
  leads: {
    title: 'No Leads Found',
    description: 'Your leads will appear here once they come in.',
    action: 'Import Leads',
  },
  contracts: {
    title: 'No Contracts',
    description: 'Contracts will be displayed here once created.',
    action: 'Create Contract',
  },
  transactions: {
    title: 'No Transactions',
    description: 'Your transaction history will appear here.',
    action: null,
  },
  messages: {
    title: 'No Messages',
    description: 'Start a conversation or wait for incoming messages.',
    action: 'New Message',
  },
  default: {
    title: 'No Data Available',
    description: 'There is nothing to display at the moment.',
    action: null,
  },
};

export default function EmptyState({
  type = 'default',
  role = 'default',
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
  compact = false,
}) {
  const roleConfig = ROLE_ILLUSTRATIONS[role] || ROLE_ILLUSTRATIONS.default;
  const messageConfig = DEFAULT_MESSAGES[type] || DEFAULT_MESSAGES.default;

  const displayTitle = title || messageConfig.title;
  const displayDescription = description || messageConfig.description;
  const displayAction = actionLabel || messageConfig.action;
  const displayIcon = icon || roleConfig.emoji;

  return (
    <div className={`empty-state ${compact ? 'compact' : ''} ${className}`}>
      <div className="empty-state-content">
        <div 
          className="empty-state-illustration"
          style={{ '--accent-color': roleConfig.color }}
        >
          <span className="empty-state-emoji">{displayIcon}</span>
          <div className="empty-state-circles">
            <span className="circle circle-1"></span>
            <span className="circle circle-2"></span>
            <span className="circle circle-3"></span>
          </div>
        </div>
        
        <h3 className="empty-state-title">{displayTitle}</h3>
        <p className="empty-state-description">{displayDescription}</p>
        
        {displayAction && onAction && (
          <button 
            className="empty-state-action"
            onClick={onAction}
            style={{ backgroundColor: roleConfig.color }}
          >
            {displayAction}
          </button>
        )}
      </div>
    </div>
  );
}
