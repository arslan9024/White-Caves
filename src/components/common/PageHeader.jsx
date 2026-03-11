import React from 'react';
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

export default function PageHeader({ 
  title, 
  subtitle,
  breadcrumbs,
  actions,
  className = ''
}) {
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

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  to, 
  variant = 'primary',
  size = 'default',
  disabled = false,
  className = ''
}) {
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
