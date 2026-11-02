/**
 * zoeBusinessDocsRegistry.ts
 * Master Hyper-Linked HTML Business Documentation Registry for Zoe AI (Item Code: 3.4)
 * Complete 16-Module Structure Mapping 1:1 to /docs/business_docs Master Architecture
 *
 * Corporate & Regulatory Coordinates:
 * - Commercial License (DET): 1388443
 * - RERA Brokerage ORN: 44483 (Classification: General Brokerage)
 * - Office Ejari: 0120250814005322 (Office D-72, El Shaye - 4 Building, Al Barsha South 3rd, Dubai)
 * - Establishment Card (MOL / ICP): 2/1/1192499
 * - Managing Director: Arslan Malik Bashir Ahmad
 * - Brand Palette: White Caves Red (#EF4444) | Brilliant White (#FFFFFF) | Deep Slate Gray (#1E293B)
 */

export interface DocSubItem {
  id: string;
  title: string;
  description: string;
}

export type ZoeBusinessDocCategory =
  | 'progress'
  | 'corporate'
  | 'departments'
  | 'services'
  | 'ai_command'
  | 'licensing'
  | 'leasing'
  | 'workflows'
  | 'requirements'
  | 'design_arch'
  | 'finance'
  | 'market_intel'
  | 'crm_features'
  | 'vip_concierge'
  | 'design_security'
  | 'seo'
  | 'srs_testing'
  | 'devops_release'
  | 'tech_devops';

export interface BusinessDocItem {
  id: string;
  code: string;
  title: string;
  category: ZoeBusinessDocCategory;
  departmentFloor: string;
  primaryAssistant: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  subItems: DocSubItem[];
  htmlContent: string;
}
