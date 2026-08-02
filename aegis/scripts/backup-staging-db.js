import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

// Load environment variables from .env.staging first, then .env
dotenv.config({ path: '.env.staging' });
dotenv.config({ path: '.env' });

const execPromise = promisify(exec);
const __dirname = path.resolve();

/**
 * Database Backup Script
 * Creates snapshot of staging MongoDB before test run
 * Usage: node scripts/backup-staging-db.js
 */

async function backupStagingDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, 'backups', `backup-${timestamp}`);
  const startTime = new Date();

  const backupResult = {
    timestamp,
    status: 'pending',
    backupDir,
    collections: {},
    errors: [],
    duration: null
  };

  try {
    console.log('🔄 Starting database backup...');
    console.log(`⏰ Timestamp: ${timestamp}`);
    console.log(`📁 Backup directory: ${backupDir}`);

    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('✅ Backup directory created');

    // Get MongoDB URI (try multiple sources)
    let mongoUri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI || process.env.MONGODB_LOCAL;
    if (!mongoUri) {
      mongoUri = 'mongodb://localhost:27017/white_caves_test';
    }
    
    backupResult.connectionSource = mongoUri.includes('localhost') ? 'local' : 'Atlas';

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });

    console.log('✅ Connected to MongoDB');

    // Get database instance
    const db = mongoose.connection.db;

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n🔍 Found ${collections.length} collections to backup:`);

    // Backup each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      
      // Skip system collections
      if (collectionName.startsWith('system.')) {
        continue;
      }

      try {
        const col = db.collection(collectionName);
        const documents = await col.find({}).toArray();
        
        const backupFile = path.join(backupDir, `${collectionName}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(documents, null, 2));

        backupResult.collections[collectionName] = {
          documentCount: documents.length,
          size: fs.statSync(backupFile).size,
          file: backupFile
        };

        console.log(`   ✅ ${collectionName}: ${documents.length} documents (${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB)`);
      } catch (error) {
        console.warn(`   ⚠️  ${collectionName}: Failed - ${error.message}`);
        backupResult.errors.push({
          collection: collectionName,
          error: error.message
        });
      }
    }

    // Create backup metadata
    const metadata = {
      timestamp,
      mongoUri: mongoUri.substring(0, 50) + '...',
      collections: backupResult.collections,
      createdAt: new Date().toISOString(),
      createdAtUnix: Math.floor(Date.now() / 1000)
    };

    const metadataFile = path.join(backupDir, 'metadata.json');
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    // Calculate backup size
    const backupSize = fs.readdirSync(backupDir).reduce((total, file) => {
      return total + fs.statSync(path.join(backupDir, file)).size;
    }, 0);

    backupResult.status = 'success';
    backupResult.backupSize = `${(backupSize / 1024 / 1024).toFixed(2)} MB`;
    backupResult.totalDocuments = Object.values(backupResult.collections)
      .reduce((sum, col) => sum + col.documentCount, 0);

    console.log(`\n✅ Backup created successfully`);
    console.log(`📊 Total size: ${backupResult.backupSize}`);
    console.log(`📄 Total documents: ${backupResult.totalDocuments}`);

    // Save backup record
    const backupsIndex = path.join(__dirname, 'backups', 'backups.json');
    let backupsList = [];
    if (fs.existsSync(backupsIndex)) {
      backupsList = JSON.parse(fs.readFileSync(backupsIndex, 'utf8'));
    }
    backupsList.push({
      timestamp,
      backupDir,
      size: backupResult.backupSize,
      documents: backupResult.totalDocuments,
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(backupsIndex, JSON.stringify(backupsList, null, 2));

    console.log(`✅ Backup record saved`);

  } catch (error) {
    backupResult.status = 'failed';
    backupResult.errors.push({
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    console.error('❌ Backup failed:', error.message);
  } finally {
    await mongoose.disconnect();

    // Save result report
    const reportPath = path.join(__dirname, 'logs', 'backup-result.json');
    const logsDir = path.dirname(reportPath);
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    backupResult.duration = `${new Date() - startTime}ms`;
    fs.writeFileSync(reportPath, JSON.stringify(backupResult, null, 2));

    console.log(`\n📋 Backup Report:`);
    console.log(`   Status: ${backupResult.status.toUpperCase()}`);
    console.log(`   Location: ${backupDir}`);
    console.log(`   Duration: ${backupResult.duration}`);
    console.log(`   Report: logs/backup-result.json`);

    process.exit(backupResult.status === 'success' ? 0 : 1);
  }
}

backupStagingDatabase();
