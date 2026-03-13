
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userData: Record<string, unknown>) => {
  return prisma.user.create({
    data: userData as any
  });
};

export const getUser = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { properties: true }
  });
};

export const createProperty = async (propertyData: Record<string, unknown>) => {
  return prisma.property.create({
    data: propertyData as any
  });
};

export const getProperties = async () => {
  return prisma.property.findMany({
    include: { user: true }
  });
};

export default prisma;
