import '@testing-library/jest-dom'
import { setPropertySourcingModels } from './services/PropertySourcingServices.js';
import { vi } from 'vitest';

// In-memory storage for created objects during testing
const testDb = {
  opportunities: new Map(),
  owners: new Map(),
  properties: new Map(),
};

/**
 * MockQuery - Simulates Mongoose Query chainable pattern
 * Supports .populate(), .lean(), .exec(), and promise methods
 */
class MockQuery {
  constructor(result) {
    this._result = result;
    this._populate = {};
    this._lean = false;
  }

  populate(path) {
    if (typeof path === 'string') {
      this._populate[path] = true;
    } else if (typeof path === 'object') {
      this._populate = { ...this._populate, ...path };
    }
    return this;
  }

  lean() {
    this._lean = true;
    return this;
  }

  exec() {
    return Promise.resolve(this._result);
  }

  then(onFulfilled, onRejected) {
    return Promise.resolve(this._result).then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return Promise.resolve(this._result).catch(onRejected);
  }
}

// Mock MongoDB models for testing
const mockPropertyOpportunityModel = {
  findOne: vi.fn(async (query) => {
    // Look for opportunities matching the query
    for (const [, opportunity] of testDb.opportunities) {
      if (query.sourceReference && opportunity.sourceReference === query.sourceReference) {
        return opportunity;
      }
      if (query._id && opportunity._id === query._id) {
        return opportunity;
      }
    }
    return null;
  }),
  create: vi.fn(async (data) => {
    const id = `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const opportunity = {
      _id: id,
      opportunityId: id,
      ...data,
      save: vi.fn(async function() { return this; }),
    };
    testDb.opportunities.set(id, opportunity);
    return opportunity;
  }),
  findById: vi.fn((id) => {
    const opp = testDb.opportunities.get(id);
    if (!opp) {
      return new MockQuery(null);
    }
    // Create instance with save method
    const oppWithSave = {
      ...opp,
      save: vi.fn(async function() { return this; })
    };
    return new MockQuery(oppWithSave);
  }),
  findByIdAndUpdate: vi.fn(async (id, update, options) => {
    const opp = testDb.opportunities.get(id);
    if (!opp) return null;
    Object.assign(opp, update);
    return opp;
  }),
  countDocuments: vi.fn(async () => testDb.opportunities.size),
  aggregate: vi.fn(async (pipeline) => {
    let totalConfidence = 0;
    let count = 0;
    for (const [, opp] of testDb.opportunities) {
      if (opp.confidenceScore) {
        totalConfidence += opp.confidenceScore;
        count++;
      }
    }
    return [{ _id: null, avg: count > 0 ? totalConfidence / count : 0 }];
  }),
  updateOne: vi.fn(async (filter, update) => {
    for (const [, opportunity] of testDb.opportunities) {
      if (filter._id && opportunity._id === filter._id) {
        Object.assign(opportunity, update.$set || update);
        return { modifiedCount: 1 };
      }
    }
    return { modifiedCount: 0 };
  }),
};

const mockOwnerRelationshipModel = {
  findOne: vi.fn((query) => {
    // Look for owners matching the query
    for (const [, owner] of testDb.owners) {
      if (query['sourceInfo.whatsappNumber'] && owner.sourceInfo?.whatsappNumber === query['sourceInfo.whatsappNumber']) {
        return new MockQuery(owner);
      }
      if (query._id && owner._id === query._id) {
        return new MockQuery(owner);
      }
    }
    return new MockQuery(null);
  }),
  find: vi.fn((query) => {
    const results = [];
    for (const [, owner] of testDb.owners) {
      results.push(owner);
    }
    // Return chainable object that implements both Promise and has methods
    const chainable = {
      select: vi.fn(function() {
        return this;
      }),
      exec: vi.fn(async () => results),
      then: async function(onFulfilled, onRejected) {
        try {
          const result = await Promise.resolve(results);
          return onFulfilled ? onFulfilled(result) : result;
        } catch (err) {
          return onRejected ? onRejected(err) : Promise.reject(err);
        }
      },
      catch: function(onRejected) {
        return Promise.resolve(results).catch(onRejected);
      },
      [Symbol.toStringTag]: 'Promise',
    };
    return chainable;
  }),
  create: vi.fn(async (data) => {
    const id = `owner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const owner = {
      _id: id,
      ...data,
      properties: data.properties || [],
      metrics: data.metrics || {},
      save: vi.fn(async function() { return this; }),
    };
    testDb.owners.set(id, owner);
    return owner;
  }),
  findById: vi.fn((id) => {
    const owner = testDb.owners.get(id);
    if (!owner) {
      return new MockQuery(null);
    }
    const ownerWithSave = {
      ...owner,
      save: vi.fn(async function() { return this; })
    };
    return new MockQuery(ownerWithSave);
  }),
  updateOne: vi.fn(async (filter, update) => {
    for (const [, owner] of testDb.owners) {
      if (filter._id && owner._id === filter._id) {
        Object.assign(owner, update.$set || update);
        return { modifiedCount: 1 };
      }
    }
    return { modifiedCount: 0 };
  }),
};

const mockInventoryPropertyModel = {
  findOne: vi.fn(() => new MockQuery(null)),
  create: vi.fn(async (data) => {
    const id = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const property = {
      _id: id,
      ...data,
      save: vi.fn(async function() { return this; }),
    };
    testDb.properties.set(id, property);
    return property;
  }),
  findById: vi.fn((id) => {
    const property = testDb.properties.get(id);
    if (!property) {
      return new MockQuery(null);
    }
    const propWithSave = {
      ...property,
      save: vi.fn(async function() { return this; })
    };
    return new MockQuery(propWithSave);
  }),
};

// Initialize models with mocks
setPropertySourcingModels({
  PropertyOpportunity: mockPropertyOpportunityModel,
  OwnerRelationship: mockOwnerRelationshipModel,
  InventoryProperty: mockInventoryPropertyModel,
});

// Export for use in tests
export {
  mockPropertyOpportunityModel,
  mockOwnerRelationshipModel,
  mockInventoryPropertyModel,
  testDb,
};
