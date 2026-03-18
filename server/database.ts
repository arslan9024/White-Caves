/**
 * Database Connection Setup
 * MongoDB connection via Prisma ORM
 */

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Check if there's already a prisma instance in development
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }
  prisma = global.prisma;
}

// Global type augmentation for TypeScript
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('📊 Prisma connected to MongoDB');

    // Test connection
    const health = await prisma.$queryRaw`db.adminCommand({ ping: 1 })`;
    console.log('✅ Database health check passed');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

/**
 * Disconnect from database
 */
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log('🔌 Prisma disconnected from MongoDB');
};

export { prisma };
