/**
 * Database Connection Configuration Helper
 * Supports MongoDB Atlas, Local MongoDB, and In-Memory for Testing
 */

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
const MONGO_LOCAL = process.env.MONGODB_LOCAL || 'mongodb://localhost:27017/white_caves_test';
const USE_TESTING_MODE = process.env.NODE_ENV === 'test' || process.env.USE_TESTING_MODE === 'true';

/**
 * Database Connection Status
 */
export class DatabaseConfig {
  constructor() {
    this.isConnected = false;
    this.connectionString = null;
    this.connectionMode = 'disconnected'; // 'atlas', 'local', 'memory', 'disconnected'
    this.lastError = null;
  }

  /**
   * Get the appropriate MongoDB connection string
   * Priority: Atlas > Local > Memory (for testing)
   */
  getConnectionString() {
    if (MONGO_URI) {
      this.connectionString = MONGO_URI;
      this.connectionMode = 'atlas';
      return MONGO_URI;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('MongoDB URI not configured for production. Set MONGODB_URI environment variable.');
    }

    // Try local MongoDB for development
    if (process.env.NODE_ENV === 'development') {
      this.connectionString = MONGO_LOCAL;
      this.connectionMode = 'local';
      return MONGO_LOCAL;
    }

    // Use in-memory for testing
    this.connectionMode = 'memory';
    return null;
  }

  /**
   * Check if using in-memory mode (testing)
   */
  isMemoryMode() {
    return this.connectionMode === 'memory' || USE_TESTING_MODE;
  }

  /**
   * Get connection information
   */
  getConnectionInfo() {
    return {
      mode: this.connectionMode,
      isConnected: this.isConnected,
      connectionString: this.connectionString ? this.maskConnectionString(this.connectionString) : null,
      environment: process.env.NODE_ENV || 'development',
      usingTestingMode: this.isMemoryMode(),
      lastError: this.lastError
    };
  }

  /**
   * Mask sensitive information in connection string
   */
  maskConnectionString(connStr) {
    if (!connStr) return null;
    return connStr.replace(/:[^:@]+@/, ':****@');
  }

  /**
   * Reset configuration
   */
  reset() {
    this.isConnected = false;
    this.connectionString = null;
    this.connectionMode = 'disconnected';
    this.lastError = null;
  }
}

/**
 * Singleton instance
 */
export const databaseConfig = new DatabaseConfig();

/**
 * Verify MongoDB connection (when using real database)
 */
export async function verifyMongoDBConnection(mongooseOrClient) {
  if (!mongooseOrClient) {
    throw new Error('Mongoose or MongoDB client required for connection verification');
  }

  try {
    // For Mongoose
    if (mongooseOrClient.connection) {
      const state = mongooseOrClient.connection.readyState;
      // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
      databaseConfig.isConnected = state === 1;
      return databaseConfig.isConnected;
    }

    // For MongoDB client
    if (mongooseOrClient.topology) {
      databaseConfig.isConnected = mongooseOrClient.topology.isConnected();
      return databaseConfig.isConnected;
    }

    return false;
  } catch (error) {
    databaseConfig.lastError = error.message;
    databaseConfig.isConnected = false;
    return false;
  }
}

/**
 * Get recommended MongoDB connection string
 * Returns the connection string to use based on environment
 */
export function getRecommendedConnectionString(environment = 'development') {
  const envMode = process.env.NODE_ENV || environment;

  if (envMode === 'production' && !MONGO_URI) {
    return {
      error: 'MongoDB URI not configured for production',
      suggestion: 'Set MONGODB_URI environment variable',
      example: 'MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/white_caves'
    };
  }

  if (MONGO_URI) {
    return {
      type: 'atlas',
      connectionString: MONGO_URI,
      masked: databaseConfig.maskConnectionString(MONGO_URI),
      description: 'Using MongoDB Atlas'
    };
  }

  if (envMode === 'development' || envMode === 'test') {
    return {
      type: 'local',
      connectionString: MONGO_LOCAL,
      description: 'Using Local MongoDB',
      setupInstructions: [
        '1. Install MongoDB locally or use Docker:',
        '   docker run -d -p 27017:27017 --name mongodb mongo:latest',
        '2. Verify connection:',
        '   mongosh mongodb://localhost:27017',
        '3. Run tests:',
        '   npm test'
      ]
    };
  }

  return {
    type: 'memory',
    connectionString: null,
    description: 'Using In-Memory Database (Testing Mode)',
    note: 'Data will not persist. Only for testing purposes.'
  };
}

/**
 * Initialize database connection based on configuration
 * Returns connection info and models (or mock models for testing)
 */
export async function initializeDatabaseConnection() {
  try {
    const connString = databaseConfig.getConnectionString();

    // In testing mode, use mock models
    if (databaseConfig.isMemoryMode()) {
      
      const { createMockModels } = await import('../test/utils/mockDatabase.js');
      return {
        success: true,
        mode: 'memory',
        models: createMockModels(),
        message: 'In-memory database initialized successfully'
      };
    }

    // For production/development with real MongoDB
    if (connString) {
      // This would be called by the actual server initialization code
      // Here we just return the configuration
      return {
        success: true,
        mode: databaseConfig.connectionMode,
        connectionString: databaseConfig.maskConnectionString(connString),
        message: `Ready to connect to MongoDB (${databaseConfig.connectionMode})`
      };
    }

    throw new Error('Unable to determine database configuration');
  } catch (error) {
    databaseConfig.lastError = error.message;
    
    return {
      success: false,
      mode: 'error',
      error: error.message,
      message: 'Database initialization failed'
    };
  }
}

export default {
  DatabaseConfig,
  databaseConfig,
  verifyMongoDBConnection,
  getRecommendedConnectionString,
  initializeDatabaseConnection
};
