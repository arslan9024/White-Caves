#!/usr/bin/env node

/**
 * Database Setup and Verification Script
 * Helps configure and verify MongoDB connection
 * 
 * Usage:
 *   node scripts/setup-database.js          # Show setup instructions
 *   node scripts/setup-database.js test     # Test current connection
 *   node scripts/setup-database.js status   # Show current status
 */

import { getRecommendedConnectionString, initializeDatabaseConnection, databaseConfig } from '../src/config/databaseConfig.js';

const command = process.argv[2] || 'help';

async function showSetupInstructions() {
  console.log('\n' + '='.repeat(60));
  console.log('🗄️  MongoDB Setup Instructions');
  console.log('='.repeat(60) + '\n');

  const config = getRecommendedConnectionString();

  console.log('Current Environment:', process.env.NODE_ENV || 'development');
  console.log('Current Mode:', config.type || config.error);
  console.log();

  if (config.error) {
    console.log('⚠️  Error:', config.error);
    console.log('💡 Suggestion:', config.suggestion);
    console.log('📝 Example:', config.example);
  } else if (config.setupInstructions) {
    console.log('Setup Instructions:');
    config.setupInstructions.forEach(line => console.log('   ' + line));
  } else {
    console.log('Description:', config.description);
    if (config.note) {
      console.log('Note:', config.note);
    }
  }

  console.log();
}

async function testConnection() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 Testing Database Connection');
  console.log('='.repeat(60) + '\n');

  try {
    const result = await initializeDatabaseConnection();
    
    console.log('Status:', result.success ? '✅ Success' : '❌ Failed');
    console.log('Mode:', result.mode);
    console.log('Message:', result.message);
    
    if (result.connectionString) {
      console.log('Connection String:', result.connectionString);
    }

    if (result.error) {
      console.log('Error:', result.error);
    }

    console.log();
    return result.success;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log();
    return false;
  }
}

async function showStatus() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Database Configuration Status');
  console.log('='.repeat(60) + '\n');

  const info = databaseConfig.getConnectionInfo();

  console.log('Connection Mode:', info.mode);
  console.log('Connected:', info.isConnected ? '✅ Yes' : '❌ No');
  console.log('Environment:', info.environment);
  console.log('Using Testing Mode:', info.usingTestingMode ? '✅ Yes' : '❌ No');
  
  if (info.connectionString) {
    console.log('Connection String:', info.connectionString);
  }

  if (info.lastError) {
    console.log('Last Error:', info.lastError);
  }

  console.log();
}

async function showHelp() {
  console.log('\n' + '='.repeat(60));
  console.log('Database Configuration Helper');
  console.log('='.repeat(60) + '\n');

  console.log('Usage: node scripts/setup-database.js [command]\n');
  console.log('Commands:');
  console.log('  (none/help)   Show setup instructions');
  console.log('  test          Test database connection');
  console.log('  status        Show current configuration status\n');
}

async function main() {
  switch (command) {
    case 'test':
      const success = await testConnection();
      process.exit(success ? 0 : 1);
      break;
    case 'status':
      await showStatus();
      break;
    case 'help':
    case '--help':
    case '-h':
      await showHelp();
      await showSetupInstructions();
      break;
    default:
      await showSetupInstructions();
      break;
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
