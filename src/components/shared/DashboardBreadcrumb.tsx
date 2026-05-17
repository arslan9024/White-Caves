import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import type { RootState } from '../../store/store';
import {
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedSubitem,
  selectSelectionHistory,
  restoreFromHistory,
  setSelectedService,
  setSelectedSubitem,
} from '../../redux/slices/relationalSidebarSlice';

interface BreadcrumbEntry {
  id: string;
  label: string;
  type: 'department' | 'service' | 'subitem';
  active: boolean;
}

interface SelectionHistoryEntry {
  dept: string | null;
  service: string | null;
  subitem: string | null;
}

interface DashboardBreadcrumbProps {
  onNavigate?: (selection: SelectionHistoryEntry) => void;
}

const generateBreadcrumbs = (
  department: string | null,
  service: string | null,
  subitem: string | null
): BreadcrumbEntry[] => {
  const breadcrumbs: BreadcrumbEntry[] = [];

  if (department) {
    breadcrumbs.push({
      id: department,
      label: department,
      type: 'department',
      active: !service && !subitem,
    });
  }

  if (service) {
    breadcrumbs.push({ id: service, label: service, type: 'service', active: !subitem });
  }

  if (subitem) {
    breadcrumbs.push({ id: subitem, label: subitem, type: 'subitem', active: true });
  }

  return breadcrumbs;
};

/**
 * DashboardBreadcrumb.tsx
 * Navigation breadcrumb with history support (max 5 items)
 * Shows: Department > Service > Subitem
 */

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
`;

const BreadcrumbList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: min-content;
`;

const BreadcrumbItem = styled.button<{ $active?: boolean }>`
  padding: 0.375rem 0.75rem;
  border: none;
  background: ${props => (props.$active ? '#eef2ff' : 'transparent')};
  color: ${props => (props.$active ? '#6366f1' : '#6b7280')};
  font-weight: ${props => (props.$active ? '600' : '500')};
  cursor: ${props => (props.$active ? 'default' : 'pointer')};
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: ${props => (props.$active ? '#eef2ff' : '#f3f4f6')};
    color: #1f2937;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }
`;

const Separator = styled.span`
  color: #d1d5db;
  padding: 0 0.25rem;
  user-select: none;
`;

const BackButton = styled.button`
  padding: 0.375rem 0.75rem;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #6b7280;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #6366f1;
    color: #6366f1;
    background-color: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }
`;

const MoreIndicator = styled.span`
  color: #9ca3af;
  padding: 0 0.25rem;
  font-weight: 600;
`;

/**
 * DashboardBreadcrumb Component
 */
const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({ onNavigate }) => {
  const dispatch = useDispatch<any>();

  // Redux state
  const selectedDept = useSelector(selectSelectedDepartment) as string | null;
  const selectedService = useSelector(selectSelectedService) as string | null;
  const selectedSubitem = useSelector(selectSelectedSubitem) as string | null;
  const selectionHistory = useSelector((state: RootState) =>
    selectSelectionHistory(
      state as unknown as { relationalSidebar: { selectionHistory: SelectionHistoryEntry[] } }
    )
  ) as SelectionHistoryEntry[];

  // Generate breadcrumbs
  const breadcrumbs = selectedDept
    ? generateBreadcrumbs(selectedDept, selectedService, selectedSubitem)
    : [];

  // Check if we have history to go back
  const canGoBack = selectionHistory.length > 1;
  const previousEntry = selectionHistory[1];

  const handleBreadcrumbClick = (
    dept: string | null,
    service: string | null = null,
    subitem: string | null = null
  ) => {
    // Dispatch restoration
    dispatch(restoreFromHistory({ dept, service, subitem }));

    // Also update Redux with the restored state
    if (service) {
      dispatch(setSelectedService(service));
    }
    if (subitem) {
      dispatch(setSelectedSubitem(subitem));
    }

    // Callback for parent component
    if (onNavigate) {
      onNavigate({ dept, service, subitem });
    }
  };

  const handleBackClick = () => {
    if (previousEntry && canGoBack) {
      handleBreadcrumbClick(previousEntry.dept, previousEntry.service, previousEntry.subitem);
    }
  };

  return (
    <BreadcrumbContainer role="navigation" aria-label="Breadcrumb navigation">
      <BreadcrumbList>
        {/* Back Button */}
        {canGoBack && (
          <>
            <BackButton onClick={handleBackClick} title="Go to previous view">
              ← Back
            </BackButton>
            <Separator>/</Separator>
          </>
        )}

        {/* Breadcrumb Items with max 5 */}
        {breadcrumbs.length > 5 && (
          <>
            <BreadcrumbItem
              onClick={() => handleBreadcrumbClick(breadcrumbs[0].id, null, null)}
              title={breadcrumbs[0].label}
            >
              {breadcrumbs[0].label}
            </BreadcrumbItem>
            <Separator>/</Separator>
            <MoreIndicator title="More items in breadcrumb">...</MoreIndicator>
            <Separator>/</Separator>
          </>
        )}

        {breadcrumbs.slice(Math.max(0, breadcrumbs.length - 5)).map((crumb, idx, _arr) => (
          <React.Fragment key={crumb.id}>
            {idx > 0 && <Separator>/</Separator>}
            <BreadcrumbItem
              $active={crumb.active}
              disabled={crumb.active}
              onClick={() => {
                // Navigate based on type
                if (crumb.type === 'department') {
                  handleBreadcrumbClick(crumb.id, null, null);
                } else if (crumb.type === 'service') {
                  handleBreadcrumbClick(selectedDept, crumb.id, null);
                } else if (crumb.type === 'subitem') {
                  handleBreadcrumbClick(selectedDept, selectedService, crumb.id);
                }
              }}
              title={crumb.label}
            >
              {crumb.label}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default DashboardBreadcrumb;
