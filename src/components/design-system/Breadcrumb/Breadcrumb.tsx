/**
 * Breadcrumb Component
 * Navigation breadcrumb for showing hierarchy
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
};

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
`;

const BreadcrumbList = styled.ol`
  list-style: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin: 0;
  padding: 0;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const BreadcrumbLink = styled.a<{ $active?: boolean }>`
  color: ${(props) => (props.$active ? theme.colors.text.primary : theme.colors.primary)};
  text-decoration: none;
  cursor: pointer;
  transition: ${theme.transitions.all};
  font-weight: ${(props) => (props.$active ? theme.typography.weights.semibold : theme.typography.weights.regular)};

  &:hover:not([aria-current='page']) {
    color: ${theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const Separator = styled.span`
  color: ${theme.colors.text.tertiary};
`;

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator = '/', className = '' }) => {
  return (
    <BreadcrumbContainer className={className} aria-label="Breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink
                $active={item.active}
                href={item.href}
                onClick={(e) => {
                  if (!item.href) e.preventDefault();
                  item.onClick?.();
                }}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < items.length - 1 && <Separator>{separator}</Separator>}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
