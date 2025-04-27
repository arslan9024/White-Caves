
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userData) => {
  return prisma.user.create({
    data: userData
  });
};

export const getUser = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { properties: true }
  });
};

export const createProperty = async (propertyData) => {
  return prisma.property.create({
    data: propertyData
  });
};

export const getProperties = async () => {
  return prisma.property.findMany({
    include: { user: true }
  });
};

export default prisma;
