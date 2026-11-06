// FILE: src/components/dashboard/VSCodeBreadcrumbs/VSCodeBreadcrumbs.types.ts
/**
 * White Caves Real Estate LLC - VSCode Breadcrumbs Type Definitions
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface BreadcrumbSegment {
  id: string; // Turing ID, e.g., 'DEPT-01', 'SUB-02', 'TSK-001'
  label: string; // e.g., 'Executive & Architecture'
  icon?: string;
  route: string; // e.g., '/dashboard/departments/DEPT-01'
  level: 'ROOT' | 'SYSTEM' | 'CATEGORY' | 'ENTITY' | 'ACTION';
  siblings?: Array<{ id: string; label: string; route: string }>;
}

export interface VSCodeBreadcrumbsProps {
  currentPath?: string;
  onNavigate?: (route: string) => void;
  className?: string;
}
