/**
 * White Caves Real Estate LLC - Deal Management Types
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Types)
 * Single Purpose File Law: < 350 lines
 */

export type DealType = 'LEASING' | 'SALES';

export type DealStatus =
  | 'INQUIRY'
  | 'VIEWING'
  | 'OFFER'
  | 'CONTRACT'
  | 'EJARI_DLD'
  | 'COMPLETED'
  | 'CANCELLED';

export interface DealPDC {
  chequeNumber: string;
  bankName: string;
  amountAED: number;
  dueDate: string;
  status: 'PENDING' | 'CLEARED' | 'BOUNCED';
}

export interface DealDocumentRef {
  docId: string;
  type: string;
  title: string;
  verified: boolean;
}

export interface DealItem {
  id: string; // e.g. 'DEAL-001'
  _id: string; // internal id
  dealNumber: string; // e.g. 'WC-D-2026-001'
  title: string;
  dealType: DealType;
  status: DealStatus;
  propertyId: string; // 'REP-001'
  propertyTitle: string;
  propertyCommunity: string;
  agentId: string; // 'EMP-001'
  agentName: string;
  agentRole: string;
  clientId: string; // 'tenant-001' or 'buyer-001'
  clientName: string;
  clientRole: string; // 'tenant' | 'buyer'
  ownerName: string;
  valueAED: number;
  commissionAED: number;
  commissionRate: number; // e.g. 5 for lease, 2 for sale
  pdcSchedule: DealPDC[];
  documents: DealDocumentRef[];
  tasksCompleted: string[]; // e.g. ['TSK-001', 'TSK-002', 'TSK-003', 'TSK-004']
  closingDate?: string;
  meritXPAwarded: number;
}
