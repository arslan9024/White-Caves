/**
 * Dashboard API Response Types
 * ════════════════════════════════════════════════════════════════════════
 * Shared interfaces for data returned by backend API endpoints and
 * consumed by the role-based dashboard tab components.
 *
 * These replace the `any` annotations that were previously used in
 * useState hooks and .map() callbacks across AgentTabs, BuyerTabs,
 * LandlordTabs, SellerTabs, TenantTabs, and OwnerTabs.
 */

// ─── Nested Refs ───────────────────────────────────────────────────────

/** Lightweight property reference embedded in other entities */
export interface PropertyRef {
  title: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
}

/** Lightweight person reference (tenant, landlord, buyer, agent, user) */
export interface PersonRef {
  name: string;
}

// ─── Core Entities ─────────────────────────────────────────────────────

export interface DashboardLease {
  id: string;
  property?: PropertyRef;
  propertyId?: string;
  tenant?: PersonRef;
  tenantId?: string;
  landlord?: PersonRef;
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  securityDeposit?: number;
  maintenanceCost?: number;
  status?: string;
  stage?: string;
  terms?: string;
}

export interface DashboardProperty {
  id: string;
  title: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  price?: number;
  type?: string;
  status?: string;
  views?: number;
  createdAt?: string;
}

export interface DashboardViewing {
  id: string;
  property?: PropertyRef;
  propertyId?: string;
  lead?: PersonRef;
  user?: PersonRef;
  agent?: PersonRef;
  scheduledDate?: string;
  scheduledAt?: string;
  status?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
}

export interface DashboardApplication {
  id: string;
  applicantName?: string;
  user?: PersonRef;
  property?: PropertyRef;
  createdAt?: string;
  status?: string;
  notes?: string;
}

export interface DashboardOffer {
  id: string;
  property?: PropertyRef;
  propertyId?: string;
  buyer?: PersonRef;
  user?: PersonRef;
  amount?: number;
  counterAmount?: number;
  status?: string;
  createdAt?: string;
}

export interface DashboardLead {
  id: string;
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  property?: PropertyRef;
  propertyId?: string;
  source?: string;
  propertyInterest?: string;
  budget?: number;
  score?: number;
  status?: string;
  lastContactDate?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface DashboardFavorite {
  id: string;
  property?: PropertyRef;
}

export interface DashboardSavedSearch {
  id: string;
  name?: string;
  filters?: {
    type?: string;
    location?: string;
    bedrooms?: number;
  };
  matchCount?: number;
  alertEnabled?: boolean;
}

export interface DashboardMaintenanceRequest {
  id: string;
  title: string;
  description?: string;
  property?: PropertyRef;
  priority?: string;
  category?: string;
  status?: string;
  cost?: number;
  createdAt?: string;
}

export interface DashboardPayment {
  id: string;
  paymentDate?: string;
  createdAt?: string;
  period?: string;
  amount?: number;
  method?: string;
  status?: string;
}

// ─── Stats / Aggregate Types ───────────────────────────────────────────

export interface DashboardMaintenanceStats {
  total?: number;
  open?: number;
  inProgress?: number;
  completed?: number;
}

export interface DashboardAgentStats {
  totalDeals?: number;
  totalVolume?: number;
  closedThisMonth?: number;
  conversionRate?: number;
  monthlyTarget?: number;
}

export interface DashboardOwnerStats {
  properties: number;
  leads: number;
  leases: number;
}

export interface DashboardFinanceAnalytics {
  totalRevenue?: number;
  monthlyRevenue?: number;
  occupancyRate?: number;
  avgDaysToLease?: number;
}

export interface DashboardSystemHealth {
  database?: string;
  [key: string]: unknown;
}
