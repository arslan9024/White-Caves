// FILE: src/components/crm/LandlordManager/LandlordManager.types.ts
/**
 * White Caves Real Estate LLC - Landlord Manager TypeScript System Contracts
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type LandlordTab = 'overview' | 'tenancies' | 'pdc' | 'maintenance' | 'yield';

export type ChequeStatus = 'cleared' | 'pending' | 'in_escrow' | 'bounced' | 'holding';

export type MaintenancePriority = 'emergency' | 'high' | 'medium' | 'low';

export type MaintenanceStatus =
  | 'submitted'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface LandlordProperty {
  id: string;
  propertyCode: string;
  title: string;
  community: string;
  unitNumber: string;
  propertyType: 'apartment' | 'villa' | 'penthouse' | 'townhouse';
  annualRentAed: number;
  occupancyStatus: 'occupied' | 'vacant' | 'under_maintenance';
  activeTenant?: {
    name: string;
    email: string;
    phone: string;
  };
  ejariNumber?: string;
  leaseEndDate?: string;
}

export interface PdcCheque {
  id: string;
  chequeNumber: string;
  bankName: string;
  drawerName: string;
  propertyId: string;
  unitNumber: string;
  amountAed: number;
  dueDate: string;
  status: ChequeStatus;
  notes?: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketCode: string;
  propertyId: string;
  unitNumber: string;
  tenantName: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'appliance';
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  estimatedCostAed: number;
  submittedAt: string;
  assignedContractor?: string;
}

export interface LandlordMetrics {
  totalProperties: number;
  occupancyRate: number;
  totalAnnualRentAed: number;
  clearedPdcAed: number;
  pendingPdcAed: number;
  bouncedPdcAed: number;
  activeMaintenanceTickets: number;
  netRentalYieldPercent: number;
}
