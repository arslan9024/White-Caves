/**
 * White Caves Real Estate LLC - Global Command Palette Types
 * Architecture: AEGIS Canonical 7-Category Architecture Standard (Types)
 * Single Purpose File Law: < 350 lines
 */

export type EntityCategory =
  | 'ALL'
  | 'DEPARTMENTS'
  | 'EMPLOYEES'
  | 'TASKS'
  | 'PROPERTIES'
  | 'DEALS'
  | 'DOCUMENTS'
  | 'LEADERBOARD'
  | 'RELATIONSHIPS'
  | 'CUSTOMERS';

export interface CommandPaletteEntityItem {
  id: string; // e.g., 'EMP-001', 'REP-001', 'DEAL-001', 'CUST-001'
  title: string;
  subtitle: string;
  category: EntityCategory;
  categoryLabel: string;
  badge: string;
  badgeColor: string;
  route: string; // e.g., '/dashboard/employees/EMP-001'
  keywords: string[];
}

export interface GlobalEntityCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (entity: CommandPaletteEntityItem) => void;
}
