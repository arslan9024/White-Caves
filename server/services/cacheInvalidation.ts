/**
 * Cache Invalidation Hooks — Wave 15 Performance Architecture
 * Dispatches targeted cache purges when database mutations occur.
 */

import { cacheService } from './CacheService.js';
import logger from '../utils/logger.js';

export async function invalidatePropertyCache(propertyId?: string): Promise<void> {
  try {
    const patterns = [
      'wc:properties:*',
      'properties:*',
      'wc:dashboard:*',
      'wc:finance:*',
      'wc:departments:*',
      'wc:crm:analytics*',
      'wc:homepage:*',
      'wc:analytics:*',
    ];
    if (propertyId) {
      patterns.push(`wc:property:${propertyId}`);
      patterns.push(`properties:detail:${propertyId}`);
    }
    await cacheService.invalidateMany(patterns);
    logger.info(`[Cache Invalidation] Cleared property cache pools (propertyId: ${propertyId})`);
  } catch (err: unknown) {
    logger.warn('[Cache Invalidation] Property cache invalidation error:', (err as Error).message);
  }
}

export async function invalidateLeadCache(leadId?: string): Promise<void> {
  try {
    const patterns = [
      'wc:leads:*',
      'wc:dashboard:*',
      'wc:departments:*',
      'wc:crm:analytics*',
      'wc:homepage:*',
    ];
    if (leadId) {
      patterns.push(`wc:lead:${leadId}`);
    }
    await cacheService.invalidateMany(patterns);
    logger.info(`[Cache Invalidation] Cleared lead cache pools (leadId: ${leadId})`);
  } catch (err: unknown) {
    logger.warn('[Cache Invalidation] Lead cache invalidation error:', (err as Error).message);
  }
}

export async function invalidateCommissionCache(commissionId?: string): Promise<void> {
  try {
    const patterns = [
      'wc:commissions:*',
      'wc:finance:*',
      'wc:dashboard:*',
      'wc:departments:*',
      'wc:crm:analytics*',
      'wc:agents:*',
      'wc:homepage:*',
    ];
    if (commissionId) {
      patterns.push(`wc:commission:${commissionId}`);
    }
    await cacheService.invalidateMany(patterns);
    logger.info(`[Cache Invalidation] Cleared commission & financial cache pools (commissionId: ${commissionId})`);
  } catch (err: unknown) {
    logger.warn('[Cache Invalidation] Commission cache invalidation error:', (err as Error).message);
  }
}

export async function invalidateAgentCache(agentId?: string): Promise<void> {
  try {
    const patterns = [
      'wc:agents:*',
      'agents:*',
      'wc:dashboard:*',
      'wc:homepage:*',
    ];
    if (agentId) {
      patterns.push(`wc:agent:${agentId}`);
    }
    await cacheService.invalidateMany(patterns);
    logger.info(`[Cache Invalidation] Cleared agent cache pools (agentId: ${agentId})`);
  } catch (err: unknown) {
    logger.warn('[Cache Invalidation] Agent cache invalidation error:', (err as Error).message);
  }
}

export async function invalidateTenantCache(tenantId?: string): Promise<void> {
  try {
    const patterns = [
      'wc:tenants:*',
      'wc:dashboard:*',
      'wc:departments:*',
    ];
    if (tenantId) {
      patterns.push(`wc:tenant:${tenantId}`);
    }
    await cacheService.invalidateMany(patterns);
    logger.info(`[Cache Invalidation] Cleared tenant cache pools (tenantId: ${tenantId})`);
  } catch (err: unknown) {
    logger.warn('[Cache Invalidation] Tenant cache invalidation error:', (err as Error).message);
  }
}

export async function invalidateTransactionCache(transactionId?: string): Promise<void> {
  try {
    const patterns = [
      'wc:transactions:*',
      'wc:finance:*',
      'wc:dashboard:*',
    ];
    if (transactionId) {
      patterns.push(`wc:transaction:${transactionId}`);
    }
    await cacheService.invalidateMany(patterns);
    logger.info(`[Cache Invalidation] Cleared transaction cache pools (transactionId: ${transactionId})`);
  } catch (err: unknown) {
    logger.warn('[Cache Invalidation] Transaction cache invalidation error:', (err as Error).message);
  }
}

export async function invalidateAllCaches(): Promise<void> {
  try {
    await cacheService.clear();
    logger.info('[Cache Invalidation] Cleared all cache pools');
  } catch (err: unknown) {
    logger.warn('[Cache Invalidation] Clear all error:', (err as Error).message);
  }
}
