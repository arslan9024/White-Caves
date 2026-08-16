/**
 * KYC Workflow Service — Wave 41 (REQ-COMP-002, COMP-AML-001)
 *
 * Handles:
 * 1. Transaction-specific KYC checklists (lease, sale, renewal)
 * 2. KYC submission, document attachments, and verification status lifecycle
 * 3. Client verification check gates
 */

import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger.js';

export type KycTransactionType = 'lease' | 'sale' | 'renewal';
export type KycStatus = 'pending_submission' | 'under_review' | 'verified' | 'rejected';

export interface KycChecklistItem {
  code: string;
  label: string;
  required: boolean;
}

export interface KycDocumentItem {
  docType: string;
  fileUrl: string;
  uploadedAt: string;
  documentName?: string;
}

export const KYC_CHECKLISTS: Record<KycTransactionType, KycChecklistItem[]> = {
  lease: [
    { code: 'emirates_id_front', label: 'Emirates ID (Front)', required: true },
    { code: 'emirates_id_back', label: 'Emirates ID (Back)', required: true },
    { code: 'passport_copy', label: 'Passport Copy', required: true },
    { code: 'visa_page', label: 'UAE Residence Visa Page', required: true },
  ],
  sale: [
    { code: 'passport_copy', label: 'Passport Copy', required: true },
    { code: 'emirates_id_front', label: 'Emirates ID (Front)', required: true },
    { code: 'title_deed_form_f', label: 'Title Deed or DLD Form F', required: true },
    { code: 'proof_of_funds', label: 'Proof of Funds / Bank Statement', required: true },
  ],
  renewal: [
    { code: 'emirates_id_front', label: 'Updated Emirates ID', required: true },
    { code: 'visa_page', label: 'Updated Residence Visa', required: true },
  ],
};

/**
 * Get required document checklist per transaction type
 */
export function getKycChecklist(transactionType: KycTransactionType): KycChecklistItem[] {
  return KYC_CHECKLISTS[transactionType] || KYC_CHECKLISTS.lease;
}

/**
 * Create a new KYC record
 */
export async function createKycRecord(data: {
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  transactionType: KycTransactionType;
}) {
  const kyc = await prisma.kycRecord.create({
    data: {
      clientId: data.clientId || null,
      clientName: data.clientName.trim(),
      clientEmail: data.clientEmail ? data.clientEmail.trim() : null,
      clientPhone: data.clientPhone ? data.clientPhone.trim() : null,
      transactionType: data.transactionType || 'lease',
      status: 'pending_submission',
      documents: [],
    },
  });

  logger.info('[KycService] Created KYC record', { kycId: kyc.id, clientName: kyc.clientName });
  return kyc;
}

/**
 * Add document to KYC record and transition status to under_review
 */
export async function addKycDocument(
  kycId: string,
  doc: { docType: string; fileUrl: string; documentName?: string }
) {
  const kyc = await prisma.kycRecord.findUnique({ where: { id: kycId } });
  if (!kyc) throw new Error('KYC record not found');

  const currentDocs = (Array.isArray(kyc.documents) ? kyc.documents : []) as unknown as KycDocumentItem[];
  const newDoc: KycDocumentItem = {
    docType: doc.docType,
    fileUrl: doc.fileUrl,
    documentName: doc.documentName || doc.docType,
    uploadedAt: new Date().toISOString(),
  };

  const updatedDocs = [...currentDocs, newDoc];

  const updatedKyc = await prisma.kycRecord.update({
    where: { id: kycId },
    data: {
      documents: updatedDocs as unknown as Prisma.InputJsonValue,
      status: 'under_review',
    },
  });

  logger.info('[KycService] Added document to KYC record', { kycId, docType: doc.docType });
  return updatedKyc;
}

/**
 * Update KYC verification status (verify or reject)
 */
export async function updateKycStatus(
  kycId: string,
  status: KycStatus,
  reviewer?: { id: string; name: string },
  rejectionReason?: string
) {
  const isVerified = status === 'verified';
  const updatedKyc = await prisma.kycRecord.update({
    where: { id: kycId },
    data: {
      status,
      reviewedById: reviewer?.id || null,
      reviewedByName: reviewer?.name || null,
      verifiedAt: isVerified ? new Date() : null,
      rejectionReason: status === 'rejected' ? rejectionReason || 'Document check failed' : null,
    },
  });

  logger.info('[KycService] Updated KYC status', { kycId, status, isVerified });
  return updatedKyc;
}

/**
 * Check if a client has a verified KYC record
 */
export async function isClientKycVerified(clientId: string): Promise<boolean> {
  const verifiedRecord = await prisma.kycRecord.findFirst({
    where: { clientId, status: 'verified' },
  });
  return !!verifiedRecord;
}
