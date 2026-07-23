/**
 * Shared TypeScript interfaces for Owner Dashboard tab components.
 * All tab components should use these types for prop definitions.
 */

// ─── Common Tab Data Shapes ───────────────────────────────────────────

export interface OverviewData {
  totalProperties?: number;
  activeAgents?: number;
  monthlyRevenue?: number;
  whatsappLeads?: number;
  uaepassUsers?: number;
  chatbotConversations?: number;
  recentActivities?: Array<{
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  interest: string;
  priority: string;
  status: string;
  agent: string;
  createdAt: string;
}

export interface LeadsData {
  leads?: Lead[];
}

export interface Property {
  id: number;
  code: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: string;
  agent: string | null;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export interface PropertiesData {
  properties?: Property[];
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  properties: number;
  leads: number;
  dealsClosed: number;
  revenue: number;
  rating: number;
  online: boolean;
  avatar: string | null;
}

export interface AgentsData {
  agents?: Agent[];
}

export interface Contract {
  id: number;
  contractNumber: string;
  type: 'tenancy' | 'sale';
  tenant?: string;
  landlord?: string;
  buyer?: string;
  seller?: string;
  property: string;
  startDate?: string;
  endDate?: string;
  completionDate?: string;
  amount: number;
  status: string;
  ejariStatus: string;
  signatureStatus?: 'pending' | 'sent' | 'opened' | 'signed' | 'rejected' | 'expired';
}

export interface ContractsData {
  contracts?: Contract[];
}

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface AnalyticsEmirateRevenue {
  emirate: string;
  revenue: number;
  percentage: number;
}

export interface AnalyticsPropertyPerformance {
  type: string;
  views: number;
  inquiries: number;
  deals: number;
}

export interface AnalyticsTopAgent {
  name: string;
  deals: number;
  revenue: number;
}

export interface AnalyticsData {
  metrics?: AnalyticsMetric[];
  revenueByEmirate?: AnalyticsEmirateRevenue[];
  propertyPerformance?: AnalyticsPropertyPerformance[];
  topAgents?: AnalyticsTopAgent[];
  [key: string]: unknown;
}

export interface WhatsAppStats {
  totalContacts: number;
  activeConversations: number;
  messagesThisMonth: number;
  responseRate: number;
  avgResponseTime: string;
  leadsGenerated: number;
}

export interface WhatsAppData {
  whatsappStats?: WhatsAppStats;
}

export interface ChatbotStats {
  totalConversations: number;
  successfulLeads: number;
  avgResponseTime: number;
  satisfactionRate: number;
  activeChats: number;
  messagesProcessed: number;
}

export interface ChatbotData {
  chatbotStats?: ChatbotStats;
}

export interface UAEPassStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerification: number;
  thisMonth: number;
  conversionRate: number;
}

export interface UAEPassUser {
  id: number;
  name: string;
  emiratesId: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  registeredAt: string;
  lastLogin: string | null;
}

export interface UAEPassData {
  uaepassStats?: UAEPassStats;
  uaepassUsers?: UAEPassUser[];
}

export interface SettingsData {
  // Currently unused - component uses Config defaults
  [key: string]: unknown;
}

export interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  address: string;
  reraNumber: string;
  dldLicense: string;
  established: string;
  whatsappEnabled: boolean;
  chatbotEnabled: boolean;
  uaepassEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  leadAutoAssign: boolean;
  darkMode: boolean;
}

// ─── Common Tab Prop Interfaces ───────────────────────────────────────

export interface OverviewTabProps {
  data: OverviewData;
  loading?: boolean;
  onQuickAction?: (action: string) => void;
}

export interface LeadsTabProps {
  data: LeadsData;
  loading?: boolean;
  error?: string | null;
  onAction?: (action: string, id?: number) => void;
}

export interface PropertiesTabProps {
  data: PropertiesData;
  loading?: boolean;
  error?: string | null;
  onAction?: (action: string, id?: number) => void;
}

export interface AgentsTabProps {
  data: AgentsData;
  loading?: boolean;
  error?: string | null;
  onAction?: (action: string, id?: number) => void;
}

export interface ContractsTabProps {
  data: ContractsData;
  loading?: boolean;
  onAction?: (action: string, id?: number) => void;
}

export interface AnalyticsTabProps {
  data?: AnalyticsData;
  loading?: boolean;
}

export interface WhatsAppTabProps {
  data: WhatsAppData;
  loading?: boolean;
  onAction?: (action: string, data?: unknown) => void;
}

export interface ChatbotTabProps {
  data: ChatbotData;
  loading?: boolean;
  onAction?: (action: string) => void;
}

export interface UAEPassTabProps {
  data: UAEPassData;
  loading?: boolean;
  onAction?: (action: string, id?: number) => void;
}

export interface SettingsTabProps {
  data?: SettingsData;
  onAction?: (action: string, id?: string) => void;
  onSave?: (settings: Settings) => void;
}

export interface UsersTabProps {
  onAction?: (action: string, data?: Record<string, unknown>) => void;
}

export interface SQATabProps {
  onAction?: (action: string, data?: Record<string, unknown>) => void;
}

// ─── Status/Badge Types ──────────────────────────────────────────────

export type LeadPriority = 'high' | 'medium' | 'low';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'whatsapp' | 'website' | 'chatbot' | 'referral';

export type PropertyStatus = 'available' | 'reserved' | 'under_contract' | 'sold' | 'off_market';

export type ContractStatus = 'active' | 'pending' | 'completed' | 'expired';
export type EjariStatus = 'registered' | 'pending';

export type UAEPassVerificationStatus = 'verified' | 'pending';
export type UAEPassRole = 'buyer' | 'seller' | 'landlord' | 'tenant' | 'agent';

export type UserStatus = 'active' | 'pending' | 'inactive';
