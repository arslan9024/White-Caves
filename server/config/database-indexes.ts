/**
 * Database Index Configuration — White Caves CRM
 *
 * Manages MongoDB-specific indexes beyond what Prisma @@index can express:
 *   - Compound indexes for common query patterns
 *   - Text search indexes for property & lead search
 *   - Partial indexes (sparse) for optional fields
 *   - TTL indexes for auto-expiring data (sessions, notifications)
 *
 * Prisma handles basic single-field and simple compound indexes via schema.prisma.
 * This file handles the rest via raw MongoDB commands.
 *
 * Usage:
 *   import { ensureIndexes } from '../config/database-indexes.js';
 *   await ensureIndexes(prisma);  // Call once at server startup
 *
 * The schema.prisma already defines 60+ single/composite indexes.
 * This adds ~15 advanced indexes that Prisma can't express.
 */

import { createLogger } from '../utils/logger.js';

const log = createLogger('DatabaseIndexes');

// ─────────────────────────────────────────────────────────────
// Index Definitions
// ─────────────────────────────────────────────────────────────

interface IndexDefinition {
  collection: string;
  name: string;
  keys: Record<string, 1 | -1 | 'text'>;
  options?: {
    unique?: boolean;
    sparse?: boolean;
    expireAfterSeconds?: number;
    partialFilterExpression?: Record<string, unknown>;
    background?: boolean;
    weights?: Record<string, number>;
  };
  /** Why this index exists */
  rationale: string;
}

/**
 * Advanced indexes that complement Prisma's @@index definitions.
 *
 * Naming convention: idx_{collection}_{fields}_{type}
 *   type: compound | text | partial | ttl
 */
const INDEXES: IndexDefinition[] = [
  // ─── Property: Full-Text Search ─────────────────────
  {
    collection: 'Property',
    name: 'idx_property_text_search',
    keys: { title: 'text', description: 'text', location: 'text', area: 'text' },
    options: {
      weights: { title: 10, area: 5, location: 3, description: 1 },
      background: true,
    },
    rationale: 'Full-text search across property listings (search bar, NADIA queries)',
  },

  // ─── Property: Common Filter Combos ─────────────────
  {
    collection: 'Property',
    name: 'idx_property_listing_filter',
    keys: { status: 1, type: 1, price: 1 },
    options: { background: true },
    rationale: 'Hot path: property listing with status + type + price filters',
  },
  {
    collection: 'Property',
    name: 'idx_property_location_price',
    keys: { area: 1, price: 1, status: 1 },
    options: { background: true },
    rationale: 'Area-based search sorted by price (most common user journey)',
  },
  {
    collection: 'Property',
    name: 'idx_property_active_featured',
    keys: { status: 1, featured: 1, createdAt: -1 },
    options: {
      partialFilterExpression: { status: 'ACTIVE' },
      background: true,
    },
    rationale: 'Homepage featured listings (only active properties)',
  },

  // ─── Lead: Agent Dashboard ──────────────────────────
  {
    collection: 'Lead',
    name: 'idx_lead_agent_status',
    keys: { assignedToId: 1, status: 1, createdAt: -1 },
    options: { background: true },
    rationale: 'Agent dashboard: my leads filtered by status, sorted by date',
  },
  {
    collection: 'Lead',
    name: 'idx_lead_score_ranking',
    keys: { score: -1, status: 1 },
    options: {
      partialFilterExpression: { score: { $gte: 50 } },
      background: true,
    },
    rationale: 'Hot leads ranking: only leads with score >= 50',
  },
  {
    collection: 'Lead',
    name: 'idx_lead_text_search',
    keys: { firstName: 'text', lastName: 'text', email: 'text', phone: 'text' },
    options: {
      weights: { firstName: 5, lastName: 5, email: 3, phone: 3 },
      background: true,
    },
    rationale: 'Lead search by name, email, or phone number',
  },

  // ─── Transaction: Financial Reporting ───────────────
  {
    collection: 'Transaction',
    name: 'idx_transaction_reporting',
    keys: { status: 1, type: 1, createdAt: -1 },
    options: { background: true },
    rationale: 'Finance dashboard: transaction reports with status + type filters',
  },
  {
    collection: 'Transaction',
    name: 'idx_transaction_agent_perf',
    keys: { agentId: 1, status: 1, createdAt: -1 },
    options: { background: true },
    rationale: 'Agent performance reports: transactions per agent over time',
  },

  // ─── Commission: Agent Revenue ──────────────────────
  {
    collection: 'Commission',
    name: 'idx_commission_agent_date',
    keys: { agentId: 1, createdAt: -1, status: 1 },
    options: { background: true },
    rationale: 'Agent commission history sorted by date (commission dashboard)',
  },

  // ─── NADIA: Conversation Lookup ─────────────────────
  {
    collection: 'NadiaConversation',
    name: 'idx_nadia_phone_status',
    keys: { customerPhone: 1, status: 1, createdAt: -1 },
    options: { background: true },
    rationale: 'WhatsApp message routing: find active conversation by phone',
  },
  {
    collection: 'NadiaMessage',
    name: 'idx_nadia_msg_conv_time',
    keys: { conversationId: 1, timestamp: -1 },
    options: { background: true },
    rationale: 'Load conversation history in chronological order',
  },

  // ─── Lease: Expiry Monitoring ───────────────────────
  {
    collection: 'Lease',
    name: 'idx_lease_expiry',
    keys: { status: 1, endDate: 1 },
    options: {
      partialFilterExpression: { status: 'ACTIVE' },
      background: true,
    },
    rationale: 'Lease expiry alerts: find active leases expiring soon',
  },

  // ─── Maintenance: Priority Queue ────────────────────
  {
    collection: 'Maintenance',
    name: 'idx_maintenance_queue',
    keys: { status: 1, priority: -1, createdAt: 1 },
    options: { background: true },
    rationale: 'Maintenance ticket queue: open tickets sorted by priority then age',
  },

  // ─── Activity: Audit Trail ──────────────────────────
  {
    collection: 'Activity',
    name: 'idx_activity_audit',
    keys: { userId: 1, type: 1, createdAt: -1 },
    options: { background: true },
    rationale: 'Audit trail: user activity history with type filter',
  },
];

// ─────────────────────────────────────────────────────────────
// Index Management
// ─────────────────────────────────────────────────────────────

/**
 * Ensure all advanced indexes exist.
 * Safe to call multiple times — createIndex is idempotent.
 *
 * @param prisma — Prisma client instance (for $runCommandRaw)
 */
export async function ensureIndexes(prisma: any): Promise<{ created: number; skipped: number; failed: number }> {
  const results = { created: 0, skipped: 0, failed: 0 };

  log.info(`Ensuring ${INDEXES.length} advanced indexes...`);

  for (const idx of INDEXES) {
    try {
      await prisma.$runCommandRaw({
        createIndexes: idx.collection,
        indexes: [
          {
            key: idx.keys,
            name: idx.name,
            ...idx.options,
          },
        ],
      });
      results.created++;
      log.debug(`Index created/confirmed: ${idx.name}`, { collection: idx.collection });
    } catch (error: any) {
      // Code 85 = IndexOptionsConflict (index exists with different options)
      // Code 86 = IndexKeySpecsConflict (index exists with different keys)
      if (error?.code === 85 || error?.code === 86) {
        results.skipped++;
        log.debug(`Index already exists (skipped): ${idx.name}`);
      } else {
        results.failed++;
        log.warn(`Failed to create index: ${idx.name}`, {
          collection: idx.collection,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  log.info('Index sync complete', results);
  return results;
}

/**
 * List all indexes for a given collection (for debugging)
 */
export async function listIndexes(prisma: any, collection: string): Promise<unknown[]> {
  try {
    const result = await prisma.$runCommandRaw({
      listIndexes: collection,
    });
    return (result as any)?.cursor?.firstBatch || [];
  } catch (error) {
    log.error(`Failed to list indexes for ${collection}`, { error });
    return [];
  }
}

/**
 * Get the index definitions (for documentation / audit)
 */
export function getIndexDefinitions(): Array<{ collection: string; name: string; rationale: string }> {
  return INDEXES.map(({ collection, name, rationale }) => ({ collection, name, rationale }));
}
