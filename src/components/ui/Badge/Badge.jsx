import React from 'react';
import './Badge.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  color,
  icon,
  dot = false,
  pulse = false,
  rounded = true,
  className = '',
  ...props
}) => {
  const badgeClasses = [
    'wc-badge',
    `wc-badge--${variant}`,
    `wc-badge--${size}`,
    dot && 'wc-badge--dot',
    pulse && 'wc-badge--pulse',
    rounded && 'wc-badge--rounded',
    className
  ].filter(Boolean).join(' ');

  const customStyle = color ? { 
    backgroundColor: `${color}20`, 
    color: color,
    borderColor: `${color}40`
  } : {};

  return (
    <span className={badgeClasses} style={customStyle} {...props}>
      {dot && <span className="wc-badge-dot" style={color ? { backgroundColor: color } : {}} />}
      {icon && <span className="wc-badge-icon">{icon}</span>}
      {children && <span className="wc-badge-content">{children}</span>}
    </span>
  );
};

const StatusBadge = ({ status, children, ...props }) => {
  const statusConfig = {
    success: { variant: 'success', dot: true },
    warning: { variant: 'warning', dot: true },
    error: { variant: 'error', dot: true },
    info: { variant: 'info', dot: true },
    pending: { variant: 'warning', dot: true, pulse: true },
    active: { variant: 'success', dot: true, pulse: true },
    inactive: { variant: 'default', dot: true }
  };

  const config = statusConfig[status] || statusConfig.info;
  return <Badge {...config} {...props}>{children || status}</Badge>;
};

const PropertyStatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    forSale: { label: 'For Sale', color: '#10B981' },
    forRent: { label: 'For Rent', color: '#3B82F6' },
    sold: { label: 'Sold', color: '#6B7280' },
    rented: { label: 'Rented', color: '#8B5CF6' },
    reserved: { label: 'Reserved', color: '#F59E0B' },
    offPlan: { label: 'Off-Plan', color: '#EC4899' },
    underOffer: { label: 'Under Offer', color: '#0EA5E9' }
  };

  const config = statusConfig[status] || { label: status, color: '#6B7280' };
  return <Badge color={config.color} {...props}>{config.label}</Badge>;
};

const RoleBadge = ({ role, ...props }) => {
  const roleConfig = {
    owner: { label: 'Owner', color: '#DC2626' },
    admin: { label: 'Admin', color: '#8B5CF6' },
    agent: { label: 'Agent', color: '#3B82F6' },
    tenant: { label: 'Tenant', color: '#10B981' },
    buyer: { label: 'Buyer', color: '#F59E0B' },
    seller: { label: 'Seller', color: '#EC4899' },
    landlord: { label: 'Landlord', color: '#0EA5E9' }
  };

  const config = roleConfig[role] || { label: role, color: '#6B7280' };
  return <Badge color={config.color} size="sm" {...props}>{config.label}</Badge>;
};

const PriorityBadge = ({ priority, ...props }) => {
  const priorityConfig = {
    critical: { label: 'Critical', color: '#DC2626', pulse: true },
    high: { label: 'High', color: '#F59E0B' },
    medium: { label: 'Medium', color: '#3B82F6' },
    low: { label: 'Low', color: '#10B981' }
  };

  const config = priorityConfig[priority] || { label: priority, color: '#6B7280' };
  return <Badge color={config.color} pulse={config.pulse} size="sm" {...props}>{config.label}</Badge>;
};

const CountBadge = ({ count, max = 99, ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  return (
    <Badge variant="primary" size="xs" rounded {...props}>
      {displayCount}
    </Badge>
  );
};

const DepartmentBadge = ({ department, color, ...props }) => {
  return <Badge color={color} size="sm" {...props}>{department}</Badge>;
};

Badge.Status = StatusBadge;
Badge.PropertyStatus = PropertyStatusBadge;
Badge.Role = RoleBadge;
Badge.Priority = PriorityBadge;
Badge.Count = CountBadge;
Badge.Department = DepartmentBadge;

export default Badge;
