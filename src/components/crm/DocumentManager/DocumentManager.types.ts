// FILE: src/components/crm/DocumentManager/DocumentManager.types.ts
/**
 * White Caves Real Estate LLC - Document Management Types
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Types - Tier 5)
 * Single Purpose File Law: < 350 lines
 */

export type DocumentType =
  | 'TITLE_DEED'
  | 'EMIRATES_ID'
  | 'PASSPORT'
  | 'EJARI_CONTRACT'
  | 'PAYMENT_RECEIPT'
  | 'TRADE_LICENSE'
  | 'MOU_FORM_F'
  | 'NOC_CERTIFICATE';

export type DocumentStatus = 'VERIFIED' | 'PENDING_OCR' | 'EXPIRED' | 'REJECTED';

export interface DocumentItem {
  id: string; // e.g. 'DOC-001'
  _id: string; // internal id
  docCode: string; // e.g. 'TD-908124'
  title: string;
  docType: DocumentType;
  status: DocumentStatus;
  fileUrl: string;
  fileSizeKB: number;
  uploadedAt: string;
  expiryDate?: string;
  dealId?: string; // e.g. 'DEAL-001'
  propertyId?: string; // e.g. 'REP-001'
  entityId?: string; // 'tenant-001', 'owner-001'
  entityName: string;
  ocrConfidence: number; // e.g. 98.5
  metadata: Record<string, string | number | boolean>;
}
