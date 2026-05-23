// Database initialization script to create text indexes for full-text search
import Property from '../models/Property.js';
import Lead from '../models/Lead.js';
import Agent from '../models/Agent.js';

/**
 * Create full-text search indexes for properties
 */
export async function createPropertyIndexes() {
  try {
    console.log('[Database] Creating property text index...');

    // Create compound text index for full-text search
    await Property.collection.createIndex({
      title: 'text',
      description: 'text',
      area: 'text',
      propertyType: 'text',
      amenities: 'text'
    });

    console.log('[Database] ✓ Property text index created');

    // Create individual field indexes for fast queries
    await Property.collection.createIndex({ area: 1, status: 1 });
    await Property.collection.createIndex({ propertyType: 1, status: 1 });
    await Property.collection.createIndex({ price: 1 });
    await Property.collection.createIndex({ bedrooms: 1 });
    await Property.collection.createIndex({ bathrooms: 1 });
    await Property.collection.createIndex({ createdAt: -1 });
    await Property.collection.createIndex({ status: 1 });

    console.log('[Database] ✓ Property field indexes created');
  } catch (err) {
    console.error('[Database] Error creating property indexes:', err);
  }
}

/**
 * Create full-text search indexes for leads
 */
export async function createLeadIndexes() {
  try {
    console.log('[Database] Creating lead text index...');

    await Lead.collection.createIndex({
      name: 'text',
      email: 'text',
      phone: 'text',
      'propertyInterest.title': 'text'
    });

    console.log('[Database] ✓ Lead text index created');

    // Field indexes
    await Lead.collection.createIndex({ status: 1, stage: 1 });
    await Lead.collection.createIndex({ score: -1 });
    await Lead.collection.createIndex({ source: 1 });
    await Lead.collection.createIndex({ assignedAgent: 1 });
    await Lead.collection.createIndex({ createdAt: -1 });

    console.log('[Database] ✓ Lead field indexes created');
  } catch (err) {
    console.error('[Database] Error creating lead indexes:', err);
  }
}

/**
 * Create full-text search indexes for agents
 */
export async function createAgentIndexes() {
  try {
    console.log('[Database] Creating agent text index...');

    await Agent.collection.createIndex({
      name: 'text',
      email: 'text',
      bio: 'text',
      specialization: 'text'
    });

    console.log('[Database] ✓ Agent text index created');

    // Field indexes
    await Agent.collection.createIndex({ status: 1 });
    await Agent.collection.createIndex({ rating: -1 });
    await Agent.collection.createIndex({ email: 1 });

    console.log('[Database] ✓ Agent field indexes created');
  } catch (err) {
    console.error('[Database] Error creating agent indexes:', err);
  }
}

/**
 * Initialize all indexes
 */
export async function initializeIndexes() {
  console.log('[Database] Initializing database indexes...');
  await createPropertyIndexes();
  await createLeadIndexes();
  await createAgentIndexes();
  console.log('[Database] ✓ All indexes initialized');
}

export default initializeIndexes;
