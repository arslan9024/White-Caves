/** DocumentComplianceChecklist.logic.ts */
import { useState, useCallback } from 'react';

export interface ComplianceItem { id: string; field: string; category: string; required: boolean; present: boolean; note?: string; }

const CHECKLIST: ComplianceItem[] = [
  { id: 'c1', field: 'RERA BRN Number (Agent)', category: 'Agent Credentials', required: true, present: true },
  { id: 'c2', field: 'Company ORN (ORN 44483)', category: 'Agent Credentials', required: true, present: true },
  { id: 'c3', field: 'Seller Full Legal Name', category: 'Party Details', required: true, present: true },
  { id: 'c4', field: 'Seller Emirates ID / Passport No.', category: 'Party Details', required: true, present: false, note: 'Missing — request from seller' },
  { id: 'c5', field: 'Property Address (Unit, Building, Community)', category: 'Property', required: true, present: true },
  { id: 'c6', field: 'Title Deed Number', category: 'Property', required: true, present: false, note: 'Obtain from DLD portal' },
  { id: 'c7', field: 'Listing Price in AED (words & figures)', category: 'Financial', required: true, present: true },
  { id: 'c8', field: 'Commission % clearly stated', category: 'Financial', required: true, present: true },
  { id: 'c9', field: 'Form A Validity Period (days)', category: 'Contract Terms', required: true, present: true },
  { id: 'c10', field: 'Exclusivity Type (Exclusive / Open)', category: 'Contract Terms', required: true, present: true },
  { id: 'c11', field: 'Seller Signature', category: 'Signatures', required: true, present: false, note: 'Awaiting e-signature' },
  { id: 'c12', field: 'Agent Signature', category: 'Signatures', required: true, present: true },
  { id: 'c13', field: 'Date of Signing', category: 'Signatures', required: true, present: false },
];

export function useDocumentComplianceChecklistLogic() {
  const [items, setItems] = useState<ComplianceItem[]>(CHECKLIST);

  const toggle = useCallback((id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, present: !item.present } : item));
  }, []);

  const passCount = items.filter((i) => i.present).length;
  const failCount = items.filter((i) => i.required && !i.present).length;
  const pct = Math.round((passCount / items.length) * 100);

  return { items, toggle, passCount, failCount, pct };
}
