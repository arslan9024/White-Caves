/**
 * departmentSections.data.ts
 * White Caves Real Estate LLC — 13-Story Building Spatial Hierarchy & Section Classification
 * Protocol: 1-12-108 Bhakti Recursive Engine Standard
 * Single Purpose File Law: < 350 lines
 */

export interface DepartmentSectionDef {
  key: 'SECTION_A' | 'SECTION_B' | 'SECTION_C' | 'PENTHOUSE';
  title: string;
  shortTitle: string;
  floorRange: string;
  floorNumbers: number[];
  color: string;
  borderColor: string;
  bgGradient: string;
  description: string;
  statutoryRole: string;
}

export const BHAKTI_BUILDING_SECTIONS: Record<'SECTION_A' | 'SECTION_B' | 'SECTION_C' | 'PENTHOUSE', DepartmentSectionDef> = {
  PENTHOUSE: {
    key: 'PENTHOUSE',
    title: 'Penthouse: Sovereign Founder & MD Suite',
    shortTitle: 'Floor 13 Sovereign',
    floorRange: 'Floor 13',
    floorNumbers: [13],
    color: '#F59E0B',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(180, 83, 9, 0.05) 100%)',
    description: 'Supreme executive office of the Founder & Managing Director paired with Executive AI Zoe (L5 Clearance).',
    statutoryRole: 'Executive Command & Sovereign Final Sign-off',
  },
  SECTION_A: {
    key: 'SECTION_A',
    title: 'Section A: Institutional Governance & Core',
    shortTitle: 'Section A (Floors 9–12)',
    floorRange: 'Floors 09 – 12',
    floorNumbers: [12, 11, 10, 9],
    color: '#8B5CF6',
    borderColor: 'rgba(139, 92, 246, 0.35)',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(109, 40, 217, 0.04) 100%)',
    description: 'Top-tier corporate directorate: Executive Strategy, Legal Compliance, Accounting & Finance, and Research Intelligence.',
    statutoryRole: 'Corporate Governance, Statutory Compliance & Capital Allocation',
  },
  SECTION_B: {
    key: 'SECTION_B',
    title: 'Section B: Revenue Engines & Transaction Assets',
    shortTitle: 'Section B (Floors 5–8)',
    floorRange: 'Floors 05 – 08',
    floorNumbers: [8, 7, 6, 5],
    color: '#10B981',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.04) 100%)',
    description: 'Commercial transaction engine: Sales & Operations, Inventory & Asset Portfolio, Partnerships & Capital Growth, and Media PR.',
    statutoryRole: 'Direct Real Estate Revenue, Listings Portfolio & Escrow Deals',
  },
  SECTION_C: {
    key: 'SECTION_C',
    title: 'Section C: Foundation, People & Platform Backbone',
    shortTitle: 'Section C (Floors 1–4)',
    floorRange: 'Floors 01 – 04',
    floorNumbers: [4, 3, 2, 1],
    color: '#3B82F6',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(29, 78, 216, 0.04) 100%)',
    description: 'Ground-level traffic and digital bedrock: Customer Experience Concierge, Marketing Acquisition, HR People, and Core Technology.',
    statutoryRole: 'VIP Frontline Reception, Talent Operations & Technology Cloud',
  },
};

/**
 * Returns the section definition for a given slot/floor number (1 to 12)
 */
export function getSectionForSlotNumber(slotNumber: number): DepartmentSectionDef {
  if (slotNumber >= 9 && slotNumber <= 12) return BHAKTI_BUILDING_SECTIONS.SECTION_A;
  if (slotNumber >= 5 && slotNumber <= 8) return BHAKTI_BUILDING_SECTIONS.SECTION_B;
  return BHAKTI_BUILDING_SECTIONS.SECTION_C;
}
