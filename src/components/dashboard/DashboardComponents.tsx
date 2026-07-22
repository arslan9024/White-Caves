import React, { FC, ReactNode } from 'react';

/**
 * KPICard Component
 * Displays a single key performance indicator with icon, value, and trend
 *
 * Usage: <KPICard icon="📊" label="Revenue" value="AED 500K" trend="↑ 15%" />
 */
export interface KPICardProps {
  id: string;
  icon: string;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  positive?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}

export const KPICard: FC<KPICardProps> = ({
  icon,
  label,
  value,
  subtext,
  trend,
  positive,
  onClick,
  isLoading,
}) => (
  <button
    className="kpi-card"
    onClick={onClick}
    disabled={isLoading}
    aria-label={`${label}: ${value} ${subtext ? `- ${subtext}` : ''}`}
  >
    <div className="kpi-card__icon" aria-hidden="true">
      {icon}
    </div>
    <div className="kpi-card__content">
      <h3 className="kpi-card__label">{label}</h3>
      <div className="kpi-card__value">{isLoading ? '...' : value}</div>
      {subtext && <p className="kpi-card__subtext">{subtext}</p>}
    </div>
    {trend && (
      <div
        className={`kpi-card__trend ${positive ? 'kpi-card__trend--positive' : 'kpi-card__trend--negative'}`}
      >
        {trend}
      </div>
    )}
  </button>
);

/**
 * TabButton Component
 * Stylized tab/navigation button for dashboard modules
 */
export interface TabButtonProps {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  badge?: string | number;
  variant?: 'default' | 'module' | 'workspace';
}

export const TabButton: FC<TabButtonProps> = ({
  label,
  icon,
  active,
  disabled,
  onClick,
  badge,
  variant = 'default',
}) => (
  <button
    className={`tab-button tab-button--${variant} ${active ? 'tab-button--active' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {icon && (
      <span className="tab-button__icon" aria-hidden="true">
        {icon}
      </span>
    )}
    <span className="tab-button__label">{label}</span>
    {badge && <span className="tab-button__badge">{badge}</span>}
  </button>
);

/**
 * ModuleCard Component
 * Card for displaying CRM module metadata and quick actions
 */
export interface ModuleCardProps {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  zone?: string;
  itemCount?: number;
  onClick: () => void;
  isActive?: boolean;
  isLoading?: boolean;
  isGold?: boolean;
}

export const ModuleCard: FC<ModuleCardProps> = ({
  label,
  description,
  icon,
  zone,
  itemCount,
  onClick,
  isActive,
  isLoading,
  isGold,
}) => (
  <button
    className={`module-card ${isActive ? 'module-card--active' : ''} ${isGold ? 'gold-bordered-card' : ''}`}
    onClick={onClick}
    disabled={isLoading}
    aria-label={`Open ${label} ${itemCount !== undefined ? `(${itemCount} items)` : ''}`}
  >
    {icon && (
      <div className="module-card__icon" aria-hidden="true">
        {icon}
      </div>
    )}
    <div className="module-card__content">
      <h4 className="module-card__title">{label}</h4>
      {description && <p className="module-card__desc">{description}</p>}
      {zone && <span className="module-card__zone">{zone}</span>}
    </div>
    {itemCount !== undefined && <div className="module-card__badge">{itemCount}</div>}
  </button>
);

/**
 * ContentPanel Component
 * Main content area wrapper with consistent styling and error handling
 */
export interface ContentPanelProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export const ContentPanel: FC<ContentPanelProps> = ({
  children,
  title,
  subtitle,
  isLoading,
  error,
  onRetry,
  className,
}) => (
  <div className={`content-panel ${className || ''}`}>
    {(title || subtitle) && (
      <div className="content-panel__header">
        {title && <h2 className="content-panel__title">{title}</h2>}
        {subtitle && <p className="content-panel__subtitle">{subtitle}</p>}
      </div>
    )}

    {error ? (
      <div className="content-panel__error" role="alert">
        <p className="content-panel__error-text">{error}</p>
        {onRetry && (
          <button className="content-panel__retry" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    ) : isLoading ? (
      <div className="content-panel__loading" role="status" aria-live="polite">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    ) : (
      children
    )}
  </div>
);

/**
 * DashboardSection Component
 * Grouped section for related items with expandable header
 */
export interface DashboardSectionProps {
  title: string;
  icon?: string;
  itemCount?: number;
  expanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
  children: ReactNode;
  variant?: 'modules' | 'workspaces' | 'advanced';
}

export const DashboardSection: FC<DashboardSectionProps> = ({
  title,
  icon,
  itemCount,
  expanded = true,
  onToggleExpanded,
  children,
  variant = 'modules',
}) => (
  <section className={`dashboard-section dashboard-section--${variant}`}>
    <button className="dashboard-section__header" onClick={() => onToggleExpanded?.(!expanded)}>
      {icon && (
        <span className="dashboard-section__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="dashboard-section__title">{title}</span>
      {itemCount !== undefined && <span className="dashboard-section__count">{itemCount}</span>}
      <span className="dashboard-section__toggle" aria-hidden="true">
        {expanded ? '▼' : '▶'}
      </span>
    </button>
    {expanded && <div className="dashboard-section__content">{children}</div>}
  </section>
);

/**
 * EmptyState Component
 * Displayed when no data is available
 */
export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: FC<EmptyStateProps> = ({ icon = '○', title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state__icon" aria-hidden="true">
      {icon}
    </div>
    <h3 className="empty-state__title">{title}</h3>
    {description && <p className="empty-state__desc">{description}</p>}
    {action && (
      <button className="empty-state__action" onClick={action.onClick}>
        {action.label}
      </button>
    )}
  </div>
);

/**
 * GridLayout Component
 * Responsive grid for KPI cards, module cards, etc.
 */
export interface GridLayoutProps {
  children: ReactNode;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
}

export const GridLayout: FC<GridLayoutProps> = ({ children, columns = 5, gap = 'md' }) => (
  <div
    className={`grid-layout grid-layout--${columns}col grid-layout--gap-${gap}`}
    role="presentation"
  >
    {children}
  </div>
);

/**
 * Divider Component
 * Visual separator between sections
 */
export const Divider: FC<{ variant?: 'default' | 'subtle' }> = ({ variant = 'default' }) => (
  <hr className={`divider divider--${variant}`} />
);
