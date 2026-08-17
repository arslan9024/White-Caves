import React from 'react';
import styled from 'styled-components';

interface Breadcrumb {
  label: string;
  active?: boolean;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: FilterOption[];
}

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  filters?: FilterConfig[];
  actions?: React.ReactNode[];
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  onFilterChange?: (key: string, value: string) => void;
  onBreadcrumbClick?: (index: number) => void;
}

/**
 * DashboardShell.tsx
 * Main container component for dashboard views with breadcrumb, filters, and content area
 */

const ShellContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f9fafb;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 32px;
    height: 32px;
    color: #EF4444;
  }
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
`;

const ErrorBanner = styled.div`
  margin: 0 1.5rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
  background-color: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const BreadcrumbNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const BreadcrumbItem = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  color: ${props => (props.$active ? '#1f2937' : '#6b7280')};
  font-weight: ${props => (props.$active ? '600' : '400')};
  transition: color 0.2s;
  border-radius: 4px;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #d1d5db;
  margin: 0 0.25rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid #f3f4f6;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #f9fafb;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;

    &:hover {
      background: #9ca3af;
    }
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
`;

const Spinner = styled.div`
  border: 4px solid #f3f4f6;
  border-top: 4px solid #EF4444;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const DashboardShell: React.FC<DashboardShellProps> = ({
  title,
  subtitle,
  icon,
  breadcrumbs = [],
  filters = [],
  actions = [],
  loading = false,
  error,
  children,
  onFilterChange,
  onBreadcrumbClick,
}) => {
  return (
    <ShellContainer role="region" aria-label={title}>
      <HeaderSection>
        <TitleRow>
          <div>
            <Title>
              {icon}
              {title}
            </Title>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
          </div>
          {actions.length > 0 && <ActionsRow>{actions}</ActionsRow>}
        </TitleRow>

        {breadcrumbs.length > 0 && (
          <BreadcrumbNav>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
                <BreadcrumbItem
                  $active={crumb.active}
                  disabled={crumb.active}
                  onClick={() => onBreadcrumbClick?.(idx)}
                >
                  {crumb.label}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbNav>
        )}

        {filters.length > 0 && (
          <FilterSection>
            {filters.map((filter, idx) => (
              <FilterGroup key={idx}>
                <FilterLabel>{filter.label}</FilterLabel>
                {filter.type === 'text' && (
                  <FilterInput
                    type="text"
                    placeholder={filter.placeholder}
                    onChange={e => onFilterChange?.(filter.key, e.target.value)}
                  />
                )}
                {filter.type === 'select' && (
                  <FilterSelect onChange={e => onFilterChange?.(filter.key, e.target.value)}>
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((opt: FilterOption) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </FilterSelect>
                )}
              </FilterGroup>
            ))}
          </FilterSection>
        )}
      </HeaderSection>

      {error ? <ErrorBanner>{error}</ErrorBanner> : null}

      <ContentArea>
        {loading && (
          <LoadingOverlay>
            <Spinner role="presentation" aria-hidden="true" />
          </LoadingOverlay>
        )}
        {children}
      </ContentArea>
    </ShellContainer>
  );
};

export default DashboardShell;
