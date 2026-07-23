/**
 * Central Registry of Departments
 * STAGE 2 (AEGIS): 10 Departmental Overhaul
 * Implements the White Caves Red & White brand palette
 */

export const DEPARTMENTS = [
  {
    id: 'sales',
    name: 'Sales',
    accentColor: '#EF4444',
    aiAssistant: 'Clara / Sophia',
    description: 'Leads & Pipeline Management',
    clearanceLevel: 1,
  },
  {
    id: 'operations',
    name: 'Operations',
    accentColor: '#3B82F6',
    aiAssistant: 'UnitTracker',
    description: 'DAMAC Hills 2 Unit Management',
    clearanceLevel: 2,
  },
  {
    id: 'communications',
    name: 'Communications',
    accentColor: '#25D366',
    aiAssistant: 'Nadia',
    description: 'WhatsApp CRM & SLAs',
    clearanceLevel: 1,
  },
  {
    id: 'finance',
    name: 'Finance',
    accentColor: '#F59E0B',
    aiAssistant: 'LedgerBot',
    description: 'Multi-Currency Escrow',
    clearanceLevel: 3,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    accentColor: '#EC4899',
    aiAssistant: 'Olivia',
    description: 'Campaign ROI & Lead Gen',
    clearanceLevel: 2,
  },
  {
    id: 'executive',
    name: 'Executive',
    accentColor: '#EF4444',
    aiAssistant: 'Master',
    description: 'MD Data Aggregator',
    clearanceLevel: 5,
  },
  {
    id: 'compliance',
    name: 'Compliance',
    accentColor: '#6366F1',
    aiAssistant: 'Laila',
    description: 'Audit Timeline & Risk',
    clearanceLevel: 3,
  },
  {
    id: 'technology',
    name: 'Technology',
    accentColor: '#0EA5E9',
    aiAssistant: 'Aurora',
    description: 'System Config & Uptime',
    clearanceLevel: 4,
  },
  {
    id: 'legal',
    name: 'Legal',
    accentColor: '#DC2626',
    aiAssistant: 'Evangeline',
    description: 'Forms 6, 7 & 12',
    clearanceLevel: 3,
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    accentColor: '#0D9488',
    aiAssistant: 'Sentinel',
    description: 'Predictive Market Maps',
    clearanceLevel: 4,
  },
] as const;

export type DepartmentId = typeof DEPARTMENTS[number]['id'];

export const getDepartmentById = (id: string) => {
  return DEPARTMENTS.find(d => d.id === id);
};
