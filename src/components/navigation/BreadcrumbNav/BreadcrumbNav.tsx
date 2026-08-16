/**
 * BreadcrumbNav — Wave 61 FE-GOAL-054
 * SEO & UX semantic breadcrumb navigation bar with home icon and accessible anchor links
 * White Caves Real Estate LLC — Navigation Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #64748B;
  padding: 12px 0;
`;

const CrumbLink = styled.a`
  color: #94A3B8;
  text-decoration: none;
  transition: color 0.15s ease;
  &:hover { color: #EF4444; }
`;

const Current = styled.span`
  color: #FFF;
  font-weight: 700;
`;

export interface CrumbItem {
  label: string;
  href?: string;
}

export const BreadcrumbNav: FC<{ items?: CrumbItem[] }> = ({
  items = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'Palm Jumeirah', href: '/properties?community=palm' },
    { label: 'Signature Villa 14B' },
  ],
}) => {
  return (
    <Nav aria-label="Breadcrumb" data-testid="breadcrumb-nav">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span>/</span>}
            {isLast ? (
              <Current aria-current="page">{item.label}</Current>
            ) : (
              <CrumbLink href={item.href || '#'}>
                {idx === 0 ? `🏠 ${item.label}` : item.label}
              </CrumbLink>
            )}
          </React.Fragment>
        );
      })}
    </Nav>
  );
};

export default BreadcrumbNav;
