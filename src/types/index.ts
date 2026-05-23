/**
 * White Caves CRM - Type Definitions
 * Central location for all TypeScript types across the application
 */

// ============================================================================
// AUTHENTICATION & USER TYPES
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  EXECUTIVE = 'executive',
  MANAGER = 'manager',
  AGENT = 'agent',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  department: string;
  profileImage?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorVerification {
  email: string;
  code: string;
}

// ============================================================================
// LEAD TYPES (Clara - CRM Lead Manager)
// ============================================================================

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  VIEWING = 'viewing',
  OFFERED = 'offered',
  WON = 'won',
  LOST = 'lost',
}

export enum LeadSource {
  WHATSAPP = 'whatsapp',
  WEBSITE = 'website',
  PHONE = 'phone',
  REFERRAL = 'referral',
  MARKETING = 'marketing',
  DIRECT = 'direct',
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  status: LeadStatus;
  score: number; // 0-100, 90+ = hot
  source: LeadSource;
  assignedAgent?: string;
  budget?: {
    min: number;
    max: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  propertyType?: string;
  location?: string;
  timeline?: 'urgent' | '1-3-months' | '3-6-months' | 'future';
  notes?: string;
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'sms' | 'whatsapp' | 'visit' | 'note';
  description: string;
  outcome?: string;
  duration?: number; // minutes
  timestamp: Date;
  agentId: string;
}

export interface LeadPipelineData {
  newLeads: number;
  contacted: number;
  qualified: number;
  viewing: number;
  offered: number;
  conversionRate: number; // %
  avgTimeToConversion: number; // days
}

// ============================================================================
// PROPERTY TYPES (Mary - Inventory Manager)
// ============================================================================

export enum PropertyType {
  VILLA = 'villa',
  APARTMENT = 'apartment',
  TOWNHOUSE = 'townhouse',
  PENTHOUSE = 'penthouse',
  STUDIO = 'studio',
  OFFICE = 'office',
  COMMERCIAL = 'commercial',
  LAND = 'land',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  RENTED = 'rented',
  ARCHIVED = 'archived',
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  area: number; // sq ft
  bedrooms: number;
  bathrooms: number;
  price: {
    amount: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  monthlyRent?: {
    amount: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  amenities: string[];
  features: string[];
  images: string[]; // URLs
  videoUrl?: string;
  virtualTourUrl?: string;
  neighborhood: string;
  community: string;
  developer?: string;
  reraNumber?: string;
  dldReference?: string;
  createdAt: Date;
  updatedAt: Date;
  bookmarkedBy?: string[]; // User IDs
  viewCount: number;
}

export interface PropertySearch {
  type?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minArea?: number;
  maxArea?: number;
  neighborhood?: string[];
  keyword?: string;
  radius?: number; // km
  lat?: number;
  lng?: number;
}

// ============================================================================
// TRANSACTION TYPES (Sophia - Pipeline Manager, Theodora - Finance)
// ============================================================================

export enum TransactionType {
  SALE = 'sale',
  LEASE = 'lease',
}

export enum TransactionStatus {
  INQUIRY = 'inquiry',
  OFFER_MADE = 'offer_made',
  OFFER_NEGOTIATING = 'offer_negotiating',
  OFFER_ACCEPTED = 'offer_accepted',
  CONTRACT_SIGNED = 'contract_signed',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_COMPLETED = 'payment_completed',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  leadId: string;
  propertyId: string;
  agentId: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  sellerEmail: string;
  offerPrice: {
    amount: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  finalPrice?: {
    amount: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  commission: {
    percentage: number;
    amount: number;
    paidToAgent: number;
    paidToBroker: number;
  };
  timeline: {
    inquiryDate: Date;
    offerDate?: Date;
    acceptanceDate?: Date;
    signatureDate?: Date;
    closingDate?: Date;
  };
  documents: string[]; // URLs
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommissionCalculation {
  transactionId: string;
  agentId: string;
  percentage: number;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  paidDate?: Date;
}

// ============================================================================
// TENANT & LEASING TYPES (Daisy - Leasing Manager)
// ============================================================================

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passport?: string;
  visaNumber?: string;
  employerName?: string;
  monthlyIncome?: number;
  references?: string[];
  documents: string[]; // URLs
  status: 'application' | 'approved' | 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: {
    amount: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  securityDeposit?: {
    amount: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  status: 'draft' | 'signed' | 'active' | 'ended' | 'terminated';
  ejariRegistration?: string;
  documents: string[]; // URLs
  createdAt: Date;
  updatedAt: Date;
}

export interface RentPayment {
  id: string;
  leaseId: string;
  amount: {
    amount: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  method?: 'bank_transfer' | 'credit_card' | 'cash' | 'check';
  notes?: string;
}

// ============================================================================
// FINANCIAL TYPES (Theodora - Finance Director)
// ============================================================================

export interface Payment {
  id: string;
  transactionId?: string;
  amount: {
    amount: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  type: 'commission' | 'rent' | 'deposit' | 'escrow';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank_transfer' | 'credit_card' | 'stripe' | 'check';
  reference?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface FinancialSummary {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  totalRevenue: number;
  totalExpenses: number;
  totalCommissions: number;
  netProfit: number;
  profitMargin: number;
  timestamp: Date;
}

// ============================================================================
// DASHBOARD & REPORTING TYPES (Zoe - Executive)
// ============================================================================

export interface DashboardKPIs {
  salesMetrics: {
    monthlyTransactions: number;
    pipelineValue: number;
    conversionRate: number;
    avgTransactionValue: number;
  };
  agentMetrics: {
    totalAgents: number;
    activeAgents: number;
    topAgent: string;
    avgProductivity: number;
  };
  financialMetrics: {
    monthlyRevenue: number;
    monthlyProfit: number;
    profitMargin: number;
    avgCommission: number;
  };
  customerMetrics: {
    totalLeads: number;
    hotLeads: number;
    customerSatisfaction: number;
    repeatCustomers: number;
  };
  operationalMetrics: {
    systemUptime: number;
    avgResponseTime: number;
    supportTickets: number;
    resolvedTickets: number;
  };
}

export interface Report {
  id: string;
  title: string;
  type: 'sales' | 'financial' | 'performance' | 'custom';
  period: {
    startDate: Date;
    endDate: Date;
  };
  data: Record<string, any>;
  generatedBy: string;
  generatedAt: Date;
}

// ============================================================================
// WHATSAPP TYPES (Nadia - WhatsApp CRM, Nina - Bot)
// ============================================================================

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  message: string;
  type: 'text' | 'image' | 'video' | 'document' | 'location';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  botGenerated?: boolean;
  agentId?: string;
}

export interface WhatsAppConversation {
  id: string;
  phoneNumber: string;
  leadId?: string;
  agentId?: string;
  messages: WhatsAppMessage[];
  lastMessage: string;
  lastMessageTime: Date;
  status: 'open' | 'closed' | 'escalated';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

export interface LeadsState {
  items: Lead[];
  currentLead: Lead | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: LeadStatus;
    source?: LeadSource;
    minScore?: number;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

export interface PropertiesState {
  items: Property[];
  currentProperty: Property | null;
  loading: boolean;
  error: string | null;
  filters: PropertySearch;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

export interface FinanceState {
  transactions: Transaction[];
  commissions: CommissionCalculation[];
  summary: FinancialSummary | null;
  loading: boolean;
  error: string | null;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    dismiss?: boolean;
  }>;
}
