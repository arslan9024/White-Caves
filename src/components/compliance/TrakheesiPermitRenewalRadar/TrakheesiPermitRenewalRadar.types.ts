/**
 * TrakheesiPermitRenewalRadar.types.ts
 * Type definitions for DLD Trakheesi Permit Expiry & Auto-Renewal Pipeline
 * Architecture: AEGIS Single Purpose File Law (< 350 lines)
 * Law: AEG-001–009, Context Triad, Statutory DLD & RERA 180-Day Rule
 */

export type PermitType = 'broker_card' | 'property_ad' | 'company_orn' | 'noc_permit';

export type ComplianceRiskLevel = 'critical' | 'warning' | 'compliant';

export interface TrakheesiPermitRecord {
  id: string;
  permitNumber: string;
  type: PermitType;
  holderName: string; // Broker name or Property title
  referenceCode: string; // BRN or Property ID
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  riskLevel: ComplianceRiskLevel;
  portalSyncStatus: 'synced' | 'pending_sync' | 'renewal_queued';
  autoRenewEnabled: boolean;
  statutoryFeeAED: number;
}

export interface TrakheesiPermitRenewalRadarProps {
  initialPermits?: TrakheesiPermitRecord[];
  onTriggerRenewal?: (permitId: string, statutoryFeeAED: number) => void;
  onSyncDldPortal?: () => void;
}
