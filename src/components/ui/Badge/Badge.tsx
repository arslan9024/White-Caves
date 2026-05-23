import React, { type ReactNode, type CSSProperties } from 'react';
import { StyledBadge, BadgeDot, BadgeIcon, BadgeContent } from './Badge.styles';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: string;
  icon?: ReactNode;
  dot?: boolean;
  pulse?: boolean;
  rounded?: boolean;
  className?: string;
}

interface BadgeComponent extends React.FC<BadgeProps> {
  Status: typeof StatusBadge;
  PropertyStatus: typeof PropertyStatusBadge;
  Role: typeof RoleBadge;
  Priority: typeof PriorityBadge;
  Count: typeof CountBadge;
  Department: typeof DepartmentBadge;
}

const Badge: BadgeComponent = ({
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
  const customStyle: CSSProperties = color ? { 
    backgroundColor: `${color}20`, 
    color: color,
    borderColor: `${color}40`
  } : {};

  return (
    <StyledBadge 
      $variant={variant}
      $size={size}
      $rounded={rounded}
      style={customStyle}
      className={className}
      {...props}
    >
      {dot && <BadgeDot $pulse={pulse} style={color ? { backgroundColor: color } : {}} />}
      {icon && <BadgeIcon>{icon}</BadgeIcon>}
      {children && <BadgeContent>{children}</BadgeContent>}
    </StyledBadge>
  );
};

interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot'> {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'active' | 'inactive' | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children, ...props }) => {
  const statusConfig: Record<string, { variant: BadgeVariant; dot: boolean; pulse?: boolean }> = {
    success: { variant: 'success', dot: true },
    warning: { variant: 'warning', dot: true },
    error: { variant: 'error', dot: true },
    info: { variant: 'info', dot: true },
    pending: { variant: 'warning', dot: true, pulse: true },
    active: { variant: 'success', dot: true, pulse: true },
    inactive: { variant: 'default', dot: true }
  };

  const config = statusConfig[status] || statusConfig.info;
  const displayText: ReactNode = children || status;
  return (
    <Badge 
      variant={config.variant}
      dot={config.dot}
      pulse={config.pulse}
      {...props}
    >
      {displayText}
    </Badge>
  );
};

interface PropertyStatusBadgeProps extends Omit<BadgeProps, 'color'> {
  status: 'forSale' | 'forRent' | 'sold' | 'rented' | 'reserved' | 'offPlan' | 'underOffer' | string;
}

const PropertyStatusBadge: React.FC<PropertyStatusBadgeProps> = ({ status, ...props }) => {
  const statusConfig: Record<string, { label: string; color: string }> = {
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

interface RoleBadgeProps extends Omit<BadgeProps, 'color' | 'size'> {
  role: 'owner' | 'admin' | 'agent' | 'tenant' | 'buyer' | 'seller' | 'landlord' | string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, ...props }) => {
  const roleConfig: Record<string, { label: string; color: string }> = {
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

interface PriorityBadgeProps extends Omit<BadgeProps, 'color' | 'pulse' | 'size'> {
  priority: 'critical' | 'high' | 'medium' | 'low' | string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, ...props }) => {
  const priorityConfig: Record<string, { label: string; color: string; pulse?: boolean }> = {
    critical: { label: 'Critical', color: '#DC2626', pulse: true },
    high: { label: 'High', color: '#F59E0B' },
    medium: { label: 'Medium', color: '#3B82F6' },
    low: { label: 'Low', color: '#10B981' }
  };

  const config = priorityConfig[priority] || { label: priority, color: '#6B7280' };
  return <Badge color={config.color} pulse={config.pulse} size="sm" {...props}>{config.label}</Badge>;
};

interface CountBadgeProps extends Omit<BadgeProps, 'variant' | 'size' | 'rounded'> {
  count: number;
  max?: number;
}

const CountBadge: React.FC<CountBadgeProps> = ({ count, max = 99, ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  return (
    <Badge variant="primary" size="xs" rounded {...props}>
      {displayCount}
    </Badge>
  );
};

interface DepartmentBadgeProps extends Omit<BadgeProps, 'color' | 'size'> {
  department: string;
  color?: string;
}

const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({ department, color, ...props }) => {
  return <Badge color={color} size="sm" {...props}>{department}</Badge>;
};

Badge.Status = StatusBadge;
Badge.PropertyStatus = PropertyStatusBadge;
Badge.Role = RoleBadge;
Badge.Priority = PriorityBadge;
Badge.Count = CountBadge;
Badge.Department = DepartmentBadge;

export default Badge;
