import { PrismaClient } from '@prisma/client';
import { connectDB as connectMongoose } from '../lib/database.js';

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  prisma ??= new PrismaClient();
  return prisma;
}

export async function connectDB(): Promise<void> {
  const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
  if (!uri || !/^mongodb(\+srv)?:\/\//i.test(uri)) {
    throw new Error('Configure a MongoDB DATABASE_URL before using inventory APIs');
  }
  await connectMongoose(uri);
}
