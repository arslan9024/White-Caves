import React from 'react';
import { CheckCircle, AlertCircle, Clock, PhoneOff, Mail } from 'lucide-react';
import './ContactStatusBadge.css';

const ContactStatusBadge = ({ status = 'unknown', size = 'md', showIcon = true }) => {
  const statusConfig = {
    'never-contacted': {
      label: 'Never Contacted',
      color: '#dc2626',
      bgColor: '#fee2e2',
      icon: PhoneOff,
      description: 'No contact history recorded',
    },
    'contacted': {
      label: 'Contacted',
      color: '#EF4444',
      bgColor: '#dbeafe',
      icon: CheckCircle,
      description: 'Initial contact made',
    },
    'follow-up-due': {
      label: 'Follow-up Due',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      icon: Clock,
      description: 'Awaiting follow-up',
    },
    'follow-up-complete': {
      label: 'Follow-up Complete',
      color: '#10b981',
      bgColor: '#ecfdf5',
      icon: CheckCircle,
      description: 'All follow-ups completed',
    },
    'interested': {
      label: 'Interested',
      color: '#06b6d4',
      bgColor: '#cffafe',
      icon: Mail,
      description: 'Owner showed interest',
    },
    'not-interested': {
      label: 'Not Interested',
      color: '#6b7280',
      bgColor: '#f3f4f6',
      icon: AlertCircle,
      description: 'Owner declined interest',
    },
    'unknown': {
      label: 'Unknown',
      color: '#9ca3af',
      bgColor: '#f9fafb',
      icon: AlertCircle,
      description: 'Status not determined',
    },
  };

  const config = statusConfig[status] || statusConfig['unknown'];
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  return (
    <div
      className={`contact-status-badge ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.color,
      }}
      title={config.description}
    >
      {showIcon && <Icon size={getIconSize(size)} style={{ color: config.color }} />}
      <span style={{ color: config.color }}>{config.label}</span>
    </div>
  );
};

const getIconSize = (size) => {
  const sizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  };
  return sizes[size] || 16;
};

export default ContactStatusBadge;
