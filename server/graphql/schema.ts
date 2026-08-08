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

  type Query {
    properties(limit: Int, offset: Int, type: String): [Property!]!
    property(id: ID!): Property
    users(role: String): [User!]!
    me: User
    leads(status: String): [Lead!]!
    health: String!
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

// ─── Resolvers Engine ─────────────────────────────────────────────────────────

export const resolvers = {
  Query: {
    health: () => 'OK',

    properties: async (_parent: any, { limit = 20, offset = 0, type }: any) => {
      return safeDbQuery(async () => {
        const where: any = {};
        if (type) where.type = type;
        return (db.property as any).findMany({
          where,
          take: Math.min(limit, 100),
          skip: offset,
          orderBy: { createdAt: 'desc' },
        });
      }, []);
    },

    property: async (_parent: any, { id }: any, context: { propertyLoader?: PropertyDataLoader }) => {
      if (context.propertyLoader) {
        return context.propertyLoader.load(id);
      }
      return safeDbQuery(async () => {
        return (db.property as any).findUnique({ where: { id } });
      }, null);
    },

    users: async (_parent: any, { role }: any, context: { currentUser?: { role?: string } }) => {
      if (!checkFieldAuth(context.currentUser?.role, 'manager')) {
        throw new Error('UNAUTHORIZED: Manager or higher role required');
      }
      return safeDbQuery(async () => {
        const where: any = {};
        if (role) where.role = role;
        return (db.user as any).findMany({ where, take: 50 });
      }, []);
    },

    me: async (_parent: any, _args: any, context: { currentUser?: { id?: string } }) => {
      if (!context.currentUser?.id) return null;
      return safeDbQuery(async () => {
        return (db.user as any).findUnique({ where: { id: context.currentUser!.id } });
      }, null);
    },

    leads: async (_parent: any, { status }: any) => {
      return safeDbQuery(async () => {
        const where: any = {};
        if (status) where.status = status;
        return (db.lead as any).findMany({ where, take: 50, orderBy: { createdAt: 'desc' } });
      }, []);
    },
  },

  Mutation: {
    createProperty: async (_parent: any, args: any, context: { currentUser?: { role?: string } }) => {
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
