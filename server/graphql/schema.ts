/**
 * server/graphql/schema.ts — Wave 31 High-Throughput GraphQL Schema & Resolver Engine
 *
 * Implements field-level RBAC authorization, batch DataLoaders for N+1 query elimination,
 * and unified schema definitions for White Caves Real Estate platform.
 */

import { db, safeDbQuery } from '../db.js';

// ─── Type Definitions ──────────────────────────────────────────────────────────

export const typeDefs = `
  enum Role {
    OWNER
    AGENT
    VIEWER
    LEVEL_5_MASTER
  }

  enum ChequeStatus {
    UPCOMING
    DUE
    DEPOSITED
    BOUNCED
    CLEARED
  }

  type PostDatedCheque {
    id: ID!
    amount: Float!
    dueDate: String!
    status: ChequeStatus!
    propertyId: String
    tenantId: String
  }

  type PDCAnalytics {
    upcomingCount: Int!
    dueThisWeek: Int!
    bouncedCount: Int!
  }

  type Property {
    id: ID!
    title: String!
    description: String
    type: String!
    status: String!
    price: Float!
    currency: String!
    bedrooms: Int!
    bathrooms: Int!
    sqft: Int!
    location: String!
    amenities: [String!]!
    images: [String!]!
    featured: Boolean!
    agentName: String
  }

  type User {
    id: ID!
    email: String!
    name: String
    role: String!
    phone: String
    department: String
    status: String!
    brnNumber: String
  }

  type Lead {
    id: ID!
    name: String!
    email: String!
    phone: String
    status: String!
    source: String!
    budget: Float
    createdAt: String!
  }

  type ReraCommercialRentResult {
    benchmark: Float!
    maxIncreasePct: Float!
    allowableIncreaseAed: Float!
    maxAllowableRent: Float!
  }

  type VatInvoiceResult {
    net: Float!
    vatAmount: Float!
    grossAmount: Float!
    trn: String!
    invoiceNumber: String!
    date: String!
  }

  type FinancialMetrics {
    revenue: Float!
    expenses: Float!
    vatCollected: Float!
    cashFlowForecast: [Float!]!
    variance: Float!
  }

  type Query {
    properties(limit: Int, offset: Int, type: String): [Property!]!
    property(id: ID!): Property
    users(role: String): [User!]!
    me: User
    leads(status: String): [Lead!]!
    health: String!
    generateVatInvoice(amount: Float!, isExempt: Boolean): VatInvoiceResult!
    financialReport(year: Int!): FinancialMetrics!
    postDatedCheques(propertyId: ID, status: String): [PostDatedCheque!]!
    pdcDashboard: PDCAnalytics!
  }

  type Mutation {
    createProperty(
      title: String!
      type: String!
      price: Float!
      location: String!
      bedrooms: Int
      bathrooms: Int
      sqft: Int
    ): Property!
    updateChequeStatus(id: ID!, status: ChequeStatus!): PostDatedCheque!
  }
`;

// ─── Simple DataLoader Batching Layer ─────────────────────────────────────────

export class PropertyDataLoader {
  private cache = new Map<string, any>();

  async load(id: string): Promise<any | null> {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    const property = await safeDbQuery(async () => {
      return (db.property as any).findUnique({ where: { id } });
    }, null);
    if (property) {
      this.cache.set(id, property);
    }
    return property;
  }

  async loadMany(ids: string[]): Promise<any[]> {
    const uncached = ids.filter((id) => !this.cache.has(id));
    if (uncached.length > 0) {
      const fetched = await safeDbQuery(async () => {
        return (db.property as any).findMany({ where: { id: { in: uncached } } });
      }, []);
      for (const p of fetched) {
        this.cache.set(p.id, p);
      }
    }
    return ids.map((id) => this.cache.get(id)).filter(Boolean);
  }

  clear(): void {
    this.cache.clear();
  }
}

// ─── RBAC Helper Directive ────────────────────────────────────────────────────

export function checkFieldAuth(userRole: string | undefined, requiredRole: string): boolean {
  if (!userRole) return false;
  if (userRole === 'owner' || userRole === 'admin' || userRole === 'LEVEL_5_MASTER') return true;
  return userRole.toLowerCase() === requiredRole.toLowerCase();
}

export interface PropertiesQueryArgs {
  limit?: number;
  offset?: number;
  type?: string;
}

export interface PropertyQueryArgs {
  id: string;
}

export interface UsersQueryArgs {
  role?: string;
}

export interface LeadsQueryArgs {
  status?: string;
}

export interface CalculateReraCommercialRentArgs {
  zone: string;
  currentRentAed: number;
}

export interface GenerateVatInvoiceArgs {
  amount: number;
  isExempt?: boolean;
}

export interface FinancialReportArgs {
  year: number;
}

export interface PostDatedChequesArgs {
  propertyId?: string;
  status?: string;
}

export interface UpdateChequeStatusArgs {
  id: string;
  status: string;
}

export interface CreatePropertyMutationArgs {
  title: string;
  type: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
}

// ─── Resolvers Engine ─────────────────────────────────────────────────────────

export const resolvers = {
  Query: {
    health: () => 'OK',

    properties: async (_parent: unknown, { limit = 20, offset = 0, type }: PropertiesQueryArgs) => {
      return safeDbQuery(async () => {
        const where: Record<string, unknown> = {};
        if (type) where.type = type;
        return (db.property as any).findMany({
          where,
          take: Math.min(limit, 100),
          skip: offset,
          orderBy: { createdAt: 'desc' },
        });
      }, []);
    },

    property: async (_parent: unknown, { id }: PropertyQueryArgs, context: { propertyLoader?: PropertyDataLoader }) => {
      if (context.propertyLoader) {
        return context.propertyLoader.load(id);
      }
      return safeDbQuery(async () => {
        return (db.property as any).findUnique({ where: { id } });
      }, null);
    },

    users: async (_parent: unknown, { role }: UsersQueryArgs, context: { currentUser?: { role?: string } }) => {
      if (!checkFieldAuth(context.currentUser?.role, 'manager')) {
        throw new Error('UNAUTHORIZED: Manager or higher role required');
      }
      return safeDbQuery(async () => {
        const where: Record<string, unknown> = {};
        if (role) where.role = role;
        return (db.user as any).findMany({ where, take: 50 });
      }, []);
    },

    me: async (_parent: unknown, _args: unknown, context: { currentUser?: { id?: string } }) => {
      if (!context.currentUser?.id) return null;
      return safeDbQuery(async () => {
        return (db.user as any).findUnique({ where: { id: context.currentUser!.id } });
      }, null);
    },

    leads: async (_parent: unknown, { status }: LeadsQueryArgs) => {
      return safeDbQuery(async () => {
        const where: Record<string, unknown> = {};
        if (status) where.status = status;
        return (db.lead as any).findMany({ where, take: 50, orderBy: { createdAt: 'desc' } });
      }, []);
    },

    calculateReraCommercialRent: async (_parent: unknown, { zone, currentRentAed }: CalculateReraCommercialRentArgs) => {
      const benchmarkMap: Record<string, number> = {
        'Business Bay - Commercial Office': 320000,
        'Downtown Dubai - Grade A Corporate': 450000,
        'DIFC Non-Freezone Gate Precinct': 500000,
        'Jumeirah Lakes Towers (JLT) Commercial': 280000,
      };

      const benchmark = benchmarkMap[zone] || 320000;
      const current = currentRentAed || 1;
      const diffPct = ((benchmark - current) / benchmark) * 100;

      let maxIncreasePct = 0;
      if (diffPct > 40) maxIncreasePct = 20;
      else if (diffPct > 30) maxIncreasePct = 15;
      else if (diffPct > 20) maxIncreasePct = 10;
      else if (diffPct > 10) maxIncreasePct = 5;

      const allowableIncreaseAed = (current * maxIncreasePct) / 100;
      const maxAllowableRent = current + allowableIncreaseAed;

      return {
        benchmark,
        maxIncreasePct,
        allowableIncreaseAed,
        maxAllowableRent
      };
    },

    generateVatInvoice: async (_parent: unknown, { amount, isExempt }: GenerateVatInvoiceArgs) => {
      const net = amount || 0;
      const vatRate = isExempt ? 0 : 0.05; // 5% standard FTA VAT
      const vatAmount = net * vatRate;
      const grossAmount = net + vatAmount;
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      
      return {
        net,
        vatAmount,
        grossAmount,
        trn: '100432571200003', // Official White Caves TRN
        invoiceNumber,
        date: new Date().toISOString()
      };
    },

    financialReport: async (_parent: unknown, { year }: FinancialReportArgs, context: { currentUser?: { role?: string } }) => {
      if (!checkFieldAuth(context.currentUser?.role, 'manager')) {
        throw new Error('UNAUTHORIZED: Manager or higher role required');
      }
      
      // Mocked 12-month aggregated data for cash flow/budget variance 
      // Replace with real db aggregations in future waves.
      return {
        revenue: 24000000,
        expenses: 12000000,
        vatCollected: 1200000,
        cashFlowForecast: [2000000, 2100000, 1900000, 2200000, 2400000, 2500000, 2300000, 2100000, 2200000, 2400000, 2600000, 2800000],
        variance: 5.2 // 5.2% under budget
      };
    },

    postDatedCheques: async (_parent: unknown, { status }: PostDatedChequesArgs) => {
      // Mocked PDC response for calendar rendering
      let cheques = [
        { id: 'CHQ-001', amount: 30000, dueDate: '2025-12-01', status: 'DEPOSITED' },
        { id: 'CHQ-002', amount: 30000, dueDate: '2026-01-01', status: 'DEPOSITED' },
        { id: 'CHQ-003', amount: 30000, dueDate: '2026-02-01', status: 'UPCOMING' },
        { id: 'CHQ-004', amount: 30000, dueDate: '2026-03-01', status: 'DUE' },
        { id: 'CHQ-005', amount: 30000, dueDate: '2026-04-01', status: 'UPCOMING' },
        { id: 'CHQ-006', amount: 30000, dueDate: '2026-05-01', status: 'BOUNCED' },
      ];
      if (status) {
        cheques = cheques.filter(c => c.status === status);
      }
      return cheques;
    },

    pdcDashboard: async () => {
      // Mocked analytics for PDC dashboard
      return {
        upcomingCount: 14,
        dueThisWeek: 3,
        bouncedCount: 1
      };
    }
  },

  Mutation: {
    updateChequeStatus: async (_parent: unknown, { id, status }: UpdateChequeStatusArgs) => {
      // Mocked update response
      return {
        id,
        amount: 30000,
        dueDate: '2026-03-01',
        status
      };
    },

    createProperty: async (_parent: unknown, args: CreatePropertyMutationArgs, context: { currentUser?: { role?: string } }) => {
      if (!checkFieldAuth(context.currentUser?.role, 'agent')) {
        throw new Error('UNAUTHORIZED: Agent or higher role required');
      }
      return safeDbQuery(async () => {
        return (db.property as any).create({
          data: {
            title: args.title,
            type: args.type,
            price: args.price,
            location: args.location,
            bedrooms: args.bedrooms ?? 0,
            bathrooms: args.bathrooms ?? 0,
            sqft: args.sqft ?? 0,
            status: 'available',
            amenities: [],
            images: [],
          },
        });
      }, null);
    },
  },
};
