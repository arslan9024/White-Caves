// Full leasing data with PDC, renewals, pipeline stages

export type LeaseStatus = 'active' | 'expiring_soon' | 'renewal_pending' | 'expired' | 'terminated';
export type MaintenancePriority = 'critical' | 'high' | 'medium' | 'low';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'scheduled' | 'completed' | 'cancelled';
export type PDCStatus = 'pending' | 'presented' | 'cleared' | 'bounced';
export type InquiryStatus =
  | 'new'
  | 'viewing_scheduled'
  | 'offer_made'
  | 'documents_pending'
  | 'approved'
  | 'rejected';
export type LeasingStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const LEASING_STAGE_LABELS: Record<LeasingStage, string> = {
  1: 'Lead Acquisition',
  2: 'Tenant Matching',
  3: 'Property Viewing',
  4: 'Offer Made',
  5: 'Offer Decision',
  6: 'Deposit Paid',
  7: 'Contract Signed',
  8: 'Key Handover',
  9: 'Rent Collection',
  10: 'P&L Close',
};

export interface ActiveLease {
  id: number;
  unit: string;
  building: string;
  tenant: string;
  tenantPhone: string;
  tenantEmail: string;
  rent: number;
  annualRent: number;
  startDate: string;
  endDate: string;
  status: LeaseStatus;
  daysRemaining: number;
  ejariNumber: string | null;
  ejariStatus: 'registered' | 'pending' | 'expired' | null;
  pdcCount: number;
  pdcCleared: number;
  pdcBounced: number;
  agentCommissionPct: number;
  keyHandedOver: boolean;
  renewalNotice: boolean;
}

export interface PDCCheque {
  id: number;
  leaseId: number;
  chequeNumber: string;
  bankName: string;
  amount: number;
  dueDate: string;
  status: PDCStatus;
  tenantName: string;
  unit: string;
  presentedDate: string | null;
  clearedDate: string | null;
  notes: string | null;
}

export interface MaintenanceRequest {
  id: number;
  unit: string;
  building: string;
  tenant: string;
  issue: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  created: string;
  scheduledDate: string | null;
  completedDate: string | null;
  estimatedCost: number | null;
  actualCost: number | null;
  assignedTo: string | null;
}

export interface RentalInquiry {
  id: number;
  name: string;
  nationality: string;
  phone: string;
  email: string;
  property: string;
  bedrooms: string;
  budget: string;
  moveInDate: string;
  status: InquiryStatus;
  leasingStage: LeasingStage;
  date: string;
  notes: string;
  source: string;
}

export interface RenewalRecord {
  id: number;
  leaseId: number;
  unit: string;
  tenant: string;
  currentRent: number;
  proposedRent: number;
  renewalDate: string;
  noticeSent: boolean;
  tenantResponse: 'pending' | 'accepted' | 'negotiating' | 'rejected';
  daysUntilExpiry: number;
}

export { PDC_CHEQUES, RENEWAL_RECORDS } from './leasingExtended';

export const ACTIVE_LEASES: ActiveLease[] = [
  {
    id: 1,
    unit: 'Apt 1205',
    building: 'Marina Views Tower A',
    tenant: 'Ahmed Al Rashid',
    tenantPhone: '+971 50 123 4567',
    tenantEmail: 'ahmed@example.ae',
    rent: 10000,
    annualRent: 120000,
    startDate: '2025-01-15',
    endDate: '2026-01-14',
    status: 'active',
    daysRemaining: 245,
    ejariNumber: 'EJARI-2025-001234',
    ejariStatus: 'registered',
    pdcCount: 12,
    pdcCleared: 8,
    pdcBounced: 0,
    agentCommissionPct: 5,
    keyHandedOver: true,
    renewalNotice: false,
  },
  {
    id: 2,
    unit: 'Villa 48',
    building: 'The Springs Phase 3',
    tenant: 'Sarah Johnson',
    tenantPhone: '+971 52 234 5678',
    tenantEmail: 'sarah@example.com',
    rent: 15000,
    annualRent: 180000,
    startDate: '2024-06-01',
    endDate: '2026-05-31',
    status: 'expiring_soon',
    daysRemaining: 30,
    ejariNumber: 'EJARI-2024-005678',
    ejariStatus: 'registered',
    pdcCount: 4,
    pdcCleared: 3,
    pdcBounced: 0,
    agentCommissionPct: 5,
    keyHandedOver: true,
    renewalNotice: true,
  },
  {
    id: 3,
    unit: 'TH-12',
    building: 'JVC Townhouses',
    tenant: 'Mohammed Khan',
    tenantPhone: '+971 55 345 6789',
    tenantEmail: 'mkhan@example.com',
    rent: 8000,
    annualRent: 96000,
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    status: 'active',
    daysRemaining: 310,
    ejariNumber: 'EJARI-2025-009876',
    ejariStatus: 'registered',
    pdcCount: 12,
    pdcCleared: 5,
    pdcBounced: 0,
    agentCommissionPct: 5,
    keyHandedOver: true,
    renewalNotice: false,
  },
  {
    id: 4,
    unit: 'PH-501',
    building: 'Downtown Burj Views',
    tenant: 'Maria Santos',
    tenantPhone: '+971 50 456 7890',
    tenantEmail: 'maria@example.com',
    rent: 29167,
    annualRent: 350000,
    startDate: '2025-02-15',
    endDate: '2026-02-14',
    status: 'active',
    daysRemaining: 280,
    ejariNumber: 'EJARI-2025-012345',
    ejariStatus: 'registered',
    pdcCount: 12,
    pdcCleared: 6,
    pdcBounced: 0,
    agentCommissionPct: 4,
    keyHandedOver: true,
    renewalNotice: false,
  },
  {
    id: 5,
    unit: 'Studio 302',
    building: 'Discovery Gardens Block E',
    tenant: 'James Wilson',
    tenantPhone: '+971 56 567 8901',
    tenantEmail: 'james@example.co.uk',
    rent: 3750,
    annualRent: 45000,
    startDate: '2024-08-01',
    endDate: '2026-07-31',
    status: 'renewal_pending',
    daysRemaining: 15,
    ejariNumber: null,
    ejariStatus: 'pending',
    pdcCount: 4,
    pdcCleared: 3,
    pdcBounced: 1,
    agentCommissionPct: 5,
    keyHandedOver: true,
    renewalNotice: true,
  },
  {
    id: 6,
    unit: 'Apt 804',
    building: 'DIFC Index Tower',
    tenant: 'Priya Sharma',
    tenantPhone: '+971 54 678 9012',
    tenantEmail: 'priya@example.in',
    rent: 20833,
    annualRent: 250000,
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: 'active',
    daysRemaining: 340,
    ejariNumber: 'EJARI-2025-034567',
    ejariStatus: 'registered',
    pdcCount: 12,
    pdcCleared: 4,
    pdcBounced: 0,
    agentCommissionPct: 5,
    keyHandedOver: true,
    renewalNotice: false,
  },
  {
    id: 7,
    unit: '2BR-1104',
    building: 'Palm Jumeirah Shoreline',
    tenant: 'Carlos Mendez',
    tenantPhone: '+971 50 789 0123',
    tenantEmail: 'carlos@example.mx',
    rent: 18333,
    annualRent: 220000,
    startDate: '2024-12-01',
    endDate: '2025-11-30',
    status: 'expiring_soon',
    daysRemaining: 45,
    ejariNumber: 'EJARI-2024-089012',
    ejariStatus: 'registered',
    pdcCount: 4,
    pdcCleared: 3,
    pdcBounced: 0,
    agentCommissionPct: 5,
    keyHandedOver: true,
    renewalNotice: true,
  },
];

export const MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: 1,
    unit: 'Apt 1205',
    building: 'Marina Views',
    tenant: 'Ahmed Al Rashid',
    issue: 'AC not cooling — compressor suspected fault',
    category: 'HVAC',
    priority: 'high',
    status: 'in_progress',
    created: '2026-04-08',
    scheduledDate: '2026-04-10',
    completedDate: null,
    estimatedCost: 1500,
    actualCost: null,
    assignedTo: 'CoolTech Services',
  },
  {
    id: 2,
    unit: 'Villa 48',
    building: 'The Springs',
    tenant: 'Sarah Johnson',
    issue: 'Kitchen faucet leaking under sink, possible pipe corrosion',
    category: 'Plumbing',
    priority: 'medium',
    status: 'pending',
    created: '2026-04-07',
    scheduledDate: null,
    completedDate: null,
    estimatedCost: 400,
    actualCost: null,
    assignedTo: null,
  },
  {
    id: 3,
    unit: 'Studio 302',
    building: 'Discovery Gardens',
    tenant: 'James Wilson',
    issue: 'Bathroom ceiling light fixture broken',
    category: 'Electrical',
    priority: 'low',
    status: 'scheduled',
    created: '2026-04-06',
    scheduledDate: '2026-04-15',
    completedDate: null,
    estimatedCost: 200,
    actualCost: null,
    assignedTo: 'ElecFix LLC',
  },
  {
    id: 4,
    unit: 'PH-501',
    building: 'Burj Views',
    tenant: 'Maria Santos',
    issue: 'Pool deck tiles cracked — safety hazard',
    category: 'Structural',
    priority: 'critical',
    status: 'in_progress',
    created: '2026-04-05',
    scheduledDate: '2026-04-09',
    completedDate: null,
    estimatedCost: 8000,
    actualCost: null,
    assignedTo: 'Build Masters LLC',
  },
  {
    id: 5,
    unit: 'TH-12',
    building: 'JVC Townhouses',
    tenant: 'Mohammed Khan',
    issue: 'Garden irrigation system not working',
    category: 'Landscaping',
    priority: 'low',
    status: 'completed',
    created: '2026-03-28',
    scheduledDate: '2026-04-01',
    completedDate: '2026-04-02',
    estimatedCost: 600,
    actualCost: 550,
    assignedTo: 'GreenScape UAE',
  },
];

export const RENTAL_INQUIRIES: RentalInquiry[] = [
  {
    id: 1,
    name: 'Robert Chen',
    nationality: 'Chinese',
    phone: '+971 50 111 2222',
    email: 'rchen@example.cn',
    property: '2BR Marina Views',
    bedrooms: '2BR',
    budget: '100,000–120,000',
    moveInDate: '2026-06-01',
    status: 'viewing_scheduled',
    leasingStage: 3,
    date: '2026-04-10',
    notes: 'Prefers high floor, sea view. Moving with family.',
    source: 'Property Finder',
  },
  {
    id: 2,
    name: 'Sophie Laurent',
    nationality: 'French',
    phone: '+971 52 222 3333',
    email: 'slaurent@example.fr',
    property: 'Villa Palm Jumeirah',
    bedrooms: '4BR',
    budget: '200,000–250,000',
    moveInDate: '2026-07-01',
    status: 'offer_made',
    leasingStage: 4,
    date: '2026-04-09',
    notes: 'Offered AED 220,000. Awaiting counter.',
    source: 'Agent Referral',
  },
  {
    id: 3,
    name: 'Omar Malik',
    nationality: 'Pakistani',
    phone: '+971 55 333 4444',
    email: 'omalik@example.pk',
    property: 'Studio Downtown',
    bedrooms: 'Studio',
    budget: '50,000–60,000',
    moveInDate: '2026-05-15',
    status: 'documents_pending',
    leasingStage: 6,
    date: '2026-04-08',
    notes: 'Passport and Emirates ID received. Awaiting salary certificate.',
    source: 'Dubizzle',
  },
  {
    id: 4,
    name: 'Aisha Al Hashemi',
    nationality: 'Emirati',
    phone: '+971 54 444 5555',
    email: 'aahasemi@example.ae',
    property: 'Apt 3BR DIFC',
    bedrooms: '3BR',
    budget: '180,000–220,000',
    moveInDate: '2026-06-15',
    status: 'approved',
    leasingStage: 7,
    date: '2026-04-07',
    notes: 'Contract signed. Awaiting Ejari registration.',
    source: 'WhatsApp Inquiry',
  },
  {
    id: 5,
    name: 'Viktor Petrov',
    nationality: 'Russian',
    phone: '+971 56 555 6666',
    email: 'vpetrov@example.ru',
    property: '2BR Palm Shoreline',
    bedrooms: '2BR',
    budget: '150,000–180,000',
    moveInDate: '2026-05-01',
    status: 'new',
    leasingStage: 1,
    date: '2026-04-10',
    notes: 'New lead — initial contact pending.',
    source: 'Website',
  },
];
