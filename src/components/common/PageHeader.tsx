import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  PageHeaderWrapper,
  Breadcrumbs,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbCurrent,
  HeaderMain,
  HeaderContent,
  HeaderSubtitle,
  HeaderActions,
  StyledActionButton,
  ActionButtonLink,
  ButtonIcon,
  ButtonLabel,
} from './PageHeader.styles';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({ 
  title, 
  subtitle,
  breadcrumbs,
  actions,
  className = ''
}: PageHeaderProps) {
  return (
    <PageHeaderWrapper className={className}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path || index}>
              {index > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
              {crumb.path ? (
                <BreadcrumbLink to={crumb.path}>
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbCurrent>{crumb.label}</BreadcrumbCurrent>
              )}
            </React.Fragment>
          ))}
        </Breadcrumbs>
      )}
      
      <HeaderMain>
        <HeaderContent>
          <h1>{title}</h1>
          {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
        </HeaderContent>
        
        {actions && (
          <HeaderActions>
            {actions}
          </HeaderActions>
        )}
      </HeaderMain>
    </PageHeaderWrapper>
  );
}

interface ActionButtonProps {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  to?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | string;
  size?: 'default' | 'sm' | 'lg' | string;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  to, 
  variant = 'primary',
  size = 'default',
  disabled = false,
  className = ''
}: ActionButtonProps) {
  const content = (
    <>
      {icon && <ButtonIcon>{icon}</ButtonIcon>}
      <ButtonLabel>{label}</ButtonLabel>
    </>
  );

  if (to) {
    return (
      <ActionButtonLink to={to} className={className} $variant={variant} $size={size}>
        {content}
      </ActionButtonLink>
    );
  }

  return (
    <StyledActionButton 
      className={className} 
      onClick={onClick}
      disabled={disabled}
      type="button"
      $variant={variant}
      $size={size}
    >
      {content}
    </StyledActionButton>
  );
}
