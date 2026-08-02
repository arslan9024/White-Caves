import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

/**
 * Database Restore Script
 * Rolls back staging DB to pre-test state from backup
 * Usage: node scripts/restore-staging-db.js --backup [timestamp]
 * Example: node scripts/restore-staging-db.js --backup 2026-01-20T09-30-45-123Z
 */

async function restoreStagingDatabase() {
  const args = process.argv.slice(2);
  const backupArg = args.indexOf('--backup');
  
  if (backupArg === -1) {
    console.log('Usage: node scripts/restore-staging-db.js --backup [timestamp]');
    console.log('Example: node scripts/restore-staging-db.js --backup 2026-01-20T09-30-45-123Z');
    console.log('\nAvailable backups:');
    
    const backupsIndex = path.join(__dirname, 'backups', 'backups.json');
    if (fs.existsSync(backupsIndex)) {
      const backupsList = JSON.parse(fs.readFileSync(backupsIndex, 'utf8'));
      backupsList.forEach(backup => {
        console.log(`  ${backup.timestamp} - ${backup.documents} documents (${backup.size})`);
      });
    } else {
      console.log('  No backups found');
    }
    process.exit(1);
  }

  const backupTimestamp = args[backupArg + 1];
  const backupDir = path.join(__dirname, 'backups', `backup-${backupTimestamp}`);

  const restoreResult = {
    backupTimestamp,
    backupDir,
    status: 'pending',
    restoredCollections: {},
    errors: [],
    duration: null
  };

  const startTime = new Date();

  try {
    console.log('🔄 Starting database restore...');
    console.log(`⏰ Restoring from backup: ${backupTimestamp}`);

    // Verify backup exists
    if (!fs.existsSync(backupDir)) {
      throw new Error(`Backup directory not found: ${backupDir}`);
    }

    // Get MongoDB URI (try multiple sources)
    let mongoUri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI || process.env.MONGODB_LOCAL;
    if (!mongoUri) {
      mongoUri = 'mongodb://localhost:27017/white_caves_test';
    }
    
    restoreResult.connectionSource = mongoUri.includes('localhost') ? 'local' : 'Atlas';

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });

    console.log('✅ Connected to MongoDB');

    // Get database instance
    const db = mongoose.connection.db;

    // Get list of backup files (excluding metadata)
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.json') && file !== 'metadata.json')
      .map(file => file.replace('.json', ''));

    console.log(`\n🔍 Found ${backupFiles.length} collections in backup`);

    // Restore each collection
    for (const collectionName of backupFiles) {
      try {
        const backupFile = path.join(backupDir, `${collectionName}.json`);
        const documents = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

        // Clear existing collection
        const collection = db.collection(collectionName);
        const deleteResult = await collection.deleteMany({});
        console.log(`   ℹ️  ${collectionName}: Cleared ${deleteResult.deletedCount} existing documents`);

        // Insert backup documents
        if (documents.length > 0) {
          const insertResult = await collection.insertMany(documents);
          restoreResult.restoredCollections[collectionName] = {
            restoredDocuments: insertResult.insertedCount,
            status: 'restored'
          };
          console.log(`   ✅ ${collectionName}: Restored ${insertResult.insertedCount} documents`);
        } else {
          restoreResult.restoredCollections[collectionName] = {
            restoredDocuments: 0,
            status: 'empty'
          };
          console.log(`   ⚠️  ${collectionName}: Backup was empty`);
        }
      } catch (error) {
        console.warn(`   ❌ ${collectionName}: Restore failed - ${error.message}`);
        restoreResult.errors.push({
          collection: collectionName,
          error: error.message
        });
      }
    }

    // Verify restoration
    console.log('\n🔍 Verifying restoration...');
    let totalRestoredDocuments = 0;
    
    for (const collectionName of backupFiles) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments({});
      totalRestoredDocuments += count;
      console.log(`   ✅ ${collectionName}: ${count} documents`);
    }

    restoreResult.status = 'success';
    restoreResult.totalRestoredDocuments = totalRestoredDocuments;

    console.log(`\n✅ Restoration completed successfully`);
    console.log(`📊 Total documents restored: ${totalRestoredDocuments}`);

  } catch (error) {
    restoreResult.status = 'failed';
    restoreResult.errors.push({
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    console.error('❌ Restore failed:', error.message);
  } finally {
    await mongoose.disconnect();

    // Save result report
    const reportPath = path.join(__dirname, 'logs', 'restore-result.json');
    const logsDir = path.dirname(reportPath);
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    restoreResult.duration = `${new Date() - startTime}ms`;
    fs.writeFileSync(reportPath, JSON.stringify(restoreResult, null, 2));

    console.log(`\n📋 Restore Report:`);
    console.log(`   Status: ${restoreResult.status.toUpperCase()}`);
    console.log(`   Backup: ${backupTimestamp}`);
    console.log(`   Duration: ${restoreResult.duration}`);
    console.log(`   Report: logs/restore-result.json`);

    process.exit(restoreResult.status === 'success' ? 0 : 1);
  }
}

restoreStagingDatabase();
