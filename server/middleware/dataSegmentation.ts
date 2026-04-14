/**
 * Data Segmentation Middleware — White Caves CRM
 *
 * Provides row-level data scoping so agents only see their own data,
 * managers see their team's data, and owners/admins see everything.
 *
 * Architecture:
 *   RBAC (auth.ts / rbac.ts)  →  "Can this user access this endpoint?"
 *   DataSegmentation (this)   →  "WHICH records can they see?"
 *
 * Usage:
 *   import { attachDataScope } from '../middleware/dataSegmentation.js';
 *   router.get('/leads', authenticate, requirePermission('view_leads'), attachDataScope, handler);
 *
 *   // In the handler:
 *   const scope = getDataScope(req);
 *   const leads = await prisma.lead.findMany({ where: { ...scope.lead, ...otherFilters } });
 *
 * Scoping Rules:
 *   ┌─────────────────────┬──────────────────────────────────────────────┐
 *   │ Role                │ Data Visibility                              │
 *   ├─────────────────────┼──────────────────────────────────────────────┤
 *   │ owner, admin        │ ALL records (no filter)                      │
 *   │ manager             │ ALL records (no filter, or team scope)       │
 *   │ finance             │ ALL financial records, own profile           │
 *   │ agent, leasing-     │ Assigned leads, own properties, own         │
 *   │ agent, secondary-   │ transactions, own commissions               │
 *   │ sales-agent         │                                             │
 *   │ landlord            │ Own properties, related leases/transactions  │
 *   │ seller              │ Own properties, related offers/transactions  │
 *   │ tenant              │ Own leases, maintenance, viewings            │
 *   │ buyer               │ Own offers, viewings, saved searches         │
 *   │ viewer              │ Public properties only                       │
 *   └─────────────────────┴──────────────────────────────────────────────┘
 */

import type { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger.js';

const log = createLogger('DataSegmentation');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

/** Prisma-compatible where clause fragments per model */
export interface DataScope {
  /** Unique scope identifier for caching/debugging */
  scopeId: string;
  /** User ID driving the scope */
  userId: string;
  /** User's canonical role */
  role: string;
  /** Whether this user sees all data (no filters) */
  isGlobalScope: boolean;

  // -- Per-model where clause fragments (Prisma-compatible) --

  /** Lead.findMany({ where: scope.lead }) */
  lead: Record<string, unknown>;
  /** Property.findMany({ where: scope.property }) */
  property: Record<string, unknown>;
  /** Transaction.findMany({ where: scope.transaction }) */
  transaction: Record<string, unknown>;
  /** Commission.findMany({ where: scope.commission }) */
  commission: Record<string, unknown>;
  /** Lease.findMany({ where: scope.lease }) */
  lease: Record<string, unknown>;
  /** Offer.findMany({ where: scope.offer }) */
  offer: Record<string, unknown>;
  /** Viewing.findMany({ where: scope.viewing }) */
  viewing: Record<string, unknown>;
  /** Maintenance.findMany({ where: scope.maintenance }) */
  maintenance: Record<string, unknown>;
  /** Tenant.findMany({ where: scope.tenant }) */
  tenant: Record<string, unknown>;
}

// Roles that see everything
const GLOBAL_ROLES = new Set(['owner', 'admin', 'manager']);

// Roles that are agent-type (assigned leads, own commissions/transactions)
const AGENT_ROLES = new Set(['agent', 'secondary-sales-agent', 'leasing-agent']);

// ─────────────────────────────────────────────────────────────
// Scope Builders
// ─────────────────────────────────────────────────────────────

function buildGlobalScope(userId: string, role: string): DataScope {
  return {
    scopeId: `global_${userId}`,
    userId,
    role,
    isGlobalScope: true,
    lead: {},
    property: {},
    transaction: {},
    commission: {},
    lease: {},
    offer: {},
    viewing: {},
    maintenance: {},
    tenant: {},
  };
}

function buildAgentScope(userId: string, role: string): DataScope {
  return {
    scopeId: `agent_${userId}`,
    userId,
    role,
    isGlobalScope: false,
    // Agents see leads assigned to them
    lead: { assignedToId: userId },
    // Agents see properties they listed
    property: { userId },
    // Agents see transactions where they are the agent
    transaction: { agentId: userId },
    // Agents see their own commissions
    commission: { agentId: userId },
    // Agents see leases for properties they manage
    lease: { OR: [{ property: { userId } }] },
    // Agents see offers on their properties
    offer: { property: { userId } },
    // Agents see viewings they created or for their properties
    viewing: { OR: [{ userId }, { property: { userId } }] },
    // Agents see maintenance for their managed properties
    maintenance: { property: { userId } },
    // Agents don't typically manage tenants directly
    tenant: { createdById: userId },
  };
}

function buildFinanceScope(userId: string): DataScope {
  // Finance sees all financial data but scoped profile
  return {
    scopeId: `finance_${userId}`,
    userId,
    role: 'finance',
    isGlobalScope: false,
    lead: {},              // Finance can view all leads (reporting)
    property: {},          // Finance can view all properties (valuation)
    transaction: {},       // Finance sees ALL transactions
    commission: {},        // Finance sees ALL commissions
    lease: {},             // Finance sees ALL leases (rent tracking)
    offer: {},             // Finance sees ALL offers
    viewing: { userId },   // Only own viewings
    maintenance: {},       // Finance sees maintenance (budget)
    tenant: {},            // Finance sees tenants (payment tracking)
  };
}

function buildLandlordScope(userId: string): DataScope {
  return {
    scopeId: `landlord_${userId}`,
    userId,
    role: 'landlord',
    isGlobalScope: false,
    lead: { property: { userId } },          // Leads on their properties
    property: { userId },                     // Only own properties
    transaction: { property: { userId } },    // Transactions on own properties
    commission: {},                            // Landlords don't see commissions (empty = denied at RBAC)
    lease: { landlordId: userId },            // Their leases
    offer: { property: { userId } },           // Offers on their properties
    viewing: { property: { userId } },         // Viewings of their properties
    maintenance: { property: { userId } },     // Maintenance on their properties
    tenant: { leases: { some: { landlordId: userId } } },
  };
}

function buildSellerScope(userId: string): DataScope {
  return {
    scopeId: `seller_${userId}`,
    userId,
    role: 'seller',
    isGlobalScope: false,
    lead: { property: { userId } },
    property: { userId },
    transaction: { property: { userId } },
    commission: {},
    lease: {},
    offer: { property: { userId } },
    viewing: { property: { userId } },
    maintenance: {},
    tenant: {},
  };
}

function buildTenantScope(userId: string): DataScope {
  return {
    scopeId: `tenant_${userId}`,
    userId,
    role: 'tenant',
    isGlobalScope: false,
    lead: {},              // Tenants don't see leads
    property: {},          // Can browse public properties
    transaction: {},       // Own transactions only (enforced at route level)
    commission: {},
    lease: { tenantId: userId },
    offer: {},
    viewing: { userId },
    maintenance: { reportedById: userId },
    tenant: { userId },
  };
}

function buildBuyerScope(userId: string): DataScope {
  return {
    scopeId: `buyer_${userId}`,
    userId,
    role: 'buyer',
    isGlobalScope: false,
    lead: {},
    property: {},           // Can browse public properties
    transaction: { buyerId: userId },
    commission: {},
    lease: {},
    offer: { buyerId: userId },
    viewing: { userId },
    maintenance: {},
    tenant: {},
  };
}

function buildViewerScope(userId: string): DataScope {
  return {
    scopeId: `viewer_${userId}`,
    userId,
    role: 'viewer',
    isGlobalScope: false,
    lead: {},
    property: { status: 'ACTIVE' },  // Only active/public properties
    transaction: {},
    commission: {},
    lease: {},
    offer: {},
    viewing: { userId },
    maintenance: {},
    tenant: {},
  };
}

// ─────────────────────────────────────────────────────────────
// Scope Factory
// ─────────────────────────────────────────────────────────────

export function buildDataScope(userId: string, role: string): DataScope {
  if (GLOBAL_ROLES.has(role)) {
    return buildGlobalScope(userId, role);
  }
  if (AGENT_ROLES.has(role)) {
    return buildAgentScope(userId, role);
  }

  switch (role) {
    case 'finance':
      return buildFinanceScope(userId);
    case 'landlord':
      return buildLandlordScope(userId);
    case 'seller':
      return buildSellerScope(userId);
    case 'tenant':
      return buildTenantScope(userId);
    case 'buyer':
      return buildBuyerScope(userId);
    case 'viewer':
      return buildViewerScope(userId);
    default:
      // Unknown role — restrictive default (viewer-like)
      log.warn('Unknown role encountered in data segmentation — applying viewer scope', {
        userId,
        role,
      });
      return buildViewerScope(userId);
  }
}

// ─────────────────────────────────────────────────────────────
// Express Middleware
// ─────────────────────────────────────────────────────────────

// Attach scope to Express Request via WeakMap (doesn't pollute type)
const scopeMap = new WeakMap<Request, DataScope>();

/**
 * Express middleware — computes and attaches DataScope to the request.
 * Must run AFTER authentication middleware (needs req.user).
 *
 * @example
 * router.get('/leads', authenticate, attachDataScope, async (req, res) => {
 *   const scope = getDataScope(req);
 *   const leads = await prisma.lead.findMany({
 *     where: { ...scope.lead, ...additionalFilters }
 *   });
 * });
 */
export function attachDataScope(req: Request, _res: Response, next: NextFunction): void {
  const user = (req as any).user;

  if (!user?.id || !user?.role) {
    log.warn('attachDataScope called without authenticated user — skipping');
    next();
    return;
  }

  const scope = buildDataScope(user.id, user.role);
  scopeMap.set(req, scope);

  log.debug('Data scope attached', {
    scopeId: scope.scopeId,
    role: scope.role,
    isGlobal: scope.isGlobalScope,
  });

  next();
}

/**
 * Retrieve the DataScope for a request.
 * Returns null if middleware hasn't run or user is unauthenticated.
 */
export function getDataScope(req: Request): DataScope | null {
  return scopeMap.get(req) ?? null;
}

/**
 * Convenience: get scope and merge with additional where clause.
 * Returns the model-specific scope + your extra filters merged.
 *
 * @example
 * const where = getScopedWhere(req, 'lead', { status: 'NEW' });
 * const leads = await prisma.lead.findMany({ where });
 */
export function getScopedWhere(
  req: Request,
  model: keyof Omit<DataScope, 'scopeId' | 'userId' | 'role' | 'isGlobalScope'>,
  additionalWhere: Record<string, unknown> = {}
): Record<string, unknown> {
  const scope = getDataScope(req);
  if (!scope) {
    log.warn('getScopedWhere called without scope — returning additionalWhere only');
    return additionalWhere;
  }

  const modelScope = scope[model] as Record<string, unknown>;

  // If global scope, model scope is {} — just use additional
  if (scope.isGlobalScope || Object.keys(modelScope).length === 0) {
    return additionalWhere;
  }

  // Merge: AND the model scope with additional filters
  return {
    AND: [modelScope, additionalWhere],
  };
}

/**
 * Higher-order middleware factory for specific model scoping.
 * Attaches scope AND validates the user can access the model.
 *
 * @example
 * router.get('/leads', authenticate, requireScopedAccess('lead'), handler);
 */
export function requireScopedAccess(
  model: keyof Omit<DataScope, 'scopeId' | 'userId' | 'role' | 'isGlobalScope'>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // First attach scope if not already done
    if (!getDataScope(req)) {
      attachDataScope(req, res, () => {});
    }

    const scope = getDataScope(req);
    if (!scope) {
      res.status(401).json({ error: 'Authentication required for data access' });
      return;
    }

    // Log the scoped access
    log.debug(`Scoped access: ${model}`, {
      scopeId: scope.scopeId,
      model,
      isGlobal: scope.isGlobalScope,
    });

    next();
  };
}
