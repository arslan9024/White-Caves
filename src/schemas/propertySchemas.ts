import { z } from 'zod';

export const PropertyTypeEnum = z.enum([
  'Villa',
  'Apartment',
  'Townhouse',
  'Penthouse',
  'Off-Plan',
  'Commercial',
]);

export const PropertyStatusEnum = z.enum([
  'Available',
  'Leased',
  'Sold',
  'UnderMaintenance',
  'Reserved',
]);

export const PropertySchema = z.object({
  id: z.string().min(1, 'Property ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  titleArabic: z.string().optional(),
  community: z.string().min(1, 'Community is required'),
  subCommunity: z.string().optional(),
  buildingName: z.string().optional(),
  developer: z.string().min(1, 'Developer is required'),
  propertyType: PropertyTypeEnum,
  priceAED: z.number().positive('Price must be greater than 0'),
  priceUSD: z.number().nonnegative().optional(),
  beds: z.number().int().nonnegative(),
  baths: z.number().int().nonnegative(),
  sqft: z.number().positive(),
  status: PropertyStatusEnum,
  reraPermitNumber: z.string().min(1, 'RERA Permit Number is required'),
  titleDeedNumber: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const PropertyFilterSchema = z.object({
  query: z.string().optional(),
  community: z.string().default('All'),
  propertyType: z.string().default('All'),
  status: z.string().default('All'),
  minPrice: z.number().nonnegative().default(0),
  maxPrice: z.number().positive().default(100000000),
  beds: z.union([z.number(), z.literal('All')]).default('All'),
});

export type Property = z.infer<typeof PropertySchema>;
export type PropertyFilter = z.infer<typeof PropertyFilterSchema>;
