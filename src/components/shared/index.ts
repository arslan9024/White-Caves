/**
 * White Caves Shared Component Library (AEGIS 2.0)
 * Central export for all 15 atomic UI components, shells & hooks
 */

export { CavesButton, type CavesButtonProps, type CavesButtonVariant, type CavesButtonSize } from './CavesButton';
export { CavesInput, type CavesInputProps } from './CavesInput';
export { CavesCard, type CavesCardProps } from './CavesCard';
export { CavesBadge, type CavesBadgeProps, type CavesBadgeStatus } from './CavesBadge';
export { CavesTopNavbar, type CavesTopNavbarProps } from './CavesTopNavbar';
export { CavesSidebar, type CavesSidebarProps, DEPARTMENTS_LIST, type DepartmentItem } from './CavesSidebar';
export { CavesModal, type CavesModalProps } from './CavesModal';
export { CavesTable, type CavesTableProps, type CavesTableColumn } from './CavesTable';
export { CavesSpinner, type CavesSpinnerProps } from './CavesSpinner';
export { CavesKanbanCard, type CavesKanbanCardProps } from './CavesKanbanCard';
export { CavesSlider, type CavesSliderProps } from './CavesSlider';
export { CavesTicker, type CavesTickerProps } from './CavesTicker';
export { useWorkspaceEngine, type Currency, type UseWorkspaceEngineOptions } from './useWorkspaceEngine';
export { CavesTooltip, type CavesTooltipProps } from './CavesTooltip';
export { CavesToggle, type CavesToggleProps } from './CavesToggle';

export { CavesFloatingWidget, type CavesFloatingWidgetProps } from './CavesFloatingWidget';
export { CavesFloatingSearch, type CavesFloatingSearchProps } from './CavesFloatingSearch';
export { useCavesFloatingSearch } from './CavesFloatingSearch.logic';

// Skeleton & Feedback exports

export { default as Skeleton, type SkeletonProps } from '../ui/Skeleton/Skeleton';
export { SkeletonText, SkeletonKPI, SkeletonCard, SkeletonTable } from '../ui/Skeleton/SkeletonVariants';
export { LoadingState } from './LoadingState';
export { ErrorState } from './ErrorState';
export { EmptyState } from './EmptyState';


