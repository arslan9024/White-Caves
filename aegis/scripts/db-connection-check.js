import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.staging first, then .env
dotenv.config({ path: '.env.staging' });
dotenv.config({ path: '.env' });

const __dirname = path.resolve();

/**
 * Database Connection Check Script
 * Validates staging MongoDB connection, tests CRUD operations, verifies collections
 * Usage: node scripts/db-connection-check.js
 */

async function checkDatabaseConnection() {
  const startTime = new Date();
  const results = {
    connectionStatus: false,
    collectionsStatus: false,
    crudStatus: false,
    timestamp: new Date().toISOString(),
    errors: [],
    connectionMethod: 'unknown'
  };

  try {
    // Try multiple connection strategies in order
    let mongoUri = null;
    let connectionMethod = 'unknown';

    // Strategy 1: Check environment variable (.env.staging or .env)
    mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      connectionMethod = 'environment (.env.staging)';
    } 
    // Strategy 2: Check for Atlas production URI pattern
    else if (process.env.MONGODB_ATLAS_URI) {
      mongoUri = process.env.MONGODB_ATLAS_URI;
      connectionMethod = 'environment (.env - MongoDB Atlas)';
    }
    // Strategy 3: Check for local development MongoDB
    else if (process.env.MONGODB_LOCAL) {
      mongoUri = process.env.MONGODB_LOCAL;
      connectionMethod = 'environment (local development)';
    }
    // Strategy 4: Default to local if nothing else available
    else {
      mongoUri = 'mongodb://localhost:27017/white_caves_test';
      connectionMethod = 'fallback (local development)';
    }

    if (!mongoUri) {
      throw new Error('No MongoDB URI found. Please configure MONGODB_URI in .env.staging or .env');
    }

    results.connectionMethod = connectionMethod;

    console.log('🔍 Checking MongoDB connection...');
    console.log(`📍 Connection Method: ${connectionMethod}`);
    console.log(`📍 Connection URI: ${mongoUri.substring(0, 50)}...${mongoUri.substring(mongoUri.length - 15)}`);

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    results.connectionStatus = true;
    console.log('✅ MongoDB connection successful');

    // Check database and collections
    console.log('\n🔍 Checking collections...');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    const requiredCollections = [
      'owners',
      'inventoryproperties',
      'leads',
      'whatsappcontacts',
      'contracts'
    ];

    const missingCollections = requiredCollections.filter(
      col => !collectionNames.some(c => c.toLowerCase().includes(col.toLowerCase()))
    );

    if (missingCollections.length === 0) {
      results.collectionsStatus = true;
      console.log(`✅ All required collections accessible (${collectionNames.length} collections found)`);
      collectionNames.forEach(col => console.log(`   └─ ${col}`));
    } else {
      console.warn(`⚠️  Missing collections: ${missingCollections.join(', ')}`);
      console.log(`   Available collections: ${collectionNames.join(', ')}`);
    }

    // Test basic CRUD operations
    console.log('\n🔍 Testing CRUD operations...');
    const testCollection = db.collection('test_connection_check');

    // Create
    const testDoc = { 
      testData: `Connection check at ${new Date().toISOString()}`,
      source: 'test'
    };
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`   ✅ Create: Inserted test document (ID: ${insertResult.insertedId})`);

    // Read
    const readResult = await testCollection.findOne({ _id: insertResult.insertedId });
    if (readResult) {
      console.log(`   ✅ Read: Retrieved test document successfully`);
    } else {
      throw new Error('Read operation failed');
    }

    // Update
    const updateResult = await testCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { updated: true, updatedAt: new Date() } }
    );
    if (updateResult.modifiedCount > 0) {
      console.log(`   ✅ Update: Modified test document successfully`);
    }

    // Delete
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId });
    if (deleteResult.deletedCount > 0) {
      console.log(`   ✅ Delete: Removed test document successfully`);
    }

    results.crudStatus = true;

    // Connection statistics
    console.log('\n📊 Connection Statistics:');
    console.log(`   └─ Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`   └─ Database: ${mongoose.connection.name}`);
    console.log(`   └─ Host: ${mongoose.connection.host}`);
    console.log(`   └─ Method: ${connectionMethod}`);

  } catch (error) {
    results.errors.push({
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();

    // Save results
    const duration = new Date() - startTime;
    results.duration = `${duration}ms`;

    const reportPath = path.join(__dirname, 'logs', 'db-connection-check.json');
    const logsDir = path.dirname(reportPath);
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    // Print summary
    console.log('\n📋 Summary:');
    console.log(`   Connection: ${results.connectionStatus ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Collections: ${results.collectionsStatus ? '✅ PASS' : '⚠️  WARNING'}`);
    console.log(`   CRUD Operations: ${results.crudStatus ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Duration: ${results.duration}`);
    console.log(`\n📄 Report saved to: logs/db-connection-check.json`);

    // Exit with appropriate code
    if (!results.connectionStatus || !results.crudStatus) {
      process.exit(1);
    }
  }
}

checkDatabaseConnection();
