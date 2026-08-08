/**
 * server/graphql/__tests__/graphqlSchema.test.ts — Unit tests for Wave 31 GraphQL API Gateway
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { typeDefs, resolvers, PropertyDataLoader, checkFieldAuth } from '../schema';

describe('Wave 31 GraphQL Schema & Resolvers', () => {
  let loader: PropertyDataLoader;

  beforeEach(() => {
    loader = new PropertyDataLoader();
  });

  it('exports valid typeDefs and resolvers', () => {
    expect(typeDefs).toContain('type Property');
    expect(typeDefs).toContain('type Query');
    expect(resolvers.Query.health()).toBe('OK');
  });

  it('validates RBAC field authorization checks correctly', () => {
    expect(checkFieldAuth('LEVEL_5_MASTER', 'manager')).toBe(true);
    expect(checkFieldAuth('owner', 'agent')).toBe(true);
    expect(checkFieldAuth('agent', 'agent')).toBe(true);
    expect(checkFieldAuth('viewer', 'manager')).toBe(false);
    expect(checkFieldAuth(undefined, 'agent')).toBe(false);
  });

  it('DataLoader clears property cache cleanly', () => {
    expect(loader).toBeDefined();
    loader.clear();
    expect(loader).toBeDefined();
  });

  it('rejects unauthorized user query without sufficient role', async () => {
    await expect(
      resolvers.Query.users(null, {}, { currentUser: { role: 'viewer' } })
    ).rejects.toThrow('UNAUTHORIZED');
  });

  it('rejects unauthorized createProperty mutation without agent role', async () => {
    await expect(
      resolvers.Mutation.createProperty(null, { title: 'Villa', type: 'villa', price: 100, location: 'Dubai' }, { currentUser: {} })
    ).rejects.toThrow('UNAUTHORIZED');
  });
});
