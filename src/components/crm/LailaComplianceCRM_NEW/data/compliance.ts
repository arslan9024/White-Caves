export interface KYCVerification {
  id: number;
  name: string;
  type: string;
  status: string;
  date: string;
  documents: string[];
  riskLevel: string;
}

export interface Contract {
  id: number;
  title: string;
  parties: string;
  status: string;
  type: string;
  value: number;
  date: string;
}

export interface AMLAlert {
  id: number;
  client: string;
  type: string;
  amount: number;
  status: string;
  date: string;
}

export const KYC_VERIFICATIONS: KYCVerification[] = [
  { id: 1, name: 'Ahmed Al Rashid', type: 'buyer', status: 'verified', date: '2024-01-08', documents: ['passport', 'visa', 'bank_statement'], riskLevel: 'low' },
  { id: 2, name: 'Sarah Johnson', type: 'seller', status: 'pending', date: '2024-01-07', documents: ['passport', 'title_deed'], riskLevel: 'medium' },
  { id: 3, name: 'Mohammed Khan', type: 'buyer', status: 'requires_review', date: '2024-01-06', documents: ['passport', 'visa'], riskLevel: 'high' },
  { id: 4, name: 'Maria Santos', type: 'investor', status: 'verified', date: '2024-01-05', documents: ['passport', 'poa', 'bank_statement'], riskLevel: 'low' },
  { id: 5, name: 'James Wilson', type: 'buyer', status: 'rejected', date: '2024-01-04', documents: ['passport'], riskLevel: 'high' }
];

export const CONTRACTS: Contract[] = [
  { id: 1, title: 'Sales Agreement - Villa 348', parties: 'White Caves ↔ Al Rashid', status: 'pending_review', type: 'sale', value: 2500000, date: '2024-01-08' },
  { id: 2, title: 'Tenancy Contract - Apt 1205', parties: 'Owner ↔ Tenant', status: 'approved', type: 'lease', value: 120000, date: '2024-01-07' },
  { id: 3, title: 'Agency Agreement - Palm', parties: 'White Caves ↔ Developer', status: 'under_negotiation', type: 'agency', value: 0, date: '2024-01-06' }
];

export const AML_ALERTS: AMLAlert[] = [
  { id: 1, client: 'Unknown Source', type: 'large_transaction', amount: 5000000, status: 'investigating', date: '2024-01-08' },
  { id: 2, client: 'Mohammed Khan', type: 'pep_flag', amount: 0, status: 'cleared', date: '2024-01-07' }
];
