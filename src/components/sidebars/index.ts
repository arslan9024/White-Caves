// src/components/sidebars/index.ts
/**
 * Sidebar Components Barrel Export
 * Canonical sidebars for CRM shell + legacy compatibility exports.
 *
 * Canonical (use these in new code):
 * - EnhancedLeftSidebar
 * - EnhancedRightSidebar
 *
 * Legacy (kept temporarily for backwards compatibility):
 * - CompanyDepartmentSidebar
 * - AIAssistantsSidebar
 */

export { default as EnhancedLeftSidebar } from './EnhancedLeftSidebar/EnhancedLeftSidebar';
export { default as EnhancedRightSidebar } from './EnhancedRightSidebar/EnhancedRightSidebar';

export { CompanyDepartmentSidebar } from './CompanyDepartmentSidebar/CompanyDepartmentSidebar';
export type { CompanyDepartmentSidebarProps } from './CompanyDepartmentSidebar/CompanyDepartmentSidebar';

export { AIAssistantsSidebar } from './AIAssistantsSidebar/AIAssistantsSidebar';
export type { AIAssistantsSidebarProps } from './AIAssistantsSidebar/AIAssistantsSidebar';

// Re-export shared sidebar components
// export * from './shared'; // shared module not yet implemented
