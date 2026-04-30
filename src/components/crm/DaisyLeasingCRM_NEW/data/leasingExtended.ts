// Extended leasing data: PDC cheques and renewal records
// Kept separate so existing test mocks of data/leasing are not affected.

import { PDCCheque, RenewalRecord } from './leasing';

export const PDC_CHEQUES: PDCCheque[] = [
  { id: 1, leaseId: 1, chequeNumber: 'CHQ-001-2025', bankName: 'Emirates NBD', amount: 10000, dueDate: '2026-01-15', status: 'pending', tenantName: 'Ahmed Al Rashid', unit: 'Apt 1205', presentedDate: null, clearedDate: null, notes: null },
  { id: 2, leaseId: 1, chequeNumber: 'CHQ-002-2025', bankName: 'Emirates NBD', amount: 10000, dueDate: '2025-12-15', status: 'presented', tenantName: 'Ahmed Al Rashid', unit: 'Apt 1205', presentedDate: '2025-12-13', clearedDate: null, notes: null },
  { id: 3, leaseId: 1, chequeNumber: 'CHQ-003-2025', bankName: 'Emirates NBD', amount: 10000, dueDate: '2025-11-15', status: 'cleared', tenantName: 'Ahmed Al Rashid', unit: 'Apt 1205', presentedDate: '2025-11-13', clearedDate: '2025-11-15', notes: null },
  { id: 4, leaseId: 2, chequeNumber: 'CHQ-SA-001', bankName: 'ADCB', amount: 45000, dueDate: '2026-03-01', status: 'pending', tenantName: 'Sarah Johnson', unit: 'Villa 48', presentedDate: null, clearedDate: null, notes: null },
  { id: 5, leaseId: 2, chequeNumber: 'CHQ-SA-002', bankName: 'ADCB', amount: 45000, dueDate: '2025-12-01', status: 'cleared', tenantName: 'Sarah Johnson', unit: 'Villa 48', presentedDate: '2025-11-29', clearedDate: '2025-12-01', notes: null },
  { id: 6, leaseId: 5, chequeNumber: 'CHQ-JW-001', bankName: 'RAK Bank', amount: 11250, dueDate: '2025-11-01', status: 'bounced', tenantName: 'James Wilson', unit: 'Studio 302', presentedDate: '2025-10-30', clearedDate: null, notes: 'Insufficient funds - follow up required' },
  { id: 7, leaseId: 5, chequeNumber: 'CHQ-JW-002', bankName: 'RAK Bank', amount: 11250, dueDate: '2026-02-01', status: 'pending', tenantName: 'James Wilson', unit: 'Studio 302', presentedDate: null, clearedDate: null, notes: 'Replacement cheque requested' },
  { id: 8, leaseId: 3, chequeNumber: 'CHQ-MK-001', bankName: 'Mashreq', amount: 8000, dueDate: '2026-02-01', status: 'pending', tenantName: 'Mohammed Khan', unit: 'TH-12', presentedDate: null, clearedDate: null, notes: null },
  { id: 9, leaseId: 4, chequeNumber: 'CHQ-MS-001', bankName: 'HSBC UAE', amount: 87500, dueDate: '2026-01-15', status: 'pending', tenantName: 'Maria Santos', unit: 'PH-501', presentedDate: null, clearedDate: null, notes: null },
];

export const RENEWAL_RECORDS: RenewalRecord[] = [
  { id: 1, leaseId: 2, unit: 'Villa 48 - Springs', tenant: 'Sarah Johnson', currentRent: 180000, proposedRent: 192000, renewalDate: '2026-05-31', noticeSent: true, tenantResponse: 'negotiating', daysUntilExpiry: 30 },
  { id: 2, leaseId: 5, unit: 'Studio 302 - Discovery', tenant: 'James Wilson', currentRent: 45000, proposedRent: 48000, renewalDate: '2026-07-31', noticeSent: true, tenantResponse: 'pending', daysUntilExpiry: 15 },
  { id: 3, leaseId: 7, unit: '2BR-1104 - Palm Shoreline', tenant: 'Carlos Mendez', currentRent: 220000, proposedRent: 235000, renewalDate: '2025-11-30', noticeSent: true, tenantResponse: 'accepted', daysUntilExpiry: 45 },
  { id: 4, leaseId: 3, unit: 'TH-12 - JVC', tenant: 'Mohammed Khan', currentRent: 96000, proposedRent: 100000, renewalDate: '2026-02-28', noticeSent: false, tenantResponse: 'pending', daysUntilExpiry: 310 },
];
